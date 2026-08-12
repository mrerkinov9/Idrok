const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const gardenCatalog = require('./garden-catalog.js');
const gardenCore = require('./garden-core.js');

const root = __dirname;
const dataDir = process.env.IDROK_DATA_DIR ? path.resolve(process.env.IDROK_DATA_DIR) : path.join(root, 'data');
const usersFile = path.join(dataDir, 'idrok-users.json');
const sessionsFile = path.join(dataDir, 'idrok-sessions.json');
const sessionLifetimeMs = 30 * 24 * 60 * 60 * 1000;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, {recursive:true});
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]\n');
if (!fs.existsSync(sessionsFile)) fs.writeFileSync(sessionsFile, '{}\n');

const readUsers = () => { try { return JSON.parse(fs.readFileSync(usersFile, 'utf8')); } catch { return []; } };
const writeUsers = users => fs.writeFileSync(usersFile, `${JSON.stringify(users, null, 2)}\n`);
const readSessions = () => { try { return JSON.parse(fs.readFileSync(sessionsFile, 'utf8')); } catch { return {}; } };
const writeSessions = sessions => fs.writeFileSync(sessionsFile, `${JSON.stringify(sessions, null, 2)}\n`);
const sendJson = (res, status, payload) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(payload)); };
const readBody = req => new Promise((resolve, reject) => { let body=''; req.on('data', chunk => { body += chunk; if (body.length > 1e6) reject(new Error('Juda katta so‘rov')); }); req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('JSON noto‘g‘ri')); } }); req.on('error', reject); });
const hashPassword = (password, salt) => crypto.scryptSync(password, salt, 64).toString('hex');
const publicUser = user => ({
  id:user.id,
  name:user.name,
  email:user.email,
  role:user.role==='admin'?'admin':'student',
  unlimitedImpulse:user.role==='admin',
  impulse:user.role==='admin'?999999999:(Number(user.impulse)||0),
  lifetimeImpulse:user.role==='admin'?999999999:Math.max(Number(user.lifetimeImpulse)||0, Number(user.impulse)||0),
  score:Number(user.score)||0,
  completed:user.completed||[],
  theme:user.theme||'light',
  garden:gardenCore.publicGarden(user.garden),
  physics7State:user.physics7State||null,
  physics8State:user.physics8State||null,
  physicsState:user.physicsState||null,
  physics10State:user.physics10State||null,
  physics11State:user.physics11State||null,
});
const tokenFor = user => {
  const token=crypto.randomBytes(32).toString('hex'), now=Date.now(), sessions=readSessions();
  for(const [key,session] of Object.entries(sessions)) if(!session || Number(session.expiresAt)<=now) delete sessions[key];
  sessions[token]={userId:user.id,createdAt:now,expiresAt:now+sessionLifetimeMs};
  writeSessions(sessions);
  return token;
};
const authToken = req => (req.headers.authorization||'').replace(/^Bearer\s+/i,'');
const authUser = req => {
  const token=authToken(req), sessions=readSessions(), session=sessions[token];
  if(!session)return null;
  if(Number(session.expiresAt)<=Date.now()){delete sessions[token];writeSessions(sessions);return null;}
  return readUsers().find(user=>user.id===session.userId&&user.disabled!==true)||null;
};
const isAdmin = user => user?.role==='admin';
const displayImpulse = user => isAdmin(user)?999999999:(Number(user?.impulse)||0);
const isLocalRequest = req => ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
const blankCourseState = version => ({version,completed:[],scores:{},current:'l1',stages:{},startedAt:Date.now()});
const createUserRecord = ({name,email,password,role='student'}) => {
  const salt=crypto.randomBytes(16).toString('hex');
  return {id:crypto.randomUUID(),name,email,salt,passwordHash:hashPassword(password,salt),role,disabled:false,impulse:role==='admin'?0:50,lifetimeImpulse:role==='admin'?0:50,score:0,completed:[],theme:'light',garden:gardenCore.createGarden(),physics7State:blankCourseState(1),physics8State:blankCourseState(1),physicsState:blankCourseState(4),physics10State:blankCourseState(20),physics11State:blankCourseState(1),createdAt:new Date().toISOString()};
};

function adminUserView(user){
  const garden=gardenCore.publicGarden(user.garden),counts={grade7:user.physics7State?.completed?.length||0,grade8:user.physics8State?.completed?.length||0,grade9:user.physicsState?.completed?.length||0,grade10:user.physics10State?.completed?.length||0,grade11:user.physics11State?.completed?.length||0};
  return {id:user.id,name:user.name,email:user.email,role:user.role==='admin'?'admin':'student',disabled:user.disabled===true,impulse:Number(user.impulse)||0,lifetimeImpulse:Number(user.lifetimeImpulse)||0,score:Number(user.score)||0,completed:Number(user.completed?.length)||0,courseProgress:counts,garden:{level:garden.level,plants:garden.stats?.plantsGrown||0,focusMinutes:garden.focusMinutes||0,beautyScore:garden.beautyScore||0},createdAt:user.createdAt,updatedAt:user.updatedAt||user.createdAt};
}

function mergeCourseState(previous, incoming) {
  if(!incoming || typeof incoming!=='object')return previous||null;
  const before=previous&&typeof previous==='object'?previous:{};
  const completed=[...new Set([...(Array.isArray(before.completed)?before.completed:[]),...(Array.isArray(incoming.completed)?incoming.completed:[])])].slice(0,500);
  const scores={...(before.scores||{})};
  for(const [id,value] of Object.entries(incoming.scores||{}))scores[id]=Math.max(Number(scores[id])||0,Number(value)||0);
  const stages={...(before.stages||{})};
  for(const [lessonId,value] of Object.entries(incoming.stages||{})){
    const old=stages[lessonId]&&typeof stages[lessonId]==='object'?stages[lessonId]:{};
    stages[lessonId]={...old,...value};
    for(const key of Object.keys(old))if(old[key]===true)stages[lessonId][key]=true;
  }
  return {...before,...incoming,version:Math.max(Number(before.version)||0,Number(incoming.version)||0),completed,scores,stages,current:typeof incoming.current==='string'?incoming.current:(before.current||'l1')};
}

function failExpiredFocus(garden, now = Date.now()) {
  const focus = garden.focus;
  if (!focus || now - focus.lastHeartbeatAt <= 90000) return false;
  const plant = garden.items.find(item => item.id === focus.plantId);
  if (plant) {
    plant.state = 'wilted';
    plant.progress = Math.min(0.95, focus.activeSeconds / focus.durationSeconds);
  }
  garden.stats.failedSessions += 1;
  garden.focus = null;
  garden.updatedAt = new Date(now).toISOString();
  return true;
}

function completeFocus(garden, now = Date.now()) {
  const focus = garden.focus;
  if (!focus || focus.activeSeconds < focus.durationSeconds) return false;
  const plant = garden.items.find(item => item.id === focus.plantId);
  if (plant) {
    plant.state = 'mature';
    plant.progress = 1;
    plant.maturedAt = new Date(now).toISOString();
  }
  garden.stats.completedSessions += 1;
  garden.stats.plantsGrown += 1;
  garden.focus = null;
  garden.updatedAt = new Date(now).toISOString();
  return true;
}

const gardenMissions = [
  {id:'first-bloom',title:'Birinchi gullash',description:'Bitta o‘simlikni to‘liq o‘stiring.',reward:30,test:garden=>garden.items.some(item=>item.state==='mature')},
  {id:'five-colors',title:'Ranglar uyg‘unligi',description:'5 xil bog‘ elementidan foydalaning.',reward:75,test:garden=>new Set(garden.items.map(item=>item.catalogId)).size>=5},
  {id:'focus-hour',title:'Bir soatlik bog‘bon',description:'Jami 60 daqiqa fokus qiling.',reward:80,test:garden=>gardenCore.focusMinutes(garden)>=60},
  {id:'garden-designer',title:'Bog‘ dizayneri',description:'Bog‘ingizga 20 ta element joylashtiring.',reward:100,test:garden=>garden.items.length>=20},
];
const publicMissions = garden => {
  const claimed=new Set(garden.stats?.missionsClaimed||[]);
  return gardenMissions.map(({test,...mission})=>({...mission,ready:test(garden),claimed:claimed.has(mission.id)}));
};
const worldPlotPosition = index => {
  if (index === 0) return {x:0,z:0};
  const ring=Math.ceil((Math.sqrt(index+1)-1)/2),side=ring*2,offset=index-(side-1)*(side-1);
  const edge=Math.floor(offset/side),step=offset%side,distance=ring*82;
  if(edge===0)return{x:-distance+step*82,z:-distance};
  if(edge===1)return{x:distance,z:-distance+step*82};
  if(edge===2)return{x:distance-step*82,z:distance};
  return{x:-distance,z:distance-step*82};
};

function sendCompletionEmail(user, subject, html) {
  const key=process.env.RESEND_API_KEY, from=process.env.IDROK_FROM_EMAIL;
  if (!key || !from) return Promise.resolve({status:'not_configured'});
  const payload=JSON.stringify({from,to:[user.email],subject,html});
  return new Promise(resolve => {
    const request=https.request({hostname:'api.resend.com',path:'/emails',method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload)}}, response => { let body=''; response.on('data',chunk=>body+=chunk); response.on('end',()=>resolve({status:response.statusCode<300?'sent':'failed',provider:'resend',detail:body.slice(0,300)})); });
    request.on('error', error=>resolve({status:'failed',detail:error.message})); request.end(payload);
  });
}

async function api(req, res, pathname) {
  try {
    if (pathname==='/api/health' && req.method==='GET') {
      return sendJson(res,200,{ok:true,service:'Idrok',time:new Date().toISOString()});
    }
    if (pathname==='/api/admin/bootstrap-status' && req.method==='GET') {
      return sendJson(res,200,{needsSetup:!readUsers().some(isAdmin)});
    }
    if (pathname==='/api/admin/bootstrap' && req.method==='POST') {
      if(!isLocalRequest(req))return sendJson(res,403,{error:'Birinchi admin faqat ushbu kompyuterda yaratiladi.'});
      const users=readUsers();if(users.some(isAdmin))return sendJson(res,409,{error:'Admin allaqachon yaratilgan.'});
      const {name,email,password}=await readBody(req),cleanName=String(name||'').trim(),cleanEmail=String(email||'').trim().toLowerCase();
      if(cleanName.length<3||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)||String(password||'').length<10)return sendJson(res,400,{error:'Ism, email va kamida 10 belgili kuchli parol kiriting.'});
      if(users.some(item=>item.email===cleanEmail))return sendJson(res,409,{error:'Bu email bilan hisob mavjud.'});
      const admin=createUserRecord({name:cleanName,email:cleanEmail,password:String(password),role:'admin'});users.push(admin);writeUsers(users);return sendJson(res,201,{token:tokenFor(admin),user:publicUser(admin)});
    }
    if (pathname==='/api/register' && req.method==='POST') {
      const {name,email,password}=await readBody(req); const cleanEmail=String(email||'').trim().toLowerCase(); const cleanName=String(name||'').trim();
      if (cleanName.length<3 || !/^\S+@\S+\.\S+$/.test(cleanEmail) || String(password||'').length<6) return sendJson(res,400,{error:'Ism, email yoki parol talabga mos emas.'});
      const users=readUsers(); if (users.some(user=>user.email===cleanEmail)) return sendJson(res,409,{error:'Bu email bilan hisob mavjud.'});
      const user=createUserRecord({name:cleanName,email:cleanEmail,password:String(password)});
      users.push(user); writeUsers(users); return sendJson(res,201,{token:tokenFor(user),user:publicUser(user)});
    }
    if (pathname==='/api/login' && req.method==='POST') {
      const {email,password}=await readBody(req); const user=readUsers().find(item=>item.email===String(email||'').trim().toLowerCase());
      if (!user || !crypto.timingSafeEqual(Buffer.from(user.passwordHash,'hex'),Buffer.from(hashPassword(String(password||''),user.salt),'hex'))) return sendJson(res,401,{error:'Email yoki parol noto‘g‘ri.'});
      if(user.disabled===true)return sendJson(res,403,{error:'Bu hisob vaqtincha to‘xtatilgan. Administrator bilan bog‘laning.'});
      return sendJson(res,200,{token:tokenFor(user),user:publicUser(user)});
    }
    if (pathname==='/api/logout' && req.method==='POST') {
      const token=authToken(req), sessions=readSessions();
      if(token&&sessions[token]){delete sessions[token];writeSessions(sessions);}
      return sendJson(res,200,{ok:true});
    }
    if (pathname==='/api/leaderboard' && req.method==='GET') {
      const leaders=readUsers().filter(user=>!isAdmin(user)&&user.disabled!==true).map(user => {
        const garden=gardenCore.normalizeGarden(user.garden);
        const gardenPoints=gardenCore.gardenPoints(garden);
        const beautyScore=gardenCore.beautyScore(garden);
        const focusMinutes=gardenCore.focusMinutes(garden);
        const lifetimeImpulse=Math.max(Number(user.lifetimeImpulse)||0,Number(user.impulse)||0);
        return {
          id:user.id,
          name:user.name,
          impulse:Number(user.impulse)||0,
          lifetimeImpulse,
          gardenPoints,
          beautyScore,
          focusMinutes,
          plantsGrown:garden.stats.plantsGrown,
          overall:lifetimeImpulse + beautyScore + focusMinutes * 2,
        };
      }).sort((a,b)=>b.overall-a.overall).slice(0,50);
      return sendJson(res,200,{leaders});
    }
    if (pathname==='/api/garden/world' && req.method==='GET') {
      const plots=readUsers().slice(0,48).map((stored,index)=>{
        const garden=gardenCore.publicGarden(stored.garden);
        return{
          id:stored.id,
          name:String(stored.name||'Idrok bog‘boni').slice(0,60),
          level:garden.level,
          beautyScore:garden.beautyScore,
          focusMinutes:garden.focusMinutes,
          dimensions:garden.dimensions,
          items:garden.items.slice(0,600),
          position:worldPlotPosition(index),
          updatedAt:garden.updatedAt,
        };
      });
      return sendJson(res,200,{plots});
    }
    const user=authUser(req); if (!user) return sendJson(res,401,{error:'Avval hisobga kiring.'});
    if (pathname==='/api/admin/stats' && req.method==='GET') {
      if(!isAdmin(user))return sendJson(res,403,{error:'Bu bo‘lim faqat administrator uchun.'});
      const users=readUsers(),students=users.filter(item=>!isAdmin(item)),sessions=readSessions(),now=Date.now(),activeSessions=Object.values(sessions).filter(item=>Number(item?.expiresAt)>now).length;
      const totals=students.reduce((sum,item)=>{sum.impulse+=Number(item.lifetimeImpulse)||0;sum.lessons+=(item.physics7State?.completed?.length||0)+(item.physics8State?.completed?.length||0)+(item.physicsState?.completed?.length||0)+(item.physics10State?.completed?.length||0)+(item.physics11State?.completed?.length||0);sum.focus+=gardenCore.focusMinutes(gardenCore.normalizeGarden(item.garden));sum.plants+=gardenCore.normalizeGarden(item.garden).stats.plantsGrown||0;return sum},{impulse:0,lessons:0,focus:0,plants:0});
      const grades=[['7-sinf','physics7State',62],['8-sinf','physics8State',60],['9-sinf','physicsState',59],['10-sinf','physics10State',59],['11-sinf','physics11State',45]].map(([label,key,total])=>{const completed=students.reduce((sum,item)=>sum+(item[key]?.completed?.length||0),0);return{label,completed,total:students.length*total,percent:students.length?Math.round(completed/(students.length*total)*100):0}});
      return sendJson(res,200,{stats:{users:students.length,admins:users.filter(isAdmin).length,activeSessions,disabled:students.filter(item=>item.disabled).length,totalLessons:totals.lessons,totalImpulse:totals.impulse,focusMinutes:totals.focus,plantsGrown:totals.plants,newThisWeek:students.filter(item=>Date.now()-new Date(item.createdAt).getTime()<604800000).length},grades,recent:students.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,8).map(adminUserView)});
    }
    if (pathname==='/api/admin/users' && req.method==='GET') {
      if(!isAdmin(user))return sendJson(res,403,{error:'Bu bo‘lim faqat administrator uchun.'});
      return sendJson(res,200,{users:readUsers().map(adminUserView).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))});
    }
    if (pathname==='/api/admin/user-action' && req.method==='POST') {
      if(!isAdmin(user))return sendJson(res,403,{error:'Bu bo‘lim faqat administrator uchun.'});
      const body=await readBody(req),users=readUsers(),target=users.find(item=>item.id===String(body.userId||''));if(!target)return sendJson(res,404,{error:'Foydalanuvchi topilmadi.'});
      if(body.action==='toggle-disabled'&&!isAdmin(target))target.disabled=!target.disabled;
      else if(body.action==='grant-impulse'&&!isAdmin(target)){const amount=Math.min(10000,Math.max(1,Math.floor(Number(body.amount)||0)));target.impulse=(Number(target.impulse)||0)+amount;target.lifetimeImpulse=(Number(target.lifetimeImpulse)||0)+amount;}
      else if(body.action==='revoke-sessions'){const sessions=readSessions();for(const [token,session] of Object.entries(sessions))if(session.userId===target.id)delete sessions[token];writeSessions(sessions);}
      else return sendJson(res,400,{error:'Noto‘g‘ri administrator amali.'});
      target.updatedAt=new Date().toISOString();writeUsers(users);return sendJson(res,200,{user:adminUserView(target)});
    }
    if (pathname==='/api/me' && req.method==='GET') {
      const users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      failExpiredFocus(stored.garden); writeUsers(users);
      return sendJson(res,200,{user:publicUser(stored)});
    }
    if (pathname==='/api/progress' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      const previousImpulse=Math.max(0,Number(stored.impulse)||0), incomingImpulse=Math.max(0,Number(body.impulse)||0);
      if(!isAdmin(stored)){
        stored.lifetimeImpulse=Math.max(Number(stored.lifetimeImpulse)||0,previousImpulse)+(incomingImpulse>previousImpulse?incomingImpulse-previousImpulse:0);
        stored.impulse=incomingImpulse;
      }
      stored.score=Math.max(Number(stored.score)||0,Number(body.score)||0);
      stored.completed=[...new Set([...(Array.isArray(stored.completed)?stored.completed:[]),...(Array.isArray(body.completed)?body.completed:[])])].slice(0,500);
      if(body.theme==='dark'||body.theme==='light')stored.theme=body.theme;
      stored.physics7State=mergeCourseState(stored.physics7State,body.physics7State);
      stored.physics8State=mergeCourseState(stored.physics8State,body.physics8State);
      stored.physicsState=mergeCourseState(stored.physicsState,body.physicsState);
      stored.physics10State=mergeCourseState(stored.physics10State,body.physics10State);
      stored.physics11State=mergeCourseState(stored.physics11State,body.physics11State);
      stored.updatedAt=new Date().toISOString(); writeUsers(users);
      return sendJson(res,200,{ok:true,user:publicUser(stored)});
    }
    if (pathname==='/api/garden' && req.method==='GET') {
      const users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      failExpiredFocus(stored.garden); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:isAdmin(stored)?999999999:(Number(stored.impulse)||0),unlimitedImpulse:isAdmin(stored),catalog:gardenCatalog.catalog,expansions:gardenCatalog.expansions,missions:publicMissions(stored.garden)});
    }
    if (pathname==='/api/garden/purchase' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      const item=gardenCatalog.byId[String(body.catalogId||'')], x=Math.floor(Number(body.x)), y=Math.floor(Number(body.y)), rotation=((Math.round(Number(body.rotation)||0)/90)*90%360+360)%360;
      if (!item) return sendJson(res,404,{error:'Bog‘ elementi topilmadi.'});
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      failExpiredFocus(stored.garden);
      if (!gardenCore.canPlace(stored.garden,item.id,x,y,rotation)) return sendJson(res,409,{error:'Bu joy band yoki element bog‘ chegarasidan tashqarida.'});
      if (!isAdmin(stored)&&(Number(stored.impulse)||0)<item.price) return sendJson(res,402,{error:`Bu element uchun ${item.price} Impulse kerak.`});
      const placed={id:crypto.randomUUID(),catalogId:item.id,x,y,rotation,state:item.type==='plant'?'seed':'placed',progress:0,variant:crypto.randomInt(0,6),plantedAt:new Date().toISOString(),maturedAt:null};
      stored.garden.items.push(placed); stored.garden.stats.impulseSpent+=item.price; stored.garden.updatedAt=new Date().toISOString(); if(!isAdmin(stored))stored.impulse-=item.price; writeUsers(users);
      return sendJson(res,201,{garden:gardenCore.publicGarden(stored.garden),impulse:isAdmin(stored)?999999999:stored.impulse,item:placed});
    }
    if (pathname==='/api/garden/move' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden); failExpiredFocus(stored.garden);
      const item=stored.garden.items.find(entry=>entry.id===String(body.itemId||'')), x=Math.floor(Number(body.x)), y=Math.floor(Number(body.y)), rotation=((Math.round(Number(body.rotation??item?.rotation??0)/90)*90%360+360)%360);
      if (!item) return sendJson(res,404,{error:'Bog‘ elementi topilmadi.'});
      if (!gardenCore.canPlace(stored.garden,item.catalogId,x,y,rotation,item.id)) return sendJson(res,409,{error:'Bu joyga elementni joylashtirib bo‘lmaydi.'});
      item.x=x; item.y=y; item.rotation=rotation; stored.garden.updatedAt=new Date().toISOString(); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:displayImpulse(stored)});
    }
    if (pathname==='/api/garden/sell' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden); failExpiredFocus(stored.garden);
      const index=stored.garden.items.findIndex(item=>item.id===String(body.itemId||''));
      if(index<0)return sendJson(res,404,{error:'Sotiladigan element topilmadi.'});
      const item=stored.garden.items[index], catalog=gardenCatalog.byId[item.catalogId];
      if(stored.garden.focus?.plantId===item.id)return sendJson(res,409,{error:'Fokusdagi o‘simlikni sotib bo‘lmaydi.'});
      const refund=Math.max(1,Math.floor(catalog.price*.65));
      stored.garden.items.splice(index,1);stored.garden.stats.itemsSold+=1;stored.impulse=(Number(stored.impulse)||0)+refund;stored.garden.updatedAt=new Date().toISOString();writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:displayImpulse(stored),refund});
    }
    if (pathname==='/api/garden/layout' && req.method==='POST') {
      const body=await readBody(req),users=readUsers(),stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);failExpiredFocus(stored.garden);
      if(!Array.isArray(body.items)||body.items.length!==stored.garden.items.length)return sendJson(res,400,{error:'Joylashuv ma’lumoti to‘liq emas.'});
      const byId=new Map(stored.garden.items.map(item=>[item.id,item])),candidate={...stored.garden,items:[]};
      for(const raw of body.items){
        const original=byId.get(String(raw.id||''));if(!original)return sendJson(res,400,{error:'Noma’lum bog‘ elementi.'});
        const x=Math.floor(Number(raw.x)),y=Math.floor(Number(raw.y)),rotation=((Math.round(Number(raw.rotation)||0)/90)*90%360+360)%360;
        if(!gardenCore.canPlace(candidate,original.catalogId,x,y,rotation))return sendJson(res,409,{error:'Elementlar bir-birining ustiga tushib qoldi.'});
        candidate.items.push({...original,x,y,rotation});
      }
      stored.garden.items=candidate.items;stored.garden.updatedAt=new Date().toISOString();writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:displayImpulse(stored)});
    }
    if (pathname==='/api/garden/settings' && req.method==='POST') {
      const body=await readBody(req),users=readUsers(),stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      if(['day','sunset','night'].includes(body.timeOfDay))stored.garden.settings.timeOfDay=body.timeOfDay;
      if(['low','high'].includes(body.quality))stored.garden.settings.quality=body.quality;
      if(typeof body.sound==='boolean')stored.garden.settings.sound=body.sound;
      if(body.camera&&typeof body.camera==='object')stored.garden.camera={...stored.garden.camera,...body.camera};
      stored.garden.updatedAt=new Date().toISOString();writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden)});
    }
    if (pathname==='/api/garden/mission/claim' && req.method==='POST') {
      const body=await readBody(req),users=readUsers(),stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      const mission=gardenMissions.find(item=>item.id===String(body.missionId||''));
      if(!mission)return sendJson(res,404,{error:'Vazifa topilmadi.'});
      if(stored.garden.stats.missionsClaimed.includes(mission.id))return sendJson(res,409,{error:'Bu mukofot allaqachon olingan.'});
      if(!mission.test(stored.garden))return sendJson(res,403,{error:'Vazifa hali bajarilmagan.'});
      stored.garden.stats.missionsClaimed.push(mission.id);stored.impulse=(Number(stored.impulse)||0)+mission.reward;stored.lifetimeImpulse=(Number(stored.lifetimeImpulse)||0)+mission.reward;stored.garden.updatedAt=new Date().toISOString();writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:displayImpulse(stored),reward:mission.reward,missions:publicMissions(stored.garden)});
    }
    if (pathname==='/api/garden/expand' && req.method==='POST') {
      const users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden); failExpiredFocus(stored.garden);
      const next=gardenCatalog.expansions.find(item=>item.level===stored.garden.level+1);
      if (!next) return sendJson(res,409,{error:'Bog‘ allaqachon eng katta darajada.'});
      if (!isAdmin(stored)&&(Number(stored.impulse)||0)<next.price) return sendJson(res,402,{error:`Bog‘ni kengaytirish uchun ${next.price} Impulse kerak.`});
      if(!isAdmin(stored))stored.impulse-=next.price; stored.garden.level=next.level; stored.garden.stats.impulseSpent+=next.price; stored.garden.updatedAt=new Date().toISOString(); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:isAdmin(stored)?999999999:stored.impulse});
    }
    if (pathname==='/api/garden/focus/start' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id), now=Date.now();
      stored.garden=gardenCore.normalizeGarden(stored.garden,now); failExpiredFocus(stored.garden,now);
      if (stored.garden.focus) return sendJson(res,409,{error:'Avval joriy fokus sessiyasini yakunlang.'});
      const plant=stored.garden.items.find(item=>item.id===String(body.plantId||'')), catalog=plant&&gardenCatalog.byId[plant.catalogId];
      if (!plant||catalog?.type!=='plant') return sendJson(res,404,{error:'O‘stiriladigan o‘simlik topilmadi.'});
      if (!['seed','wilted'].includes(plant.state)) return sendJson(res,409,{error:'Bu o‘simlik allaqachon o‘sib bo‘lgan yoki o‘smoqda.'});
      const durationSeconds=Math.round(catalog.minutes*60*(plant.state==='wilted'?0.6:1));
      plant.state='growing'; plant.progress=0;
      stored.garden.focus={id:crypto.randomUUID(),plantId:plant.id,status:'active',activeSeconds:0,durationSeconds,startedAt:now,lastHeartbeatAt:now,lastActiveAt:now};
      stored.garden.updatedAt=new Date(now).toISOString(); writeUsers(users);
      return sendJson(res,201,{garden:gardenCore.publicGarden(stored.garden),impulse:displayImpulse(stored)});
    }
    if (pathname==='/api/garden/focus/heartbeat' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id), now=Date.now();
      stored.garden=gardenCore.normalizeGarden(stored.garden,now);
      if (failExpiredFocus(stored.garden,now)) { writeUsers(users); return sendJson(res,409,{error:'Fokus sessiyasi uzilib qoldi va o‘simlik quridi.',garden:gardenCore.publicGarden(stored.garden)}); }
      const focus=stored.garden.focus;
      if (!focus||focus.id!==String(body.sessionId||'')) return sendJson(res,404,{error:'Faol fokus sessiyasi topilmadi.'});
      if (body.active!==true || body.learning!==true) return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),completed:false,counted:false});
      const elapsed=Math.min(15,Math.max(0,(now-focus.lastHeartbeatAt)/1000));
      focus.activeSeconds=Math.min(focus.durationSeconds,focus.activeSeconds+elapsed); focus.lastHeartbeatAt=now; focus.lastActiveAt=now;
      const plant=stored.garden.items.find(item=>item.id===focus.plantId);
      if (plant) plant.progress=Math.min(1,focus.activeSeconds/focus.durationSeconds);
      stored.garden.stats.totalFocusSeconds+=elapsed;
      const completed=completeFocus(stored.garden,now); stored.garden.updatedAt=new Date(now).toISOString(); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),completed,counted:true});
    }
    if (pathname==='/api/garden/focus/abandon' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      const focus=stored.garden.focus;
      if (!focus||focus.id!==String(body.sessionId||'')) return sendJson(res,404,{error:'Faol fokus sessiyasi topilmadi.'});
      const plant=stored.garden.items.find(item=>item.id===focus.plantId);
      if (plant) { plant.state='wilted'; plant.progress=Math.min(0.95,focus.activeSeconds/focus.durationSeconds); }
      stored.garden.stats.failedSessions+=1; stored.garden.focus=null; stored.garden.updatedAt=new Date().toISOString(); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:displayImpulse(stored)});
    }
    if (pathname==='/api/lesson-complete' && req.method==='POST') {
      const body=await readBody(req); const courseLabel=String(body.course||'Fizika'); const totalLessons=courseLabel.includes('7-sinf')?62:courseLabel.includes('8-sinf')?60:courseLabel.includes('11-sinf')?45:59; const notification={id:crypto.randomUUID(),type:'lesson',title:`${body.title||'Fizika darsi'} yakunlandi`,message:`Tabriklaymiz! ${body.completedCount||1}/${totalLessons} mavzu yakunlandi. Davom eting!`,createdAt:new Date().toISOString()};
      const email=await sendCompletionEmail(user,`Idrok: ${body.title||'mavzu'} yakunlandi`,`<h1>Tabriklaymiz, ${user.name}!</h1><p>Siz ${courseLabel} kursidagi “${body.title||'Fizika'}” mavzusini muvaffaqiyatli yakunladingiz.</p><p>Natija: ${body.score||0}/10. O‘rganishni davom ettiring!</p>`);
      return sendJson(res,200,{notification,email});
    }
    if (pathname==='/api/course-complete' && req.method==='POST') {
      const body=await readBody(req); const requestedCourse=String(body.course||''); const grade=requestedCourse.includes('7-sinf')?'7':requestedCourse.includes('8-sinf')?'8':requestedCourse.includes('10-sinf')?'10':requestedCourse.includes('11-sinf')?'11':'9'; const courseLabel=`${grade}-sinf fizika`; const courseState=grade==='7'?user.physics7State:grade==='8'?user.physics8State:grade==='10'?user.physics10State:grade==='11'?user.physics11State:user.physicsState; const totalLessons=grade==='7'?62:grade==='8'?60:grade==='11'?45:59;
      const completed = Array.isArray(courseState?.completed) ? new Set(courseState.completed).size : 0;
      if (completed < totalLessons) return sendJson(res,403,{error:`Sertifikat uchun ${totalLessons} ta mavzu kerak. Hozir: ${completed}/${totalLessons}.`});
      const certificateId=crypto.randomBytes(8).toString('hex'); const email=await sendCompletionEmail(user,`Idrok: ${courseLabel} kursi sertifikati`,`<h1>Tabriklaymiz, ${user.name}!</h1><p>Siz Idrok platformasidagi ${courseLabel} kursini muvaffaqiyatli tugatdingiz.</p><p>Sertifikat raqami: ${certificateId}</p>`);
      return sendJson(res,200,{certificateId,email,course:courseLabel,certificateUrl:`/certificate.html?id=${certificateId}&grade=${grade}`});
    }
    return sendJson(res,404,{error:'API manzili topilmadi.'});
  } catch (error) { return sendJson(res,500,{error:error.message||'Server xatosi'}); }
}

const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(req.url.split('?')[0]);
  if (pathname.startsWith('/api/')) return api(req,res,pathname);
  let url=pathname==='/'?'/index.html':pathname; const file=path.normalize(path.join(root,url));
  if(!file.startsWith(root)){res.writeHead(403);return res.end('Taqiqlangan');}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end('Topilmadi');}res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});
});
const port=Math.max(1,Number(process.env.PORT)||4173);
server.listen(port,'127.0.0.1',()=>console.log(`IDROK: http://localhost:${port}`));
module.exports=server;

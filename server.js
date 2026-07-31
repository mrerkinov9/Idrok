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
const sessions = new Map();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, {recursive:true});
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]\n');

const readUsers = () => { try { return JSON.parse(fs.readFileSync(usersFile, 'utf8')); } catch { return []; } };
const writeUsers = users => fs.writeFileSync(usersFile, `${JSON.stringify(users, null, 2)}\n`);
const sendJson = (res, status, payload) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(payload)); };
const readBody = req => new Promise((resolve, reject) => { let body=''; req.on('data', chunk => { body += chunk; if (body.length > 1e6) reject(new Error('Juda katta so‘rov')); }); req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('JSON noto‘g‘ri')); } }); req.on('error', reject); });
const hashPassword = (password, salt) => crypto.scryptSync(password, salt, 64).toString('hex');
const publicUser = user => ({
  id:user.id,
  name:user.name,
  email:user.email,
  impulse:Number(user.impulse)||0,
  lifetimeImpulse:Math.max(Number(user.lifetimeImpulse)||0, Number(user.impulse)||0),
  score:Number(user.score)||0,
  completed:user.completed||[],
  theme:user.theme||'light',
  garden:gardenCore.publicGarden(user.garden),
  physics7State:user.physics7State||null,
  physics8State:user.physics8State||null,
  physicsState:user.physicsState||null,
  physics10State:user.physics10State||null,
});
const tokenFor = user => { const token=crypto.randomBytes(32).toString('hex'); sessions.set(token, user.id); return token; };
const authUser = req => { const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,''); const id=sessions.get(token); return readUsers().find(user=>user.id===id); };

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
    if (pathname==='/api/register' && req.method==='POST') {
      const {name,email,password}=await readBody(req); const cleanEmail=String(email||'').trim().toLowerCase(); const cleanName=String(name||'').trim();
      if (cleanName.length<3 || !/^\S+@\S+\.\S+$/.test(cleanEmail) || String(password||'').length<6) return sendJson(res,400,{error:'Ism, email yoki parol talabga mos emas.'});
      const users=readUsers(); if (users.some(user=>user.email===cleanEmail)) return sendJson(res,409,{error:'Bu email bilan hisob mavjud.'});
      const salt=crypto.randomBytes(16).toString('hex'); const user={id:crypto.randomUUID(),name:cleanName,email:cleanEmail,salt,passwordHash:hashPassword(password,salt),impulse:50,lifetimeImpulse:50,score:0,completed:[],theme:'light',garden:gardenCore.createGarden(),physics7State:{version:1,completed:[],scores:{},current:'l1',stages:{},startedAt:Date.now()},physics8State:{version:1,completed:[],scores:{},current:'l1',stages:{},startedAt:Date.now()},physicsState:{version:4,completed:[],scores:{},current:'l1',stages:{},startedAt:Date.now()},physics10State:{version:20,completed:[],scores:{},current:'l1',stages:{},startedAt:Date.now()},createdAt:new Date().toISOString()};
      users.push(user); writeUsers(users); return sendJson(res,201,{token:tokenFor(user),user:publicUser(user)});
    }
    if (pathname==='/api/login' && req.method==='POST') {
      const {email,password}=await readBody(req); const user=readUsers().find(item=>item.email===String(email||'').trim().toLowerCase());
      if (!user || !crypto.timingSafeEqual(Buffer.from(user.passwordHash,'hex'),Buffer.from(hashPassword(String(password||''),user.salt),'hex'))) return sendJson(res,401,{error:'Email yoki parol noto‘g‘ri.'});
      return sendJson(res,200,{token:tokenFor(user),user:publicUser(user)});
    }
    if (pathname==='/api/leaderboard' && req.method==='GET') {
      const leaders=readUsers().map(user => {
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
    if (pathname==='/api/me' && req.method==='GET') {
      const users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      failExpiredFocus(stored.garden); writeUsers(users);
      return sendJson(res,200,{user:publicUser(stored)});
    }
    if (pathname==='/api/progress' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      const previousImpulse=Math.max(0,Number(stored.impulse)||0), incomingImpulse=Math.max(0,Number(body.impulse)||0);
      stored.lifetimeImpulse=Math.max(Number(stored.lifetimeImpulse)||0,previousImpulse)+(incomingImpulse>previousImpulse?incomingImpulse-previousImpulse:0);
      stored.impulse=incomingImpulse; stored.score=Math.max(0,Number(body.score)||0); stored.completed=Array.isArray(body.completed)?body.completed.slice(0,500):[]; stored.theme=body.theme==='dark'?'dark':'light'; if(body.physics7State&&typeof body.physics7State==='object')stored.physics7State=body.physics7State; if(body.physics8State&&typeof body.physics8State==='object')stored.physics8State=body.physics8State; if(body.physicsState&&typeof body.physicsState==='object')stored.physicsState=body.physicsState; if(body.physics10State&&typeof body.physics10State==='object')stored.physics10State=body.physics10State; stored.updatedAt=new Date().toISOString(); writeUsers(users);
      return sendJson(res,200,{ok:true});
    }
    if (pathname==='/api/garden' && req.method==='GET') {
      const users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      failExpiredFocus(stored.garden); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:Number(stored.impulse)||0,catalog:gardenCatalog.catalog,expansions:gardenCatalog.expansions,missions:publicMissions(stored.garden)});
    }
    if (pathname==='/api/garden/purchase' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      const item=gardenCatalog.byId[String(body.catalogId||'')], x=Math.floor(Number(body.x)), y=Math.floor(Number(body.y)), rotation=((Math.round(Number(body.rotation)||0)/90)*90%360+360)%360;
      if (!item) return sendJson(res,404,{error:'Bog‘ elementi topilmadi.'});
      stored.garden=gardenCore.normalizeGarden(stored.garden);
      failExpiredFocus(stored.garden);
      if (!gardenCore.canPlace(stored.garden,item.id,x,y,rotation)) return sendJson(res,409,{error:'Bu joy band yoki element bog‘ chegarasidan tashqarida.'});
      if ((Number(stored.impulse)||0)<item.price) return sendJson(res,402,{error:`Bu element uchun ${item.price} Impulse kerak.`});
      const placed={id:crypto.randomUUID(),catalogId:item.id,x,y,rotation,state:item.type==='plant'?'seed':'placed',progress:0,variant:crypto.randomInt(0,6),plantedAt:new Date().toISOString(),maturedAt:null};
      stored.garden.items.push(placed); stored.garden.stats.impulseSpent+=item.price; stored.garden.updatedAt=new Date().toISOString(); stored.impulse-=item.price; writeUsers(users);
      return sendJson(res,201,{garden:gardenCore.publicGarden(stored.garden),impulse:stored.impulse,item:placed});
    }
    if (pathname==='/api/garden/move' && req.method==='POST') {
      const body=await readBody(req), users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden); failExpiredFocus(stored.garden);
      const item=stored.garden.items.find(entry=>entry.id===String(body.itemId||'')), x=Math.floor(Number(body.x)), y=Math.floor(Number(body.y)), rotation=((Math.round(Number(body.rotation??item?.rotation??0)/90)*90%360+360)%360);
      if (!item) return sendJson(res,404,{error:'Bog‘ elementi topilmadi.'});
      if (!gardenCore.canPlace(stored.garden,item.catalogId,x,y,rotation,item.id)) return sendJson(res,409,{error:'Bu joyga elementni joylashtirib bo‘lmaydi.'});
      item.x=x; item.y=y; item.rotation=rotation; stored.garden.updatedAt=new Date().toISOString(); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:Number(stored.impulse)||0});
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
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:stored.impulse,refund});
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
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:Number(stored.impulse)||0});
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
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:stored.impulse,reward:mission.reward,missions:publicMissions(stored.garden)});
    }
    if (pathname==='/api/garden/expand' && req.method==='POST') {
      const users=readUsers(), stored=users.find(item=>item.id===user.id);
      stored.garden=gardenCore.normalizeGarden(stored.garden); failExpiredFocus(stored.garden);
      const next=gardenCatalog.expansions.find(item=>item.level===stored.garden.level+1);
      if (!next) return sendJson(res,409,{error:'Bog‘ allaqachon eng katta darajada.'});
      if ((Number(stored.impulse)||0)<next.price) return sendJson(res,402,{error:`Bog‘ni kengaytirish uchun ${next.price} Impulse kerak.`});
      stored.impulse-=next.price; stored.garden.level=next.level; stored.garden.stats.impulseSpent+=next.price; stored.garden.updatedAt=new Date().toISOString(); writeUsers(users);
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:stored.impulse});
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
      return sendJson(res,201,{garden:gardenCore.publicGarden(stored.garden),impulse:Number(stored.impulse)||0});
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
      return sendJson(res,200,{garden:gardenCore.publicGarden(stored.garden),impulse:Number(stored.impulse)||0});
    }
    if (pathname==='/api/lesson-complete' && req.method==='POST') {
      const body=await readBody(req); const courseLabel=String(body.course||'Fizika'); const totalLessons=courseLabel.includes('7-sinf')?62:courseLabel.includes('8-sinf')?60:59; const notification={id:crypto.randomUUID(),type:'lesson',title:`${body.title||'Fizika darsi'} yakunlandi`,message:`Tabriklaymiz! ${body.completedCount||1}/${totalLessons} mavzu yakunlandi. Davom eting!`,createdAt:new Date().toISOString()};
      const email=await sendCompletionEmail(user,`Idrok: ${body.title||'mavzu'} yakunlandi`,`<h1>Tabriklaymiz, ${user.name}!</h1><p>Siz ${courseLabel} kursidagi “${body.title||'Fizika'}” mavzusini muvaffaqiyatli yakunladingiz.</p><p>Natija: ${body.score||0}/10. O‘rganishni davom ettiring!</p>`);
      return sendJson(res,200,{notification,email});
    }
    if (pathname==='/api/course-complete' && req.method==='POST') {
      const body=await readBody(req); const requestedCourse=String(body.course||''); const grade=requestedCourse.includes('7-sinf')?'7':requestedCourse.includes('8-sinf')?'8':requestedCourse.includes('10-sinf')?'10':'9'; const courseLabel=`${grade}-sinf fizika`; const courseState=grade==='7'?user.physics7State:grade==='8'?user.physics8State:grade==='10'?user.physics10State:user.physicsState; const totalLessons=grade==='7'?62:grade==='8'?60:59;
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

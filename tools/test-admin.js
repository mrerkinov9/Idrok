const fs=require('fs');
const path=require('path');
const {spawn}=require('child_process');

const root=path.resolve(__dirname,'..');
const dataDir=path.join(root,'tmp','admin-test-data');
const port=4392;
const base=`http://127.0.0.1:${port}`;
let server;
let checks=0;

function assert(condition,message){checks+=1;if(!condition)throw new Error(message)}
function start(){server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(port),IDROK_DATA_DIR:dataDir},stdio:['ignore','pipe','pipe']});server.stderr.on('data',data=>process.stderr.write(data))}
function stop(){return new Promise(resolve=>{if(!server||server.killed)return resolve();server.once('exit',resolve);server.kill();setTimeout(resolve,1000)})}
async function waitReady(){for(let i=0;i<50;i++){try{const response=await fetch(`${base}/api/health`);if(response.ok)return}catch{}await new Promise(resolve=>setTimeout(resolve,100))}throw new Error('Admin test serveri ishga tushmadi')}
async function api(pathname,{token,...options}={}){const response=await fetch(base+pathname,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}});const body=await response.json().catch(()=>({}));return{status:response.status,body}}

(async()=>{
  fs.rmSync(dataDir,{recursive:true,force:true});fs.mkdirSync(dataDir,{recursive:true});start();await waitReady();
  let result=await api('/api/admin/bootstrap-status');assert(result.status===200&&result.body.needsSetup===true,'Birinchi admin sozlamasi ko‘rinmadi');
  result=await api('/api/admin/bootstrap',{method:'POST',body:JSON.stringify({name:'Idrok Admin',email:'admin@idrok.test',password:'AdminTest!2026'})});
  assert(result.status===201,'Admin yaratilmadi');const adminToken=result.body.token;assert(result.body.user.role==='admin'&&result.body.user.unlimitedImpulse===true,'Admin vakolati noto‘g‘ri');
  result=await api('/api/admin/bootstrap-status');assert(result.body.needsSetup===false,'Admin qayta sozlanishdan yopilmadi');
  result=await api('/api/admin/bootstrap',{method:'POST',body:JSON.stringify({name:'Second Admin',email:'second-admin@idrok.test',password:'AdminTest!2026'})});assert(result.status===409,'Ikkinchi yashirin admin yaratilib qoldi');
  const student=await api('/api/register',{method:'POST',body:JSON.stringify({name:'Sinov O‘quvchi',email:'student@idrok.test',password:'Strong1!'})});assert(student.status===201,'O‘quvchi yaratilmadi');
  result=await api('/api/admin/stats',{token:student.body.token});assert(result.status===403,'O‘quvchi admin statistikasini ko‘rib qoldi');
  result=await api('/api/admin/stats',{token:adminToken});assert(result.status===200&&result.body.stats.users===1&&result.body.stats.admins===1,'Admin statistikasi noto‘g‘ri');assert(result.body.grades.some(item=>item.label==='11-sinf'),'11-sinf admin statistikasiga qo‘shilmagan');
  result=await api('/api/admin/users',{token:adminToken});assert(result.status===200&&result.body.users.length===2,'Foydalanuvchilar ro‘yxati noto‘g‘ri');
  const target=result.body.users.find(user=>user.role==='student');
  result=await api('/api/admin/user-action',{token:adminToken,method:'POST',body:JSON.stringify({userId:target.id,action:'grant-impulse',amount:500})});assert(result.status===200&&result.body.user.impulse===550,'Impulse berish ishlamadi');
  result=await api('/api/admin/user-action',{token:adminToken,method:'POST',body:JSON.stringify({userId:target.id,action:'toggle-disabled'})});assert(result.status===200&&result.body.user.disabled===true,'Hisobni bloklash ishlamadi');
  result=await api('/api/login',{method:'POST',body:JSON.stringify({email:'student@idrok.test',password:'Strong1!'})});assert(result.status===403,'Bloklangan hisob kirib qoldi');
  await api('/api/admin/user-action',{token:adminToken,method:'POST',body:JSON.stringify({userId:target.id,action:'toggle-disabled'})});
  result=await api('/api/progress',{token:adminToken,method:'POST',body:JSON.stringify({impulse:0,score:1,completed:[],physics7State:{completed:['l1'],scores:{l1:10},stages:{l1:{quiz:true}}}})});assert(result.status===200&&result.body.user.impulse===999999999,'Adminning cheksiz Impulse rejimi buzildi');
  const storedAdmin=JSON.parse(fs.readFileSync(path.join(dataDir,'idrok-users.json'),'utf8')).find(user=>user.role==='admin');assert(storedAdmin.impulse===0&&storedAdmin.lifetimeImpulse===0,'Cheksiz ko‘rsatkich haqiqiy statistika ichiga yozilib qoldi');
  result=await api('/api/garden/purchase',{token:adminToken,method:'POST',body:JSON.stringify({catalogId:'rayhon',x:2,y:2,rotation:0})});assert(result.status===201&&result.body.impulse===999999999&&result.body.garden.items.length===1,'Admin bog‘ sinov rejimi ishlamadi');
  await stop();start();await waitReady();result=await api('/api/me',{token:adminToken});assert(result.status===200&&result.body.user.role==='admin','Admin sessiyasi server restartidan keyin yo‘qoldi');
  console.log(`ADMIN TEST: ${checks}/${checks} muvaffaqiyatli`);
})().catch(error=>{console.error(error.stack||error);process.exitCode=1}).finally(async()=>{await stop()});

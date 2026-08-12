const fs=require('fs');
const path=require('path');
const {spawn}=require('child_process');

const root=path.resolve(__dirname,'..');
const dataDir=path.join(root,'tmp','account-test-data');
const port=4391;
const base=`http://127.0.0.1:${port}`;
let server;

function assert(condition,message){if(!condition)throw new Error(message)}
function start(){
  server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(port),IDROK_DATA_DIR:dataDir},stdio:['ignore','pipe','pipe']});
  server.stderr.on('data',data=>process.stderr.write(data));
}
function stop(){return new Promise(resolve=>{if(!server||server.killed)return resolve();server.once('exit',resolve);server.kill();setTimeout(resolve,1000)})}
async function waitReady(){for(let i=0;i<40;i++){try{const response=await fetch(`${base}/api/leaderboard`);if(response.ok)return}catch{}await new Promise(resolve=>setTimeout(resolve,100))}throw new Error('Test server ishga tushmadi')}
async function api(pathname,{token,...options}={}){
  const response=await fetch(base+pathname,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}});
  const body=await response.json().catch(()=>({}));return{status:response.status,body};
}

(async()=>{
  fs.rmSync(dataDir,{recursive:true,force:true});fs.mkdirSync(dataDir,{recursive:true});
  start();await waitReady();
  const first=await api('/api/register',{method:'POST',body:JSON.stringify({name:'Test Birinchi',email:'first@test.uz',password:'Strong1!'})});
  assert(first.status===201,'Birinchi account yaratilmadi');const token=first.body.token;
  const saved=await api('/api/progress',{token,method:'POST',body:JSON.stringify({impulse:140,score:8,completed:['physics7:l1','physics11:l1'],theme:'dark',physics7State:{version:1,completed:['l1'],scores:{l1:8},current:'l2',stages:{l1:{quiz:true}}},physics11State:{version:1,completed:['l1'],scores:{l1:9},current:'l2',stages:{l1:{quiz:true}}}})});
  assert(saved.status===200,'Progress saqlanmadi');
  await stop();start();await waitReady();
  const restored=await api('/api/me',{token});
  assert(restored.status===200,'Server restartidan keyin sessiya tiklanmadi');
  assert(restored.body.user.physics7State.completed.includes('l1'),'Saqlangan kurs progressi yo‘qoldi');
  assert(restored.body.user.physics11State.completed.includes('l1'),'11-sinf kurs progressi yo‘qoldi');
  const merged=await api('/api/progress',{token,method:'POST',body:JSON.stringify({impulse:160,score:2,completed:['physics7:l2'],theme:'light',physics7State:{version:1,completed:['l2'],scores:{l2:9},current:'l3',stages:{l2:{quiz:true}}}})});
  assert(merged.body.user.physics7State.completed.length===2,'Kurs progressi birlashtirilmadi');
  assert(merged.body.user.score===8,'Yuqori score pasayib ketdi');
  const earlyCertificate=await api('/api/course-complete',{token,method:'POST',body:JSON.stringify({course:'11-sinf fizika'})});
  assert(earlyCertificate.status===403,'11-sinf sertifikati 45 darsdan oldin berildi');
  const allGrade11=Array.from({length:45},(_,index)=>`l${index+1}`);
  await api('/api/progress',{token,method:'POST',body:JSON.stringify({impulse:160,physics11State:{version:1,completed:allGrade11,current:'l45'}})});
  const grade11Certificate=await api('/api/course-complete',{token,method:'POST',body:JSON.stringify({course:'11-sinf fizika'})});
  assert(grade11Certificate.status===200&&grade11Certificate.body.course==='11-sinf fizika','11-sinf sertifikati 45 darsdan keyin berilmadi');
  const second=await api('/api/register',{method:'POST',body:JSON.stringify({name:'Test Ikkinchi',email:'second@test.uz',password:'Strong2!'})});
  assert(second.status===201,'Ikkinchi account yaratilmadi');
  assert((await api('/api/me',{token:second.body.token})).body.user.physics7State.completed.length===0,'Accountlar progressi aralashib ketdi');
  const leaders=await api('/api/leaderboard');assert(leaders.body.leaders.length===2,'Reyting accountlarni ko‘rsatmadi');
  assert((await api('/api/logout',{token,method:'POST',body:'{}'})).status===200,'Logout ishlamadi');
  assert((await api('/api/me',{token})).status===401,'Logout tokenni bekor qilmadi');
  console.log('ACCOUNT TEST: 15/15 muvaffaqiyatli');
})().catch(error=>{console.error(error.stack||error);process.exitCode=1}).finally(async()=>{await stop()});

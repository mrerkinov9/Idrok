const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawn} = require('child_process');
const catalog = require('../garden-catalog.js');
const core = require('../garden-core.js');

function testEconomyAndCore() {
  const plants = catalog.catalog.filter(item => item.type === 'plant');
  assert.strictEqual(plants[0].price, 25, 'Birinchi o‘simlik yangi hisobga mos bo‘lishi kerak');
  assert(plants.every((item,index) => !index || item.price >= plants[index-1].price), 'Narxlar fokus vaqti bilan pasaymasligi kerak');
  assert(plants.every(item => item.points > item.price), 'Fokusdan keyingi bog‘ balli xarid narxidan yuqori bo‘lishi kerak');

  const garden = core.createGarden(1000);
  garden.items = [
    {id:'a',catalogId:'rayhon',x:0,y:0,state:'mature',progress:1},
    {id:'b',catalogId:'lola',x:0,y:0,state:'mature',progress:1},
    {id:'c',catalogId:'fake',x:2,y:2,state:'mature',progress:1},
    {id:'d',catalogId:'chiroq',x:1,y:0,state:'placed',progress:0},
  ];
  const normalized = core.normalizeGarden(garden,1000);
  assert.strictEqual(normalized.items.length,3,'To‘qnashgan eski element yangi katta maydondagi yaqin bo‘sh joyga ko‘chishi kerak');
  assert.strictEqual(core.gardenPoints(normalized),142,'Yetilgan o‘simliklar va chiroq ballari to‘g‘ri hisoblanishi kerak');
  assert.strictEqual(core.isCellFree(normalized,2,2),true);
  assert.strictEqual(core.isCellFree(normalized,0,0),false);
}

async function request(base,route,options={}) {
  const response = await fetch(`${base}${route}`,options);
  const data = await response.json();
  return {response,data};
}

async function testApi() {
  const testDir=fs.mkdtempSync(path.join(os.tmpdir(),'idrok-garden-'));
  const port=43173;
  const child=spawn(process.execPath,['server.js'],{
    cwd:path.join(__dirname,'..'),
    env:{...process.env,PORT:String(port),IDROK_DATA_DIR:testDir},
    stdio:['ignore','pipe','pipe'],
  });
  try {
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Test serveri ishga tushmadi')),7000);
      child.stdout.on('data',chunk=>{if(String(chunk).includes('IDROK:')){clearTimeout(timer);resolve()}});
      child.once('exit',code=>reject(new Error(`Test serveri to‘xtadi: ${code}`)));
    });
    const base=`http://127.0.0.1:${port}`;
    let result=await request(base,'/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Bog Testi',email:'garden-test@idrok.uz',password:'secure123'})});
    assert.strictEqual(result.response.status,201);
    assert.strictEqual(result.data.user.impulse,50);
    const auth={Authorization:`Bearer ${result.data.token}`,'Content-Type':'application/json'};

    result=await request(base,'/api/garden/purchase',{method:'POST',headers:auth,body:JSON.stringify({catalogId:'rayhon',x:0,y:0})});
    assert.strictEqual(result.response.status,201);
    assert.strictEqual(result.data.impulse,25);
    const plantId=result.data.item.id;

    result=await request(base,'/api/garden/purchase',{method:'POST',headers:auth,body:JSON.stringify({catalogId:'yolak',x:0,y:0})});
    assert.strictEqual(result.response.status,409,'Band katakka ikkinchi xarid rad etilishi kerak');

    result=await request(base,'/api/garden/focus/start',{method:'POST',headers:auth,body:JSON.stringify({plantId})});
    assert.strictEqual(result.response.status,201);
    const sessionId=result.data.garden.focus.id;

    const file=path.join(testDir,'idrok-users.json');
    const users=JSON.parse(fs.readFileSync(file,'utf8'));
    users[0].garden.focus.activeSeconds=599;
    users[0].garden.focus.lastHeartbeatAt=Date.now()-2000;
    fs.writeFileSync(file,`${JSON.stringify(users,null,2)}\n`);

    result=await request(base,'/api/garden/focus/heartbeat',{method:'POST',headers:auth,body:JSON.stringify({sessionId,active:true,learning:true})});
    assert.strictEqual(result.response.status,200);
    assert.strictEqual(result.data.completed,true,'To‘liq fokusdan keyin o‘simlik yetilishi kerak');
    assert.strictEqual(result.data.garden.items[0].state,'mature');
    assert.strictEqual(result.data.garden.gardenPoints,35);

    result=await request(base,'/api/garden/mission/claim',{method:'POST',headers:auth,body:JSON.stringify({missionId:'first-bloom'})});
    assert.strictEqual(result.response.status,200);
    assert.strictEqual(result.data.reward,30);
    assert.strictEqual(result.data.impulse,55);

    result=await request(base,'/api/garden/purchase',{method:'POST',headers:auth,body:JSON.stringify({catalogId:'chiroq',x:2,y:2,rotation:90})});
    assert.strictEqual(result.response.status,201);
    assert.strictEqual(result.data.impulse,25);
    const lampId=result.data.item.id;

    result=await request(base,'/api/garden/move',{method:'POST',headers:auth,body:JSON.stringify({itemId:lampId,x:3,y:2,rotation:180})});
    assert.strictEqual(result.response.status,200);
    assert.strictEqual(result.data.garden.items.find(item=>item.id===lampId).rotation,180);

    result=await request(base,'/api/garden/settings',{method:'POST',headers:auth,body:JSON.stringify({timeOfDay:'night',quality:'low'})});
    assert.strictEqual(result.response.status,200);
    assert.strictEqual(result.data.garden.settings.timeOfDay,'night');
    assert.strictEqual(result.data.garden.settings.quality,'low');

    result=await request(base,'/api/garden/sell',{method:'POST',headers:auth,body:JSON.stringify({itemId:lampId})});
    assert.strictEqual(result.response.status,200);
    assert.strictEqual(result.data.refund,19);
    assert.strictEqual(result.data.impulse,44);

    result=await request(base,'/api/leaderboard');
    assert.strictEqual(result.response.status,200);
    assert.strictEqual(result.data.leaders[0].gardenPoints,35);
    assert(result.data.leaders[0].beautyScore>=57,'Go‘zallik balli yetilgan o‘simlik va xilma-xillikni hisobga olishi kerak');
    assert(result.data.leaders[0].overall>=137,'Umumiy reyting bilim, fokus va bog‘ni birlashtirishi kerak');

    result=await request(base,'/api/garden/world');
    assert.strictEqual(result.response.status,200,'Bog‘lar dunyosi hisobga kirmasdan ham ko‘rinishi kerak');
    assert.strictEqual(result.data.plots.length,1);
    assert.strictEqual(result.data.plots[0].name,'Bog Testi');
    assert.strictEqual('email' in result.data.plots[0],false,'Ommaviy bog‘ xaritasida email oshkor qilinmasligi kerak');
    assert(Array.isArray(result.data.plots[0].items),'Tashrif uchun faqat bog‘ elementlarining xavfsiz nusxasi berilishi kerak');
    assert(Number.isFinite(result.data.plots[0].position.x)&&Number.isFinite(result.data.plots[0].position.z));

    const second=await request(base,'/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Ikkinchi Bog‘bon',email:'second@idrok.uz',password:'secure123'})});
    const secondAuth={Authorization:`Bearer ${second.data.token}`,'Content-Type':'application/json'};
    result=await request(base,'/api/garden/move',{method:'POST',headers:secondAuth,body:JSON.stringify({itemId:plantId,x:4,y:4})});
    assert.strictEqual(result.response.status,404,'Boshqa foydalanuvchi tashrifdagi elementni o‘zgartira olmasligi kerak');
  } finally {
    child.kill();
    fs.rmSync(testDir,{recursive:true,force:true});
  }
}

(async()=>{
  testEconomyAndCore();
  await testApi();
  console.log('Bog‘ testi: 37/37 tekshiruv muvaffaqiyatli.');
})().catch(error=>{
  console.error(error);
  process.exitCode=1;
});

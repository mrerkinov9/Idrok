const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const gardenCore = require('../garden-core.js');
const gardenCatalog = require('../garden-catalog.js');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'supabase-auth.js'), 'utf8');
const authUser = {id:'11111111-1111-1111-1111-111111111111', email:'student@idrok.uz', user_metadata:{full_name:'Test Student'}};
let profile = {
  id:authUser.id,
  name:'Test Student',
  email:authUser.email,
  role:'student',
  impulse:50,
  lifetime_impulse:50,
  score:0,
  completed:[],
  theme:'light',
  garden:null,
  physics7_state:null,
  physics8_state:null,
  physics_state:null,
  physics10_state:null,
  physics11_state:null,
};

function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

function profileQuery() {
  let updatePayload = null;
  const chain = {
    select() { return chain; },
    update(value) { updatePayload = value; return chain; },
    eq() { return chain; },
    async maybeSingle() { return {data:clone(profile), error:null}; },
    async single() {
      if (updatePayload) {
        const previousImpulse = profile.impulse;
        profile = {...profile, ...clone(updatePayload)};
        profile.lifetime_impulse = Math.max(profile.lifetime_impulse, previousImpulse) + Math.max(0, profile.impulse - previousImpulse);
      }
      return {data:clone(profile), error:null};
    },
  };
  return chain;
}

const sdk = {
  auth:{
    async getSession(){return {data:{session:{access_token:'test-token',user:authUser}},error:null}},
    async getUser(){return {data:{user:authUser},error:null}},
    async signOut(){return {error:null}},
    async signInWithOAuth(){return {data:{url:'https://accounts.google.com/'},error:null}},
  },
  from(table) {
    if (table === 'profiles') return profileQuery();
    if (table === 'leaderboard') {
      const chain = {select(){return chain},order(){return chain},limit:async()=>({data:[],error:null})};
      return chain;
    }
    throw new Error(`Unexpected table: ${table}`);
  },
  async rpc(name) {
    assert.strictEqual(name, 'get_garden_world');
    const neighbor = gardenCore.createGarden();
    neighbor.items.push({id:'neighbor-plant',catalogId:'rayhon',x:2,y:2,rotation:0,state:'mature',progress:1,variant:1});
    return {data:[{id:'22222222-2222-2222-2222-222222222222',name:'Qo‘shni bog‘bon',garden:gardenCore.publicGarden(neighbor),updated_at:new Date().toISOString()}],error:null};
  },
};

const storage = new Map([
  ['idrokState', JSON.stringify({completed:[],score:0,impulse:50,theme:'light'})],
]);
const localStorage = {
  getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value)),
  removeItem:key=>storage.delete(key),
};

const window = {
  IDROK_AUTH_CONFIG:{supabaseUrl:'https://test-project.supabase.co',supabaseKey:'sb_publishable_test'},
  IDROK_GARDEN_CORE:gardenCore,
  IDROK_GARDEN_CATALOG:gardenCatalog,
  supabase:{createClient:()=>sdk},
  dispatchEvent(){},
};

const context = {
  window,
  localStorage,
  location:{origin:'http://127.0.0.1:3000',pathname:'/index.html',search:''},
  fetch:async()=>({ok:true,json:async()=>({external:{google:true}})}),
  crypto:{randomUUID:()=>crypto.randomUUID()},
  CustomEvent:class CustomEvent { constructor(type,options){this.type=type;this.detail=options?.detail} },
  console,
  Date,
  Math,
  Set,
  Map,
  JSON,
  Object,
  Number,
  String,
  Array,
  Promise,
};

vm.runInNewContext(source, context, {filename:'supabase-auth.js'});

(async()=>{
  const auth = window.IDROK_AUTH;
  assert(auth?.configured, 'Adapter configured bo‘lmadi');
  const ready = await auth.ready();
  assert.strictEqual(ready.email, authUser.email);

  await auth.request('/api/progress', {body:JSON.stringify({physics7State:{version:1,completed:['l1'],scores:{l1:8},stages:{l1:{quiz:true}}}})});
  await auth.request('/api/progress', {body:JSON.stringify({physics7State:{version:1,completed:['l2'],scores:{l2:9},stages:{l2:{quiz:true}}}})});
  assert.deepStrictEqual([...profile.physics7_state.completed].sort(), ['l1','l2'], 'Kurs progressi merge bo‘lmadi');

  let result = await auth.request('/api/garden');
  assert.strictEqual(result.impulse, 50);
  result = await auth.request('/api/garden/world');
  assert.strictEqual(result.plots.length, 1, 'Ommaviy bog‘lar Supabase RPC orqali yuklanmadi');
  assert.strictEqual(result.plots[0].name, 'Qo‘shni bog‘bon');
  result = await auth.request('/api/garden/purchase', {method:'POST',body:JSON.stringify({catalogId:'rayhon',x:0,y:0,rotation:0,mutationId:'purchase-1'})});
  assert.strictEqual(result.impulse, 25, 'Garden xaridi balansni kamaytirmadi');
  const plantId = result.item.id;
  assert.strictEqual(profile.garden.items.length, 1, 'Garden Supabase profiliga saqlanmadi');
  assert.strictEqual(profile.garden.revision, 1, 'Garden revision oshmadi');
  result = await auth.request('/api/garden/purchase', {method:'POST',body:JSON.stringify({catalogId:'rayhon',x:0,y:0,rotation:0,mutationId:'purchase-1'})});
  assert.strictEqual(result.duplicate, true, 'Takroriy garden mutatsiyasi aniqlanmadi');
  assert.strictEqual(profile.garden.items.length, 1, 'Takroriy purchase ikkinchi element yaratdi');
  assert.strictEqual(result.impulse, 25, 'Takroriy purchase balansni yana kamaytirdi');

  result = await auth.request('/api/garden/move', {method:'POST',body:JSON.stringify({itemId:plantId,x:2,y:2,rotation:90})});
  assert.strictEqual(result.garden.items[0].x, 2, 'Garden move saqlanmadi');

  result = await auth.request('/api/garden/focus/start', {method:'POST',body:JSON.stringify({plantId})});
  const sessionId = result.garden.focus.id;
  profile.garden.focus.activeSeconds = profile.garden.focus.durationSeconds - 1;
  profile.garden.focus.lastHeartbeatAt = Date.now() - 2000;
  result = await auth.request('/api/garden/focus/heartbeat', {method:'POST',body:JSON.stringify({sessionId,active:true,learning:true})});
  assert.strictEqual(result.completed, true, 'Fokus yakunlanmadi');
  assert.strictEqual(profile.garden.items[0].state, 'mature', 'O‘simlik yetilmadi');

  result = await auth.request('/api/garden/mission/claim', {method:'POST',body:JSON.stringify({missionId:'first-bloom',mutationId:'mission-first-bloom'})});
  assert.strictEqual(result.reward, 30, 'Mission reward berilmadi');
  assert.strictEqual(result.impulse, 55, 'Mission balansi noto‘g‘ri');
  assert.strictEqual(profile.garden.stats.missionsClaimed[0], 'first-bloom');
  result = await auth.request('/api/garden/mission/claim', {method:'POST',body:JSON.stringify({missionId:'first-bloom',mutationId:'mission-first-bloom'})});
  assert.strictEqual(result.duplicate, true, 'Mission replay idempotent emas');
  assert.strictEqual(result.impulse, 55, 'Mission replay rewardni takror berdi');

  result = await auth.request('/api/garden/purchase', {method:'POST',body:JSON.stringify({catalogId:'rayhon',x:4,y:4})});
  const secondPlantId = result.item.id;
  result = await auth.request('/api/garden/focus/start', {method:'POST',body:JSON.stringify({plantId:secondPlantId})});
  profile.garden.focus.lastHeartbeatAt = Date.now() - 91000;
  let expiredError = null;
  try {
    await auth.request('/api/garden/focus/heartbeat', {method:'POST',body:JSON.stringify({sessionId:result.garden.focus.id,active:true,learning:true})});
  } catch (error) { expiredError = error; }
  assert(expiredError, 'Uzilgan fokus sessiyasi rad etilmadi');
  assert.strictEqual(profile.garden.focus, null, 'Uzilgan fokus server holatidan tozalanmadi');
  assert.strictEqual(profile.garden.items.find(item=>item.id===secondPlantId).state, 'wilted', 'Uzilgan fokus o‘simligi qurigan holatga o‘tmadi');

  console.log('SUPABASE ADAPTER TEST: 24/24 muvaffaqiyatli');
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});

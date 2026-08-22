const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'account-session.js'), 'utf8');
const storage = new Map([
  ['idrokAuthToken', 'cached-token'],
  ['idrokCurrentUser', 'student@idrok.uz'],
  ['idrokUsers', JSON.stringify([{id:'student-1',email:'student@idrok.uz',name:'Student',completed:[],score:0,impulse:50}])],
  ['idrokState', JSON.stringify({completed:[],score:0,impulse:50,theme:'light'})],
  ['idrokGarden', JSON.stringify({version:2,items:[]})],
]);
const localStorage = {
  getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value)),
  removeItem:key=>storage.delete(key),
};
const sessionStorage = {removeItem(){}};
const listeners = new Map();
const navigator = {onLine:false};
const baseUser = {id:'student-1',email:'student@idrok.uz',name:'Student',completed:[],score:0,impulse:50,theme:'light'};
const cloudCalls = [];
const cloud = {
  configured:true,
  ready:async()=>baseUser,
  logout:async()=>{},
  request:async(pathname,options={})=>{
    cloudCalls.push({pathname,options});
    if(pathname==='/api/progress')return {ok:true,user:{...baseUser,physics7State:JSON.parse(options.body).physics7State}};
    if(pathname==='/api/me')return {user:baseUser};
    return {ok:true};
  },
};
const window = {
  IDROK_AUTH:cloud,
  addEventListener:(type,handler)=>listeners.set(type,handler),
  dispatchEvent(){},
};
const document = {
  body:null,
  visibilityState:'visible',
  querySelector:()=>null,
  addEventListener:(type,handler)=>listeners.set(type,handler),
};
const location = {pathname:'/physics7.html',search:'',hash:'#l1',replace(){}};
class CustomEvent { constructor(type,options){this.type=type;this.detail=options?.detail} }

const context={window,document,location,navigator,localStorage,sessionStorage,CustomEvent,dispatchEvent(){},console,JSON,Object,Array,Set,Map,Number,String,Promise,Date,setTimeout,clearTimeout};
vm.runInNewContext(source,context,{filename:'account-session.js'});

(async()=>{
  await window.IDROK_ACCOUNT.ready;

  let result=await window.IDROK_ACCOUNT.request('/api/progress',{method:'POST',body:JSON.stringify({physics7State:{completed:['l1'],scores:{l1:8},stages:{l1:{quiz:true}}}})});
  assert.strictEqual(result.queued,true,'Offline progress navbatga olinmadi');
  await window.IDROK_ACCOUNT.request('/api/progress',{method:'POST',body:JSON.stringify({physics7State:{completed:['l2'],scores:{l2:9},stages:{l2:{quiz:true}}}})});
  assert.strictEqual(cloudCalls.length,0,'Offline paytda server chaqirildi');
  const queued=JSON.parse(storage.get('idrokProgressQueueV1'))['student-1'];
  assert.deepStrictEqual([...queued.physics7State.completed].sort(),['l1','l2'],'Offline progress birlashtirilmadi');

  let gardenError=null;
  try{await window.IDROK_ACCOUNT.request('/api/garden/purchase',{method:'POST',body:'{}'})}catch(error){gardenError=error}
  assert.strictEqual(gardenError?.code,'IDROK_OFFLINE_GARDEN','Offline bog‘ amali xavfsiz rad etilmadi');

  navigator.onLine=true;
  await window.IDROK_ACCOUNT.flushQueue();
  assert.strictEqual(cloudCalls.filter(call=>call.pathname==='/api/progress').length,1,'Offline navbat bitta merge request bilan yuborilmadi');
  assert.strictEqual(storage.has('idrokProgressQueueV1'),false,'Yuborilgan offline navbat tozalanmadi');

  await window.IDROK_ACCOUNT.logout();
  for(const key of ['idrokAuthToken','idrokCurrentUser','idrokUsers','idrokState','idrokGarden'])assert.strictEqual(storage.has(key),false,`Logout ${key} cache’ini tozalamadi`);

  console.log('DAY 2 FLOW TEST: 12/12 muvaffaqiyatli');
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});

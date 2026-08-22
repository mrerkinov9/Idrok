(() => {
  'use strict';

  const TOKEN_KEY='idrokAuthToken';
  const CURRENT_KEY='idrokCurrentUser';
  const USERS_KEY='idrokUsers';
  const SYNC_QUEUE_KEY='idrokProgressQueueV1';
  const courseKeys={physics7State:'idrokPhysics7',physics8State:'idrokPhysics8',physicsState:'idrokPhysics',physics10State:'idrokPhysics10',physics11State:'idrokPhysics11'};
  const accountCacheKeys=['idrokState','idrokGarden','idrokNotifications','idrokCertificate','idrokCertificate7','idrokCertificate8','idrokCertificate10','idrokCertificate11',...Object.values(courseKeys)];
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const isProtected=!new Set(['','index.html']).has(page);
  const cloudAuth=window.IDROK_AUTH?.configured===true;
  let lastRefresh=0;
  let flushPromise=null;

  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
  function isOnline(){return typeof navigator==='undefined'||navigator.onLine!==false}
  function networkFailure(error){return !isOnline()||/network|fetch|offline|internet|failed to fetch/i.test(String(error?.message||''))}
  function mergeCourse(previous,incoming){
    if(!incoming||typeof incoming!=='object')return previous||null;
    if(!previous||typeof previous!=='object')return incoming;
    const scores={...(previous.scores||{})};
    for(const [id,value] of Object.entries(incoming.scores||{}))scores[id]=Math.max(Number(scores[id])||0,Number(value)||0);
    const stages={...(previous.stages||{})};
    for(const [id,value] of Object.entries(incoming.stages||{}))stages[id]={...(stages[id]||{}),...(value||{})};
    return {...previous,...incoming,completed:[...new Set([...(previous.completed||[]),...(incoming.completed||[])])],scores,stages,lastActivity:Math.max(Number(previous.lastActivity)||0,Number(incoming.lastActivity)||0)||undefined};
  }
  function mergeProgress(previous={},incoming={}){
    const merged={...previous,...incoming};
    merged.completed=[...new Set([...(previous.completed||[]),...(incoming.completed||[])])];
    merged.score=Math.max(Number(previous.score)||0,Number(incoming.score)||0);
    merged.impulse=Math.max(Number(previous.impulse)||0,Number(incoming.impulse)||0);
    for(const field of Object.keys(courseKeys))merged[field]=mergeCourse(previous[field],incoming[field]);
    return merged;
  }
  function current(){
    const email=localStorage.getItem(CURRENT_KEY)||'';
    return read(USERS_KEY,[]).find(user=>user.email===email)||null;
  }
  function clearSession(){
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_KEY);
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SYNC_QUEUE_KEY);
    accountCacheKeys.forEach(key=>localStorage.removeItem(key));
    sessionStorage.removeItem('idrokAuthPreviewed');
  }
  function progressPayload(){
    const state=read('idrokState',{completed:[],score:0,impulse:0,theme:'light'});
    return {...state,physics7State:read('idrokPhysics7',null),physics8State:read('idrokPhysics8',null),physicsState:read('idrokPhysics',null),physics10State:read('idrokPhysics10',null),physics11State:read('idrokPhysics11',null)};
  }
  function ensureStatus(){
    if(!document?.body||document.querySelector('.idrok-sync-status'))return document?.querySelector('.idrok-sync-status')||null;
    const node=document.createElement('aside');
    node.className='idrok-sync-status';
    node.setAttribute('role','status');
    node.setAttribute('aria-live','polite');
    node.innerHTML='<i aria-hidden="true"></i><span><b>Bulut bilan ulangan</b><small>Progress xavfsiz saqlanadi</small></span>';
    document.body.appendChild(node);
    return node;
  }
  function emitSync(state,message=''){
    const labels={saved:['Saqlandi','Progress bulutda'],syncing:['Saqlanmoqda','O‘zgarishlar yuborilyapti'],offline:['Offline rejim','Progress navbatda saqlanadi'],error:['Sinxronlash kutilmoqda','Internet qaytganda uriniladi']};
    const [title,detail]=labels[state]||labels.saved;
    const node=ensureStatus();
    if(node){node.dataset.state=state;node.querySelector('b').textContent=title;node.querySelector('small').textContent=message||detail;node.classList.add('show');clearTimeout(emitSync.timer);emitSync.timer=setTimeout(()=>{if(state==='saved')node.classList.remove('show')},2600)}
    window.dispatchEvent(new CustomEvent('idrok:sync-status',{detail:{state,message:message||detail}}));
  }
  function cacheUser(user){
    if(!user)return;
    const users=read(USERS_KEY,[]),index=users.findIndex(item=>item.email===user.email);
    if(index>=0)users[index]={...users[index],...user};else users.push(user);
    localStorage.setItem(USERS_KEY,JSON.stringify(users.slice(-3)));
    localStorage.setItem(CURRENT_KEY,user.email);
    localStorage.setItem('idrokState',JSON.stringify({completed:[...(user.completed||[])],score:Number(user.score)||0,impulse:Number(user.impulse)||0,theme:user.theme||'light'}));
    for(const [field,key] of Object.entries(courseKeys))if(user[field])localStorage.setItem(key,JSON.stringify(user[field]));
    if(user.garden)localStorage.setItem('idrokGarden',JSON.stringify(user.garden));
    window.dispatchEvent(new CustomEvent('idrok:account-update',{detail:user}));
  }
  function queueProgress(payload){
    const identity=current()?.id||localStorage.getItem(CURRENT_KEY)||'pending';
    const queued=read(SYNC_QUEUE_KEY,{});
    queued[identity]=mergeProgress(queued[identity]||{},payload);
    localStorage.setItem(SYNC_QUEUE_KEY,JSON.stringify(queued));
    emitSync('offline');
    return {ok:true,queued:true,user:current()};
  }
  async function flushQueue(){
    if(flushPromise)return flushPromise;
    if(!cloudAuth||!isOnline())return null;
    flushPromise=(async()=>{
      const queued=read(SYNC_QUEUE_KEY,{});
      const entries=Object.entries(queued);
      if(!entries.length)return null;
      emitSync('syncing','Offline o‘zgarishlar yuborilyapti');
      let latest=null;
      for(const [identity,payload] of entries){
        const result=await window.IDROK_AUTH.request('/api/progress',{method:'POST',body:JSON.stringify(payload)});
        if(result.user){latest=result.user;cacheUser(result.user)}
        delete queued[identity];
        localStorage.setItem(SYNC_QUEUE_KEY,JSON.stringify(queued));
      }
      if(!Object.keys(queued).length)localStorage.removeItem(SYNC_QUEUE_KEY);
      emitSync('saved','Offline progress ham saqlandi');
      return latest;
    })().catch(error=>{emitSync(networkFailure(error)?'offline':'error',networkFailure(error)?'Internet qaytganda avtomatik yuboriladi':error.message);return null}).finally(()=>{flushPromise=null});
    return flushPromise;
  }
  async function request(path,options={}){
    const method=String(options.method||'GET').toUpperCase();
    const isProgress=path==='/api/progress'&&method!=='GET';
    const isGardenMutation=path.startsWith('/api/garden/')&&method!=='GET';
    const payload=isProgress?JSON.parse(options.body||'{}'):null;
    if(isProgress&&!isOnline())return queueProgress(payload);
    if(isGardenMutation&&!isOnline()){
      emitSync('offline','Bog‘ amali yuborilmadi — internetni tiklang');
      throw Object.assign(new Error('Internet yo‘q. Bog‘dagi o‘zgarish bajarilmadi; qayta ulaning va yana urinib ko‘ring.'),{code:'IDROK_OFFLINE_GARDEN'});
    }
    try{
      if(isProgress)emitSync('syncing');
      let result;
      if(cloudAuth)result=await window.IDROK_AUTH.request(path,options);
      else{
        const token=localStorage.getItem(TOKEN_KEY)||'';
        const response=await fetch(path,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{}) ,...(options.headers||{})}});
        const body=await response.json().catch(()=>({}));
        if(response.status===401)clearSession();
        if(!response.ok)throw new Error(body.error||'Server bilan aloqa xatosi.');
        result=body;
      }
      if(result?.user)cacheUser(result.user);
      if(isProgress)emitSync('saved');
      return result;
    }catch(error){
      if(isProgress&&networkFailure(error))return queueProgress(payload);
      if(isGardenMutation&&networkFailure(error))throw Object.assign(new Error('Bog‘ serveriga ulanib bo‘lmadi. O‘zgarish qo‘llanmadi; qayta urinib ko‘ring.'),{code:'IDROK_GARDEN_RETRY',cause:error});
      throw error;
    }
  }
  function goToLogin(){
    if(!isProtected)return;
    const next=`${page}${location.search||''}${location.hash||''}`;
    location.replace(`index.html?auth=login&next=${encodeURIComponent(next)}`);
  }
  async function refreshAccount(force=false){
    if(!cloudAuth||!isOnline())return current();
    if(!force&&Date.now()-lastRefresh<10000)return current();
    lastRefresh=Date.now();
    const result=await window.IDROK_AUTH.request('/api/me',{refresh:true});
    if(result.user)cacheUser(result.user);
    return result.user||null;
  }

  const token=localStorage.getItem(TOKEN_KEY)||'';
  if(!token&&!cloudAuth)goToLogin();
  const ready=cloudAuth?window.IDROK_AUTH.ready().then(async user=>{if(!user){goToLogin();return null}cacheUser(user);dispatchEvent(new CustomEvent('idrok:account-ready',{detail:user}));await flushQueue();return user}).catch(error=>{if(networkFailure(error)&&current()){emitSync('offline');return current()}clearSession();goToLogin();return null}):token?request('/api/me').then(({user})=>{cacheUser(user);dispatchEvent(new CustomEvent('idrok:account-ready',{detail:user}));return user}).catch(()=>{clearSession();goToLogin();return null}):Promise.resolve(null);

  window.addEventListener('online',()=>{emitSync('syncing','Internet tiklandi');flushQueue().then(()=>refreshAccount(true))});
  window.addEventListener('offline',()=>emitSync('offline'));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshAccount().catch(error=>emitSync(networkFailure(error)?'offline':'error',error.message))});

  window.IDROK_ACCOUNT={
    ready,request,cacheUser,clearSession,current,refresh:()=>refreshAccount(true),flushQueue,
    sync:async()=>{const result=await request('/api/progress',{method:'POST',body:JSON.stringify(progressPayload())});if(result.user)cacheUser(result.user);return result.user||current()},
    logout:async()=>{try{if(cloudAuth)await window.IDROK_AUTH.logout();else await request('/api/logout',{method:'POST'})}catch{}clearSession()},
  };
})();

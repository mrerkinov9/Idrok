(() => {
  'use strict';

  const TOKEN_KEY='idrokAuthToken';
  const CURRENT_KEY='idrokCurrentUser';
  const USERS_KEY='idrokUsers';
  const courseKeys={physics7State:'idrokPhysics7',physics8State:'idrokPhysics8',physicsState:'idrokPhysics',physics10State:'idrokPhysics10',physics11State:'idrokPhysics11'};
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const isProtected=!new Set(['','index.html']).has(page);

  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
  function clearSession(){localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(CURRENT_KEY);sessionStorage.removeItem('idrokAuthPreviewed')}
  function progressPayload(){
    const state=read('idrokState',{completed:[],score:0,impulse:0,theme:'light'});
    return {...state,physics7State:read('idrokPhysics7',null),physics8State:read('idrokPhysics8',null),physicsState:read('idrokPhysics',null),physics10State:read('idrokPhysics10',null),physics11State:read('idrokPhysics11',null)};
  }
  function cacheUser(user){
    if(!user)return;
    const users=read(USERS_KEY,[]),index=users.findIndex(item=>item.email===user.email);
    if(index>=0)users[index]={...users[index],...user};else users.push(user);
    localStorage.setItem(USERS_KEY,JSON.stringify(users.slice(-30)));
    localStorage.setItem(CURRENT_KEY,user.email);
    localStorage.setItem('idrokState',JSON.stringify({completed:[...(user.completed||[])],score:Number(user.score)||0,impulse:Number(user.impulse)||0,theme:user.theme||'light'}));
    for(const [field,key] of Object.entries(courseKeys))if(user[field])localStorage.setItem(key,JSON.stringify(user[field]));
    if(user.garden)localStorage.setItem('idrokGarden',JSON.stringify(user.garden));
  }
  async function request(path,options={}){
    if(window.IDROK_AUTH?.configured)return window.IDROK_AUTH.request(path,options);
    const token=localStorage.getItem(TOKEN_KEY)||'';
    const response=await fetch(path,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{}) ,...(options.headers||{})}});
    const payload=await response.json().catch(()=>({}));
    if(response.status===401)clearSession();
    if(!response.ok)throw new Error(payload.error||'Server bilan aloqa xatosi.');
    return payload;
  }
  function goToLogin(){
    if(!isProtected)return;
    const next=`${page}${location.search||''}${location.hash||''}`;
    location.replace(`index.html?auth=login&next=${encodeURIComponent(next)}`);
  }

  const token=localStorage.getItem(TOKEN_KEY)||'';
  const cloudAuth=window.IDROK_AUTH?.configured===true;
  if(!token&&!cloudAuth)goToLogin();
  const ready=cloudAuth?window.IDROK_AUTH.ready().then(user=>{if(!user){goToLogin();return null}cacheUser(user);dispatchEvent(new CustomEvent('idrok:account-ready',{detail:user}));return user}).catch(()=>{clearSession();goToLogin();return null}):token?request('/api/me').then(({user})=>{cacheUser(user);dispatchEvent(new CustomEvent('idrok:account-ready',{detail:user}));return user}).catch(()=>{
    clearSession();goToLogin();return null;
  }):Promise.resolve(null);

  window.IDROK_ACCOUNT={
    ready,request,cacheUser,clearSession,
    current:()=>{const email=localStorage.getItem(CURRENT_KEY)||'';return read(USERS_KEY,[]).find(user=>user.email===email)||null},
    sync:async()=>{const result=await request('/api/progress',{method:'POST',body:JSON.stringify(progressPayload())});if(result.user)cacheUser(result.user);return result.user||null},
    logout:async()=>{try{if(cloudAuth)await window.IDROK_AUTH.logout();else await request('/api/logout',{method:'POST'})}catch{}clearSession()},
  };
})();

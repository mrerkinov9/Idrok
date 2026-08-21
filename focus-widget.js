(async() => {
  'use strict';

  const catalogApi = window.IDROK_GARDEN_CATALOG;
  const core = window.IDROK_GARDEN_CORE;
  if (!catalogApi || !core) return;

  if(window.IDROK_ACCOUNT?.ready)await window.IDROK_ACCOUNT.ready;

  const token = localStorage.getItem('idrokAuthToken') || '';
  const learningPage = /(?:physics(?:7|8|10)?|lab)\.html$/i.test(location.pathname);
  let garden = null;
  let lastInteraction = Date.now();
  let lastTick = Date.now();
  let busy = false;
  let completionShown = false;

  const shell = document.createElement('aside');
  shell.className = 'idrok-focus-widget';
  shell.setAttribute('aria-live','polite');
  shell.innerHTML = `
    <div class="idrok-focus-head">
      <span class="idrok-focus-plant" aria-hidden="true">🌱</span>
      <span class="idrok-focus-copy"><small>FOKUS NIHOLI</small><b>O‘simlik o‘smoqda</b></span>
      <strong class="idrok-focus-time">00:00</strong>
    </div>
    <div class="idrok-focus-track"><i></i></div>
    <div class="idrok-focus-foot"><span class="idrok-focus-status">Faol o‘rganish kutilmoqda</span><a class="idrok-focus-link" href="garden.html">Bog‘ga qaytish</a></div>`;
  document.body.appendChild(shell);

  const plantIcon = {rayhon:'🌿',atirgul:'🌹',lola:'🌷',lavanda:'🪻',olma:'🍎',sakura:'🌸',chinor:'🌳'};
  const $ = selector => shell.querySelector(selector);
  const guestKey = 'idrokGarden';
  const isActive = () => document.visibilityState === 'visible' && learningPage && Date.now() - lastInteraction < 60000;
  const format = seconds => {
    const value = Math.max(0,Math.ceil(seconds));
    return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;
  };

  function readGuest() {
    try { return core.normalizeGarden(JSON.parse(localStorage.getItem(guestKey)||'null')); }
    catch { return core.createGarden(); }
  }
  function saveGuest(value) {
    localStorage.setItem(guestKey,JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('idrok:garden-update',{detail:core.publicGarden(value)}));
  }
  async function api(path, options={}) {
    if(window.IDROK_ACCOUNT?.request)return window.IDROK_ACCOUNT.request(path,options);
    const response=await fetch(path,{...options,headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`,...options.headers}});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw Object.assign(new Error(data.error||'Bog‘ serverida xato.'),{data,status:response.status});
    return data;
  }

  function reconcileGuest(now=Date.now()) {
    garden=readGuest();
    const focus=garden.focus;
    if (focus && now-focus.lastHeartbeatAt>90000) {
      const plant=garden.items.find(item=>item.id===focus.plantId);
      if(plant){plant.state='wilted';plant.progress=Math.min(.95,focus.activeSeconds/focus.durationSeconds)}
      garden.stats.failedSessions+=1;garden.focus=null;garden.updatedAt=new Date(now).toISOString();saveGuest(garden);
    }
  }

  function render() {
    const focus=garden?.focus;
    shell.classList.toggle('show',!!focus);
    if(!focus)return;
    const plant=garden.items.find(item=>item.id===focus.plantId);
    const item=plant&&catalogApi.byId[plant.catalogId];
    const remaining=Math.max(0,focus.durationSeconds-focus.activeSeconds);
    const progress=Math.min(100,Math.round(focus.activeSeconds/focus.durationSeconds*100));
    $('.idrok-focus-plant').textContent=plantIcon[item?.id]||'🌱';
    $('.idrok-focus-copy b').textContent=`${item?.name||'O‘simlik'} · ${progress}%`;
    $('.idrok-focus-time').textContent=format(remaining);
    $('.idrok-focus-track i').style.width=`${progress}%`;
    const active=isActive();
    shell.classList.toggle('paused',!active);
    $('.idrok-focus-status').textContent=active?'Fokus hisoblanmoqda':'Dars sahifasida faol bo‘ling';
  }

  function completeGuest(now) {
    const focus=garden.focus;
    if(!focus||focus.activeSeconds<focus.durationSeconds)return false;
    const plant=garden.items.find(item=>item.id===focus.plantId);
    if(plant){plant.state='mature';plant.progress=1;plant.maturedAt=new Date(now).toISOString()}
    garden.stats.completedSessions+=1;garden.stats.plantsGrown+=1;garden.focus=null;garden.updatedAt=new Date(now).toISOString();saveGuest(garden);
    return true;
  }

  async function heartbeat() {
    if(busy)return;
    const now=Date.now(), active=isActive();
    busy=true;
    try{
      if(token){
        if(!garden?.focus){
          const data=await api('/api/garden');
          garden=data.garden;
        }else if(active){
          const data=await api('/api/garden/focus/heartbeat',{method:'POST',body:JSON.stringify({sessionId:garden.focus.id,active:true,learning:true})});
          garden=data.garden;
          if(data.completed&&!completionShown){completionShown=true;notifyComplete()}
        }
      }else{
        reconcileGuest(now);
        if(garden.focus&&active){
          const elapsed=Math.min(10,Math.max(0,(now-lastTick)/1000));
          garden.focus.activeSeconds=Math.min(garden.focus.durationSeconds,garden.focus.activeSeconds+elapsed);
          garden.focus.lastHeartbeatAt=now;garden.focus.lastActiveAt=now;garden.stats.totalFocusSeconds+=elapsed;
          const plant=garden.items.find(item=>item.id===garden.focus.plantId);
          if(plant)plant.progress=Math.min(1,garden.focus.activeSeconds/garden.focus.durationSeconds);
          const completed=completeGuest(now);
          if(!completed)saveGuest(garden); else if(!completionShown){completionShown=true;notifyComplete()}
        }
      }
    }catch(error){
      if(error.data?.garden)garden=error.data.garden;
    }finally{lastTick=now;busy=false;render()}
  }

  function notifyComplete(){
    shell.classList.remove('show');
    const toast=document.createElement('div');
    toast.className='idrok-focus-widget show';
    toast.style.left='22px';toast.innerHTML='<div class="idrok-focus-head"><span class="idrok-focus-plant">✨</span><span class="idrok-focus-copy"><small>FOKUS YAKUNLANDI</small><b>O‘simligingiz gulladi!</b></span><a class="idrok-focus-link" href="garden.html">Ko‘rish</a></div>';
    document.body.appendChild(toast);setTimeout(()=>toast.remove(),6500);
  }

  ['pointerdown','keydown','scroll','touchstart'].forEach(event=>addEventListener(event,()=>{lastInteraction=Date.now()},{passive:true}));
  document.addEventListener('visibilitychange',render);
  window.addEventListener('idrok:garden-update',event=>{garden=core.normalizeGarden(event.detail);render()});

  (async()=>{
    if(token){try{garden=(await api('/api/garden')).garden}catch{garden=readGuest()}}
    else reconcileGuest();
    render();lastTick=Date.now();setInterval(heartbeat,10000);
  })();
})();

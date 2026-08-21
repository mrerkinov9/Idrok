(function () {
  'use strict';

  const config = window.IDROK_AUTH_CONFIG || {};
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl || '') && /^sb_(?:publishable|anon)_/i.test(config.supabaseKey || '');
  const courseFields = ['physics7State', 'physics8State', 'physicsState', 'physics10State', 'physics11State'];
  let client = null;
  let bootPromise = null;
  let cachedUser = null;
  let profileStoreAvailable = true;
  let syncQueue = Promise.resolve();
  let gardenQueue = Promise.resolve();

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
  }

  function courseState(version) {
    return {version, completed: [], scores: {}, current: 'l1', stages: {}, startedAt: Date.now()};
  }

  function localProgress() {
    const state = read('idrokState', {completed: [], score: 0, impulse: 0, theme: 'light'});
    return {
      impulse: Number(state.impulse) || 0,
      lifetimeImpulse: Number(state.impulse) || 0,
      score: Number(state.score) || 0,
      completed: Array.isArray(state.completed) ? state.completed : [],
      theme: state.theme === 'dark' ? 'dark' : 'light',
      garden: read('idrokGarden', null),
      physics7State: read('idrokPhysics7', courseState(1)),
      physics8State: read('idrokPhysics8', courseState(1)),
      physicsState: read('idrokPhysics', courseState(4)),
      physics10State: read('idrokPhysics10', courseState(20)),
      physics11State: read('idrokPhysics11', courseState(1)),
    };
  }

  function profileFromRow(authUser, row) {
    const fallback = localProgress();
    const metadata = authUser?.user_metadata || {};
    const welcomeImpulse = Number(metadata.initial_impulse) || 0;
    return {
      id: authUser.id,
      name: row?.name || metadata.full_name || metadata.name || authUser.email?.split('@')[0] || 'Idrok foydalanuvchisi',
      email: authUser.email || '',
      role: row?.role === 'admin' ? 'admin' : 'student',
      impulse: Number(row?.impulse ?? Math.max(fallback.impulse, welcomeImpulse)) || 0,
      lifetimeImpulse: Number(row?.lifetime_impulse ?? Math.max(fallback.lifetimeImpulse, welcomeImpulse)) || 0,
      score: Number(row?.score ?? fallback.score) || 0,
      completed: Array.isArray(row?.completed) ? row.completed : fallback.completed,
      theme: row?.theme === 'dark' ? 'dark' : fallback.theme,
      garden: row?.garden || fallback.garden,
      physics7State: row?.physics7_state || fallback.physics7State,
      physics8State: row?.physics8_state || fallback.physics8State,
      physicsState: row?.physics_state || fallback.physicsState,
      physics10State: row?.physics10_state || fallback.physics10State,
      physics11State: row?.physics11_state || fallback.physics11State,
    };
  }

  function rowFromProfile(user) {
    return {
      name: user.name,
      impulse: Number(user.impulse) || 0,
      score: Number(user.score) || 0,
      completed: Array.isArray(user.completed) ? user.completed : [],
      theme: user.theme === 'dark' ? 'dark' : 'light',
      garden: user.garden || null,
      physics7_state: user.physics7State || null,
      physics8_state: user.physics8State || null,
      physics_state: user.physicsState || null,
      physics10_state: user.physics10State || null,
      physics11_state: user.physics11State || null,
      updated_at: new Date().toISOString(),
    };
  }

  function mergeCourseState(previous, incoming) {
    if (!incoming || typeof incoming !== 'object') return previous || null;
    if (!previous || typeof previous !== 'object') return incoming;
    const completed = [...new Set([
      ...(Array.isArray(previous.completed) ? previous.completed : []),
      ...(Array.isArray(incoming.completed) ? incoming.completed : []),
    ])];
    const scores = {...(previous.scores || {})};
    for (const [lessonId, score] of Object.entries(incoming.scores || {})) {
      scores[lessonId] = Math.max(Number(scores[lessonId]) || 0, Number(score) || 0);
    }
    const stages = {...(previous.stages || {})};
    for (const [lessonId, lessonStages] of Object.entries(incoming.stages || {})) {
      stages[lessonId] = {...(stages[lessonId] || {}), ...(lessonStages || {})};
    }
    return {
      ...previous,
      ...incoming,
      completed,
      scores,
      stages,
      lastActivity: Math.max(Number(previous.lastActivity) || 0, Number(incoming.lastActivity) || 0) || undefined,
    };
  }

  function getClient() {
    if (!configured) throw new Error('Kirish xizmati hali ulanmagan. Sayt administratoriga xabar bering.');
    if (!window.supabase?.createClient) throw new Error('Kirish moduli yuklanmadi. Internetni tekshirib, qayta urinib ko‘ring.');
    if (!client) {
      client = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
        auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true},
      });
    }
    return client;
  }

  function isMissingProfileStore(error) {
    const code = String(error?.code || '').toUpperCase();
    const message = String(error?.message || '').toLowerCase();
    return code === 'PGRST205' || code === 'PGRST116' || code === '42P01' || message.includes('public.profiles') || message.includes('schema cache');
  }

  async function cacheProfile(authUser, row = null) {
    const sdk = getClient();
    const profile = profileFromRow(authUser, row);
    cachedUser = profile;
    localStorage.setItem('idrokAuthToken', (await sdk.auth.getSession()).data.session?.access_token || '');
    localStorage.setItem('idrokCurrentUser', profile.email);
    return profile;
  }

  async function loadProfile(authUser) {
    const sdk = getClient();
    if (!profileStoreAvailable) return cacheProfile(authUser);
    const {data, error} = await sdk.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
    if (error && !isMissingProfileStore(error)) throw error;
    if (error) profileStoreAvailable = false;
    return cacheProfile(authUser, data);
  }

  async function ready() {
    if (!configured) return null;
    if (!bootPromise) {
      bootPromise = (async () => {
        const sdk = getClient();
        const {data, error} = await sdk.auth.getSession();
        if (error) throw error;
        if (!data.session?.user) return null;
        return loadProfile(data.session.user);
      })();
    }
    return bootPromise;
  }

  async function signInWithGoogle() {
    const sdk = getClient();
    const redirectTo = `${location.origin}${location.pathname}${location.search}`;
    const {data, error} = await sdk.auth.signInWithOAuth({
      provider: 'google',
      options: {redirectTo, queryParams: {prompt: 'select_account'}},
    });
    if (error) throw error;
    return data;
  }

  async function providers() {
    if (!configured) return {google: false};
    const response = await fetch(`${config.supabaseUrl}/auth/v1/settings`, {headers: {apikey: config.supabaseKey}});
    if (!response.ok) throw new Error('Kirish usullarini tekshirib bo‘lmadi.');
    const settings = await response.json();
    return {google: settings?.external?.google === true};
  }

  async function performSync(payload = {}, options = {}) {
    const sdk = getClient();
    const {data: authData, error: authError} = await sdk.auth.getUser();
    if (authError || !authData.user) throw authError || new Error('Sessiya tugagan. Qayta kiring.');
    let previous = cachedUser || await loadProfile(authData.user);
    if (profileStoreAvailable) {
      const {data: latestRow, error: latestError} = await sdk.from('profiles').select('*').eq('id', authData.user.id).maybeSingle();
      if (latestError && !isMissingProfileStore(latestError)) throw latestError;
      if (latestRow) previous = profileFromRow(authData.user, latestRow);
    }
    const merged = {...previous, ...payload, id: authData.user.id, email: authData.user.email || previous.email};
    merged.impulse = options.economy === true
      ? Math.max(0, Number(payload.impulse) || 0)
      : Math.max(Number(previous.impulse) || 0, Number(payload.impulse) || 0);
    merged.lifetimeImpulse = Math.max(
      Number(previous.lifetimeImpulse) || 0,
      Number(previous.impulse) || 0,
      Number(payload.lifetimeImpulse) || 0,
    ) + Math.max(0, Number(options.lifetimeGain) || 0);
    merged.completed = [...new Set([...(previous.completed || []), ...(Array.isArray(payload.completed) ? payload.completed : [])])];
    merged.score = Math.max(Number(previous.score) || 0, Number(payload.score) || 0);
    for (const field of courseFields) merged[field] = mergeCourseState(previous[field], payload[field]);
    if (!profileStoreAvailable) {
      cachedUser = merged;
      return cachedUser;
    }
    const {data, error} = await sdk.from('profiles').update(rowFromProfile(merged)).eq('id', authData.user.id).select('*').single();
    if (error && !isMissingProfileStore(error)) throw error;
    if (error) {
      profileStoreAvailable = false;
      cachedUser = merged;
      return cachedUser;
    }
    cachedUser = profileFromRow(authData.user, data);
    return cachedUser;
  }

  function sync(payload = {}, options = {}) {
    const operation = () => performSync(payload, options);
    const pending = syncQueue.then(operation, operation);
    syncQueue = pending.catch(() => null);
    return pending;
  }

  async function leaderboard() {
    const sdk = getClient();
    if (!profileStoreAvailable) return [];
    const {data, error} = await sdk.from('leaderboard').select('*').order('overall', {ascending: false}).limit(50);
    if (error && !isMissingProfileStore(error)) throw error;
    if (error) {
      profileStoreAvailable = false;
      return [];
    }
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      impulse: Number(item.impulse) || 0,
      lifetimeImpulse: Number(item.lifetime_impulse) || 0,
      gardenPoints: Number(item.garden_points) || 0,
      beautyScore: Number(item.beauty_score) || 0,
      focusMinutes: Number(item.focus_minutes) || 0,
      overall: Number(item.overall) || 0,
    }));
  }

  async function logout() {
    if (configured) await getClient().auth.signOut();
    cachedUser = null;
    bootPromise = null;
    localStorage.removeItem('idrokAuthToken');
    localStorage.removeItem('idrokCurrentUser');
  }

  const missionDefinitions = [
    {id:'first-bloom', title:'Birinchi gullash', description:'Bitta o‘simlikni to‘liq o‘stiring.', reward:30, test:garden=>garden.items.some(item=>item.state==='mature')},
    {id:'five-colors', title:'Ranglar uyg‘unligi', description:'5 xil bog‘ elementidan foydalaning.', reward:75, test:garden=>new Set(garden.items.map(item=>item.catalogId)).size>=5},
    {id:'focus-hour', title:'Bir soatlik bog‘bon', description:'Jami 60 daqiqa fokus qiling.', reward:80, test:(garden,core)=>core.focusMinutes(garden)>=60},
    {id:'garden-designer', title:'Bog‘ dizayneri', description:'Bog‘ingizga 20 ta element joylashtiring.', reward:100, test:garden=>garden.items.length>=20},
  ];

  function gardenRuntime() {
    const core = window.IDROK_GARDEN_CORE;
    const catalog = window.IDROK_GARDEN_CATALOG;
    if (!core || !catalog) throw new Error('Bog‘ moduli to‘liq yuklanmadi. Sahifani qayta oching.');
    return {core, catalog};
  }

  function requestBody(options) {
    if (!options?.body) return {};
    if (typeof options.body === 'object') return options.body;
    try { return JSON.parse(options.body); } catch { throw new Error('Bog‘ amali uchun noto‘g‘ri ma’lumot yuborildi.'); }
  }

  function missionsFor(garden, core) {
    const claimed = new Set(garden.stats?.missionsClaimed || []);
    return missionDefinitions.map(mission => ({
      id:mission.id,
      title:mission.title,
      description:mission.description,
      reward:mission.reward,
      claimed:claimed.has(mission.id),
      ready:!claimed.has(mission.id) && mission.test(garden, core),
    }));
  }

  function expireFocus(garden, now = Date.now()) {
    const focus = garden.focus;
    if (!focus || now - Number(focus.lastHeartbeatAt || 0) <= 90000) return false;
    const plant = garden.items.find(item => item.id === focus.plantId);
    if (plant) {
      plant.state = 'wilted';
      plant.progress = Math.min(.95, focus.activeSeconds / focus.durationSeconds);
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

  async function gardenContext() {
    const {core, catalog} = gardenRuntime();
    const sdk = getClient();
    const {data, error} = await sdk.auth.getUser();
    if (error || !data.user) throw error || new Error('Sessiya tugagan. Qayta kiring.');
    const user = await loadProfile(data.user);
    if (!user) throw new Error('Avval hisobga kiring.');
    const garden = core.normalizeGarden(user.garden);
    const expired = expireFocus(garden);
    return {core, catalog, user, garden, expired};
  }

  async function persistGarden(context, options = {}) {
    const publicGarden = context.core.publicGarden(context.garden);
    const impulse = Number.isFinite(options.impulse) ? Math.max(0, options.impulse) : Math.max(0, Number(context.user.impulse) || 0);
    const user = await sync(
      {garden:publicGarden, impulse, lifetimeImpulse:Number(context.user.lifetimeImpulse) || 0},
      {economy:true, lifetimeGain:Math.max(0, Number(options.lifetimeGain) || 0)},
    );
    context.user = user;
    context.garden = context.core.normalizeGarden(user.garden || publicGarden);
    localStorage.setItem('idrokGarden', JSON.stringify(context.garden));
    window.dispatchEvent(new CustomEvent('idrok:garden-update', {detail:context.core.publicGarden(context.garden)}));
    return user;
  }

  function normalizeRotation(value) {
    return ((Math.round(Number(value) || 0) / 90) * 90 % 360 + 360) % 360;
  }

  async function performGardenRequest(path, options = {}) {
    const context = await gardenContext();
    const {core, catalog, garden} = context;
    const body = requestBody(options);
    let impulse = Math.max(0, Number(context.user.impulse) || 0);
    let lifetimeGain = 0;

    if (path === '/api/garden') {
      if (context.expired) await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse, unlimitedImpulse:context.user.role==='admin', catalog:catalog.catalog, expansions:catalog.expansions, missions:missionsFor(context.garden, core)};
    }

    if (path === '/api/garden/world') return {plots:[]};

    if (path === '/api/garden/focus/heartbeat' && context.expired) {
      await persistGarden(context, {impulse});
      throw Object.assign(new Error('Fokus sessiyasi uzilib qoldi va o‘simlik quridi.'), {garden:core.publicGarden(context.garden)});
    }

    if (path === '/api/garden/purchase') {
      const item = catalog.byId[String(body.catalogId || '')];
      const x = Math.floor(Number(body.x));
      const y = Math.floor(Number(body.y));
      const rotation = normalizeRotation(body.rotation);
      if (!item) throw new Error('Bog‘ elementi topilmadi.');
      if (!core.canPlace(garden, item.id, x, y, rotation)) throw new Error('Bu joy band yoki bog‘ chegarasidan tashqarida.');
      if (context.user.role !== 'admin' && impulse < item.price) throw new Error(`Bu element uchun ${item.price} Impulse kerak.`);
      const placed = {id:core.makeId(), catalogId:item.id, x, y, rotation, state:item.type==='plant'?'seed':'placed', progress:0, variant:Math.floor(Math.random()*6), plantedAt:new Date().toISOString(), maturedAt:null};
      garden.items.push(placed);
      garden.stats.impulseSpent += item.price;
      if (context.user.role !== 'admin') impulse -= item.price;
      garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse:context.user.role==='admin'?999999999:impulse, item:placed};
    }

    if (path === '/api/garden/move') {
      const item = garden.items.find(entry => entry.id === String(body.itemId || ''));
      if (!item) throw new Error('Bog‘ elementi topilmadi.');
      const x = Math.floor(Number(body.x));
      const y = Math.floor(Number(body.y));
      const rotation = normalizeRotation(body.rotation ?? item.rotation);
      if (!core.canPlace(garden, item.catalogId, x, y, rotation, item.id)) throw new Error('Bu joyga elementni joylashtirib bo‘lmaydi.');
      item.x = x; item.y = y; item.rotation = rotation; garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse};
    }

    if (path === '/api/garden/layout') {
      if (!Array.isArray(body.items) || body.items.length !== garden.items.length) throw new Error('Joylashuv ma’lumoti to‘liq emas.');
      const byId = new Map(garden.items.map(item => [item.id, item]));
      const candidate = {...garden, items:[]};
      for (const raw of body.items) {
        const original = byId.get(String(raw.id || ''));
        if (!original) throw new Error('Noma’lum bog‘ elementi.');
        const x = Math.floor(Number(raw.x));
        const y = Math.floor(Number(raw.y));
        const rotation = normalizeRotation(raw.rotation);
        if (!core.canPlace(candidate, original.catalogId, x, y, rotation)) throw new Error('Elementlar bir-birining ustiga tushib qoldi.');
        candidate.items.push({...original, x, y, rotation});
      }
      garden.items = candidate.items; garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse};
    }

    if (path === '/api/garden/sell') {
      const index = garden.items.findIndex(item => item.id === String(body.itemId || ''));
      if (index < 0) throw new Error('Sotiladigan element topilmadi.');
      const item = garden.items[index];
      const catalogItem = catalog.byId[item.catalogId];
      if (garden.focus?.plantId === item.id) throw new Error('Fokusdagi o‘simlikni sotib bo‘lmaydi.');
      const refund = Math.max(1, Math.floor(catalogItem.price * .65));
      garden.items.splice(index, 1); garden.stats.itemsSold += 1; impulse += refund; garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse, refund};
    }

    if (path === '/api/garden/expand') {
      const next = catalog.expansions.find(item => item.level === garden.level + 1);
      if (!next) throw new Error('Bog‘ allaqachon eng katta darajada.');
      if (context.user.role !== 'admin' && impulse < next.price) throw new Error(`Bog‘ni kengaytirish uchun ${next.price} Impulse kerak.`);
      if (context.user.role !== 'admin') impulse -= next.price;
      garden.level = next.level; garden.stats.impulseSpent += next.price; garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse:context.user.role==='admin'?999999999:impulse};
    }

    if (path === '/api/garden/mission/claim') {
      const mission = missionDefinitions.find(item => item.id === String(body.missionId || ''));
      if (!mission) throw new Error('Vazifa topilmadi.');
      if (garden.stats.missionsClaimed.includes(mission.id)) throw new Error('Bu mukofot allaqachon olingan.');
      if (!mission.test(garden, core)) throw new Error('Vazifa hali bajarilmagan.');
      garden.stats.missionsClaimed.push(mission.id); impulse += mission.reward; lifetimeGain = mission.reward; garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse, lifetimeGain});
      return {garden:core.publicGarden(context.garden), impulse, reward:mission.reward, missions:missionsFor(context.garden, core)};
    }

    if (path === '/api/garden/focus/start') {
      if (garden.focus) throw new Error('Avval joriy fokus sessiyasini yakunlang.');
      const plant = garden.items.find(item => item.id === String(body.plantId || ''));
      const item = plant && catalog.byId[plant.catalogId];
      if (!plant || item?.type !== 'plant') throw new Error('O‘stiriladigan o‘simlik topilmadi.');
      if (!['seed','wilted'].includes(plant.state)) throw new Error('Bu o‘simlik allaqachon o‘sib bo‘lgan yoki o‘smoqda.');
      const now = Date.now();
      const durationSeconds = Math.round(item.minutes * 60 * (plant.state === 'wilted' ? .6 : 1));
      plant.state = 'growing'; plant.progress = 0;
      garden.focus = {id:core.makeId(), plantId:plant.id, status:'active', activeSeconds:0, durationSeconds, startedAt:now, lastHeartbeatAt:now, lastActiveAt:now};
      garden.updatedAt = new Date(now).toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse};
    }

    if (path === '/api/garden/focus/heartbeat') {
      const now = Date.now();
      if (expireFocus(garden, now)) {
        await persistGarden(context, {impulse});
        throw Object.assign(new Error('Fokus sessiyasi uzilib qoldi va o‘simlik quridi.'), {garden:core.publicGarden(context.garden)});
      }
      const focus = garden.focus;
      if (!focus || focus.id !== String(body.sessionId || '')) throw new Error('Faol fokus sessiyasi topilmadi.');
      if (body.active !== true || body.learning !== true) return {garden:core.publicGarden(garden), completed:false, counted:false};
      const elapsed = Math.min(15, Math.max(0, (now - focus.lastHeartbeatAt) / 1000));
      focus.activeSeconds = Math.min(focus.durationSeconds, focus.activeSeconds + elapsed);
      focus.lastHeartbeatAt = now; focus.lastActiveAt = now; garden.stats.totalFocusSeconds += elapsed;
      const plant = garden.items.find(item => item.id === focus.plantId);
      if (plant) plant.progress = Math.min(1, focus.activeSeconds / focus.durationSeconds);
      const completed = completeFocus(garden, now); garden.updatedAt = new Date(now).toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), completed, counted:true};
    }

    if (path === '/api/garden/focus/abandon') {
      const focus = garden.focus;
      if (!focus || focus.id !== String(body.sessionId || '')) throw new Error('Faol fokus sessiyasi topilmadi.');
      const plant = garden.items.find(item => item.id === focus.plantId);
      if (plant) { plant.state = 'wilted'; plant.progress = Math.min(.95, focus.activeSeconds / focus.durationSeconds); }
      garden.stats.failedSessions += 1; garden.focus = null; garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden), impulse};
    }

    if (path === '/api/garden/settings') {
      if (['day','sunset','night'].includes(body.timeOfDay)) garden.settings.timeOfDay = body.timeOfDay;
      if (['low','high'].includes(body.quality)) garden.settings.quality = body.quality;
      if (typeof body.sound === 'boolean') garden.settings.sound = body.sound;
      if (body.camera && typeof body.camera === 'object') garden.camera = {...garden.camera, ...body.camera};
      garden.updatedAt = new Date().toISOString();
      await persistGarden(context, {impulse});
      return {garden:core.publicGarden(context.garden)};
    }

    throw new Error('Bog‘ amali topilmadi.');
  }

  function gardenRequest(path, options = {}) {
    const operation = () => performGardenRequest(path, options);
    const pending = gardenQueue.then(operation, operation);
    gardenQueue = pending.catch(() => null);
    return pending;
  }

  async function request(path, options = {}) {
    if (path === '/api/me') return {user: await ready()};
    if (path === '/api/progress') return {ok: true, user: await sync(JSON.parse(options.body || '{}'))};
    if (path === '/api/logout') { await logout(); return {ok: true}; }
    if (path === '/api/leaderboard') return {leaders: await leaderboard()};
    if (path.startsWith('/api/garden')) return gardenRequest(path, options);
    if (path === '/api/health') return {ok:true, service:'Idrok Supabase', mode:'cloud'};
    if (path === '/api/lesson-complete') {
      const body = requestBody(options);
      return {notification:{id:crypto.randomUUID(), type:'lesson', title:`${body.title || 'Fizika darsi'} yakunlandi`, message:`${body.completedCount || 1} ta mavzu yakunlandi. Davom eting!`, createdAt:new Date().toISOString()}, email:{status:'not_configured'}};
    }
    if (path === '/api/course-complete') return {verified:false, kind:'completion-badge', message:'Kurs yakunlandi.'};
    throw new Error('Bu xizmat hali production hisobiga ulanmagan.');
  }

  window.IDROK_AUTH = {configured, ready, signInWithGoogle, providers, sync, leaderboard, logout, request, current: () => cachedUser};
})();

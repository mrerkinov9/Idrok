(function () {
  'use strict';

  const config = window.IDROK_AUTH_CONFIG || {};
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl || '') && /^sb_(?:publishable|anon)_/i.test(config.supabaseKey || '');
  const courseFields = ['physics7State', 'physics8State', 'physicsState', 'physics10State', 'physics11State'];
  let client = null;
  let bootPromise = null;
  let cachedUser = null;
  let profileStoreAvailable = true;

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
      email: user.email,
      impulse: Number(user.impulse) || 0,
      lifetime_impulse: Math.max(Number(user.lifetimeImpulse) || 0, Number(user.impulse) || 0),
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

  async function sendOtp({email, name = '', create = false}) {
    const sdk = getClient();
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) throw new Error('To‘g‘ri email manzilini kiriting.');
    if (create && String(name || '').trim().length < 3) throw new Error('Ism va familiyangizni to‘liq kiriting.');
    const {error} = await sdk.auth.signInWithOtp({
      email: cleanEmail,
      options: {shouldCreateUser: create, data: {full_name: String(name || '').trim(), ...(create ? {initial_impulse: 50} : {})}},
    });
    if (error) throw error;
    sessionStorage.setItem('idrokPendingAuth', JSON.stringify({email: cleanEmail, name: String(name || '').trim(), create, sentAt: Date.now()}));
    return {email: cleanEmail};
  }

  async function verifyOtp({email, code}) {
    const sdk = getClient();
    const cleanCode = String(code || '').replace(/\D/g, '');
    if (cleanCode.length !== 6) throw new Error('Emailga kelgan 6 xonali kodni kiriting.');
    const {data, error} = await sdk.auth.verifyOtp({email: String(email || '').trim().toLowerCase(), token: cleanCode, type: 'email'});
    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Kod tasdiqlanmadi. Yangi kod so‘rab ko‘ring.');
    sessionStorage.removeItem('idrokPendingAuth');
    const user = await loadProfile(data.user);
    return {token: data.session.access_token, user};
  }

  async function signInWithGoogle() {
    const sdk = getClient();
    const redirectTo = `${location.origin}${location.pathname}`;
    const {data, error} = await sdk.auth.signInWithOAuth({provider: 'google', options: {redirectTo}});
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

  async function sync(payload = {}) {
    const sdk = getClient();
    const {data: authData, error: authError} = await sdk.auth.getUser();
    if (authError || !authData.user) throw authError || new Error('Sessiya tugagan. Qayta kiring.');
    const previous = cachedUser || await loadProfile(authData.user);
    const merged = {...previous, ...payload, id: authData.user.id, email: authData.user.email || previous.email};
    merged.lifetimeImpulse = Math.max(Number(previous.lifetimeImpulse) || 0, Number(previous.impulse) || 0) + Math.max(0, (Number(merged.impulse) || 0) - (Number(previous.impulse) || 0));
    merged.completed = [...new Set([...(previous.completed || []), ...(Array.isArray(payload.completed) ? payload.completed : [])])];
    merged.score = Math.max(Number(previous.score) || 0, Number(payload.score) || 0);
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

  async function request(path, options = {}) {
    if (path === '/api/me') return {user: await ready()};
    if (path === '/api/progress') return {ok: true, user: await sync(JSON.parse(options.body || '{}'))};
    if (path === '/api/logout') { await logout(); return {ok: true}; }
    if (path === '/api/leaderboard') return {leaders: await leaderboard()};
    throw new Error('Bu xizmat hali production hisobiga ulanmagan.');
  }

  window.IDROK_AUTH = {configured, ready, sendOtp, verifyOtp, signInWithGoogle, providers, sync, leaderboard, logout, request, current: () => cachedUser};
})();

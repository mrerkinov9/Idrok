(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const TAU = Math.PI * 2;
  const reward = 45;
  const lessonId = 'l5';
  const embedded = new URLSearchParams(location.search).get('embed') === '1';
  const course = window.PHYSICS_COURSE;

  if (!course || !Array.isArray(course.lessons) || course.lessons.length !== 59) {
    document.body.innerHTML = '<main><h1>Gaz laboratoriyasi yuklanmadi</h1><p>Sahifani qayta ochib ko‘ring.</p></main>';
    return;
  }

  const canvas = $('#gasCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const chamber = {x: 82, y: 140, h: 390, minW: 455, maxW: 690, w: 620};
  const pump = {x: 925, restY: 275, minY: 275, maxY: 405, y: 275, maxPull: 0};
  const heaterTrack = {x: 405, y: 630, w: 220};
  const particles = [];

  const readJSON = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : JSON.parse(JSON.stringify(fallback));
    } catch { return JSON.parse(JSON.stringify(fallback)); }
  };
  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const globalState = readJSON('idrokState', {completed: [], score: 0, impulse: 0, theme: 'light'});
  globalState.completed = Array.isArray(globalState.completed) ? globalState.completed : [];
  globalState.impulse = Number(globalState.impulse) || 0;
  globalState.score = Number(globalState.score) || 0;
  const labCourse = readJSON('idrokLabCourse', {completed: [], awarded: [], best: {}, last: lessonId});
  labCourse.completed = Array.isArray(labCourse.completed) ? labCourse.completed : [];
  labCourse.awarded = Array.isArray(labCourse.awarded) ? labCourse.awarded : [];
  labCourse.best = labCourse.best && typeof labCourse.best === 'object' ? labCourse.best : {};
  labCourse.last = lessonId;

  const state = {
    selected: 'heavy',
    running: true,
    heat: 0,
    freePiston: false,
    pistonVelocity: 0,
    showVectors: false,
    showRuler: false,
    showCollisions: false,
    collisions: 0,
    collisionRate: 0,
    collisionWindow: 0,
    dragMode: '',
    pointerId: null,
    view: 'lab',
    completed: false,
    completionHold: 0,
    temperature: 300,
    pressure: 0,
    volume: 0,
    lastFrame: performance.now(),
    lastUi: 0,
    graphTimer: 0,
    graph: [],
    pumpReturning: false,
    observation: 'Zarralar devorlarga urilganda bosim hosil bo‘ladi. Nasosni sinab ko‘ring.',
  };

  function speciesInfo(kind) {
    return kind === 'light'
      ? {mass: 1, radius: 5.2, color: '#ff7258', glow: '#ffb06e'}
      : {mass: 4, radius: 7.2, color: '#7779ff', glow: '#b5b7ff'};
  }

  function measuredTemperature() {
    if (!particles.length) return 0;
    const energy = particles.reduce((sum, particle) => sum + .5 * particle.mass * (particle.vx ** 2 + particle.vy ** 2), 0) / particles.length;
    return clamp(energy / 40.5, 0, 999);
  }

  function measuredVolume() {
    return 30 + (chamber.w - chamber.minW) / (chamber.maxW - chamber.minW) * 50;
  }

  function measuredPressure() {
    if (!particles.length) return 0;
    return particles.length * Math.max(state.temperature, 1) / Math.max(state.volume, 1) * .0062;
  }

  function randomVelocity(kind, temperature = Math.max(state.temperature, 300)) {
    const info = speciesInfo(kind);
    const speed = 9 * Math.sqrt(Math.max(temperature, 80) / info.mass) * (.82 + Math.random() * .36);
    const angle = Math.random() * TAU;
    return {vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed};
  }

  function addParticles(kind, amount, silent = false) {
    const count = Math.min(amount, 180 - particles.length);
    const info = speciesInfo(kind);
    for (let index = 0; index < count; index++) {
      const velocity = randomVelocity(kind);
      let x = chamber.x + 45;
      let y = chamber.y + chamber.h / 2;
      for (let attempt = 0; attempt < 80; attempt++) {
        const candidateX = chamber.x + 28 + Math.random() * Math.max(80, chamber.w - 68);
        const candidateY = chamber.y + 28 + Math.random() * (chamber.h - 56);
        const overlaps = particles.some(particle => Math.hypot(candidateX - particle.x, candidateY - particle.y) < info.radius + particle.radius + 3);
        x = candidateX;
        y = candidateY;
        if (!overlaps) break;
      }
      particles.push({
        kind,
        mass: info.mass,
        radius: info.radius,
        color: info.color,
        glow: info.glow,
        x,
        y,
        vx: velocity.vx,
        vy: velocity.vy,
      });
    }
    if (!silent && count) {
      state.observation = `${count} ta ${kind === 'heavy' ? 'og‘ir' : 'yengil'} zarracha kirdi. Zarralar ko‘paygani uchun devor bilan to‘qnashuvlar ham ortadi.`;
      $('#gasStageTip').classList.add('hidden');
      showToast(`Nasos kameraga ${count} ta zarracha kiritdi.`);
    }
  }

  function removeParticles(kind, amount) {
    let remaining = amount;
    for (let index = particles.length - 1; index >= 0 && remaining > 0; index--) {
      if (particles[index].kind === kind) {
        particles.splice(index, 1);
        remaining--;
      }
    }
    state.observation = 'Zarralar soni kamayganda bir xil hajm va temperaturada bosim pasayadi.';
  }

  function setParticleTemperature(target) {
    const current = measuredTemperature();
    if (!particles.length || current <= 0) return;
    const scale = Math.sqrt(clamp(target, 75, 950) / current);
    particles.forEach(particle => { particle.vx *= scale; particle.vy *= scale; });
  }

  function resetSimulation() {
    particles.length = 0;
    chamber.w = 620;
    pump.y = pump.restY;
    pump.maxPull = 0;
    state.running = true;
    state.heat = 0;
    state.freePiston = false;
    state.pistonVelocity = 0;
    state.showVectors = false;
    state.showRuler = false;
    state.showCollisions = false;
    state.collisions = 0;
    state.collisionRate = 0;
    state.collisionWindow = 0;
    state.dragMode = '';
    state.completed = false;
    state.completionHold = 0;
    state.graph.length = 0;
    state.observation = 'Zarralar devorlarga urilganda bosim hosil bo‘ladi. Nasosni sinab ko‘ring.';
    $('#heatControl').value = '0';
    $('#freePiston').checked = false;
    $('#showVectors').checked = false;
    $('#showRuler').checked = false;
    $('#showCollisions').checked = false;
    $('#gasMission').classList.remove('done');
    $('#gasStageTip').classList.remove('hidden');
    addParticles('heavy', 50, true);
    setParticleTemperature(300);
    updateMeasurements();
    updateUi(true);
    updateTimingUi();
    showToast('Tajriba boshlang‘ich holatga qaytdi.');
  }

  function updateMeasurements() {
    state.temperature = measuredTemperature();
    state.volume = measuredVolume();
    state.pressure = measuredPressure();
  }

  function resolveParticleCollision(first, second) {
    const dx = second.x - first.x;
    const dy = second.y - first.y;
    const minDistance = first.radius + second.radius;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared <= 0 || distanceSquared >= minDistance * minDistance) return;
    const distance = Math.sqrt(distanceSquared);
    const nx = dx / distance;
    const ny = dy / distance;
    const overlap = minDistance - distance;
    const totalMass = first.mass + second.mass;
    first.x -= nx * overlap * second.mass / totalMass;
    first.y -= ny * overlap * second.mass / totalMass;
    second.x += nx * overlap * first.mass / totalMass;
    second.y += ny * overlap * first.mass / totalMass;
    const relativeVelocity = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
    if (relativeVelocity >= 0) return;
    const impulse = -2 * relativeVelocity / (1 / first.mass + 1 / second.mass);
    first.vx -= impulse * nx / first.mass;
    first.vy -= impulse * ny / first.mass;
    second.vx += impulse * nx / second.mass;
    second.vy += impulse * ny / second.mass;
    state.collisions++;
  }

  function physicsStep(dt) {
    dt = clamp(dt, .001, .032);
    updateMeasurements();

    if (state.heat && particles.length) {
      const factor = 1 + state.heat * (state.heat > 0 ? .20 : .15) * dt;
      particles.forEach(particle => { particle.vx *= factor; particle.vy *= factor; });
      const afterHeat = measuredTemperature();
      if (afterHeat < 75) setParticleTemperature(75);
      if (afterHeat > 950) setParticleTemperature(950);
    }

    if (state.freePiston && state.dragMode !== 'piston') {
      const externalPressure = 1.55;
      state.pistonVelocity += (state.pressure - externalPressure) * 42 * dt;
      state.pistonVelocity *= Math.pow(.34, dt);
      chamber.w = clamp(chamber.w + state.pistonVelocity * dt * 12, chamber.minW, chamber.maxW);
      if (chamber.w === chamber.minW || chamber.w === chamber.maxW) state.pistonVelocity *= -.18;
    }

    const right = chamber.x + chamber.w - 13;
    const left = chamber.x + 13;
    const top = chamber.y + 13;
    const bottom = chamber.y + chamber.h - 13;
    particles.forEach(particle => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      if (particle.x - particle.radius < left) {
        particle.x = left + particle.radius;
        particle.vx = Math.abs(particle.vx);
        state.collisions++;
      }
      if (particle.x + particle.radius > right) {
        particle.x = right - particle.radius;
        particle.vx = state.freePiston ? Math.min(2 * state.pistonVelocity - particle.vx, -Math.abs(particle.vx) * .35) : -Math.abs(particle.vx);
        state.collisions++;
      }
      if (particle.y - particle.radius < top) {
        particle.y = top + particle.radius;
        particle.vy = Math.abs(particle.vy);
        state.collisions++;
      }
      if (particle.y + particle.radius > bottom) {
        particle.y = bottom - particle.radius;
        particle.vy = -Math.abs(particle.vy);
        state.collisions++;
      }
    });

    for (let firstIndex = 0; firstIndex < particles.length; firstIndex++) {
      for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex++) {
        resolveParticleCollision(particles[firstIndex], particles[secondIndex]);
      }
    }

    if (state.pumpReturning && state.dragMode !== 'pump') {
      pump.y = lerp(pump.y, pump.restY, clamp(dt * 11, 0, 1));
      if (Math.abs(pump.y - pump.restY) < 1) { pump.y = pump.restY; state.pumpReturning = false; }
    }

    state.collisionWindow += dt;
    if (state.collisionWindow >= .5) {
      state.collisionRate = Math.round(state.collisions / state.collisionWindow);
      state.collisions = 0;
      state.collisionWindow = 0;
    }

    updateMeasurements();
    state.graphTimer += dt;
    if (state.graphTimer >= .18) {
      state.graphTimer = 0;
      state.graph.push({temperature: state.temperature, pressure: state.pressure, volume: state.volume});
      if (state.graph.length > 150) state.graph.shift();
    }

    checkMission(dt);
  }

  function missionState() {
    const particlesOk = particles.length >= 70;
    const temperatureOk = state.temperature >= 420 && state.temperature <= 520;
    const pressureOk = state.pressure >= 2.5 && state.pressure <= 5.5;
    return {particlesOk, temperatureOk, pressureOk, count: Number(particlesOk) + Number(temperatureOk) + Number(pressureOk)};
  }

  function checkMission(dt) {
    if (state.completed) return;
    const mission = missionState();
    if (mission.count === 3) {
      state.completionHold += dt;
      if (state.completionHold >= 1.1) completeLab();
    } else {
      state.completionHold = 0;
    }
  }

  function syncUser() {
    const email = localStorage.getItem('idrokCurrentUser') || '';
    if (!email) return;
    const users = readJSON('idrokUsers', []);
    if (!Array.isArray(users)) return;
    const user = users.find(item => item.email === email);
    if (!user) return;
    user.impulse = globalState.impulse;
    user.score = globalState.score;
    user.completed = [...globalState.completed];
    user.labCourse = JSON.parse(JSON.stringify(labCourse));
    writeJSON('idrokUsers', users);
  }

  function persistCompletion() {
    writeJSON('idrokLabCourse', labCourse);
    writeJSON('idrokState', globalState);
    const legacy = readJSON('idrokLabState', {completed: []});
    legacy.completed = Array.isArray(legacy.completed) ? legacy.completed : [];
    if (!legacy.completed.includes(lessonId)) legacy.completed.push(lessonId);
    writeJSON('idrokLabState', legacy);
    const physics = readJSON('idrokPhysics', {version: course.version, completed: [], scores: {}, current: lessonId, stages: {}});
    physics.stages = physics.stages && typeof physics.stages === 'object' ? physics.stages : {};
    physics.stages[lessonId] = physics.stages[lessonId] || {nazariya:false,video:false,misol:false,tajriba:false,simulyatsiya:false,quiz:false};
    physics.stages[lessonId].simulyatsiya = true;
    physics.current = lessonId;
    physics.lastActivity = Date.now();
    writeJSON('idrokPhysics', physics);
    syncUser();
  }

  function completeLab() {
    if (state.completed) return;
    state.completed = true;
    if (!labCourse.completed.includes(lessonId)) labCourse.completed.push(lessonId);
    if (!labCourse.awarded.includes(lessonId)) {
      labCourse.awarded.push(lessonId);
      globalState.impulse += reward;
      globalState.score += 10;
      if (!globalState.completed.includes(`lab-${lessonId}`)) globalState.completed.push(`lab-${lessonId}`);
    }
    labCourse.best[lessonId] = 100;
    persistCompletion();
    updateAccountUi();
    $('#gasMission').classList.add('done');
    $('#gasMissionStatus').textContent = 'Bajarildi — gaz qonunini o‘zingiz boshqardingiz!';
    state.observation = 'Missiya bajarildi: zarrachalar soni, temperatura va hajm birgalikda bosimni belgilashini amalda ko‘rdingiz.';
    launchConfetti();
    showToast(`Ajoyib! +${reward} Impulse olindi.`);
    if (embedded && window.parent !== window) window.parent.postMessage({type:'idrok-lab-complete', lessonId}, '*');
  }

  function countByKind(kind) {
    return particles.reduce((count, particle) => count + Number(particle.kind === kind), 0);
  }

  function updateUi(force = false) {
    const now = performance.now();
    if (!force && now - state.lastUi < 80) return;
    state.lastUi = now;
    const heavy = countByKind('heavy');
    const light = countByKind('light');
    const mission = missionState();
    const progress = state.completed ? 100 : Math.round(mission.count / 3 * 100);
    labCourse.best[lessonId] = Math.max(Number(labCourse.best[lessonId]) || 0, progress);
    $('#totalParticles').textContent = `${particles.length} ta`;
    $('#heavyCount').textContent = String(heavy);
    $('#lightCount').textContent = String(light);
    $('#temperatureReadout').textContent = `${Math.round(state.temperature)} K`;
    $('#pressureReadout').textContent = `${state.pressure.toFixed(1)} atm`;
    $('#volumeReadout').textContent = `${Math.round(state.volume)} L`;
    $('#collisionReadout').textContent = `${state.collisionRate} ta/s`;
    $('#goalParticlesValue').textContent = `${particles.length} / 70`;
    $('#goalTemperatureValue').textContent = `${Math.round(state.temperature)} K`;
    $('#goalPressureValue').textContent = `${state.pressure.toFixed(1)} atm`;
    $('#goalParticles').classList.toggle('done', mission.particlesOk);
    $('#goalTemperature').classList.toggle('done', mission.temperatureOk);
    $('#goalPressure').classList.toggle('done', mission.pressureOk);
    $('#gasMissionProgress').style.width = `${progress}%`;
    if (!state.completed) {
      const next = !mission.particlesOk ? 'Avval zarrachalar sonini oshiring' : !mission.temperatureOk ? 'Gazni 420–520 K gacha qizdiring' : !mission.pressureOk ? 'Porshen bilan bosimni moslang' : 'Natijani ushlab turing';
      $('#gasMissionStatus').textContent = `${next} • ${progress}%`;
    }
    $('#gasObservation').textContent = state.observation;
    const heatText = state.heat > .08 ? `Qizdirish ${Math.round(state.heat * 100)}%` : state.heat < -.08 ? `Sovitish ${Math.round(Math.abs(state.heat) * 100)}%` : 'Neytral';
    $('#heatOutput').textContent = heatText;
    document.body.dataset.gasTemperature = String(Math.round(state.temperature));
    document.body.dataset.gasPressure = state.pressure.toFixed(2);
    document.body.dataset.gasVolume = state.volume.toFixed(1);
    document.body.dataset.gasParticles = String(particles.length);
    document.body.dataset.gasProgress = String(progress);
  }

  function updateAccountUi() {
    const users = readJSON('idrokUsers', []);
    const email = localStorage.getItem('idrokCurrentUser') || '';
    const user = Array.isArray(users) ? users.find(item => item.email === email) : null;
    const name = user?.name || 'Izlanuvchi';
    const done = labCourse.completed.length;
    $('#gasImpulse').textContent = String(globalState.impulse);
    $('#gasSideImpulse').textContent = String(globalState.impulse);
    $('#gasSidePercent').textContent = `${Math.round(done / 59 * 100)}%`;
    $('#gasSideMeta').textContent = `${done} / 59 bajarildi`;
    $('#gasUserName').textContent = name;
    $('#gasAvatar').textContent = name.slice(0, 2).toUpperCase();
  }

  function updateTimingUi() {
    $('#gasPause').innerHTML = state.running ? '<span>Ⅱ</span> Pauza' : '<span>▶</span> Davom';
    $('#gasPause').setAttribute('aria-pressed', String(!state.running));
    $('#gasStep').disabled = state.running;
    $('#gasRunState').textContent = state.running ? 'ISHLAMOQDA' : 'PAUZADA';
    $('#gasRunState').classList.toggle('paused', !state.running);
  }

  function showToast(message) {
    const toast = $('#gasToast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function launchConfetti() {
    const host = $('#gasConfetti');
    host.innerHTML = '';
    const colors = ['#6d5df2','#1ccbc1','#ffd35e','#ff6b7f','#2d8df4','#49d69b'];
    for (let index = 0; index < 70; index++) {
      const piece = document.createElement('i');
      piece.style.left = `${4 + Math.random() * 92}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * .32}s`;
      piece.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
      piece.style.setProperty('--spin', `${360 + Math.random() * 900}deg`);
      host.appendChild(piece);
    }
    setTimeout(() => { host.innerHTML = ''; }, 2400);
  }

  function roundRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function fillRound(x, y, width, height, radius, fill, stroke, lineWidth = 1) {
    roundRect(ctx, x, y, width, height, radius);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }

  function text(value, x, y, size, color, weight = 600, align = 'left') {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Inter, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);
  }

  function drawGauge(x, y, radius, pressure, colors) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.25)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = colors.metal;
    ctx.beginPath(); ctx.arc(x, y, radius + 8, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#5d6674'; ctx.lineWidth = 3; ctx.stroke();
    for (let index = 0; index <= 20; index++) {
      const angle = Math.PI * .75 + index / 20 * Math.PI * 1.5;
      const inner = radius - (index % 5 === 0 ? 15 : 9);
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      ctx.lineTo(x + Math.cos(angle) * (radius - 3), y + Math.sin(angle) * (radius - 3));
      ctx.strokeStyle = index > 15 ? '#e74e62' : '#374151';
      ctx.lineWidth = index % 5 === 0 ? 3 : 1.5;
      ctx.stroke();
    }
    const angle = Math.PI * .75 + clamp(pressure / 8, 0, 1) * Math.PI * 1.5;
    ctx.strokeStyle = '#e5485c'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle) * (radius - 17), y + Math.sin(angle) * (radius - 17)); ctx.stroke();
    ctx.fillStyle = '#273142'; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
    text('BOSIM', x, y + 23, 10, '#4b5563', 800, 'center');
    text(`${pressure.toFixed(1)} atm`, x, y + 42, 13, '#111827', 800, 'center');
    ctx.restore();
  }

  function drawThermometer(x, y, height, temperature, colors) {
    const amount = clamp((temperature - 75) / 875, 0, 1);
    fillRound(x - 12, y, 24, height, 12, '#eef2f7', '#a6afbd', 2);
    const gradient = ctx.createLinearGradient(0, y + height, 0, y);
    gradient.addColorStop(0, '#3d8fee'); gradient.addColorStop(.5, '#ffbd50'); gradient.addColorStop(1, '#ed4e61');
    fillRound(x - 6, y + 8 + (height - 20) * (1 - amount), 12, (height - 16) * amount, 6, gradient);
    ctx.fillStyle = amount > .5 ? '#ec5363' : '#498ee7';
    ctx.beginPath(); ctx.arc(x, y + height + 13, 18, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#e8edf4'; ctx.lineWidth = 3; ctx.stroke();
    for (let index = 0; index < 9; index++) {
      const ty = y + 12 + index * (height - 24) / 8;
      ctx.strokeStyle = '#667085'; ctx.lineWidth = index % 2 ? 1 : 2;
      ctx.beginPath(); ctx.moveTo(x + 13, ty); ctx.lineTo(x + (index % 2 ? 20 : 25), ty); ctx.stroke();
    }
    fillRound(x - 38, y - 31, 76, 25, 7, '#f8fafc', '#b5bdc9', 1.5);
    text(`${Math.round(temperature)} K`, x, y - 18, 12, '#111827', 800, 'center');
  }

  function drawPump(colors) {
    const bodyY = 365;
    ctx.strokeStyle = colors.pipe; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(chamber.x + chamber.w + 15, chamber.y + chamber.h - 62); ctx.bezierCurveTo(835, 475, 850, 500, 875, 500); ctx.lineTo(887, 500); ctx.stroke();
    fillRound(882, bodyY, 86, 196, 18, colors.machine, colors.metalDark, 4);
    const glass = ctx.createLinearGradient(0, bodyY + 14, 0, bodyY + 180);
    glass.addColorStop(0, 'rgba(255,255,255,.86)'); glass.addColorStop(1, 'rgba(173,198,230,.45)');
    fillRound(900, bodyY + 17, 50, 154, 10, glass, '#8894a7', 2);
    const selectedColor = state.selected === 'heavy' ? '#7779ff' : '#ff7258';
    ctx.fillStyle = selectedColor;
    ctx.globalAlpha = .75;
    for (let index = 0; index < 7; index++) {
      ctx.beginPath(); ctx.arc(912 + (index % 3) * 13, bodyY + 118 + Math.floor(index / 3) * 14, state.selected === 'heavy' ? 5 : 4, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.metalDark; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(pump.x, pump.y + 20); ctx.lineTo(pump.x, bodyY + 65); ctx.stroke();
    fillRound(pump.x - 45, pump.y, 90, 24, 8, colors.metal, colors.metalDark, 3);
    for (let x = pump.x - 32; x <= pump.x + 32; x += 16) {
      ctx.strokeStyle = '#6f7783'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, pump.y + 3); ctx.lineTo(x, pump.y + 21); ctx.stroke();
    }
    fillRound(873, 559, 104, 24, 9, colors.metal, colors.metalDark, 2);
    text('NASOS', pump.x, 594, 11, colors.label, 800, 'center');
    text('dastakni torting', pump.x, 612, 9, colors.muted, 600, 'center');
  }

  function drawHeater(colors) {
    const gradient = ctx.createLinearGradient(heaterTrack.x, 0, heaterTrack.x + heaterTrack.w, 0);
    gradient.addColorStop(0, '#3186e8'); gradient.addColorStop(.5, '#e8edf4'); gradient.addColorStop(1, '#ed5265');
    fillRound(heaterTrack.x - 22, 579, heaterTrack.w + 44, 88, 18, colors.machine, colors.metalDark, 3);
    fillRound(heaterTrack.x, heaterTrack.y - 8, heaterTrack.w, 16, 8, gradient, 'rgba(255,255,255,.45)', 1);
    const knobX = heaterTrack.x + (state.heat + 1) / 2 * heaterTrack.w;
    ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(knobX, heaterTrack.y, 15, 0, TAU); ctx.fill();
    ctx.strokeStyle = state.heat > .08 ? '#ed5265' : state.heat < -.08 ? '#3186e8' : '#7b8492'; ctx.lineWidth = 5; ctx.stroke();
    text('SOVITISH', heaterTrack.x, 603, 9, '#7cc3ff', 800, 'center');
    text('QIZDIRISH', heaterTrack.x + heaterTrack.w, 603, 9, '#ff8f76', 800, 'center');
    text(state.heat > .08 ? 'ISSIQLIK BERILMOQDA' : state.heat < -.08 ? 'ENERGIYA OLINMOQDA' : 'NEYTRAL', heaterTrack.x + heaterTrack.w / 2, 653, 10, colors.label, 800, 'center');
  }

  function drawChamber(colors) {
    const right = chamber.x + chamber.w;
    const bottom = chamber.y + chamber.h;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
    fillRound(chamber.x - 16, chamber.y - 16, chamber.w + 32, chamber.h + 32, 12, 'rgba(2,7,18,.66)', colors.metal, 7);
    ctx.restore();
    const glass = ctx.createLinearGradient(chamber.x, chamber.y, chamber.x, bottom);
    glass.addColorStop(0, 'rgba(31,51,83,.25)');
    glass.addColorStop(.55, 'rgba(8,18,36,.05)');
    glass.addColorStop(1, 'rgba(47,85,126,.22)');
    ctx.fillStyle = glass; ctx.fillRect(chamber.x, chamber.y, chamber.w, chamber.h);
    ctx.strokeStyle = colors.glassEdge; ctx.lineWidth = 4; ctx.strokeRect(chamber.x, chamber.y, chamber.w, chamber.h);
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(chamber.x + 12, chamber.y + 12); ctx.lineTo(right - 16, chamber.y + 12); ctx.stroke();

    const pistonGradient = ctx.createLinearGradient(right - 15, 0, right + 28, 0);
    pistonGradient.addColorStop(0, '#aeb8c6'); pistonGradient.addColorStop(.5, '#f4f6fa'); pistonGradient.addColorStop(1, '#798493');
    fillRound(right - 13, chamber.y - 10, 36, chamber.h + 20, 8, pistonGradient, '#596373', 3);
    for (let y = chamber.y + 15; y < bottom - 10; y += 30) {
      ctx.strokeStyle = 'rgba(70,78,92,.42)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(right - 7, y); ctx.lineTo(right + 17, y); ctx.stroke();
    }
    ctx.strokeStyle = colors.metal; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(right + 23, chamber.y + chamber.h / 2); ctx.lineTo(right + 70, chamber.y + chamber.h / 2); ctx.stroke();
    fillRound(right + 58, chamber.y + chamber.h / 2 - 37, 28, 74, 9, colors.machine, colors.metalDark, 3);
    text(state.freePiston ? 'ERKIN' : 'SURING', right + 72, chamber.y + chamber.h / 2 + 55, 9, state.freePiston ? '#56e0c4' : colors.muted, 800, 'center');

    if (state.showRuler) {
      const y = bottom + 35;
      ctx.strokeStyle = '#dce5f5'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(chamber.x, y); ctx.lineTo(right, y); ctx.stroke();
      for (let index = 0; index <= 10; index++) {
        const x = chamber.x + chamber.w * index / 10;
        ctx.beginPath(); ctx.moveTo(x, y - (index % 5 === 0 ? 9 : 5)); ctx.lineTo(x, y + (index % 5 === 0 ? 9 : 5)); ctx.stroke();
      }
      text(`${Math.round(state.volume)} L`, chamber.x + chamber.w / 2, y + 22, 11, '#eef5ff', 800, 'center');
    }
  }

  function drawParticles() {
    particles.forEach(particle => {
      ctx.save();
      ctx.shadowColor = particle.glow; ctx.shadowBlur = 7;
      ctx.fillStyle = particle.color;
      ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.radius, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.68)';
      ctx.beginPath(); ctx.arc(particle.x - particle.radius * .28, particle.y - particle.radius * .3, particle.radius * .27, 0, TAU); ctx.fill();
      if (state.showVectors) {
        const scale = .18;
        ctx.strokeStyle = particle.kind === 'heavy' ? '#aeb0ff' : '#ffb292'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(particle.x, particle.y); ctx.lineTo(particle.x + particle.vx * scale, particle.y + particle.vy * scale); ctx.stroke();
        const angle = Math.atan2(particle.vy, particle.vx);
        const ex = particle.x + particle.vx * scale;
        const ey = particle.y + particle.vy * scale;
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - Math.cos(angle - .55) * 6, ey - Math.sin(angle - .55) * 6); ctx.lineTo(ex - Math.cos(angle + .55) * 6, ey - Math.sin(angle + .55) * 6); ctx.closePath(); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawGraph(colors) {
    const x = 95, y = 105, width = 850, height = 465;
    fillRound(x - 35, y - 35, width + 90, height + 95, 22, colors.graphPanel, colors.graphBorder, 2);
    text('GAZ HOLATINING JONLI GRAFIGI', x, y - 10, 15, colors.label, 800);
    text('Oxirgi 27 soniya', x + width, y - 10, 11, colors.muted, 600, 'right');
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
    for (let index = 0; index <= 5; index++) {
      const gy = y + height * index / 5;
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + width, gy); ctx.stroke();
    }
    for (let index = 0; index <= 10; index++) {
      const gx = x + width * index / 10;
      ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + height); ctx.stroke();
    }
    const series = [
      {key:'temperature', color:'#ff6b67', max:900, label:`T ${Math.round(state.temperature)} K`},
      {key:'pressure', color:'#27d4c5', max:8, label:`P ${state.pressure.toFixed(1)} atm`},
      {key:'volume', color:'#ffd35e', max:80, label:`V ${Math.round(state.volume)} L`},
    ];
    series.forEach((item, seriesIndex) => {
      ctx.strokeStyle = item.color; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath();
      state.graph.forEach((point, index) => {
        const px = x + (state.graph.length <= 1 ? 0 : index / (state.graph.length - 1) * width);
        const py = y + height - clamp(point[item.key] / item.max, 0, 1) * height;
        if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      fillRound(x + seriesIndex * 190, y + height + 23, 174, 36, 9, `${item.color}22`, item.color, 1.5);
      ctx.fillStyle = item.color; ctx.beginPath(); ctx.arc(x + 18 + seriesIndex * 190, y + height + 41, 5, 0, TAU); ctx.fill();
      text(item.label, x + 32 + seriesIndex * 190, y + height + 41, 11, colors.label, 800);
    });
    text('VAQT →', x + width, y + height + 42, 10, colors.muted, 800, 'right');
  }

  function drawLab() {
    const dark = document.body.classList.contains('dark');
    const colors = dark ? {
      backgroundTop:'#08101f', backgroundBottom:'#101d34', bench:'#17243c', benchEdge:'#273752', label:'#f0f5ff', muted:'#9aa9c4', metal:'#d5dbe5', metalDark:'#576273', machine:'#8893a4', pipe:'#aeb8c7', glassEdge:'rgba(213,227,247,.72)', graphPanel:'#111d33', graphBorder:'#2e3c58', grid:'rgba(180,199,229,.12)'
    } : {
      backgroundTop:'#07101f', backgroundBottom:'#11213b', bench:'#1b2c47', benchEdge:'#304462', label:'#f0f5ff', muted:'#9aa9c4', metal:'#d5dbe5', metalDark:'#576273', machine:'#8893a4', pipe:'#aeb8c7', glassEdge:'rgba(213,227,247,.75)', graphPanel:'#111d33', graphBorder:'#30415e', grid:'rgba(180,199,229,.12)'
    };
    const background = ctx.createLinearGradient(0, 0, 0, H);
    background.addColorStop(0, colors.backgroundTop); background.addColorStop(1, colors.backgroundBottom);
    ctx.fillStyle = background; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = colors.bench; ctx.fillRect(0, 540, W, 160);
    ctx.fillStyle = colors.benchEdge; ctx.fillRect(0, 540, W, 6);

    if (state.view === 'graph') {
      drawGraph(colors);
      return;
    }

    drawChamber(colors);
    drawParticles();
    drawThermometer(chamber.x + chamber.w - 135, 52, 92, state.temperature, colors);
    drawGauge(850, 145, 68, state.pressure, colors);
    drawPump(colors);
    drawHeater(colors);
    fillRound(38, 34, 205, 34, 9, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.14)', 1);
    text('pV = νRT', 55, 51, 13, '#7ee7dc', 800);
    text(`${particles.length} zarracha`, 223, 51, 10, '#b9c8df', 700, 'right');
    if (state.showCollisions) {
      fillRound(810, 238, 173, 42, 10, 'rgba(9,18,35,.72)', 'rgba(255,255,255,.13)', 1);
      text('TO‘QNASHUV', 826, 251, 8, '#8fa0bb', 800);
      text(`${state.collisionRate} ta/s`, 826, 267, 13, '#f1f5ff', 800);
    }
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {x:(event.clientX - rect.left) / rect.width * W, y:(event.clientY - rect.top) / rect.height * H};
  }

  function beginDrag(event) {
    const point = canvasPoint(event);
    const right = chamber.x + chamber.w;
    if (state.view !== 'lab') return;
    if (point.x >= right - 24 && point.x <= right + 95 && point.y >= chamber.y - 20 && point.y <= chamber.y + chamber.h + 30) {
      state.dragMode = 'piston';
      state.pistonVelocity = 0;
      state.observation = 'Porshenni siqsangiz hajm kamayadi; bir xil zarracha soni va temperaturada bosim ortadi.';
    } else if (point.x >= pump.x - 60 && point.x <= pump.x + 60 && point.y >= pump.y - 22 && point.y <= pump.y + 48) {
      state.dragMode = 'pump';
      pump.maxPull = 0;
      state.pumpReturning = false;
    } else if (point.x >= heaterTrack.x - 22 && point.x <= heaterTrack.x + heaterTrack.w + 22 && point.y >= heaterTrack.y - 32 && point.y <= heaterTrack.y + 32) {
      state.dragMode = 'heater';
      updateHeaterFromPoint(point);
    } else {
      return;
    }
    state.pointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('dragging');
    event.preventDefault();
  }

  function updateHeaterFromPoint(point) {
    state.heat = clamp((point.x - heaterTrack.x) / heaterTrack.w * 2 - 1, -1, 1);
    $('#heatControl').value = String(Math.round(state.heat * 100));
    state.observation = state.heat > .08 ? 'Qizdirilganda zarralarning o‘rtacha kinetik energiyasi va tezligi oshadi.' : state.heat < -.08 ? 'Sovitilganda zarralar sekinlashadi; devorga urilishlar kuchsizlanadi.' : 'Isitkich neytral holatda: gaz energiyasi deyarli o‘zgarmaydi.';
  }

  function moveDrag(event) {
    if (!state.dragMode || event.pointerId !== state.pointerId) return;
    const point = canvasPoint(event);
    if (state.dragMode === 'piston') {
      const oldWidth = chamber.w;
      chamber.w = clamp(point.x - chamber.x, chamber.minW, chamber.maxW);
      state.pistonVelocity = (chamber.w - oldWidth) * 18;
      particles.forEach(particle => { particle.x = Math.min(particle.x, chamber.x + chamber.w - particle.radius - 14); });
    } else if (state.dragMode === 'pump') {
      pump.y = clamp(point.y - 12, pump.minY, pump.maxY);
      pump.maxPull = Math.max(pump.maxPull, pump.y - pump.restY);
    } else if (state.dragMode === 'heater') {
      updateHeaterFromPoint(point);
    }
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.dragMode || event.pointerId !== state.pointerId) return;
    if (state.dragMode === 'pump') {
      if (pump.maxPull >= 65) addParticles(state.selected, 10);
      else showToast('Nasos dastagini pastroqqa torting.');
      state.pumpReturning = true;
    }
    state.dragMode = '';
    state.pointerId = null;
    canvas.classList.remove('dragging');
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }

  function setMenu(open) {
    $('#gasSidebar').classList.toggle('open', open);
    $('#gasOverlay').classList.toggle('open', open);
  }

  function setAi(open) {
    $('#gasAiPanel').classList.toggle('open', open);
    $('#gasAiPanel').setAttribute('aria-hidden', String(!open));
    $('#gasAiLauncher').setAttribute('aria-expanded', String(open));
  }

  function aiAnswer(kind) {
    const answers = {
      pressure: `<b>Bosim sababi:</b> zarrachalar kamera devoriga urilib impuls beradi. Zarralar soni yoki temperatura ortsa to‘qnashuvlar ko‘payadi. Hajm kamayganda esa ular devorga tez-tez uriladi.`,
      temperature: `<b>Temperatura:</b> molekulalarning o‘rtacha kinetik energiyasi o‘lchovi. Bir xil temperaturada yengil zarralar og‘ir zarralarga qaraganda tezroq harakat qiladi.`,
      mission: `<b>Yo‘l:</b> ikki marta nasosni tortib 70 ta zarrachaga chiqing. Isitkichni o‘ngga surib 420–520 K oralig‘iga keling. Bosim mos bo‘lmasa porshenni sekin suring.`,
    };
    const row = document.createElement('div');
    row.className = 'sim-ai-message';
    row.innerHTML = `<span>✦</span><p>${answers[kind] || answers.pressure}</p>`;
    $('#gasAiMessages').appendChild(row);
    $('#gasAiMessages').scrollTop = $('#gasAiMessages').scrollHeight;
  }

  function bindControls() {
    $$('input[name="species"]').forEach(input => input.addEventListener('change', () => {
      state.selected = input.value;
      $$('[data-species-card]').forEach(card => card.classList.toggle('selected', card.dataset.speciesCard === state.selected));
      state.observation = `${state.selected === 'heavy' ? 'Og‘ir' : 'Yengil'} zarracha tanlandi. Bir xil temperaturada yengil zarracha tezroq harakat qiladi.`;
    }));
    $('#addParticles').addEventListener('click', () => addParticles(state.selected, 10));
    $('#removeParticles').addEventListener('click', () => removeParticles(state.selected, 10));
    $('#heatControl').addEventListener('input', event => {
      state.heat = Number(event.target.value) / 100;
      state.observation = state.heat > .08 ? 'Gaz energiya olmoqda: molekulalar tezlashadi va temperatura ko‘tariladi.' : state.heat < -.08 ? 'Gaz energiya yo‘qotmoqda: molekulalar sekinlashadi va temperatura pasayadi.' : 'Isitkich neytral holatga qaytdi.';
      updateUi(true);
    });
    $('#freePiston').addEventListener('change', event => {
      state.freePiston = event.target.checked;
      state.pistonVelocity = 0;
      state.observation = state.freePiston ? 'Porshen erkin: ichki bosim tashqi bosimdan katta bo‘lsa kamera kengayadi.' : 'Porshen qulflandi. Endi uni qo‘lda sudrashingiz mumkin.';
    });
    $('#showVectors').addEventListener('change', event => { state.showVectors = event.target.checked; });
    $('#showRuler').addEventListener('change', event => { state.showRuler = event.target.checked; });
    $('#showCollisions').addEventListener('change', event => { state.showCollisions = event.target.checked; });
    $('#gasPause').addEventListener('click', () => { state.running = !state.running; updateTimingUi(); });
    $('#gasStep').addEventListener('click', () => { if (!state.running) { physicsStep(1 / 30); updateUi(true); drawLab(); } });
    $('#gasReset').addEventListener('click', resetSimulation);
    $$('[data-gas-view]').forEach(button => button.addEventListener('click', () => {
      state.view = button.dataset.gasView;
      $$('[data-gas-view]').forEach(item => item.classList.toggle('active', item === button));
    }));
    $('#gasTheme').addEventListener('click', () => {
      document.body.classList.toggle('dark');
      globalState.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
      writeJSON('idrokState', globalState);
    });
    $('#openGasMenu').addEventListener('click', () => setMenu(true));
    $('#closeGasMenu').addEventListener('click', () => setMenu(false));
    $('#gasOverlay').addEventListener('click', () => setMenu(false));
    $('#gasAiNav').addEventListener('click', () => { setMenu(false); setAi(true); });
    $('#gasAiLauncher').addEventListener('click', () => setAi(!$('#gasAiPanel').classList.contains('open')));
    $('#closeGasAi').addEventListener('click', () => setAi(false));
    $$('[data-gas-ai]').forEach(button => button.addEventListener('click', () => aiAnswer(button.dataset.gasAi)));
    canvas.addEventListener('pointerdown', beginDrag);
    canvas.addEventListener('pointermove', moveDrag);
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') { setMenu(false); setAi(false); }
      if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.metaKey && !/input|textarea|select/i.test(event.target.tagName)) resetSimulation();
      if (event.code === 'Space' && !/input|textarea|button|select/i.test(event.target.tagName)) { event.preventDefault(); state.running = !state.running; updateTimingUi(); }
    });
  }

  function frame(now) {
    const dt = Math.min(.035, Math.max(.001, (now - state.lastFrame) / 1000));
    state.lastFrame = now;
    if (state.running) physicsStep(dt);
    drawLab();
    updateUi();
    requestAnimationFrame(frame);
  }

  if (globalState.theme === 'dark') document.body.classList.add('dark');
  if (embedded) document.body.classList.add('embed');
  addParticles('heavy', 50, true);
  setParticleTemperature(300);
  updateMeasurements();
  bindControls();
  updateAccountUi();
  updateTimingUi();
  updateUi(true);
  writeJSON('idrokLabCourse', labCourse);
  window.GasLabDebug = Object.freeze({
    snapshot: () => ({particles: particles.length, heavy: countByKind('heavy'), light: countByKind('light'), temperature: state.temperature, pressure: state.pressure, volume: state.volume, heat: state.heat, chamberWidth: chamber.w, running: state.running, progress: Number(document.body.dataset.gasProgress || 0)}),
    validate: () => ({issues: [canvas.width === 1100 ? '' : 'canvas width', canvas.height === 700 ? '' : 'canvas height', particles.length <= 180 ? '' : 'particle cap'].filter(Boolean)}),
  });
  requestAnimationFrame(frame);
})();

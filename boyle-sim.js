(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const MIN_VOLUME = 1.2;
  const MAX_VOLUME = 5;
  const MAX_PARTICLES = 160;
  const INITIAL = Object.freeze({volume: 4.6, temperature: 300, particleCount: 40});

  const canvas = $('particleCanvas');
  const ctx = canvas.getContext('2d');
  const bigGraph = $('bigGraphCanvas');
  const graphCtx = bigGraph.getContext('2d');
  const experimentScreen = $('experimentScreen');
  const syringeGlass = $('syringeGlass');
  const syringeRig = $('syringeRig');
  const pistonGrip = $('pistonGrip');
  const pumpHandle = $('pumpHandle');

  const state = {
    volume: INITIAL.volume,
    temperature: INITIAL.temperature,
    particleType: 'heavy',
    thermostatLocked: false,
    paused: false,
    pistonDragging: false,
    pumpDragging: false,
    pumpStartY: 0,
    pistonMoved: false,
    measuredGood: false,
    showWidth: true,
    showCollisions: true,
    showVectors: false,
    screen: 'experiment',
    collisionAccumulator: 0,
    collisionRate: 0,
    collisionTimer: 0,
    wallFlashCooldown: 0,
    measurements: [],
    baselinePV: null,
  };

  const particles = [];
  let lastTime = performance.now();
  let bounds = {left: 0, top: 0, right: 1, bottom: 1, width: 1, height: 1};
  let achievementTimer = 0;

  function currentK() {
    return (particles.length / 80) * (state.temperature / 300) * 4;
  }

  function pressure() {
    return particles.length ? currentK() / state.volume : 0;
  }

  function pvValue() {
    return pressure() * state.volume;
  }

  function particleColor(type) {
    return type === 'light'
      ? {core: '#ff7047', edge: '#8d220f', glow: 'rgba(255,99,55,.45)', radius: 3.8, massFactor: 1.32}
      : {core: '#8f86ff', edge: '#3425a3', glow: 'rgba(126,112,255,.5)', radius: 5.1, massFactor: .88};
  }

  function createParticle(type = state.particleType) {
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = 105 + Math.random() * 65;
    return {
      x: .08 + Math.random() * .82,
      y: .08 + Math.random() * .84,
      vx: Math.cos(angle) * baseSpeed,
      vy: Math.sin(angle) * baseSpeed,
      type,
      flash: 0,
    };
  }

  function addParticles(amount, type = state.particleType) {
    const count = Math.min(Math.max(0, amount), MAX_PARTICLES - particles.length);
    for (let index = 0; index < count; index++) particles.push(createParticle(type));
    if (state.thermostatLocked) state.baselinePV = pvValue();
    updateUi();
    notifyParent();
  }

  function removeParticles(amount) {
    particles.splice(Math.max(0, particles.length - amount), amount);
    if (state.thermostatLocked) state.baselinePV = pvValue();
    if (particles.length < 40) state.measuredGood = false;
    updateUi();
    notifyParent();
  }

  function volumeRatio() {
    return (state.volume - MIN_VOLUME) / (MAX_VOLUME - MIN_VOLUME);
  }

  function updateChamberGeometry() {
    const widthPercent = lerp(31, 78, volumeRatio());
    syringeGlass.style.width = `${widthPercent}%`;
    $('widthArrow').style.width = `${Math.max(27, widthPercent - 3)}%`;
    const screenRect = experimentScreen.getBoundingClientRect();
    const glassRect = syringeGlass.getBoundingClientRect();
    bounds = {
      left: glassRect.left - screenRect.left + 12,
      top: glassRect.top - screenRect.top + 12,
      right: glassRect.right - screenRect.left - 24,
      bottom: glassRect.bottom - screenRect.top - 12,
    };
    bounds.width = Math.max(1, bounds.right - bounds.left);
    bounds.height = Math.max(1, bounds.bottom - bounds.top);
  }

  function resizeCanvas(target, context) {
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (target.width !== width || target.height !== height) {
      target.width = width;
      target.height = height;
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return {width: rect.width, height: rect.height, dpr};
  }

  function registerCollision(particle, wall) {
    state.collisionAccumulator += 1;
    particle.flash = 1;
    if (state.wallFlashCooldown <= 0 && (wall === 'left' || wall === 'right')) {
      const flash = $('wallFlash');
      flash.style.left = wall === 'left' ? `${bounds.left - 4}px` : `${bounds.right - 2}px`;
      flash.style.top = `${bounds.top}px`;
      flash.style.height = `${bounds.height}px`;
      flash.classList.remove('flash');
      void flash.offsetWidth;
      flash.classList.add('flash');
      state.wallFlashCooldown = .12;
    }
  }

  function updateParticles(dt) {
    if (!particles.length) return;
    const thermalFactor = Math.sqrt(state.temperature / 300);
    for (const particle of particles) {
      const style = particleColor(particle.type);
      const speed = thermalFactor * style.massFactor;
      particle.x += particle.vx * speed * dt / bounds.width;
      particle.y += particle.vy * speed * dt / bounds.height;
      if (particle.x <= .02) { particle.x = .02; particle.vx = Math.abs(particle.vx); registerCollision(particle, 'left'); }
      if (particle.x >= .98) { particle.x = .98; particle.vx = -Math.abs(particle.vx); registerCollision(particle, 'right'); }
      if (particle.y <= .03) { particle.y = .03; particle.vy = Math.abs(particle.vy); registerCollision(particle, 'top'); }
      if (particle.y >= .97) { particle.y = .97; particle.vy = -Math.abs(particle.vy); registerCollision(particle, 'bottom'); }
      particle.flash = Math.max(0, particle.flash - dt * 4.5);
    }
  }

  function drawArrow(context, x, y, vx, vy, color) {
    const magnitude = Math.hypot(vx, vy) || 1;
    const length = 20;
    const ex = x + vx / magnitude * length;
    const ey = y + vy / magnitude * length;
    const angle = Math.atan2(ey - y, ex - x);
    context.save();
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1.5;
    context.beginPath(); context.moveTo(x, y); context.lineTo(ex, ey); context.stroke();
    context.beginPath(); context.moveTo(ex, ey); context.lineTo(ex - Math.cos(angle - .55) * 6, ey - Math.sin(angle - .55) * 6); context.lineTo(ex - Math.cos(angle + .55) * 6, ey - Math.sin(angle + .55) * 6); context.closePath(); context.fill();
    context.restore();
  }

  function drawParticles() {
    const size = resizeCanvas(canvas, ctx);
    if (!size) return;
    updateChamberGeometry();
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height);
    ctx.clip();

    for (const particle of particles) {
      const style = particleColor(particle.type);
      const x = bounds.left + particle.x * bounds.width;
      const y = bounds.top + particle.y * bounds.height;
      ctx.fillStyle = style.glow;
      ctx.beginPath(); ctx.arc(x, y, style.radius * 2.2, 0, Math.PI * 2); ctx.fill();
      const gradient = ctx.createRadialGradient(x - style.radius * .36, y - style.radius * .42, .5, x, y, style.radius);
      gradient.addColorStop(0, particle.flash > 0 ? '#ffffff' : '#f8f7ff');
      gradient.addColorStop(.32, style.core);
      gradient.addColorStop(1, style.edge);
      ctx.fillStyle = gradient;
      ctx.beginPath(); ctx.arc(x, y, style.radius, 0, Math.PI * 2); ctx.fill();
      if (state.showVectors && Math.round((particle.x + particle.y) * 100) % 7 === 0) drawArrow(ctx, x, y, particle.vx, particle.vy, particle.type === 'light' ? '#ff9e70' : '#a9e8ff');
    }
    ctx.restore();
  }

  function missionSteps() {
    return [
      state.thermostatLocked && particles.length >= 40,
      state.pistonMoved && state.volume <= 3,
      state.measuredGood,
    ];
  }

  function notifyParent() {
    if (window.parent === window) return;
    window.parent.postMessage({type: 'idrok-custom-progress', lessonId: 'l10', steps: missionSteps(), progress: Math.round(missionSteps().filter(Boolean).length / 3 * 100)}, '*');
  }

  function setMissionItem(id, done) {
    const item = $(id);
    item.classList.toggle('done', done);
    item.querySelector('i').textContent = done ? '✓' : id === 'missionLock' ? '1' : id === 'missionCompress' ? '2' : '3';
  }

  function updateMission() {
    const steps = missionSteps();
    setMissionItem('missionLock', steps[0]);
    setMissionItem('missionCompress', steps[1]);
    setMissionItem('missionMeasure', steps[2]);
    const percent = Math.round(steps.filter(Boolean).length / 3 * 100);
    $('missionPercent').textContent = `${percent}%`;
    $('missionProgress').style.width = `${percent}%`;
    const canRecord = steps[0] && steps[1];
    $('recordButton').disabled = !canRecord;
    $('recordHint').textContent = !steps[0] ? 'Avval temperaturani qulflang' : !steps[1] ? 'Porshenni 3.0 L dan pastga suring' : steps[2] ? 'Yana bir o‘lchov qo‘shishingiz mumkin' : 'Natijani grafikga qo‘shing';
  }

  function updateUi() {
    const p = pressure();
    const pv = pvValue();
    $('pressureReadout').textContent = `${p.toFixed(2)} atm`;
    $('volumeReadout').textContent = `${state.volume.toFixed(2)} L`;
    $('widthReadout').textContent = `${(state.volume * 10).toFixed(1)} cm`;
    $('temperatureReadout').textContent = `${Math.round(state.temperature)} K`;
    $('pvReadout').textContent = `${pv.toFixed(2)} atm·L`;
    $('particleCount').textContent = String(particles.length);
    $('particleNumber').textContent = String(particles.length);
    $('pumpCount').textContent = `${particles.length} zarra`;
    $('pumpPlunger').style.height = `${clamp(18 + particles.length / MAX_PARTICLES * 68, 18, 86)}%`;
    $('heatControl').value = String(Math.round(state.temperature));
    $('gaugeNeedle').style.transform = `rotate(${lerp(-132, 132, clamp(p / 5, 0, 1))}deg)`;
    $('thermoMercury').style.height = `${lerp(15, 88, clamp((state.temperature - 220) / 280, 0, 1))}%`;
    $('collisionCount').textContent = String(Math.round(state.collisionRate));
    $('collisionBar').style.width = `${clamp(state.collisionRate / 950 * 100, 2, 100)}%`;
    $('widthArrow').classList.toggle('hidden', !state.showWidth);
    $('collisionDisplay').classList.toggle('hidden', !state.showCollisions);
    $('thermostatState').textContent = state.thermostatLocked ? '300 K · QULFLANGAN' : 'ERKIN';
    $('thermostatState').classList.toggle('locked', state.thermostatLocked);
    $('thermostatButton').setAttribute('aria-pressed', String(state.thermostatLocked));
    $('heatControl').disabled = state.thermostatLocked;
    $('pauseButton').querySelector('span').textContent = state.paused ? '▶' : 'Ⅱ';
    $('pauseButton').querySelector('b').textContent = state.paused ? 'Davom' : 'Pauza';
    $('stepButton').disabled = !state.paused;
    updateMission();
  }

  function setupGaugeTicks() {
    const host = $('gaugeTicks');
    const ns = 'http://www.w3.org/2000/svg';
    for (let index = 0; index <= 25; index++) {
      const angle = (-132 + index / 25 * 264) * Math.PI / 180;
      const major = index % 5 === 0;
      const outer = 49;
      const inner = major ? 39 : 44;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', String(90 + Math.cos(angle) * inner));
      line.setAttribute('y1', String(76 + Math.sin(angle) * inner));
      line.setAttribute('x2', String(90 + Math.cos(angle) * outer));
      line.setAttribute('y2', String(76 + Math.sin(angle) * outer));
      host.appendChild(line);
      if (major) {
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', String(90 + Math.cos(angle) * 32));
        label.setAttribute('y', String(78 + Math.sin(angle) * 32));
        label.setAttribute('text-anchor', 'middle');
        label.textContent = String(index / 5);
        host.appendChild(label);
      }
    }
  }

  function updatePistonFromClientX(clientX) {
    const rig = syringeRig.getBoundingClientRect();
    // The visible grip sits 111.5 px to the right of the gas-facing piston plate.
    // Subtracting that offset keeps the piston under the pointer throughout a drag.
    const pistonPlateX = clientX - 111.5;
    const percentage = clamp((pistonPlateX - rig.left) / rig.width * 100, 31, 78);
    const ratio = (percentage - 31) / 47;
    const previous = state.volume;
    state.volume = lerp(MIN_VOLUME, MAX_VOLUME, ratio);
    if (Math.abs(state.volume - INITIAL.volume) > .18) state.pistonMoved = true;
    if (Math.abs(state.volume - previous) > .001) {
      updateChamberGeometry();
      updateUi();
      notifyParent();
    }
  }

  pistonGrip.addEventListener('pointerdown', event => {
    state.pistonDragging = true;
    pistonGrip.classList.add('dragging');
    pistonGrip.setPointerCapture(event.pointerId);
    updatePistonFromClientX(event.clientX);
  });
  pistonGrip.addEventListener('pointermove', event => { if (state.pistonDragging) updatePistonFromClientX(event.clientX); });
  const stopPiston = event => {
    if (!state.pistonDragging) return;
    state.pistonDragging = false;
    pistonGrip.classList.remove('dragging');
    if (pistonGrip.hasPointerCapture(event.pointerId)) pistonGrip.releasePointerCapture(event.pointerId);
  };
  pistonGrip.addEventListener('pointerup', stopPiston);
  pistonGrip.addEventListener('pointercancel', stopPiston);
  // Keep the piston attached to the pointer even when a fast drag briefly leaves
  // the moving grip. This also makes touch and pen input behave consistently.
  window.addEventListener('pointermove', event => {
    if (state.pistonDragging) updatePistonFromClientX(event.clientX);
  });
  window.addEventListener('pointerup', stopPiston);
  window.addEventListener('pointercancel', stopPiston);
  pistonGrip.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    state.volume = clamp(state.volume + (event.key === 'ArrowLeft' ? -.18 : .18), MIN_VOLUME, MAX_VOLUME);
    if (Math.abs(state.volume - INITIAL.volume) > .18) state.pistonMoved = true;
    updateChamberGeometry(); updateUi(); notifyParent();
  });

  function pumpStroke() {
    if (particles.length >= MAX_PARTICLES) return;
    addParticles(10);
    $('coachCallout').classList.add('hidden');
    pumpHandle.animate([{transform:'translateY(0)'},{transform:'translateY(42px)'},{transform:'translateY(0)'}], {duration:360,easing:'cubic-bezier(.25,.8,.25,1)'});
  }

  pumpHandle.addEventListener('pointerdown', event => {
    state.pumpDragging = true;
    state.pumpStartY = event.clientY;
    pumpHandle.setPointerCapture(event.pointerId);
    pumpStroke();
  });
  pumpHandle.addEventListener('pointermove', event => {
    if (!state.pumpDragging) return;
    const distance = clamp(event.clientY - state.pumpStartY, 0, 42);
    pumpHandle.style.transform = `translateY(${distance}px)`;
  });
  const stopPump = event => {
    if (!state.pumpDragging) return;
    state.pumpDragging = false;
    pumpHandle.style.transform = '';
    if (pumpHandle.hasPointerCapture(event.pointerId)) pumpHandle.releasePointerCapture(event.pointerId);
  };
  pumpHandle.addEventListener('pointerup', stopPump);
  pumpHandle.addEventListener('pointercancel', stopPump);
  pumpHandle.addEventListener('click', event => { if (event.detail === 0) pumpStroke(); });

  $('addOne').addEventListener('click', () => addParticles(1));
  $('addTen').addEventListener('click', () => addParticles(10));
  $('removeOne').addEventListener('click', () => removeParticles(1));
  $('removeTen').addEventListener('click', () => removeParticles(10));
  document.querySelectorAll('input[name="particleType"]').forEach(input => input.addEventListener('change', () => { if (input.checked) state.particleType = input.value; }));

  $('thermostatButton').addEventListener('click', () => {
    state.thermostatLocked = !state.thermostatLocked;
    if (state.thermostatLocked) {
      state.temperature = 300;
      state.baselinePV = pvValue();
    } else {
      state.measuredGood = false;
      state.baselinePV = null;
    }
    updateUi(); notifyParent();
  });
  $('heatControl').addEventListener('input', event => {
    if (state.thermostatLocked) return;
    state.temperature = Number(event.target.value);
    state.measuredGood = false;
    updateUi(); notifyParent();
  });

  $('showWidth').addEventListener('change', event => { state.showWidth = event.target.checked; updateUi(); });
  $('showCollisions').addEventListener('change', event => { state.showCollisions = event.target.checked; updateUi(); });
  $('showVectors').addEventListener('change', event => { state.showVectors = event.target.checked; });

  $('pauseButton').addEventListener('click', () => { state.paused = !state.paused; updateUi(); });
  $('stepButton').addEventListener('click', () => { if (state.paused) { updateParticles(1 / 30); drawParticles(); } });

  function updateMeasurementList() {
    $('measurementCount').textContent = `${state.measurements.length} / 5`;
    $('measurementList').innerHTML = state.measurements.length
      ? state.measurements.slice(-5).map((item, index) => `<li><span>${index + 1}</span><b>V = ${item.volume.toFixed(2)} L<br>p = ${item.pressure.toFixed(2)} atm · pV = ${item.pv.toFixed(2)}</b></li>`).join('')
      : '<li><span>—</span><b>Porshenni surib o‘lchov yozing</b></li>';
  }

  function showAchievement() {
    const box = $('achievement');
    box.classList.add('show');
    clearTimeout(achievementTimer);
    achievementTimer = setTimeout(() => box.classList.remove('show'), 3600);
  }

  $('recordButton').addEventListener('click', () => {
    const pv = pvValue();
    const baseline = state.baselinePV || pv;
    const difference = baseline ? Math.abs(pv - baseline) / baseline : 1;
    state.measurements.push({volume: state.volume, pressure: pressure(), pv, difference});
    state.measurements = state.measurements.slice(-5);
    state.measuredGood = difference <= .05 && state.thermostatLocked && state.volume <= 3 && particles.length >= 40;
    updateMeasurementList(); updateUi(); notifyParent(); drawGraph();
    if (state.measuredGood) showAchievement();
  });

  document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => {
    state.screen = button.dataset.screen;
    $('experimentScreen').classList.toggle('active', state.screen === 'experiment');
    $('graphScreen').classList.toggle('active', state.screen === 'graph');
    document.querySelectorAll('[data-screen]').forEach(item => item.classList.toggle('active', item === button));
    if (state.screen === 'graph') requestAnimationFrame(drawGraph);
  }));

  function drawGraph() {
    const size = resizeCanvas(bigGraph, graphCtx);
    if (!size) return;
    const width = size.width;
    const height = size.height;
    const pad = {left: 58, right: 24, top: 22, bottom: 45};
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const pMax = 5;
    const x = volume => pad.left + (volume - MIN_VOLUME) / (MAX_VOLUME - MIN_VOLUME) * plotW;
    const y = value => pad.top + (1 - clamp(value / pMax, 0, 1)) * plotH;
    graphCtx.clearRect(0, 0, width, height);
    graphCtx.fillStyle = '#071019'; graphCtx.fillRect(0, 0, width, height);
    graphCtx.font = '700 10px Inter, Segoe UI, sans-serif';
    for (let index = 0; index <= 5; index++) {
      const gy = pad.top + index / 5 * plotH;
      graphCtx.strokeStyle = 'rgba(132,157,181,.17)'; graphCtx.lineWidth = 1; graphCtx.beginPath(); graphCtx.moveTo(pad.left, gy); graphCtx.lineTo(width - pad.right, gy); graphCtx.stroke();
      graphCtx.fillStyle = '#8495a7'; graphCtx.textAlign = 'right'; graphCtx.fillText(String(5 - index), pad.left - 9, gy + 4);
    }
    for (let index = 0; index <= 5; index++) {
      const volume = MIN_VOLUME + index / 5 * (MAX_VOLUME - MIN_VOLUME);
      const gx = x(volume);
      graphCtx.strokeStyle = 'rgba(132,157,181,.12)'; graphCtx.beginPath(); graphCtx.moveTo(gx, pad.top); graphCtx.lineTo(gx, height - pad.bottom); graphCtx.stroke();
      graphCtx.fillStyle = '#8495a7'; graphCtx.textAlign = 'center'; graphCtx.fillText(volume.toFixed(1), gx, height - pad.bottom + 18);
    }
    graphCtx.strokeStyle = '#b8c6d3'; graphCtx.lineWidth = 2; graphCtx.beginPath(); graphCtx.moveTo(pad.left, pad.top); graphCtx.lineTo(pad.left, height - pad.bottom); graphCtx.lineTo(width - pad.right, height - pad.bottom); graphCtx.stroke();
    graphCtx.fillStyle = '#c5d1dc'; graphCtx.font = '800 11px Inter, Segoe UI, sans-serif'; graphCtx.textAlign = 'center'; graphCtx.fillText('Hajm, V (L)', pad.left + plotW / 2, height - 9); graphCtx.save(); graphCtx.translate(15, pad.top + plotH / 2); graphCtx.rotate(-Math.PI / 2); graphCtx.fillText('Bosim, p (atm)', 0, 0); graphCtx.restore();

    const k = currentK();
    graphCtx.strokeStyle = '#2fd4e7'; graphCtx.lineWidth = 4; graphCtx.beginPath();
    for (let index = 0; index <= 90; index++) {
      const volume = MIN_VOLUME + index / 90 * (MAX_VOLUME - MIN_VOLUME);
      const px = x(volume); const py = y(k / volume);
      if (!index) graphCtx.moveTo(px, py); else graphCtx.lineTo(px, py);
    }
    graphCtx.stroke();
    for (const [index, item] of state.measurements.entries()) {
      graphCtx.fillStyle = index === state.measurements.length - 1 ? '#ffd04a' : '#8175ff';
      graphCtx.strokeStyle = '#ffffff'; graphCtx.lineWidth = 2; graphCtx.beginPath(); graphCtx.arc(x(item.volume), y(item.pressure), 7, 0, Math.PI * 2); graphCtx.fill(); graphCtx.stroke();
    }
    graphCtx.fillStyle = '#ff7047'; graphCtx.strokeStyle = '#fff'; graphCtx.lineWidth = 2; graphCtx.beginPath(); graphCtx.arc(x(state.volume), y(pressure()), 8, 0, Math.PI * 2); graphCtx.fill(); graphCtx.stroke();
    graphCtx.fillStyle = '#e6f0f7'; graphCtx.font = '800 10px Inter, Segoe UI, sans-serif'; graphCtx.textAlign = 'left'; graphCtx.fillText(`Joriy nuqta: V=${state.volume.toFixed(2)} L, p=${pressure().toFixed(2)} atm`, pad.left + 12, pad.top + 18);
  }

  function reset() {
    particles.length = 0;
    state.volume = INITIAL.volume;
    state.temperature = INITIAL.temperature;
    state.thermostatLocked = false;
    state.paused = false;
    state.pistonMoved = false;
    state.measuredGood = false;
    state.collisionAccumulator = 0;
    state.collisionRate = 0;
    state.collisionTimer = 0;
    state.measurements = [];
    state.baselinePV = null;
    state.screen = 'experiment';
    $('experimentScreen').classList.add('active');
    $('graphScreen').classList.remove('active');
    document.querySelectorAll('[data-screen]').forEach(button => button.classList.toggle('active', button.dataset.screen === 'experiment'));
    $('coachCallout').classList.remove('hidden');
    for (let index = 0; index < INITIAL.particleCount; index++) particles.push(createParticle('heavy'));
    updateMeasurementList(); updateChamberGeometry(); updateUi(); notifyParent();
  }
  $('resetButton').addEventListener('click', reset);

  function frame(now) {
    const dt = Math.min((now - lastTime) / 1000, .05);
    lastTime = now;
    if (!state.paused) updateParticles(dt);
    state.collisionTimer += dt;
    state.wallFlashCooldown = Math.max(0, state.wallFlashCooldown - dt);
    if (state.collisionTimer >= .5) {
      state.collisionRate = state.collisionAccumulator / state.collisionTimer;
      state.collisionAccumulator = 0;
      state.collisionTimer = 0;
      updateUi();
    }
    if (state.screen === 'experiment') drawParticles();
    requestAnimationFrame(frame);
  }

  setupGaugeTicks();
  reset();
  window.addEventListener('resize', () => { updateChamberGeometry(); if (state.screen === 'graph') drawGraph(); });
  requestAnimationFrame(frame);

  window.IdrokBoyleDebug = Object.freeze({
    validate: () => ({
      issues: [canvas, bigGraph, syringeGlass, pistonGrip, pumpHandle].every(Boolean) && particles.length === INITIAL.particleCount ? [] : ['Boyl sahnasi to‘liq ishga tushmadi.'],
      particleCount: particles.length,
      controls: ['pump','piston','temperature','pause','step','reset','graph'],
    }),
    snapshot: () => ({
      volume: state.volume,
      pressure: pressure(),
      temperature: state.temperature,
      particleCount: particles.length,
      pv: pvValue(),
      collisionRate: state.collisionRate,
      steps: missionSteps(),
      measurements: state.measurements.length,
    }),
  });
})();

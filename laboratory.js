(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch { return fallback; }
  };

  const G = 9.81;
  const MATERIALS = {
    wood: {name: 'Yog‘och', density: 650, color: '#9a6030'},
    metal: {name: 'Metall', density: 2700, color: '#9aa5b0'},
    ice: {name: 'Muz', density: 917, color: '#8ee7f4'},
  };
  const FLUIDS = {
    water: {name: 'Suv', density: 1000, top: '#4ac7f2', bottom: '#1674ca'},
    salt: {name: 'Sho‘r suv', density: 1030, top: '#50d7ef', bottom: '#167ab9'},
    oil: {name: 'O‘simlik yog‘i', density: 850, top: '#f6cc59', bottom: '#cd8b28'},
  };

  const canvas = $('#buoyancyCanvas');
  const ctx = canvas.getContext('2d');
  const world = {width: 1100, height: 650, dpr: 1, layout: null};
  const preferences = {
    fluid: 'water',
    waterLevel: 68,
    showForces: true,
    showValues: true,
    showDepth: false,
  };

  let objects = [];
  let selectedId = 'wood';
  let heldObject = null;
  let pointerOffset = {x: 0, y: 0};
  let lastPointer = {x: 0, y: 0, time: 0};
  let paused = false;
  let lastFrame = performance.now();
  let equilibriumTime = 0;
  let challengeAchieved = false;
  let ripples = [];
  let bubbles = [];
  let lastMetricUpdate = 0;
  const labState = readJSON('idrokLabState', {completed: []});
  labState.completed = Array.isArray(labState.completed) ? labState.completed : [];

  function materialObject(id, mass = 4) {
    const material = MATERIALS[id];
    return {
      id,
      name: material.name,
      density: material.density,
      mass,
      x: 0,
      y: 0,
      width: 70,
      height: 70,
      vx: 0,
      vy: 0,
      held: false,
      submerged: 0,
      buoyancy: 0,
      weight: mass * G,
      contactForce: 0,
      contact: '',
      inTank: false,
      wasWet: false,
    };
  }

  function selectedObject() {
    return objects.find(item => item.id === selectedId) || objects[0];
  }

  function volumeLiters(object) {
    return object.mass / object.density * 1000;
  }

  function objectSize(object) {
    const volume = volumeLiters(object);
    const compact = world.width < 620;
    const scale = compact ? 10.8 : clamp(world.width / 52, 14, 19);
    const side = clamp(28 + Math.cbrt(volume) * scale, compact ? 38 : 48, compact ? 67 : 98);
    const ratios = object.id === 'wood' ? [1.16, .92] : object.id === 'metal' ? [.92, 1.02] : [1.06, .98];
    return {width: side * ratios[0], height: side * ratios[1]};
  }

  function makeLayout() {
    const w = world.width;
    const h = world.height;
    const compact = w < 620;
    if (compact) {
      const tank = {x: 16, y: h * .43, width: w - 32, height: h * .52};
      const shelfY = h * .27;
      return {
        compact,
        tank,
        waterY: tank.y + tank.height * (1 - preferences.waterLevel / 100),
        shelf: {x: 15, y: shelfY, width: w - 30, height: 10},
        scale: {x: w - 112, y: tank.y - 54, width: 94, height: 39},
        groundY: h * .96,
      };
    }
    const tank = {x: w * .285, y: h * .23, width: w * .675, height: h * .68};
    return {
      compact,
      tank,
      waterY: tank.y + tank.height * (1 - preferences.waterLevel / 100),
      shelf: {x: w * .035, y: h * .35, width: w * .215, height: 12},
      scale: {x: w * .045, y: h * .67, width: w * .19, height: h * .105},
      groundY: h * .92,
    };
  }

  function placeAtHome(object, index) {
    const layout = world.layout;
    const size = objectSize(object);
    object.width = size.width;
    object.height = size.height;
    const slotWidth = layout.shelf.width / 3;
    object.x = layout.shelf.x + slotWidth * index + (slotWidth - object.width) / 2;
    object.y = layout.shelf.y - object.height;
    object.vx = 0;
    object.vy = 0;
    object.held = false;
    object.contact = 'shelf';
    object.submerged = 0;
    object.buoyancy = 0;
    object.contactForce = object.mass * G;
    object.inTank = false;
    object.wasWet = false;
  }

  function resetSimulation(resetMasses = true) {
    if (!objects.length || resetMasses) {
      objects = ['wood', 'metal', 'ice'].map(id => materialObject(id, 4));
    }
    world.layout = makeLayout();
    objects.forEach((object, index) => placeAtHome(object, index));
    heldObject = null;
    selectedId = 'wood';
    equilibriumTime = 0;
    challengeAchieved = false;
    ripples = [];
    bubbles = [];
    preferences.fluid = 'water';
    preferences.waterLevel = 68;
    $('#fluidSelect').value = 'water';
    $('#waterLevel').value = '68';
    $('#waterLevelOutput').textContent = '68%';
    $('#stageHint').classList.remove('hidden');
    $('#labChallenge').classList.remove('done');
    $('#challengeProgress').style.width = '0%';
    $('#challengeStatus').textContent = 'Jismni suvga olib boring';
    updateSelectedControls();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const oldWidth = world.width;
    const oldHeight = world.height;
    world.dpr = Math.min(window.devicePixelRatio || 1, 2);
    world.width = rect.width;
    world.height = rect.height;
    canvas.width = Math.round(rect.width * world.dpr);
    canvas.height = Math.round(rect.height * world.dpr);
    ctx.setTransform(world.dpr, 0, 0, world.dpr, 0, 0);
    world.layout = makeLayout();
    if (!objects.length) {
      resetSimulation(true);
      return;
    }
    const ratioX = world.width / oldWidth;
    const ratioY = world.height / oldHeight;
    objects.forEach(object => {
      object.x *= ratioX;
      object.y *= ratioY;
      const size = objectSize(object);
      object.width = size.width;
      object.height = size.height;
    });
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
  }

  function hitObject(point) {
    return [...objects].reverse().find(object => point.x >= object.x - 5 && point.x <= object.x + object.width + 5 && point.y >= object.y - 5 && point.y <= object.y + object.height + 5);
  }

  function setSelected(id) {
    selectedId = id;
    $$('#materialButtons button').forEach(button => button.classList.toggle('active', button.dataset.material === id));
    updateSelectedControls();
  }

  function pointerDown(event) {
    const point = pointFromEvent(event);
    const object = hitObject(point);
    if (!object) return;
    event.preventDefault();
    setSelected(object.id);
    heldObject = object;
    object.held = true;
    object.contact = '';
    object.vx = 0;
    object.vy = 0;
    pointerOffset = {x: point.x - object.x, y: point.y - object.y};
    lastPointer = {x: point.x, y: point.y, time: performance.now()};
    canvas.setPointerCapture?.(event.pointerId);
    canvas.classList.add('dragging');
    $('#stageHint').classList.add('hidden');
  }

  function pointerMove(event) {
    if (!heldObject) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    const now = performance.now();
    const elapsed = Math.max(8, now - lastPointer.time) / 1000;
    const nextX = clamp(point.x - pointerOffset.x, 0, world.width - heldObject.width);
    const nextY = clamp(point.y - pointerOffset.y, 0, world.height - heldObject.height);
    heldObject.vx = clamp((nextX - heldObject.x) / elapsed, -700, 700);
    heldObject.vy = clamp((nextY - heldObject.y) / elapsed, -700, 700);
    heldObject.x = nextX;
    heldObject.y = nextY;
    lastPointer = {x: point.x, y: point.y, time: now};
  }

  function pointerUp(event) {
    if (!heldObject) return;
    event.preventDefault();
    heldObject.held = false;
    heldObject.vx = clamp(heldObject.vx, -360, 360);
    heldObject.vy = clamp(heldObject.vy, -360, 360);
    heldObject = null;
    canvas.releasePointerCapture?.(event.pointerId);
    canvas.classList.remove('dragging');
  }

  function horizontalOverlap(object, rect) {
    return Math.max(0, Math.min(object.x + object.width, rect.x + rect.width) - Math.max(object.x, rect.x)) / object.width;
  }

  function verticalSubmersion(object, waterY) {
    return clamp((object.y + object.height - waterY) / object.height, 0, 1);
  }

  function addRipple(x, strength = 1) {
    ripples.push({x, radius: 5, alpha: .75, strength});
    ripples = ripples.slice(-12);
  }

  function addBubble(object) {
    bubbles.push({
      x: object.x + object.width * (.25 + Math.random() * .5),
      y: object.y + object.height * (.35 + Math.random() * .45),
      radius: 2 + Math.random() * 3,
      speed: 18 + Math.random() * 24,
      alpha: .35 + Math.random() * .35,
    });
    bubbles = bubbles.slice(-32);
  }

  function resolvePlatform(object, platform, name) {
    const overlap = horizontalOverlap(object, platform);
    const bottom = object.y + object.height;
    if (overlap > .48 && object.vy >= 0 && bottom >= platform.y && object.y < platform.y + 10) {
      object.y = platform.y - object.height;
      object.vy = 0;
      object.vx *= .78;
      object.contact = name;
      return true;
    }
    return false;
  }

  function updateObject(object, dt) {
    const layout = world.layout;
    const tank = layout.tank;
    const fluid = FLUIDS[preferences.fluid];
    const size = objectSize(object);
    const centerX = object.x + object.width / 2;
    const centerY = object.y + object.height / 2;
    object.width += (size.width - object.width) * Math.min(1, dt * 10);
    object.height += (size.height - object.height) * Math.min(1, dt * 10);
    const overlap = horizontalOverlap(object, {x: tank.x + 4, y: tank.y, width: tank.width - 8, height: tank.height});
    const vertical = verticalSubmersion(object, layout.waterY);
    const withinTankHeight = object.y + object.height > tank.y && object.y < tank.y + tank.height;
    object.submerged = withinTankHeight ? vertical * overlap : 0;
    object.inTank = overlap > .55 && centerY > tank.y - object.height * .35;
    object.weight = object.mass * G;
    object.buoyancy = fluid.density * (object.mass / object.density) * G * object.submerged;
    object.contactForce = 0;

    const wet = object.submerged > .04;
    if (wet && !object.wasWet) addRipple(clamp(centerX, tank.x + 15, tank.x + tank.width - 15), Math.min(1.5, Math.abs(object.vy) / 160 + .5));
    object.wasWet = wet;

    if (object.held || paused) {
      object.contact = '';
      return;
    }

    object.contact = '';
    const acceleration = (G - object.buoyancy / object.mass) * 52;
    object.vy += acceleration * dt;
    const waterDrag = .16 + object.submerged * 3.7;
    const damping = Math.exp(-waterDrag * dt);
    object.vx *= damping;
    object.vy *= damping;
    object.x += object.vx * dt;
    object.y += object.vy * dt;

    if (object.submerged > .22 && Math.abs(object.vy) > 38 && Math.random() < dt * 7) addBubble(object);

    if (object.inTank && object.y + object.height > tank.y + 8) {
      const left = tank.x + 9;
      const right = tank.x + tank.width - 9 - object.width;
      if (object.x < left) { object.x = left; object.vx = Math.abs(object.vx) * .25; }
      if (object.x > right) { object.x = right; object.vx = -Math.abs(object.vx) * .25; }
      const tankBottom = tank.y + tank.height - 9;
      if (object.y + object.height >= tankBottom) {
        object.y = tankBottom - object.height;
        if (object.vy > 0) object.vy = 0;
        object.contact = 'tank';
      }
    }

    const onScale = !object.inTank && resolvePlatform(object, layout.scale, 'scale');
    const onShelf = !object.inTank && !onScale && resolvePlatform(object, layout.shelf, 'shelf');
    if (!object.inTank && !onScale && !onShelf && object.y + object.height >= layout.groundY) {
      object.y = layout.groundY - object.height;
      if (object.vy > 0) object.vy = 0;
      object.vx *= .7;
      object.contact = 'ground';
    }

    object.x = clamp(object.x, 0, world.width - object.width);
    object.y = clamp(object.y, 0, world.height - object.height);
    if (object.contact) object.contactForce = Math.max(0, object.weight - object.buoyancy);
  }

  function updateEffects(dt) {
    ripples.forEach(ripple => { ripple.radius += 42 * dt * ripple.strength; ripple.alpha -= .45 * dt; });
    ripples = ripples.filter(ripple => ripple.alpha > 0);
    bubbles.forEach(bubble => { bubble.y -= bubble.speed * dt; bubble.alpha -= .16 * dt; });
    bubbles = bubbles.filter(bubble => bubble.alpha > 0 && bubble.y > world.layout.waterY - 8);
  }

  function updateChallenge(dt) {
    const wood = objects.find(object => object.id === 'wood');
    const status = $('#challengeStatus');
    let progress = 0;
    if (challengeAchieved) {
      progress = 100;
      status.textContent = 'Bajarildi — yog‘och muvozanatda!';
    } else if (preferences.fluid !== 'water') {
      equilibriumTime = 0;
      status.textContent = 'Suyuqlikni “Suv”ga qaytaring';
    } else if (!wood.inTank || wood.submerged < .05) {
      equilibriumTime = 0;
      status.textContent = 'Yog‘ochni suvga olib boring';
    } else if (wood.held) {
      equilibriumTime = 0;
      progress = 20;
      status.textContent = 'Endi yog‘ochni qo‘yib yuboring';
    } else {
      const fractionOkay = wood.submerged >= .60 && wood.submerged <= .70;
      const calm = Math.abs(wood.vy) < 8 && Math.abs(wood.vx) < 8 && !wood.contact;
      progress = clamp(30 + (1 - Math.abs(wood.submerged - .65) / .65) * 45, 30, 75);
      if (fractionOkay && calm) {
        equilibriumTime += dt;
        progress = 75 + clamp(equilibriumTime / 1.25, 0, 1) * 25;
        status.textContent = `Muvozanat tasdiqlanmoqda… ${Math.round(wood.submerged * 100)}%`;
        if (equilibriumTime >= 1.25) completeChallenge();
      } else {
        equilibriumTime = 0;
        status.textContent = `${Math.round(wood.submerged * 100)}% botdi — tebranish tinishini kuting`;
      }
    }
    $('#challengeProgress').style.width = `${progress}%`;
  }

  function saveReward() {
    const key = 'buoyancy-basics';
    const alreadyCompleted = labState.completed.includes(key);
    if (!alreadyCompleted) labState.completed.push(key);
    localStorage.setItem('idrokLabState', JSON.stringify(labState));
    if (alreadyCompleted) return false;

    const state = readJSON('idrokState', {completed: [], score: 0, impulse: 0, theme: 'light'});
    state.completed = Array.isArray(state.completed) ? state.completed : [];
    if (!state.completed.includes(`lab-${key}`)) state.completed.push(`lab-${key}`);
    state.impulse = (Number(state.impulse) || 0) + 60;
    localStorage.setItem('idrokState', JSON.stringify(state));

    const currentEmail = localStorage.getItem('idrokCurrentUser') || '';
    if (currentEmail) {
      const users = readJSON('idrokUsers', []);
      const user = users.find(item => item.email === currentEmail);
      if (user) {
        user.impulse = state.impulse;
        user.completed = [...state.completed];
        user.labState = {...labState};
        localStorage.setItem('idrokUsers', JSON.stringify(users));
      }
    }
    return true;
  }

  function completeChallenge() {
    if (challengeAchieved) return;
    challengeAchieved = true;
    $('#labChallenge').classList.add('done');
    $('#challengeProgress').style.width = '100%';
    $('#challengeStatus').textContent = 'Bajarildi — yog‘och muvozanatda!';
    const rewarded = saveReward();
    updateAccountUI();
    launchConfetti();
    showToast(rewarded ? 'Ajoyib! +60 Impulse olindi.' : 'Ajoyib! Muvozanat yana topildi.');
  }

  function updateSelectedControls() {
    const object = selectedObject();
    if (!object) return;
    const material = MATERIALS[object.id];
    $('#selectedMaterialName').textContent = material.name;
    $('#selectedMaterialIcon').className = `material-icon ${object.id}`;
    $('#massRange').value = String(object.mass);
    $('#massOutput').textContent = `${object.mass.toFixed(1)} kg`;
    $$('#materialButtons button').forEach(button => button.classList.toggle('active', button.dataset.material === object.id));
    updateMetrics(true);
  }

  function updateMetrics(force = false) {
    const now = performance.now();
    if (!force && now - lastMetricUpdate < 90) return;
    lastMetricUpdate = now;
    const object = selectedObject();
    if (!object) return;
    const fluid = FLUIDS[preferences.fluid];
    const ratio = object.density / fluid.density;
    const badge = $('#floatBadge');
    badge.classList.remove('sinks', 'neutral');
    if (Math.abs(ratio - 1) < .025) { badge.textContent = 'MUALLAQ'; badge.classList.add('neutral'); }
    else if (ratio < 1) badge.textContent = 'SUZADI';
    else { badge.textContent = 'CHO‘KADI'; badge.classList.add('sinks'); }

    let stateText = 'Suvdan tashqarida';
    if (object.held) stateText = 'Qo‘lingizda';
    else if (object.contact === 'scale') stateText = 'Tarozida';
    else if (object.contact === 'tank') stateText = 'Idish tubida';
    else if (object.submerged > .03 && Math.abs(object.vy) < 8) stateText = 'Muvozanatda';
    else if (object.submerged > .03) stateText = 'Suyuqlik ichida';
    $('#selectedMaterialState').textContent = stateText;
    $('#massValue').textContent = `${object.mass.toFixed(1)} kg`;
    $('#volumeValue').textContent = `${volumeLiters(object).toFixed(2)} L`;
    $('#densityValue').textContent = String(object.density);
    $('#submergedValue').textContent = `${Math.round(object.submerged * 100)}%`;
    $('#massOutput').textContent = `${object.mass.toFixed(1)} kg`;

    if (object.held) $('#stageMessage').textContent = `${object.name}ni kerakli joyga olib boring.`;
    else if (object.contact === 'tank') $('#stageMessage').textContent = `${object.name} zichroq: idish tubiga cho‘kdi.`;
    else if (object.submerged > .03 && ratio < 1) $('#stageMessage').textContent = `${object.name} ${Math.round(object.submerged * 100)}% botib suzmoqda.`;
    else if (object.contact === 'scale') $('#stageMessage').textContent = `Tarozi ${object.weight.toFixed(1)} N og‘irlikni ko‘rsatmoqda.`;
    else $('#stageMessage').textContent = `${object.name}ni suvga yoki taroziga sudrang.`;
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function drawCloud(x, y, scale, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 22 * scale, 0, Math.PI * 2);
    ctx.arc(x + 28 * scale, y - 9 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 61 * scale, y, 23 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBackground(time) {
    const {width: w, height: h} = world;
    const dark = document.body.classList.contains('dark');
    const layout = world.layout;
    const sky = ctx.createLinearGradient(0, 0, 0, layout.groundY);
    sky.addColorStop(0, dark ? '#17234d' : '#55bfea');
    sky.addColorStop(1, dark ? '#32416e' : '#c2ecf7');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    if (dark) {
      ctx.fillStyle = '#f4e7a6';
      ctx.beginPath(); ctx.arc(w * .88, h * .12, Math.max(18, w * .025), 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#17234d';
      ctx.beginPath(); ctx.arc(w * .895, h * .105, Math.max(18, w * .025), 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      for (let i = 0; i < 20; i++) ctx.fillRect((i * 83) % w, 22 + (i * 47) % Math.max(40, h * .22), 1.5, 1.5);
    } else {
      ctx.fillStyle = '#ffe16c';
      ctx.beginPath(); ctx.arc(w * .88, h * .12, Math.max(22, w * .03), 0, Math.PI * 2); ctx.fill();
      drawCloud(w * .48 + Math.sin(time * .06) * 12, h * .105, clamp(w / 1100, .55, 1), .82);
      drawCloud(w * .71 + Math.sin(time * .04) * 9, h * .19, clamp(w / 1350, .45, .8), .58);
    }

    ctx.fillStyle = dark ? '#30445b' : '#6bb45a';
    ctx.beginPath();
    ctx.moveTo(0, layout.groundY * .55);
    ctx.quadraticCurveTo(w * .18, layout.groundY * .40, w * .36, layout.groundY * .59);
    ctx.quadraticCurveTo(w * .56, layout.groundY * .38, w * .78, layout.groundY * .57);
    ctx.quadraticCurveTo(w * .9, layout.groundY * .49, w, layout.groundY * .55);
    ctx.lineTo(w, layout.groundY); ctx.lineTo(0, layout.groundY); ctx.closePath(); ctx.fill();
    const ground = ctx.createLinearGradient(0, layout.groundY, 0, h);
    ground.addColorStop(0, dark ? '#403526' : '#a86b32');
    ground.addColorStop(1, dark ? '#241e19' : '#75431f');
    ctx.fillStyle = ground;
    ctx.fillRect(0, layout.groundY, w, h - layout.groundY);
    ctx.fillStyle = dark ? '#435c43' : '#71b54e';
    ctx.fillRect(0, layout.groundY - 7, w, 9);
  }

  function drawShelf() {
    const shelf = world.layout.shelf;
    ctx.save();
    ctx.fillStyle = 'rgba(17,27,53,.18)';
    roundedRect(ctx, shelf.x + 3, shelf.y + 6, shelf.width, 14, 5); ctx.fill();
    const gradient = ctx.createLinearGradient(0, shelf.y, 0, shelf.y + shelf.height);
    gradient.addColorStop(0, '#f7fbff'); gradient.addColorStop(1, '#aab7c8');
    ctx.fillStyle = gradient;
    roundedRect(ctx, shelf.x, shelf.y, shelf.width, shelf.height, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(35,50,78,.35)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(17,27,53,.72)';
    ctx.font = `800 ${world.layout.compact ? 8 : 10}px Inter`;
    ctx.fillText('JISMLAR', shelf.x, shelf.y + shelf.height + (world.layout.compact ? 15 : 20));
    ctx.restore();
  }

  function scaleReading() {
    return objects.find(object => object.contact === 'scale');
  }

  function drawScale() {
    const scale = world.layout.scale;
    const object = scaleReading();
    ctx.save();
    ctx.fillStyle = 'rgba(10,20,45,.18)';
    roundedRect(ctx, scale.x + 4, scale.y + 7, scale.width, scale.height, 8); ctx.fill();
    const body = ctx.createLinearGradient(0, scale.y, 0, scale.y + scale.height);
    body.addColorStop(0, '#edf3f7'); body.addColorStop(1, '#a6b3c2');
    ctx.fillStyle = body;
    roundedRect(ctx, scale.x, scale.y, scale.width, scale.height, 8); ctx.fill();
    ctx.fillStyle = '#263249';
    roundedRect(ctx, scale.x + scale.width * .12, scale.y + scale.height * .25, scale.width * .76, scale.height * .48, 5); ctx.fill();
    ctx.fillStyle = '#86f0df';
    ctx.font = `800 ${clamp(scale.width * .105, 9, 18)}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(object ? `${object.weight.toFixed(1)} N` : '0.0 N', scale.x + scale.width / 2, scale.y + scale.height * .49);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(17,27,53,.7)';
    ctx.font = `800 ${world.layout.compact ? 7 : 9}px Inter`;
    ctx.fillText('TAROZI', scale.x + 4, scale.y + scale.height + 14);
    ctx.restore();
  }

  function drawTankBack(time) {
    const layout = world.layout;
    const tank = layout.tank;
    const fluid = FLUIDS[preferences.fluid];
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,.17)';
    roundedRect(ctx, tank.x, tank.y, tank.width, tank.height, 14); ctx.fill();

    const water = ctx.createLinearGradient(0, layout.waterY, 0, tank.y + tank.height);
    water.addColorStop(0, fluid.top);
    water.addColorStop(1, fluid.bottom);
    ctx.globalAlpha = preferences.fluid === 'oil' ? .72 : .65;
    ctx.fillStyle = water;
    ctx.fillRect(tank.x + 7, layout.waterY, tank.width - 14, tank.y + tank.height - 7 - layout.waterY);
    ctx.globalAlpha = 1;

    if (preferences.showDepth) {
      ctx.strokeStyle = 'rgba(255,255,255,.48)';
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      ctx.lineWidth = 1;
      ctx.font = `700 ${world.layout.compact ? 7 : 9}px Inter`;
      for (let i = 1; i <= 4; i++) {
        const y = layout.waterY + (tank.y + tank.height - layout.waterY) * i / 5;
        ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.moveTo(tank.x + 10, y); ctx.lineTo(tank.x + tank.width - 10, y); ctx.stroke();
        ctx.setLineDash([]); ctx.fillText(`${i * 20} cm`, tank.x + 14, y - 4);
      }
    }

    ctx.strokeStyle = 'rgba(255,255,255,.72)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = tank.x + 7; x <= tank.x + tank.width - 7; x += 7) {
      const y = layout.waterY + Math.sin(x * .045 + time * 2.2) * 2.7;
      if (x === tank.x + 7) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    bubbles.forEach(bubble => {
      ctx.globalAlpha = bubble.alpha;
      ctx.strokeStyle = '#e9fbff';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ripples.forEach(ripple => {
      ctx.globalAlpha = ripple.alpha;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(ripple.x, layout.waterY, ripple.radius * 1.8, ripple.radius * .26, 0, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawObject(object) {
    const x = object.x;
    const y = object.y;
    const w = object.width;
    const h = object.height;
    ctx.save();
    ctx.shadowColor = object.id === selectedId ? 'rgba(109,93,242,.55)' : 'rgba(8,18,42,.22)';
    ctx.shadowBlur = object.id === selectedId ? 18 : 9;
    ctx.shadowOffsetY = object.id === selectedId ? 2 : 5;
    roundedRect(ctx, x, y, w, h, Math.max(7, w * .11));
    if (object.id === 'wood') {
      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
      gradient.addColorStop(0, '#b8753e'); gradient.addColorStop(.5, '#8b4e26'); gradient.addColorStop(1, '#673718');
      ctx.fillStyle = gradient; ctx.fill();
      ctx.save(); roundedRect(ctx, x, y, w, h, Math.max(7, w * .11)); ctx.clip();
      ctx.strokeStyle = 'rgba(63,31,13,.42)'; ctx.lineWidth = Math.max(1, w * .022);
      for (let line = 0; line < 5; line++) {
        ctx.beginPath();
        for (let px = x - 10; px <= x + w + 10; px += 7) {
          const py = y + h * (.15 + line * .19) + Math.sin(px * .08 + line) * h * .045;
          if (px === x - 10) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    } else if (object.id === 'metal') {
      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
      gradient.addColorStop(0, '#edf3f7'); gradient.addColorStop(.28, '#7e8a96'); gradient.addColorStop(.48, '#d8e0e6'); gradient.addColorStop(1, '#5c6874');
      ctx.fillStyle = gradient; ctx.fill();
      ctx.fillStyle = 'rgba(44,54,66,.52)';
      const r = Math.max(2, w * .035);
      [[.16,.18],[.84,.18],[.16,.82],[.84,.82]].forEach(([rx, ry]) => { ctx.beginPath(); ctx.arc(x + w * rx, y + h * ry, r, 0, Math.PI * 2); ctx.fill(); });
    } else {
      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
      gradient.addColorStop(0, 'rgba(255,255,255,.95)'); gradient.addColorStop(.4, 'rgba(132,225,244,.9)'); gradient.addColorStop(1, 'rgba(42,151,218,.92)');
      ctx.fillStyle = gradient; ctx.fill();
      ctx.save(); roundedRect(ctx, x, y, w, h, Math.max(7, w * .11)); ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,.42)';
      ctx.beginPath(); ctx.moveTo(x + w * .12, y + h * .12); ctx.lineTo(x + w * .57, y + h * .05); ctx.lineTo(x + w * .31, y + h * .55); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + w * .65, y + h * .2); ctx.lineTo(x + w * .44, y + h * .74); ctx.lineTo(x + w * .83, y + h * .58); ctx.stroke();
      ctx.restore();
    }
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = object.id === selectedId ? '#7868ff' : 'rgba(20,29,50,.48)';
    ctx.lineWidth = object.id === selectedId ? 3 : 1.5;
    roundedRect(ctx, x, y, w, h, Math.max(7, w * .11)); ctx.stroke();

    ctx.fillStyle = object.id === 'wood' ? '#f3a454' : object.id === 'metal' ? '#51677f' : '#3699da';
    roundedRect(ctx, x + 5, y + 5, Math.max(24, w * .36), Math.max(17, h * .24), 5); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${clamp(w * .15, 8, 13)}px Inter`;
    ctx.textBaseline = 'middle';
    ctx.fillText(object.id === 'wood' ? 'Y' : object.id === 'metal' ? 'M' : 'MUZ', x + 10, y + 5 + Math.max(17, h * .24) / 2);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  function drawUnderwaterTint(object) {
    if (object.submerged <= 0) return;
    const tank = world.layout.tank;
    ctx.save();
    ctx.beginPath();
    ctx.rect(tank.x + 7, world.layout.waterY, tank.width - 14, tank.y + tank.height - world.layout.waterY - 7);
    ctx.clip();
    ctx.fillStyle = preferences.fluid === 'oil' ? 'rgba(215,147,37,.19)' : 'rgba(27,132,211,.20)';
    roundedRect(ctx, object.x, object.y, object.width, object.height, Math.max(7, object.width * .11)); ctx.fill();
    ctx.restore();
  }

  function drawArrow(x, startY, length, color, label, direction, side) {
    if (length < 5) return;
    const sign = direction === 'up' ? -1 : 1;
    const endY = startY + length * sign;
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x, startY); ctx.lineTo(x, endY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, endY); ctx.lineTo(x - 7, endY - sign * 10); ctx.lineTo(x + 7, endY - sign * 10); ctx.closePath(); ctx.fill();
    ctx.font = `800 ${world.layout.compact ? 8 : 10}px Inter`;
    ctx.textAlign = side === 'left' ? 'right' : 'left';
    ctx.fillText(label, x + (side === 'left' ? -10 : 10), endY + (sign < 0 ? -5 : 13));
    ctx.restore();
  }

  function drawForces(object) {
    if (!preferences.showForces || object.id !== selectedId) return;
    const centerX = object.x + object.width / 2;
    const centerY = object.y + object.height / 2;
    const forceScale = world.layout.compact ? 1.05 : 1.35;
    drawArrow(centerX + object.width * .28, centerY, clamp(object.weight * forceScale, 20, 92), '#2d8df4', `Fg ${object.weight.toFixed(1)} N`, 'down', 'right');
    drawArrow(centerX - object.width * .28, centerY, clamp(object.buoyancy * forceScale, 0, 92), '#ea4f9a', `FA ${object.buoyancy.toFixed(1)} N`, 'up', 'left');
    drawArrow(centerX, object.y + object.height * .8, clamp(object.contactForce * forceScale, 0, 92), '#f2a23a', `N ${object.contactForce.toFixed(1)} N`, 'up', 'right');
  }

  function drawValueLabel(object) {
    if (!preferences.showValues || object.id !== selectedId) return;
    const compact = world.layout.compact;
    const labelWidth = compact ? 90 : 126;
    const labelHeight = compact ? 29 : 36;
    const x = clamp(object.x + object.width / 2 - labelWidth / 2, 4, world.width - labelWidth - 4);
    const y = clamp(object.y - labelHeight - 8, 4, world.height - labelHeight - 4);
    ctx.save();
    ctx.fillStyle = 'rgba(11,20,42,.84)';
    roundedRect(ctx, x, y, labelWidth, labelHeight, 8); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${compact ? 8 : 10}px Inter`;
    ctx.fillText(`${object.name} • ${object.mass.toFixed(1)} kg`, x + 9, y + (compact ? 12 : 15));
    ctx.fillStyle = '#8debdc';
    ctx.font = `700 ${compact ? 7 : 9}px Inter`;
    ctx.fillText(`${object.density} kg/m³ • ${Math.round(object.submerged * 100)}%`, x + 9, y + (compact ? 23 : 28));
    ctx.restore();
  }

  function drawTankFront() {
    const tank = world.layout.tank;
    ctx.save();
    ctx.strokeStyle = 'rgba(232,249,255,.94)';
    ctx.lineWidth = world.layout.compact ? 4 : 6;
    ctx.beginPath();
    ctx.moveTo(tank.x, tank.y);
    ctx.lineTo(tank.x, tank.y + tank.height);
    ctx.lineTo(tank.x + tank.width, tank.y + tank.height);
    ctx.lineTo(tank.x + tank.width, tank.y);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(39,71,104,.52)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tank.x + 4, tank.y + 3, tank.width - 8, tank.height - 7);
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.fillRect(tank.x + 10, tank.y + 12, Math.max(5, tank.width * .015), tank.height - 26);
    ctx.fillStyle = 'rgba(12,34,67,.72)';
    roundedRect(ctx, tank.x + 12, tank.y + 12, world.layout.compact ? 88 : 130, world.layout.compact ? 25 : 32, 8); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${world.layout.compact ? 8 : 10}px Inter`;
    ctx.fillText(`${FLUIDS[preferences.fluid].name.toUpperCase()} • ${FLUIDS[preferences.fluid].density} kg/m³`, tank.x + 22, tank.y + (world.layout.compact ? 28 : 33));
    ctx.restore();
  }

  function drawScene(time) {
    ctx.setTransform(world.dpr, 0, 0, world.dpr, 0, 0);
    ctx.clearRect(0, 0, world.width, world.height);
    drawBackground(time);
    drawShelf();
    drawScale();
    drawTankBack(time);
    objects.forEach(drawObject);
    objects.forEach(drawUnderwaterTint);
    drawTankFront();
    const active = selectedObject();
    if (active) { drawForces(active); drawValueLabel(active); }
  }

  function loop(now) {
    const dt = Math.min(.035, Math.max(.001, (now - lastFrame) / 1000));
    lastFrame = now;
    world.layout = makeLayout();
    if (!paused) {
      objects.forEach(object => updateObject(object, dt));
      updateEffects(dt);
      updateChallenge(dt);
    }
    updateMetrics();
    drawScene(now / 1000);
    requestAnimationFrame(loop);
  }

  function updateAccountUI() {
    const state = readJSON('idrokState', {completed: [], impulse: 0, theme: 'light'});
    const users = readJSON('idrokUsers', []);
    const currentEmail = localStorage.getItem('idrokCurrentUser') || '';
    const user = users.find(item => item.email === currentEmail);
    const name = user?.name || 'Izlanuvchi';
    const done = labState.completed.includes('buoyancy-basics');
    $('#labImpulse').textContent = String(Number(state.impulse) || 0);
    $('#labSideImpulse').textContent = String(Number(state.impulse) || 0);
    $('#labUserName').textContent = name;
    $('#labAvatar').textContent = name.slice(0, 2).toUpperCase();
    $('#labSidePercent').textContent = done ? '100%' : '0%';
    $('#labSideMeta').textContent = done ? '1 / 1 bajarildi' : '0 / 1 bajarildi';
    $('#libraryDone').textContent = done ? '1' : '0';
  }

  function showToast(message) {
    const toast = $('#labToast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function launchConfetti() {
    const host = $('#labConfetti');
    host.innerHTML = '';
    const colors = ['#6d5df2', '#1ccbc1', '#ffd35e', '#ff6b7f', '#2d8df4'];
    for (let index = 0; index < 48; index++) {
      const piece = document.createElement('i');
      piece.style.left = `${8 + Math.random() * 84}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * .28}s`;
      piece.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
      piece.style.setProperty('--spin', `${360 + Math.random() * 720}deg`);
      host.appendChild(piece);
    }
    setTimeout(() => { host.innerHTML = ''; }, 2100);
  }

  function setMenu(open) {
    $('#labSidebar').classList.toggle('open', open);
    $('#labOverlay').classList.toggle('open', open);
  }

  function setAi(open) {
    $('#labAiPanel').classList.toggle('open', open);
    $('#labAiPanel').setAttribute('aria-hidden', String(!open));
  }

  function addAiAnswer(kind) {
    const messages = $('#labAiMessages');
    const answers = {
      float: '<b>Nega yog‘och suzadi?</b> Yog‘och zichligi suvnikidan kichik. U taxminan 65% botganda Arximed kuchi og‘irlikka tenglashadi va blok muvozanatda qoladi.',
      formula: '<b>Asosiy formula:</b> F<sub>A</sub> = ρ · g · V<sub>botgan</sub>. Bu yerda ρ — suyuqlik zichligi, g — erkin tushish tezlanishi, V — botgan hajm.',
      challenge: '<b>Maslahat:</b> “Suv”ni tanlang, yog‘ochni idishning o‘rtasiga to‘liqroq botiring va qo‘yib yuboring. Tebranish tiniguncha kuting.',
    };
    const paragraph = document.createElement('p');
    paragraph.innerHTML = answers[kind] || answers.float;
    messages.appendChild(paragraph);
    messages.scrollTop = messages.scrollHeight;
  }

  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);

  $('#materialButtons').addEventListener('click', event => {
    const button = event.target.closest('[data-material]');
    if (button) setSelected(button.dataset.material);
  });
  $('#fluidSelect').addEventListener('change', event => { preferences.fluid = event.target.value; equilibriumTime = 0; updateSelectedControls(); });
  $('#waterLevel').addEventListener('input', event => {
    preferences.waterLevel = Number(event.target.value);
    $('#waterLevelOutput').textContent = `${preferences.waterLevel}%`;
    world.layout = makeLayout();
  });
  $('#massRange').addEventListener('input', event => {
    const object = selectedObject();
    if (!object) return;
    const oldHeight = object.height;
    const bottom = object.y + oldHeight;
    object.mass = Number(event.target.value);
    const size = objectSize(object);
    object.width = size.width;
    object.height = size.height;
    if (object.contact) object.y = bottom - object.height;
    equilibriumTime = 0;
    updateSelectedControls();
  });
  $('#showForces').addEventListener('change', event => { preferences.showForces = event.target.checked; });
  $('#showValues').addEventListener('change', event => { preferences.showValues = event.target.checked; });
  $('#showDepth').addEventListener('change', event => { preferences.showDepth = event.target.checked; });

  const reset = () => resetSimulation(true);
  $('#resetLab').addEventListener('click', reset);
  $('#resetLabTop').addEventListener('click', reset);
  $('#pauseLab').addEventListener('click', event => {
    paused = !paused;
    event.currentTarget.innerHTML = paused ? '<span>▶</span> Davom' : '<span>Ⅱ</span> Pauza';
    showToast(paused ? 'Simulyatsiya pauzada.' : 'Simulyatsiya davom etmoqda.');
  });

  $('#openLabMenu').addEventListener('click', () => setMenu(true));
  $('#closeLabMenu').addEventListener('click', () => setMenu(false));
  $('#labOverlay').addEventListener('click', () => setMenu(false));
  $('#labAiButton').addEventListener('click', () => { setMenu(false); setAi(true); });
  $('#closeLabAi').addEventListener('click', () => setAi(false));
  $$('[data-lab-hint]').forEach(button => button.addEventListener('click', () => addAiAnswer(button.dataset.labHint)));

  const globalState = readJSON('idrokState', {theme: 'light'});
  document.body.classList.toggle('dark', globalState.theme === 'dark');
  $('#labTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const state = readJSON('idrokState', {completed: [], score: 0, impulse: 0});
    state.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('idrokState', JSON.stringify(state));
  });

  const observer = new ResizeObserver(resizeCanvas);
  observer.observe($('#canvasWrap'));
  updateAccountUI();
  resizeCanvas();
  resetSimulation(true);
  requestAnimationFrame(loop);
})();

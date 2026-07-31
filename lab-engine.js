(() => {
  'use strict';

  const course = window.PHYSICS_COURSE;
  const labConfigs = window.IDROK_LABS;
  const sceneApi = window.LabScenes;
  if (!course || !Array.isArray(course.lessons) || course.lessons.length !== 59 || !Array.isArray(labConfigs) || labConfigs.length !== 59 || !sceneApi) {
    document.body.innerHTML = '<main class="fatal-lab"><h1>Laboratoriya yuklanmadi</h1><p>Sahifani qayta ochib ko‘ring.</p></main>';
    return;
  }

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const readJSON = (key, fallback) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      return parsed && typeof parsed === 'object' ? parsed : JSON.parse(JSON.stringify(fallback));
    } catch { return JSON.parse(JSON.stringify(fallback)); }
  };
  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const lessonMap = new Map(course.lessons.map(lesson => [lesson.id, lesson]));
  labConfigs.forEach((lab, index) => {
    const lesson = lessonMap.get(lab.id);
    lab.number = index + 1;
    lab.chapter = lesson?.chapter ?? 0;
    lab.courseTitle = lesson?.title || lab.title;
    lab.formula = lesson?.formula || '';
    lab.summary = lesson?.summary || lab.intro;
    lab.relationship = lesson?.relationship || '';
    lab.reward = 40 + lab.chapter * 5 + (index % 3) * 5;
  });

  const urlParams = new URLSearchParams(location.search);
  const requestedId = urlParams.get('lesson');
  const embedded = urlParams.get('embed') === '1';
  const lab = labConfigs.find(item => item.id === requestedId) || labConfigs[0];
  const lesson = lessonMap.get(lab.id);
  const labIndex = labConfigs.indexOf(lab);

  const globalState = readJSON('idrokState', {completed: [], score: 0, impulse: 0, theme: 'light'});
  globalState.completed = Array.isArray(globalState.completed) ? globalState.completed : [];
  globalState.impulse = Number(globalState.impulse) || 0;
  globalState.score = Number(globalState.score) || 0;

  const labCourseState = readJSON('idrokLabCourse', {completed: [], awarded: [], best: {}, last: 'l1'});
  labCourseState.completed = Array.isArray(labCourseState.completed) ? labCourseState.completed.filter(id => lessonMap.has(id)) : [];
  labCourseState.awarded = Array.isArray(labCourseState.awarded) ? labCourseState.awarded.filter(id => lessonMap.has(id)) : [];
  labCourseState.best = labCourseState.best && typeof labCourseState.best === 'object' ? labCourseState.best : {};
  labCourseState.last = lab.id;

  const state = {
    a: lab.controls.a.value,
    b: lab.controls.b.value,
    dragX: lab.drag.x,
    dragY: lab.drag.y,
    actions: 0,
    pulse: 0,
    held: false,
    paused: false,
    view: 'scene',
    progress: 0,
    completedNow: false,
    completionHold: 0,
  };

  const canvas = $('#simCanvas');
  const ctx = canvas.getContext('2d');
  const labHref = id => id === 'l5' ? 'gas-lab.html' : `lab.html?lesson=${id}`;
  let currentHandle = sceneApi.getHandle(lab, state);
  let animationFrame = 0;
  let previousFrame = performance.now();
  let lastUiUpdate = 0;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  }

  function formatValue(value, control) {
    const span = control.max - control.min;
    const decimals = span <= 3 ? 2 : span <= 20 ? 1 : 0;
    const number = Number(value).toLocaleString('uz-UZ', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
    return `${number}${control.unit ? ` ${control.unit}` : ''}`;
  }

  function makeControl(key, control) {
    const step = control.max - control.min <= 3 ? .01 : control.max - control.min <= 20 ? .1 : 1;
    return `<div class="control-row">
      <div><label for="control-${key}">${escapeHtml(control.label)}</label><output id="output-${key}" for="control-${key}">${escapeHtml(formatValue(state[key], control))}</output></div>
      <input id="control-${key}" data-control="${key}" type="range" min="${control.min}" max="${control.max}" step="${step}" value="${state[key]}" aria-label="${escapeHtml(control.label)}">
    </div>`;
  }

  function setupPage() {
    const chapter = course.chapters[lab.chapter];
    document.title = `${lab.title} — Idrok Laboratoriya`;
    $('#headerLabName').textContent = lab.title;
    $('#labKicker').textContent = `${lab.chapter + 1}-BOB • ${lab.number}-TAJRIBA • ${chapter.title}`;
    $('#labTitle').textContent = lab.title;
    $('#labIntro').textContent = lab.intro;
    $('#labNumber').textContent = `${String(lab.number).padStart(2, '0')} / 59`;
    $('#labRole').textContent = lab.role;
    $('#labReward').textContent = `+${lab.reward} ϟ`;
    $('#courseReturn').href = `physics.html#${lab.id}`;
    $('#panelTitle').textContent = lab.title;
    $('#panelRole').textContent = `${lab.role} rejimi`;
    $('#labSymbol').textContent = String(lab.number).padStart(2, '0');
    $('#dragLabel').textContent = lab.drag.label;
    $('#experimentAction').textContent = lab.actionLabel;
    $('#challengeTitle').textContent = lab.role;
    $('#challengeText').textContent = lab.challenge;
    $('#challengeReward').textContent = `+${lab.reward} ϟ`;
    $('#simAiContext').textContent = `${lab.number}-tajriba · ${lab.title}`;
    $('#dynamicControls').innerHTML = makeControl('a', lab.controls.a) + makeControl('b', lab.controls.b);
    $('#metricALabel').textContent = lab.controls.a.label.toUpperCase();
    $('#metricBLabel').textContent = lab.controls.b.label.toUpperCase();

    const previous = labConfigs[labIndex - 1];
    const next = labConfigs[labIndex + 1];
    $('#previousLab').href = previous ? labHref(previous.id) : 'labs.html';
    $('#previousLab').querySelector('b').textContent = previous ? previous.title : 'Laboratoriya katalogi';
    $('#nextLab').href = next ? labHref(next.id) : 'labs.html';
    $('#nextLab').querySelector('b').textContent = next ? next.title : 'Kurs laboratoriyalari yakuni';

    $$('[data-control]').forEach(input => input.addEventListener('input', () => {
      state[input.dataset.control] = Number(input.value);
      state.completedNow = false;
      state.completionHold = 0;
      $('#dragHint').classList.add('hidden');
      updateUi(true);
    }));
  }

  function criterionProgress(value, range, span = 1) {
    const min = Number(range[0]);
    const max = Number(range[1]);
    if (value >= min && value <= max) return 1;
    const distance = value < min ? min - value : value - max;
    return clamp(1 - distance / Math.max(span * .42, max - min, .001), 0, .96);
  }

  function challengeProgress() {
    const checks = [];
    const goal = lab.goal;
    if (goal.a) checks.push({value: criterionProgress(state.a, goal.a, lab.controls.a.max - lab.controls.a.min), ok: state.a >= goal.a[0] && state.a <= goal.a[1]});
    if (goal.b) checks.push({value: criterionProgress(state.b, goal.b, lab.controls.b.max - lab.controls.b.min), ok: state.b >= goal.b[0] && state.b <= goal.b[1]});
    if (goal.dragX) checks.push({value: criterionProgress(state.dragX, goal.dragX, 1), ok: state.dragX >= goal.dragX[0] && state.dragX <= goal.dragX[1]});
    if (goal.dragY) checks.push({value: criterionProgress(state.dragY, goal.dragY, 1), ok: state.dragY >= goal.dragY[0] && state.dragY <= goal.dragY[1]});
    if (goal.actions) checks.push({value: clamp(state.actions / goal.actions, 0, 1), ok: state.actions >= goal.actions});
    const average = checks.reduce((sum, check) => sum + check.value, 0) / Math.max(checks.length, 1);
    return {percent: Math.round(average * 100), solved: checks.every(check => check.ok)};
  }

  function updateUi(force = false) {
    const now = performance.now();
    if (!force && now - lastUiUpdate < 90) return;
    lastUiUpdate = now;
    const result = challengeProgress();
    state.progress = result.percent;
    $('#output-a').textContent = formatValue(state.a, lab.controls.a);
    $('#output-b').textContent = formatValue(state.b, lab.controls.b);
    $('#metricA').textContent = formatValue(state.a, lab.controls.a);
    $('#metricB').textContent = formatValue(state.b, lab.controls.b);
    $('#metricProgress').textContent = `${result.percent}%`;
    $('#metricActions').textContent = String(state.actions);
    $('#challengeProgress').style.width = `${result.percent}%`;
    labCourseState.best[lab.id] = Math.max(Number(labCourseState.best[lab.id]) || 0, result.percent);

    if (state.completedNow) {
      $('#challengeStatus').textContent = 'Bajarildi — ajoyib tajriba!';
      $('#labState').textContent = 'BAJARILDI';
      $('#simChallenge').classList.add('done');
      $('#stageStatus').textContent = 'Missiya bajarildi. Natijalarni boshqa rejimlarda ham kuzatib ko‘ring.';
    } else if (state.held) {
      $('#challengeStatus').textContent = `Jism harakatda • ${result.percent}%`;
      $('#stageStatus').textContent = `${lab.drag.label} harakatlantirilmoqda.`;
    } else if (!state.actions) {
      $('#challengeStatus').textContent = `Tayyorlik ${result.percent}% • tajribani ishga tushiring`;
      $('#stageStatus').textContent = `${lab.drag.label}ni ushlab sudrang, so‘ng tajribani boshlang.`;
    } else {
      $('#challengeStatus').textContent = `Yana oz qoldi • ${result.percent}%`;
      $('#stageStatus').textContent = result.percent >= 75 ? 'Maqsadga juda yaqin. Parametrlarni nozik sozlang.' : 'Parametr va jism o‘rnini missiyaga moslang.';
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
    user.labCourse = JSON.parse(JSON.stringify(labCourseState));
    writeJSON('idrokUsers', users);
  }

  function persist() {
    writeJSON('idrokLabCourse', labCourseState);
    writeJSON('idrokState', globalState);

    const legacyLab = readJSON('idrokLabState', {completed: []});
    legacyLab.completed = Array.isArray(legacyLab.completed) ? legacyLab.completed : [];
    if (labCourseState.completed.includes(lab.id) && !legacyLab.completed.includes(lab.id)) legacyLab.completed.push(lab.id);
    writeJSON('idrokLabState', legacyLab);

    const physics = readJSON('idrokPhysics', {version: course.version, completed: [], scores: {}, current: lab.id, stages: {}});
    physics.stages = physics.stages && typeof physics.stages === 'object' ? physics.stages : {};
    physics.stages[lab.id] = physics.stages[lab.id] || {nazariya:false,video:false,misol:false,tajriba:false,simulyatsiya:false,quiz:false};
    physics.stages[lab.id].simulyatsiya = true;
    physics.current = lab.id;
    physics.lastActivity = Date.now();
    writeJSON('idrokPhysics', physics);
    syncUser();
  }

  function completeLab() {
    if (state.completedNow) return;
    state.completedNow = true;
    const firstCompletion = !labCourseState.completed.includes(lab.id);
    if (firstCompletion) labCourseState.completed.push(lab.id);
    if (!labCourseState.awarded.includes(lab.id)) {
      labCourseState.awarded.push(lab.id);
      globalState.impulse += lab.reward;
      globalState.score += 10;
      const globalKey = `lab-${lab.id}`;
      if (!globalState.completed.includes(globalKey)) globalState.completed.push(globalKey);
    }
    persist();
    if (embedded && window.parent !== window) {
      window.parent.postMessage({type: 'idrok-lab-complete', lessonId: lab.id}, '*');
    }
    updateAccountUi();
    updateUi(true);
    launchConfetti();
    showToast(firstCompletion ? `Ajoyib! +${lab.reward} Impulse olindi.` : 'Missiya yana muvaffaqiyatli bajarildi.');
  }

  function resetLab() {
    state.a = lab.controls.a.value;
    state.b = lab.controls.b.value;
    state.dragX = lab.drag.x;
    state.dragY = lab.drag.y;
    state.actions = 0;
    state.pulse = 0;
    state.held = false;
    state.completedNow = false;
    state.completionHold = 0;
    $('#control-a').value = String(state.a);
    $('#control-b').value = String(state.b);
    $('#simChallenge').classList.remove('done');
    $('#labState').textContent = 'FAOL';
    $('#dragHint').classList.remove('hidden');
    updateUi(true);
    showToast('Tajriba boshlang‘ich holatga qaytdi.');
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width * canvas.width,
      y: (event.clientY - rect.top) / rect.height * canvas.height,
    };
  }

  function updateDrag(point) {
    const normalizedX = clamp((point.x - 72) / (canvas.width - 144), 0, 1);
    const normalizedY = clamp((point.y - 70) / (canvas.height - 140), 0, 1);
    if (lab.drag.mode !== 'y') state.dragX = normalizedX;
    if (lab.drag.mode !== 'x') state.dragY = normalizedY;
    state.completedNow = false;
    state.completionHold = 0;
    $('#dragHint').classList.add('hidden');
    updateUi(true);
  }

  canvas.addEventListener('pointerdown', event => {
    const point = pointerPosition(event);
    const distance = Math.hypot(point.x - currentHandle.x, point.y - currentHandle.y);
    if (distance > currentHandle.radius + 35) {
      state.pulse = 1;
      $('#dragHint').classList.add('hidden');
      return;
    }
    state.held = true;
    canvas.classList.add('dragging');
    canvas.setPointerCapture(event.pointerId);
    updateDrag(point);
  });
  canvas.addEventListener('pointermove', event => {
    if (!state.held) return;
    updateDrag(pointerPosition(event));
  });
  const releasePointer = event => {
    if (!state.held) return;
    state.held = false;
    canvas.classList.remove('dragging');
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    updateUi(true);
  };
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);

  function updateAccountUi() {
    const users = readJSON('idrokUsers', []);
    const email = localStorage.getItem('idrokCurrentUser') || '';
    const user = Array.isArray(users) ? users.find(item => item.email === email) : null;
    const name = user?.name || 'Izlanuvchi';
    const done = labCourseState.completed.length;
    const percent = Math.round(done / 59 * 100);
    $('#simImpulse').textContent = String(globalState.impulse);
    $('#simSideImpulse').textContent = String(globalState.impulse);
    $('#simSidePercent').textContent = `${percent}%`;
    $('#simSideMeta').textContent = `${done} / 59 bajarildi`;
    $('#simUserName').textContent = name;
    $('#simAvatar').textContent = name.slice(0, 2).toUpperCase();
  }

  function showToast(message) {
    const toast = $('#simToast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2700);
  }

  function launchConfetti() {
    const host = $('#simConfetti');
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

  function setMenu(open) {
    $('#simSidebar').classList.toggle('open', open);
    $('#simOverlay').classList.toggle('open', open);
  }

  function setAi(open) {
    $('#simAiPanel').classList.toggle('open', open);
    $('#simAiPanel').setAttribute('aria-hidden', String(!open));
    $('#simAiLauncher').setAttribute('aria-expanded', String(open));
  }

  function aiAnswer(kind) {
    const answers = {
      explain: `<b>${escapeHtml(lab.courseTitle)}</b><br>${escapeHtml(lesson.summary)} Tajribada ${escapeHtml(lab.controls.a.label.toLowerCase())} va ${escapeHtml(lab.controls.b.label.toLowerCase())} o‘zgartiriladi.`,
      formula: `<b>Asosiy formula:</b> ${escapeHtml(lesson.formula)}<br>${escapeHtml(lesson.relationship)}`,
      hint: `<b>Maslahat:</b> ${escapeHtml(lab.challenge)} Avval jismni sudrang, keyin parametrlarni maqsad oralig‘iga keltirib “${escapeHtml(lab.actionLabel)}” tugmasini bosing.`,
    };
    const row = document.createElement('div');
    row.className = 'sim-ai-message';
    row.innerHTML = `<span>✦</span><p>${answers[kind] || answers.explain}</p>`;
    $('#simAiMessages').appendChild(row);
    $('#simAiMessages').scrollTop = $('#simAiMessages').scrollHeight;
  }

  function loop(now) {
    const dt = Math.min(.04, Math.max(.001, (now - previousFrame) / 1000));
    previousFrame = now;
    if (!state.paused) {
      state.pulse = Math.max(0, state.pulse - dt * 1.5);
      const result = challengeProgress();
      if (result.solved) {
        state.completionHold += dt;
        if (state.completionHold >= .65) completeLab();
      } else {
        state.completionHold = 0;
      }
    }
    currentHandle = sceneApi.drawLabScene(ctx, lab, state, now / 1000);
    updateUi();
    animationFrame = requestAnimationFrame(loop);
  }

  function validateLabs() {
    const issues = [];
    const ids = new Set();
    const scenes = new Set();
    labConfigs.forEach((item, index) => {
      if (ids.has(item.id)) issues.push(`Takroriy id: ${item.id}`);
      if (scenes.has(item.scene)) issues.push(`Takroriy sahna: ${item.scene}`);
      ids.add(item.id); scenes.add(item.scene);
      if (!lessonMap.has(item.id)) issues.push(`Mavzu topilmadi: ${item.id}`);
      if (!item.controls?.a || !item.controls?.b) issues.push(`Boshqaruv yo‘q: ${item.id}`);
      ['a','b'].forEach(key => {
        const range = item.goal?.[key];
        const control = item.controls?.[key];
        if (range && control && (range[0] < control.min || range[1] > control.max || range[0] > range[1])) issues.push(`Yechilmaydigan ${key}: ${item.id}`);
      });
      ['dragX','dragY'].forEach(key => {
        const range = item.goal?.[key];
        if (range && (range[0] < 0 || range[1] > 1 || range[0] > range[1])) issues.push(`Yechilmaydigan ${key}: ${item.id}`);
      });
      if (!item.challenge || !item.actionLabel || !item.title || !item.intro) issues.push(`Matn yetishmaydi: ${item.id}`);
      if (item.number !== index + 1) issues.push(`Tartib xatosi: ${item.id}`);
    });
    return {count: labConfigs.length, uniqueScenes: scenes.size, issues};
  }

  $('#experimentAction').addEventListener('click', event => {
    state.actions++;
    state.pulse = 1;
    state.completedNow = false;
    state.completionHold = 0;
    $('#dragHint').classList.add('hidden');
    const rect = event.currentTarget.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const pulse = $('#simPulse');
    pulse.style.left = `${clamp(rect.left + rect.width / 2 - canvasRect.left, 10, canvasRect.width - 10)}px`;
    pulse.style.top = `${clamp(rect.top - canvasRect.top, 10, canvasRect.height - 10)}px`;
    pulse.classList.remove('show');
    requestAnimationFrame(() => pulse.classList.add('show'));
    updateUi(true);
    showToast(`${lab.actionLabel}: tajriba ishga tushdi.`);
  });
  $('#simReset').addEventListener('click', resetLab);
  $('#simPause').addEventListener('click', event => {
    state.paused = !state.paused;
    event.currentTarget.innerHTML = state.paused ? '<span>▶</span> Davom' : '<span>Ⅱ</span> Pauza';
    showToast(state.paused ? 'Simulyatsiya pauzada.' : 'Simulyatsiya davom etmoqda.');
  });
  $('#simHint').addEventListener('click', () => showToast(lab.challenge));
  $$('.sim-mode-tabs button').forEach(button => button.addEventListener('click', () => {
    state.view = button.dataset.view;
    $$('.sim-mode-tabs button').forEach(item => item.classList.toggle('active', item === button));
  }));
  $('#simTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    globalState.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    writeJSON('idrokState', globalState);
  });
  $('#openSimMenu').addEventListener('click', () => setMenu(true));
  $('#closeSimMenu').addEventListener('click', () => setMenu(false));
  $('#simOverlay').addEventListener('click', () => setMenu(false));
  $('#simAiNav').addEventListener('click', () => { setMenu(false); setAi(true); });
  $('#simAiLauncher').addEventListener('click', () => setAi(!$('#simAiPanel').classList.contains('open')));
  $('#closeSimAi').addEventListener('click', () => setAi(false));
  $$('[data-ai]').forEach(button => button.addEventListener('click', () => aiAnswer(button.dataset.ai)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setAi(false); setMenu(false); }
    if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.metaKey) resetLab();
  });

  if (globalState.theme === 'dark') document.body.classList.add('dark');
  if (embedded) document.body.classList.add('embed');
  setupPage();
  updateAccountUi();
  updateUi(true);
  writeJSON('idrokLabCourse', labCourseState);
  window.IdrokLabDebug = Object.freeze({
    validate: validateLabs,
    snapshot: () => ({id: lab.id, scene: lab.scene, state: {...state}, challenge: challengeProgress(), handle: {...currentHandle}}),
  });
  animationFrame = requestAnimationFrame(loop);
  window.addEventListener('beforeunload', () => cancelAnimationFrame(animationFrame));
})();

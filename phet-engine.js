(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const requestedCourse = params.get('course');
  const courseCode = ['7', '8', '9', '10'].includes(requestedCourse) ? requestedCourse : '9';
  const isGrade7 = courseCode === '7';
  const isGrade8 = courseCode === '8';
  const isGrade10 = courseCode === '10';
  const course = isGrade7 ? window.PHYSICS_COURSE7 : isGrade8 ? window.PHYSICS_COURSE8 : isGrade10 ? window.PHYSICS_COURSE10 : window.PHYSICS_COURSE9;
  const labConfigs = isGrade7 ? window.IDROK_LABS7 : isGrade8 ? window.IDROK_LABS8 : isGrade10 ? window.IDROK_LABS10 : window.IDROK_LABS9;
  const phet = isGrade7 ? window.IDROK_PHET7 : isGrade8 ? window.IDROK_PHET8 : isGrade10 ? window.IDROK_PHET10 : window.IDROK_PHET9;
  const physicsStorageKey = isGrade7 ? 'idrokPhysics7' : isGrade10 ? 'idrokPhysics10' : 'idrokPhysics';
  const labStorageKey = isGrade7 ? 'idrokLabCourse7' : isGrade10 ? 'idrokLabCourse10' : 'idrokLabCourse';
  const coursePage = isGrade7 ? 'physics7.html' : isGrade8 ? 'physics8.html' : isGrade10 ? 'physics10.html' : 'physics.html';
  const labBase = `lab.html?course=${courseCode}`;
  const grade7LabCount = window.IDROK_LABS7?.length || 0;
  const grade8LabCount = window.IDROK_LABS8?.length || 0;
  const grade9LabCount = window.IDROK_LABS9?.length || 0;
  const grade10LabCount = window.IDROK_LABS10?.length || 0;
  const labOffset = isGrade7 ? 0 : isGrade8 ? grade7LabCount : isGrade10 ? grade7LabCount + grade8LabCount + grade9LabCount : grade7LabCount + grade8LabCount;
  const totalLabCount = grade7LabCount + grade8LabCount + grade9LabCount + grade10LabCount;
  if (!course || !Array.isArray(course.lessons) || !course.lessons.length || !Array.isArray(labConfigs) || !labConfigs.length || !phet || !Object.keys(phet.lessons || {}).length) {
    document.body.innerHTML = '<main class="fatal-lab"><h1>Laboratoriya yuklanmadi</h1><p>Sahifani qayta ochib ko‘ring.</p></main>';
    return;
  }

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const readJSON = (key, fallback) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      return parsed && typeof parsed === 'object' ? parsed : JSON.parse(JSON.stringify(fallback));
    } catch { return JSON.parse(JSON.stringify(fallback)); }
  };
  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

  const lessonMap = new Map(course.lessons.map(lesson => [lesson.id, lesson]));
  labConfigs.forEach((lab, index) => {
    const lesson = lessonMap.get(lab.id);
    lab.number = index + 1 + labOffset;
    lab.chapter = lesson?.chapter ?? 0;
    lab.courseTitle = lesson?.title || lab.title;
    lab.reward = 40 + lab.chapter * 5 + (index % 3) * 5;
  });

  const embedded = params.get('embed') === '1';
  const requestedId = params.get('lesson');
  const requestedSimulation = params.get('sim');
  const extraSimulation = requestedSimulation && phet.simulations[requestedSimulation];
  const lab = extraSimulation ? {
    id: `extra-${requestedSimulation}`,
    title: extraSimulation.title,
    intro: 'Erkin interaktiv fizika tajribasi.',
    role: 'Erkin tadqiqot',
    chapter: -1,
    number: totalLabCount + 1 + phet.catalog.findIndex(item => item.key === requestedSimulation),
    reward: 0,
    extra: true,
  } : (labConfigs.find(item => item.id === requestedId) || labConfigs[0]);
  const labIndex = labConfigs.indexOf(lab);
  const lesson = lessonMap.get(lab.id);
  const config = extraSimulation ? {
    id: lab.id,
    kind: 'official',
    simulation: requestedSimulation,
    screen: 1,
    mission: 'Parametrlarni erkin o‘zgartiring va fizik bog‘lanishni kuzating.',
    checklist: ['Simulyatsiyadagi asosiy boshqaruvni sinab ko‘ring.', 'Kamida ikki parametrni o‘zgartirib natijani taqqoslang.', 'Kuzatuvingizdan fizik xulosa chiqaring.'],
    hint: 'Bir vaqtda faqat bitta parametrni o‘zgartirsangiz, sabab va natija aniqroq ko‘rinadi.',
  } : phet.lessons[lab.id];
  const simulation = phet.simulations[config.simulation];
  const displayTitle = (isGrade7 || isGrade10) && !lab.extra ? lesson.title : simulation.title;
  const phetUrl = phet.buildUrl(config);

  const globalState = readJSON('idrokState', {completed: [], score: 0, impulse: 0, theme: 'light'});
  globalState.completed = Array.isArray(globalState.completed) ? globalState.completed : [];
  globalState.impulse = Number(globalState.impulse) || 0;
  globalState.score = Number(globalState.score) || 0;

  const labCourseState = readJSON(labStorageKey, {completed: [], awarded: [], best: {}, checks: {}, last: 'l1'});
  labCourseState.completed = Array.isArray(labCourseState.completed) ? labCourseState.completed.filter(id => lessonMap.has(id)) : [];
  labCourseState.awarded = Array.isArray(labCourseState.awarded) ? labCourseState.awarded.filter(id => lessonMap.has(id)) : [];
  labCourseState.best = labCourseState.best && typeof labCourseState.best === 'object' ? labCourseState.best : {};
  labCourseState.checks = labCourseState.checks && typeof labCourseState.checks === 'object' ? labCourseState.checks : {};
  labCourseState.last = lab.id;

  const savedChecks = Array.isArray(labCourseState.checks[lab.id]) ? labCourseState.checks[lab.id].slice(0, 3).map(Boolean) : [];
  const alreadyCompleted = labCourseState.completed.includes(lab.id);
  const state = {
    checks: Array.from({length: 3}, (_, index) => alreadyCompleted || Boolean(savedChecks[index])),
    loaded: false,
    completedNow: alreadyCompleted,
  };

  function setupShell() {
    $('.simulator-shell').innerHTML = `
      <section class="phet-stage-column" aria-label="Interaktiv fizika simulyatsiyasi">
        <div class="phet-toolbar">
          <div class="phet-official">
            <span>ID</span>
            <p><b>${escapeHtml(displayTitle)}</b><small>${simulation.locale === 'en' ? 'Rasmiy simulyatsiya · inglizcha panel' : 'O‘zbekcha simulyatsiya'}</small></p>
            <em class="phet-live-state"><i id="phetStatusDot"></i><b id="phetStatus">Yuklanmoqda</b></em>
          </div>
          <div class="phet-toolbar-actions">
            <button class="phet-complete-button ${alreadyCompleted ? 'done' : ''}" id="phetComplete" type="button" disabled>
              <span>${alreadyCompleted ? '✓' : '⚡'}</span><b>${alreadyCompleted ? 'Bajarildi' : 'Yakunlash'}</b>
            </button>
            <button id="phetReload" type="button" title="Simulyatsiyani qayta yuklash"><span>↻</span><b>Qayta</b></button>
            <button id="phetFullscreen" type="button" title="To‘liq ekranga o‘tish"><span>⛶</span><b>To‘liq ekran</b></button>
          </div>
        </div>
        <div class="phet-frame-wrap is-official" id="phetFrameWrap">
          <div class="phet-loader" id="phetLoader"><span></span><b>Tajriba yuklanmoqda…</b><small>Interaktiv sahna tayyorlanmoqda</small></div>
          <button class="phet-theater-close" id="phetTheaterClose" type="button" aria-label="To‘liq ekran rejimini yopish">×</button>
          <iframe id="phetFrame" src="about:blank" title="${escapeHtml(displayTitle)} — interaktiv simulyatsiya" allow="fullscreen; autoplay; gamepad" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <p class="phet-attribution">Manba: Kolorado Boulder universitetining PhET loyihasi — CC BY-NC 4.0.</p>
      </section>
      <div class="phet-progress-sentinel" hidden aria-hidden="true">
        <b id="missionState">${alreadyCompleted ? 'BAJARILDI' : 'FAOL'}</b>
        <b id="phetProgressText">0 / 3</b><i id="phetProgressBar"></i>
        <div id="phetChecklist">
          ${config.checklist.map((item, index) => `<label><input type="checkbox" data-check="${index}" ${state.checks[index] ? 'checked' : ''}><i>${index + 1}</i><b>${escapeHtml(item)}</b></label>`).join('')}
        </div>
      </div>`;
  }

  function setupPage() {
    const chapter = course.chapters[lab.chapter];
    document.title = `${displayTitle} — Idrok laboratoriyasi`;
    $('#headerLabName').textContent = displayTitle;
    $('#labKicker').textContent = lab.extra ? `QO‘SHIMCHA • ${lab.number}-TAJRIBA` : `${lab.chapter + 1}-BOB • ${lab.number}-TAJRIBA • ${chapter.title}`;
    $('#labTitle').textContent = displayTitle;
    $('#labIntro').textContent = `${config.mission} ${simulation.locale === 'en' ? 'Boshqaruv paneli inglizcha, topshiriq va yordam o‘zbekcha.' : 'O‘zbekcha interaktiv simulyatsiyada o‘zingiz sinab ko‘ring.'}`;
    $('#labNumber').textContent = `${String(lab.number).padStart(2, '0')} / ${totalLabCount}`;
    $('#labRole').textContent = lab.role;
    $('#labReward').textContent = `+${lab.reward} ϟ`;
    $('#courseReturn').href = lab.extra ? 'labs.html' : `${coursePage}#${lab.id}`;
    $('#courseReturn').innerHTML = lab.extra ? 'Katalogga qaytish <span>→</span>' : 'Mavzuga qaytish <span>→</span>';
    $('#simAiContext').textContent = `${lab.number}-tajriba · ${displayTitle}`;

    const previous = lab.extra ? null : labConfigs[labIndex - 1];
    const next = lab.extra ? null : labConfigs[labIndex + 1];
    const mappedTitle = item => {
      if (!item) return '';
      if (isGrade7 || isGrade10) return lessonMap.get(item.id)?.title || item.courseTitle || item.title;
      return phet.simulations[phet.lessons[item.id]?.simulation]?.title || item.title;
    };
    $('#previousLab').href = previous ? `${labBase}&lesson=${previous.id}` : 'labs.html';
    $('#previousLab').querySelector('b').textContent = previous ? mappedTitle(previous) : 'Laboratoriya katalogi';
    $('#nextLab').href = next ? `${labBase}&lesson=${next.id}` : 'labs.html';
    $('#nextLab').querySelector('b').textContent = next ? mappedTitle(next) : 'Kurs laboratoriyalari yakuni';
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

  function persist(completed = false) {
    labCourseState.checks[lab.id] = [...state.checks];
    labCourseState.best[lab.id] = Math.max(Number(labCourseState.best[lab.id]) || 0, Math.round(state.checks.filter(Boolean).length / 3 * 100));
    writeJSON(labStorageKey, labCourseState);
    writeJSON('idrokState', globalState);
    if (!completed) { syncUser(); return; }

    const legacyLab = readJSON('idrokLabState', {completed: []});
    legacyLab.completed = Array.isArray(legacyLab.completed) ? legacyLab.completed : [];
    if (!legacyLab.completed.includes(lab.id)) legacyLab.completed.push(lab.id);
    writeJSON('idrokLabState', legacyLab);

    const physics = readJSON(physicsStorageKey, {version: course.version, completed: [], scores: {}, current: lab.id, stages: {}});
    physics.stages = physics.stages && typeof physics.stages === 'object' ? physics.stages : {};
    physics.stages[lab.id] = physics.stages[lab.id] || {nazariya:false,video:false,misol:false,tajriba:false,simulyatsiya:false,quiz:false};
    physics.stages[lab.id].simulyatsiya = true;
    physics.current = lab.id;
    physics.lastActivity = Date.now();
    writeJSON(physicsStorageKey, physics);
    syncUser();
  }

  function updateAccountUi() {
    const users = readJSON('idrokUsers', []);
    const email = localStorage.getItem('idrokCurrentUser') || '';
    const user = Array.isArray(users) ? users.find(item => item.email === email) : null;
    const name = user?.name || 'Izlanuvchi';
    const done = labCourseState.completed.length;
    const percent = Math.round(done / labConfigs.length * 100);
    $('#simImpulse').textContent = String(globalState.impulse);
    $('#simSideImpulse').textContent = String(globalState.impulse);
    $('#simSidePercent').textContent = `${percent}%`;
    $('#simSideMeta').textContent = `${done} / ${labConfigs.length} bajarildi`;
    $('#simUserName').textContent = name;
    $('#simAvatar').textContent = name.slice(0, 2).toUpperCase();
  }

  function updateMissionUi() {
    const done = state.checks.filter(Boolean).length;
    const percent = Math.round(done / 3 * 100);
    $('#phetProgressText').textContent = `${done} / 3`;
    $('#phetProgressBar').style.width = `${percent}%`;
    $('#phetComplete').disabled = !state.loaded || state.completedNow;
    $('#phetComplete').classList.toggle('done', state.completedNow);
    $('#missionState').textContent = state.completedNow ? 'BAJARILDI' : done === 3 ? 'TAYYOR' : 'FAOL';
    $('#missionState').classList.toggle('ready', done === 3 && !state.completedNow);
    $('#missionState').classList.toggle('done', state.completedNow);
    $$('[data-check]').forEach(input => {
      const index = Number(input.dataset.check);
      const label = input.closest('label');
      label.classList.toggle('checked', state.checks[index]);
      label.querySelector('i').textContent = state.checks[index] ? '✓' : String(index + 1);
    });
  }

  function showToast(message) {
    const toast = $('#simToast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
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

  function completeLab() {
    if (state.completedNow || !state.loaded) return;
    state.checks = [true, true, true];
    const firstCompletion = !labCourseState.completed.includes(lab.id);
    state.completedNow = true;
    if (firstCompletion) labCourseState.completed.push(lab.id);
    if (!labCourseState.awarded.includes(lab.id)) {
      labCourseState.awarded.push(lab.id);
      globalState.impulse += lab.reward;
      globalState.score += 10;
      const globalKey = `lab${courseCode}-${lab.id}`;
      if (!globalState.completed.includes(globalKey)) globalState.completed.push(globalKey);
    }
    persist(true);
    updateAccountUi();
    updateMissionUi();
    $('#phetComplete').innerHTML = '<span>✓</span><b>Bajarildi</b>';
    if (embedded && window.parent !== window) window.parent.postMessage({type: 'idrok-lab-complete', lessonId: lab.id, course: courseCode}, '*');
    launchConfetti();
    showToast(firstCompletion ? `Ajoyib! +${lab.reward} Impulse olindi.` : 'Missiya muvaffaqiyatli bajarildi.');
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
      explain: `<b>${escapeHtml(lab.courseTitle)}</b><br>${escapeHtml(lesson.summary)} Simulyatsiyada: ${escapeHtml(config.mission)}`,
      formula: `<b>Asosiy formula:</b> ${escapeHtml(lesson.formula)}<br>${escapeHtml(lesson.relationship)}`,
      hint: `<b>Amaliy maslahat:</b> ${escapeHtml(config.hint)} Keyin qadamlarni bittadan bajaring.`,
    };
    const row = document.createElement('div');
    row.className = 'sim-ai-message';
    row.innerHTML = `<span>✦</span><p>${answers[kind] || answers.explain}</p>`;
    $('#simAiMessages').appendChild(row);
    $('#simAiMessages').scrollTop = $('#simAiMessages').scrollHeight;
  }

  function reloadPhet() {
    const frame = $('#phetFrame');
    state.loaded = false;
    $('#phetLoader').classList.remove('hidden');
    $('#phetStatus').textContent = 'Simulyatsiya qayta yuklanmoqda';
    $('#phetStatusDot').classList.remove('ready');
    updateMissionUi();
    const separator = phetUrl.includes('?') ? '&' : '?';
    frame.src = `${phetUrl}${separator}idrok_reload=${Date.now()}`;
  }

  function setTheater(open) {
    $('#phetFrameWrap').classList.toggle('theater', open);
    document.body.classList.toggle('phet-theater-open', open);
    $('#phetFullscreen').setAttribute('aria-pressed', String(open));
  }

  function validate() {
    const issues = [];
    const ids = Object.keys(phet.lessons);
    const allowed = new Set(Object.keys(phet.simulations));
    const identities = new Set();
    const previewIdentities = new Set();
    if (ids.length < 1) issues.push(`Simulyatsiya xaritasi bo‘sh.`);
    course.lessons.forEach((item, index) => {
      const entry = phet.lessons[item.id];
      if (!entry) issues.push(`${item.id}: simulyatsiya mosligi yo‘q.`);
      if (entry?.kind === 'official' && !allowed.has(entry.simulation)) issues.push(`${item.id}: rasmiy simulyatsiya topilmadi.`);
      if (entry?.kind !== 'official') issues.push(`${item.id}: rasmiy simulyatsiya emas.`);
      if (entry && (!Array.isArray(entry.checklist) || entry.checklist.length !== 3)) issues.push(`${item.id}: topshiriqlar soni 3 emas.`);
      if (labConfigs[index]?.id !== item.id) issues.push(`${item.id}: laboratoriya tartibi buzilgan.`);
      if (entry) {
        const identity = `official:${phet.simulations[entry.simulation]?.slug}:screen-${entry.screen || 1}`;
        const previewIdentity = `official:${phet.simulations[entry.simulation]?.slug}`;
        if (identities.has(identity)) issues.push(`${item.id}: takrorlangan simulyatsiya (${identity}).`);
        if (previewIdentities.has(previewIdentity)) issues.push(`${item.id}: takrorlangan preview (${previewIdentity}).`);
        identities.add(identity);
        previewIdentities.add(previewIdentity);
      }
    });
    return {lessons: ids.length, simulations: identities.size, previews: previewIdentities.size, official: ids.filter(id => phet.lessons[id].kind === 'official').length, custom: ids.filter(id => phet.lessons[id].kind === 'custom').length, issues};
  }

  setupShell();
  setupPage();

  $$('[data-check]').forEach(input => input.addEventListener('change', () => {
    state.checks[Number(input.dataset.check)] = input.checked;
    if (!state.checks.every(Boolean)) state.completedNow = false;
    persist(false);
    updateMissionUi();
  }));
  $('#phetComplete').addEventListener('click', completeLab);
  $('#phetReload').addEventListener('click', reloadPhet);
  $('#phetFullscreen').addEventListener('click', () => setTheater(true));
  $('#phetTheaterClose').addEventListener('click', () => setTheater(false));
  $('#phetFrame').addEventListener('load', () => {
    if ($('#phetFrame').src === 'about:blank') return;
    state.loaded = true;
    $('#phetLoader').classList.add('hidden');
    $('#phetStatus').textContent = 'Simulyatsiya tayyor';
    $('#phetStatusDot').classList.add('ready');
    updateMissionUi();
  });
  $('#phetFrame').src = phetUrl;

  $('#simTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    globalState.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    persist(false);
  });
  $('#openSimMenu').addEventListener('click', () => setMenu(true));
  $('#closeSimMenu').addEventListener('click', () => setMenu(false));
  $('#simOverlay').addEventListener('click', () => setMenu(false));
  $('#simAiNav').addEventListener('click', () => { setMenu(false); setAi(true); });
  $('#simAiLauncher').addEventListener('click', () => setAi(!$('#simAiPanel').classList.contains('open')));
  $('#closeSimAi').addEventListener('click', () => setAi(false));
  $$('[data-ai]').forEach(button => button.addEventListener('click', () => aiAnswer(button.dataset.ai)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setTheater(false); setAi(false); setMenu(false); }
    if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.metaKey && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) reloadPhet();
  });

  if (globalState.theme === 'dark') document.body.classList.add('dark');
  if (embedded) document.body.classList.add('embed');
  updateAccountUi();
  updateMissionUi();
  persist(false);
  window.IdrokPhetDebug = Object.freeze({
    validate,
    snapshot: () => ({lesson: lab.id, kind: config.kind, simulation: config.simulation, scene: config.scene || null, url: phetUrl, checks: [...state.checks], loaded: state.loaded, completed: state.completedNow}),
  });
})();

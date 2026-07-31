(() => {
  'use strict';

  const course = window.PHYSICS_COURSE;
  if (!course || !Array.isArray(course.lessons) || !course.lessons.length) {
    document.body.innerHTML = '<main class="fatal-error"><h1>Kurs ma’lumoti yuklanmadi</h1><p>Sahifani qayta ochib ko‘ring.</p></main>';
    return;
  }

  const cfg = window.PHYSICS_CONFIG || {};
  const storageKey = cfg.storageKey || 'idrokPhysics';
  const courseName = cfg.courseName || '9-sinf fizika';
  const labPage = cfg.labPage || 'lab.html';
  const courseCode = cfg.courseCode || '9';
  const profileStateField = cfg.profileStateField || 'physicsState';
  const profileProgressField = cfg.profileProgressField || 'physicsProgress';
  const certificateStorageKey = cfg.certificateStorageKey || 'idrokCertificate';
  const certificateGrade = cfg.certificateGrade || '9';
  const aiHistoryKey = cfg.aiHistoryKey || 'idrokAiHistory';
  const labUrl = (lessonId, embedded = false) => {
    const params = new URLSearchParams({course: courseCode, lesson: lessonId});
    if (embedded) params.set('embed', '1');
    return `${labPage}?${params.toString()}`;
  };

  const chapters = course.chapters;
  const lessons = course.lessons;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const readJSON = (key, fallback) => {
    try { return {...fallback, ...JSON.parse(localStorage.getItem(key) || '{}')}; }
    catch { return {...fallback}; }
  };
  async function postAccountEvent(path, body) {
    const token = localStorage.getItem('idrokAuthToken');
    if (!token) return {email:{status:'not_signed_in'}};
    const response = await fetch(path, {method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify(body)});
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Server bilan aloqa xatosi.');
    return payload;
  }

  async function reportLessonCompletion(lesson, score) {
    try {
      const result = await postAccountEvent('/api/lesson-complete', {course:courseName,lessonId:lesson.id,title:lesson.title,score,completedCount:physicsState.completed.length});
      if (result.notification) {
        const notifications = readJSON('idrokNotifications', {items:[]});
        notifications.items = [result.notification, ...(notifications.items || [])].slice(0, 50);
        localStorage.setItem('idrokNotifications', JSON.stringify(notifications));
      }
      if (result.email?.status === 'not_configured') toast('Mavzu yakunlandi. Email xizmati hali ulanmagan.');
      if (physicsState.completed.length === lessons.length) {
        await postAccountEvent('/api/progress', {impulse:globalState.impulse,score:globalState.score,completed:globalState.completed,theme:globalState.theme,[profileStateField]:physicsState});
        const certificate = await postAccountEvent('/api/course-complete', {course:courseName});
        localStorage.setItem(certificateStorageKey, JSON.stringify(certificate));
      }
    } catch (error) { console.warn('Yakunlash xabari yuborilmadi:', error.message); }
  }

  const globalState = readJSON('idrokState', {completed: [], score: 0, impulse: 0, theme: 'light'});
  globalState.completed = Array.isArray(globalState.completed) ? globalState.completed : [];
  globalState.score = Number(globalState.score) || 0;
  globalState.impulse = Number(globalState.impulse) || 0;

  const storedPhysics = readJSON(storageKey, {});
  const physicsState = Array.isArray(storedPhysics.completed) ? {...storedPhysics, version: course.version} : {
    version: course.version, completed: [], scores: {}, current: 'l1', stages: {}, startedAt: Date.now()
  };
  physicsState.completed = Array.isArray(physicsState.completed) ? physicsState.completed.filter(id => lessons.some(l => l.id === id)) : [];
  physicsState.scores = physicsState.scores && typeof physicsState.scores === 'object' ? physicsState.scores : {};
  physicsState.stages = physicsState.stages && typeof physicsState.stages === 'object' ? physicsState.stages : {};
  physicsState.version = course.version;

  const STAGES = [
    ['nazariya', 'Nazariya', 'Matn, formula va chizma'],
    ['video', 'Videodars', 'O‘zbekcha tushuntirish'],
    ['misol', 'Masala', 'Formula va hisoblash'],
    ['tajriba', 'Tajriba', 'Kuzatuv va video'],
    ['simulyatsiya', 'Simulyatsiya', 'Interaktiv model'],
    ['quiz', 'Yakuniy quiz', 'Kamida 8/10'],
  ];

  let selectedChapter = 0;
  let currentLesson = null;
  let sectionObserver = null;
  let stageScrollHandler = null;
  let simFrame = null;
  let simParticles = [];

  function icon(name, size = 24) {
    const paths = {
      atom: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)"/>',
      heat: '<path d="M8 21c-2-3 1-5 1-7 0-2-2-3-1-7 3 2 4 4 4 6 1-4 4-5 4-9 4 4 4 8 2 11-1 2 1 3-2 6-2 2-6 2-8 0Z"/>',
      engine: '<path d="M4 9h12l3 3v7H7l-3-3V9Z"/><path d="M8 9V6h6v3M19 13h2v4h-2M8 19v2m7-2v2"/>',
      drop: '<path d="M12 3C9 8 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7-6-12Z"/><path d="M9 16c.5 1.4 1.4 2 3 2"/>',
      prism: '<path d="m12 3 9 17H3L12 3Z"/><path d="M2 12h7m6 0 8-4m-8 6 8 1m-8 1 7 5"/>',
      cosmos: '<circle cx="12" cy="12" r="3"/><path d="M3 12c2-5 6-8 11-8 4 0 7 2 7 5 0 5-7 10-13 10-3 0-5-1-5-3 0-3 5-6 11-6 4 0 7 1 8 3"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
      play: '<path d="m9 7 8 5-8 5V7Z"/>',
      book: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Zm16 0A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/>',
    };
    return `<svg class="ui-icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.atom}</svg>`;
  }

  function chapterLessons(index) { return lessons.filter(lesson => lesson.chapter === index); }
  function lessonIndex(id) { return lessons.findIndex(lesson => lesson.id === id); }
  function isUnlocked(index) { return index === 0 || physicsState.completed.includes(lessons[index - 1].id); }
  function stageState(id) {
    return physicsState.stages[id] || (physicsState.stages[id] = {
      nazariya: false, video: false, misol: false, tajriba: false, simulyatsiya: false, quiz: false
    });
  }
  function lessonHasSimulation(lessonOrId) {
    const lesson = typeof lessonOrId === 'string' ? lessons.find(item => item.id === lessonOrId) : lessonOrId;
    if (!lesson) return false;
    const phet = window[`IDROK_PHET${courseCode}`] || window.IDROK_PHET;
    return Boolean(phet?.lessons?.[lesson.id]);
  }
  function stagesFor(lessonOrId) {
    return lessonHasSimulation(lessonOrId) ? STAGES : STAGES.filter(([id]) => id !== 'simulyatsiya');
  }
  function stageCount(id) {
    const state = stageState(id);
    return stagesFor(id).filter(([stage]) => Boolean(state[stage])).length;
  }
  function stageTotal(id) { return stagesFor(id).length; }

  function syncUser() {
    const email = localStorage.getItem('idrokCurrentUser');
    if (!email) return;
    let users;
    try { users = JSON.parse(localStorage.getItem('idrokUsers') || '[]'); } catch { users = []; }
    const user = users.find(item => item.email === email);
    if (!user) return;
    user.impulse = globalState.impulse;
    user.score = globalState.score;
    user.completed = [...globalState.completed];
    user.theme = globalState.theme;
    user[profileStateField] = JSON.parse(JSON.stringify(physicsState));
    user[profileProgressField] = {
      completed: physicsState.completed.length,
      total: lessons.length,
      percent: Math.round(physicsState.completed.length / lessons.length * 100),
      scores: {...physicsState.scores},
    };
    localStorage.setItem('idrokUsers', JSON.stringify(users));
    const token = localStorage.getItem('idrokAuthToken');
    if (token) fetch('/api/progress', {method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify({impulse:user.impulse,score:user.score,completed:user.completed,theme:user.theme,[profileStateField]:user[profileStateField]})}).catch(() => {});
  }

  function save() {
    physicsState.lastActivity = Date.now();
    localStorage.setItem(storageKey, JSON.stringify(physicsState));
    localStorage.setItem('idrokState', JSON.stringify(globalState));
    syncUser();
    updateStats();
  }

  function toast(message) {
    const node = $('#courseToast');
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 2600);
  }

  function renderCourse() {
    $('#moduleNav').innerHTML = chapters.map((chapter, index) => {
      const items = chapterLessons(index);
      const done = items.filter(item => physicsState.completed.includes(item.id)).length;
      const percent = Math.round(done / items.length * 100);
      return `<button data-chapter="${index}" class="${selectedChapter === index ? 'active' : ''}">
        <span class="chapter-icon" style="--chapter:${chapter.accent}">${icon(chapter.icon, 20)}</span>
        <div><b>${esc(chapter.title)}</b><small>${done}/${items.length} dars • ${percent}%</small></div>
        <i>${done === items.length ? icon('check', 17) : '›'}</i>
      </button>`;
    }).join('');

    $('#moduleCards').innerHTML = chapters.map((chapter, index) => {
      const items = chapterLessons(index);
      const done = items.filter(item => physicsState.completed.includes(item.id)).length;
      return `<button data-chapter="${index}" class="module-card ${selectedChapter === index ? 'active' : ''}" style="--chapter:${chapter.accent}">
        <span class="card-top"><i>${String(index + 1).padStart(2, '0')}</i>${icon(chapter.icon, 24)}</span>
        <b>${esc(chapter.title)}</b>
        <small>${items.length} dars • ${done} yakunlangan</small>
        <span class="card-progress"><i style="width:${done / items.length * 100}%"></i></span>
      </button>`;
    }).join('');

    const chapter = chapters[selectedChapter];
    const items = chapterLessons(selectedChapter);
    $('#moduleNumber').textContent = String(selectedChapter + 1).padStart(2, '0');
    $('#moduleMeta').textContent = `${selectedChapter + 1}-BOB • ${items.length} DARS`;
    $('#moduleTitle').textContent = chapter.title;
    $('#moduleReward').textContent = `${items.reduce((sum, item) => sum + item.reward, 0).toLocaleString('uz-UZ')} ϟ`;
    $('.topic-panel').style.setProperty('--chapter', chapter.accent);
    $('#topicList').innerHTML = items.map(lesson => {
      const index = lessonIndex(lesson.id);
      const unlocked = isUnlocked(index);
      const done = physicsState.completed.includes(lesson.id);
      const best = physicsState.scores[lesson.id];
      return `<div class="topic-item ${unlocked ? '' : 'locked'} ${done ? 'done' : ''}">
        <span class="topic-index">${done ? icon('check', 19) : String(index + 1).padStart(2, '0')}</span>
        <div class="topic-copy"><b>${esc(lesson.title)}</b><small>To‘liq nazariya • ${stageTotal(lesson)} bosqich ${best != null ? `• Eng yaxshi: ${best}/10` : ''}</small></div>
        <span class="topic-reward">+${lesson.reward} ϟ</span>
        <button data-lesson="${lesson.id}" ${unlocked ? '' : 'disabled'}>${done ? 'Qayta ko‘rish' : unlocked ? 'Boshlash' : icon('lock', 16)}</button>
      </div>`;
    }).join('');

    $$('[data-chapter]').forEach(button => button.addEventListener('click', () => {
      selectedChapter = Number(button.dataset.chapter);
      renderCourse();
      if (button.closest('.module-cards')) $('.topic-panel').scrollIntoView({behavior: 'smooth', block: 'start'});
    }));
    $$('[data-lesson]').forEach(button => button.addEventListener('click', () => openLesson(button.dataset.lesson)));
    updateStats();
  }

  function lessonNav(lesson) {
    const stages = stageState(lesson.id);
    const count = stageCount(lesson.id);
    const availableStages = stagesFor(lesson);
    const total = availableStages.length;
    return `<div class="lesson-nav-title"><small>DARS BOSQICHLARI</small><b>${lesson.number}-dars</b></div>
      ${availableStages.map(([id, title, subtitle], index) => `<a class="${index === 0 ? 'active' : ''} ${stages[id] ? 'complete' : ''}" href="#${id}" data-tab="${id}">
        <i>${stages[id] ? icon('check', 16) : String(index + 1).padStart(2, '0')}</i>
        <span><b>${title}</b><small>${subtitle}</small></span><em>›</em>
      </a>`).join('')}
      <div class="lesson-nav-progress"><span><i id="sectionProgress" style="width:${count / total * 100}%"></i></span><small>Dars progressi</small><b id="sectionPercent">${Math.round(count / total * 100)}%</b></div>`;
  }

  function section(number, id, kicker, title, body) {
    return `<section class="lesson-section" id="${id}">
      <div class="section-index">${String(number).padStart(2, '0')}</div>
      <div class="content-main"><span class="section-kicker">${kicker}</span><h2>${esc(title)}</h2>${body}</div>
    </section>`;
  }

  function buildProblem(lesson) {
    if (lesson.problem) return lesson.problem;
    const type = lesson.simulation;
    const sets = {
      particles: {title: 'Zarralar harakatini hisoblash', given: '120 ta zarra 3 ta teng hajmga taqsimlandi.', steps: ['N = 120', 'qism = 3', 'N₁ = N / 3 = 40'], answer: 40, unit: 'ta', prompt: '180 ta zarra 6 ta teng hajmga taqsimlansa, har birida nechta zarra bo‘ladi?', practice: 30},
      scale: {title: 'Molekula qatlamini baholash', given: 'Tomchi hajmi 12 shartli birlik, qatlam yuzi 4 birlik.', steps: ['d = V / S', 'd = 12 / 4', 'd = 3'], answer: 3, unit: 'birlik', prompt: 'V = 20 va S = 5 bo‘lsa, d ni toping.', practice: 4},
      measure: {title: 'Nisbat orqali yechish', given: 'Bir kattalik 20, ikkinchisi 5 birlik.', steps: ['x = a / b', 'x = 20 / 5', 'x = 4'], answer: 4, unit: 'marta', prompt: 'a = 36 va b = 6 bo‘lsa, a/b nisbatini toping.', practice: 6},
      piston: {title: 'Gaz holatini topish', given: 'p₁ = 100 kPa, V₁ = 4 l, V₂ = 2 l, T = const.', steps: ['p₁V₁ = p₂V₂', 'p₂ = p₁V₁ / V₂', 'p₂ = 100·4/2 = 200 kPa'], answer: 200, unit: 'kPa', prompt: 'p₁ = 120 kPa, V₁ = 3 l va V₂ = 2 l bo‘lsa, p₂ ni toping.', practice: 180},
      thermometer: {title: 'Selsiydan Kelvinga o‘tish', given: 't = 27 °C.', steps: ['T = t + 273', 'T = 27 + 273', 'T = 300 K'], answer: 300, unit: 'K', prompt: 't = 47 °C bo‘lsa, Kelvin temperaturasini toping.', practice: 320},
      thermal: {title: 'Energiya balansini topish', given: 'Gazga Q = 500 J issiqlik berildi, gaz A = 120 J ish bajardi.', steps: ['ΔU = Q − A', 'ΔU = 500 − 120', 'ΔU = 380 J'], answer: 380, unit: 'J', prompt: 'Q = 700 J va A = 250 J bo‘lsa, ΔU ni toping.', practice: 450},
      calorimeter: {title: 'Isitish uchun energiya', given: 'm = 0.5 kg suv, c = 4200 J/(kg·K), ΔT = 10 K.', steps: ['Q = cmΔT', 'Q = 4200·0.5·10', 'Q = 21 000 J'], answer: 21000, unit: 'J', prompt: 'm = 0.2 kg suv 5 K ga isitildi. c = 4200 bo‘lsa, Q ni toping.', practice: 4200},
      combustion: {title: 'Yoqilg‘i energiyasi', given: 'q = 30 MJ/kg, m = 2 kg.', steps: ['Q = qm', 'Q = 30·2', 'Q = 60 MJ'], answer: 60, unit: 'MJ', prompt: 'q = 40 MJ/kg va m = 3 kg bo‘lsa, Q ni toping.', practice: 120},
      entropy: {title: 'Dvigatelning energiya ulushi', given: 'Q₁ = 500 J, Q₂ = 200 J.', steps: ['η = (Q₁−Q₂)/Q₁·100%', 'η = 300/500·100%', 'η = 60%'], answer: 60, unit: '%', prompt: 'Q₁ = 800 J va Q₂ = 200 J bo‘lsa, FIKni toping.', practice: 75},
      engine: {title: 'Issiqlik mashinasi FIKi', given: 'Dvigatel 1000 J issiqlikdan 300 J foydali ish oldi.', steps: ['η = A/Q₁·100%', 'η = 300/1000·100%', 'η = 30%'], answer: 30, unit: '%', prompt: 'A = 450 J va Q₁ = 1500 J bo‘lsa, FIKni toping.', practice: 30},
      surface: {title: 'Sirt taranglik kuchi', given: 'σ = 0.072 N/m, l = 0.2 m.', steps: ['F = σl', 'F = 0.072·0.2', 'F = 0.0144 N'], answer: 0.0144, unit: 'N', prompt: 'σ = 0.05 N/m va l = 0.4 m bo‘lsa, F ni toping.', practice: 0.02},
      capillary: {title: 'Kapillyar balandlik nisbati', given: 'Nay radiusi 2 marta kichraytirildi.', steps: ['h ∼ 1/r', 'r 2 marta kamaydi', 'h 2 marta ortadi'], answer: 2, unit: 'marta', prompt: 'Radius 4 marta kichraysa, ko‘tarilish balandligi necha marta ortadi?', practice: 4},
      fluid: {title: 'Suyuqlik bosimi', given: 'ρ = 1000 kg/m³, g = 10 m/s², h = 0.5 m.', steps: ['p = ρgh', 'p = 1000·10·0.5', 'p = 5000 Pa'], answer: 5000, unit: 'Pa', prompt: 'ρ = 1000, g = 10 va h = 0.8 m bo‘lsa, p ni toping.', practice: 8000},
      lattice: {title: 'Qattiq jism zichligi', given: 'm = 2 kg, V = 0.001 m³.', steps: ['ρ = m/V', 'ρ = 2/0.001', 'ρ = 2000 kg/m³'], answer: 2000, unit: 'kg/m³', prompt: 'm = 3 kg va V = 0.0015 m³ bo‘lsa, ρ ni toping.', practice: 2000},
      spring: {title: 'Elastiklik kuchi', given: 'k = 200 N/m, Δl = 0.03 m.', steps: ['F = kΔl', 'F = 200·0.03', 'F = 6 N'], answer: 6, unit: 'N', prompt: 'k = 150 N/m va Δl = 0.04 m bo‘lsa, F ni toping.', practice: 6},
      phase: {title: 'Erish uchun issiqlik', given: 'λ = 334 kJ/kg, m = 0.5 kg.', steps: ['Q = λm', 'Q = 334·0.5', 'Q = 167 kJ'], answer: 167, unit: 'kJ', prompt: 'λ = 200 kJ/kg va m = 0.4 kg bo‘lsa, Q ni toping.', practice: 80},
      humidity: {title: 'Nisbiy namlik', given: 'Bug‘ bosimi 1.2 kPa, to‘yingan bug‘ bosimi 2 kPa.', steps: ['φ = p/pₛ·100%', 'φ = 1.2/2·100%', 'φ = 60%'], answer: 60, unit: '%', prompt: 'p = 1.5 kPa va pₛ = 2.5 kPa bo‘lsa, φ ni toping.', practice: 60},
      lightSpeed: {title: 'Yorug‘lik bosib o‘tgan masofa', given: 'c = 300 000 km/s, t = 2 s.', steps: ['s = ct', 's = 300 000·2', 's = 600 000 km'], answer: 600000, unit: 'km', prompt: 'Yorug‘lik 3 sekundda necha kilometr yo‘l bosadi?', practice: 900000},
      rays: {title: 'Qaytish burchagi', given: 'Tushish burchagi α = 35°.', steps: ['Qaytish qonuni: α = β', 'β = 35°'], answer: 35, unit: '°', prompt: 'Tushish burchagi 48° bo‘lsa, qaytish burchagini toping.', practice: 48},
      refraction: {title: 'Sindirish ko‘rsatkichi', given: 'sinα = 0.6, sinγ = 0.4.', steps: ['n = sinα/sinγ', 'n = 0.6/0.4', 'n = 1.5'], answer: 1.5, unit: '', prompt: 'sinα = 0.8 va sinγ = 0.5 bo‘lsa, n ni toping.', practice: 1.6},
      lens: {title: 'Linzaning optik kuchi', given: 'F = 0.5 m.', steps: ['D = 1/F', 'D = 1/0.5', 'D = 2 dptr'], answer: 2, unit: 'dptr', prompt: 'F = 0.25 m bo‘lsa, optik kuchni toping.', practice: 4},
      optics: {title: 'Optik asbob kattalashtirishi', given: 'Obyektiv K₁ = 10, okulyar K₂ = 4.', steps: ['K = K₁K₂', 'K = 10·4', 'K = 40'], answer: 40, unit: 'marta', prompt: 'K₁ = 8 va K₂ = 5 bo‘lsa, umumiy K ni toping.', practice: 40},
      eye: {title: 'Ko‘zoynak linzasi', given: 'F = 0.5 m.', steps: ['D = 1/F', 'D = 1/0.5', 'D = 2 dptr'], answer: 2, unit: 'dptr', prompt: 'F = −0.25 m bo‘lgan linzaning optik kuchini toping.', practice: -4},
      solar: {title: 'Quyosh qurilmasi FIKi', given: 'Panel 1000 J energiyadan 250 J elektr energiya oldi.', steps: ['η = Efoydali/Equyosh·100%', 'η = 250/1000·100%', 'η = 25%'], answer: 25, unit: '%', prompt: '800 J energiyadan 160 J foydali energiya olinsa, FIKni toping.', practice: 20},
      cosmos: {title: 'Fundamental o‘zaro ta’sirlar', given: 'Gravitatsion, elektromagnit, kuchli va kuchsiz ta’sirlar sanaladi.', steps: ['Har bir tur alohida sanaladi', 'Jami 4 ta'], answer: 4, unit: 'ta', prompt: 'Olamning standart fizik manzarasida nechta fundamental o‘zaro ta’sir bor?', practice: 4},
      innovation: {title: 'Texnik qurilma quvvati', given: 'A = 1200 J ish t = 4 s da bajarildi.', steps: ['P = A/t', 'P = 1200/4', 'P = 300 W'], answer: 300, unit: 'W', prompt: 'A = 2000 J va t = 5 s bo‘lsa, quvvatni toping.', practice: 400},
    };
    return sets[type] || sets.measure;
  }

  function lessonHTML(lesson) {
    const problem = buildProblem(lesson);
    const labHref = labUrl(lesson.id);
    const embeddedLabHref = labUrl(lesson.id, true);
    const hasSimulation = lessonHasSimulation(lesson);
    const theoryBlocks = Array.isArray(lesson.theoryBlocks) ? lesson.theoryBlocks : [];
    const figureAt = Math.min(2, theoryBlocks.length);
    const figure = lesson.figure ? `<figure class="lesson-figure">
      <div><img src="${esc(lesson.figure)}" alt="${esc(lesson.title)} mavzusiga oid chizma" loading="lazy"></div>
      <figcaption>${icon(chapters[lesson.chapter].icon, 18)} Mavzuga oid chizma</figcaption>
    </figure>` : '';
    let lastTheoryPage = null;
    const theoryArticle = theoryBlocks.map((block, index) => {
      const page = Number(block.page);
      const pageMarker = Number.isFinite(page) && page !== lastTheoryPage
        ? `<div class="theory-page-label"><span>${page}-sahifa</span></div>`
        : '';
      if (Number.isFinite(page)) lastTheoryPage = page;
      const content = block.type === 'heading'
        ? `<h3 class="theory-heading">${esc(block.text)}</h3>`
        : `<p>${esc(block.text)}</p>`;
      return `${pageMarker}${index === figureAt ? figure : ''}${content}`;
    }).join('') + (figureAt === theoryBlocks.length ? figure : '');

    const hasPrimaryVideo = Boolean(lesson.video?.embed && lesson.video?.verified !== false);
    const videoEmbed = hasPrimaryVideo ? esc(lesson.video.embed) : '';
    const videoTitle = hasPrimaryVideo ? lesson.video.title : 'Mavzuga mos video tekshirilmoqda';
    const primaryMedia = !hasPrimaryVideo
      ? `<div class="media-unavailable">${icon('video', 28)}<div><b>Tasodifiy video qo‘yilmadi</b><p>Bu mavzu uchun aniq mos o‘zbekcha video topilmagani sababli noto‘g‘ri material yashirildi. Nazariya, masala, tajriba va quiz to‘liq ishlaydi.</p></div></div>`
      : lesson.video.type === 'mp4'
        ? `<div class="video-frame direct-video"><video controls preload="metadata" playsinline><source src="${videoEmbed}" type="video/mp4">Brauzeringiz videoni ochmadi.</video></div>`
        : `<div class="video-frame ${lesson.video.type === 'telegram' ? 'telegram-frame' : ''}"><iframe src="${videoEmbed}" title="${esc(lesson.video.title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;

    const hasExperimentVideo = Boolean(lesson.experimentVideo?.embed && lesson.experimentVideo?.verified === true);
    const experimentEmbed = hasExperimentVideo ? esc(lesson.experimentVideo.embed) : '';
    const isTelegram = experimentEmbed.includes('t.me/');
    const experimentMedia = hasExperimentVideo
      ? `<div class="video-frame experiment-video ${isTelegram ? 'telegram-frame' : ''}"><iframe src="${experimentEmbed}" title="${esc(lesson.experimentVideo.title)}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`
      : `<div class="media-unavailable compact">${icon('experiment', 27)}<div><b>Mustaqil amaliy tajriba</b><p>Kuzatuv vazifasini bajaring va hodisaning sababini o‘z so‘zlaringiz bilan izohlang.</p></div></div>`;

    const simulationSection = hasSimulation ? section(5, 'simulyatsiya', 'INTERAKTIV SIMULYATSIYA', 'Hodisani o‘zingiz boshqaring', `
      <p class="lead">Mavzuga xos o‘zbekcha interaktiv simulyatsiyani boshqaring, uchta amaliy qadamni bajaring va progress oling.</p>
      <div class="embedded-lab-shell">
        <iframe class="embedded-lab" src="${embeddedLabHref.replace('&', '&amp;')}" title="${esc(lesson.title)} interaktiv laboratoriyasi" loading="lazy"></iframe>
      </div>
      <a class="full-lab-launch" href="${labHref}"><span>${icon(chapters[lesson.chapter].icon, 24)}</span><div><small>TO‘LIQ EKRAN REJIMI</small><b>Laboratoriyani katta sahnada ochish</b></div><i>→</i></a>
    `) : '';
    const quizNumber = hasSimulation ? 6 : 5;

    return section(1, 'nazariya', 'TO‘LIQ NAZARIYA', lesson.title, `
      <div class="theory-summary"><span>${icon(chapters[lesson.chapter].icon, 24)}</span><p>${esc(lesson.summary)}</p></div>
      <div class="concept-grid">
        <article><span>01</span><small>ASOSIY FORMULA</small><strong>${esc(lesson.formula)}</strong><p>Birlik: ${esc(lesson.unit)}</p></article>
        <article><span>02</span><small>BOG‘LANISH</small><p>${esc(lesson.relationship)}</p></article>
        <article><span>03</span><small>HAYOTDA</small><p>${esc(lesson.application)}</p></article>
      </div>
      <div class="theory-reader">
        <div class="theory-reader-head"><span>${icon('book', 23)}</span><div><b>Mavzuning to‘liq bayoni</b><small>Ta’riflar, qoidalar, misollar va topshiriqlar</small></div></div>
        <div class="theory-article">${theoryArticle || `<p>${esc(lesson.summary)}</p>`}</div>
      </div>
      <button class="stage-complete" data-complete-stage="nazariya">${stageState(lesson.id).nazariya ? `${icon('check', 18)} Nazariya o‘qildi` : 'Nazariyani o‘qidim'} </button>
    `) +
    section(2, 'video', 'O‘ZBEKCHA VIDEODARS', videoTitle, `
      <p class="lead">${hasPrimaryVideo ? 'Videoni shu sahifaning o‘zida tomosha qiling va asosiy fikrlarni nazariya bilan bog‘lang.' : `Mavzuni nazariya, yechilgan masala va ${hasSimulation ? 'interaktiv laboratoriya' : 'amaliy kuzatuv'} orqali davom ettiring.`}</p>
      ${primaryMedia}
      ${hasPrimaryVideo ? `<div class="media-note"><span>${icon('play', 22)}</span><p><b>${esc(lesson.video.title)}</b><small>${esc(lesson.video.provider)} ${lesson.video.duration ? `• ${esc(lesson.video.duration)}` : ''}</small></p></div>` : ''}
      <button class="stage-complete" data-complete-stage="video">${stageState(lesson.id).video ? `${icon('check', 18)} Video bosqichi yakunlandi` : (hasPrimaryVideo ? 'Videoni ko‘rdim' : 'Nazariya bilan davom etdim')}</button>
    `) +
    section(3, 'misol', 'FORMULA VA MASALA', problem.title, `
      <div class="formula-card"><small>MAVZUNING ASOSIY MUNOSABATI</small><strong>${esc(lesson.formula)}</strong><p>${esc(lesson.relationship)}</p></div>
      <div class="problem-card"><span>YECHILGAN NAMUNA</span><h3>${esc(problem.given)}</h3><div class="solution-steps">${problem.steps.map((step, i) => `<div><i>${i + 1}</i><p>${esc(step)}</p></div>`).join('')}</div><div class="answer">Javob: <b>${problem.answer.toLocaleString('uz-UZ')} ${esc(problem.unit)}</b></div></div>
      <div class="practice"><span>MUSTAQIL ISHLANG</span><h3>${esc(problem.prompt)}</h3><div class="practice-row"><input id="practiceAnswer" type="number" step="any" inputmode="decimal" placeholder="Javobni kiriting"><button id="checkPractice">Tekshirish</button></div><p id="practiceResult" class="practice-result"></p></div>
    `) +
    section(4, 'tajriba', 'QIZIQARLI TAJRIBA', 'Kuzating va sababini toping', `
      <div class="experiment-card compact"><div class="experiment-symbol">${icon(chapters[lesson.chapter].icon, 38)}</div><div><span>KUZATUV VAZIFASI</span><h3>${esc(lesson.experiment)}</h3><p>${hasExperimentVideo ? 'Avval natijani taxmin qiling, keyin videodagi hodisani diqqat bilan kuzating.' : 'Avval natijani taxmin qiling, tajribani xavfsiz bajaring va kuzatuvingizni yozib oling.'}</p></div></div>
      ${experimentMedia}
      <div class="experiment-question">
        <span>FIKRLASH SAVOLI</span><h3>Nega shunday bo‘ldi?</h3><p>${esc(lesson.experimentQuestion)}</p>
        <textarea id="experimentAnswer" rows="4" placeholder="Sababini o‘z so‘zlaringiz bilan yozing…"></textarea>
        <button id="checkExperiment" type="button">Ilmiy izohni ko‘rish <i>→</i></button>
        <div class="experiment-explanation" id="experimentExplanation"><b>Ilmiy izoh</b><p>${esc(lesson.experimentExplanation)}</p></div>
      </div>
    `) +
    simulationSection +
    section(quizNumber, 'quiz', 'YAKUNIY QUIZ', 'Mavzuni o‘zlashtirganingizni isbotlang', `
      <p class="lead">Savollar birma-bir chiqadi. Javobni tanlang va “Keyingi savol”ni bosing. O‘tish bali — 8/10.</p>
      <div class="quiz-progress-wrap"><div><span id="quizAnswered">Savol 1 / 10</span><b>O‘tish bali: 8/10</b></div><span class="quiz-progress"><i id="quizProgress"></i></span></div>
      <div class="quiz-shell"><div id="quizQuestionCard"></div><div class="quiz-navigation"><button id="quizPrevious" type="button">← Oldingi</button><button id="quizNext" type="button">Keyingi savol <span>→</span></button></div></div>
      <div id="quizOutcome"></div>
    `);
  }

  function openLesson(id) {
    const lesson = lessons.find(item => item.id === id);
    const index = lessonIndex(id);
    if (!lesson || !isUnlocked(index)) { toast('Avval oldingi darsni yakunlang.'); return; }
    currentLesson = lesson;
    selectedChapter = lesson.chapter;
    physicsState.current = id;
    save();
    cancelAnimationFrame(simFrame);
    $('#courseOverview').classList.add('hidden');
    $('#lessonView').classList.remove('hidden');
    $('#headerLocation').textContent = `${lesson.number}-dars: ${lesson.title}`;
    const progress = stageCount(id);
    const totalStages = stageTotal(id);
    $('#lessonTop').innerHTML = `<button class="back-overview" id="backOverview">← Kurs xaritasi</button>
      <div class="lesson-path">${lesson.chapter + 1}-BOB <span>/</span> ${lesson.number}-DARS</div>
      <h1>${esc(lesson.title)}</h1><p>${esc(lesson.summary)}</p>
      <div class="lesson-meta"><span>◷ 35–55 daqiqa</span><span>${icon('book', 17)} To‘liq nazariya</span><span>ϟ ${lesson.reward} Impulse</span><span id="lessonStageMeta">${progress}/${totalStages} bosqich</span></div>`;
    $('#lessonTabs').innerHTML = lessonNav(lesson);
    $('#lessonContent').innerHTML = lessonHTML(lesson);
    $('#backOverview').addEventListener('click', backOverview);
    bindLesson(lesson, index);
    updateAiContext();
    history.replaceState(null, '', `${location.pathname}#${id}`);
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  function backOverview() {
    cancelAnimationFrame(simFrame);
    if (sectionObserver) sectionObserver.disconnect();
    if (stageScrollHandler) window.removeEventListener('scroll', stageScrollHandler);
    $('#lessonView').classList.add('hidden');
    $('#courseOverview').classList.remove('hidden');
    $('#headerLocation').textContent = 'Kurs xaritasi';
    history.replaceState(null, '', `${location.pathname}#kurs`);
    renderCourse();
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  function markStage(stage, bonus = 0) {
    if (!currentLesson) return;
    const stages = stageState(currentLesson.id);
    const first = !stages[stage];
    stages[stage] = true;
    if (first && bonus) globalState.impulse += bonus;
    save();
    refreshLessonProgress();
    if (first) toast(`${STAGES.find(item => item[0] === stage)?.[1] || 'Bosqich'} yakunlandi${bonus ? ` • +${bonus} Impulse` : ''}`);
  }

  function refreshLessonProgress() {
    if (!currentLesson) return;
    const stages = stageState(currentLesson.id);
    const count = stageCount(currentLesson.id);
    const total = stageTotal(currentLesson.id);
    $('#sectionProgress')?.style.setProperty('width', `${count / total * 100}%`);
    if ($('#sectionPercent')) $('#sectionPercent').textContent = `${Math.round(count / total * 100)}%`;
    if ($('#lessonStageMeta')) $('#lessonStageMeta').textContent = `${count}/${total} bosqich`;
    $$('[data-tab]').forEach(link => link.classList.toggle('complete', !!stages[link.dataset.tab]));
    $$('[data-complete-stage]').forEach(button => {
      const done = stages[button.dataset.completeStage];
      button.classList.toggle('done', done);
      if (done) button.innerHTML = `${icon('check', 18)} ${button.dataset.completeStage === 'nazariya' ? 'Nazariya o‘qildi' : button.dataset.completeStage === 'video' ? 'Video ko‘rildi' : 'Tajriba ko‘rildi'}`;
    });
  }

  function alternatives(field, correct, index, formatter = value => value) {
    const values = [];
    for (let step = 3; values.length < 3 && step < lessons.length + 3; step += 1) {
      const candidate = formatter(lessons[(index + step) % lessons.length][field]);
      if (candidate && candidate !== correct && !values.includes(candidate)) values.push(candidate);
    }
    return values;
  }

  function shuffledQuestion(question, correct, distractors, explanation, seed) {
    const options = [correct, ...distractors].slice(0, 4);
    while (options.length < 4) options.push(`Boshqa javob ${options.length}`);
    const shift = seed % 4;
    const rotated = [...options.slice(shift), ...options.slice(0, shift)];
    return {question, options: rotated, correct: rotated.indexOf(correct), explanation};
  }

  function makeQuiz(lesson, index) {
    const problem = buildProblem(lesson);
    const formulaValue = lesson.formula && lesson.formula !== '—' ? lesson.formula : lesson.relationship;
    const unitValue = lesson.unit && lesson.unit !== '—' ? lesson.unit : 'O‘lchov birligi talab qilinmaydi';
    const pair = `${formulaValue} — ${lesson.relationship}`;
    const numericCorrect = `${problem.practice.toLocaleString('uz-UZ')} ${problem.unit}`.trim();
    const numericValues = [problem.practice * 2, problem.practice / 2, problem.practice + (Math.abs(problem.practice) < 10 ? 1 : 10)]
      .map(value => `${Number(value.toFixed(4)).toLocaleString('uz-UZ')} ${problem.unit}`.trim());
    return [
      shuffledQuestion(`“${lesson.title}” mavzusining asosiy mazmuni qaysi?`, lesson.summary,
        alternatives('summary', lesson.summary, index), lesson.summary, index + 1),
      shuffledQuestion('Bu mavzudagi asosiy formula yoki munosabat qaysi?', formulaValue,
        alternatives(lesson.formula === '—' ? 'relationship' : 'formula', formulaValue, index), `Darsda asosiy munosabat sifatida ${formulaValue} ishlatiladi.`, index + 2),
      shuffledQuestion('Mavzudagi kattalik uchun o‘lchov birligi kerakmi?', unitValue,
        lesson.unit === '—' ? ['metr (m)', 'sekund (s)', 'nyuton (N)'] : alternatives('unit', lesson.unit, index), lesson.unit === '—' ? 'Bu tushuncha sifat jihatdan izohlanadi va alohida o‘lchov birligiga ega emas.' : `Ushbu darsdagi kattaliklar ${lesson.unit} birliklarida ifodalanadi.`, index + 3),
      shuffledQuestion('Qaysi fizik bog‘lanish to‘g‘ri?', lesson.relationship,
        alternatives('relationship', lesson.relationship, index), lesson.relationship, index + 4),
      shuffledQuestion('Qaysi amaliy misol aynan shu mavzuga mos?', lesson.application,
        alternatives('application', lesson.application, index), lesson.application, index + 5),
      shuffledQuestion('Mavzuni kuzatish uchun qaysi mini-tajriba mos?', lesson.experiment,
        alternatives('experiment', lesson.experiment, index), `Bu tajriba “${lesson.title}” hodisasini bevosita kuzatishga yordam beradi.`, index + 6),
      shuffledQuestion(`“${formulaValue}” munosabati qaysi darsga tegishli?`, lesson.title,
        alternatives('title', lesson.title, index), `${lesson.formula} — “${lesson.title}” darsining asosiy munosabati.`, index + 7),
      shuffledQuestion('Formula va uning fizik ma’nosi qaysi qatorda to‘g‘ri juftlangan?', pair,
        alternatives('formula', lesson.formula, index).map((formula, i) => `${formula} — ${lessons[(index + (i + 1) * 7) % lessons.length].relationship}`),
        `${lesson.formula} munosabati quyidagini ifodalaydi: ${lesson.relationship}`, index + 8),
      shuffledQuestion('Mavzu bo‘yicha qaysi yakuniy xulosa to‘g‘ri?', `${formulaValue}; ${unitValue}`,
        alternatives(lesson.formula === '—' ? 'relationship' : 'formula', formulaValue, index).map((formula, i) => `${formula}; ${lessons[(index + i + 8) % lessons.length].unit}`),
        `To‘g‘ri juftlik: ${formulaValue}; birliklar — ${unitValue}.`, index + 9),
      shuffledQuestion(problem.prompt, numericCorrect, numericValues,
        `Bu savolda ${lesson.formula} munosabati yangi sonlarga qo‘llanadi. Hisoblash natijasi ${numericCorrect} chiqadi.`, index + 10),
    ];
  }

  function bindLesson(lesson, index) {
    $$('[data-complete-stage]').forEach(button => button.addEventListener('click', () => markStage(button.dataset.completeStage)));

    const problem = buildProblem(lesson);
    $('#checkPractice').addEventListener('click', () => {
      const value = Number($('#practiceAnswer').value);
      const tolerance = Math.max(0.0001, Math.abs(problem.practice) * 0.005);
      const correct = Number.isFinite(value) && Math.abs(value - problem.practice) <= tolerance;
      const result = $('#practiceResult');
      result.className = `practice-result ${correct ? 'correct' : 'wrong'}`;
      result.textContent = correct ? `To‘g‘ri! Javob: ${problem.practice.toLocaleString('uz-UZ')} ${problem.unit}` : `Yana urinib ko‘ring. ${lesson.formula} formulasidan foydalaning.`;
      if (correct) markStage('misol');
    });

    $('#checkExperiment').addEventListener('click', () => {
      const answer = $('#experimentAnswer').value.trim();
      if (answer.length < 12) {
        toast('Avval hodisaning sababini kamida bir jumla bilan yozing.');
        $('#experimentAnswer').focus();
        return;
      }
      $('#experimentExplanation').classList.add('show');
      markStage('tajriba');
    });
    if (stageState(lesson.id).tajriba) $('#experimentExplanation').classList.add('show');

    const quiz = makeQuiz(lesson, index);
    const quizSession = {position: 0, answers: Array(quiz.length).fill(null)};
    $('#quizPrevious').addEventListener('click', () => {
      if (quizSession.position > 0) {
        quizSession.position--;
        renderQuizStep(quiz, quizSession);
      }
    });
    $('#quizNext').addEventListener('click', () => {
      if (quizSession.answers[quizSession.position] == null) {
        toast('Davom etish uchun javobni tanlang.');
        return;
      }
      if (quizSession.position < quiz.length - 1) {
        quizSession.position++;
        renderQuizStep(quiz, quizSession);
      } else {
        submitQuiz(lesson, index, quiz, quizSession);
      }
    });
    renderQuizStep(quiz, quizSession);
    bindTabs();
    if ($('#labCanvas')) {
      startLab(lesson);
      $('#resetSim')?.addEventListener('click', () => startLab(lesson, true));
    }
    refreshLessonProgress();
  }

  function renderQuizStep(quiz, session) {
    const item = quiz[session.position];
    const selected = session.answers[session.position];
    $('#quizAnswered').textContent = `Savol ${session.position + 1} / ${quiz.length}`;
    $('#quizProgress').style.width = `${(session.position + 1) / quiz.length * 100}%`;
    $('#quizQuestionCard').innerHTML = `<fieldset class="quiz-question single-question">
      <legend><span>SAVOL ${session.position + 1} / ${quiz.length}</span><strong>${esc(item.question)}</strong></legend>
      <div class="quiz-options">${item.options.map((option, optionIndex) => `<label class="${selected === optionIndex ? 'selected' : ''}"><input type="radio" name="activeQuizQuestion" value="${optionIndex}" ${selected === optionIndex ? 'checked' : ''}><i>${String.fromCharCode(65 + optionIndex)}</i><span>${esc(option)}</span></label>`).join('')}</div>
    </fieldset>`;
    $('#quizPrevious').disabled = session.position === 0;
    $('#quizNext').disabled = selected == null;
    $('#quizNext').innerHTML = session.position === quiz.length - 1 ? 'Natijani ko‘rish <span>→</span>' : 'Keyingi savol <span>→</span>';
    $$('#quizQuestionCard input').forEach(input => input.addEventListener('change', () => {
      session.answers[session.position] = Number(input.value);
      $$('#quizQuestionCard label').forEach(label => label.classList.toggle('selected', label.contains(input)));
      $('#quizNext').disabled = false;
    }));
  }

  function submitQuiz(lesson, index, quiz, session) {
    if (session.answers.some(answer => answer == null)) {
      session.position = session.answers.findIndex(answer => answer == null);
      renderQuizStep(quiz, session);
      toast('Javobsiz savol qoldi.');
      return;
    }
    let score = 0;
    const mistakes = [];
    quiz.forEach((item, questionIndex) => {
      const correct = session.answers[questionIndex] === item.correct;
      if (correct) score++;
      else mistakes.push({
        number: questionIndex + 1,
        question: item.question,
        selected: item.options[session.answers[questionIndex]],
        correct: item.options[item.correct],
        explanation: item.explanation,
      });
    });

    const pass = score >= 8;
    const firstCompletion = pass && !physicsState.completed.includes(lesson.id);
    physicsState.scores[lesson.id] = Math.max(Number(physicsState.scores[lesson.id]) || 0, score);
    if (pass) {
      stageState(lesson.id).quiz = true;
      if (firstCompletion) {
        physicsState.completed.push(lesson.id);
        globalState.impulse += lesson.reward;
        globalState.score += score;
        const globalKey = `physics${courseCode}-${lesson.id}`;
        if (!globalState.completed.includes(globalKey)) globalState.completed.push(globalKey);
        confetti();
      }
    }
    save();
    refreshLessonProgress();
    const next = lessons[index + 1];
    $('.quiz-shell').classList.add('finished');
    $('.quiz-progress-wrap').classList.add('finished');
    const review = mistakes.length ? `<div class="quiz-review"><h4>Xatolar tahlili</h4>${mistakes.map(item => `<article><span>${item.number}</span><div><b>${esc(item.question)}</b><p><del>${esc(item.selected)}</del><strong>${esc(item.correct)}</strong></p><small>${esc(item.explanation)}</small></div></article>`).join('')}</div>` : '<div class="quiz-perfect">✦ Barcha javoblar to‘g‘ri. Mukammal natija!</div>';
    $('#quizOutcome').innerHTML = `<div class="quiz-result-card ${pass ? 'pass' : 'fail'}">
      <div class="result-score"><strong>${score}</strong><span>/10</span></div>
      <div><span>${pass ? 'MAVZU YAKUNLANDI' : 'YANA BIR URINISH'}</span><h3>${pass ? 'Zo‘r! Bilimingiz tasdiqlandi.' : 'Natijani 8/10 ga olib chiqing.'}</h3><p>${pass ? (firstCompletion ? `Hisobingizga +${lesson.reward} Impulse qo‘shildi.` : 'Bu dars avval ham yakunlangan; eng yaxshi natijangiz saqlandi.') : 'Quyidagi izohlarni o‘qing va quizni qayta ishlang.'}</p></div>
      ${pass && next ? `<button class="next-lesson-button" id="nextLesson"><span>Keyingi dars</span><b>${esc(next.title)}</b><i>→</i></button>` : pass ? '<button class="next-lesson-button" id="finishCourse"><span>Kurs yakunlandi</span><b>Boshqaruv paneliga qaytish</b><i>→</i></button>' : '<button class="retry-quiz" id="retryQuiz">Qayta ishlash</button>'}
    </div>${review}`;
    if (pass && next) $('#nextLesson').addEventListener('click', () => openLesson(next.id));
    if (pass && !next) $('#finishCourse').addEventListener('click', () => { location.href = `certificate.html?grade=${encodeURIComponent(certificateGrade)}`; });
    if (!pass) $('#retryQuiz').addEventListener('click', () => {
      session.position = 0;
      session.answers.fill(null);
      $('#quizOutcome').innerHTML = '';
      $('.quiz-shell').classList.remove('finished');
      $('.quiz-progress-wrap').classList.remove('finished');
      renderQuizStep(quiz, session);
    });
    $('#quizOutcome').scrollIntoView({behavior: 'smooth', block: 'center'});
    renderCourse();
  }

  function bindTabs() {
    if (sectionObserver) sectionObserver.disconnect();
    if (stageScrollHandler) window.removeEventListener('scroll', stageScrollHandler);
    const links = $$('#lessonTabs a');
    const sections = $$('.lesson-section');
    const setActive = id => links.forEach(link => link.classList.toggle('active', link.dataset.tab === id));
    links.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      setActive(link.dataset.tab);
      document.getElementById(link.dataset.tab)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }));
    let ticking = false;
    const syncActiveStage = () => {
      ticking = false;
      if (!sections.length) return;
      const marker = Math.min(240, window.innerHeight * .34);
      let activeSection = sections[0];
      sections.forEach(sectionNode => {
        if (sectionNode.getBoundingClientRect().top <= marker) activeSection = sectionNode;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        activeSection = sections[sections.length - 1];
      }
      setActive(activeSection.id);
    };
    stageScrollHandler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncActiveStage);
    };
    window.addEventListener('scroll', stageScrollHandler, {passive: true});
    syncActiveStage();
  }

  const SIM_CONFIG = {
    particles: ['Harorat', 'Molekula massasi'], scale: ['Tomchi hajmi', 'Qatlam yuzi'], measure: ['Birinchi kattalik', 'Ikkinchi kattalik'],
    piston: ['Temperatura / ta’sir', 'Hajm'], thermometer: ['Issiqlik manbai', 'Sovitish'], thermal: ['Berilgan issiqlik', 'Bajarilgan ish'],
    calorimeter: ['Issiq jism harorati', 'Sovuq jism massasi'], combustion: ['Yoqilg‘i massasi', 'Yo‘qotish'], entropy: ['Issiqlik oqimi', 'Tartibsizlik'],
    engine: ['Isitgich energiyasi', 'Chiqindi issiqlik'], surface: ['Sirt taranglik', 'Sovun miqdori'], capillary: ['Namlanish', 'Nay radiusi'],
    fluid: ['Suyuqlik balandligi', 'Idish kengligi'], lattice: ['Temperatura', 'Kristall tartibi'], spring: ['Yuk kuchi', 'Qattiqlik'],
    phase: ['Berilgan issiqlik', 'Modda massasi'], humidity: ['Havodagi bug‘', 'Temperatura'], lightSpeed: ['Impuls chastotasi', 'Masofa'],
    rays: ['Tushish burchagi', 'Muhit zichligi'], refraction: ['Tushish burchagi', 'Sindirish ko‘rsatkichi'], lens: ['Buyum masofasi', 'Fokus masofasi'],
    optics: ['Obyektiv kuchi', 'Okulyar kuchi'], eye: ['Buyum masofasi', 'Akkomodatsiya'], solar: ['Quyosh intensivligi', 'Bulutlilik'],
    cosmos: ['Boshlang‘ich tezlik', 'Gravitatsiya'], innovation: ['Energiya', 'Yo‘qotish'],
  };

  function startLab(lesson, reset = false) {
    cancelAnimationFrame(simFrame);
    const canvas = $('#labCanvas');
    if (!canvas) return;
    const a = $('#controlA');
    const b = $('#controlB');
    if (reset) { a.value = 60; b.value = 35; }
    const labels = SIM_CONFIG[lesson.simulation] || ['Asosiy parametr', 'Qarshilik'];
    $('#controlALabel').textContent = labels[0];
    $('#controlBLabel').textContent = labels[1];
    simParticles = Array.from({length: 42}, (_, i) => ({
      x: 45 + Math.random() * 650, y: 45 + Math.random() * 330,
      vx: (Math.random() - .5) * 2, vy: (Math.random() - .5) * 2, color: i % 4
    }));
    const ctx = canvas.getContext('2d');
    let time = 0;
    const draw = () => {
      time += 0.018;
      const power = Number(a.value);
      const resistance = Number(b.value);
      const result = Math.max(0, Math.min(100, Math.round(power * .72 + (100 - resistance) * .28)));
      $('#controlAValue').textContent = `${power}%`;
      $('#controlBValue').textContent = `${resistance}%`;
      $('#energyReadout').textContent = power;
      $('#resultReadout').textContent = result;
      const achieved = result >= 75;
      $('#challengeState').textContent = achieved ? 'Bajarildi ✓' : 'Bajarilmadi';
      $('#challengeState').classList.toggle('achieved', achieved);
      if (achieved && !stageState(lesson.id).simulyatsiya) markStage('simulyatsiya', 10);
      drawScene(ctx, lesson.simulation, time, power, resistance, simParticles);
      simFrame = requestAnimationFrame(draw);
    };
    a.oninput = () => {};
    b.oninput = () => {};
    draw();
  }

  function drawScene(ctx, type, time, power, resistance, particles) {
    const w = 760, h = 430;
    const dark = document.body.classList.contains('dark');
    const bg = dark ? '#0c1328' : '#f4f5ff';
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = dark ? 'rgba(132,150,210,.09)' : 'rgba(80,70,160,.08)'; ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y <= h; y += 38) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    const ink = dark ? '#e9edff' : '#17213d';
    const violet = '#6958ee', cyan = '#20c7c1', coral = '#ff7657', yellow = '#f4bd4f';
    const speed = .35 + power / 42;

    const drawParticles = (bounds = {x: 80, y: 65, w: 600, h: 300}) => {
      particles.forEach((p, i) => {
        p.x += p.vx * speed; p.y += p.vy * speed;
        if (p.x < bounds.x || p.x > bounds.x + bounds.w) p.vx *= -1;
        if (p.y < bounds.y || p.y > bounds.y + bounds.h) p.vy *= -1;
        p.x = Math.max(bounds.x, Math.min(bounds.x + bounds.w, p.x));
        p.y = Math.max(bounds.y, Math.min(bounds.y + bounds.h, p.y));
        ctx.fillStyle = [violet, cyan, coral, yellow][p.color];
        ctx.beginPath(); ctx.arc(p.x, p.y, 4 + i % 3, 0, Math.PI * 2); ctx.fill();
      });
    };

    if (['particles', 'measure'].includes(type)) {
      ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.strokeRect(75, 58, 610, 310); drawParticles();
      ctx.fillStyle = ink; ctx.font = '700 16px Inter'; ctx.fillText('MOLEKULYAR MUHIT', 94, 91);
    } else if (type === 'scale') {
      ctx.strokeStyle = violet; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(90, 310); ctx.lineTo(670, 310); ctx.stroke();
      for (let x = 115; x < 655; x += 34) { ctx.fillStyle = [cyan, violet, coral][Math.floor(x / 34) % 3]; ctx.beginPath(); ctx.arc(x, 286 + Math.sin(x + time) * 3, 13, 0, 7); ctx.fill(); }
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(115, 345); ctx.lineTo(650, 345); ctx.moveTo(115, 335); ctx.lineTo(115, 355); ctx.moveTo(650, 335); ctx.lineTo(650, 355); ctx.stroke();
      ctx.fillStyle = ink; ctx.font = '700 18px Inter'; ctx.fillText('MOLEKULA QATLAMI', 275, 390);
    } else if (type === 'piston') {
      const pistonY = 95 + resistance * 1.9;
      ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.strokeRect(210, 65, 340, 310);
      ctx.fillStyle = violet; ctx.fillRect(195, pistonY, 370, 20); ctx.fillRect(365, 25, 30, pistonY - 25);
      drawParticles({x: 230, y: pistonY + 35, w: 300, h: 220 - resistance});
      ctx.fillStyle = coral; ctx.fillRect(220, 362, 320, 10);
      ctx.fillStyle = ink; ctx.font = '700 17px Inter'; ctx.fillText('GAZ', 360, 345);
    } else if (type === 'thermometer') {
      ctx.strokeStyle = ink; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(380, 90); ctx.lineTo(380, 315); ctx.stroke();
      ctx.fillStyle = coral; ctx.beginPath(); ctx.arc(380, 335, 38, 0, 7); ctx.fill();
      ctx.fillRect(369, 315 - power * 1.8, 22, power * 1.8 + 25);
      ctx.font = '700 15px Inter'; ctx.fillStyle = ink; for (let y = 105; y < 300; y += 38) { ctx.fillRect(420, y, 35, 2); ctx.fillText(`${Math.round((300 - y) / 2)}°`, 465, y + 5); }
    } else if (['thermal', 'calorimeter'].includes(type)) {
      const mix = power / 100;
      [['ISSIQ', 115, coral, 80 - mix * 30], ['SOVUQ', 445, cyan, 30 + mix * 35]].forEach(([label, x, color, temp]) => {
        ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.strokeRect(x, 115, 200, 220);
        ctx.fillStyle = color; ctx.globalAlpha = .75; ctx.fillRect(x + 5, 335 - temp * 2, 190, temp * 2 - 5); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.font = '800 16px Inter'; ctx.fillText(`${label} • ${Math.round(temp)}°`, x + 30, 375);
      });
      ctx.strokeStyle = yellow; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(330, 220); ctx.lineTo(430, 220); ctx.stroke();
      ctx.fillStyle = yellow; ctx.beginPath(); ctx.moveTo(430, 220); ctx.lineTo(410, 208); ctx.lineTo(410, 232); ctx.fill();
    } else if (type === 'combustion') {
      for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? coral : yellow; ctx.beginPath(); ctx.ellipse(380 + Math.sin(time * 3 + i) * 25, 280 - i * 25, 38 - i * 3, 72 - i * 5, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = ink; ctx.fillRect(260, 335, 240, 24); ctx.font = '800 18px Inter'; ctx.fillText('ENERGIYA AJRALISHI', 275, 395);
    } else if (type === 'entropy') {
      ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.strokeRect(95, 70, 570, 290);
      particles.forEach((p, i) => { p.x += p.vx * speed; p.y += p.vy * speed; if (p.x < 110 || p.x > 650) p.vx *= -1; if (p.y < 85 || p.y > 345) p.vy *= -1; ctx.fillStyle = i < 21 ? coral : cyan; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 7); ctx.fill(); });
      ctx.fillStyle = ink; ctx.font = '800 17px Inter'; ctx.fillText('TARTIBSIZLIK ORTMOQDA', 270, 397);
    } else if (type === 'engine') {
      const y = 120 + Math.sin(time * power / 18) * 45;
      ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.strokeRect(105, 70, 260, 250); ctx.fillStyle = coral; ctx.fillRect(120, y, 230, 25); ctx.fillRect(225, y, 20, 145);
      ctx.strokeStyle = violet; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(235, y + 145); ctx.lineTo(480, 250); ctx.stroke();
      ctx.strokeStyle = cyan; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(535, 250, 83, 0, 7); ctx.stroke();
      ctx.fillStyle = yellow; ctx.beginPath(); ctx.arc(535, 250, 18, 0, 7); ctx.fill();
      ctx.fillStyle = ink; ctx.font = '800 16px Inter'; ctx.fillText('ISSIQLIK → ISH', 470, 375);
    } else if (['surface', 'capillary', 'fluid'].includes(type)) {
      ctx.fillStyle = cyan; ctx.globalAlpha = .65; ctx.fillRect(80, 210, 600, 170); ctx.globalAlpha = 1;
      ctx.strokeStyle = '#67ebe5'; ctx.lineWidth = 5; ctx.beginPath(); for (let x = 80; x <= 680; x += 8) ctx.lineTo(x, 210 + Math.sin(x / 24 + time * 2) * 5); ctx.stroke();
      if (type === 'surface') { ctx.fillStyle = yellow; ctx.fillRect(300, 195, 160, 10); for (let x = 310; x < 450; x += 22) { ctx.strokeStyle = coral; ctx.beginPath(); ctx.moveTo(x, 195); ctx.lineTo(x, 165); ctx.stroke(); } }
      if (type === 'capillary') { [220, 330, 440, 540].forEach((x, i) => { const width = 18 + i * 8; const height = 145 - i * 24; ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.strokeRect(x, 55, width, 290); ctx.fillStyle = violet; ctx.fillRect(x + 4, 345 - height, width - 8, height); }); }
      if (type === 'fluid') { for (let y = 240; y < 350; y += 38) { ctx.strokeStyle = coral; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(690, y); ctx.lineTo(690 + (y - 200) / 3, y); ctx.stroke(); } }
    } else if (type === 'lattice') {
      for (let row = 0; row < 6; row++) for (let col = 0; col < 10; col++) { const x = 145 + col * 52 + Math.sin(time * power / 15 + row + col) * 5; const y = 90 + row * 50 + Math.cos(time * power / 16 + col) * 5; ctx.fillStyle = (row + col) % 2 ? violet : cyan; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fill(); if (col < 9) { ctx.strokeStyle = dark ? '#47527b' : '#c6c8e5'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 45, y); ctx.stroke(); } }
    } else if (type === 'spring') {
      ctx.strokeStyle = ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(240, 55); ctx.lineTo(520, 55); ctx.stroke();
      ctx.strokeStyle = violet; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(380, 55); for (let i = 0; i < 15; i++) ctx.lineTo(350 + (i % 2) * 60, 80 + i * (11 + power / 25)); ctx.stroke();
      const massY = 255 + power * 1.05; ctx.fillStyle = coral; ctx.fillRect(320, massY, 120, 65); ctx.fillStyle = '#fff'; ctx.font = '800 18px Inter'; ctx.fillText('m', 373, massY + 40);
    } else if (type === 'phase') {
      ctx.fillStyle = cyan; ctx.globalAlpha = .65; ctx.fillRect(120, 235, 520, 145); ctx.globalAlpha = 1;
      for (let i = 0; i < 7; i++) { ctx.fillStyle = '#a6f3f1'; ctx.fillRect(145 + i * 62, 205 + Math.sin(i) * 8, 42, 42); }
      for (let i = 0; i < 18; i++) { ctx.fillStyle = dark ? '#d7dcff' : '#52608d'; ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(150 + (i * 31) % 500, 175 - (i % 5) * 25 - Math.sin(time + i) * 8, 5, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.font = '800 17px Inter'; ctx.fillText('QATTIQ  →  SUYUQ  →  BUG‘', 240, 410);
    } else if (type === 'humidity') {
      ctx.fillStyle = dark ? '#293356' : '#d9ddf6'; ctx.beginPath(); ctx.arc(280, 165, 70, 0, 7); ctx.arc(360, 130, 85, 0, 7); ctx.arc(455, 170, 75, 0, 7); ctx.fill();
      for (let i = 0; i < 18; i++) { ctx.fillStyle = cyan; const x = 240 + (i * 29) % 280, y = 230 + ((i * 41 + time * 60) % 150); ctx.beginPath(); ctx.ellipse(x, y, 7, 13, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = ink; ctx.font = '800 20px Inter'; ctx.fillText(`NAMLIK ${Math.round(power * .72 + (100 - resistance) * .28)}%`, 305, 395);
    } else if (type === 'lightSpeed') {
      ctx.fillStyle = yellow; ctx.beginPath(); ctx.arc(125, 215, 42, 0, 7); ctx.fill(); ctx.fillStyle = cyan; ctx.beginPath(); ctx.arc(635, 215, 54, 0, 7); ctx.fill();
      ctx.strokeStyle = yellow; ctx.lineWidth = 5; ctx.setLineDash([18, 16]); ctx.lineDashOffset = -time * power * 3; ctx.beginPath(); ctx.moveTo(175, 215); ctx.lineTo(575, 215); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = ink; ctx.font = '800 17px Inter'; ctx.fillText('c = 299 792 458 m/s', 285, 285);
    } else if (['rays', 'refraction'].includes(type)) {
      const angle = (20 + power * .55) * Math.PI / 180; ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(80, 230); ctx.lineTo(680, 230); ctx.stroke(); ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(380, 45); ctx.lineTo(380, 385); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = yellow; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(380 - Math.sin(angle) * 220, 230 - Math.cos(angle) * 180); ctx.lineTo(380, 230); ctx.stroke();
      ctx.strokeStyle = coral; ctx.beginPath(); ctx.moveTo(380, 230); ctx.lineTo(380 + Math.sin(angle) * 220, 230 - Math.cos(angle) * 180); ctx.stroke();
      const refr = angle / (1 + resistance / 80); ctx.strokeStyle = cyan; ctx.beginPath(); ctx.moveTo(380, 230); ctx.lineTo(380 + Math.sin(refr) * 180, 230 + Math.cos(refr) * 150); ctx.stroke();
    } else if (['lens', 'optics', 'eye'].includes(type)) {
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(45, 230); ctx.lineTo(710, 230); ctx.stroke();
      ctx.fillStyle = cyan; ctx.globalAlpha = .5; ctx.beginPath(); ctx.ellipse(410, 230, 34, 155, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = coral; ctx.fillRect(105, 120, 12, 110); ctx.beginPath(); ctx.moveTo(90, 135); ctx.lineTo(111, 100); ctx.lineTo(132, 135); ctx.fill();
      const focusX = 560 - resistance; [[110, 120, focusX, 230], [110, 175, focusX, 230], [110, 220, focusX, 230]].forEach(line => { ctx.strokeStyle = yellow; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(line[0], line[1]); ctx.lineTo(410, line[1]); ctx.lineTo(line[2], line[3]); ctx.stroke(); });
      ctx.fillStyle = violet; ctx.fillRect(focusX, 230, 10, 80); ctx.beginPath(); ctx.moveTo(focusX - 15, 295); ctx.lineTo(focusX + 5, 325); ctx.lineTo(focusX + 25, 295); ctx.fill();
    } else if (type === 'solar') {
      ctx.fillStyle = yellow; ctx.beginPath(); ctx.arc(125, 105, 55, 0, 7); ctx.fill(); for (let i = 0; i < 7; i++) { ctx.strokeStyle = yellow; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(180 + i * 12, 130 + i * 15); ctx.lineTo(300 + i * 12, 245 + i * 6); ctx.stroke(); }
      ctx.save(); ctx.translate(450, 275); ctx.rotate(-.18); ctx.fillStyle = violet; ctx.fillRect(-145, -80, 290, 160); ctx.strokeStyle = '#c9c3ff'; for (let x = -125; x < 145; x += 48) { ctx.beginPath(); ctx.moveTo(x, -80); ctx.lineTo(x, 80); ctx.stroke(); } for (let y = -55; y < 80; y += 38) { ctx.beginPath(); ctx.moveTo(-145, y); ctx.lineTo(145, y); ctx.stroke(); } ctx.restore();
    } else if (type === 'cosmos') {
      ctx.fillStyle = yellow; ctx.beginPath(); ctx.arc(380, 215, 38, 0, 7); ctx.fill();
      for (let i = 0; i < 5; i++) { const r = 75 + i * 48, angle = time * (1.3 - i * .13) + i; ctx.strokeStyle = dark ? '#3c466d' : '#cfd1e8'; ctx.beginPath(); ctx.ellipse(380, 215, r, r * .45, -.15, 0, 7); ctx.stroke(); ctx.fillStyle = [cyan, violet, coral, '#7acb67', '#77a7ff'][i]; ctx.beginPath(); ctx.arc(380 + Math.cos(angle) * r, 215 + Math.sin(angle) * r * .45, 8 + i * 2, 0, 7); ctx.fill(); }
    } else {
      ctx.fillStyle = violet; ctx.beginPath(); ctx.arc(300, 215, 95, 0, 7); ctx.fill(); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(300, 215, 48, 0, 7); ctx.fill();
      ctx.strokeStyle = cyan; ctx.lineWidth = 24; ctx.beginPath(); ctx.arc(460, 215, 72, time, time + Math.PI * 1.45); ctx.stroke();
      ctx.fillStyle = ink; ctx.font = '800 18px Inter'; ctx.fillText('FIZIKA → TEXNOLOGIYA', 255, 385);
    }
  }

  const AI_PROMPTS = {
    explain: 'Mavzuni sodda tushuntir',
    rule: 'Asosiy qoidani ayt',
    formula: 'Formulani tushuntir',
    example: 'Misolni bosqichma-bosqich yech',
    experiment: 'Tajriba nega bunday bo‘ldi?',
    quiz: 'Quizga tayyorla',
  };
  let aiHistory = [];
  try { aiHistory = JSON.parse(localStorage.getItem(aiHistoryKey) || '[]'); } catch { aiHistory = []; }
  if (!Array.isArray(aiHistory)) aiHistory = [];

  function aiLesson() {
    return currentLesson || lessons.find(item => item.id === physicsState.current) || lessons[0];
  }

  function updateAiContext() {
    const lesson = aiLesson();
    if ($('#aiContext b')) $('#aiContext b').textContent = `${lesson.number}-dars · ${lesson.title}`;
  }

  function setAiOpen(open) {
    $('#aiPanel').classList.toggle('open', open);
    $('#aiPanel').setAttribute('aria-hidden', String(!open));
    $('#aiLauncher').setAttribute('aria-expanded', String(open));
    if (open) {
      updateAiContext();
      setTimeout(() => $('#aiInput').focus(), 120);
    }
  }

  function saveAiHistory() {
    localStorage.setItem(aiHistoryKey, JSON.stringify(aiHistory.slice(-20)));
  }

  function addAiMessage(text, role, remember = true) {
    const row = document.createElement('div');
    row.className = `ai-message ${role}`;
    if (role === 'assistant') {
      const mark = document.createElement('span');
      mark.textContent = '✦';
      row.appendChild(mark);
    }
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    row.appendChild(paragraph);
    $('#aiMessages').appendChild(row);
    $('#aiMessages').scrollTop = $('#aiMessages').scrollHeight;
    if (remember) {
      aiHistory.push({text, role});
      aiHistory = aiHistory.slice(-20);
      saveAiHistory();
    }
  }

  function aiAnswer(kind, customQuestion = '') {
    const lesson = aiLesson();
    const problem = buildProblem(lesson);
    const normalized = customQuestion.toLocaleLowerCase('uz-UZ');
    if (!kind) {
      if (/formula|tenglama|belgi|birlik/.test(normalized)) kind = 'formula';
      else if (/misol|masala|hisob|yech/.test(normalized)) kind = 'example';
      else if (/tajriba|nega|sabab|hodisa/.test(normalized)) kind = 'experiment';
      else if (/qoida|qonun|asosiy/.test(normalized)) kind = 'rule';
      else if (/quiz|test|savol|tayyor/.test(normalized)) kind = 'quiz';
      else kind = 'explain';
    }
    const answers = {
      explain: `${lesson.title} mavzusining sodda mazmuni: ${lesson.summary}\n\nMuhim bog‘lanish: ${lesson.relationship}\n\nHayotiy misol: ${lesson.application}`,
      rule: `Asosiy qoida: ${lesson.relationship}\n\nEslab qoling: ${lesson.summary}`,
      formula: `Asosiy formula: ${lesson.formula}\nBirlik: ${lesson.unit}.\n\nFizik ma’nosi: ${lesson.formulaExplanation || lesson.relationship}`,
      example: `Masala: ${problem.given}\n\n${problem.steps.map((step, i) => `${i + 1}) ${step}`).join('\n')}\n\nJavob: ${problem.answer.toLocaleString('uz-UZ')} ${problem.unit}.`,
      experiment: `${lesson.experimentExplanation}\n\nKuzatuvda aynan qaysi kattalik o‘zgarganini aniqlasangiz, sababni topish osonlashadi.`,
      quiz: `Quiz oldidan uch narsani yodda tuting:\n1) ${lesson.summary}\n2) Formula: ${lesson.formula}\n3) ${lesson.application}`,
    };
    return answers[kind] || answers.explain;
  }

  function askAi(kind, customQuestion = '') {
    const userText = customQuestion || AI_PROMPTS[kind] || 'Mavzuni tushuntir';
    addAiMessage(userText, 'user');
    $('#aiInput').value = '';
    setTimeout(() => addAiMessage(aiAnswer(kind, customQuestion), 'assistant'), 220);
  }

  aiHistory.slice(-8).forEach(message => addAiMessage(message.text, message.role, false));

  function confetti() {
    const layer = $('#confettiLayer');
    const colors = ['#6958ee', '#20c7c1', '#ff7657', '#f4bd4f', '#ec5f9e', '#5f91ff'];
    for (let i = 0; i < 100; i++) {
      const piece = document.createElement('i'); piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}%`; piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * .8}s`; piece.style.transform = `rotate(${Math.random() * 180}deg)`;
      layer.appendChild(piece);
    }
    setTimeout(() => { layer.innerHTML = ''; }, 4200);
  }

  function updateStats() {
    const done = physicsState.completed.length;
    const percent = Math.round(done / lessons.length * 100);
    if ($('#courseImpulse')) $('#courseImpulse').textContent = globalState.impulse.toLocaleString('uz-UZ');
    if ($('#sideImpulse')) $('#sideImpulse').textContent = globalState.impulse.toLocaleString('uz-UZ');
    if ($('#sideCourseProgress')) $('#sideCourseProgress').style.width = `${percent}%`;
    if ($('#sidePercent')) $('#sidePercent').textContent = `${percent}%`;
    if ($('#miniProgress')) $('#miniProgress').textContent = `${done} / ${lessons.length} dars`;
    if ($('#courseStreak')) $('#courseStreak').textContent = Math.max(1, Math.min(7, done || 1));
    if ($('#totalReward')) $('#totalReward').textContent = `${lessons.reduce((sum, item) => sum + item.reward, 0).toLocaleString('uz-UZ')} ϟ`;
    const email = localStorage.getItem('idrokCurrentUser');
    let users = []; try { users = JSON.parse(localStorage.getItem('idrokUsers') || '[]'); } catch {}
    const user = users.find(item => item.email === email);
    if (user) { $('#sideName').textContent = user.name || 'Izlanuvchi'; $('#sideAvatar').textContent = (user.name || 'IZ').slice(0, 2).toUpperCase(); }
    if ($('#continueCourse')) $('#continueCourse').innerHTML = done ? 'O‘qishni davom ettirish <span>→</span>' : 'O‘qishni boshlash <span>→</span>';
  }

  $('#continueCourse').addEventListener('click', () => {
    const next = lessons.find((lesson, index) => isUnlocked(index) && !physicsState.completed.includes(lesson.id)) || lessons[0];
    openLesson(next.id);
  });
  $('#browseCourse').addEventListener('click', () => $('#roadmap').scrollIntoView({behavior: 'smooth'}));
  const sidebar = $('#courseSidebar');
  const overlay = $('#courseOverlay');
  $('#courseMenu').addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('open'); });
  overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });
  $('#courseTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    globalState.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    save();
  });
  $('#aiLauncher').addEventListener('click', () => setAiOpen(!$('#aiPanel').classList.contains('open')));
  $('#closeAi').addEventListener('click', () => setAiOpen(false));
  $('#sideAiButton').addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    setAiOpen(true);
  });
  $$('[data-ai-prompt]').forEach(button => button.addEventListener('click', () => askAi(button.dataset.aiPrompt)));
  $('#aiForm').addEventListener('submit', event => {
    event.preventDefault();
    const question = $('#aiInput').value.trim();
    if (!question) return;
    askAi('', question);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setAiOpen(false);
  });
  window.addEventListener('message', event => {
    if (!event.data || event.data.type !== 'idrok-lab-complete') return;
    if (String(event.data.course || '9') !== String(courseCode)) return;
    if (!currentLesson || event.data.lessonId !== currentLesson.id) return;
    markStage('simulyatsiya');
  });

  $('#courseMiniIcon').innerHTML = icon('atom', 28);
  if (globalState.theme === 'dark') document.body.classList.add('dark');
  updateAiContext();
  renderCourse();
  save();
  const requestedLesson = location.hash.match(/^#l(\d+)$/)?.[0]?.slice(1);
  if (requestedLesson && isUnlocked(lessonIndex(requestedLesson))) openLesson(requestedLesson);
})();

(() => {
  'use strict';

  const course = window.PHYSICS_COURSE;
  if (!course || !Array.isArray(course.lessons) || course.lessons.length !== 14) {
    document.body.innerHTML = '<main class="fatal-error"><h1>Kurs ma’lumoti yuklanmadi</h1><p>Sahifani qayta ochib ko‘ring.</p></main>';
    return;
  }

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
      const result = await postAccountEvent('/api/lesson-complete', {lessonId:lesson.id,title:lesson.title,score,completedCount:physicsState.completed.length});
      if (result.notification) {
        const notifications = readJSON('idrokNotifications', {items:[]});
        notifications.items = [result.notification, ...(notifications.items || [])].slice(0, 50);
        localStorage.setItem('idrokNotifications', JSON.stringify(notifications));
      }
      if (result.email?.status === 'not_configured') toast('Mavzu yakunlandi. Email xizmati hali ulanmagan.');
      if (physicsState.completed.length === lessons.length) {
        const parent = readJSON('idrokPhysics', {});
        parent.grade10 = physicsState;
        await postAccountEvent('/api/progress', {impulse:globalState.impulse,score:globalState.score,completed:globalState.completed,theme:globalState.theme,physicsState:parent});
        const certificate = await postAccountEvent('/api/course-complete', {course:'10-sinf fizika'});
        localStorage.setItem('idrokCertificate10', JSON.stringify(certificate));
      }
    } catch (error) { console.warn('Yakunlash xabari yuborilmadi:', error.message); }
  }

  const globalState = readJSON('idrokState', {completed: [], score: 0, impulse: 0, theme: 'light'});
  globalState.completed = Array.isArray(globalState.completed) ? globalState.completed : [];
  globalState.score = Number(globalState.score) || 0;
  globalState.impulse = Number(globalState.impulse) || 0;

  const parentPhysics = readJSON('idrokPhysics', {});
  const physicsState = parentPhysics.grade10 || {
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
      forces: '<path d="m18 15-6-6-6 6M12 2v16"/><path d="M4 22h16"/>',
      wave: '<path d="M2 10c3-3 5-3 8 0s5 3 8 0 5-3 8 0M2 14c3-3 5-3 8 0s5 3 8 0 5-3 8 0"/>',
      drop: '<path d="M12 3C9 8 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7-6-12Z"/><path d="M9 16c.5 1.4 1.4 2 3 2"/>',
      charge: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 16.5l2-2M16.5 5.5l2-2"/>',
      circuit: '<path d="M3 12h5m8 0h5M8 9v6m4-9v12m4-9v6"/>',
      diode: '<path d="M3 12h6m6 0h6M9 6v12l6-6-6-6Z"/><path d="M15 6v12"/>',
      magnet: '<path d="M6 10v4c0 3.3 2.7 6 6 6s6-2.7 6-6v-4M6 4h4v4H6zM14 4h4v4h-4z"/>',
      atom: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)"/>',
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
  function stageCount(id) { return Object.values(stageState(id)).filter(Boolean).length; }

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
    
    const parent = readJSON('idrokPhysics', {});
    parent.grade10 = physicsState;
    user.physicsState = parent;
    
    user.physics10Progress = {
      completed: physicsState.completed.length,
      total: lessons.length,
      percent: Math.round(physicsState.completed.length / lessons.length * 100),
      scores: {...physicsState.scores},
    };
    localStorage.setItem('idrokUsers', JSON.stringify(users));
    const token = localStorage.getItem('idrokAuthToken');
    if (token) fetch('/api/progress', {method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify({impulse:user.impulse,score:user.score,completed:user.completed,theme:user.theme,physicsState:user.physicsState})}).catch(() => {});
  }

  function save() {
    physicsState.lastActivity = Date.now();
    const parent = readJSON('idrokPhysics', {});
    parent.grade10 = physicsState;
    localStorage.setItem('idrokPhysics', JSON.stringify(parent));
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
        <div class="topic-copy"><b>${esc(lesson.title)}</b><small>To‘liq nazariya • 6 bosqich ${best != null ? `• Eng yaxshi: ${best}/10` : ''}</small></div>
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
    return `<div class="lesson-nav-title"><small>DARS BOSQICHLARI</small><b>${lesson.number}-dars</b></div>
      ${STAGES.map(([id, title, subtitle], index) => `<a class="${index === 0 ? 'active' : ''} ${stages[id] ? 'complete' : ''}" href="#${id}" data-tab="${id}">
        <i>${stages[id] ? icon('check', 16) : String(index + 1).padStart(2, '0')}</i>
        <span><b>${title}</b><small>${subtitle}</small></span><em>›</em>
      </a>`).join('')}
      <div class="lesson-nav-progress"><span><i id="sectionProgress" style="width:${count / 6 * 100}%"></i></span><small>Dars progressi</small><b id="sectionPercent">${Math.round(count / 6 * 100)}%</b></div>`;
  }

  function section(number, id, kicker, title, body) {
    return `<section class="lesson-section" id="${id}">
      <div class="section-index">${String(number).padStart(2, '0')}</div>
      <div class="content-main"><span class="section-kicker">${kicker}</span><h2>${esc(title)}</h2>${body}</div>
    </section>`;
  }

  function buildProblem(lesson) {
    const sets = {
      l1: {title: 'Kuchlarni qo‘shish', given: 'F1 = 3 N va F2 = 4 N perpendikulyar kuchlar ta’sir qilmoqda.', steps: ['F = sqrt(F1² + F2²)', 'F = sqrt(3² + 4²)', 'F = 5 N'], answer: 5, unit: 'N', prompt: 'F1 = 6 N va F2 = 8 N o‘zaro tik yo‘nalgan kuchlarning natijaviysini toping.', practice: 10},
      l2: {title: 'Markazga intilma kuch', given: 'm = 2 kg massali jism v = 4 m/s tezlik bilan r = 2 m radiusli aylanma bo‘ylab harakatlanmoqda.', steps: ['F = m·v²/r', 'F = 2·4²/2', 'F = 16 N'], answer: 16, unit: 'N', prompt: 'm = 3 kg, v = 2 m/s va r = 1.5 m bo‘lganda markazga intilma kuchni toping.', practice: 8},
      l3: {title: 'Birinchi kosmik tezlik', given: 'g = 10 m/s², R = 6400 km bo‘lgan Yer sirtidagi jism uchun birinchi kosmik tezlik.', steps: ['v = sqrt(g·R)', 'v = sqrt(10·6 400 000)', 'v = 8000 m/s = 8 km/s'], answer: 8, unit: 'km/s', prompt: 'Agar g = 9.8 m/s² va sayyora radiusi R = 1000 km bo‘lsa, birinchi kosmik tezlikni m/s da hisoblang (yaxlitlab butun son deb oling).', practice: 3130},
      l4: {title: 'Dinamika masalalari', given: 'F = 20 N kuch m = 5 kg massali jismga tezlanish bermoqda.', steps: ['a = F / m', 'a = 20 / 5', 'a = 4 m/s²'], answer: 4, unit: 'm/s²', prompt: 'm = 9 kg massali jismga F = 45 N kuch ta’sir etganda jism qanday tezlanish (m/s²) oladi?', practice: 5},
      l5: {title: 'Jismning og‘irligi', given: 'm = 50 kg massali bola a = 2 m/s² tezlanish bilan yuqoriga harakatlanayotgan liftda turibdi (g = 10 m/s²).', steps: ['P = m(g + a)', 'P = 50·(10 + 2)', 'P = 600 N'], answer: 600, unit: 'N', prompt: 'Massasi m = 60 kg bo‘lgan kishi a = 3 m/s² tezlanish bilan yuqoriga tezlanuvchan harakat qilayotgan liftda bo‘lsa, uning og‘irligini hisoblang (g = 10).', practice: 780},
      l6: {title: 'Bir nechta kuch ta’siri', given: 'm = 10 kg jismga F1 = 50 N (o‘ngga) va F2 = 20 N (chapga) kuchlar ta’sir etmoqda.', steps: ['F_net = F1 − F2 = 30 N', 'a = F_net / m', 'a = 30 / 10 = 3 m/s²'], answer: 3, unit: 'm/s²', prompt: 'F1 = 80 N va F2 = 30 N qarama-qarshi kuchlar ta’sir etayotgan m = 25 kg massali jismning tezlanishini toping.', practice: 2},
      l7: {title: 'Prujinaning uzayishi', given: 'Prujinaga m = 4 kg yuk osilgan, qattiqlik k = 200 N/m, g = 10.', steps: ['F = mg = 40 N', 'F = kΔl => Δl = F/k', 'Δl = 40 / 200 = 0.2 m'], answer: 0.2, unit: 'm', prompt: 'Massasi m = 6 kg yuk osilganda, qattiqligi k = 300 N/m bo‘lgan prujina necha metrga uzayadi (g = 10)?', practice: 0.2},
      l8: {title: 'Qiya tekislikdagi harakat', given: 'Balandligi h = 3 m va uzunligi L = 5 m bo‘lgan qiya tekislikdagi jism tezlanishi (ishqalanishsiz, g = 10).', steps: ['a = g·h/L', 'a = 10·3/5', 'a = 6 m/s²'], answer: 6, unit: 'm/s²', prompt: 'Uzunligi L = 10 m, balandligi h = 4 m bo‘lgan ishqalanishsiz qiya tekislikda jism qanday tezlanish bilan sirpanib tushadi (g = 10)?', practice: 4},
      l9: {title: 'Qiya tekislik FIKi', given: 'm = 50 kg yuk h = 2 m balandlikka s = 5 m uzunlikdagi qiya tekislikda F = 300 N kuch bilan ko‘tarildi, g = 10.', steps: ['A_f = mgh = 1000 J', 'A_t = Fs = 1500 J', 'η = A_f / A_t · 100% = 66.7%'], answer: 66.7, unit: '%', prompt: 'Massasi m = 40 kg bo‘lgan yuk h = 3 m balandlikka F = 200 N tortish kuchi yordamida s = 8 m bo‘lgan qiya tekislik bo‘ylab ko‘tarildi. Qiya tekislikning FIKini foizda hisoblang (g = 10).', practice: 75},
      l10: {title: 'Statik ish hisobi', given: 'FIKi η = 80% bo‘lgan qiya tekislik yordamida A_f = 400 J foydali ish bajarildi.', steps: ['η = A_f / A_t', 'A_t = A_f / (η/100)', 'A_t = 400 / 0.8 = 500 J'], answer: 500, unit: 'J', prompt: 'Foydali ish A_f = 600 J bo‘lganda, FIKi η = 75% bo‘lgan mexanizm bajargan to‘liq ish A_t ni hisoblang.', practice: 800},
      l11: {title: 'Laboratoriya ishi', given: 'm = 0.2 kg yuk h = 0.1 m balandlikka F = 0.8 N kuch bilan s = 0.5 m qiya tekislikda ko‘tarildi, g = 10.', steps: ['A_f = mgh = 0.2·10·0.1 = 0.2 J', 'A_t = Fs = 0.8·0.5 = 0.4 J', 'η = A_f / A_t · 100% = 50%'], answer: 50, unit: '%', prompt: 'Tajribada m = 0.3 kg yuk h = 0.15 m balandlikka F = 1.0 N kuch bilan s = 0.6 m masofaga ko‘tarildi. Laboratoriyada aniqlangan FIKni foizda hisoblang (g = 10).', practice: 75},
      l12: {title: 'Kuch momenti', given: 'F = 50 N kuch d = 0.4 m bo‘lgan yelkaga ta’sir etmoqda.', steps: ['M = F·d', 'M = 50·0.4', 'M = 20 N·m'], answer: 20, unit: 'N·m', prompt: 'F = 80 N kuch d = 0.25 m yelkaga ega bo‘lsa, hosil bo‘ladigan kuch momentini toping.', practice: 20},
      l13: {title: 'Richag muvozanati', given: 'Richagning d1 = 0.2 m yelkasiga F1 = 100 N, d2 = 0.5 m yelkasiga F2 kuch ta’sir qilmoqda.', steps: ['F1·d1 = F2·d2', 'F2 = F1·d1 / d2', 'F2 = 100·0.2/0.5 = 40 N'], answer: 40, unit: 'N', prompt: 'Richag muvozanatda. d1 = 0.3 m, F1 = 200 N va d2 = 0.6 m bo‘lsa, ikkinchi yelkaga ta’sir qilayotgan F2 kuchni toping.', practice: 100},
      l14: {title: 'Statika masalalari', given: 'Dastaki muvozanatda M1 = 120 N·m moment bilan aylantiruvchi kuch bor.', steps: ['ΣM = 0 => M1 = M2', 'M2 = F·d', 'd = M1 / F'], answer: 3, unit: 'm', prompt: 'M1 = 180 N·m aylanma kuch momenti bo‘lsa, uni muvozanatlash uchun F = 60 N kuch necha metr yelkaga qo‘yilishi kerak?', practice: 3},
    };
    return sets[lesson.id] || sets.l1;
  }

  function lessonHTML(lesson) {
    const problem = buildProblem(lesson);
    const labHref = `lab10.html?lesson=${lesson.id}`;
    const embeddedLabHref = `lab10.html?lesson=${lesson.id}&embed=1`;
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
      ? `<div class="media-unavailable">${icon('video', 28)}<div><b>Mavzuga doir video topilmadi</b><p>Ushbu mavzu uchun muvofiq o‘zbekcha dars videosi mavjud emas. Nazariya, masala va simulyatsiyadan to‘liq foydalanishingiz mumkin.</p></div></div>`
      : `<div class="video-frame"><iframe src="${videoEmbed}" title="${esc(lesson.video.title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;

    const hasExperimentVideo = Boolean(lesson.experimentVideo?.embed && lesson.experimentVideo?.verified === true);
    const experimentEmbed = hasExperimentVideo ? esc(lesson.experimentVideo.embed) : '';
    const isTelegram = experimentEmbed.includes('t.me/');
    const experimentMedia = hasExperimentVideo
      ? `<div class="video-frame experiment-video ${isTelegram ? 'telegram-frame' : ''}"><iframe src="${experimentEmbed}" title="${esc(lesson.experimentVideo.title)}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`
      : `<div class="media-unavailable compact">${icon('forces', 27)}<div><b>Ushbu tajriba uchun video yuklanmagan</b><p>Quyidagi kuzatuv vazifasini mustaqil ravishda bajarib ko‘ring va sababini tushuntiring.</p></div></div>`;

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
      <p class="lead">${hasPrimaryVideo ? 'Videoni shu sahifaning o‘zida tomosha qiling va asosiy fikrlarni nazariya bilan bog‘lang.' : 'Mavzuni nazariya, yechilgan masala va interaktiv laboratoriya orqali davom ettiring.'}</p>
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
    section(5, 'simulyatsiya', 'INTERAKTIV SIMULYATSIYA', 'Hodisani o‘zingiz boshqaring', `
      <p class="lead">Mavzuga xos o‘zbekcha interaktiv simulyatsiyani boshqaring, uchta amaliy qadamni bajaring va progress oling.</p>
      <div class="embedded-lab-shell">
        <iframe class="embedded-lab" src="${embeddedLabHref.replace('&', '&amp;')}" title="${esc(lesson.title)} interaktiv laboratoriyasi" loading="lazy"></iframe>
      </div>
      <a class="full-lab-launch" href="${labHref}"><span>${icon(chapters[lesson.chapter].icon, 24)}</span><div><small>TO‘LIQ EKRAN REJIMI</small><b>Laboratoriyani katta sahnada ochish</b></div><i>→</i></a>
    `) +
    section(6, 'quiz', 'YAKUNIY QUIZ', 'Mavzuni o‘zlashtirganingizni isbotlang', `
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
    $('#lessonTop').innerHTML = `<button class="back-overview" id="backOverview">← Kurs xaritasi</button>
      <div class="lesson-path">${lesson.chapter + 1}-BOB <span>/</span> ${lesson.number}-DARS</div>
      <h1>${esc(lesson.title)}</h1><p>${esc(lesson.summary)}</p>
      <div class="lesson-meta"><span>◷ 35–55 daqiqa</span><span>${icon('book', 17)} To‘liq nazariya</span><span>ϟ ${lesson.reward} Impulse</span><span id="lessonStageMeta">${progress}/6 bosqich</span></div>`;
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
    $('#sectionProgress')?.style.setProperty('width', `${count / 6 * 100}%`);
    if ($('#sectionPercent')) $('#sectionPercent').textContent = `${Math.round(count / 6 * 100)}%`;
    if ($('#lessonStageMeta')) $('#lessonStageMeta').textContent = `${count}/6 bosqich`;
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
    const pair = `${lesson.formula} — ${lesson.relationship}`;
    const numericCorrect = `${problem.practice.toLocaleString('uz-UZ')} ${problem.unit}`.trim();
    const numericValues = [problem.practice * 2, problem.practice / 2, problem.practice + (Math.abs(problem.practice) < 10 ? 1 : 10)]
      .map(value => `${Number(value.toFixed(4)).toLocaleString('uz-UZ')} ${problem.unit}`.trim());
    return [
      shuffledQuestion(`“${lesson.title}” mavzusining asosiy mazmuni qaysi?`, lesson.summary,
        alternatives('summary', lesson.summary, index), lesson.summary, index + 1),
      shuffledQuestion('Bu mavzudagi asosiy formula yoki munosabat qaysi?', lesson.formula,
        alternatives('formula', lesson.formula, index), `Darsda asosiy munosabat sifatida ${lesson.formula} ishlatiladi.`, index + 2),
      shuffledQuestion('Mavzudagi fizik kattalik uchun mos birliklar qaysi?', lesson.unit,
        alternatives('unit', lesson.unit, index), `Ushbu darsdagi kattaliklar ${lesson.unit} birliklarida ifodalanadi.`, index + 3),
      shuffledQuestion('Qaysi fizik bog‘lanish to‘g‘ri?', lesson.relationship,
        alternatives('relationship', lesson.relationship, index), lesson.relationship, index + 4),
      shuffledQuestion('Qaysi amaliy misol aynan shu mavzuga mos?', lesson.application,
        alternatives('application', lesson.application, index), lesson.application, index + 5),
      shuffledQuestion('Mavzuni kuzatish uchun qaysi mini-tajriba mos?', lesson.experiment,
        alternatives('experiment', lesson.experiment, index), `Bu tajriba “${lesson.title}” hodisasini bevosita kuzatishga yordam beradi.`, index + 6),
      shuffledQuestion(`“${lesson.formula}” munosabati qaysi darsga tegishli?`, lesson.title,
        alternatives('title', lesson.title, index), `${lesson.formula} — “${lesson.title}” darsining asosiy munosabati.`, index + 7),
      shuffledQuestion('Formula va uning fizik ma’nosi qaysi qatorda to‘g‘ri juftlangan?', pair,
        alternatives('formula', lesson.formula, index).map((formula, i) => `${formula} — ${lessons[(index + (i + 1) * 7) % lessons.length].relationship}`),
        `${lesson.formula} munosabati quyidagini ifodalaydi: ${lesson.relationship}`, index + 8),
      shuffledQuestion('Mavzu bo‘yicha qaysi yakuniy xulosa to‘g‘ri?', `${lesson.formula}; ${lesson.unit}`,
        alternatives('formula', lesson.formula, index).map((formula, i) => `${formula}; ${lessons[(index + i + 8) % lessons.length].unit}`),
        `To‘g‘ri juftlik: ${lesson.formula}; birliklar — ${lesson.unit}.`, index + 9),
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
        const globalKey = `physics10-${lesson.id}`;
        if (!globalState.completed.includes(globalKey)) globalState.completed.push(globalKey);
        confetti();
      }
    }
    save();
    if (firstCompletion) reportLessonCompletion(lesson, score);
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
    if (pass && !next) $('#finishCourse').addEventListener('click', () => { location.href = 'certificate.html?grade=10'; });
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

  let aiHistory = [];
  try { aiHistory = JSON.parse(localStorage.getItem('idrokAiHistory10') || '[]'); } catch { aiHistory = []; }
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
    localStorage.setItem('idrokAiHistory10', JSON.stringify(aiHistory.slice(-20)));
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
      formula: `Asosiy formula: ${lesson.formula}\nBirlik: ${lesson.unit}.\n\nFizik ma’nosi: ${lesson.relationship}`,
      example: `Masala: ${problem.given}\n\n${problem.steps.map((step, i) => `${i + 1}) ${step}`).join('\n')}\n\nJavob: ${problem.answer.toLocaleString('uz-UZ')} ${problem.unit}.`,
      experiment: `${lesson.experimentExplanation || 'Kuzatuv vazifasini bajarib, natijani o‘z so‘zlaringiz bilan yozing.'}\n\nKuzatuvda aynan qaysi kattalik o‘zgarganini aniqlasangiz, sababni topish osonlashadi.`,
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

  const AI_PROMPTS = {
    explain: 'Mavzuni sodda tushuntir',
    rule: 'Asosiy qoidani ayt',
    formula: 'Formulani tushuntir',
    example: 'Misolni bosqichma-bosqich yech',
    experiment: 'Tajriba nega bunday bo‘ldi?',
    quiz: 'Quizga tayyorla',
  };

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
    if (!currentLesson || event.data.lessonId !== currentLesson.id) return;
    markStage('simulyatsiya');
  });

  $('#courseMiniIcon').innerHTML = icon('forces', 28);
  if (globalState.theme === 'dark') document.body.classList.add('dark');
  updateAiContext();
  renderCourse();
  save();
  const requestedLesson = location.hash.match(/^#l(\d+)$/)?.[0]?.slice(1);
  if (requestedLesson && isUnlocked(lessonIndex(requestedLesson))) openLesson(requestedLesson);
})();

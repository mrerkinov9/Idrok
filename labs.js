(() => {
  'use strict';

  const sources = [
    {grade: 7, course: window.PHYSICS_COURSE7, labs: window.IDROK_LABS7, phet: window.IDROK_PHET7, stateKey: 'idrokLabCourse7'},
    {grade: 8, course: window.PHYSICS_COURSE8, labs: window.IDROK_LABS8, phet: window.IDROK_PHET8, stateKey: 'idrokLabCourse8'},
    {grade: 9, course: window.PHYSICS_COURSE9, labs: window.IDROK_LABS9, phet: window.IDROK_PHET9, stateKey: 'idrokLabCourse'},
    {grade: 10, course: window.PHYSICS_COURSE10, labs: window.IDROK_LABS10, phet: window.IDROK_PHET10, stateKey: 'idrokLabCourse10'},
  ];
  if (sources.some(source => !source.course?.lessons?.length || !source.labs?.length || !source.phet)) {
    document.body.innerHTML = '<main><h1>Laboratoriyalar yuklanmadi</h1><p>Sahifani qayta ochib ko‘ring.</p></main>';
    return;
  }
  let runningOffset = 0;
  sources.forEach(source => {
    source.offset = runningOffset;
    runningOffset += source.labs.length;
  });

  const $ = selector => document.querySelector(selector);
  const readJSON = (key, fallback) => {
    try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value && typeof value === 'object' ? value : fallback; }
    catch { return fallback; }
  };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const globalState = readJSON('idrokState', {impulse: 0, theme: 'light'});
  const users = readJSON('idrokUsers', []);
  const currentEmail = localStorage.getItem('idrokCurrentUser') || '';
  const currentUser = Array.isArray(users) ? users.find(user => user.email === currentEmail) : null;
  const accents = ['#6757e8','#ff7657','#e4a82e','#11a9a1','#ec5f9e','#367dd9','#2784d8'];
  let activeFilter = 'all';
  let searchTerm = '';

  const catalog = sources.flatMap(source => {
    const lessons = new Map(source.course.lessons.map(lesson => [lesson.id, lesson]));
    const state = readJSON(source.stateKey, {completed: [], best: {}, last: 'l1'});
    return source.labs.map((lab, index) => {
      const lesson = lessons.get(lab.id);
      const config = source.phet.lessons[lab.id];
      const simulation = source.phet.simulations[config?.simulation];
      return {
        ...lab,
        grade: source.grade,
        uid: `g${source.grade}-${lab.id}`,
        lesson,
        config,
        simulation,
        phet: source.phet,
        state,
        number: source.offset + index + 1,
        chapter: lesson.chapter,
        reward: 40 + lesson.chapter * 5 + (index % 3) * 5,
      };
    });
  });

  const labHref = lab => `lab.html?course=${lab.grade}&lesson=${encodeURIComponent(lab.id)}`;

  function updateAccount() {
    const done = catalog.filter(lab => Array.isArray(lab.state.completed) && lab.state.completed.includes(lab.id)).length;
    const percent = Math.round(done / catalog.length * 100);
    const name = currentUser?.name || 'Izlanuvchi';
    $('#labsImpulse').textContent = String(Number(globalState.impulse) || 0);
    $('#labsSideImpulse').textContent = String(Number(globalState.impulse) || 0);
    $('#labsSidePercent').textContent = `${percent}%`;
    $('#labsSideMeta').textContent = `${done} / ${catalog.length} bajarildi`;
    $('#labsDone').textContent = String(done);
    $('#labsDoneMeta').textContent = `${percent}% progress`;
    $('#labsUserName').textContent = name;
    $('#labsAvatar').textContent = name.slice(0, 2).toUpperCase();
    const last = catalog.find(lab => lab.state.last === lab.id && !lab.state.completed?.includes(lab.id))
      || catalog.find(lab => !lab.state.completed?.includes(lab.id))
      || catalog[0];
    $('#resumeLab').href = labHref(last);
    $('#resumeLab').firstChild.textContent = done ? 'Tajribalarni davom ettirish ' : 'Birinchi tajribani boshlash ';
  }

  function renderFilters() {
    const filters = [{key:'all', title:'Barchasi'}];
    sources.forEach(source => source.course.chapters.forEach((chapter, index) => {
      filters.push({key:`${source.grade}-${index}`, title:`${source.grade}-sinf · ${chapter.title}`});
    }));
    $('#chapterFilters').innerHTML = filters.map(item => `<button class="${item.key === activeFilter ? 'active' : ''}" data-filter="${item.key}" type="button">${escapeHtml(item.title)}</button>`).join('');
    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderLabs();
    }));
  }

  function renderLabs() {
    const query = searchTerm.trim().toLocaleLowerCase('uz-UZ');
    const visible = catalog.filter(lab => {
      if (activeFilter !== 'all' && activeFilter !== `${lab.grade}-${lab.chapter}`) return false;
      if (!query) return true;
      return `${lab.lesson.title} ${lab.lesson.summary} ${lab.role} ${lab.simulation?.title || ''}`.toLocaleLowerCase('uz-UZ').includes(query);
    });
    $('#labsGrid').innerHTML = visible.map(lab => {
      const complete = lab.state.completed?.includes(lab.id);
      const best = Number(lab.state.best?.[lab.id]) || 0;
      const fallback = lab.lesson.figure || `assets/physics/book/page-${String(lab.lesson.pageNumbers?.[0] || 4).padStart(3, '0')}.jpg`;
      const preview = lab.phet.buildThumbnail?.(lab.config) || fallback;
      const displayTitle = lab.grade === 9 ? (lab.simulation?.title || lab.lesson.title) : lab.lesson.title;
      return `<a class="lab-card ${complete ? 'complete' : ''}" href="${labHref(lab)}" style="--card-accent:${accents[lab.chapter] || '#11a9a1'}">
        <div class="lab-card-art"><img src="${escapeHtml(preview)}" data-fallback="${escapeHtml(fallback)}" alt="${escapeHtml(displayTitle)} tajribasi" loading="lazy"><span>INTERAKTIV SIMULYATSIYA</span><b>${String(lab.number).padStart(2,'0')}</b></div>
        <div class="lab-card-copy">
          <div class="lab-card-meta"><span>${lab.chapter + 1}-BOB · ${escapeHtml(lab.role.toUpperCase())}</span><small>${complete ? 'YAKUNLANGAN ✓' : best ? `${best}% TAYYOR` : 'YANGI'}</small></div>
          <h3>${escapeHtml(displayTitle)}</h3>
          <p>${escapeHtml(lab.lesson.summary)}</p>
          <div class="lab-card-footer"><span>+${lab.reward} Impulse</span><b>→</b></div>
        </div>
      </a>`;
    }).join('');
    document.querySelectorAll('.lab-card-art img').forEach(image => image.addEventListener('error', () => {
      const fallback = image.dataset.fallback;
      if (fallback && !image.src.endsWith(fallback)) image.src = fallback;
      else image.classList.add('missing');
    }, {once: true}));
    $('#labsEmpty').classList.toggle('show', !visible.length);
  }

  function setMenu(open) {
    $('#labsSidebar').classList.toggle('open', open);
    $('#labsOverlay').classList.toggle('open', open);
  }
  function setAi(open) {
    $('#labsAi').classList.toggle('open', open);
    $('#labsAi').setAttribute('aria-hidden', String(!open));
  }

  $('#labsSearch').addEventListener('input', event => { searchTerm = event.target.value; renderLabs(); });
  $('#labsTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    globalState.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('idrokState', JSON.stringify(globalState));
  });
  $('#openLabsMenu').addEventListener('click', () => setMenu(true));
  $('#closeLabsMenu').addEventListener('click', () => setMenu(false));
  $('#labsOverlay').addEventListener('click', () => setMenu(false));
  $('#labsAiNav').addEventListener('click', () => { setMenu(false); setAi(true); });
  $('#closeLabsAi').addEventListener('click', () => setAi(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { setMenu(false); setAi(false); } });

  if (globalState.theme === 'dark') document.body.classList.add('dark');
  updateAccount();
  renderFilters();
  renderLabs();
})();

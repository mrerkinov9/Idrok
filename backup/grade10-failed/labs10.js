(() => {
  'use strict';

  const course = window.PHYSICS_COURSE;
  const labs = window.IDROK_LABS;
  const phet = window.IDROK_PHET;
  if (!course || !Array.isArray(course.lessons) || course.lessons.length !== 14 || !Array.isArray(labs) || labs.length !== 14 || !phet) {
    document.body.innerHTML = '<main><h1>Laboratoriyalar yuklanmadi</h1><p>Sahifani qayta ochib ko‘ring.</p></main>';
    return;
  }

  const $ = selector => document.querySelector(selector);
  const readJSON = (key, fallback) => {
    try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value && typeof value === 'object' ? value : fallback; }
    catch { return fallback; }
  };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const physicsLessons = new Map(course.lessons.map(lesson => [lesson.id, lesson]));
  
  const state = readJSON('idrokLabCourse10', {completed: [], best: {}, last: 'l1'});
  state.completed = Array.isArray(state.completed) ? state.completed : [];
  state.best = state.best && typeof state.best === 'object' ? state.best : {};
  
  const globalState = readJSON('idrokState', {impulse: 0, theme: 'light'});
  const users = readJSON('idrokUsers', []);
  const currentEmail = localStorage.getItem('idrokCurrentUser') || '';
  const currentUser = Array.isArray(users) ? users.find(user => user.email === currentEmail) : null;
  const accents = ['#6757e8','#ff7657','#e4a82e','#11a9a1'];

  let activeChapter = -1;
  let searchTerm = '';

  function labHref(lab) {
    return lab.extra ? `lab10.html?extra=${lab.simulationKey}` : `lab10.html?lesson=${lab.id}`;
  }

  labs.forEach((lab, index) => {
    const lesson = physicsLessons.get(lab.id);
    lab.number = index + 1;
    lab.chapter = lesson.chapter;
    lab.courseTitle = lesson.title;
    lab.reward = 40 + lab.chapter * 5 + (index % 3) * 5;
  });

  const usedSimulationKeys = new Set(Object.values(phet.lessons).map(config => config.simulation));
  const extraLabs = phet.catalog.filter(item => !usedSimulationKeys.has(item.key)).slice(0, 11).map((item, index) => ({
    id: `extra-${item.key}`,
    extra: true,
    simulationKey: item.key,
    title: item.title,
    courseTitle: 'Erkin fizika laboratoriyasi',
    role: 'Erkin tadqiqot',
    intro: 'Qo‘shimcha interaktiv tajriba. Parametrlarni o‘zgartirib, natijani o‘zingiz kashf eting.',
    chapter: -1,
    number: 15 + index,
    reward: 0,
  }));
  const catalogLabs = [...labs, ...extraLabs];

  function updateAccount() {
    const done = state.completed.filter(id => physicsLessons.has(id)).length;
    const percent = Math.round(done / 14 * 100);
    const name = currentUser?.name || 'Izlanuvchi';
    $('#labsImpulse').textContent = String(Number(globalState.impulse) || 0);
    $('#labsSideImpulse').textContent = String(Number(globalState.impulse) || 0);
    $('#labsSidePercent').textContent = `${percent}%`;
    $('#labsSideMeta').textContent = `${done} / 14 bajarildi`;
    $('#labsDone').textContent = String(done);
    $('#labsDoneMeta').textContent = `${percent}% progress`;
    $('#labsUserName').textContent = name;
    $('#labsAvatar').textContent = name.slice(0, 2).toUpperCase();
    const last = labs.find(lab => lab.id === state.last) || labs.find(lab => !state.completed.includes(lab.id)) || labs[0];
    $('#resumeLab').href = labHref(last);
    $('#resumeLab').firstChild.textContent = state.completed.length ? 'Oxirgi tajribani davom ettirish ' : 'Birinchi tajribani boshlash ';
  }

  function renderFilters() {
    const filters = [{index:-1,title:'Barchasi'}, ...course.chapters.map((chapter, index) => ({index,title:`${index + 1}-bob · ${chapter.title}`})), {index:99,title:'Qo‘shimcha tajribalar'}];
    $('#chapterFilters').innerHTML = filters.map(item => `<button class="${item.index === activeChapter ? 'active' : ''}" data-chapter="${item.index}" type="button">${escapeHtml(item.title)}</button>`).join('');
    document.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => {
      activeChapter = Number(button.dataset.chapter);
      renderFilters();
      renderLabs();
    }));
  }

  function renderLabs() {
    const query = searchTerm.trim().toLocaleLowerCase('uz-UZ');
    const visible = catalogLabs.filter(lab => {
      if (activeChapter === 99 && !lab.extra) return false;
      if (activeChapter >= 0 && activeChapter !== 99 && lab.chapter !== activeChapter) return false;
      if (!query) return true;
      const config = lab.extra ? {simulation:lab.simulationKey} : phet.lessons[lab.id];
      const simulationTitle = phet.simulations[config?.simulation]?.title || '';
      return `${simulationTitle} ${lab.title} ${lab.courseTitle} ${lab.role} ${lab.intro}`.toLocaleLowerCase('uz-UZ').includes(query);
    });
    $('#labsGrid').innerHTML = visible.map(lab => {
      const complete = state.completed.includes(lab.id);
      const best = Number(state.best[lab.id]) || 0;
      const lesson = physicsLessons.get(lab.id);
      const config = lab.extra ? {kind:'official', simulation:lab.simulationKey} : phet.lessons[lab.id];
      const simulation = phet.simulations[config.simulation];
      const fallback = lesson?.figure || `assets/physics10/figures/lesson-${String(lesson?.number || 1).padStart(2, '0')}.png`;
      const preview = phet.buildThumbnail(config) || fallback;
      const displayTitle = simulation?.title || lab.title;
      const artwork = `<img src="${escapeHtml(preview)}" data-fallback="${escapeHtml(fallback)}" alt="${escapeHtml(displayTitle)} simulyatsiyasi" loading="lazy">`;
      return `<a class="lab-card ${complete ? 'complete' : ''}" href="${labHref(lab)}" style="--card-accent:${accents[lab.chapter] || '#11a9a1'}">
        <div class="lab-card-art">${artwork}<span>INTERAKTIV SIMULYATSIYA</span><b>${String(lab.number).padStart(2,'0')}</b></div>
        <div class="lab-card-copy">
          <div class="lab-card-meta"><span>${lab.extra ? 'QO‘SHIMCHA' : `${lab.chapter + 1}-BOB`} · ${escapeHtml(lab.role.toUpperCase())}</span><small>${complete ? 'YAKUNLANGAN ✓' : best ? `${best}% TAYYOR` : 'YANGI'}</small></div>
          <h3>${escapeHtml(displayTitle)}</h3>
          <p>${escapeHtml(lab.courseTitle)}</p>
          <div class="lab-card-footer"><span>${lab.extra ? 'Erkin tajriba' : `+${lab.reward} Impulse`}</span><b>→</b></div>
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

  $('#labsSearch').addEventListener('input', event => { searchTerm = event.target.value; renderLabs(); });
  $('#labsTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    globalState.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('idrokState', JSON.stringify(globalState));
    renderLabs();
  });
  $('#openLabsMenu').addEventListener('click', () => setMenu(true));
  $('#closeLabsMenu').addEventListener('click', () => setMenu(false));
  $('#labsOverlay').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { setMenu(false); } });

  if (globalState.theme === 'dark') document.body.classList.add('dark');
  updateAccount();
  renderFilters();
  renderLabs();
})();

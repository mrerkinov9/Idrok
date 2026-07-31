(() => {
  'use strict';

  const course = window.PHYSICS_COURSE;
  const labs = window.IDROK_LABS;
  const scenes = window.LabScenes;
  if (!course || !Array.isArray(course.lessons) || !Array.isArray(labs) || !scenes || typeof scenes.drawLabScene !== 'function') {
    document.body.innerHTML = '<main style="display:grid;height:100%;place-items:center;padding:24px;color:#fff;background:#080b13;font:700 18px system-ui;text-align:center">Tajriba yuklanmadi. Sahifani qayta ochib ko‘ring.</main>';
    return;
  }

  const $ = selector => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const params = new URLSearchParams(location.search);
  const requestedId = params.get('lesson');
  const lab = labs.find(item => item.id === requestedId) || labs[0];
  const labIndex = labs.indexOf(lab);
  const lesson = course.lessons.find(item => item.id === lab.id);
  lab.number = labIndex + 1;
  lab.chapter = Number(lesson?.chapter) || 0;
  lab.courseTitle = lesson?.title || lab.title;

  const initial = Object.freeze({
    a: Number(lab.controls.a.value),
    b: Number(lab.controls.b.value),
    dragX: Number(lab.drag.x),
    dragY: Number(lab.drag.y),
  });
  const state = {
    ...initial,
    actions: 0,
    pulse: 0,
    view: 'scene',
    paused: false,
    dragging: false,
  };
  const interaction = {aChanged: false, bChanged: false, dragged: false, acted: false};
  const canvas = $('#simCanvas');
  const ctx = canvas.getContext('2d', {alpha: false});
  let lastFrame = performance.now();
  let sceneTime = 0;
  let hintTimer = 0;

  function decimals(control) {
    const values = [control.min, control.max, control.value];
    return values.some(value => !Number.isInteger(Number(value))) ? 1 : 0;
  }

  function stepFor(control) {
    return decimals(control) ? .1 : 1;
  }

  function formatValue(control, value) {
    const number = Number(value);
    const output = Number.isFinite(number) ? number.toFixed(decimals(control)) : '0';
    return `${output}${control.unit ? ` ${control.unit}` : ''}`;
  }

  function rangeScore(value, target, control) {
    if (!Array.isArray(target) || target.length < 2) return 1;
    if (value >= target[0] && value <= target[1]) return 1;
    const distance = value < target[0] ? target[0] - value : value - target[1];
    return clamp(1 - distance / Math.max(control.max - control.min, 1) * 3.2, 0, 1);
  }

  function dragScore(axis) {
    const target = lab.goal?.[`drag${axis.toUpperCase()}`];
    if (!Array.isArray(target)) return null;
    const value = axis === 'x' ? state.dragX : state.dragY;
    if (value >= target[0] && value <= target[1]) return 1;
    const distance = value < target[0] ? target[0] - value : value - target[1];
    return clamp(1 - distance * 2.8, 0, 1);
  }

  function progressValue() {
    const scores = [
      rangeScore(state.a, lab.goal?.a, lab.controls.a),
      rangeScore(state.b, lab.goal?.b, lab.controls.b),
    ];
    const x = dragScore('x');
    const y = dragScore('y');
    if (x !== null) scores.push(x);
    if (y !== null) scores.push(y);
    if (Number(lab.goal?.actions) > 0) scores.push(clamp(state.actions / Number(lab.goal.actions), 0, 1));
    return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length * 100);
  }

  function missionSteps() {
    return [
      interaction.aChanged,
      interaction.bChanged || interaction.dragged,
      interaction.acted && interaction.dragged,
    ];
  }

  function notifyParent() {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: 'idrok-custom-progress',
      lessonId: lab.id,
      steps: missionSteps(),
      progress: progressValue(),
      actions: state.actions,
    }, '*');
  }

  function setupRange(name, control) {
    const input = $(`#control${name}`);
    const key = name.toLowerCase();
    input.min = String(control.min);
    input.max = String(control.max);
    input.step = String(stepFor(control));
    input.value = String(state[key]);
    $(`#control${name}Label`).textContent = control.label;
    $(`#metric${name}Label`).textContent = control.label.toUpperCase();
    const commit = () => {
      state[key] = Number(input.value);
      interaction[`${key}Changed`] = true;
      state.pulse = Math.max(state.pulse, .25);
      updateUi();
      notifyParent();
    };
    const setFromPointer = event => {
      const rect = input.getBoundingClientRect();
      const ratio = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      const step = stepFor(control);
      const raw = control.min + ratio * (control.max - control.min);
      const value = Math.round(raw / step) * step;
      input.value = String(clamp(value, control.min, control.max));
      commit();
    };
    input.addEventListener('input', commit);
    input.addEventListener('pointerdown', event => {
      setFromPointer(event);
      try { input.setPointerCapture(event.pointerId); } catch { /* Pointer capture is optional. */ }
    });
    input.addEventListener('pointermove', event => {
      if (event.buttons === 1 && input.hasPointerCapture?.(event.pointerId)) setFromPointer(event);
    });
    input.addEventListener('keydown', event => {
      const step = stepFor(control);
      const current = Number(input.value);
      let next = current;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + step;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - step;
      else if (event.key === 'PageUp') next = current + step * 10;
      else if (event.key === 'PageDown') next = current - step * 10;
      else if (event.key === 'Home') next = control.min;
      else if (event.key === 'End') next = control.max;
      else return;
      event.preventDefault();
      input.value = String(clamp(next, control.min, control.max));
      commit();
    });
  }

  function updateUi() {
    const progress = progressValue();
    $('#outputA').textContent = formatValue(lab.controls.a, state.a);
    $('#outputB').textContent = formatValue(lab.controls.b, state.b);
    $('#metricA').textContent = formatValue(lab.controls.a, state.a);
    $('#metricB').textContent = formatValue(lab.controls.b, state.b);
    $('#metricProgress').textContent = `${progress}%`;
    $('#actionCount').textContent = `${state.actions} harakat`;
    $('#actionProgress').style.width = `${Math.max(progress, state.actions ? 18 : 0)}%`;
    $('#simState').textContent = state.paused ? 'PAUZA' : progress >= 95 ? 'MUVAFFAQIYAT' : 'FAOL';
    $('#simState').classList.toggle('paused', state.paused);
    $('#pauseButton').querySelector('b').textContent = state.paused ? 'Davom' : 'Pauza';
    $('#pauseButton').querySelector('span').textContent = state.paused ? '▶' : 'Ⅱ';
  }

  function reset() {
    Object.assign(state, initial, {actions: 0, pulse: 0, view: 'scene', paused: false, dragging: false});
    Object.keys(interaction).forEach(key => { interaction[key] = false; });
    $('#controlA').value = String(state.a);
    $('#controlB').value = String(state.b);
    document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === 'scene'));
    $('#dragCallout').classList.remove('hidden');
    canvas.classList.remove('dragging');
    updateUi();
    notifyParent();
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / canvas.width, rect.height / canvas.height);
    const renderedWidth = canvas.width * scale;
    const renderedHeight = canvas.height * scale;
    const offsetX = (rect.width - renderedWidth) / 2;
    const offsetY = (rect.height - renderedHeight) / 2;
    return {
      x: clamp((event.clientX - rect.left - offsetX) / scale, 0, canvas.width),
      y: clamp((event.clientY - rect.top - offsetY) / scale, 0, canvas.height),
    };
  }

  function moveHandle(event) {
    const point = canvasPoint(event);
    const nextX = clamp((point.x - 72) / (canvas.width - 144), 0, 1);
    const nextY = clamp((point.y - 70) / (canvas.height - 140), 0, 1);
    if (lab.drag.mode !== 'y') state.dragX = nextX;
    if (lab.drag.mode !== 'x') state.dragY = nextY;
    interaction.dragged = true;
    $('#dragCallout').classList.add('hidden');
    updateUi();
    notifyParent();
  }

  canvas.addEventListener('pointerdown', event => {
    const point = canvasPoint(event);
    const handle = scenes.getHandle(lab, state);
    const distance = Math.hypot(point.x - handle.x, point.y - handle.y);
    if (distance > Math.max(60, handle.radius * 2.2)) return;
    state.dragging = true;
    canvas.classList.add('dragging');
    moveHandle(event);
    try { canvas.setPointerCapture(event.pointerId); } catch { /* Synthetic QA events do not own pointer capture. */ }
  });
  canvas.addEventListener('pointermove', event => { if (state.dragging) moveHandle(event); });
  const stopDragging = event => {
    if (!state.dragging) return;
    state.dragging = false;
    canvas.classList.remove('dragging');
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    notifyParent();
  };
  canvas.addEventListener('pointerup', stopDragging);
  canvas.addEventListener('pointercancel', stopDragging);
  canvas.addEventListener('keydown', event => {
    const key = event.key;
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)) return;
    event.preventDefault();
    const delta = event.shiftKey ? .06 : .025;
    if (lab.drag.mode !== 'y') {
      if (key === 'ArrowLeft') state.dragX = clamp(state.dragX - delta, 0, 1);
      if (key === 'ArrowRight') state.dragX = clamp(state.dragX + delta, 0, 1);
    }
    if (lab.drag.mode !== 'x') {
      if (key === 'ArrowUp') state.dragY = clamp(state.dragY - delta, 0, 1);
      if (key === 'ArrowDown') state.dragY = clamp(state.dragY + delta, 0, 1);
    }
    interaction.dragged = true;
    $('#dragCallout').classList.add('hidden');
    updateUi();
    notifyParent();
  });

  $('#runButton').addEventListener('click', () => {
    state.actions += 1;
    state.pulse = 1;
    interaction.acted = true;
    $('#runButton').animate([
      {transform: 'scale(1)'},
      {transform: 'scale(.97)'},
      {transform: 'scale(1)'},
    ], {duration: 260, easing: 'ease-out'});
    updateUi();
    notifyParent();
  });

  $('#hintButton').addEventListener('click', () => {
    const bubble = $('#hintBubble');
    bubble.classList.toggle('show');
    clearTimeout(hintTimer);
    if (bubble.classList.contains('show')) hintTimer = setTimeout(() => bubble.classList.remove('show'), 6000);
  });
  $('#pauseButton').addEventListener('click', () => { state.paused = !state.paused; updateUi(); });
  $('#resetButton').addEventListener('click', reset);
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    state.view = button.dataset.view;
    document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === button));
  }));
  document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.metaKey) reset();
    if (event.code === 'Space' && !['INPUT', 'BUTTON'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      $('#runButton').click();
    }
  });

  function render(now) {
    const delta = Math.min((now - lastFrame) / 1000, .05);
    lastFrame = now;
    if (!state.paused) sceneTime += delta;
    state.pulse = Math.max(0, state.pulse - delta * 1.25);
    scenes.drawLabScene(ctx, lab, state, sceneTime);
    requestAnimationFrame(render);
  }

  document.title = `${lab.title} — Idrok tajribasi`;
  $('#simNumber').textContent = String(lab.number).padStart(2, '0');
  $('#simTitle').textContent = lab.title;
  $('#simRole').textContent = lab.role;
  $('#dragLabel').textContent = lab.drag.label;
  $('#hintText').textContent = lab.challenge;
  $('#runLabel').textContent = lab.actionLabel;
  setupRange('A', lab.controls.a);
  setupRange('B', lab.controls.b);
  updateUi();
  notifyParent();
  requestAnimationFrame(render);

  window.IdrokCustomSimDebug = Object.freeze({
    validate: () => ({
      lesson: lab.id,
      scene: lab.scene,
      uniqueSceneCount: new Set(labs.map(item => item.scene)).size,
      issues: [lab.controls?.a, lab.controls?.b, lab.goal, lab.drag, scenes.getHandle].every(Boolean) ? [] : ['Tajriba konfiguratsiyasi to‘liq emas.'],
    }),
    snapshot: () => ({lesson: lab.id, scene: lab.scene, state: {...state}, steps: missionSteps(), progress: progressValue()}),
  });
})();

(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const mix = (a, b, t) => a + (b - a) * t;

  function roundedRect(ctx, x, y, w, h, r = 14) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function fillRound(ctx, x, y, w, h, r, fill, stroke = null, lineWidth = 1) {
    roundedRect(ctx, x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }

  function line(ctx, x1, y1, x2, y2, color, width = 3, dash = []) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function arrow(ctx, x1, y1, x2, y2, color, labelText = '', width = 4) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    line(ctx, x1, y1, x2, y2, color, width);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(angle - .55) * 14, y2 - Math.sin(angle - .55) * 14);
    ctx.lineTo(x2 - Math.cos(angle + .55) * 14, y2 - Math.sin(angle + .55) * 14);
    ctx.closePath();
    ctx.fill();
    if (labelText) {
      ctx.font = '800 12px Inter, sans-serif';
      ctx.fillText(labelText, (x1 + x2) / 2 + 8, (y1 + y2) / 2 - 8);
    }
    ctx.restore();
  }

  function text(ctx, value, x, y, size, color, weight = 700, align = 'left') {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Inter, Segoe UI, sans-serif`;
    ctx.textAlign = align;
    ctx.fillText(value, x, y);
    ctx.restore();
  }

  function pill(ctx, value, x, y, palette, color = null) {
    ctx.save();
    ctx.font = '800 11px Inter, sans-serif';
    const width = Math.max(78, ctx.measureText(value).width + 24);
    fillRound(ctx, x, y, width, 30, 9, palette.labelBg, palette.labelBorder);
    ctx.fillStyle = color || palette.ink;
    ctx.fillText(value, x + 12, y + 20);
    ctx.restore();
  }

  function backdrop(ctx, palette, chapter, t) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 560);
    gradient.addColorStop(0, palette.skyTop);
    gradient.addColorStop(.66, palette.skyBottom);
    gradient.addColorStop(.661, palette.groundTop);
    gradient.addColorStop(1, palette.groundBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 960, 560);
    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.arc(815, 95, 48, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = .2;
    for (let i = 0; i < 7; i++) {
      const x = 70 + i * 145;
      const y = 120 + Math.sin(t * .3 + i) * 8;
      ctx.fillStyle = i % 2 ? palette.accentSoft : palette.cyanSoft;
      ctx.beginPath();
      ctx.arc(x, y, 18 + (i % 3) * 7, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (chapter === 4 || chapter === 5) {
      ctx.globalAlpha = .42;
      for (let i = 0; i < 34; i++) {
        ctx.fillStyle = i % 3 ? palette.star : palette.cyan;
        ctx.beginPath();
        ctx.arc((i * 83) % 940, 35 + (i * 47) % 300, i % 4 ? 1.4 : 2.3, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  function norm(control, value) {
    return clamp((Number(value) - control.min) / (control.max - control.min), 0, 1);
  }

  function getHandle(lab, state, width = 960, height = 560) {
    return {
      x: 72 + clamp(state.dragX, 0, 1) * (width - 144),
      y: 70 + clamp(state.dragY, 0, 1) * (height - 140),
      radius: 29,
    };
  }

  function particleField(ctx, x, y, w, h, count, speed, t, colors, radius = 5) {
    for (let i = 0; i < count; i++) {
      const phase = i * 12.9898;
      const px = x + ((i * 67 + t * speed * (17 + i % 7)) % w + w) % w;
      const py = y + ((i * 43 + Math.sin(t * speed + phase) * 28 + phase * 5) % h + h) % h;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(px, py, radius + (i % 3) * .8, 0, TAU);
      ctx.fill();
    }
  }

  function vessel(ctx, x, y, w, h, fill, palette, level = .65) {
    fillRound(ctx, x, y, w, h, 12, palette.glass, palette.inkSoft, 3);
    const liquidY = y + h * (1 - level);
    const grad = ctx.createLinearGradient(0, liquidY, 0, y + h);
    grad.addColorStop(0, fill);
    grad.addColorStop(1, palette.waterDeep);
    ctx.fillStyle = grad;
    roundedRect(ctx, x + 5, liquidY, w - 10, h * level - 5, 8);
    ctx.fill();
    line(ctx, x + 8, liquidY, x + w - 8, liquidY, palette.foam, 3);
  }

  function gauge(ctx, x, y, radius, value, palette, caption) {
    ctx.save();
    ctx.strokeStyle = palette.panelBorder;
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * .8, Math.PI * 2.2);
    ctx.stroke();
    ctx.strokeStyle = palette.cyan;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * .8, Math.PI * (.8 + 1.4 * value));
    ctx.stroke();
    const angle = Math.PI * (.8 + 1.4 * value);
    line(ctx, x, y, x + Math.cos(angle) * (radius - 9), y + Math.sin(angle) * (radius - 9), palette.orange, 5);
    ctx.fillStyle = palette.ink;
    ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
    text(ctx, caption, x, y + radius + 25, 12, palette.ink, 800, 'center');
    ctx.restore();
  }

  function graph(ctx, x, y, w, h, points, palette, xLabel = '', yLabel = '') {
    fillRound(ctx, x, y, w, h, 14, palette.panel, palette.panelBorder, 2);
    line(ctx, x + 42, y + 20, x + 42, y + h - 35, palette.inkSoft, 2);
    line(ctx, x + 42, y + h - 35, x + w - 20, y + h - 35, palette.inkSoft, 2);
    ctx.save();
    ctx.strokeStyle = palette.cyan;
    ctx.lineWidth = 4;
    ctx.beginPath();
    points.forEach((point, index) => {
      const px = x + 44 + point[0] * (w - 70);
      const py = y + 20 + (1 - point[1]) * (h - 58);
      if (!index) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
    if (xLabel) text(ctx, xLabel, x + w - 25, y + h - 13, 10, palette.muted, 800, 'right');
    if (yLabel) text(ctx, yLabel, x + 15, y + 26, 10, palette.muted, 800);
  }

  function lens(ctx, x, y, height, width, palette, concave = false) {
    ctx.save();
    const grad = ctx.createLinearGradient(x - width, 0, x + width, 0);
    grad.addColorStop(0, palette.cyanSoft);
    grad.addColorStop(.5, palette.foam);
    grad.addColorStop(1, palette.accentSoft);
    ctx.fillStyle = grad;
    ctx.strokeStyle = palette.cyan;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (!concave) {
      ctx.moveTo(x, y - height / 2);
      ctx.bezierCurveTo(x + width, y - height / 3, x + width, y + height / 3, x, y + height / 2);
      ctx.bezierCurveTo(x - width, y + height / 3, x - width, y - height / 3, x, y - height / 2);
    } else {
      ctx.moveTo(x - width * .55, y - height / 2);
      ctx.bezierCurveTo(x + width * .2, y - height / 3, x + width * .2, y + height / 3, x - width * .55, y + height / 2);
      ctx.lineTo(x + width * .55, y + height / 2);
      ctx.bezierCurveTo(x - width * .2, y + height / 3, x - width * .2, y - height / 3, x + width * .55, y - height / 2);
      ctx.closePath();
    }
    ctx.fill(); ctx.stroke(); ctx.restore();
  }

  function flame(ctx, x, y, scale, palette, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = palette.orange;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.bezierCurveTo(-31, 12, -15, -7 - Math.sin(t * 5) * 8, -4, -30);
    ctx.bezierCurveTo(4, -5, 28, 2, 19, 27);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = palette.yellow;
    ctx.beginPath();
    ctx.moveTo(0, 24); ctx.bezierCurveTo(-12, 14, -5, 2, 2, -9); ctx.bezierCurveTo(12, 4, 13, 15, 0, 24); ctx.fill();
    ctx.restore();
  }

  function engineCylinder(ctx, x, y, w, h, pistonY, palette) {
    fillRound(ctx, x, y, w, h, 18, palette.machine, palette.inkSoft, 4);
    ctx.fillStyle = palette.metal;
    fillRound(ctx, x + 12, pistonY, w - 24, 28, 7, palette.metal, palette.foam, 2);
    line(ctx, x + w / 2, pistonY + 28, x + w / 2, y + h + 55, palette.metalDark, 12);
  }

  function cloud(ctx, x, y, scale, palette) {
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.fillStyle = palette.cloud;
    ctx.beginPath(); ctx.arc(-38, 3, 30, 0, TAU); ctx.arc(0, -17, 42, 0, TAU); ctx.arc(41, 2, 32, 0, TAU); ctx.fillRect(-62, 0, 125, 35); ctx.fill(); ctx.restore();
  }

  function drawHandle(ctx, handle, lab, state, palette) {
    ctx.save();
    ctx.strokeStyle = state.held ? palette.yellow : palette.cyan;
    ctx.lineWidth = state.held ? 5 : 3;
    ctx.setLineDash(state.held ? [] : [7, 7]);
    ctx.beginPath(); ctx.arc(handle.x, handle.y, handle.radius + 9, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    if (!state.held) {
      const value = lab.drag.label.toUpperCase();
      ctx.font = '800 9px Inter, sans-serif';
      const width = Math.min(170, Math.max(82, ctx.measureText(value).width + 22));
      fillRound(ctx, clamp(handle.x - width / 2, 10, 950 - width), clamp(handle.y - 58, 12, 520), width, 25, 8, palette.labelBg, palette.labelBorder);
      ctx.fillStyle = palette.ink;
      ctx.textAlign = 'center';
      ctx.fillText(value, clamp(handle.x, 10 + width / 2, 950 - width / 2), clamp(handle.y - 41, 29, 537));
    }
    ctx.restore();
  }

  function sceneTitle(ctx, value, subtitle, palette) {
    pill(ctx, value, 24, 22, palette);
    text(ctx, subtitle, 27, 72, 12, palette.muted, 700);
  }

  function drawSceneBody(ctx, lab, state, t, palette, handle) {
    const A = norm(lab.controls.a, state.a);
    const B = norm(lab.controls.b, state.b);
    const pulse = clamp(state.pulse || 0, 0, 1);
    const scene = lab.scene;

    switch (scene) {
      case 'diffusion': {
        sceneTitle(ctx, 'DIFFUZIYA KAMERASI', `T = ${Math.round(state.a)} °C`, palette);
        vessel(ctx, 100, 170, 310, 300, palette.water, palette, .78);
        vessel(ctx, 550, 170, 310, 300, palette.water, palette, .78);
        particleField(ctx, 120, 255, 270, 185, 28, .6 + A * 4, t, [palette.cyan, palette.blue], 4);
        particleField(ctx, 570, 255, 270, 185, 28, 1.2 + A * 7, t, [palette.cyan, palette.pink], 4);
        const spread = 26 + A * 90 + pulse * 55;
        ctx.globalAlpha = .5; ctx.fillStyle = palette.pink; ctx.beginPath(); ctx.arc(handle.x, Math.max(handle.y, 250), spread, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = palette.pink; ctx.beginPath(); ctx.ellipse(handle.x, handle.y, 15, 24, 0, 0, TAU); ctx.fill();
        text(ctx, 'SOVUQ SUV', 255, 505, 13, palette.ink, 800, 'center'); text(ctx, 'ILIQ SUV', 705, 505, 13, palette.ink, 800, 'center');
        break;
      }
      case 'molecule-scale': {
        sceneTitle(ctx, 'NANOMETR USTAXONASI', 'd = V / S', palette);
        fillRound(ctx, 88, 132, 784, 345, 35, palette.waterSoft, palette.foam, 4);
        const radius = 50 + B * 190;
        ctx.globalAlpha = .5; ctx.fillStyle = palette.yellow; ctx.beginPath(); ctx.ellipse(480, 320, radius, radius * .42, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
        for (let x = 150; x < 820; x += 52) line(ctx, x, 448, x, 460, palette.inkSoft, 2);
        line(ctx, 150, 455, 820, 455, palette.inkSoft, 3);
        ctx.fillStyle = palette.orange; ctx.beginPath(); ctx.arc(handle.x, handle.y, 19 + A * 8, 0, TAU); ctx.fill();
        pill(ctx, `QATLAM: ${(10 / (1 + B * 8)).toFixed(2)} nm`, 650, 92, palette, palette.orange);
        break;
      }
      case 'mole-counter': {
        sceneTitle(ctx, 'AVOGADRO KONVEYERI', `${Number(state.a).toFixed(1)} mol`, palette);
        fillRound(ctx, 100, 345, 760, 90, 20, palette.machine, palette.inkSoft, 3);
        for (let x = 140; x < 840; x += 65) { ctx.fillStyle = palette.metal; ctx.beginPath(); ctx.arc(x, 390, 23, 0, TAU); ctx.fill(); }
        fillRound(ctx, 620, 130, 230, 155, 18, palette.panel, palette.panelBorder, 3);
        text(ctx, 'ZARRALAR SONI', 735, 170, 12, palette.muted, 800, 'center');
        text(ctx, `${(Number(state.a) * 6.02).toFixed(2)} × 10²³`, 735, 220, 24, palette.cyan, 800, 'center');
        fillRound(ctx, handle.x - 35, handle.y - 30, 70, 60, 14, palette.accent, palette.foam, 2);
        for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? palette.cyan : palette.yellow; ctx.beginPath(); ctx.arc(handle.x - 20 + (i % 4) * 13, handle.y - 14 + Math.floor(i / 4) * 24, 5, 0, TAU); ctx.fill(); }
        break;
      }
      case 'molecule-calculator': {
        sceneTitle(ctx, 'MOLEKULA BALANS TAHTASI', 'n = m / M', palette);
        line(ctx, 220, 345, 740, 345, palette.ink, 8);
        ctx.fillStyle = palette.metal; ctx.beginPath(); ctx.moveTo(480, 345); ctx.lineTo(435, 455); ctx.lineTo(525, 455); ctx.closePath(); ctx.fill();
        [285, 675].forEach((x, i) => { line(ctx, x, 250, x, 345, palette.inkSoft, 3); fillRound(ctx, x - 110, 250, 220, 24, 10, i ? palette.cyanSoft : palette.accentSoft, palette.inkSoft, 2); });
        text(ctx, `${Math.round(state.a)} g`, 285, 228, 20, palette.accent, 800, 'center'); text(ctx, `${Math.round(state.b)} g/mol`, 675, 228, 20, palette.cyan, 800, 'center');
        fillRound(ctx, handle.x - 42, handle.y - 27, 84, 54, 12, palette.orange, palette.foam, 2); text(ctx, 'n = ?', handle.x, handle.y + 6, 16, '#fff', 800, 'center');
        break;
      }
      case 'ideal-gas': {
        sceneTitle(ctx, 'IDEAL GAZ KAPSULASI', 'pV = νRT', palette);
        const pistonY = clamp(handle.y, 145, 330);
        fillRound(ctx, 250, 105, 460, 365, 18, palette.glass, palette.inkSoft, 4);
        ctx.fillStyle = palette.metal; ctx.fillRect(225, pistonY, 510, 27); line(ctx, 480, 65, 480, pistonY, palette.metalDark, 16);
        particleField(ctx, 275, pistonY + 38, 410, Math.max(80, 400 - pistonY), 30 + Math.round(B * 30), .7 + A * 6, t, [palette.cyan, palette.pink, palette.yellow], 5);
        gauge(ctx, 815, 180, 60, clamp(A + (1 - pistonY / 400), 0, 1), palette, 'BOSIM');
        text(ctx, `${Math.round(state.a)} K`, 480, 515, 18, palette.orange, 800, 'center');
        break;
      }
      case 'temperature': {
        sceneTitle(ctx, 'KELVIN MINORASI', 'T = t + 273', palette);
        fillRound(ctx, 360, 95, 240, 375, 25, palette.panel, palette.panelBorder, 3);
        ctx.strokeStyle = palette.ink; ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(480, 145); ctx.lineTo(480, 375); ctx.stroke();
        const level = 360 - A * 205;
        ctx.strokeStyle = palette.orange; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(480, 365); ctx.lineTo(480, level); ctx.stroke(); ctx.fillStyle = palette.orange; ctx.beginPath(); ctx.arc(480, 395, 34, 0, TAU); ctx.fill();
        for (let y = 165; y < 360; y += 39) line(ctx, 510, y, 548, y, palette.inkSoft, 2);
        flame(ctx, handle.x, handle.y, .62 + pulse * .2, palette, t);
        pill(ctx, `${Math.round(273 + A * 100)} K`, 650, 180, palette, palette.orange);
        break;
      }
      case 'maxwell': {
        sceneTitle(ctx, 'MAKSVELL TEZLIK ARENASI', 'Zarralar taqsimoti', palette);
        const points = Array.from({length: 22}, (_, i) => { const x = i / 21; const peak = .25 + A * .42; const width = .1 + B * .13; return [x, Math.exp(-Math.pow((x - peak) / width, 2)) * .86]; });
        graph(ctx, 80, 120, 800, 330, points, palette, 'v', 'N');
        particleField(ctx, 105, 465, 740, 55, 20, 1 + A * 8, t, [palette.yellow, palette.cyan, palette.pink], 4);
        line(ctx, handle.x, 145, handle.x, 417, palette.orange, 4, [7, 7]);
        pill(ctx, 'ENG EHTIMOLLI TEZLIK', clamp(handle.x - 90, 80, 700), 465, palette, palette.orange);
        break;
      }
      case 'thermal-race': {
        sceneTitle(ctx, 'MOLEKULALAR TEZLIK RALLISI', 'Ikki temperatura — ikki tezlik', palette);
        [205, 365].forEach((y, lane) => { fillRound(ctx, 90, y - 55, 780, 110, 20, lane ? palette.cyanSoft : palette.accentSoft, palette.panelBorder, 2); line(ctx, 120, y, 825, y, palette.inkSoft, 3, [12, 12]); });
        for (let i = 0; i < 9; i++) { ctx.fillStyle = palette.accent; ctx.beginPath(); ctx.arc(130 + ((t * (55 + A * 170) + i * 76) % 660), 205 + Math.sin(i) * 18, 10, 0, TAU); ctx.fill(); }
        for (let i = 0; i < 9; i++) { ctx.fillStyle = palette.cyan; ctx.beginPath(); ctx.arc(130 + ((t * (70 + B * 200) + i * 83) % 660), 365 + Math.cos(i) * 18, 10, 0, TAU); ctx.fill(); }
        line(ctx, handle.x, 135, handle.x, 438, palette.orange, 6); text(ctx, 'FINISH', handle.x, 472, 12, palette.orange, 800, 'center');
        break;
      }
      case 'gas-state': {
        sceneTitle(ctx, 'p–V–T MARKAZI', 'Holat diagrammasi', palette);
        graph(ctx, 70, 115, 520, 365, [[.08,.25],[.25,.35],[.45,.52],[.65,.68],[.88,.86]], palette, 'V', 'p');
        ctx.fillStyle = palette.orange; ctx.beginPath(); ctx.arc(handle.x, handle.y, 16, 0, TAU); ctx.fill();
        fillRound(ctx, 650, 140, 230, 270, 18, palette.glass, palette.inkSoft, 3);
        const py = 190 + (1 - A) * 130; ctx.fillStyle = palette.metal; ctx.fillRect(635, py, 260, 22);
        particleField(ctx, 670, py + 35, 190, Math.max(60, 350 - py), 20, 2 + B * 4, t, [palette.cyan, palette.pink], 5);
        pill(ctx, `${Math.round(state.a)} kPa`, 680, 435, palette, palette.cyan);
        break;
      }
      case 'boyle': {
        sceneTitle(ctx, 'BOYL SHPRITS LABORATORIYASI', 'T = const • pV = const', palette);
        fillRound(ctx, 120, 220, 690, 150, 30, palette.glass, palette.inkSoft, 4);
        for (let x = 175; x < 760; x += 70) line(ctx, x, 215, x, 235, palette.inkSoft, 2);
        const px = clamp(handle.x, 300, 770); ctx.fillStyle = palette.metal; ctx.fillRect(px - 15, 205, 30, 180); line(ctx, px, 295, 875, 295, palette.metalDark, 20);
        particleField(ctx, 145, 245, Math.max(80, px - 180), 100, 28, 1.5 + A * 3, t, [palette.cyan, palette.yellow], 5);
        gauge(ctx, 220, 135, 55, clamp((1 - (px - 300) / 470) * .8 + A * .2, 0, 1), palette, 'p');
        text(ctx, 'V ↓  →  p ↑', 480, 465, 22, palette.ink, 800, 'center');
        break;
      }
      case 'charles': {
        sceneTitle(ctx, 'SHARL SHARI', 'p = const • V / T = const', palette);
        vessel(ctx, 310, 300, 340, 170, palette.water, palette, .72);
        fillRound(ctx, 405, 230, 150, 135, 26, palette.glass, palette.inkSoft, 3);
        const balloonR = 45 + A * 72;
        ctx.fillStyle = palette.pink; ctx.beginPath(); ctx.ellipse(480, 145, balloonR * .82, balloonR, 0, 0, TAU); ctx.fill(); line(ctx, 480, 145 + balloonR, 480, 235, palette.inkSoft, 3);
        flame(ctx, handle.x, handle.y, .65 + pulse * .2, palette, t);
        particleField(ctx, 425, 250, 110, 80, 13, 1 + A * 5, t, [palette.cyan, palette.yellow], 4);
        pill(ctx, `V = ${Math.round(2 + A * 8)} L`, 700, 175, palette, palette.pink);
        break;
      }
      case 'gay-lussac': {
        sceneTitle(ctx, 'IZOXORIK REAKTOR', 'V = const • p / T = const', palette);
        fillRound(ctx, 270, 120, 420, 330, 35, palette.machine, palette.inkSoft, 5);
        particleField(ctx, 310, 165, 340, 230, 34, 1 + A * 7, t, [palette.orange, palette.cyan], 6);
        gauge(ctx, 780, 220, 70, clamp(A * .82 + .1, 0, 1), palette, 'REAKTOR BOSIMI');
        flame(ctx, 480, 475, .8, palette, t);
        fillRound(ctx, handle.x - 28, handle.y - 28, 56, 56, 13, palette.cyan, palette.foam, 2); text(ctx, 'P', handle.x, handle.y + 7, 19, '#fff', 800, 'center');
        break;
      }
      case 'oil-film': {
        sceneTitle(ctx, 'MOY PARDASI MIKROLABI', 'Bir molekulalik qatlam', palette);
        fillRound(ctx, 100, 150, 760, 310, 42, palette.waterSoft, palette.foam, 4);
        const r = 45 + B * 220; ctx.globalAlpha = .62; ctx.fillStyle = palette.yellow; ctx.beginPath(); ctx.ellipse(480, 315, r, r * .42, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = palette.orange; ctx.beginPath(); ctx.arc(handle.x, handle.y, 16 + A * 9, 0, TAU); ctx.fill();
        line(ctx, 210, 490, 750, 490, palette.inkSoft, 3); for (let x = 210; x <= 750; x += 45) line(ctx, x, 482, x, 498, palette.inkSoft, 2);
        pill(ctx, `d ≈ ${(1.8 / (1 + B * 8)).toFixed(2)} nm`, 680, 95, palette, palette.orange);
        break;
      }
      case 'gas-puzzle': {
        sceneTitle(ctx, 'GAZ QONUNLARI SEYFI', 'p₁V₁/T₁ = p₂V₂/T₂', palette);
        fillRound(ctx, 520, 125, 330, 330, 28, palette.machine, palette.inkSoft, 4);
        ctx.strokeStyle = palette.metal; ctx.lineWidth = 20; ctx.beginPath(); ctx.arc(685, 290, 95, 0, TAU); ctx.stroke();
        for (let i = 0; i < 6; i++) { const ang = i / 6 * TAU; line(ctx, 685, 290, 685 + Math.cos(ang) * 82, 290 + Math.sin(ang) * 82, palette.metalDark, 8); }
        ['p','V','T'].forEach((v,i)=>{ fillRound(ctx, 100 + i*125, 190, 90, 90, 17, [palette.accent,palette.cyan,palette.orange][i], palette.foam, 2); text(ctx,v,145+i*125,246,30,'#fff',800,'center'); });
        fillRound(ctx, handle.x - 42, handle.y - 30, 84, 60, 13, palette.yellow, palette.foam, 2); text(ctx, '=', handle.x, handle.y + 9, 25, palette.ink, 800, 'center');
        break;
      }
      case 'internal-energy': {
        sceneTitle(ctx, 'ICHKI ENERGIYA OMBORI', 'U = Eₖ + Eₚ', palette);
        fillRound(ctx, 290, 105, 430, 350, 30, palette.glass, palette.inkSoft, 4);
        particleField(ctx, 325, 150, 360, 255, 22 + Math.round(B * 28), 1 + A * 7, t, [palette.cyan, palette.pink, palette.yellow], 6);
        gauge(ctx, 810, 195, 60, clamp(A * .7 + B * .3,0,1), palette, 'ICHKI ENERGIYA');
        fillRound(ctx, handle.x - 34, handle.y - 34, 68, 68, 18, palette.accent, palette.foam, 2); text(ctx, 'ΔU', handle.x, handle.y + 7, 18, '#fff', 800, 'center');
        arrow(ctx, 130, 280, 275, 280, palette.orange, 'Q');
        break;
      }
      case 'gas-work': {
        sceneTitle(ctx, 'PORSHEN KRANI', 'A = pΔV', palette);
        const py = clamp(handle.y, 150, 390); engineCylinder(ctx, 300, 110, 360, 330, py, palette);
        particleField(ctx, 330, py + 42, 300, Math.max(60, 380 - py), 25, 1 + A * 5, t, [palette.cyan, palette.pink], 5);
        fillRound(ctx, 405, py - 65, 150, 58, 12, palette.orange, palette.foam, 2); text(ctx, `${Number(state.b).toFixed(1)} kg`, 480, py - 29, 17, '#fff', 800, 'center');
        arrow(ctx, 705, 375, 705, 195, palette.cyan, 'A');
        flame(ctx, 480, 490, .72, palette, t);
        break;
      }
      case 'heat-quantity': {
        sceneTitle(ctx, 'ISSIQLIK YUKLASH DOKI', 'Q = cmΔT', palette);
        fillRound(ctx, 505, 130, 330, 340, 25, palette.machine, palette.inkSoft, 4);
        flame(ctx, 670, 430, .85, palette, t);
        for (let i=0;i<5;i++){fillRound(ctx,95+i*72,360-i*12,58,58,12,[palette.cyan,palette.accent,palette.orange][i%3],palette.foam,2);}
        fillRound(ctx, handle.x - 38, handle.y - 38, 76, 76, 14, palette.pink, palette.foam, 2); text(ctx, 'm', handle.x, handle.y + 7, 22, '#fff', 800, 'center');
        gauge(ctx, 670, 235, 68, clamp(A*.45+B*.55,0,1), palette, 'Q');
        break;
      }
      case 'heat-problem': {
        sceneTitle(ctx, 'ISSIQLIK FORMULALARI YO‘LI', 'Hisoblash poygasi', palette);
        line(ctx, 110, 360, 850, 360, palette.inkSoft, 18);
        ['m','c','ΔT','Q'].forEach((v,i)=>{fillRound(ctx,210+i*170,220-(i%2)*45,90,90,18,[palette.cyan,palette.accent,palette.orange,palette.green][i],palette.foam,2);text(ctx,v,255+i*170,276-(i%2)*45,24,'#fff',800,'center');arrow(ctx,300+i*170,270-(i%2)*20,350+i*170,270-(i%2)*20,palette.yellow);});
        fillRound(ctx, handle.x - 34, handle.y - 34, 68, 68, 16, palette.yellow, palette.foam, 2); text(ctx, 'Q', handle.x, handle.y + 8, 24, palette.ink, 800, 'center');
        break;
      }
      case 'thermal-balance': {
        sceneTitle(ctx, 'ISSIQ–SOVUQ MUVOZANATI', 'Qberilgan = Qolingan', palette);
        vessel(ctx, 105, 200, 280, 260, palette.orangeSoft, palette, .68); vessel(ctx, 575, 200, 280, 260, palette.water, palette, .68);
        text(ctx, `${Math.round(state.a)}°`, 245, 350, 28, palette.orange, 800, 'center'); text(ctx, `${Math.round(state.b)}°`, 715, 350, 28, palette.cyan, 800, 'center');
        fillRound(ctx, handle.x - 48, handle.y - 42, 96, 84, 18, palette.orange, palette.foam, 3); text(ctx, 'ISSIQ', handle.x, handle.y + 6, 13, '#fff', 800, 'center');
        arrow(ctx, 420, 330, 540, 330, palette.yellow, 'Q');
        break;
      }
      case 'specific-heat': {
        sceneTitle(ctx, 'MATERIALLAR KALORIMETRI', 'c = Q / mΔT', palette);
        fillRound(ctx, 330, 135, 380, 330, 32, palette.machine, palette.inkSoft, 4); vessel(ctx, 375, 205, 290, 220, palette.water, palette, .72);
        ctx.strokeStyle=palette.ink;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(610,160);ctx.lineTo(610,360);ctx.stroke();ctx.fillStyle=palette.orange;ctx.fillRect(605,250-A*80,10,110+A*80);ctx.beginPath();ctx.arc(610,375,24,0,TAU);ctx.fill();
        fillRound(ctx,handle.x-38,handle.y-38,76,76,16,palette.metal,palette.foam,2);text(ctx,'Cu',handle.x,handle.y+7,19,palette.metalDark,800,'center');
        pill(ctx, 'KALORIMETR', 735, 185, palette, palette.cyan);
        break;
      }
      case 'fuel': {
        sceneTitle(ctx, 'YOQILG‘I ENERGIYA STANSIYASI', 'Q = qm', palette);
        vessel(ctx, 390, 110, 300, 270, palette.water, palette, .7); flame(ctx, 540, 440, .9 + pulse*.25, palette, t);
        fillRound(ctx, 760, 135, 120, 290, 18, palette.machine, palette.inkSoft, 3); gauge(ctx,820,245,42,1-B,palette,'FIK');
        fillRound(ctx,handle.x-36,handle.y-28,72,56,11,palette.orange,palette.foam,2);text(ctx,'FUEL',handle.x,handle.y+6,13,'#fff',800,'center');
        for(let i=0;i<5;i++)arrow(ctx,150,150+i*55,320,150+i*55,[palette.cyan,palette.orange,palette.pink][i%3],i===2?'ENERGIYA':'',3);
        break;
      }
      case 'first-law': {
        sceneTitle(ctx, 'ENERGIYA PORTI', 'Q = ΔU + A', palette);
        fillRound(ctx,340,145,280,270,28,palette.machine,palette.inkSoft,4);text(ctx,'ΔU',480,295,50,palette.cyan,800,'center');
        arrow(ctx,90,280,325,280,palette.orange,`Q ${Math.round(state.a)} J`,7);arrow(ctx,635,220,855,130,palette.pink,`A ${Math.round(state.b)} J`,7);arrow(ctx,635,340,855,430,palette.cyan,'ICHKI',7);
        ctx.fillStyle=palette.yellow;ctx.beginPath();ctx.arc(handle.x,handle.y,25,0,TAU);ctx.fill();
        break;
      }
      case 'energy-ledger': {
        sceneTitle(ctx, 'ENERGIYA BUXGALTERIYASI', 'Q − A = ΔU', palette);
        fillRound(ctx,90,135,780,320,24,palette.panel,palette.panelBorder,3);
        ['Q','A','ΔU'].forEach((v,i)=>{fillRound(ctx,150+i*240,205,180,135,22,[palette.orangeSoft,palette.pinkSoft,palette.cyanSoft][i],palette.panelBorder,2);text(ctx,v,240+i*240,265,34,[palette.orange,palette.pink,palette.cyan][i],800,'center');text(ctx,i===0?`${Math.round(state.a)} J`:i===1?`${Math.round(state.b)} J`:`${Math.round(state.a-state.b)} J`,240+i*240,310,17,palette.ink,800,'center');});
        fillRound(ctx,handle.x-40,handle.y-28,80,56,12,palette.yellow,palette.foam,2);text(ctx,'✓',handle.x,handle.y+9,26,palette.ink,800,'center');
        break;
      }
      case 'entropy': {
        sceneTitle(ctx, 'ENTROPIYA XONASI', 'Vaqt yo‘nalishi', palette);
        fillRound(ctx,90,120,780,340,28,palette.glass,palette.inkSoft,4);line(ctx,handle.x,135,handle.x,445,palette.metal,12);
        for(let i=0;i<38;i++){const left=i<19&&B<.75;const x=left?130+(i%5)*55:130+((i*83+t*80)%690);const y=170+((i*47+Math.sin(t+i)*25)%230);ctx.fillStyle=i%2?palette.cyan:palette.pink;ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();}
        pill(ctx,`ENTROPIYA ${Math.round(B*100)}%`,650,80,palette,palette.pink);
        break;
      }
      case 'water-mixing': {
        sceneTitle(ctx, 'SUV ARALASHTIRISH TERMINALI', 'Issiqlik balansi', palette);
        vessel(ctx,90,170,270,260,palette.orangeSoft,palette,.72);vessel(ctx,600,170,270,260,palette.water,palette,.72);vessel(ctx,390,300,180,180,palette.cyanSoft,palette,.5);
        line(ctx,360,300,430,340,palette.orange,18);line(ctx,600,300,530,340,palette.cyan,18);fillRound(ctx,handle.x-27,handle.y-27,54,54,12,palette.accent,palette.foam,2);text(ctx,'V',handle.x,handle.y+7,18,'#fff',800,'center');
        text(ctx,`${Math.round(state.a)}°`,225,470,17,palette.orange,800,'center');text(ctx,`${Math.round(state.b)}°`,735,470,17,palette.cyan,800,'center');
        break;
      }
      case 'four-stroke': {
        sceneTitle(ctx, '4 TAKTLI DVIGATEL', 'Kirish • siqish • yonish • chiqarish', palette);
        const py=155+Math.sin(t*(1+B*5)+state.actions)*115;engineCylinder(ctx,250,90,330,330,py,palette);flame(ctx,415,120,.5+pulse*.45,palette,t);
        ctx.strokeStyle=palette.cyan;ctx.lineWidth=18;ctx.beginPath();ctx.arc(700,360,86,0,TAU);ctx.stroke();line(ctx,415,py+28,700,360,palette.metalDark,14);
        ctx.fillStyle=palette.orange;ctx.beginPath();ctx.arc(handle.x,handle.y,28,0,TAU);ctx.fill();
        ['KIRISH','SIQISH','YONISH','CHIQISH'].forEach((v,i)=>pill(ctx,v,100+i*205,485,palette,i===Math.floor((t*(1+B*3))%4)?palette.orange:palette.muted));
        break;
      }
      case 'heat-engine': {
        sceneTitle(ctx, 'ISSIQLIK DVIGATELI SIKLI', 'Q₁ → A + Q₂', palette);
        fillRound(ctx,80,160,200,220,22,palette.orangeSoft,palette.orange,3);fillRound(ctx,680,160,200,220,22,palette.cyanSoft,palette.cyan,3);text(ctx,'ISITGICH',180,275,18,palette.orange,800,'center');text(ctx,'SOVITGICH',780,275,18,palette.cyan,800,'center');
        ctx.strokeStyle=palette.accent;ctx.lineWidth=20;ctx.beginPath();ctx.arc(480,270,100,0,TAU);ctx.stroke();ctx.fillStyle=palette.yellow;ctx.beginPath();ctx.arc(handle.x,handle.y,28,0,TAU);ctx.fill();
        arrow(ctx,285,230,370,230,palette.orange,'Q₁');arrow(ctx,590,310,675,310,palette.cyan,'Q₂');arrow(ctx,480,155,480,90,palette.pink,'A');
        break;
      }
      case 'efficiency': {
        sceneTitle(ctx, 'FIK POYGASI', 'η = (Q₁ − Q₂) / Q₁', palette);
        fillRound(ctx,85,175,790,250,45,palette.machine,palette.inkSoft,4);line(ctx,130,300,830,300,palette.foam,6,[22,18]);
        const carX=140+A*300+(1-B)*260+Math.sin(t*3)*5;fillRound(ctx,carX-55,260,110,50,16,palette.accent,palette.foam,2);ctx.fillStyle=palette.metalDark;ctx.beginPath();ctx.arc(carX-32,318,17,0,TAU);ctx.arc(carX+32,318,17,0,TAU);ctx.fill();
        line(ctx,handle.x,205,handle.x,390,palette.orange,6);text(ctx,'FINISH',handle.x,412,12,palette.orange,800,'center');
        pill(ctx,`FIK ${Math.round((1-Number(state.b)/Number(state.a))*100)}%`,680,105,palette,palette.green);
        break;
      }
      case 'eco-engine': {
        sceneTitle(ctx, 'TOZA MOTOR SHAHRI', 'Quvvat + toza havo', palette);
        for(let i=0;i<6;i++){fillRound(ctx,70+i*115,315-(i%3)*55,90,180+(i%3)*55,8,[palette.blueSoft,palette.accentSoft,palette.cyanSoft][i%3],palette.inkSoft,2);for(let j=0;j<3;j++)for(let k=0;k<3;k++){ctx.fillStyle=palette.yellow;ctx.fillRect(85+i*115+k*23,340-(i%3)*55+j*35,10,16);}}
        fillRound(ctx,720,250,120,180,18,palette.machine,palette.inkSoft,3);for(let i=0;i<10;i++){ctx.globalAlpha=.5-B*.4;ctx.fillStyle=palette.muted;ctx.beginPath();ctx.arc(780+Math.sin(i)*35,220-i*14,14+i*2,0,TAU);ctx.fill();}ctx.globalAlpha=1;
        fillRound(ctx,handle.x-38,handle.y-38,76,76,18,palette.cyan,palette.foam,2);text(ctx,'FILTER',handle.x,handle.y+5,11,'#fff',800,'center');
        break;
      }
      case 'eco-optimizer': {
        sceneTitle(ctx, 'ENERGIYA–EKOLOGIYA MUVOZANATI', 'Yashil strategiya', palette);
        ctx.fillStyle=palette.blue;ctx.beginPath();ctx.arc(480,285,145,0,TAU);ctx.fill();ctx.fillStyle=palette.green;ctx.beginPath();ctx.ellipse(440,240,90,45,-.5,0,TAU);ctx.ellipse(535,340,75,38,.3,0,TAU);ctx.fill();
        gauge(ctx,190,260,78,A,palette,'FIK');gauge(ctx,770,260,78,1-B,palette,'TOZALIK');
        line(ctx,150,470,810,470,palette.inkSoft,12);ctx.fillStyle=palette.yellow;ctx.beginPath();ctx.arc(handle.x,470,25,0,TAU);ctx.fill();text(ctx,'BALANS',480,525,14,palette.ink,800,'center');
        break;
      }
      case 'surface': {
        sceneTitle(ctx, 'SIRT TARANGLIK KO‘LI', 'Suvning elastik pardasi', palette);
        const surfaceY=300;ctx.fillStyle=palette.waterDeep;ctx.fillRect(80,surfaceY,800,190);ctx.strokeStyle=palette.foam;ctx.lineWidth=6;ctx.beginPath();for(let x=80;x<=880;x+=8)ctx.lineTo(x,surfaceY+Math.sin(x/28+t*2)*6);ctx.stroke();
        ctx.fillStyle=palette.metalDark;ctx.save();ctx.translate(handle.x,handle.y);ctx.rotate(.18);fillRound(ctx,-65,-5,130,10,5,palette.metalDark,palette.foam,2);ctx.restore();
        for(let i=0;i<12;i++){const x=120+i*65;ctx.fillStyle=palette.cyan;ctx.beginPath();ctx.arc(x,surfaceY+Math.sin(i)*4,7,0,TAU);ctx.fill();line(ctx,x,surfaceY-3,x,surfaceY+25,palette.cyan,2);}
        pill(ctx,`σ ${Math.round(state.a)} mN/m`,680,115,palette,palette.cyan);
        break;
      }
      case 'capillary': {
        sceneTitle(ctx, 'KAPILLYAR BOG‘', 'h ∼ 1 / r', palette);
        ctx.fillStyle=palette.waterDeep;ctx.fillRect(70,390,820,110);line(ctx,70,390,890,390,palette.foam,5);
        [210,380,550,720].forEach((x,i)=>{const width=18+i*13;const height=200-i*40+A*40;ctx.strokeStyle=palette.inkSoft;ctx.lineWidth=4;ctx.strokeRect(x-width/2,120,width,270);ctx.fillStyle=palette.cyan;ctx.fillRect(x-width/2+4,390-height,width-8,height);ctx.fillStyle=palette.green;ctx.beginPath();ctx.arc(x,95,28,0,TAU);ctx.fill();});
        ctx.fillStyle=palette.glass;fillRound(ctx,handle.x-12,handle.y-100,24,200,8,palette.glass,palette.cyan,3);
        break;
      }
      case 'hydrostatic': {
        sceneTitle(ctx, 'GIDROSTATIK TO‘G‘ON', 'p = ρgh', palette);
        ctx.fillStyle=palette.waterDeep;ctx.fillRect(70,160,650,340);line(ctx,70,160,720,160,palette.foam,5);ctx.fillStyle=palette.machine;ctx.beginPath();ctx.moveTo(720,110);ctx.lineTo(870,500);ctx.lineTo(720,500);ctx.closePath();ctx.fill();
        for(let y=220;y<470;y+=55)arrow(ctx,700,y,700+(y-150)*.33,y,palette.pink,`${Math.round((y-150)*Number(state.a)*.01)} Pa`,3);
        fillRound(ctx,handle.x-28,handle.y-20,56,40,12,palette.yellow,palette.foam,2);text(ctx,'P',handle.x,handle.y+6,18,palette.ink,800,'center');
        gauge(ctx,190,115,48,clamp((handle.y-160)/340,0,1),palette,'CHUQURLIK');
        break;
      }
      case 'drop-counter': {
        sceneTitle(ctx, 'TOMCHI TAROZISI', 'F = σl', palette);
        fillRound(ctx,370,95,220,90,20,palette.machine,palette.inkSoft,3);line(ctx,480,185,480,300,palette.glass,24);ctx.fillStyle=palette.cyan;ctx.beginPath();ctx.ellipse(480,handle.y,18,28,0,0,TAU);ctx.fill();
        fillRound(ctx,290,400,380,70,22,palette.metal,palette.inkSoft,3);gauge(ctx,780,235,65,clamp(state.actions/5,0,1),palette,'TOMCHI SONI');
        for(let i=0;i<Math.min(6,state.actions);i++){ctx.fillStyle=palette.cyan;ctx.beginPath();ctx.arc(390+i*36,430,10,0,TAU);ctx.fill();}
        break;
      }
      case 'crystal': {
        sceneTitle(ctx, 'KRISTALL QURUVCHI', 'Tartib va amorflik', palette);
        fillRound(ctx,70,115,390,350,24,palette.panel,palette.panelBorder,3);fillRound(ctx,500,115,390,350,24,palette.panel,palette.panelBorder,3);
        for(let r=0;r<5;r++)for(let c=0;c<5;c++){const x=125+c*66,y=175+r*58;line(ctx,x,y,x+66,y,palette.inkSoft,2);ctx.fillStyle=(r+c)%2?palette.cyan:palette.accent;ctx.beginPath();ctx.arc(x,y,10,0,TAU);ctx.fill();}
        for(let i=0;i<26;i++){ctx.fillStyle=i%2?palette.pink:palette.yellow;ctx.beginPath();ctx.arc(535+(i*73)%315,155+(i*47)%265,10,0,TAU);ctx.fill();}
        ctx.fillStyle=palette.green;ctx.beginPath();ctx.arc(handle.x,handle.y,15,0,TAU);ctx.fill();text(ctx,'KRISTALL',265,500,13,palette.cyan,800,'center');text(ctx,'AMORF',695,500,13,palette.pink,800,'center');
        break;
      }
      case 'stress': {
        sceneTitle(ctx, 'MATERIALLAR SINOV MASHINASI', 'σ = F / S', palette);
        fillRound(ctx,90,150,780,280,24,palette.machine,palette.inkSoft,4);fillRound(ctx,130,205,120,170,18,palette.metalDark,palette.foam,2);fillRound(ctx,handle.x-60,205,120,170,18,palette.metalDark,palette.foam,2);
        const stretch=clamp((handle.x-250)/500,0,1);ctx.fillStyle=palette.orange;ctx.fillRect(250,270,Math.max(30,handle.x-310),38);for(let x=280;x<handle.x-70;x+=35)line(ctx,x,265,x+12,313,palette.yellow,2);
        gauge(ctx,760,105,52,A,palette,'KUCH');pill(ctx,`ε ${(stretch*100).toFixed(1)}%`,115,95,palette,palette.orange);
        break;
      }
      case 'spring': {
        sceneTitle(ctx, 'PRUJINA KATAPULTASI', 'F = kΔl', palette);
        line(ctx,260,75,700,75,palette.ink,9);ctx.strokeStyle=palette.accent;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(480,75);const endY=clamp(handle.y,190,455);for(let i=0;i<16;i++)ctx.lineTo(445+(i%2)*70,100+i*(endY-100)/15);ctx.stroke();
        fillRound(ctx,handle.x-60,endY-30,120,70,16,palette.orange,palette.foam,2);text(ctx,`${Number(state.b).toFixed(1)} kg`,handle.x,endY+13,15,'#fff',800,'center');
        arrow(ctx,650,endY,650,110,palette.cyan,'Fₑ');arrow(ctx,720,110,720,endY,palette.pink,'mg');
        break;
      }
      case 'melting': {
        sceneTitle(ctx, 'KRISTALL ERITISH PECHI', 'Qattiq → suyuq', palette);
        fillRound(ctx,170,130,620,330,28,palette.machine,palette.inkSoft,4);const disorder=A;
        for(let r=0;r<5;r++)for(let c=0;c<8;c++){const jitter=disorder*25;const x=245+c*64+Math.sin(t*3+r+c)*jitter,y=190+r*52+Math.cos(t*2+c)*jitter;ctx.fillStyle=(r+c)%2?palette.cyan:palette.accent;ctx.beginPath();ctx.arc(x,y,11,0,TAU);ctx.fill();}
        flame(ctx,handle.x,handle.y,.8+pulse*.2,palette,t);gauge(ctx,840,230,55,A,palette,'ERISH');
        break;
      }
      case 'latent-heat': {
        sceneTitle(ctx, 'YASHIRIN ISSIQLIK PLATOSI', 'Temperatura vaqtincha o‘zgarmaydi', palette);
        graph(ctx,70,105,820,360,[[.03,.12],[.24,.42],[.48,.42],[.7,.72],[.93,.9]],palette,'Q','T');
        line(ctx,270,300,500,300,palette.orange,9);text(ctx,'ERISH PLATOSI',385,278,13,palette.orange,800,'center');ctx.fillStyle=palette.yellow;ctx.beginPath();ctx.arc(handle.x,handle.y,17,0,TAU);ctx.fill();
        pill(ctx,`${Math.round(state.a)} kJ`,685,485,palette,palette.yellow);
        break;
      }
      case 'evaporation': {
        sceneTitle(ctx, 'BUG‘LANISH SHAMOL TUNNELI', 'Tezlik • sirt • temperatura', palette);
        vessel(ctx,350,295,360,190,palette.water,palette,.75);for(let i=0;i<25;i++){ctx.globalAlpha=.25+A*.6;ctx.fillStyle=palette.cyan;ctx.beginPath();ctx.arc(380+(i*53)%300,270-((i*37+t*(30+A*120))%180),5,0,TAU);ctx.fill();}ctx.globalAlpha=1;
        fillRound(ctx,handle.x-55,handle.y-55,110,110,50,palette.machine,palette.inkSoft,3);for(let i=0;i<4;i++){ctx.save();ctx.translate(handle.x,handle.y);ctx.rotate(t*(2+A*8)+i*Math.PI/2);ctx.fillStyle=palette.cyan;ctx.beginPath();ctx.ellipse(0,-28,12,34,.4,0,TAU);ctx.fill();ctx.restore();}
        for(let i=0;i<5;i++)arrow(ctx,handle.x+65,handle.y-35+i*18,330,handle.y-35+i*18,palette.cyan,'',2);
        break;
      }
      case 'atmosphere': {
        sceneTitle(ctx, 'BULUT FABRIKASI', 'Ko‘tarilish va kondensatsiya', palette);
        ctx.fillStyle=palette.groundTop;ctx.beginPath();ctx.moveTo(0,500);ctx.lineTo(250,300);ctx.lineTo(420,450);ctx.lineTo(620,250);ctx.lineTo(960,500);ctx.closePath();ctx.fill();cloud(ctx,620,145,1.05,palette);cloud(ctx,300,210,.68,palette);
        ctx.fillStyle=palette.cyan;ctx.beginPath();ctx.arc(handle.x,handle.y,27,0,TAU);ctx.fill();arrow(ctx,handle.x,handle.y+45,handle.x,handle.y-70,palette.orange,'KO‘TARILISH');
        for(let i=0;i<18;i++){ctx.fillStyle=palette.blue;ctx.beginPath();ctx.ellipse(545+(i*41)%170,205+(i*29+t*60)%250,5,10,0,0,TAU);ctx.fill();}
        break;
      }
      case 'hygrometer': {
        sceneTitle(ctx, 'PSIXROMETR STANSIYASI', 'Quruq va ho‘l termometr', palette);
        [340,620].forEach((x,i)=>{fillRound(ctx,x-65,115,130,330,25,palette.panel,palette.panelBorder,3);ctx.strokeStyle=palette.ink;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x,170);ctx.lineTo(x,360);ctx.stroke();const val=i?B:A;ctx.strokeStyle=i?palette.cyan:palette.orange;ctx.beginPath();ctx.moveTo(x,360);ctx.lineTo(x,345-val*155);ctx.stroke();ctx.fillStyle=i?palette.cyan:palette.orange;ctx.beginPath();ctx.arc(x,380,27,0,TAU);ctx.fill();text(ctx,i?'HO‘L':'QURUQ',x,480,13,palette.ink,800,'center');});
        vessel(ctx,720,330,130,150,palette.water,palette,.7);line(ctx,handle.x,handle.y,620,360,palette.cyan,7);pill(ctx,`φ ≈ ${Math.round(100-(A-B)*60)}%`,80,190,palette,palette.cyan);
        break;
      }
      case 'dew-point': {
        sceneTitle(ctx, 'SHUDRING NUQTASI OYNASI', 'Birinchi kondensat', palette);
        fillRound(ctx,300,100,360,360,40,palette.metal,palette.foam,5);const drops=Math.round(B*20+pulse*8);for(let i=0;i<drops;i++){ctx.fillStyle=palette.cyan;ctx.beginPath();ctx.ellipse(350+(i*67)%260,150+(i*43)%250,7,12,0,0,TAU);ctx.fill();}
        fillRound(ctx,handle.x-40,handle.y-30,80,60,15,palette.blue,palette.foam,2);text(ctx,'❄',handle.x,handle.y+9,24,'#fff',800,'center');
        gauge(ctx,790,220,65,B,palette,'NAMLIK');pill(ctx,`Tsh ≈ ${Math.round(Number(state.a)-(100-Number(state.b))*.18)}°C`,690,390,palette,palette.cyan);
        break;
      }
      case 'light-speed': {
        sceneTitle(ctx, 'YORUG‘LIK ESTAFETASI', 'c = s / t', palette);
        ctx.fillStyle=palette.yellow;ctx.beginPath();ctx.arc(110,275,36,0,TAU);ctx.fill();fillRound(ctx,790,210,100,130,18,palette.metal,palette.foam,3);
        ctx.strokeStyle=palette.yellow;ctx.lineWidth=7;ctx.setLineDash([24,18]);ctx.lineDashOffset=-t*(70+A*180);ctx.beginPath();ctx.moveTo(150,275);ctx.lineTo(handle.x,handle.y);ctx.lineTo(790,275);ctx.stroke();ctx.setLineDash([]);
        ctx.save();ctx.translate(handle.x,handle.y);ctx.rotate(t*(2+A*12));fillRound(ctx,-10,-70,20,140,7,palette.foam,palette.cyan,3);ctx.restore();
        pill(ctx,'299 792 458 m/s',360,420,palette,palette.yellow);
        break;
      }
      case 'reflection-refraction': {
        sceneTitle(ctx, 'LAZERLI OPTIKA STOLI', 'Qaytish + sinish', palette);
        line(ctx,80,290,880,290,palette.inkSoft,3);line(ctx,480,70,480,500,palette.inkSoft,2,[9,8]);ctx.fillStyle=palette.cyanSoft;ctx.fillRect(80,290,800,210);
        const angle=(10+A*65)*Math.PI/180;line(ctx,480-Math.sin(angle)*340,290-Math.cos(angle)*220,480,290,palette.yellow,7);line(ctx,480,290,480+Math.sin(angle)*300,290-Math.cos(angle)*200,palette.pink,6);const refr=angle/(1.15+B*.65);line(ctx,480,290,480+Math.sin(refr)*250,290+Math.cos(refr)*175,palette.cyan,7);
        fillRound(ctx,handle.x-55,handle.y-35,110,70,12,palette.glass,palette.cyan,3);text(ctx,'SHISHA',handle.x,handle.y+5,12,palette.ink,800,'center');
        break;
      }
      case 'snell-puzzle': {
        sceneTitle(ctx, 'SNELL NISHON MAYDONI', 'n₁sinα = n₂sinβ', palette);
        ctx.fillStyle=palette.cyanSoft;ctx.fillRect(70,280,820,220);line(ctx,70,280,890,280,palette.foam,5);line(ctx,480,80,480,500,palette.inkSoft,2,[8,8]);
        const angle=(8+A*68)*Math.PI/180;line(ctx,480-Math.sin(angle)*330,280-Math.cos(angle)*190,480,280,palette.yellow,7);const refr=angle/(1+B*.8);const ex=480+Math.sin(refr)*280,ey=280+Math.cos(refr)*180;line(ctx,480,280,ex,ey,palette.cyan,7);
        ctx.strokeStyle=palette.pink;ctx.lineWidth=8;ctx.beginPath();ctx.arc(handle.x,handle.y,34,0,TAU);ctx.stroke();text(ctx,'NISHON',handle.x,handle.y+5,10,palette.pink,800,'center');
        break;
      }
      case 'fiber-optic': {
        sceneTitle(ctx, 'OPTIK TOLA TUNNELI', 'To‘la ichki qaytish', palette);
        ctx.strokeStyle=palette.glass;ctx.lineWidth=90;ctx.beginPath();ctx.moveTo(110,400);ctx.bezierCurveTo(300,80,650,500,850,155);ctx.stroke();ctx.strokeStyle=palette.cyan;ctx.lineWidth=6;ctx.setLineDash([20,12]);ctx.lineDashOffset=-t*(60+A*100);ctx.beginPath();ctx.moveTo(110,400);ctx.bezierCurveTo(300,80,650,500,850,155);ctx.stroke();ctx.setLineDash([]);
        fillRound(ctx,handle.x-55,handle.y-30,110,60,14,palette.yellow,palette.foam,2);text(ctx,'LAZER',handle.x,handle.y+6,14,palette.ink,800,'center');
        fillRound(ctx,820,105,80,100,18,palette.machine,palette.foam,3);pill(ctx,'SIGNAL',760,420,palette,palette.cyan);
        break;
      }
      case 'tir-game': {
        sceneTitle(ctx, 'PRIZMA LAZER LABIRINTI', 'Kritik burchak o‘yini', palette);
        const prisms=[[170,150,190,150],[430,300,210,-150],[710,130,150,190]];prisms.forEach(([x,y,w,h])=>{ctx.fillStyle=palette.glass;ctx.strokeStyle=palette.cyan;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w/2,y+h);ctx.closePath();ctx.fill();ctx.stroke();});
        ctx.strokeStyle=palette.yellow;ctx.lineWidth=7;ctx.setLineDash([18,10]);ctx.lineDashOffset=-t*80;ctx.beginPath();ctx.moveTo(90,440);ctx.lineTo(265,225);ctx.lineTo(535,360);ctx.lineTo(785,220);ctx.lineTo(handle.x,handle.y);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle=palette.pink;ctx.beginPath();ctx.arc(handle.x,handle.y,30,0,TAU);ctx.fill();text(ctx,'DET',handle.x,handle.y+5,11,'#fff',800,'center');
        break;
      }
      case 'glass-index': {
        sceneTitle(ctx, 'SHISHA INDEKS SKANERI', 'n = sinα / sinβ', palette);
        ctx.fillStyle=palette.glass;ctx.strokeStyle=palette.cyan;ctx.lineWidth=5;ctx.beginPath();ctx.arc(520,300,190,Math.PI,TAU);ctx.lineTo(330,300);ctx.fill();ctx.stroke();
        for(let deg=0;deg<=180;deg+=15){const ang=Math.PI+deg*Math.PI/180;line(ctx,520+Math.cos(ang)*170,300+Math.sin(ang)*170,520+Math.cos(ang)*190,300+Math.sin(ang)*190,palette.inkSoft,2);}
        const angle=(10+A*60)*Math.PI/180;line(ctx,520-Math.sin(angle)*260,300-Math.cos(angle)*190,520,300,palette.yellow,7);line(ctx,520,300,520+Math.sin(angle/(1+B*.6))*190,300+Math.cos(angle/(1+B*.6))*140,palette.cyan,7);
        ctx.fillStyle=palette.orange;ctx.beginPath();ctx.arc(handle.x,handle.y,19,0,TAU);ctx.fill();
        break;
      }
      case 'lens-types': {
        sceneTitle(ctx, 'LINZA SHAKLLANTIRUVCHI', 'Yig‘uvchi yoki sochuvchi', palette);
        line(ctx,70,300,890,300,palette.inkSoft,3);const convex=Number(state.a)>=0;lens(ctx,handle.x,300,310,40+Math.abs(Number(state.a))*.35,palette,!convex);
        for(let i=0;i<5;i++){const y=180+i*60;line(ctx,80,y,handle.x,y,palette.yellow,4);if(convex)line(ctx,handle.x,y,790,300,palette.cyan,4);else line(ctx,handle.x,y,790,y+(y-300)*.7,palette.cyan,4);}
        ctx.fillStyle=palette.pink;ctx.beginPath();ctx.arc(790,300,12,0,TAU);ctx.fill();pill(ctx,convex?'QAVARIQ':'BOTIQ',700,95,palette,convex?palette.cyan:palette.pink);
        break;
      }
      case 'image-bench': {
        sceneTitle(ctx, 'TASVIR YASASH SKAMEYKASI', 'Buyum • linza • ekran', palette);
        line(ctx,70,360,890,360,palette.inkSoft,5);flame(ctx,170,325,.65,palette,t);lens(ctx,480,290,300,50,palette,false);
        fillRound(ctx,handle.x-10,150,20,260,8,palette.metal,palette.foam,2);
        line(ctx,170,250,480,250,palette.yellow,4);line(ctx,480,250,handle.x,330,palette.cyan,4);line(ctx,170,325,480,325,palette.yellow,4);line(ctx,480,325,handle.x,250,palette.cyan,4);
        if(Math.abs(handle.x-(650+A*120))<60){ctx.globalAlpha=.7;flame(ctx,handle.x,285,.45,palette,t);ctx.globalAlpha=1;}
        break;
      }
      case 'lens-puzzle': {
        sceneTitle(ctx, 'LINZA TASVIR JUMBOQCHASI', 'Kattalashtirishni toping', palette);
        line(ctx,65,360,895,360,palette.inkSoft,4);lens(ctx,500,285,300,48,palette,false);flame(ctx,handle.x,325,.55,palette,t);
        const imageX=700+A*120,imageScale=clamp(B,.2,1);ctx.save();ctx.translate(imageX,325);ctx.scale(1,-1);flame(ctx,0,0,.55+imageScale*.45,palette,t);ctx.restore();
        [[handle.x,255,500,255,imageX,330],[handle.x,325,500,325,imageX,245]].forEach(r=>{line(ctx,r[0],r[1],r[2],r[3],palette.yellow,4);line(ctx,r[2],r[3],r[4],r[5],palette.cyan,4);});
        pill(ctx,`K = ${Number(state.b).toFixed(1)}×`,700,100,palette,palette.pink);
        break;
      }
      case 'optical-power': {
        sceneTitle(ctx, 'DIOPTRIYA USTAXONASI', 'D = 1 / F', palette);
        lens(ctx,430,300,340,45+B*55,palette,false);ctx.fillStyle=palette.machine;ctx.beginPath();ctx.arc(handle.x,handle.y,54,0,TAU);ctx.fill();for(let i=0;i<12;i++){const a=i/12*TAU;line(ctx,handle.x+Math.cos(a)*35,handle.y+Math.sin(a)*35,handle.x+Math.cos(a)*60,handle.y+Math.sin(a)*60,palette.metalDark,4);}
        for(let y=180;y<=420;y+=60){line(ctx,80,y,430,y,palette.yellow,4);line(ctx,430,y,760,300,palette.cyan,4);}ctx.fillStyle=palette.pink;ctx.beginPath();ctx.arc(760,300,12,0,TAU);ctx.fill();
        pill(ctx,`D = ${(1/Number(state.a)).toFixed(1)} dptr`,680,105,palette,palette.cyan);
        break;
      }
      case 'microscope': {
        sceneTitle(ctx, 'MIKROSKOP ICHIGA SAYOHAT', 'Obyektiv × okulyar', palette);
        fillRound(ctx,520,80,120,230,24,palette.machine,palette.inkSoft,4);lens(ctx,580,125,70,28,palette,false);lens(ctx,580,285,65,24,palette,false);line(ctx,580,310,500,420,palette.metalDark,20);fillRound(ctx,390,405,300,30,10,palette.metal,palette.foam,2);
        fillRound(ctx,handle.x-55,handle.y-12,110,24,8,palette.glass,palette.cyan,2);particleField(ctx,handle.x-40,handle.y-8,80,16,7,.2,t,[palette.pink,palette.cyan],3);
        fillRound(ctx,80,130,300,260,22,palette.panel,palette.panelBorder,3);for(let i=0;i<14;i++){ctx.fillStyle=i%2?palette.pink:palette.cyan;ctx.beginPath();ctx.arc(125+(i*73)%210,175+(i*47)%170,8+(i%3)*3,0,TAU);ctx.fill();}pill(ctx,`${Math.round(state.a*state.b)}×`,200,420,palette,palette.cyan);
        break;
      }
      case 'eye': {
        sceneTitle(ctx, 'KO‘Z FOKUS TRENAJYORI', 'Akkomodatsiya', palette);
        ctx.fillStyle=palette.eye;ctx.strokeStyle=palette.inkSoft;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(610,300,260,170,0,0,TAU);ctx.fill();ctx.stroke();lens(ctx,430,300,230,35+B*35,palette,false);ctx.fillStyle=palette.ink;ctx.beginPath();ctx.arc(370,300,32,0,TAU);ctx.fill();
        ctx.strokeStyle=palette.pink;ctx.lineWidth=16;ctx.beginPath();ctx.arc(795,300,126,-1.1,1.1);ctx.stroke();
        for(let y=220;y<=380;y+=80){line(ctx,120,y,430,y,palette.yellow,4);line(ctx,430,y,handle.x,handle.y,palette.cyan,4);}ctx.fillStyle=palette.orange;ctx.beginPath();ctx.arc(handle.x,handle.y,18,0,TAU);ctx.fill();
        break;
      }
      case 'glasses': {
        sceneTitle(ctx, 'KO‘ZOYNAK DIAGNOSTIKASI', 'Fokusni to‘r pardaga qaytaring', palette);
        ctx.fillStyle=palette.eye;ctx.beginPath();ctx.ellipse(680,300,220,150,0,0,TAU);ctx.fill();ctx.strokeStyle=palette.pink;ctx.lineWidth=13;ctx.beginPath();ctx.arc(835,300,105,-1.1,1.1);ctx.stroke();
        lens(ctx,handle.x,300,260,35+Math.abs(Number(state.b))*8,palette,Number(state.b)<0);for(let y=220;y<=380;y+=80){line(ctx,80,y,handle.x,y,palette.yellow,4);line(ctx,handle.x,y,835,300+(y-300)*.12,palette.cyan,4);}
        pill(ctx,`${Number(state.b)>0?'+':''}${Number(state.b).toFixed(1)} dptr`,680,100,palette,Number(state.b)>0?palette.cyan:palette.pink);
        break;
      }
      case 'solar': {
        sceneTitle(ctx, 'QUYOSH IZLOVCHI STANSIYA', 'O‘zbekiston geliotexnikasi', palette);
        ctx.fillStyle=palette.groundTop;ctx.beginPath();ctx.moveTo(0,430);ctx.lineTo(220,280);ctx.lineTo(410,430);ctx.lineTo(680,250);ctx.lineTo(960,430);ctx.lineTo(960,560);ctx.lineTo(0,560);ctx.closePath();ctx.fill();
        ctx.fillStyle=palette.yellow;ctx.beginPath();ctx.arc(handle.x,handle.y,45,0,TAU);ctx.fill();for(let i=0;i<10;i++){const a=i/10*TAU;line(ctx,handle.x+Math.cos(a)*55,handle.y+Math.sin(a)*55,handle.x+Math.cos(a)*75,handle.y+Math.sin(a)*75,palette.yellow,4);}
        ctx.save();ctx.translate(620,395);ctx.rotate(-Number(state.a)*Math.PI/180);fillRound(ctx,-150,-85,300,170,10,palette.solar,palette.foam,3);for(let x=-120;x<150;x+=48)line(ctx,x,-80,x,80,palette.cyanSoft,2);for(let y=-50;y<80;y+=42)line(ctx,-145,y,145,y,palette.cyanSoft,2);ctx.restore();
        const energy=Math.round((1-B)*Math.max(0,Math.sin(Number(state.a)*Math.PI/180))*100);pill(ctx,`QUVVAT ${energy}%`,715,470,palette,palette.green);
        break;
      }
      case 'unified': {
        sceneTitle(ctx, 'TO‘RT KUCH OBSERVATORIYASI', 'Fundamental ta’sirlar', palette);
        const centers=[[240,210,palette.blue,'GRAVITATSIYA'],[720,210,palette.yellow,'ELEKTROMAGNIT'],[240,410,palette.pink,'KUCHLI'],[720,410,palette.cyan,'KUCHSIZ']];
        centers.forEach(([x,y,c,label],i)=>{ctx.strokeStyle=c;ctx.lineWidth=5+i*2;ctx.beginPath();ctx.arc(x,y,55+i%2*12,0,TAU);ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,15,0,TAU);ctx.fill();text(ctx,label,x,y+95,11,palette.ink,800,'center');line(ctx,x,y,handle.x,handle.y,c,2,[7,7]);});
        ctx.fillStyle=palette.foam;ctx.beginPath();ctx.arc(handle.x,handle.y,23,0,TAU);ctx.fill();ctx.fillStyle=palette.accent;ctx.beginPath();ctx.arc(handle.x,handle.y,10,0,TAU);ctx.fill();
        break;
      }
      case 'innovation': {
        sceneTitle(ctx, 'O‘ZBEKISTON FIZIKA KELAJAGI', 'Ilmiy prototip', palette);
        fillRound(ctx,300,120,360,330,38,palette.machine,palette.inkSoft,4);ctx.strokeStyle=palette.accent;ctx.lineWidth=18;ctx.beginPath();ctx.arc(480,285,100,0,TAU);ctx.stroke();ctx.strokeStyle=palette.cyan;ctx.lineWidth=12;ctx.beginPath();ctx.arc(480,285,65,t,t+Math.PI*1.5);ctx.stroke();
        ['QUYOSH','OPTIKA','MATERIAL'].forEach((v,i)=>{fillRound(ctx,65,155+i*115,170,70,16,[palette.yellow,palette.cyan,palette.pink][i],palette.foam,2);text(ctx,v,150,198+i*115,12,i===0?palette.ink:'#fff',800,'center');arrow(ctx,245,190+i*115,295,245+i*25,[palette.yellow,palette.cyan,palette.pink][i]);});
        fillRound(ctx,handle.x-42,handle.y-42,84,84,20,palette.green,palette.foam,3);text(ctx,'IDROK',handle.x,handle.y+6,12,'#fff',800,'center');gauge(ctx,800,245,60,(A+B)/2,palette,'TAYYORLIK');
        break;
      }
      default: {
        sceneTitle(ctx, 'IDROK FIZIKA LABI', lab.title, palette);
        fillRound(ctx,170,120,620,340,32,palette.machine,palette.inkSoft,4);
        ctx.strokeStyle=palette.accent;ctx.lineWidth=22;ctx.beginPath();ctx.arc(420,290,105,0,TAU);ctx.stroke();ctx.strokeStyle=palette.cyan;ctx.beginPath();ctx.arc(570,290,70,t,t+Math.PI*1.5);ctx.stroke();
        fillRound(ctx,handle.x-35,handle.y-35,70,70,17,palette.orange,palette.foam,2);
      }
    }
  }

  function drawViewOverlay(ctx, lab, state, palette, handle) {
    if (state.view === 'vectors') {
      ctx.save();
      ctx.globalAlpha = .92;
      arrow(ctx, handle.x, handle.y, handle.x, handle.y - 95, palette.cyan, 'F₁', 5);
      arrow(ctx, handle.x, handle.y, handle.x, handle.y + 95, palette.pink, 'F₂', 5);
      arrow(ctx, handle.x, handle.y, handle.x + 92, handle.y, palette.orange, 'NATIJA', 5);
      ctx.restore();
    } else if (state.view === 'graph') {
      const A = norm(lab.controls.a, state.a);
      const B = norm(lab.controls.b, state.b);
      ctx.save(); ctx.globalAlpha = .94;
      graph(ctx, 585, 335, 340, 195, Array.from({length: 18}, (_, i) => { const x = i / 17; return [x, clamp(.12 + x * (.25 + A * .55) + Math.sin(x * 8 + B * 4) * .04, .05, .94)]; }), palette, lab.controls.a.label, 'natija');
      ctx.restore();
    }
  }

  function drawLabScene(ctx, lab, state, time) {
    const dark = document.body.classList.contains('dark');
    const chapter = Number(lab.chapter) || 0;
    const palettes = [
      ['#ebf7ff','#c9ebff','#5fbc7a','#2f805e'],
      ['#fff0e6','#ffd9c7','#9cc96a','#4f8b55'],
      ['#fff4cf','#ffd9a3','#90c76e','#4c8354'],
      ['#ddf9f7','#a9e6e2','#84c26d','#3d7f58'],
      ['#e8e9ff','#b9c2ff','#536489','#28355e'],
      ['#111b39','#182b59','#26385f','#121e3e'],
    ];
    const p = palettes[chapter] || palettes[0];
    const palette = dark ? {
      skyTop: '#101a35', skyBottom: '#16244a', groundTop: '#24385a', groundBottom: '#14233d', glow: '#ffe58a', star: '#fff7ca', cloud: '#52617d',
      ink: '#f3f6ff', inkSoft: '#8c9bbc', muted: '#aeb8d0', panel: '#17233e', panelBorder: '#344463', labelBg: 'rgba(17,27,52,.88)', labelBorder: '#435270',
      glass: 'rgba(120,190,235,.18)', machine: '#263753', metal: '#bcc9dc', metalDark: '#52647d', foam: '#f3f8ff', eye: '#e9c7a6', solar: '#243e86',
      water: '#35bfcf', waterSoft: 'rgba(53,191,207,.34)', waterDeep: '#167f9b', accent: '#7d6ff6', accentSoft: 'rgba(125,111,246,.24)',
      cyan: '#2ed4c7', cyanSoft: 'rgba(46,212,199,.24)', blue: '#4a9df1', blueSoft: 'rgba(74,157,241,.25)', pink: '#f263a9', pinkSoft: 'rgba(242,99,169,.23)',
      orange: '#ff8c63', orangeSoft: 'rgba(255,140,99,.25)', yellow: '#ffd35e', green: '#49d69b',
    } : {
      skyTop: p[0], skyBottom: p[1], groundTop: p[2], groundBottom: p[3], glow: '#ffd35e', star: '#fff9da', cloud: '#eef6ff',
      ink: '#17213d', inkSoft: '#60708e', muted: '#66708a', panel: 'rgba(255,255,255,.88)', panelBorder: 'rgba(55,77,113,.18)', labelBg: 'rgba(255,255,255,.9)', labelBorder: 'rgba(55,77,113,.2)',
      glass: 'rgba(231,248,255,.6)', machine: '#dfe7ef', metal: '#c8d4df', metalDark: '#56677d', foam: '#ffffff', eye: '#f4d1ae', solar: '#3155a7',
      water: '#39c5d2', waterSoft: 'rgba(65,207,219,.35)', waterDeep: '#1688a3', accent: '#6d5df2', accentSoft: 'rgba(109,93,242,.18)',
      cyan: '#1ccbc1', cyanSoft: 'rgba(28,203,193,.2)', blue: '#2d8df4', blueSoft: 'rgba(45,141,244,.2)', pink: '#ea4f9a', pinkSoft: 'rgba(234,79,154,.18)',
      orange: '#ff7657', orangeSoft: 'rgba(255,118,87,.2)', yellow: '#f6c54f', green: '#12a77e',
    };

    ctx.clearRect(0, 0, 960, 560);
    backdrop(ctx, palette, chapter, time);
    const handle = getHandle(lab, state);
    drawSceneBody(ctx, lab, state, time, palette, handle);
    drawViewOverlay(ctx, lab, state, palette, handle);
    drawHandle(ctx, handle, lab, state, palette);
    if (state.pulse > 0) {
      ctx.save(); ctx.globalAlpha = state.pulse * .5; ctx.strokeStyle = palette.yellow; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(handle.x, handle.y, 38 + (1 - state.pulse) * 95, 0, TAU); ctx.stroke(); ctx.restore();
    }
    return handle;
  }

  window.LabScenes = {drawLabScene, getHandle};
})();

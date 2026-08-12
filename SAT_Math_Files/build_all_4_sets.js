const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputDir = __dirname;
const bgPath = path.join(outputDir, 'sat_background.png').replace(/\\/g, '/');

// Import questions data
const setData = require('./sat_data.js');

function renderMath(str) {
  // Simple LaTeX string wrapper
  return str;
}

function generateSetHTML(setInfo) {
  const { setNum, questions, answers } = setInfo;

  // Split questions across 3 pages (Page 1: 1-7, Page 2: 8-14, Page 3: 15-20), Page 4: Solutions
  const page1Qs = questions.slice(0, 7);
  const page2Qs = questions.slice(7, 14);
  const page3Qs = questions.slice(14, 20);

  const renderCard = (q, idx) => `
    <div class="question-card">
      <div class="q-header">
        <span class="q-number">SAVOL ${idx + 1}</span>
        <span class="q-domain">${q.domain}</span>
      </div>
      <div class="q-text">${q.text}</div>
      <div class="options-grid">
        <div class="option-item"><strong>A)</strong> ${q.options.A}</div>
        <div class="option-item"><strong>B)</strong> ${q.options.B}</div>
        <div class="option-item"><strong>C)</strong> ${q.options.C}</div>
        <div class="option-item"><strong>D)</strong> ${q.options.D}</div>
      </div>
    </div>
  `;

  const page1Html = page1Qs.map((q, i) => renderCard(q, i)).join('\n');
  const page2Html = page2Qs.map((q, i) => renderCard(q, i + 7)).join('\n');
  const page3Html = page3Qs.map((q, i) => renderCard(q, i + 14)).join('\n');

  // Solutions split into two pages if needed (Page 4: 1-10, Page 5: 11-20)
  const solPage1 = answers.slice(0, 10);
  const solPage2 = answers.slice(10, 20);

  const renderSol = (ans, idx) => `
    <div class="solution-card">
      <div class="sol-header">
        <span class="sol-num">Savol ${idx + 1}: To'g'ri javob <mark class="correct-badge">${ans.correct}</mark></span>
      </div>
      <div class="sol-text">${ans.explanation}</div>
    </div>
  `;

  const sol1Html = solPage1.map((ans, i) => renderSol(ans, i)).join('\n');
  const sol2Html = solPage2.map((ans, i) => renderSol(ans, i + 10)).join('\n');

  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>SAT Math Hard Set ${setNum}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true},{left: '$', right: '$', display: false}]});"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #e2e8f0;
      color: #0f172a;
    }
    .pdf-page {
      position: relative;
      width: 210mm;
      height: 297mm;
      margin: 0 auto 10px auto;
      background-color: #ffffff;
      overflow: hidden;
      page-break-after: always;
      page-break-inside: avoid;
    }
    .bg-layer {
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: -5px;
      right: -5px;
      background-image: url('file:///${bgPath}');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 0;
      opacity: 0.95;
    }
    .content-wrap {
      position: relative;
      z-index: 1;
      padding: 16mm 16mm 16mm 16mm;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #059669;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.94);
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 12px;
    }
    .header-title {
      font-size: 16px;
      font-weight: 800;
      color: #065f46;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .header-subtitle {
      font-size: 11px;
      font-weight: 700;
      color: #047857;
      background: #ecfdf5;
      padding: 3px 10px;
      border-radius: 12px;
      border: 1px solid #a7f3d0;
    }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      font-weight: 600;
      color: #047857;
      background: rgba(255, 255, 255, 0.92);
      padding: 6px 12px;
      border-radius: 4px;
      border-top: 1px solid #10b981;
    }
    .questions-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-grow: 1;
    }
    .question-card {
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid #cbd5e1;
      border-left: 4px solid #10b981;
      border-radius: 6px;
      padding: 9px 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.02);
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .q-number {
      font-weight: 800;
      color: #047857;
      font-size: 12px;
    }
    .q-domain {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      background: #f1f5f9;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .q-text {
      font-size: 12.5px;
      color: #1e293b;
      margin-bottom: 8px;
      line-height: 1.45;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 10px;
      background: #f8fafc;
      padding: 6px 10px;
      border-radius: 5px;
      border: 1px solid #f1f5f9;
    }
    .option-item {
      font-size: 12px;
      color: #334155;
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #065f46;
      text-align: center;
      margin-bottom: 10px;
      padding: 6px;
      background: rgba(236, 253, 245, 0.96);
      border-radius: 6px;
      border: 1px solid #a7f3d0;
    }
    .solutions-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-grow: 1;
    }
    .solution-card {
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid #a7f3d0;
      border-left: 4px solid #059669;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .sol-header {
      font-weight: 700;
      color: #065f46;
      font-size: 12px;
      margin-bottom: 3px;
    }
    .correct-badge {
      background: #059669;
      color: white;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 800;
    }
    .sol-text {
      font-size: 11.5px;
      color: #1e293b;
      line-height: 1.4;
    }
  </style>
</head>
<body>

  <!-- PAGE 1 -->
  <div class="pdf-page">
    <div class="bg-layer"></div>
    <div class="content-wrap">
      <div class="header-banner">
        <div class="header-title">DIGITAL SAT MATH — HARD LEVEL (SET ${setNum})</div>
        <div class="header-subtitle">SAVOLLAR 1 – 7</div>
      </div>
      <div class="questions-container">
        ${page1Html}
      </div>
      <div class="footer-bar">
        <span>SAT UZBEKISTAN — ADVANCED PRACTICE SERIES</span>
        <span>SAHIFA 1 / 5</span>
      </div>
    </div>
  </div>

  <!-- PAGE 2 -->
  <div class="pdf-page">
    <div class="bg-layer"></div>
    <div class="content-wrap">
      <div class="header-banner">
        <div class="header-title">DIGITAL SAT MATH — HARD LEVEL (SET ${setNum})</div>
        <div class="header-subtitle">SAVOLLAR 8 – 14</div>
      </div>
      <div class="questions-container">
        ${page2Html}
      </div>
      <div class="footer-bar">
        <span>SAT UZBEKISTAN — ADVANCED PRACTICE SERIES</span>
        <span>SAHIFA 2 / 5</span>
      </div>
    </div>
  </div>

  <!-- PAGE 3 -->
  <div class="pdf-page">
    <div class="bg-layer"></div>
    <div class="content-wrap">
      <div class="header-banner">
        <div class="header-title">DIGITAL SAT MATH — HARD LEVEL (SET ${setNum})</div>
        <div class="header-subtitle">SAVOLLAR 15 – 20</div>
      </div>
      <div class="questions-container">
        ${page3Html}
      </div>
      <div class="footer-bar">
        <span>SAT UZBEKISTAN — ADVANCED PRACTICE SERIES</span>
        <span>SAHIFA 3 / 5</span>
      </div>
    </div>
  </div>

  <!-- PAGE 4: SOLUTIONS 1-10 -->
  <div class="pdf-page">
    <div class="bg-layer"></div>
    <div class="content-wrap">
      <div class="header-banner">
        <div class="header-title">JAVOBLAR KALITI VA BATAFSIL YECHIMLAR (SET ${setNum})</div>
        <div class="header-subtitle">SAVOLLAR 1 – 10</div>
      </div>
      <div class="solutions-container">
        ${sol1Html}
      </div>
      <div class="footer-bar">
        <span>SAT UZBEKISTAN — ADVANCED PRACTICE SERIES</span>
        <span>SAHIFA 4 / 5</span>
      </div>
    </div>
  </div>

  <!-- PAGE 5: SOLUTIONS 11-20 -->
  <div class="pdf-page">
    <div class="bg-layer"></div>
    <div class="content-wrap">
      <div class="header-banner">
        <div class="header-title">JAVOBLAR KALITI VA BATAFSIL YECHIMLAR (SET ${setNum})</div>
        <div class="header-subtitle">SAVOLLAR 11 – 20</div>
      </div>
      <div class="solutions-container">
        ${sol2Html}
      </div>
      <div class="footer-bar">
        <span>SAT UZBEKISTAN — ADVANCED PRACTICE SERIES</span>
        <span>SAHIFA 5 / 5</span>
      </div>
    </div>
  </div>

</body>
</html>`;
}

module.exports = { generateSetHTML };

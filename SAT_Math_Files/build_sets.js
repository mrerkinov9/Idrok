const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputDir = path.join(__dirname);
const bgPath = path.join(outputDir, 'sat_background.png').replace(/\\/g, '/');

// Base HTML Template
function generateHTML(title, setNum, questions, answers) {
  const qHtml = questions.map((q, idx) => `
    <div class="question-card">
      <div class="q-header">
        <span class="q-number">SAVOL ${idx + 1}</span>
        <span class="q-domain">${q.domain}</span>
      </div>
      <div class="q-text">${q.text}</div>
      ${q.svg ? `<div class="q-svg">${q.svg}</div>` : ''}
      <div class="options-grid">
        <div class="option-item"><strong>A)</strong> ${q.options.A}</div>
        <div class="option-item"><strong>B)</strong> ${q.options.B}</div>
        <div class="option-item"><strong>C)</strong> ${q.options.C}</div>
        <div class="option-item"><strong>D)</strong> ${q.options.D}</div>
      </div>
    </div>
  `).join('\n');

  const ansHtml = answers.map((ans, idx) => `
    <div class="solution-card">
      <div class="sol-header">
        <span class="sol-num">Savol ${idx + 1}: To'g'ri javob ${ans.correct}</span>
      </div>
      <div class="sol-text">${ans.explanation}</div>
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true},{left: '$', right: '$', display: false}]});"></script>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f9;
      color: #111827;
      font-size: 13.5px;
      line-height: 1.5;
    }
    .page-container {
      position: relative;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background-color: #ffffff;
      overflow: hidden;
      page-break-after: always;
    }
    .bg-layer {
      position: absolute;
      top: -6px;
      bottom: -6px;
      left: -6px;
      right: -6px;
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
      padding: 22mm 18mm 20mm 18mm;
    }
    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #059669;
      padding-bottom: 8px;
      margin-bottom: 18px;
      background: rgba(255, 255, 255, 0.92);
      padding: 10px 14px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .header-title {
      font-size: 18px;
      font-weight: 800;
      color: #065f46;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .header-subtitle {
      font-size: 12px;
      font-weight: 600;
      color: #047857;
      background: #ecfdf5;
      padding: 4px 10px;
      border-radius: 20px;
      border: 1px solid #a7f3d0;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f766e;
      text-align: center;
      margin: 24px 0 16px 0;
      padding: 8px;
      background: rgba(236, 253, 245, 0.95);
      border-radius: 6px;
      border-left: 4px solid #059669;
    }
    .questions-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .question-card {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #e5e7eb;
      border-left: 4px solid #10b981;
      border-radius: 8px;
      padding: 12px 14px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.03);
      page-break-inside: avoid;
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .q-number {
      font-weight: 800;
      color: #047857;
      font-size: 13px;
    }
    .q-domain {
      font-size: 10.5px;
      font-weight: 600;
      color: #6b7280;
      background: #f3f4f6;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .q-text {
      font-size: 13px;
      color: #1f2937;
      margin-bottom: 10px;
      line-height: 1.5;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 12px;
      background: #f9fafb;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #f3f4f6;
    }
    .option-item {
      font-size: 12.5px;
      color: #374151;
    }
    .solution-card {
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid #d1fae5;
      border-left: 4px solid #059669;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .sol-header {
      font-weight: 700;
      color: #065f46;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .sol-text {
      font-size: 12px;
      color: #1f2937;
      line-height: 1.45;
    }
    .q-svg {
      text-align: center;
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="bg-layer"></div>
    <div class="content-wrap">
      <div class="header-banner">
        <div class="header-title">DIGITAL SAT MATH — HARD LEVEL (SET ${setNum})</div>
        <div class="header-subtitle">20 ADVANCED PROBLEMS</div>
      </div>
      
      <div class="questions-grid">
        ${qHtml}
      </div>

      <div class="section-title">JAVOBLAR KALITI VA BATAFSIL YECHIMLAR (SET ${setNum})</div>
      
      <div class="solutions-list">
        ${ansHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

console.log("HTML generator module loaded.");

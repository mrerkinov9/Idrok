const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { set1, set2, set3, set4 } = require('./sat_data.js');
const { generateSetHTML } = require('./build_all_4_sets.js');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sets = [set1, set2, set3, set4];

sets.forEach((setInfo) => {
  const setNum = setInfo.setNum;
  const htmlFilename = `SAT_Math_Hard_Set_${setNum}.html`;
  const pdfFilename = `SAT_Math_Hard_Set_${setNum}.pdf`;

  const htmlPath = path.join(__dirname, htmlFilename);
  const pdfPath = path.join(__dirname, pdfFilename);

  // Generate HTML content
  const htmlContent = generateSetHTML(setInfo);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`Generated HTML: ${htmlFilename}`);

  // Convert HTML to PDF using Edge Headless
  try {
    const cmd = `& "${edgePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-pdf-header-footer "file:///${htmlPath.replace(/\\/g, '/')}"`;
    execSync(`powershell -Command "${cmd}"`, { stdio: 'inherit' });
    console.log(`Successfully compiled PDF: ${pdfFilename}`);
  } catch (err) {
    console.error(`Error compiling PDF for Set ${setNum}:`, err);
  }
});

console.log("All 4 SAT Math Hard Sets generated and compiled to PDF successfully!");

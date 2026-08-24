const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let passed = 0;

function check(condition, message) {
  if (!condition) throw new Error(message);
  passed += 1;
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function luminance(hex) {
  const values = hex.match(/[a-f\d]{2}/gi).map((value) => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const css = read('science-studio.css');

[
  '--ss-canvas: #f5f2ea',
  '--ss-surface: #fffdf8',
  '--ss-ink: #20242b',
  '--ss-primary: #315f8c',
  '--ss-accent: #e66a45',
  '--ss-growth: #4e7a5a',
  '--ss-reward: #d3a243',
  'font-family: Manrope',
  'font-size: 16px',
  'font-size: 14px',
  'font-size: 12px !important',
  'prefers-reduced-motion: reduce',
].forEach((token) => check(css.includes(token), `Science Studio policy missing: ${token}`));

check(!css.includes('#5965f2'), 'Legacy purple action color leaked into Science Studio');
check(!css.includes('#20cdbb'), 'Legacy neon teal leaked into Science Studio');
check(contrast('#20242b', '#fffdf8') >= 4.5, 'Primary text is below WCAG AA');
check(contrast('#687078', '#fffdf8') >= 4.5, 'Muted text is below WCAG AA');
check(contrast('#ffffff', '#315f8c') >= 4.5, 'Primary button is below WCAG AA');

const pages = [
  'index.html',
  'physics7.html',
  'physics8.html',
  'physics.html',
  'physics10.html',
  'physics11.html',
  'labs.html',
  'lab.html',
  'garden.html',
];

for (const file of pages) {
  const html = read(file);
  check(html.includes('science-studio.css?v=1'), `${file} does not load Science Studio`);
  check(/<body class="[^"]*science-studio/.test(html), `${file} does not activate Science Studio`);
}

console.log(`Science Studio checks passed: ${passed}`);

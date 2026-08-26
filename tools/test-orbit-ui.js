const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let passed = 0;
function check(value, message) { if (!value) throw new Error(message); passed += 1; }

const pages = ['index.html','physics7.html','physics8.html','physics.html','physics10.html','physics11.html','labs.html','lab.html','garden.html'];
for (const file of pages) {
  const html = read(file);
  check(html.includes('idrok-orbit.css?v=1'), `${file}: Orbit stylesheet missing`);
  check(/<body class="[^"]*orbit-ui/.test(html), `${file}: orbit-ui body class missing`);
}

const css = read('idrok-orbit.css');
[
  '--orb-ink:#0b0d0c',
  '--orb-paper:#f6f7f2',
  '--orb-lime:#c7ff5e',
  '#courseOverview.hidden{display:none!important}',
  '.module-nav button b',
  'white-space:normal!important',
  '.ai-quick-prompts',
  'overflow-x:auto!important',
  '.lesson-content img',
  'max-width:100%!important',
  '.labs-grid',
  '.simulator-shell',
  '.garden-game-layout',
  'prefers-reduced-motion:reduce',
].forEach(token => check(css.includes(token), `Orbit policy missing: ${token}`));

check(css.length > 35000, 'Orbit stylesheet is not a complete cross-route system');
check(!css.includes('#315f8c'), 'Retired Science Studio primary leaked into Orbit');
check(!css.includes('#e66a45'), 'Retired Science Studio accent leaked into Orbit');
check(!css.includes('#6650e8'), 'Retired purple action color leaked into Orbit');

console.log(`Orbit UI checks passed: ${passed}`);

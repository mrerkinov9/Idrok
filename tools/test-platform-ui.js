const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let passed = 0;
const check = (value, message) => {
  if (!value) throw new Error(message);
  passed += 1;
};

const removedSystems = [
  'idrok-next.css', 'design-system.css', 'science-studio.css', 'studio-v2.css',
  'garden-v2.css', 'idrok-orbit.css', 'idrok-orbit.js', 'legacy-polish.css',
];
for (const file of removedSystems) check(!fs.existsSync(path.join(root, file)), `${file} hali o‘chirilmagan`);

const pages = [
  'index.html', 'physics7.html', 'physics8.html', 'physics.html', 'physics10.html',
  'physics11.html', 'labs.html', 'lab.html', 'garden.html', 'laboratory.html',
  'gas-lab.html', 'boyle-sim.html', 'certificate.html', 'idrok-sim.html', 'admin.html',
];
for (const file of pages) {
  const html = read(file);
  check(html.includes('idrok-platform.css?v=1'), `${file}: yangi UI CSS yo‘q`);
  check(html.includes('idrok-platform.js?v=1'), `${file}: yangi UI runtime yo‘q`);
  check(/<body class="[^"]*idrok-app/.test(html), `${file}: idrok-app klassi yo‘q`);
  for (const old of removedSystems) check(!html.includes(old), `${file}: eski ${old} havolasi qolgan`);
}

const css = read('idrok-platform.css');
[
  '--ui-primary:#3662f4', '--ui-cyan:#1db9c3', ':root[data-theme="dark"]',
  'body.idrok-home .journey-card', 'body.idrok-course .course-hero',
  'body.idrok-labs .labs-hero', 'body.idrok-lab .simulator-shell',
  'body.idrok-garden .garden-game-layout', '@media(max-width:760px)',
  'prefers-reduced-motion:reduce', 'min-height:44px!important',
].forEach((token) => check(css.includes(token), `Yangi UI qoidasi yo‘q: ${token}`));

check(css.length > 50000, 'Yangi yagona UI tizimi yetarlicha to‘liq emas');
check(read('idrok-platform.js').includes('MutationObserver'), 'Theme/accessibility runtime yo‘q');

console.log(`PLATFORM UI TEST: ${passed}/${passed} muvaffaqiyatli`);

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let passed = 0;
const check = (value, message) => {
  if (!value) throw new Error(message);
  passed += 1;
};

const modernPages = ['index.html', 'physics7.html', 'physics8.html', 'physics.html', 'physics10.html', 'physics11.html', 'labs.html', 'lab.html', 'garden.html'];
for (const file of modernPages) {
  const html = read(file);
  check(html.includes('idrok-orbit.css?v=2'), `${file}: Orbit v2 CSS ulanmagan`);
  check(html.includes('idrok-orbit.js?v=2'), `${file}: Orbit v2 guard ulanmagan`);
}

const orbit = read('idrok-orbit.css');
[
  'body.orbit-ui .auth-gateway{position:fixed!important;inset:0!important;z-index:5000!important',
  '@media(max-width:1024px)',
  'body.orbit-ui.idrok-next-home .page-shell',
  'body.orbit-ui.idrok-course .course-shell',
  'body.orbit-ui.idrok-labs .labs-grid{grid-template-columns:1fr!important}',
  'body.orbit-ui.idrok-lab .simulator-shell{display:grid!important;grid-template-columns:1fr!important}',
  'body.orbit-ui.idrok-garden .garden-shell{width:100%!important;margin-left:0!important}',
  'min-width:44px!important;min-height:44px!important',
  'font-size:11px!important',
  'prefers-reduced-motion:reduce',
].forEach((token) => check(orbit.includes(token), `Orbit release qoidasi topilmadi: ${token}`));

const guard = read('idrok-orbit.js');
check(guard.includes("classList.remove('dark')"), 'Legacy dark theme guard yo‘q');
check(guard.includes("aria-label', 'Saytdan qidirish'"), 'Qidiruv accessible label guard yo‘q');
check(guard.includes('MutationObserver'), 'Dinamik kartalar accessibility guard yo‘q');

const legacyPages = ['laboratory.html', 'gas-lab.html', 'boyle-sim.html', 'certificate.html', 'idrok-sim.html'];
for (const file of legacyPages) check(read(file).includes('legacy-polish.css?v=1'), `${file}: legacy polish ulanmagan`);

const legacy = read('legacy-polish.css');
check(legacy.includes('min-height:44px!important'), 'Legacy touch target standarti yo‘q');
check(legacy.includes('@media(max-width:700px)'), 'Legacy mobile breakpoint yo‘q');
check(legacy.includes('font-size:11px!important'), 'Legacy matn standarti yo‘q');

console.log(`VISUAL RELEASE TEST: ${passed}/${passed} muvaffaqiyatli`);

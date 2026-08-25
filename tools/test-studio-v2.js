const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let passed = 0;
function check(value, message) { if (!value) throw new Error(message); passed += 1; }

const home = read('index.html');
const homeCss = read('studio-v2.css');
const garden = read('garden.html');
const gardenCss = read('garden-v2.css');
const gardenJs = read('garden.js');

check(home.includes('studio-v2.css?v=1'), 'Home does not load Studio V2');
check(home.includes('science-studio studio-v2'), 'Home does not activate Studio V2');
check(home.includes('physics-diorama-v1.webp'), 'Physics diorama is missing');
check(home.includes('focus-garden-v1.webp'), 'Garden artwork is missing');
check(fs.existsSync(path.join(root, 'assets/studio/physics-diorama-v1.webp')), 'Physics WebP asset not found');
check(fs.existsSync(path.join(root, 'assets/studio/focus-garden-v1.webp')), 'Garden WebP asset not found');
check(fs.statSync(path.join(root, 'assets/studio/physics-diorama-v1.webp')).size < 500000, 'Physics asset is not optimized');
check(fs.statSync(path.join(root, 'assets/studio/focus-garden-v1.webp')).size < 650000, 'Garden asset is not optimized');
check(/grid-template-columns:\s*minmax\(0,1fr\) 300px/.test(homeCss), 'Dashboard command grid is not constrained');
check(/font-size:\s*clamp\(31px,2\.7vw,40px\)/.test(homeCss), 'Hero typography guard is missing');
check(/--v2-coral:\s*#f06d4f/.test(homeCss), 'Studio V2 palette is missing');

check(garden.includes('garden-v2.css?v=1'), 'Garden does not load its V2 visual layer');
check(garden.includes('garden-v2'), 'Garden does not activate its V2 visual layer');
check(garden.includes('garden.js?v=10'), 'Garden scene cache version was not bumped');
check(/width:\s*220px/.test(gardenCss), 'Garden navigation is still oversized');
check(gardenJs.includes('function addLivingLandscape'), 'Living garden landscape is missing');
check(gardenJs.includes('function addNaturalTree'), 'Natural tree renderer is missing');
check(/new THREE\.Fog\(theme\.fog,82,235\)/.test(gardenJs), 'Garden depth/fog tuning is missing');
check(gardenJs.includes('cameraDistance=THREE.MathUtils.clamp'), 'Garden camera guard is missing');
check(!gardenJs.includes('new THREE.ConeGeometry(13+'), 'Legacy cone mountains are still present');

console.log(`Studio V2 checks passed: ${passed}`);

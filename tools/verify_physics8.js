const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const run = (file, context) => vm.runInContext(read(file), context, {filename:file});
const context = vm.createContext({window:{}});
context.window.window = context.window;

run('assets/physics/physics-content.js', context);
context.window.PHYSICS_COURSE9 = context.window.PHYSICS_COURSE;
run('phet-map.js', context);
context.window.IDROK_PHET9 = context.window.IDROK_PHET;

run('assets/physics8/physics-content.js', context);
context.window.PHYSICS_COURSE8 = context.window.PHYSICS_COURSE;
run('phet-map8.js', context);
run('lab-data8.js', context);

const course8 = context.window.PHYSICS_COURSE8;
const phet8 = context.window.IDROK_PHET8;
const labs8 = context.window.IDROK_LABS8;
assert(course8?.grade === 8, '8-sinf kursi grade=8 emas.');
assert(course8?.chapters?.length === 5, '8-sinf boblari soni 5 emas.');
assert(course8?.lessons?.length === 60, '8-sinf darslari soni 60 emas.');
assert(course8.lessons.every((lesson, index) => lesson.id === `l${index + 1}` && lesson.number === index + 1), '8-sinf dars tartibi buzilgan.');
assert(course8.lessons.every(lesson => lesson.summary.length > 70), 'Qisqa yoki bo‘sh mavzu mazmuni topildi.');
assert(course8.lessons.every(lesson => lesson.theoryBlocks.length >= 5), 'Nazariya bloklari yetarli emas.');
assert(course8.lessons.every(lesson => lesson.problem?.prompt && Number.isFinite(lesson.problem.practice)), 'Masala yoki amaliy javob yetishmaydi.');
assert(course8.lessons.every(lesson => lesson.experiment?.length > 100), 'Tajriba tavsifi yetarli emas.');
assert(course8.lessons.every(lesson => fs.existsSync(path.join(root, lesson.figure))), 'Mavzuga oid SVG chizma yetishmaydi.');
assert(new Set(course8.lessons.map(lesson => lesson.figure)).size === 60, '8-sinf chizmalari takrorlangan.');
assert(course8.lessons.filter(lesson => lesson.video).length >= 40, 'Aniq mos videolar soni 40 tadan kam.');
assert(course8.lessons.filter(lesson => lesson.experimentVideo).length >= 15, 'Tajriba videolari soni 15 tadan kam.');

const allText8 = JSON.stringify(course8);
[
  /\bclcktr\b/i, /\bOtzi\b/, /\bdeh\b/i, /\byclim\b/i, /\bhob\b/i,
  /�/, /â€/, /Ê»/, /placeholder/i, /lorem ipsum/i,
].forEach(pattern => assert(!pattern.test(allText8), `Tushunarsiz/OCR matn topildi: ${pattern}`));

assert(Object.keys(phet8?.lessons || {}).length === 8, '8-sinf uchun 8 ta ishlaydigan o‘zbekcha simulyatsiya kutilgan.');
assert(labs8?.length === 8, '8-sinf laboratoriya kartalari soni 8 emas.');
const simKeys8 = Object.values(phet8.lessons).map(item => item.simulation);
assert(new Set(simKeys8).size === simKeys8.length, '8-sinf simulyatsiyalarida takror bor.');
assert(labs8.every(lab => phet8.lessons[lab.id] && course8.lessons.some(lesson => lesson.id === lab.id)), '8-sinf laboratoriya bog‘lanishi buzilgan.');

run('assets/physics7/physics-content.js', context);
run('assets/physics7/physics-content-fixes.js', context);
run('assets/physics7/physics-content-audit.js', context);
context.window.PHYSICS_COURSE7 = context.window.PHYSICS_COURSE;
run('phet-map7.js', context);
run('phet-map7-audit.js', context);
run('lab-data7.js', context);
const phet7 = context.window.IDROK_PHET7;
const labs7 = context.window.IDROK_LABS7;
const course7 = context.window.PHYSICS_COURSE7;
const simKeys7 = Object.values(phet7.lessons).map(item => item.simulation);
assert(labs7.length === 18, '7-sinf auditdan keyin 18 ta aniq laboratoriya bo‘lishi kerak.');
assert(new Set(simKeys7).size === simKeys7.length, '7-sinf simulyatsiyalarida takror bor.');
assert(course7.lessons.every(lesson => lesson.theoryBlocks?.length === 5), '7-sinf nazariya bloklari toza 5 bosqichga keltirilmagan.');
assert(course7.lessons.every(lesson => lesson.theoryBlocks.every(block => block.text.length < 650)), '7-sinfda xom OCRdan qolgan haddan tashqari uzun matn bor.');
const allText7 = JSON.stringify(course7.lessons.map(lesson => lesson.theoryBlocks));
[/\bki chik\b/i, /\bto‘gri\b/i, /\bbirbiriga\b/i, /ï¿½/, /Ã¢â‚¬/, /placeholder/i].forEach(pattern => {
  assert(!pattern.test(allText7), `7-sinf nazariyasida tushunarsiz/OCR matn topildi: ${pattern}`);
});

for (const htmlName of ['physics8.html','physics7.html','labs.html','lab.html','index.html']) {
  const html = read(htmlName);
  const sources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
  sources.forEach(source => assert(fs.existsSync(path.join(root, source)), `${htmlName}: ${source} topilmadi.`));
}

for (const file of ['app.js','server.js','physics.js','labs.js','phet-engine.js','phet-map8.js','lab-data8.js','certificate.js']) {
  try { new vm.Script(read(file), {filename:file}); }
  catch (error) { errors.push(`${file}: JavaScript sintaksis xatosi - ${error.message}`); }
}

if (errors.length) {
  console.error(errors.map((error, index) => `${index + 1}. ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  grade8:{
    chapters:course8.chapters.length,
    lessons:course8.lessons.length,
    theoryBlocks:course8.lessons.reduce((sum, lesson) => sum + lesson.theoryBlocks.length, 0),
    videos:course8.lessons.filter(lesson => lesson.video).length,
    experimentVideos:course8.lessons.filter(lesson => lesson.experimentVideo).length,
    uniqueFigures:new Set(course8.lessons.map(lesson => lesson.figure)).size,
    uniqueSimulations:new Set(simKeys8).size,
  },
  grade7:{
    lessons:course7.lessons.length,
    cleanTheoryBlocks:course7.lessons.reduce((sum, lesson) => sum + lesson.theoryBlocks.length, 0),
    curatedLabs:labs7.length,
    uniqueSimulations:new Set(simKeys7).size,
  },
}, null, 2));

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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
run('assets/physics11/physics-content.js', context);
context.window.PHYSICS_COURSE11 = context.window.PHYSICS_COURSE;
run('phet-map11.js', context);
run('lab-data11.js', context);

const course = context.window.PHYSICS_COURSE11;
const phet = context.window.IDROK_PHET11;
const labs = context.window.IDROK_LABS11;
const expectedStarts = [4,7,10,13,15,17,26,29,32,35,42,45,48,51,55,57,59,62,65,66,76,79,83,87,91,96,98,103,107,110,115,124,128,135,137,142,151,156,160,164,167,170,173,177,182];

assert(course?.grade === 11, 'Kurs sinfi 11 emas.');
assert(course?.chapters?.length === 7, '11-sinf boblari soni 7 emas.');
assert(course?.lessons?.length === 45, '11-sinf darslari soni 45 emas.');
assert(course.lessons.every((lesson, index) => lesson.id === `l${index + 1}` && lesson.number === index + 1), 'Dars tartibi yoki ID ketma-ketligi buzilgan.');
assert(course.lessons.every((lesson, index) => lesson.pageNumbers?.[0] === expectedStarts[index]), 'Darslikdagi boshlanish sahifalaridan biri noto‘g‘ri.');
assert(course.lessons.every((lesson, index) => index === 44 || lesson.pageNumbers.at(-1) + 1 === expectedStarts[index + 1]), 'Dars sahifalarida bo‘shliq yoki ustma-ust kelish bor.');
assert(course.lessons.every(lesson => lesson.theoryBlocks?.length >= 3), 'Nazariya bloklari yetarli bo‘lmagan dars bor.');
assert(course.lessons.every(lesson => lesson.theoryBlocks[0]?.page === lesson.pageNumbers[0]), 'Dars nazariyasi o‘z boshlanish sahifasidan boshlanmagan.');
assert(course.lessons.every(lesson => lesson.summary?.length >= 75), 'Qisqa yoki bo‘sh mavzu xulosasi bor.');
assert(course.lessons.every(lesson => lesson.problem?.prompt && Number.isFinite(lesson.problem.answer) && Number.isFinite(lesson.problem.practice) && lesson.problem.steps?.length >= 3), 'Mavzuga oid masala to‘liq emas.');
assert(course.lessons.every(lesson => lesson.experiment?.length >= 100 && lesson.experimentQuestion?.length >= 70), 'Tajriba yoki tahlil savoli yetarli emas.');

const figurePaths = course.lessons.map(lesson => path.join(root, lesson.figure));
assert(figurePaths.every(file => fs.existsSync(file)), 'Mavzu rasmlaridan biri topilmadi.');
const figureHashes = figurePaths.map(file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
assert(new Set(figureHashes).size === 45, 'Mavzu rasmlaridan kamida ikkitasi aynan takrorlangan.');

const videos = course.lessons.filter(lesson => lesson.video).map(lesson => lesson.video);
assert(videos.length === 26, 'Tekshirilgan o‘zbekcha videolar soni 26 emas.');
assert(new Set(videos.map(video => video.id)).size === videos.length, 'Videolardan biri takror biriktirilgan.');
assert(videos.every(video => video.verified && /youtube-nocookie\.com\/embed\//.test(video.embed || '')), 'Video embed yoki tekshiruv belgisi noto‘g‘ri.');

const allText = JSON.stringify(course);
[/\uFFFD/, /[\uE000-\uF8FF]/, /Ã¢|ÃŠ|â€|ï¿½/, /placeholder/i, /lorem ipsum/i].forEach(pattern => {
  assert(!pattern.test(allText), `Tushunarsiz yoki vaqtinchalik matn topildi: ${pattern}`);
});

const lessonConfigs = Object.values(phet?.lessons || {});
assert(lessonConfigs.length === 13, '11-sinf uchun 13 ta aniq mos simulyatsiya kutilgan.');
assert(labs?.length === 13, '11-sinf laboratoriya kartalari soni 13 emas.');
assert(new Set(lessonConfigs.map(item => item.simulation)).size === lessonConfigs.length, '11-sinf simulyatsiyalarida takror bor.');
assert(labs.every(lab => phet.lessons[lab.id] && course.lessons.some(lesson => lesson.id === lab.id)), 'Laboratoriya va mavzu bog‘lanishi buzilgan.');

for (const htmlName of ['physics11.html','labs.html','lab.html','index.html','admin.html']) {
  const html = read(htmlName);
  const sources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
  sources.forEach(source => assert(fs.existsSync(path.join(root, source)), `${htmlName}: ${source} topilmadi.`));
}

for (const file of ['app.js','server.js','physics.js','labs.js','phet-engine.js','phet-map11.js','lab-data11.js','certificate.js','admin.js']) {
  try { new vm.Script(read(file), {filename:file}); }
  catch (error) { errors.push(`${file}: JavaScript sintaksis xatosi — ${error.message}`); }
}

if (errors.length) {
  console.error(errors.map((error, index) => `${index + 1}. ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  chapters:course.chapters.length,
  lessons:course.lessons.length,
  theoryBlocks:course.lessons.reduce((sum, lesson) => sum + lesson.theoryBlocks.length, 0),
  uniqueFigures:new Set(figureHashes).size,
  verifiedVideos:videos.length,
  tailoredProblems:course.lessons.filter(lesson => lesson.problem).length,
  uniqueSimulations:new Set(lessonConfigs.map(item => item.simulation)).size,
}, null, 2));

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const run = (file, context) => vm.runInContext(read(file), context, {filename: file});

const context = vm.createContext({window: {}});
run('assets/physics/physics-content.js', context);
context.window.PHYSICS_COURSE9 = context.window.PHYSICS_COURSE;
run('phet-map.js', context);
context.window.IDROK_PHET9 = context.window.IDROK_PHET;
run('assets/physics7/physics-content.js', context);
run('assets/physics7/physics-content-fixes.js', context);
run('assets/physics7/physics-content-audit.js', context);
context.window.PHYSICS_COURSE7 = context.window.PHYSICS_COURSE;
run('phet-map7.js', context);
run('lab-data7.js', context);

const course = context.window.PHYSICS_COURSE7;
const labs = context.window.IDROK_LABS7;
const phet = context.window.IDROK_PHET7;
check(course?.grade === 7, 'Kurs sinfi 7 emas.');
check(course?.chapters?.length === 5, 'Boblar soni 5 emas.');
check(course?.lessons?.length === 62, 'Darslar soni 62 emas.');
check(labs?.length === 38, '7-sinfda aniq mos laboratoriyalar soni 38 emas.');
check(Object.keys(phet?.lessons || {}).length === 38, '7-sinf simulyatsiya mosliklari soni 38 emas.');

const ids = new Set();
const figures = new Set();
for (const [index, lesson] of course.lessons.entries()) {
  const label = lesson.id || `l${index + 1}`;
  check(lesson.id === `l${index + 1}`, `${label}: dars ID yoki tartib xato.`);
  check(!ids.has(lesson.id), `${label}: dars ID takrorlangan.`);
  ids.add(lesson.id);
  check(lesson.number === index + 1, `${label}: dars raqami xato.`);
  check(Number.isInteger(lesson.chapter) && lesson.chapter >= 0 && lesson.chapter < 5, `${label}: bob xato.`);
  check(Array.isArray(lesson.theoryBlocks) && lesson.theoryBlocks.length >= 2, `${label}: nazariya yetarli emas.`);
  check(Array.isArray(lesson.pageNumbers) && lesson.pageNumbers.length >= 1, `${label}: sahifalar yo‘q.`);
  check(typeof lesson.summary === 'string' && lesson.summary.length >= 60, `${label}: xulosa yetarli emas.`);
  check(typeof lesson.formula === 'string' && lesson.formula.length >= 1, `${label}: formula yo‘q.`);
  check(typeof lesson.relationship === 'string' && lesson.relationship.length >= 40, `${label}: asosiy qoida yo‘q.`);
  check(lesson.problem?.steps?.length >= 3 && Number.isFinite(lesson.problem?.practice), `${label}: masala xato.`);
  check(typeof lesson.experiment === 'string' && lesson.experiment.length >= 90, `${label}: mavzuga xos tajriba yetarli emas.`);
  check(fs.existsSync(path.join(root, lesson.figure || '')), `${label}: rasm fayli topilmadi.`);
  check(lesson.figure === `assets/physics7/visuals/lesson-${String(index + 1).padStart(2, '0')}.svg`, `${label}: mavzuga mos SVG chizma ulanmagan.`);
  check(!figures.has(lesson.figure), `${label}: rasm takrorlangan.`);
  figures.add(lesson.figure);

  const mappedSimulation = phet.lessons[lesson.id];
  check(Boolean(mappedSimulation) === lesson.hasSimulation, `${label}: simulyatsiya zarurati bilan xarita mos emas.`);
  if (lesson.hasSimulation) {
    check(Boolean(mappedSimulation?.simulation), `${label}: simulyatsiya yo‘q.`);
    check(Boolean(phet.simulations[mappedSimulation.simulation]), `${label}: simulyatsiya manzili yo‘q.`);
    check(phet.simulations[mappedSimulation.simulation]?.locale === 'uz', `${label}: simulyatsiya o‘zbekcha emas.`);
  }
  if (lesson.video) {
    check(/^https:\/\/www\.youtube-nocookie\.com\/embed\//.test(lesson.video.embed || '') || lesson.video.type === 'mp4', `${label}: video manzili xato.`);
    check(lesson.video.verified === true, `${label}: video tasdiqlanmagan.`);
    check(lesson.video.provider !== 'Khan Academy O‘zbek', `${label}: eski provayder matni qolgan.`);
  }
}

const courseHtml = read('physics7.html');
const labsHtml = read('labs.html');
const labHtml = read('lab.html');
check(courseHtml.includes("storageKey: 'idrokPhysics7'"), '7-sinf progress kaliti ulanmagan.');
check(courseHtml.includes("certificateGrade: '7'"), '7-sinf sertifikati ulanmagan.');
check(courseHtml.includes('assets/physics7/physics-content.js'), '7-sinf kontenti HTMLga ulanmagan.');
check(courseHtml.includes('assets/physics7/physics-content-audit.js'), '7-sinf yakuniy auditi HTMLga ulanmagan.');
check(read('index.html').includes('data-course-launch="physics7"'), 'Bosh sahifada 7-sinf tugmasi yo‘q.');
check(labsHtml.includes('window.PHYSICS_COURSE7'), 'Laboratoriya katalogida 7-sinf ulanmagan.');
check(labHtml.includes('phet-map7.js'), 'Laboratoriya sahifasida 7-sinf xaritasi ulanmagan.');
check(labsHtml.indexOf('phet-map7.js') < labsHtml.indexOf('lab-data7.js'), 'Laboratoriya katalogida 7-sinf skriptlar tartibi xato.');
check(labHtml.indexOf('phet-map7.js') < labHtml.indexOf('lab-data7.js'), 'Laboratoriya sahifasida 7-sinf skriptlar tartibi xato.');

if (failures.length) {
  console.error(`Physics 7 verification failed (${failures.length}):`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log(JSON.stringify({
  grade: course.grade,
  chapters: course.chapters.length,
  lessons: course.lessons.length,
  theoryBlocks: course.lessons.reduce((total, lesson) => total + lesson.theoryBlocks.length, 0),
  figures: figures.size,
  videos: course.lessons.filter(lesson => lesson.video).length,
  experimentVideos: course.lessons.filter(lesson => lesson.experimentVideo).length,
  labs: labs.length,
  simulations: Object.keys(phet.lessons).length,
}, null, 2));

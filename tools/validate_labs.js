'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

global.window = global;
require(path.join(root, 'lab-data.js'));
require(path.join(root, 'phet-map.js'));

const courseSource = fs.readFileSync(path.join(root, 'assets', 'physics', 'physics-content.js'), 'utf8');
const course = JSON.parse(courseSource.replace(/^window\.PHYSICS_COURSE\s*=\s*/, '').replace(/;\s*$/, ''));
const figureFallbacks = {l29: ['assets/physics/book/page-087.jpg', 87], l59: ['assets/physics/book/page-166.jpg', 166]};
course.lessons.forEach(lesson => {
  const fallback = figureFallbacks[lesson.id];
  if (fallback && !lesson.figure) { lesson.figure = fallback[0]; lesson.figurePage = fallback[1]; }
});
const labs = global.IDROK_LABS;
const phet = global.IDROK_PHET;
const lessonMap = new Map(course.lessons.map(lesson => [lesson.id, lesson]));
const issues = [];

function duplicateValues(values) {
  const seen = new Set();
  const duplicate = new Set();
  values.forEach(value => seen.has(value) ? duplicate.add(value) : seen.add(value));
  return [...duplicate];
}

function checkHtml(fileName) {
  const source = fs.readFileSync(path.join(root, fileName), 'utf8');
  const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  duplicateValues(ids).forEach(id => issues.push(`${fileName}: takroriy id ${id}`));
  const references = [...source.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?"/g)].map(match => match[1]);
  references.filter(reference => !/^(?:https?:|mailto:|javascript:)/.test(reference)).forEach(reference => {
    if (!fs.existsSync(path.join(root, reference))) issues.push(`${fileName}: fayl topilmadi ${reference}`);
  });
  return ids.length;
}

if (!Array.isArray(labs) || labs.length !== 59) issues.push(`Laboratoriya soni ${labs?.length}; 59 bo‘lishi kerak`);
if (!Array.isArray(course.lessons) || course.lessons.length !== 59) issues.push(`Dars soni ${course.lessons?.length}; 59 bo‘lishi kerak`);
duplicateValues(labs.map(lab => lab.id)).forEach(id => issues.push(`Takroriy laboratoriya id: ${id}`));
duplicateValues(labs.map(lab => lab.title)).forEach(title => issues.push(`Takroriy laboratoriya nomi: ${title}`));

if (!phet || Object.keys(phet.lessons || {}).length !== 59) issues.push(`Simulyatsiya xaritasi ${Object.keys(phet?.lessons || {}).length}; 59 bo‘lishi kerak`);
const verifiedSlugs = new Set((phet.catalog || []).map(item => item.slug));
const simulationIdentities = [];
const previewIdentities = [];
if ((phet.catalog || []).length < 60) issues.push(`Umumiy katalog ${phet.catalog?.length || 0} ta; 60 tadan ko‘p bo‘lishi kerak`);
if (verifiedSlugs.size !== (phet.catalog || []).length) issues.push('Umumiy katalogda takrorlangan simulyatsiya bor');

labs.forEach((lab, index) => {
  const lesson = lessonMap.get(lab.id);
  const simulationLesson = phet?.lessons?.[lab.id];
  if (!lesson) issues.push(`${lab.id}: mos dars topilmadi`);
  if (!simulationLesson) issues.push(`${lab.id}: simulyatsiya mosligi topilmadi`);
  if (simulationLesson?.kind === 'official') {
    const officialSimulation = phet.simulations[simulationLesson.simulation];
    if (!officialSimulation) issues.push(`${lab.id}: rasmiy simulyatsiya topilmadi (${simulationLesson.simulation})`);
    if (!verifiedSlugs.has(officialSimulation?.slug)) issues.push(`${lab.id}: tekshirilmagan rasmiy simulyatsiya manzili`);
    if (!phet.buildUrl(simulationLesson).endsWith(`?screens=${simulationLesson.screen}`)) issues.push(`${lab.id}: rasmiy simulyatsiya manzili noto‘liq`);
    if (!phet.buildThumbnail(simulationLesson).endsWith(`${officialSimulation?.slug}-600.png`)) issues.push(`${lab.id}: preview manzili noto‘g‘ri`);
    simulationIdentities.push(`official:${officialSimulation?.slug}:screen-${simulationLesson.screen || 1}`);
    previewIdentities.push(`official:${officialSimulation?.slug}`);
  } else if (simulationLesson) {
    issues.push(`${lab.id}: simulyatsiya turi noto‘g‘ri`);
  }
  if (simulationLesson && (!Array.isArray(simulationLesson.checklist) || simulationLesson.checklist.length !== 3)) issues.push(`${lab.id}: topshiriqlar soni 3 ta emas`);
  if (simulationLesson && (!simulationLesson.mission || !simulationLesson.hint)) issues.push(`${lab.id}: missiya matni yoki maslahat yo‘q`);
  if (!lab.title || !lab.role || !lab.intro || !lab.challenge || !lab.actionLabel) issues.push(`${lab.id}: matnlar to‘liq emas`);
  if (!lab.controls?.a || !lab.controls?.b) issues.push(`${lab.id}: ikkita boshqaruv mavjud emas`);
  ['a', 'b'].forEach(key => {
    const control = lab.controls?.[key];
    const goal = lab.goal?.[key];
    if (!control || !goal) return;
    if (control.min >= control.max) issues.push(`${lab.id}: ${key} diapazoni noto‘g‘ri`);
    if (goal[0] < control.min || goal[1] > control.max || goal[0] > goal[1]) issues.push(`${lab.id}: ${key} missiyasi yechilmaydi`);
  });
  ['dragX', 'dragY'].forEach(key => {
    const goal = lab.goal?.[key];
    if (goal && (goal[0] < 0 || goal[1] > 1 || goal[0] > goal[1])) issues.push(`${lab.id}: ${key} missiyasi yechilmaydi`);
  });
  if (!(lab.goal?.actions >= 1)) issues.push(`${lab.id}: faol tajriba harakati talab qilinmagan`);
  if (index !== Number(lab.id.slice(1)) - 1) issues.push(`${lab.id}: dars tartibi buzilgan`);
});

if (new Set(simulationIdentities).size !== 59) issues.push(`Kurs simulyatsiyalari takrorlangan: ${new Set(simulationIdentities).size}/59 noyob`);
if (new Set(previewIdentities).size !== 59) issues.push(`Kurs preview rasmlari takrorlangan: ${new Set(previewIdentities).size}/59 noyob`);

const requiredTopicMatches = {l1:'diffusion',l5:'gas',l16:'friction',l29:'greenhouse',l33:'pressure',l36:'hookes',l38:'states',l44:'wavesIntro',l45:'light',l50:'opticsBasics',l51:'optics',l57:'spectrum',l58:'gravity',l59:'circuits'};
Object.entries(requiredTopicMatches).forEach(([id, simulation]) => {
  if (phet.lessons[id]?.simulation !== simulation) issues.push(`${id}: mavzuga mos simulyatsiya buzilgan (${phet.lessons[id]?.simulation || 'yo‘q'})`);
});

course.lessons.forEach(lesson => {
  if (!labs.some(lab => lab.id === lesson.id)) issues.push(`${lesson.id}: laboratoriya yo‘q`);
  if (!lesson.summary || !lesson.formula || !lesson.relationship || !lesson.application) issues.push(`${lesson.id}: asosiy kurs matni to‘liq emas`);
  if (!Array.isArray(lesson.theoryBlocks) || lesson.theoryBlocks.length < 2) issues.push(`${lesson.id}: nazariya bloklari yetarli emas`);
  if (!lesson.figure || !fs.existsSync(path.join(root, lesson.figure))) issues.push(`${lesson.id}: mavzu rasmi topilmadi`);
  if (!lesson.video?.embed || !lesson.video?.title) issues.push(`${lesson.id}: videodars yo‘q`);
  if (!lesson.experimentVideo?.embed || !lesson.experiment || !lesson.experimentQuestion) issues.push(`${lesson.id}: tajriba materiali yo‘q`);
});

const htmlIdCounts = {
  lab: checkHtml('lab.html'),
  idrokSim: checkHtml('idrok-sim.html'),
  boyleSim: checkHtml('boyle-sim.html'),
  labs: checkHtml('labs.html'),
  physics: checkHtml('physics.html'),
};

const summary = {
  chapters: course.chapters.length,
  lessons: course.lessons.length,
  labs: labs.length,
  simulationMappings: Object.keys(phet?.lessons || {}).length,
  officialSimulations: Object.values(phet?.lessons || {}).filter(item => item.kind === 'official').length,
  customSimulations: Object.values(phet?.lessons || {}).filter(item => item.kind === 'custom').length,
  uniqueSimulationIdentities: new Set(simulationIdentities).size,
  uniquePreviewIdentities: new Set(previewIdentities).size,
  uniqueOfficialSlugs: new Set(Object.values(phet?.lessons || {}).filter(item => item.kind === 'official').map(item => phet.simulations[item.simulation]?.slug)).size,
  uniqueLessonVideos: new Set(course.lessons.map(lesson => lesson.video?.embed)).size,
  lessonFigures: course.lessons.filter(lesson => lesson.figure && fs.existsSync(path.join(root, lesson.figure))).length,
  htmlIdCounts,
  issues,
};

console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exitCode = 1;

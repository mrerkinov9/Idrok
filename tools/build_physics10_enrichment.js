'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({window: {}});

function runScript(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(source, context, {filename: relativePath});
}

runScript('assets/physics10-rebuild/physics-content.js');
const legacySeed = 'assets/physics10/physics-content-fixes.js';
const currentSeed = 'assets/physics10/physics-content-enrichment.js';
runScript(fs.existsSync(path.join(root, legacySeed)) ? legacySeed : currentSeed);

const course = context.window.PHYSICS_COURSE;
if (!course || course.lessons.length !== 59) throw new Error('59 lessons were not loaded');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

const khan = new Map(readJson('tmp/kau_videos.json').map(item => [item.id, item]));
const experiments = [
  ...readJson('tmp/pizik_lab_videos.json'),
  ...readJson('tmp/Fizikadan_tajribalar_videos.json'),
];

function normalize(value) {
  return String(value || '')
    .toLocaleLowerCase('uz')
    .replace(/[ʻʼ’‘`]/g, "'")
    .replace(/[^a-z0-9\u0400-\u04ff']+/g, ' ')
    .trim();
}

const generic = new Set([
  'masalalar', 'yechish', 'laboratoriya', 'amaliy', 'mashgulot', 'qonuni',
  'uchun', 'bilan', 'hamda', 'uning', 'ularning', 'elektr', 'magnit', 'fizika',
]);

const chapterKeywords = [
  ['kuch', 'nyuton', 'qiya', 'richag', 'muvozanat', 'dinamika'],
  ['tebranish', 'mayatnik', 'prujina', 'tolqin', 'tovush'],
  ['suyuqlik', 'oqim', 'bosim', 'bernulli', 'quvur'],
  ['zaryad', 'elektrostatik', 'kuchlanganlik', 'potensial', 'kondensator'],
  ['tok', 'qarshilik', 'om', 'zanjir', 'batareya'],
  ['elektroliz', 'diod', 'yarimotkazgich', 'vakuum', 'gaz'],
  ['magnit', 'induksiya', 'amper', 'lorens', 'dvigatel', 'generator'],
];

function scoreExperiment(lesson, item) {
  const title = normalize(item.title);
  const words = normalize(lesson.title).split(' ').filter(word => word.length >= 4 && !generic.has(word));
  const chapter = chapterKeywords[lesson.chapter];
  let score = 0;
  for (const word of words) {
    if (title.split(' ').includes(word)) score += 20;
    else if (title.includes(word)) score += 8;
  }
  for (const word of chapter) {
    if (title.includes(word)) score += 5;
  }
  if (/tajriba|qiziqarli|eksperiment/.test(title)) score += 3;
  return score;
}

const usedExperiments = new Set();
const enrichment = course.lessons.map(lesson => {
  const videoId = lesson.video?.id;
  const videoMeta = khan.get(videoId);
  const video = videoId ? {
    id: videoId,
    title: videoMeta?.title?.replace(/^\d+\.\s*/, '').replace(/\s+Fizika\..*$/s, '').trim() || lesson.title,
    duration: videoMeta?.duration || '',
    source: videoMeta?.source || `https://www.youtube.com/watch?v=${videoId}`,
    embed: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
    provider: 'Khan Academy O‘zbek',
    type: 'youtube',
    verified: true,
  } : null;

  const ranked = experiments
    .filter(item => item.id && !usedExperiments.has(item.id))
    .map(item => ({item, score: scoreExperiment(lesson, item)}))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  let experimentVideo = null;
  if (best && best.score >= 18) {
    usedExperiments.add(best.item.id);
    experimentVideo = {
      id: best.item.id,
      title: best.item.title,
      duration: best.item.duration || '',
      source: best.item.source || '',
      embed: best.item.embed || '',
      provider: best.item.provider || 'O‘zbekcha fizika tajribalari',
      matchScore: best.score,
      verified: true,
    };
  }

  return {
    id: lesson.id,
    video,
    experimentVideo,
    problem: lesson.problem,
  };
});

const payload = JSON.stringify(enrichment, null, 2);
const output = `(() => {
  'use strict';
  const course = window.PHYSICS_COURSE;
  if (!course || course.grade !== 10) return;
  const enrichment = ${payload};
  const byId = new Map(enrichment.map(item => [item.id, item]));
  course.lessons.forEach(lesson => {
    const item = byId.get(lesson.id);
    if (!item) return;
    lesson.video = item.video;
    lesson.experimentVideo = item.experimentVideo;
    lesson.problem = item.problem;
  });
})();
`;

fs.writeFileSync(
  path.join(root, 'assets/physics10-rebuild/physics-content-enrichment.js'),
  output,
  'utf8',
);

const report = {
  lessons: enrichment.length,
  videos: enrichment.filter(item => item.video).length,
  uniqueVideos: new Set(enrichment.map(item => item.video?.id).filter(Boolean)).size,
  experiments: enrichment.filter(item => item.experimentVideo).length,
  uniqueExperiments: new Set(enrichment.map(item => item.experimentVideo?.id).filter(Boolean)).size,
  problems: enrichment.filter(item => item.problem).length,
  weakExperiments: enrichment.filter(item => item.experimentVideo && item.experimentVideo.matchScore < 25).map(item => item.id),
};
fs.writeFileSync(
  path.join(root, 'tmp/pdfs/physics10-enrichment-report.json'),
  JSON.stringify(report, null, 2),
  'utf8',
);
console.log(JSON.stringify(report, null, 2));

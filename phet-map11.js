(() => {
  'use strict';

  const base = window.IDROK_PHET9;
  const course = window.PHYSICS_COURSE11;
  if (!base || !course?.lessons?.length) {
    window.IDROK_PHET11 = null;
    return;
  }

  // Faqat mavzuga bevosita mos keladigan laboratoriyalar beriladi.
  const assignments = {
    l1:['compass',1],
    l3:['electromagnets',1],
    l7:['faraday',1],
    l11:['circuitsAc',1],
    l21:['wavesIntro',1],
    l22:['light',1],
    l25:['interference',1],
    l28:['colorVision',1],
    l29:['spectrum',1],
    l37:['hydrogen',1],
    l38:['moleculesLight',1],
    l39:['nucleus',1],
    l40:['rutherford',1],
  };

  const lessonById = Object.fromEntries(course.lessons.map(lesson => [lesson.id, lesson]));
  const lessons = Object.fromEntries(Object.entries(assignments).map(([lessonId, [simulation, screen]]) => {
    const lesson = lessonById[lessonId];
    return [lessonId, Object.freeze({
      id: lessonId,
      kind: 'official',
      simulation,
      screen,
      mission: `“${lesson.title}” qonuniyatini boshqaruv elementlarini o‘zgartirib tajribada tekshiring.`,
      checklist: Object.freeze([
        `Boshlang‘ich holatni qayd eting va ${lesson.formula} bog‘lanishini kuzating.`,
        'Bir vaqtning o‘zida faqat bitta parametrni o‘zgartiring.',
        `Natijani mavzu qoidasi bilan izohlang: ${lesson.summary}`,
      ]),
      hint: `Avval boshlang‘ich holatni kuzating, so‘ng bitta parametrni o‘zgartiring. Asosiy formula: ${lesson.formula}.`,
    })];
  }));

  window.IDROK_PHET11 = Object.freeze({
    version: '2026.08-grade11',
    simulations: base.simulations,
    lessons: Object.freeze(lessons),
    catalog: base.catalog,
    buildUrl: base.buildUrl,
    buildThumbnail: base.buildThumbnail,
  });
})();

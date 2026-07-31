(() => {
  'use strict';

  const base = window.IDROK_PHET9;
  const course = window.PHYSICS_COURSE10;
  if (!base || !course?.lessons?.length) {
    window.IDROK_PHET10 = null;
    return;
  }

  const assignments = [
    ['vectors',1],['forces',2],['gravityForce',1],['collision',1],['forces',3],['forces',1],['vectors',2],
    ['ramp',1],['friction',1],['skateBasics',1],['skate',2],['balance',1],['balance',2],['balance',3],
    ['pendulum',1],['springBasics',1],['pendulum',2],['wavesIntro',1],['sound',1],['fourier',1],
    ['pressure',1],['buoyancy',1],['density',1],
    ['chargesFields',1],['coulomb',1],['electricHockey',1],['chargesFields',2],['capacitor',1],['capacitor',2],['energy',1],['coulomb',2],
    ['circuits',1],['ohm',1],['circuits',2],['battery',1],['resistance',1],['ohm',2],
    ['molarity',1],['concentration',1],['battery',2],['molarity',2],['gas',1],['atomic',1],['photoelectric',1],['neuron',1],['circuits',3],
    ['electromagnets',1],['electromagnets',2],['compass',1],['faraday',1],['faraday',2],['generator',1],['electromagnets',3],
    ['faraday',3],['generator',2],['faraday',4],['generator',3],['electromagnets',4],['compass',2],
  ];

  const lessons = Object.fromEntries(course.lessons.map((lesson, index) => {
    const [simulation, screen] = assignments[index] || ['forces', 1];
    return [lesson.id, Object.freeze({
      id: lesson.id,
      kind: 'official',
      simulation,
      screen,
      mission: `“${lesson.title}” qonuniyatini boshqaruv elementlarini o‘zgartirib tajribada tekshiring.`,
      checklist: Object.freeze([
        `Boshlang‘ich qiymatlarni qayd eting va ${lesson.formula} bog‘lanishini kuzating.`,
        'Bitta parametrni o‘zgartirib, natijaning qanday o‘zgarishini solishtiring.',
        `Kuzatuvni quyidagi qoida bilan izohlang: ${lesson.relationship}`,
      ]),
      hint: `Bir vaqtning o‘zida faqat bitta kattalikni o‘zgartiring. Asosiy formula: ${lesson.formula}.`,
    })];
  }));

  window.IDROK_PHET10 = Object.freeze({
    version: '2026.07-grade10',
    simulations: base.simulations,
    lessons: Object.freeze(lessons),
    catalog: base.catalog,
    buildUrl: base.buildUrl,
    buildThumbnail: base.buildThumbnail,
  });
})();

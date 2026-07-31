(() => {
  'use strict';
  const course = window.PHYSICS_COURSE;
  if (!course || !Array.isArray(course.lessons)) {
    console.error('PHYSICS_COURSE is not loaded for lab-data10.js');
    return;
  }
  const labs = course.lessons.map(lesson => ({
    id: lesson.id,
    scene: 'interactive',
    title: lesson.title + ' simulyatsiyasi',
    role: 'Tadqiqotchi',
    intro: lesson.summary || 'Interaktiv model yordamida mavzuni o‘rganing.',
    controls: {},
    goal: {},
    actionLabel: 'Tekshirish',
    challenge: 'Mavzu bo‘yicha topshiriqni yakunlang.'
  }));
  window.IDROK_LABS = labs;
})();

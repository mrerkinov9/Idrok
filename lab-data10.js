(() => {
  'use strict';

  const course = window.PHYSICS_COURSE10;
  if (!course?.lessons?.length) {
    window.IDROK_LABS10 = [];
    return;
  }

  const roles = [
    'Dinamika tadqiqotchisi',
    'To‘lqinlar muhandisi',
    'Oqimlar tahlilchisi',
    'Elektr maydon tadqiqotchisi',
    'Elektr zanjiri muhandisi',
    'Materiallar fizikasi tadqiqotchisi',
    'Magnit maydon muhandisi',
  ];

  window.IDROK_LABS10 = course.lessons.map((lesson, index) => ({
    id: lesson.id,
    scene: lesson.simulation || 'physics',
    title: `${lesson.title} laboratoriyasi`,
    role: roles[lesson.chapter] || 'Fizika tadqiqotchisi',
    intro: `${lesson.summary} Parametrlarni o‘zgartirib, qonuniyatni tajribada tekshiring.`,
    number: 60 + index,
    chapter: lesson.chapter,
    courseTitle: lesson.title,
    reward: 55 + lesson.chapter * 5 + (index % 3) * 5,
  }));
})();

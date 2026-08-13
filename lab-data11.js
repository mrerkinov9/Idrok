(() => {
  'use strict';

  const course = window.PHYSICS_COURSE11;
  const phet = window.IDROK_PHET11;
  if (!course?.lessons?.length || !phet?.lessons) {
    window.IDROK_LABS11 = [];
    return;
  }

  const roles = [
    'Magnit maydon tadqiqotchisi',
    'Induksiya muhandisi',
    'Tebranishlar tadqiqotchisi',
    'To‘lqin optikasi tadqiqotchisi',
    'Nisbiylik nazariyotchisi',
    'Kvant fizikasi tadqiqotchisi',
    'Yadro fizikasi tadqiqotchisi',
  ];

  window.IDROK_LABS11 = course.lessons
    .filter(lesson => phet.lessons[lesson.id])
    .map((lesson, index) => ({
      id: lesson.id,
      scene: phet.lessons[lesson.id].simulation,
      title: `${lesson.title} laboratoriyasi`,
      role: roles[lesson.chapter] || 'Fizika tadqiqotchisi',
      intro: `${lesson.summary} Parametrlarni o‘zgartirib, qonuniyatni tajribada tekshiring.`,
      number: index + 1,
      chapter: lesson.chapter,
      courseTitle: lesson.title,
      reward: 65 + lesson.chapter * 5 + (index % 3) * 5,
    }));
})();

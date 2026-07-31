(() => {
  'use strict';

  const course = window.PHYSICS_COURSE7;
  const phet = window.IDROK_PHET7;
  if (!course?.lessons?.length || !phet?.lessons) {
    window.IDROK_LABS7 = [];
    return;
  }

  const roles = [
    'Harakat tadqiqotchisi',
    'Kuch va energiya muhandisi',
    'Issiqlik tadqiqotchisi',
    'Elektr zanjiri muhandisi',
    'Optika tadqiqotchisi',
  ];

  window.IDROK_LABS7 = course.lessons
    .filter(lesson => Boolean(phet.lessons[lesson.id]))
    .map((lesson, index) => ({
      id: lesson.id,
      scene: phet.lessons[lesson.id].simulation,
      title: `${lesson.title} laboratoriyasi`,
      role: roles[lesson.chapter] || 'Fizika tadqiqotchisi',
      intro: phet.lessons[lesson.id].mission,
      number: index + 1,
      chapter: lesson.chapter,
      courseTitle: lesson.title,
      reward: 40 + lesson.chapter * 5 + (index % 3) * 5,
    }));
})();

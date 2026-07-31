(() => {
  'use strict';

  const course = window.PHYSICS_COURSE8;
  const phet = window.IDROK_PHET8;
  if (!course?.lessons?.length || !phet?.lessons) {
    window.IDROK_LABS8 = [];
    return;
  }

  const roles = [
    'Elektrostatika tadqiqotchisi',
    'Elektr zanjiri muhandisi',
    'Energiya auditori',
    'Elektrokimyo tadqiqotchisi',
    'Magnit maydon muhandisi',
  ];

  window.IDROK_LABS8 = course.lessons
    .filter(lesson => Boolean(phet.lessons[lesson.id]))
    .map((lesson, index) => ({
      id:lesson.id,
      scene:phet.lessons[lesson.id].simulation,
      title:`${lesson.title} laboratoriyasi`,
      role:roles[lesson.chapter] || 'Fizika tadqiqotchisi',
      intro:phet.lessons[lesson.id].mission,
      number:index + 1,
      chapter:lesson.chapter,
      courseTitle:lesson.title,
      reward:55 + lesson.chapter * 5 + (index % 3) * 5,
    }));
})();

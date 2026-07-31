(() => {
  'use strict';

  const simulations = Object.freeze({
    vectors: {slug: 'vector-addition', title: 'Vektorlarni qo‘shish'},
    forces: {slug: 'forces-and-motion-basics', title: 'Kuch va harakat asoslari'},
    gravity: {slug: 'gravity-and-orbits', title: 'Gravitatsiya va orbitalar'},
    gravityForce: {slug: 'gravity-force-lab', title: 'Butun olam tortishish qonuni'},
    skateBasics: {slug: 'energy-skate-park-basics', title: 'Energiya skeyt-parki: asoslar'},
    skate: {slug: 'energy-skate-park', title: 'Energiya skeyt-parki'},
    balance: {slug: 'balancing-act', title: 'Richag muvozanati'},
  });

  const rows = [
    ['l1', 'vectors', 1, 'Kuchlarni qo‘shish: Vektorlarni qo‘shish simulyatsiyasida ikkita o‘zaro perpendikulyar vektorni qo‘shing va ularning natijaviysini o‘lchang.', ['O‘ng panelda “Explore 2D” rejimini tanlang.', 'Foydali ish yelkalariga mos ikkita vektorni tortib joylashtiring.', 'Natijaviy vektor kattaligini (Sum) 10 birlikka tenglashtiring.'], 'Ikki perpendikulyar vektor yig‘indisi pifagor teoremasi bo‘yicha hisoblanadi.'],
    ['l2', 'forces', 2, 'Markazga intilma kuch: Kuch va harakat simulyatsiyasida jismga tezlanish beruvchi kuchlarni o‘rganing.', ['“Motion” rejimini tanlang.', 'Jismga doimiy kuch ta’sir ettiring.', 'Tezlik va tezlanish bog‘lanishini tushuntiring.'], 'Tezlanish jismga ta’sir qilayotgan natijaviy kuchga to‘g‘ri proporsional.'],
    ['l3', 'gravity', 1, 'Gravitatsiya maydonidagi harakat: Sun’iy yo‘ldosh harakatini orbitalar simulyatsiyasida tahlil qiling.', ['“Orbit” rejimini tanlang.', 'Yo‘ldoshning boshlang‘ich tezligini o‘zgartirib ko‘ring.', 'Yerga yiqilmasdan barqaror aylanish tezligini toping.'], 'Birinchi kosmik tezlik gravitatsiya kuchi va markazga intilma kuch tengligidan kelib chiqadi.'],
    ['l4', 'forces', 3, 'Masalalar yechish: Dinamika qonunlarini kuchlar va ishqalanish simulyatsiyasida tekshiring.', ['“Friction” rejimini tanlang.', 'Massani 50 kg deb belgilang.', 'Ishqalanish kuchidan oshadigan kuch qo‘llab, tezlanishni kuzating.'], 'Jismga ta’sir qilayotgan natijaviy kuch ishqalanish kuchi chegirmasidan keyin hisoblanadi.'],
    ['l5', 'forces', 4, 'Jism og‘irligi: Lift modelida yoki tezlanuvchan harakatda og‘irlik o‘zgarishini tahlil qiling.', ['“Acceleration” rejimini tanlang.', 'Jismga yuqoriga yo‘nalgan kuch bering.', 'Tezlanish vaqtida jismning og‘irligi ortishini kuzating.'], 'Yuqoriga tezlanish bilan harakatlanayotganda og‘irlik P = m(g + a) bo‘ladi.'],
    ['l6', 'forces', 1, 'Jismning bir nechta kuch ta’siridagi harakati: Qarama-qarshi kuchlar muvozanatini o‘rganing.', ['“Net Force” rejimini tanlang.', 'Ikki tomonga turli xil o‘lchamdagi odamchalarni joylashtiring.', 'Natijaviy kuch va harakat yo‘nalishini aniqlang.'], 'Muvozanatlanmagan kuchlar jismga kuchlar ayirmasi yo‘nalishida tezlanish beradi.'],
    ['l7', 'forces', 2, 'Masalalar yechish: Kuchlar ta’siridagi dinamik muvozanatni tahlil qiling.', ['“Motion” rejimini tanlang.', 'Massani o‘zgartiring va bir xil kuch bilan qanday tezlanish olinishini tekshiring.'], 'Tezlanish massaga teskari proporsionaldir.'],
    ['l8', 'skateBasics', 1, 'Qiya tekislikdagi harakat: Skeytbordchining qiyalikdan tushishidagi tezlanishini o‘rganing.', ['“Intro” rejimini tanlang.', 'U-simon yo‘lakning bir tomoniga skeytbordchini qo‘ying.', 'Pastga tushish tezligining o‘zgarishini kuzating.'], 'Pastga sirpanib tushishda og‘irlik kuchining qiyalik bo‘ylab tashkil etuvchisi tezlanish beradi.'],
    ['l9', 'skateBasics', 2, 'Qiya tekislikda ish va FIK: Ishqalanish kuchi ta’sirida mexanik energiya yo‘qotilishini o‘rganing.', ['“Friction” rejimini tanlang.', 'Ishqalanish koeffitsiyentini o‘rtacha qiymatga sozlang.', 'Potensial energiyaning issiqlikka aylanishini kuzating.'], 'Ishqalanish kuchi bajargan ish foydali mexanik energiyani kamaytiradi (FIK pasayadi).'],
    ['l10', 'skate', 1, 'Qiya tekislik masalalari: Massaning va yo‘l shaklining harakat tezligiga ta’sirini tekshiring.', ['“Intro” rejimini tanlang.', 'Skeytbordchi massasini o‘zgartiring.', 'Tezlik o‘zgarmasligini (ishqalanishsiz holatda) tasdiqlang.'], 'Ishqalanishsiz qiya tekislikdan tushish tezligi jism massasiga bog‘liq emas.'],
    ['l11', 'skate', 2, 'Laboratoriya: Qiya tekislik FIKini laboratoriya rejimida aniqlang.', ['“Friction” rejimini tanlang.', 'Balandlik va qiyalik burchagini o‘zgartiring.', 'Foydali va to‘liq ishlarni hisoblab FIKni foizda toping.'], 'FIK har doim 100% dan kichik bo‘ladi, chunki ishning bir qismi ishqalanishga sarflanadi.'],
    ['l12', 'balance', 1, 'Kuch momenti: Richagda muvozanat shartlarini o‘rganing.', ['“Intro” rejimini tanlang.', 'Richagning har xil yelkalariga yuklar joylashtiring.', 'Muvozanat holatini hosil qiling.'], 'Muvozanat uchun kuch momentlarining yig‘indisi nolga teng bo‘lishi kerak (M = F*d).'],
    ['l13', 'balance', 2, 'Momentlar qoidasi: Richagda turli massali jismlarni muvozanatlang.', ['“Balance Lab” rejimini tanlang.', 'Tirgakning chap va o‘ng tomoniga turli og‘irlikdagi yuklarni qo‘ying.', 'F1*d1 = F2*d2 munosabatini tekshiring.'], 'Yelka qanchalik katta bo‘lsa, muvozanat uchun shunchalik kichik kuch talab qilinadi.'],
    ['l14', 'balance', 3, 'Masalalar yechish: Statika qonunlarini richag o‘yinlari rejimida tekshiring.', ['“Game” rejimini tanlang.', '1-darajali o‘yinlarni boshlang.', 'Noma’lum massalarni momentlar qoidasi yordamida hisoblab toping.'], 'Richag o‘yinlarida muvozanat shartlarini to‘g‘ri qo‘llash muhimdir.']
  ];

  const official = (simulation, screen = 1) => ({kind: 'official', simulation, screen});
  const assignmentOverrides = Object.freeze({
    l1: official('vectors', 1),
    l2: official('forces', 2),
    l3: official('gravity', 1),
    l4: official('forces', 3),
    l5: official('forces', 4),
    l6: official('forces', 1),
    l7: official('forces', 2),
    l8: official('skateBasics', 1),
    l9: official('skateBasics', 2),
    l10: official('skate', 1),
    l11: official('skate', 2),
    l12: official('balance', 1),
    l13: official('balance', 2),
    l14: official('balance', 3)
  });

  const assignments = Object.freeze(Object.fromEntries(rows.map(([id, simulation, screen]) => [id, assignmentOverrides[id] || official(simulation, screen)])));

  const lessons = Object.fromEntries(rows.map(([id, ignoredSimulation, ignoredScreen, mission, checklist, hint]) => {
    const assignment = assignments[id];
    return [id, Object.freeze({id, ...assignment, mission, checklist: Object.freeze(checklist), hint})];
  }));

  const buildUrl = config => {
    const simulation = simulations[config.simulation];
    if (!simulation) return '';
    const locale = simulation.locale || 'uz';
    const base = `https://phet.colorado.edu/sims/html/${simulation.slug}/latest/${simulation.slug}_${locale}.html`;
    return config.screen ? `${base}?screens=${config.screen}` : base;
  };

  const buildThumbnail = config => {
    if (!config) return '';
    const simulation = simulations[config.simulation];
    return simulation ? `https://phet.colorado.edu/sims/html/${simulation.slug}/latest/${simulation.slug}-600.png` : '';
  };

  window.IDROK_PHET = Object.freeze({
    version: '2026.07-official-library-grade10-chapter1',
    simulations,
    lessons: Object.freeze(lessons),
    catalog: Object.freeze(Object.entries(simulations).map(([key, simulation]) => Object.freeze({key, ...simulation}))),
    buildUrl,
    buildThumbnail,
  });
})();

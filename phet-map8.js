(() => {
  'use strict';

  const base = window.IDROK_PHET9 || window.IDROK_PHET;
  const course = window.PHYSICS_COURSE8;
  if (!base || !course?.lessons?.length) {
    window.IDROK_PHET8 = null;
    return;
  }

  // Bir xil simulyatsiyani o'nlab kartaga ko'paytirish o'rniga, har bir rasmiy
  // laboratoriya faqat eng mos bitta darsga biriktiriladi.
  const rows = [
    ['l1','staticElectricity',1,'Ishqalanishda elektronlarning ko‘chishi va jismlarning tortishishini kuzating.',[
      'Sharni matoga ishqalang.',
      'Zaryad belgilarini yoqing.',
      'Sharni devorga yaqinlashtirib qutblanishni izohlang.',
    ]],
    ['l3','coulomb',1,'Zaryad miqdori va masofa Kulon kuchiga qanday ta’sir qilishini o‘lchang.',[
      'Ikki zaryad ishorasini tanlang.',
      'Masofani ikki marta o‘zgartiring.',
      'Kuchning yo‘nalishi va qiymatini taqqoslang.',
    ]],
    ['l5','chargesFields',1,'Zaryadlarni joylashtirib elektr maydon vektorlari va kuch chiziqlarini yarating.',[
      'Musbat zaryadni ish maydoniga qo‘ying.',
      'Manfiy zaryad qo‘shib maydonni kuzating.',
      'Datchikni turli nuqtalarga olib boring.',
    ]],
    ['l8','travoltage',1,'Statik zaryad to‘planishi va uchqunli razryad hosil bo‘lishini xavfsiz modelda ko‘ring.',[
      'Oyoqni gilam bo‘ylab harakatlantiring.',
      'Elektronlar to‘planishini kuzating.',
      'Qo‘lni metall tutqichga yaqinlashtiring.',
    ]],
    ['l14','circuits',1,'Batareya, kalit, lampochka, ampermetr va voltmetr bilan to‘liq o‘lchov zanjiri tuzing.',[
      'Batareya va lampochkadan yopiq zanjir tuzing.',
      'Ampermetrni ketma-ket ulang.',
      'Voltmetrni lampochkaga parallel ulang.',
    ]],
    ['l15','resistance',1,'Simning materiali, uzunligi va kesim yuzi qarshilikka qanday ta’sir qilishini tekshiring.',[
      'Sim uzunligini o‘zgartiring.',
      'Kesim yuzini o‘zgartiring.',
      'Materiallarni bir xil sharoitda taqqoslang.',
    ]],
    ['l17','ohm',1,'Kuchlanish, tok kuchi va qarshilik orasidagi Om qonunini real vaqt ko‘rsatkichlarida tekshiring.',[
      'Kuchlanishni asta oshiring.',
      'Tok kuchidagi o‘zgarishni yozing.',
      'Qarshilikni o‘zgartirib U/I nisbatini tekshiring.',
    ]],
    ['l27','capacitor',1,'Plastina yuzi, masofa va kuchlanish kondensator sig‘imiga qanday ta’sir qilishini o‘rganing.',[
      'Kondensatorni manbaga ulang.',
      'Plastinalar orasidagi masofani o‘zgartiring.',
      'Zaryad va to‘plangan energiyani kuzating.',
    ]],
  ];

  const usedKeys = [...new Set(rows.map(row => row[1]))];
  const simulations = Object.freeze(Object.fromEntries(usedKeys.map(key => {
    const simulation = base.simulations[key];
    return [key, Object.freeze({...simulation, locale:'uz'})];
  })));
  const lessons = Object.freeze(Object.fromEntries(rows.map(([id, simulation, screen, mission, checklist]) => [
    id,
    Object.freeze({
      id,
      kind:'official',
      simulation,
      screen,
      mission,
      checklist:Object.freeze(checklist),
      hint:'Bitta parametrni o‘zgartiring, qolganlarini o‘zgarmas saqlab sabab va natijani solishtiring.',
    }),
  ])));

  Object.keys(lessons).forEach(id => {
    const lesson = course.lessons.find(item => item.id === id);
    if (lesson) lesson.hasSimulation = true;
  });

  const buildUrl = config => {
    const simulation = simulations[config?.simulation];
    if (!simulation) return '';
    const locale = simulation.locale || 'uz';
    const url = `https://phet.colorado.edu/sims/html/${simulation.slug}/latest/${simulation.slug}_${locale}.html`;
    return config.screen ? `${url}?screens=${config.screen}` : url;
  };
  const buildThumbnail = config => {
    const simulation = simulations[config?.simulation];
    return simulation ? `https://phet.colorado.edu/sims/html/${simulation.slug}/latest/${simulation.slug}-600.png` : '';
  };

  window.IDROK_PHET8 = Object.freeze({
    version:'2026.07-grade8-curated',
    simulations,
    lessons,
    catalog:Object.freeze(usedKeys.map(key => Object.freeze({key, ...simulations[key]}))),
    buildUrl,
    buildThumbnail,
  });
})();

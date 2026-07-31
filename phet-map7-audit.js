(() => {
  'use strict';
  const previous = window.IDROK_PHET7;
  const course = window.PHYSICS_COURSE7;
  if (!previous || !course?.lessons?.length) return;

  const rows = [
    ['l5','vectors',1,'Vektorning qiymati va yo‘nalishini boshqarib, natijaviy vektorni toping.',['Ikki vektor yarating.','Yo‘nalishlarini o‘zgartiring.','Natijaviy vektorni tekshiring.']],
    ['l16','balance',1,'Turli jismlarning massasini muvozanat yordamida taqqoslang.',['Ikki jismni tayanchga qo‘ying.','Massalarni o‘zgartiring.','Muvozanat holatini toping.']],
    ['l18','density',1,'Noma’lum jismning massasi va hajmidan zichligini aniqlang.',['Jism massasini o‘lchang.','Hajmini suvga botirib toping.','ρ = m/V orqali tekshiring.']],
    ['l19','forces',2,'Kuch jism tezligi va yo‘nalishini qanday o‘zgartirishini sinang.',['Jismni tanlang.','Turli kuch qo‘llang.','Harakatdagi o‘zgarishni taqqoslang.']],
    ['l23','pressure',1,'Chuqurlik ortganda suyuqlik bosimi ortishini o‘lchang.',['Datchikni sirtga yaqin tuting.','Uni chuqurroq tushiring.','Bosimlarni taqqoslang.']],
    ['l27','skateBasics',1,'Kinetik va potensial energiyaning almashinishini boshqaring.',['Jismni baland nuqtaga qo‘ying.','Harakatni boshlang.','Energiya ustunlarini kuzating.']],
    ['l34','energy',1,'Issiq va sovuq jismlar issiqlik muvozanatiga kelishini kuzating.',['Turli temperaturali jismlarni tanlang.','Ularni issiqlik aloqasiga keltiring.','Yakuniy temperaturani kuzating.']],
    ['l36','states',2,'Qizdirish va sovitishda bug‘lanish, qaynash va kondensatsiyani kuzating.',['Suyuqlikni tanlang.','Temperaturani oshiring.','Sovitib kondensatsiyani kuzating.']],
    ['l37','statesBasics',1,'Qattiq jismning erishi va suyuqlikning qotishini zarrachalar orqali kuzating.',['Qattiq holatni tanlang.','Isitib eriting.','Sovitib qayta qotiring.']],
    ['l39','staticElectricity',1,'Ishqalanishda elektronlar bir jismdan boshqasiga o‘tishini kuzating.',['Sharni matoga ishqalang.','Zaryad belgilarini yoqing.','Sharni devorga yaqinlashtiring.']],
    ['l40','chargesFields',1,'Musbat va manfiy zaryadlarning elektr maydonini yarating.',['Musbat zaryad qo‘ying.','Manfiy zaryad qo‘shing.','Maydon yo‘nalishini taqqoslang.']],
    ['l43','coulomb',1,'Zaryad va masofa Kulon kuchiga qanday ta’sir qilishini sinang.',['Ikki zaryad tanlang.','Masofani o‘zgartiring.','Tortishish va itarishni taqqoslang.']],
    ['l45','travoltage',1,'Statik zaryad to‘planishi va uchqunli razryadni kuzating.',['Oyoqni gilam bo‘ylab harakatlantiring.','Zaryad to‘planishini kuzating.','Qo‘lni metallga yaqinlashtiring.']],
    ['l51','circuits',1,'Tok kuchi va kuchlanishni to‘g‘ri ulangan asboblar bilan o‘lchang.',['Ampermetrni ketma-ket ulang.','Voltmetrni parallel ulang.','I va U qiymatlarini yozing.']],
    ['l52','resistance',1,'Sim uzunligi va qalinligi qarshilikka qanday ta’sir qilishini tekshiring.',['Sim uzunligini oshiring.','Sim qalinligini o‘zgartiring.','Qarshiliklarni taqqoslang.']],
    ['l54','ohm',1,'Kuchlanish, tok kuchi va qarshilik orasidagi Om qonunini tekshiring.',['Kuchlanishni oshiring.','Tok kuchini kuzating.','Qarshilikni o‘zgartiring.']],
    ['l60','light',1,'Yorug‘likning qaytishi va sinishini burchaklar orqali kuzating.',['Lazerni yoqing.','Tushish burchagini o‘zgartiring.','Qaytgan va singan nurlarni taqqoslang.']],
    ['l61','opticsBasics',1,'Yig‘uvchi va sochuvchi linzalarda nur yo‘lini kuzating.',['Linza turini tanlang.','Buyum masofasini o‘zgartiring.','Tasvir va fokusni kuzating.']],
  ];

  const simulations = Object.freeze(Object.fromEntries(
    [...new Set(rows.map(row => row[1]))].map(key => [key, previous.simulations[key]])
  ));
  const lessons = Object.freeze(Object.fromEntries(rows.map(([id, simulation, screen, mission, checklist]) => [
    id,
    Object.freeze({
      id,
      kind:'official',
      simulation,
      screen,
      mission,
      checklist:Object.freeze(checklist),
      hint:'Bir vaqtda faqat bitta parametrni o‘zgartirib natijani solishtiring.',
    }),
  ])));

  course.lessons.forEach(lesson => { lesson.hasSimulation = Boolean(lessons[lesson.id]); });
  window.IDROK_PHET7 = Object.freeze({
    version:'2026.07-grade7-unique-audit',
    simulations,
    lessons,
    catalog:Object.freeze(Object.entries(simulations).map(([key, simulation]) => Object.freeze({key, ...simulation}))),
    buildUrl:previous.buildUrl,
    buildThumbnail:previous.buildThumbnail,
  });
})();

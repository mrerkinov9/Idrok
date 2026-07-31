(() => {
  'use strict';

  const base = window.IDROK_PHET9 || window.IDROK_PHET;
  const course = window.PHYSICS_COURSE7;
  if (!base || !course?.lessons?.length) {
    window.IDROK_PHET7 = null;
    return;
  }

  const rows = [
    ['l5','vectors',1,'Vektorning qiymati va yo‘nalishini alohida o‘zgartirib kuzating.',['Ikki vektor yarating.','Ularning yo‘nalishini o‘zgartiring.','Natijaviy vektorni toping.']],
    ['l7','forces',1,'Jismning vaziyati vaqt davomida qanday o‘zgarishini boshqaring.',['Jismni harakatga keltiring.','Kuchni olib tashlab harakatni kuzating.','Harakatni sanoq jismiga nisbatan izohlang.']],
    ['l8','vectors',1,'Yo‘l va ko‘chish orasidagi farqni vektor orqali ko‘ring.',['Boshlang‘ich nuqtani belgilang.','Turli yo‘nalishlarda harakat yarating.','Natijaviy ko‘chishni yo‘l bilan taqqoslang.']],
    ['l9','forces',1,'Tekis harakatda tezlik o‘zgarmas bo‘lishini tekshiring.',['Jismga kuch bering.','Tezlik barqarorlashgach kuzating.','Masofa va vaqt nisbatini taqqoslang.']],
    ['l11','forces',1,'Kuch o‘zgarganda harakatning notekis bo‘lishini kuzating.',['Kuchni asta oshiring.','Tezlikning o‘zgarishini kuzating.','O‘rtacha tezlik haqida xulosa qiling.']],
    ['l12','forces',1,'Harakat masofasi va vaqtiga qarab o‘rtacha tezlikni aniqlang.',['Boshlang‘ich holatni belgilang.','Harakatni ishga tushiring.','Bosib o‘tilgan yo‘lni vaqtga bo‘ling.']],
    ['l16','balance',1,'Turli jismlarning massasini muvozanat yordamida taqqoslang.',['Tayanchga ikki jism qo‘ying.','Massalarni o‘zgartiring.','Muvozanat holatini toping.']],
    ['l17','density',1,'Massa va hajm zichlikka qanday ta’sir qilishini kuzating.',['Bir xil hajmli jismlarni tanlang.','Massalarini taqqoslang.','Zichligi katta jismni aniqlang.']],
    ['l18','density',1,'Noma’lum jismning massasi va hajmidan zichligini aniqlang.',['Jism massasini o‘lchang.','Hajmini suvga botirib aniqlang.','ρ = m/V orqali tekshiring.']],
    ['l19','forces',2,'Kuch jism tezligi va yo‘nalishini qanday o‘zgartirishini sinang.',['Jismni tanlang.','Turli kattalikdagi kuch qo‘llang.','Tezlikdagi o‘zgarishni taqqoslang.']],
    ['l22','pressure',1,'Suyuqlikka berilgan bosimning barcha yo‘nalishda uzatilishini kuzating.',['Bosim o‘lchagichni joylashtiring.','Suyuqlikka ta’sir qiling.','Turli nuqtalardagi natijani taqqoslang.']],
    ['l23','pressure',1,'Chuqurlik ortganda suyuqlik bosimi ortishini o‘lchang.',['Datchikni sirtga yaqin tuting.','Uni chuqurroq tushiring.','Bosim ko‘rsatkichlarini taqqoslang.']],
    ['l25','pressure',1,'Havo va suyuqlik bosimini o‘lchagich yordamida taqqoslang.',['Datchikni havoda kuzating.','Uni suvga tushiring.','Balandlik va chuqurlik ta’sirini izohlang.']],
    ['l26','skateBasics',1,'Kuch jismni siljitganda bajarilgan ishni energiya orqali kuzating.',['Jismni balandlikka joylashtiring.','Harakatni boshlang.','Ish va energiya o‘zgarishini bog‘lang.']],
    ['l27','skateBasics',1,'Kinetik va potensial energiyaning almashinishini boshqaring.',['Jismni baland nuqtaga qo‘ying.','Harakatni boshlang.','Energiya ustunlarini kuzating.']],
    ['l31','energy',1,'Jismga energiya berilganda ichki energiya va temperatura qanday o‘zgarishini ko‘ring.',['Materialni tanlang.','Unga energiya bering.','Temperatura o‘zgarishini kuzating.']],
    ['l32','energy',1,'Bir xil energiya turli moddalarni turlicha isitishini tekshiring.',['Ikki xil materialni tanlang.','Ularga teng energiya bering.','Temperatura o‘zgarishini taqqoslang.']],
    ['l34','energy',1,'Issiq va sovuq jismlar issiqlik muvozanatiga kelishini kuzating.',['Turli temperaturali jismlarni tanlang.','Ularni issiqlik aloqasiga keltiring.','Yakuniy temperaturani kuzating.']],
    ['l35','energy',2,'Energiya manbaidan chiqqan energiyaning issiqlikka aylanishini kuzating.',['Energiya manbaini tanlang.','Tizimni ishga tushiring.','Energiya oqimini kuzating.']],
    ['l36','states',2,'Qizdirish va sovitishda bug‘lanish, qaynash va kondensatsiyani kuzating.',['Suyuqlik holatini tanlang.','Temperaturani oshiring.','Sovitib kondensatsiyani kuzating.']],
    ['l37','statesBasics',1,'Qattiq jismning erishi va suyuqlikning qotishini zarrachalar orqali kuzating.',['Qattiq holatni tanlang.','Isitib eriting.','Sovitib qayta qotiring.']],
    ['l39','staticElectricity',1,'Ishqalanishda elektronlar bir jismdan boshqasiga o‘tishini kuzating.',['Sharni matoga ishqalang.','Zaryad belgilarini kuzating.','Sharni devorga yaqinlashtiring.']],
    ['l40','chargesFields',1,'Musbat va manfiy zaryadlarning elektr maydonini kuzating.',['Bitta musbat zaryad qo‘ying.','Manfiy zaryad qo‘shing.','Maydon yo‘nalishini taqqoslang.']],
    ['l43','coulomb',1,'Zaryadlar ishorasi va masofasi o‘zaro ta’sir kuchiga qanday ta’sir qilishini sinang.',['Ikki zaryad tanlang.','Ular orasidagi masofani o‘zgartiring.','Tortishish va itarishni taqqoslang.']],
    ['l45','travoltage',1,'Statik zaryad to‘planishi va razryad hosil bo‘lishini kuzating.',['Oyoqni gilam bo‘ylab harakatlantiring.','Zaryadlar to‘planishini kuzating.','Qo‘lni metallga yaqinlashtiring.']],
    ['l46','circuits',1,'Yopiq zanjirda elektr toki hosil bo‘lishini kuzating.',['Batareya va lampani joylashtiring.','Simlar bilan yopiq zanjir tuzing.','Kalitni ochib-yoping.']],
    ['l47','circuits',1,'Tok manbaining zanjirdagi vazifasini tekshiring.',['Zanjirga batareya ulang.','Lampaning yonishini kuzating.','Batareyalar sonini o‘zgartiring.']],
    ['l48','circuits',1,'Voltmetrni iste’molchiga parallel ulab kuchlanishni o‘lchang.',['Lampali zanjir tuzing.','Voltmetrni parallel ulang.','Kuchlanishni qayd eting.']],
    ['l49','circuits',1,'Ampermetrni ketma-ket ulab tok kuchini o‘lchang.',['Yopiq zanjir tuzing.','Ampermetrni ketma-ket ulang.','Tok kuchini qayd eting.']],
    ['l51','circuits',1,'Bir zanjirda tok kuchi va kuchlanishni to‘g‘ri o‘lchang.',['Ampermetrni ketma-ket ulang.','Voltmetrni parallel ulang.','I va U qiymatlarini yozing.']],
    ['l52','resistance',1,'Sim uzunligi va qalinligi qarshilikka qanday ta’sir qilishini kuzating.',['Sim uzunligini oshiring.','Sim qalinligini o‘zgartiring.','Qarshilik qiymatlarini taqqoslang.']],
    ['l53','resistance',1,'O‘tkazgich parametrlarini o‘zgartirib rezistor va reostat ishini tushuning.',['Materialni tanlang.','Faol uzunlikni o‘zgartiring.','Qarshilikdagi o‘zgarishni kuzating.']],
    ['l54','ohm',1,'Kuchlanish, tok kuchi va qarshilik orasidagi Om qonunini tekshiring.',['Kuchlanishni oshiring.','Tok kuchini kuzating.','Qarshilikni o‘zgartirib taqqoslang.']],
    ['l56','circuits',1,'O‘zgaruvchan qarshilik yordamida tok kuchini rostlang.',['Reostatli zanjir tuzing.','Surilgich holatini o‘zgartiring.','Ampermetr ko‘rsatishini kuzating.']],
    ['l57','ohm',1,'U va I qiymatlarini o‘lchab qarshilik o‘zgarmasligini tekshiring.',['Birinchi U va I juftini qayd eting.','Kuchlanishni o‘zgartiring.','Har safar R = U/I ni hisoblang.']],
    ['l60','light',1,'Yorug‘likning qaytishi va sinishini burchaklar orqali kuzating.',['Lazerni muhit chegarasiga yo‘naltiring.','Tushish burchagini o‘zgartiring.','Qaytgan va singan nurlarni taqqoslang.']],
    ['l61','opticsBasics',1,'Yig‘uvchi va sochuvchi linzalarda nur yo‘lini kuzating.',['Linza turini tanlang.','Buyum masofasini o‘zgartiring.','Tasvir va fokusni kuzating.']],
    ['l62','light',1,'Yassi sirtga tushgan va qaytgan nurlar burchaklarini o‘lchang.',['Lazerni sirtga yo‘naltiring.','Normal chiziqqa nisbatan burchakni o‘lchang.','Tushish va qaytish burchaklarini taqqoslang.']],
  ];

  const usedKeys = [...new Set(rows.map(row => row[1]))];
  const simulations = Object.freeze(Object.fromEntries(
    usedKeys.map(key => [key, Object.freeze({...base.simulations[key], locale: 'uz'})])
  ));

  const lessons = Object.freeze(Object.fromEntries(rows.map(([id, simulation, screen, mission, checklist]) => [
    id,
    Object.freeze({
      id,
      kind: 'official',
      simulation,
      screen,
      mission,
      checklist: Object.freeze(checklist),
      hint: 'Sabab va natijani aniq ko‘rish uchun bir vaqtda faqat bitta parametrni o‘zgartiring.',
    }),
  ])));

  const api = Object.freeze({
    version: '2026.07-grade7-curated',
    simulations,
    lessons,
    catalog: Object.freeze(usedKeys.map(key => Object.freeze({key, ...simulations[key]}))),
    buildUrl: base.buildUrl,
    buildThumbnail: base.buildThumbnail,
  });

  window.IDROK_PHET7 = api;
})();

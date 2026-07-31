(() => {
  'use strict';

  const control = (label, min, max, value, unit = '%') => ({label, min, max, value, unit});
  const labs = [];
  const add = (id, scene, title, role, intro, a, b, goal, actionLabel, challenge, drag = {}) => {
    labs.push({
      id, scene, title, role, intro, controls: {a, b}, goal, actionLabel, challenge,
      drag: {mode: drag.mode || 'xy', x: drag.x ?? .2, y: drag.y ?? .22, label: drag.label || 'Jismni ushlang'},
    });
  };

  add('l1', 'diffusion', 'Diffuziya kamerasi', 'Molekulyar detektiv',
    'Siyoh tomchisini suvga tushiring va temperaturaning diffuziyaga ta’sirini ko‘ring.',
    control('Suv harorati', 5, 90, 22, '°C'), control('Aralashtirish', 0, 100, 15),
    {a: [62, 82], b: [20, 65], dragY: [.55, .86], actions: 1}, 'Siyoh tomizish',
    'Iliq suvni tanlang, tomchini suv ichiga olib boring va siyohni tarqating.', {x: .18, y: .18, label: 'Siyoh tomchisi'});

  add('l2', 'molecule-scale', 'Nanometr ustaxonasi', 'Nano-muhandis',
    'Moy tomchisini yoyib, bir molekula qalinligidagi qatlamni hosil qiling.',
    control('Tomchi hajmi', 1, 20, 6, 'mm³'), control('Sirt maydoni', 10, 100, 35, 'dm²'),
    {a: [4, 9], b: [68, 92], dragY: [.48, .72], actions: 1}, 'Tomchini qo‘yish',
    'Kichik tomchini katta yuzaga yoying va qatlamni bir molekulagacha yupqalashtiring.', {x: .18, y: .2, label: 'Moy tomchisi'});

  add('l3', 'mole-counter', 'Avogadro konveyeri', 'Zarralar hisobchisi',
    'Molekulalar paketini taroziga joylab, modda miqdori bilan zarra sonini bog‘lang.',
    control('Modda miqdori', .1, 5, 1, 'mol'), control('Molyar massa', 2, 80, 18, 'g/mol'),
    {a: [1.8, 2.4], b: [16, 22], dragX: [.48, .67], actions: 1}, 'Paketni sanash',
    '2 mol atrofidagi suv paketini hisoblagich zonasiga olib boring.', {x: .18, y: .62, label: 'Molekula paketi'});

  add('l4', 'molecule-calculator', 'Molekula balans taxtasi', 'Formula strategisti',
    'Massani, molyar massani va zarra sonini muvozanatga keltiring.',
    control('Namuna massasi', 1, 100, 20, 'g'), control('Molyar massa', 2, 100, 40, 'g/mol'),
    {a: [34, 46], b: [16, 24], dragX: [.68, .88], actions: 1}, 'Hisobni tekshirish',
    '40 g namunani 20 g/mol modda bilan tenglashtirib, javob kartasini o‘ng uyaga qo‘ying.', {x: .15, y: .68, label: 'Javob kartasi'});

  add('l5', 'ideal-gas', 'Gaz xossalari laboratoriyasi', 'Gaz muhandisi',
    'Nasos, porshen va isitkich yordamida gaz bosimi, hajmi va temperaturasi bog‘lanishini boshqaring.',
    control('Temperatura', 200, 600, 300, 'K'), control('Zarra soni', 20, 100, 45),
    {a: [360, 450], b: [42, 68], dragY: [.3, .48], actions: 1}, 'Gazni ishga tushirish',
    'Gazni qizdiring, zarra sonini oshiring va porshenni o‘rta balandlikda ushlang.', {x: .5, y: .24, mode: 'y', label: 'Porshen'});

  add('l6', 'temperature', 'Kelvin minorasi', 'Harorat dispetcheri',
    'Issiqlik manbaini termometrga yaqinlashtirib Selsiy va Kelvin shkalalarini taqqoslang.',
    control('Manba quvvati', 0, 100, 28), control('Sovitish oqimi', 0, 100, 20),
    {a: [68, 88], b: [10, 32], dragY: [.66, .86], actions: 1}, 'O‘lchovni yozish',
    'Manbani kolba ostiga olib boring va temperaturani 320–360 K oralig‘iga yetkazing.', {x: .25, y: .72, label: 'Issiqlik manbai'});

  add('l7', 'maxwell', 'Maksvell tezlik arenasi', 'Molekula murabbiyi',
    'Zarralarni tezlik bo‘yicha poygaga qo‘ying va taqsimot cho‘qqisini toping.',
    control('Gaz temperaturasi', 100, 900, 300, 'K'), control('Molekula massasi', 2, 50, 28, 'u'),
    {a: [560, 720], b: [20, 34], dragX: [.52, .72], actions: 1}, 'Poygani boshlash',
    'Gazni qizdiring va marker bilan eng ko‘p uchraydigan tezlik zonasini belgilang.', {x: .24, y: .67, mode: 'x', label: 'Tezlik markeri'});

  add('l8', 'thermal-race', 'Molekulalar tezlik rallisi', 'Tezlik tahlilchisi',
    'Ikki gaz oqimini solishtirib, temperatura oshganda tezlik qanday o‘zgarishini aniqlang.',
    control('Birinchi gaz', 150, 700, 280, 'K'), control('Ikkinchi gaz', 150, 700, 420, 'K'),
    {a: [300, 430], b: [540, 680], dragX: [.78, .92], actions: 1}, 'Start berish',
    'Ikkinchi gazni issiqroq qiling va finish bayrog‘ini yo‘l oxiriga olib boring.', {x: .25, y: .74, mode: 'x', label: 'Finish bayrog‘i'});

  add('l9', 'gas-state', 'p–V–T boshqaruv markazi', 'Gaz navigatori',
    'Holat nuqtasini diagrammada ko‘chiring va ideal gaz tenglamasini muvozanatlang.',
    control('Bosim', 50, 300, 100, 'kPa'), control('Temperatura', 200, 600, 300, 'K'),
    {a: [145, 190], b: [360, 460], dragX: [.58, .78], dragY: [.28, .5], actions: 1}, 'Holatni saqlash',
    'Diagramma nuqtasini maqsad zonasiga olib boring va yangi gaz holatini saqlang.', {x: .3, y: .7, label: 'Holat nuqtasi'});

  add('l10', 'boyle', 'Boyl shprits laboratoriyasi', 'Bosim ustasi',
    'Yopiq shprits porshenini siqib, pV = const qonunini tajribada ko‘ring.',
    control('Boshlang‘ich bosim', 80, 160, 100, 'kPa'), control('Gaz miqdori', 20, 100, 55),
    {a: [95, 115], b: [45, 70], dragX: [.28, .43], actions: 1}, 'Bosimni o‘lchash',
    'Porshenni hajmning taxminan yarmigacha siqing va yangi bosimni o‘lchang.', {x: .78, y: .52, mode: 'x', label: 'Shprits porsheni'});

  add('l11', 'charles', 'Sharl shari', 'Hajm boshqaruvchisi',
    'Kolbadagi gazni qizdirib, o‘zgarmas bosimda shar hajmi qanday ortishini kuzating.',
    control('Gaz temperaturasi', 200, 600, 280, 'K'), control('Tashqi bosim', 80, 130, 100, 'kPa'),
    {a: [430, 540], b: [92, 108], dragY: [.68, .86], actions: 1}, 'Sharni uchirish',
    'Bosimni deyarli o‘zgartirmay kolbani qizdiring va gorelkani tagiga joylashtiring.', {x: .22, y: .72, label: 'Gorelka'});

  add('l12', 'gay-lussac', 'Izoxorik bosim reaktori', 'Reaktor nazoratchisi',
    'Qattiq idishdagi gazni qizdiring va hajm o‘zgarmaganda bosimning ortishini kuzating.',
    control('Temperatura', 200, 700, 290, 'K'), control('Idish mustahkamligi', 40, 100, 75),
    {a: [480, 610], b: [68, 90], dragY: [.12, .35], actions: 1}, 'Klapan testi',
    'Temperaturani oshiring, mustahkamlikni saqlang va datchikni yuqori bosim zonasiga olib boring.', {x: .75, y: .7, mode: 'y', label: 'Bosim datchigi'});

  add('l13', 'oil-film', 'Moy pardasi mikrolabi', 'Nano-o‘lchovchi',
    'Moy tomchisi hajmi va yoyilish yuzasidan molekula o‘lchamini baholang.',
    control('Tomchi hajmi', .1, 5, 1, 'mm³'), control('Yoyilish diametri', 10, 100, 35, 'cm'),
    {a: [.7, 1.3], b: [70, 92], dragX: [.44, .57], dragY: [.42, .58], actions: 1}, 'Pardani o‘lchash',
    '1 mm³ ga yaqin tomchini tray markaziga qo‘yib, uni keng yoying.', {x: .14, y: .18, label: 'Moy pipetkasi'});

  add('l14', 'gas-puzzle', 'Gaz qonunlari seyfi', 'Tenglama buzuvchisi',
    'p, V va T kalitlarini mos uyaga joylashtirib gaz qonunlari seyfini oching.',
    control('Bosim koeffitsiyenti', 1, 5, 2), control('Hajm koeffitsiyenti', 1, 5, 3),
    {a: [1.8, 2.2], b: [2.8, 3.2], dragX: [.7, .88], actions: 1}, 'Seyfni ochish',
    '2 va 3 koeffitsiyentlarini tanlab formula kalitini seyf uyasiga olib boring.', {x: .17, y: .67, label: 'Formula kaliti'});

  add('l15', 'internal-energy', 'Ichki energiya ombori', 'Energiya muhandisi',
    'Zarralar harakati va o‘zaro ta’sir energiyasini bitta omborda boshqaring.',
    control('Temperatura', 100, 800, 300, 'K'), control('Zarralar soni', 10, 100, 40),
    {a: [520, 680], b: [55, 78], dragX: [.55, .74], actions: 1}, 'Energiya yuborish',
    'Zarralarni qizdiring va energiya kapsulasini ombor markaziga joylashtiring.', {x: .14, y: .72, label: 'Energiya kapsulasi'});

  add('l16', 'gas-work', 'Porshen krani', 'Mexanik ish operatori',
    'Kengayayotgan gaz yordamida yukni ko‘taring va A = pΔV ishini kuzating.',
    control('Gaz bosimi', 50, 250, 100, 'kPa'), control('Yuk massasi', 1, 20, 10, 'kg'),
    {a: [150, 205], b: [5, 10], dragY: [.15, .36], actions: 1}, 'Yukni ko‘tarish',
    'Bosimni oshiring, yukni yengillashtiring va porshenni yuqori zonaga ko‘taring.', {x: .52, y: .7, mode: 'y', label: 'Porshen yuki'});

  add('l17', 'heat-quantity', 'Issiqlik yuklash doki', 'Kalorik logist',
    'Massasi va issiqlik sig‘imi turli jismlarni qizdirish uchun energiya taqsimlang.',
    control('Jism massasi', .1, 5, 1, 'kg'), control('Temperatura o‘zgarishi', 5, 100, 20, 'K'),
    {a: [.8, 1.5], b: [45, 70], dragX: [.56, .74], actions: 1}, 'Isitishni boshlash',
    'Yengil jismni 50 K atrofida qizdirib, issiqlik blokini pechga joylashtiring.', {x: .16, y: .65, label: 'Jism bloki'});

  add('l18', 'heat-problem', 'Issiqlik formulalari yo‘li', 'Hisob-kitob poygachisi',
    'Q = cmΔT yo‘lidagi to‘g‘ri darvozalarni tanlab energiya kubini finishga olib boring.',
    control('Solishtirma sig‘im', 100, 4200, 900, 'J/kgK'), control('Temperatura farqi', 5, 80, 20, 'K'),
    {a: [3800, 4200], b: [35, 55], dragX: [.8, .94], actions: 1}, 'Javobni yuborish',
    'Suvning issiqlik sig‘imini tanlang va energiya kubini finish uyasiga olib boring.', {x: .12, y: .7, label: 'Energiya kubi'});

  add('l19', 'thermal-balance', 'Issiq-sovuq muvozanati', 'Muvozanat ustasi',
    'Issiq va sovuq jismlarni aralashtirib yakuniy temperaturani toping.',
    control('Issiq jism', 30, 100, 80, '°C'), control('Sovuq jism', 0, 40, 15, '°C'),
    {a: [68, 86], b: [12, 24], dragX: [.46, .62], dragY: [.46, .7], actions: 1}, 'Aralashtirish',
    'Issiq idishni sovuq idish ustiga olib boring va muvozanatni boshlang.', {x: .2, y: .25, label: 'Issiq idish'});

  add('l20', 'specific-heat', 'Materiallar kalorimetri', 'Material tadqiqotchisi',
    'Qizdirilgan namuna yordamida uning solishtirma issiqlik sig‘imini aniqlang.',
    control('Namuna harorati', 40, 120, 80, '°C'), control('Namuna massasi', .05, 1, .25, 'kg'),
    {a: [86, 105], b: [.18, .35], dragX: [.48, .62], dragY: [.55, .78], actions: 1}, 'O‘lchovni olish',
    'Qizigan metallni kalorimetr suviga tushiring va termometrni o‘qing.', {x: .17, y: .2, label: 'Metall namuna'});

  add('l21', 'fuel', 'Yoqilg‘i energiya stansiyasi', 'Energiya operatori',
    'Turli yoqilg‘ilarning yonish issiqligini qozondagi suv bilan taqqoslang.',
    control('Yoqilg‘i massasi', .1, 5, 1, 'kg'), control('Issiqlik yo‘qotish', 0, 60, 25),
    {a: [1.5, 2.4], b: [5, 25], dragX: [.43, .58], dragY: [.7, .88], actions: 1}, 'Yoqilg‘ini yoqish',
    '2 kg ga yaqin yoqilg‘ini gorelkaga joylashtirib yo‘qotishni kamaytiring.', {x: .15, y: .66, label: 'Yoqilg‘i kapsulasi'});

  add('l22', 'first-law', 'Termodinamika energiya porti', 'Energiya dispetcheri',
    'Berilgan issiqlikni ichki energiya va bajarilgan ish o‘rtasida taqsimlang.',
    control('Berilgan issiqlik', 100, 1000, 500, 'J'), control('Bajarilgan ish', 0, 700, 150, 'J'),
    {a: [620, 780], b: [180, 300], dragX: [.5, .7], actions: 1}, 'Balansni tasdiqlash',
    'Issiqlikni 700 J atrofida, ishni 200–300 J qilib energiya oqimini markazga ulang.', {x: .16, y: .5, label: 'Issiqlik oqimi'});

  add('l23', 'energy-ledger', 'Energiya buxgalteriyasi', 'Termodinamik auditor',
    'Q, A va ΔU kartalarini tarozida muvozanatlab birinchi qonunni tekshiring.',
    control('Q energiya', 100, 900, 450, 'J'), control('A ish', 0, 700, 200, 'J'),
    {a: [540, 680], b: [180, 280], dragX: [.7, .88], actions: 1}, 'Hisobni yopish',
    'Q va A qiymatlarini moslang, ΔU kartasini natija uyasiga olib boring.', {x: .15, y: .66, label: 'ΔU kartasi'});

  add('l24', 'entropy', 'Entropiya xonasi', 'Vaqt yo‘nalishi kuzatuvchisi',
    'Tartibli zarralarni erkin qo‘yib, issiqlik jarayonining nega qaytmasligini kuzating.',
    control('Temperatura farqi', 0, 100, 70, 'K'), control('To‘siq ochilishi', 0, 100, 10),
    {a: [55, 80], b: [78, 100], dragX: [.72, .9], actions: 1}, 'To‘siqni ochish',
    'Temperatura farqini saqlang, to‘siqni oching va uni o‘ng chetga suring.', {x: .5, y: .5, mode: 'x', label: 'Ajratuvchi to‘siq'});

  add('l25', 'water-mixing', 'Suv aralashtirish terminali', 'Issiqlik balanschisi',
    'Ikki haroratdagi suvni aralashtirib berilgan va olingan issiqlikni tenglashtiring.',
    control('Issiq suv', 30, 100, 75, '°C'), control('Sovuq suv', 0, 40, 15, '°C'),
    {a: [65, 82], b: [10, 24], dragY: [.6, .82], actions: 1}, 'Kranlarni ochish',
    'Ikkala suv haroratini sozlang va markaziy klapanni pastga tushirib aralashtiring.', {x: .5, y: .25, mode: 'y', label: 'Aralashtirish klapani'});

  add('l26', 'four-stroke', '4 taktli dvigatel', 'Motor mexanigi',
    'Kirish, siqish, yonish va chiqarish taktlarini krank bilan ketma-ket ishga tushiring.',
    control('Yonilg‘i aralashmasi', 10, 100, 50), control('Aylanish tezligi', 200, 4000, 900, 'rpm'),
    {a: [58, 78], b: [1800, 2800], dragX: [.72, .92], actions: 2}, 'Uchqun berish',
    'Aralashmani sozlang, krankni aylantiring va kamida ikki marta uchqun bering.', {x: .52, y: .72, mode: 'x', label: 'Krank tutqichi'});

  add('l27', 'heat-engine', 'Issiqlik dvigateli sikli', 'Sikl operatori',
    'Isitgich, ishchi gaz va sovitgich orasidagi energiya oqimini boshqaring.',
    control('Isitgich harorati', 300, 1000, 650, 'K'), control('Sovitgich harorati', 200, 500, 300, 'K'),
    {a: [700, 900], b: [240, 330], dragX: [.55, .75], actions: 1}, 'Siklni aylantirish',
    'Katta temperatura farqini yarating va maxovik tutqichini ish zonasiga olib boring.', {x: .35, y: .64, mode: 'x', label: 'Maxovik tutqichi'});

  add('l28', 'efficiency', 'FIK poygasi', 'Energiya poygachisi',
    'Bir xil issiqlikdan ko‘proq foydali ish oladigan dvigatelni finishga olib boring.',
    control('Q₁ issiqlik', 200, 1200, 800, 'J'), control('Q₂ chiqindi', 50, 900, 400, 'J'),
    {a: [760, 940], b: [120, 260], dragX: [.78, .94], actions: 1}, 'Poygani boshlash',
    'Chiqindi issiqlikni kamaytiring va samaradorlik mashinasini finishga olib boring.', {x: .13, y: .68, mode: 'x', label: 'Energiya mashinasi'});

  add('l29', 'eco-engine', 'Toza motor shahri', 'Ekolog-muhandis',
    'Dvigatel quvvati va chiqindi gazlarni muvozanatlab shahar havosini toza saqlang.',
    control('Motor quvvati', 10, 100, 60), control('Filtr samarasi', 0, 100, 25),
    {a: [55, 75], b: [78, 100], dragX: [.62, .8], actions: 1}, 'Filtrni ishga tushirish',
    'Quvvatni saqlab, filtrni kuchaytiring va tozalagichni tutun quvuriga ulang.', {x: .16, y: .7, label: 'Havo filtri'});

  add('l30', 'eco-optimizer', 'Energiya–ekologiya muvozanati', 'Yashil strateg',
    'FIK, yoqilg‘i sarfi va chiqindini bitta boshqaruv panelida optimallashtiring.',
    control('Foydali ish', 10, 100, 45), control('Chiqindi ulushi', 0, 100, 55),
    {a: [72, 90], b: [8, 28], dragX: [.44, .58], actions: 1}, 'Rejani tasdiqlash',
    'FIKni oshiring, chiqindini kamaytiring va balans markerini yashil markazga olib boring.', {x: .18, y: .72, mode: 'x', label: 'Balans markeri'});

  add('l31', 'surface', 'Sirt taranglik ko‘li', 'Suv yuzasi tadqiqotchisi',
    'Ignani suv sirtiga ehtiyotkor qo‘yib, sirt taranglik pardasini ko‘ring.',
    control('Sirt taranglik', 20, 100, 72, 'mN/m'), control('Sovun miqdori', 0, 100, 10),
    {a: [65, 80], b: [0, 18], dragY: [.42, .56], actions: 1}, 'Ignani qo‘yib yuborish',
    'Sovunsiz suvda ignani sirtga juda yaqin olib boring va qo‘yib yuboring.', {x: .2, y: .2, label: 'Yengil igna'});

  add('l32', 'capillary', 'Kapillyar bog‘', 'Mikronay dizayneri',
    'Turli radiusli naylarda suvning ko‘tarilish balandligini kuzating.',
    control('Nay radiusi', .2, 5, 2, 'mm'), control('Ho‘llanish burchagi', 0, 100, 25, '°'),
    {a: [.3, 1.2], b: [5, 35], dragX: [.42, .6], actions: 1}, 'Nayni suvga tushirish',
    'Ingichka nayni tanlang va uni suv idishining markaziga tushiring.', {x: .18, y: .2, label: 'Kapillyar nay'});

  add('l33', 'hydrostatic', 'Gidrostatik to‘g‘on', 'Bosim g‘avvosi',
    'G‘avvosni turli chuqurlikka olib borib p = ρgh bosimini o‘lchang.',
    control('Suyuqlik zichligi', 700, 1400, 1000, 'kg/m³'), control('Suv sathi', 20, 100, 70),
    {a: [950, 1080], b: [65, 85], dragY: [.65, .88], actions: 1}, 'Manometrni o‘qish',
    'Suvni tanlang, idishni to‘ldiring va g‘avvosni chuqur zonaga tushiring.', {x: .25, y: .32, mode: 'y', label: 'Bosim datchigi'});

  add('l34', 'drop-counter', 'Tomchi tarozisi', 'Sirt kuchi o‘lchovchisi',
    'Kapillyardan uzilgan tomchilar soni orqali sirt taranglik koeffitsiyentini toping.',
    control('Kapillyar radiusi', .2, 3, 1, 'mm'), control('Suyuqlik zichligi', 700, 1300, 1000, 'kg/m³'),
    {a: [.7, 1.3], b: [950, 1080], dragY: [.5, .68], actions: 2}, 'Tomchi chiqarish',
    'Nay radiusini sozlang, tomchi kosaga tushadigan balandlikni tanlang va ikki tomchi chiqaring.', {x: .5, y: .26, mode: 'y', label: 'Tomchi'});

  add('l35', 'crystal', 'Kristall quruvchi', 'Panjara arxitektori',
    'Atomlarni tartibli panjaraga yoki amorf to‘plamga joylashtirib xossalarni solishtiring.',
    control('Temperatura', 0, 800, 200, 'K'), control('Sovitish tezligi', 0, 100, 35),
    {a: [120, 280], b: [10, 40], dragX: [.62, .82], dragY: [.35, .68], actions: 1}, 'Atomni joylash',
    'Sekin soviting va atomni kristall panjaradagi bo‘sh uyaga joylashtiring.', {x: .14, y: .7, label: 'Atom'});

  add('l36', 'stress', 'Materiallar sinov mashinasi', 'Mustahkamlik muhandisi',
    'Sterjenni cho‘zib kuchlanish va nisbiy deformatsiya orasidagi bog‘lanishni ko‘ring.',
    control('Tortish kuchi', 0, 1000, 200, 'N'), control('Kesim yuzi', 1, 20, 10, 'mm²'),
    {a: [520, 760], b: [8, 14], dragX: [.74, .9], actions: 1}, 'Sinovni boshlash',
    'Kuchni oshiring va o‘ng jag‘ni elastik chegaraga yaqin olib boring.', {x: .63, y: .52, mode: 'x', label: 'Sinov jag‘i'});

  add('l37', 'spring', 'Prujina katapultasi', 'Elastiklik konstruktori',
    'Prujinani cho‘zib Huk qonuni va potensial energiyani tajribada sinang.',
    control('Prujina qattiqligi', 50, 500, 200, 'N/m'), control('Yuk massasi', .1, 5, 1, 'kg'),
    {a: [180, 250], b: [.7, 1.5], dragY: [.62, .84], actions: 1}, 'Yukni qo‘yib yuborish',
    'Mos qattiqlik va massani tanlab yukni pastga cho‘zing, so‘ng qo‘yib yuboring.', {x: .5, y: .36, mode: 'y', label: 'Prujina yuki'});

  add('l38', 'melting', 'Kristall eritish pechi', 'Faza o‘tishi operatori',
    'Kristall panjarani qizdirib erish va qotish jarayonini zarra darajasida ko‘ring.',
    control('Pech temperaturasi', -20, 500, 40, '°C'), control('Sovitish oqimi', 0, 100, 20),
    {a: [260, 390], b: [0, 25], dragY: [.7, .88], actions: 1}, 'Pechni yoqish',
    'Sovitishni kamaytiring, temperaturani oshiring va isitgichni kristall ostiga olib boring.', {x: .16, y: .7, label: 'Induksiya isitgichi'});

  add('l39', 'latent-heat', 'Yashirin issiqlik platosi', 'Faza diagramma piloti',
    'Qizdirish grafigidagi temperatura o‘zgarmaydigan erish platosini toping.',
    control('Berilgan issiqlik', 0, 600, 120, 'kJ'), control('Modda massasi', .1, 2, .5, 'kg'),
    {a: [300, 440], b: [.35, .75], dragX: [.45, .65], actions: 1}, 'Nuqtani belgilash',
    'Yetarli issiqlik bering va grafik markerini gorizontal erish platosiga olib boring.', {x: .18, y: .72, label: 'Grafik markeri'});

  add('l40', 'evaporation', 'Bug‘lanish shamol tunneli', 'Mikroiqlim muhandisi',
    'Shamol, sirt maydoni va temperaturaning bug‘lanishga ta’sirini boshqaring.',
    control('Havo tezligi', 0, 20, 2, 'm/s'), control('Suyuqlik temperaturasi', 5, 80, 25, '°C'),
    {a: [10, 17], b: [48, 68], dragX: [.18, .35], actions: 1}, 'Ventilyatorni yoqish',
    'Suyuqlikni iliq qiling, kuchli shamol tanlang va ventilyatorni idishga yaqinlashtiring.', {x: .75, y: .53, mode: 'x', label: 'Ventilyator'});

  add('l41', 'atmosphere', 'Bulut fabrikasi', 'Atmosfera kuzatuvchisi',
    'Nam havo paketini balandlikka ko‘tarib bulut, yomg‘ir va shudring hosil qiling.',
    control('Havo namligi', 10, 100, 55), control('Yer temperaturasi', -10, 50, 25, '°C'),
    {a: [75, 95], b: [18, 30], dragY: [.18, .38], actions: 1}, 'Kondensatsiyani boshlash',
    'Namlikni oshiring va havo paketini sovuq yuqori qatlamga ko‘taring.', {x: .3, y: .72, mode: 'y', label: 'Nam havo paketi'});

  add('l42', 'hygrometer', 'Psixrometr stansiyasi', 'Namlik meteorologi',
    'Quruq va ho‘l termometr farqidan nisbiy namlikni aniqlang.',
    control('Quruq termometr', 5, 45, 25, '°C'), control('Ho‘l termometr', 0, 40, 18, '°C'),
    {a: [22, 28], b: [17, 21], dragY: [.58, .8], actions: 1}, 'Jadvaldan topish',
    'Termometrlar farqini 5–8 °C qiling va ho‘l pilikni suv idishiga tushiring.', {x: .68, y: .22, mode: 'y', label: 'Ho‘l pilik'});

  add('l43', 'dew-point', 'Shudring nuqtasi oynasi', 'Kondensatsiya detektivi',
    'Metall oynani sovitib birinchi suv tomchilari paydo bo‘ladigan temperaturani toping.',
    control('Havo temperaturasi', 5, 45, 28, '°C'), control('Nisbiy namlik', 10, 100, 55),
    {a: [24, 32], b: [68, 88], dragY: [.62, .82], actions: 1}, 'Shudringni qayd etish',
    'Namlikni oshiring va sovitgichni oyna tagiga tushirib birinchi tomchini hosil qiling.', {x: .2, y: .2, label: 'Sovitish kapsulasi'});

  add('l44', 'light-speed', 'Yorug‘lik estafetasi', 'Foton vaqt o‘lchovchisi',
    'Aylanuvchi ko‘zgu va uzoq reflektor yordamida yorug‘likning juda katta tezligini o‘lchang.',
    control('Ko‘zgu aylanishi', 100, 2000, 600, 'Hz'), control('Masofa', 1, 50, 12, 'km'),
    {a: [1100, 1500], b: [25, 38], dragX: [.74, .9], actions: 1}, 'Impuls yuborish',
    'Ko‘zguni tez aylantiring, masofani oshiring va reflektorni nur yo‘liga qo‘ying.', {x: .35, y: .5, mode: 'x', label: 'Qaytaruvchi ko‘zgu'});

  add('l45', 'reflection-refraction', 'Lazerli optika stoli', 'Nur yo‘li dizayneri',
    'Lazer, ko‘zgu va shisha blok bilan qaytish va sinish qonunlarini bir sahnada ko‘ring.',
    control('Tushish burchagi', 0, 80, 35, '°'), control('Muhit ko‘rsatkichi', 1, 2.2, 1.5),
    {a: [42, 56], b: [1.4, 1.7], dragX: [.42, .58], dragY: [.45, .62], actions: 1}, 'Lazerni yoqish',
    'Burchakni sozlang va shisha blokni nurning markaziy kesishuviga olib boring.', {x: .72, y: .68, label: 'Shisha blok'});

  add('l46', 'snell-puzzle', 'Snell nishon maydoni', 'Burchak mergani',
    'Sindirilgan nurni harakatlanuvchi nishonga tekkizib Snell qonunini mustahkamlang.',
    control('Tushish burchagi', 5, 80, 30, '°'), control('n₂ ko‘rsatkichi', 1, 2.5, 1.33),
    {a: [42, 58], b: [1.42, 1.65], dragX: [.66, .84], actions: 1}, 'Nur impulsini berish',
    'Burchak va muhitni sozlab nishonni sindirilgan nur yo‘liga olib boring.', {x: .78, y: .72, label: 'Optik nishon'});

  add('l47', 'fiber-optic', 'Optik tola tunneli', 'Foton yo‘naltiruvchisi',
    'Lazer nurini egri optik tola ichida to‘la ichki qaytish bilan manzilga yetkazing.',
    control('Tushish burchagi', 20, 85, 50, '°'), control('Tola ko‘rsatkichi', 1.2, 2, 1.55),
    {a: [58, 76], b: [1.48, 1.7], dragY: [.38, .58], actions: 1}, 'Lazerni yuborish',
    'Kritik burchakdan katta burchak tanlang va lazer manbaini tola kirishiga tekislang.', {x: .13, y: .7, mode: 'y', label: 'Lazer manbai'});

  add('l48', 'tir-game', 'Prizma lazer labirinti', 'Optik strateg',
    'Prizmalar ichidagi to‘la ichki qaytishlar yordamida lazer nurini detektorga olib boring.',
    control('Nur burchagi', 20, 85, 45, '°'), control('Prizma ko‘rsatkichi', 1.2, 2.4, 1.6),
    {a: [56, 72], b: [1.5, 1.82], dragX: [.74, .9], dragY: [.22, .44], actions: 1}, 'Impuls yuborish',
    'Kritik burchakni saqlang va detektorni labirint chiqishidagi nurga tuting.', {x: .75, y: .75, label: 'Foton detektori'});

  add('l49', 'glass-index', 'Shisha indeks skaneri', 'Optik metrolog',
    'Yarim doira shisha va transportir bilan nur sindirish ko‘rsatkichini o‘lchang.',
    control('Tushish burchagi', 5, 75, 40, '°'), control('Shisha turi', 1.3, 2, 1.5),
    {a: [38, 48], b: [1.45, 1.58], dragX: [.44, .56], dragY: [.42, .58], actions: 1}, 'Burchakni o‘lchash',
    'Oddiy shishani tanlang va lazer nuqtasini markazga aniq olib boring.', {x: .16, y: .7, label: 'Lazer nuqtasi'});

  add('l50', 'lens-types', 'Linza shakllantiruvchi', 'Optik konstruktor',
    'Linza qalinligi va egriligini o‘zgartirib yig‘uvchi yoki sochuvchi nur hosil qiling.',
    control('Linza egriligi', -100, 100, 45), control('Material indeksi', 1, 2, 1.5),
    {a: [35, 65], b: [1.42, 1.62], dragX: [.46, .56], actions: 1}, 'Nurni tekshirish',
    'Qavariq linza yarating va uni parallel nurlar markaziga joylashtiring.', {x: .18, y: .5, mode: 'x', label: 'Linza'});

  add('l51', 'image-bench', 'Tasvir yasash skameykasi', 'Tasvir rejissyori',
    'Sham, linza va ekranni surib aniq teskari tasvir hosil qiling.',
    control('Fokus masofasi', 5, 40, 18, 'cm'), control('Buyum masofasi', 10, 100, 45, 'cm'),
    {a: [15, 22], b: [38, 55], dragX: [.72, .88], actions: 1}, 'Fokusni qulflash',
    'Fokus va buyum masofasini sozlab ekranni ravshan tasvir nuqtasiga olib boring.', {x: .82, y: .52, mode: 'x', label: 'Ekran'});

  add('l52', 'lens-puzzle', 'Linza tasvir jumboqchasi', 'Optik masala yechuvchi',
    'Berilgan fokusda buyumni surib kerakli kattalikdagi haqiqiy tasvirni toping.',
    control('Fokus masofasi', 5, 30, 12, 'cm'), control('Tasvir kattaligi', .2, 4, 1),
    {a: [10, 15], b: [1.7, 2.5], dragX: [.2, .35], actions: 1}, 'Javobni tekshirish',
    'Tasvirni taxminan ikki marta kattalashtiring va buyumni kerakli masofaga olib boring.', {x: .12, y: .52, mode: 'x', label: 'Yorug‘ buyum'});

  add('l53', 'optical-power', 'Dioptriya ustaxonasi', 'Linza ustasi',
    'Linza egriligini silliqlab uning fokus masofasi va optik kuchini sozlang.',
    control('Fokus masofasi', .1, 2, .5, 'm'), control('Silliqlash darajasi', 0, 100, 25),
    {a: [.22, .38], b: [58, 82], dragY: [.4, .62], actions: 1}, 'Dioptriyani o‘lchash',
    'Linza fokusini 0.25–0.4 m oralig‘iga keltirib, silliqlash diskini markazga tushiring.', {x: .72, y: .2, mode: 'y', label: 'Silliqlash diski'});

  add('l54', 'microscope', 'Mikroskop ichiga sayohat', 'Mikroolam navigatori',
    'Preparat, obyektiv va okulyarni moslab hujayra tasvirini ravshanlashtiring.',
    control('Obyektiv kattalashtirishi', 4, 100, 20, '×'), control('Okulyar kuchi', 5, 30, 10, '×'),
    {a: [35, 60], b: [8, 14], dragY: [.48, .64], actions: 1}, 'Fokuslash',
    'Obyektivni kuchaytiring va preparat stolini fokus zonasiga ko‘taring.', {x: .5, y: .72, mode: 'y', label: 'Preparat stoli'});

  add('l55', 'eye', 'Ko‘z fokus trenajyori', 'Ko‘rish fiziologi',
    'Buyum masofasi o‘zgarganda ko‘z gavhari egriligini moslab tasvirni to‘r pardaga tushiring.',
    control('Buyum masofasi', .2, 20, 2, 'm'), control('Akkomodatsiya', 0, 100, 45),
    {a: [1.5, 3.5], b: [48, 68], dragX: [.72, .9], actions: 1}, 'Tasvirni tekshirish',
    'Buyumni o‘rta masofaga qo‘ying va to‘r parda markerini fokus nuqtasiga olib boring.', {x: .55, y: .52, mode: 'x', label: 'To‘r parda markeri'});

  add('l56', 'glasses', 'Ko‘zoynak diagnostikasi', 'Optometrist',
    'Yaqinni va uzoqni ko‘rish nuqsoniga mos linzani tanlab tasvirni tuzating.',
    control('Ko‘z nuqsoni', -6, 6, -2, 'dptr'), control('Linza kuchi', -6, 6, 0, 'dptr'),
    {a: [-3, -1], b: [1, 3], dragX: [.42, .58], actions: 1}, 'Ko‘rishni sinash',
    'Manfiy nuqson uchun mos musbat linzani tanlab ko‘z oldiga joylashtiring.', {x: .16, y: .52, mode: 'x', label: 'Ko‘zoynak linzasi'});

  add('l57', 'solar', 'Quyosh izlovchi stansiya', 'Geliotexnik muhandis',
    'Panel burchagi, Quyosh balandligi va bulutlilikni boshqarib maksimal energiya oling.',
    control('Panel burchagi', 0, 90, 25, '°'), control('Bulutlilik', 0, 100, 35),
    {a: [42, 58], b: [0, 18], dragX: [.52, .72], dragY: [.12, .32], actions: 1}, 'Energiyani yig‘ish',
    'Bulutlarni kamaytiring, panelni mos burchakka burang va Quyoshni optimal zonaga olib boring.', {x: .25, y: .22, label: 'Quyosh'});

  add('l58', 'unified', 'To‘rt kuch observatoriyasi', 'Olam xaritachisi',
    'Gravitatsion, elektromagnit, kuchli va kuchsiz ta’sirlarni masshtab bo‘yicha taqqoslang.',
    control('Masshtab', 1, 100, 25), control('Energiya darajasi', 1, 100, 45),
    {a: [68, 88], b: [62, 82], dragX: [.44, .58], dragY: [.42, .58], actions: 1}, 'Kuchlarni birlashtirish',
    'Yuqori energiya va kichik masshtabni tanlab zarrachani markaziy maydonga olib boring.', {x: .16, y: .72, label: 'Sinov zarrachasi'});

  add('l59', 'innovation', 'O‘zbekiston fizika kelajagi', 'Ilmiy loyiha rahbari',
    'Quyosh, optika va materialshunoslik modullarini bitta yangi texnologiyaga birlashtiring.',
    control('Tadqiqot energiyasi', 10, 100, 45), control('Aniqlik darajasi', 10, 100, 50),
    {a: [78, 96], b: [78, 96], dragX: [.72, .9], actions: 2}, 'Prototipni ishga tushirish',
    'Energiya va aniqlikni oshiring, modulni prototip uyasiga joylashtiring va ikki test bajaring.', {x: .15, y: .7, label: 'Innovatsiya moduli'});

  window.IDROK_LABS = labs;
})();

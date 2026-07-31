(() => {
  'use strict';

  const course = window.PHYSICS_COURSE;
  if (!course || course.grade !== 7 || !Array.isArray(course.lessons)) return;

  const simulationIds = new Set([
    'l5', 'l7', 'l8', 'l9', 'l11', 'l12', 'l16', 'l17', 'l18', 'l19',
    'l22', 'l23', 'l25', 'l26', 'l27', 'l31', 'l32', 'l34', 'l35', 'l36',
    'l37', 'l39', 'l40', 'l43', 'l45', 'l46', 'l47', 'l48', 'l49', 'l51',
    'l52', 'l53', 'l54', 'l56', 'l57', 'l60', 'l61', 'l62',
  ]);

  const youtube = (id, title) => ({
    id,
    title,
    source: `https://www.youtube.com/watch?v=${id}`,
    embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
    provider: 'O‘zbekcha videodars',
    type: 'youtube',
    verified: true,
  });

  const videos = {
    l5: youtube('g9IhBrINJ_s', 'Skalyar va vektor kattaliklar'),
    l7: youtube('eiPhgRtdgVA', 'Mexanik harakat, nisbiylik va sanoq sistemasi'),
    l8: youtube('hRbqN6Si-Nk', 'Moddiy nuqta, trayektoriya, yo‘l va ko‘chish'),
    l9: youtube('xQ2unENG9NM', 'Tezlik va to‘g‘ri chiziqli tekis harakat'),
    l10: youtube('R23u5WDG8Tc', 'Tekis harakatda tezlik va yo‘l grafigi'),
    l11: youtube('n-tl9sC61cI', 'Notekis harakat, o‘rtacha va oniy tezlik'),
    l14: youtube('JYLwXyXrb-M', 'Aylanma harakatga kirish'),
    l15: youtube('j_f--ZWADfY', 'Aylanma harakat: davr va chastota'),
    l19: youtube('SVRcp0NtbNM', 'Dinamikaga kirish: kuch'),
    l23: youtube('YlP-fSsKsTo', 'Suyuqlik ustunining bosimi'),
    l31: youtube('S_g1aOUkoJA', 'Ichki energiya va termodinamikaning birinchi qonuni'),
    l32: youtube('4wvQrvir44o', 'Issiqlik sig‘imi, suyuqlanish va qaynash issiqligi'),
    l34: {
      id: 'trm-1731579088',
      title: 'Turli temperaturali suvlar aralashganda issiqlik almashinuvi',
      source: 'https://raqamlitalim.trm.uz/labs/fizika/9-sinf/2/11/86',
      embed: 'https://raqamlitalim.trm.uz/uploads/lab_sim/1731579088.mp4',
      provider: 'Raqamli ta’lim',
      type: 'mp4',
      verified: true,
    },
    l35: youtube('3g5RegoDxFY', 'Yoqilg‘ining solishtirma yonish issiqligi'),
    l36: youtube('45KZFUbJV4g', 'Bug‘lanish, kondensatsiya va qaynash'),
    l37: youtube('3GOjgEIMO4o', 'Kristall jismlarning erishi va qotishi'),
    l45: youtube('eHeR5V188SQ', 'Atmosferadagi elektr hodisalari'),
    l51: youtube('9YQ9irb1FxM', 'Voltmetr va ampermetr bilan o‘lchash'),
    l54: youtube('ob4F2SiSWa8', 'Zanjirning bir qismi uchun Om qonuni'),
    l60: youtube('AO2ZUqnbCcY', 'Yorug‘likning sinish qonuni'),
    l61: youtube('xizixoPywmo', 'Qavariq linza va tasvir hosil bo‘lishi'),
  };

  const telegram = (post, title, channel = 'Fizikadan_tajribalar') => ({
    id: `${channel}-${post}`,
    title,
    source: `https://t.me/${channel}/${post}`,
    embed: `https://t.me/${channel}/${post}?embed=1&mode=tme`,
    provider: 'Qiziqarli fizika tajribalari',
    type: 'telegram',
    verified: true,
  });

  const experimentVideos = {
    l20: telegram(7, 'Bosim kuchi va ta’sir yuzasi', 'pizik_lab'),
    l22: telegram(163, 'Gidravlik pressning ishlashi'),
    l23: telegram(153, 'Suyuqlik bosimi kuchi'),
    l27: telegram(362, 'Energiyaning bir turdan boshqasiga aylanishi'),
    l31: telegram(605, 'Ichki energiyaning jismlar orasida uzatilishi'),
    l36: telegram(423, 'Bug‘lanish va kondensatsiyaga oid tajriba'),
    l37: telegram(151, 'Sovitish va fazaviy o‘tishga oid tajriba'),
    l45: telegram(488, 'Elektr razryadi va yuqori kuchlanish'),
    l60: telegram(154, 'Suvda yorug‘lik nurining sinishi'),
    l61: telegram(499, 'Linza yordamida tasvir hosil qilish'),
  };

  const experiments = [
    'Quyoshli kunda tik tayoq soyasining yo‘nalishi va uzunligini ertalab, tushda va kechga yaqin o‘lchang. Natijalarni jadvalga yozib, qadimgi olimlar vaqt va osmon jismlarini kuzatishda o‘lchashdan qanday foydalanganini tushuntiring.',
    'O‘zbekistonlik fizik olimlardan birini tanlang. Uning ilmiy yo‘nalishini bitta chizma, kundalik hayot misoli va uch jumlalik izoh orqali sinfdoshingizga taqdim eting.',
    'Stol uzunligini millimetr, santimetr va metrda o‘lchang. Har bir natijani SI birligiga aylantiring va chizg‘ichning eng kichik bo‘linmasi o‘lchash aniqligiga qanday ta’sir qilganini yozing.',
    'Oddiy mayatnik yasang. Ip uzunligini o‘zgartirib, har safar 10 ta tebranish vaqtini o‘lchang. Kuzatish, faraz, tajriba natijasi va xulosani alohida yozing.',
    'Katakli qog‘ozda ikki xil yo‘nalishdagi vektorni strelka bilan chizing. Ularni parallelogramm usulida qo‘shing va natijaviy vektorning son qiymati bilan yo‘nalishini alohida ko‘rsating.',
    'Xona rejasida 1 santimetr 1 metrga teng masshtab tanlang. Ikki ketma-ket ko‘chishni vektorlar bilan chizib, natijaviy ko‘chishning uzunligi va yo‘nalishini aniqlang.',
    'O‘yinchoq mashinani stol bo‘ylab yurgizing. Stol, mashina va devorni sanoq jismi qilib tanlaganda “harakatda” va “tinch” degan xulosalar qanday o‘zgarishini yozing.',
    'Qog‘ozda egri yo‘l chizing. Ip bilan trayektoriya uzunligini, chizg‘ich bilan boshlang‘ich va oxirgi nuqta orasidagi ko‘chishni o‘lchang va ularni taqqoslang.',
    'O‘yinchoq mashina bir xil vaqt oralig‘ida bosib o‘tgan masofalarni belgilang. Masofalar teng bo‘lsa, harakatni tekis deb asoslang va tezlikni hisoblang.',
    'Yo‘lakda ma’lum masofani bosib o‘tish vaqtini o‘lchang. Tezlikni hisoblab, masofa–vaqt va tezlik–vaqt grafigini katakli qog‘ozda chizing.',
    'O‘yinchoq mashinani qiya taxtadan tushiring va teng vaqt oralig‘idagi joylarini belgilang. Oraliqlar nega kattalashganini tezlikning o‘zgarishi bilan izohlang.',
    'Notekis yurgan o‘yinchoq mashinaning umumiy yo‘li va vaqtini o‘lchang. O‘rtacha tezlikni hisoblang va uning har bir ondagi tezlik bilan bir xil emasligini tushuntiring.',
    'Harakat yo‘lini uch bo‘lakka ajratib, har bir bo‘lakdagi masofa va vaqtni o‘lchang. Bo‘lak tezliklari bilan umumiy o‘rtacha tezlikni taqqoslang.',
    'Ipga kichik yumshoq jism bog‘lab aylantiring. Ip tarangligi jismni aylana markaziga tortishini va ip qo‘yib yuborilganda jism urinma yo‘nalishda ketishini kuzating.',
    'Ventilyator yoki soat mili bir daqiqada nechta aylanish qilishini sanang. Davr va chastotani hisoblab, ular o‘zaro teskari kattalik ekanini tekshiring.',
    'Tarozi yordamida bir nechta kichik jismlarning massasini o‘lchang. Bir xil ko‘rinishdagi, lekin turli materialdan yasalgan jismlar massasini taqqoslang.',
    'Bir xil hajmli yog‘och, plastmassa va metall jismlarning massasini o‘lchang. Har biri uchun zichlikni hisoblab, qaysi material zichroq ekanini aniqlang.',
    'Noto‘g‘ri shakldagi tosh massasini tarozida o‘lchang, hajmini esa menzurkadagi suv sathi o‘zgarishidan toping. Zichlikni hisoblab, material jadvali bilan solishtiring.',
    'Ikki bir xil o‘yinchoq mashinani qarama-qarshi yo‘nalishda prujina yoki siqilgan rezina yordamida itaring. Jismlar bir-biriga teng va qarama-qarshi ta’sir ko‘rsatishini kuzating.',
    'Qalamning o‘tkir va to‘mtoq uchini bir xil kuch bilan yumshoq gubkaga bosing. Ta’sir yuzi kichrayganda bosim qanday o‘zgarishini izohlang.',
    'Kitobni avval keng yuzi, keyin ingichka qirrasi bilan gubka ustiga qo‘ying. Har ikki holat uchun bosimni hisoblab, iz chuqurligini taqqoslang.',
    'Suv bilan to‘ldirilgan va shlang bilan ulangan ikki shpritsdan gidravlik qurilma yasang. Bir porshenga bosilganda ikkinchi porshen qanday harakat qilishini kuzating.',
    'Plastik idishning turli chuqurliklariga uchta kichik teshik ochib, suv bilan to‘ldiring. Pastki teshikdan suv uzoqroqqa otilishining sababini bosim bilan tushuntiring.',
    'Turli chuqurlikdagi suyuqlik bosimini p = ρgh orqali hisoblang. Tajribadagi suv oqimi masofalari bilan hisoblangan bosimlarni solishtiring.',
    'Stakanni suv bilan to‘ldirib, ustini qalin qog‘oz bilan yoping va ehtiyotkorlik bilan ag‘daring. Qog‘oz tushmay turishiga atmosfera bosimi qanday yordam berishini izohlang.',
    'Kitobni stol ustida bir xil yo‘lga sekin va tez suring. Kuch va yo‘l bir xil bo‘lsa, bajarilgan mexanik ish tezlikka emas, kuch bilan ko‘chishga bog‘liqligini tekshiring.',
    'Kichik to‘pni qiya yo‘lning turli balandliklaridan qo‘yib yuboring. Balandlikdagi potensial energiya harakat davomida kinetik energiyaga aylanishini kuzating.',
    'Bir xil massali to‘pni ikki xil balandlikdan tushiring. mgh orqali boshlang‘ich potensial energiyalarni hisoblab, pastdagi tezliklar nega turlicha bo‘lishini tushuntiring.',
    'Bir xil zinadan odatiy yurib va tez ko‘tariling. Har ikki holatda ish bir xil, vaqt esa turlicha ekanini ko‘rsatib, quvvatni hisoblang.',
    'Bir xil yukni bir xil balandlikka ikki xil vaqtda ko‘taring. A = mgh va P = A/t yordamida qaysi holatda quvvat katta bo‘lganini aniqlang.',
    'Kaftlaringizni avval sekin, keyin tez ishqalang. Mexanik ish ichki energiyaga aylanganda temperatura qanday o‘zgarishini sezib, sababini yozing.',
    'Teng massali suv va o‘simlik moyini bir xil iliq suv hammomida isitib, temperaturalarini teng vaqt oralig‘ida o‘lchang. Moddalarning solishtirma issiqlik sig‘imi turlicha ekanini tahlil qiling.',
    'Q = cmΔT formulasi bilan uch xil masalani yeching. Massa yoki temperatura o‘zgarishi ikki marta ortganda kerakli issiqlik miqdori qanday o‘zgarishini jadvalda ko‘rsating.',
    'Bir idishdagi iliq suvni sovuq suv bilan aralashtirib, boshlang‘ich va yakuniy temperaturalarni o‘lchang. Issiq suv bergan va sovuq suv olgan issiqlik miqdorlarini taqqoslang.',
    'Turli yoqilg‘ilar jadvalidagi solishtirma yonish issiqliklarini taqqoslang. Bir xil energiya olish uchun qaysi yoqilg‘idan kamroq massa kerakligini hisoblang; olov bilan tajriba o‘tkazmang.',
    'Ikki bir xil nam matodan birini iliq, shamollatiladigan joyga, ikkinchisini salqin joyga qo‘ying. Qaysi biri tez qurishini kuzatib, bug‘lanish tezligiga temperatura va havo oqimi ta’sirini tushuntiring.',
    'Muz bo‘lagining erish vaqtini va suvning muzlatkichda qotishini kuzating. Fazaviy o‘tish vaqtida modda holati o‘zgarishini zarrachalar modeli orqali izohlang.',
    'Erish, qaynash va kondensatsiya uchun berilgan issiqlik miqdorlarini formulalar yordamida hisoblang. Qaysi bosqichda temperatura o‘zgarmasligini grafikda belgilang.',
    'Havo sharini sochga ishqalab, mayda qog‘oz bo‘laklariga yaqinlashtiring. Zaryad ko‘chishi va elektr tortishish hodisasini kuzating.',
    'Ikki tasma qog‘ozni bir xil matoga ishqalab osib qo‘ying. Bir xil ishorali zaryadlar itarishini, qarama-qarshi ishorali zaryadlar esa tortishini sinang.',
    'Shisha idish, metall sim va yupqa folgadan oddiy elektroskop yasang. Zaryadlangan taroq yaqinlashtirilganda folga yaproqchalari nega ajralishini tushuntiring.',
    'Batareya va kichik lampadan foydalanib, metall, grafit, plastik va quruq yog‘ochning elektr o‘tkazuvchanligini tekshiring. Natijalarni o‘tkazgich va dielektrik guruhlariga ajrating.',
    'Ikkita zaryadlangan shar orasidagi masofani o‘zgartiring. Masofa ortganda o‘zaro ta’sir kuchi kamayishini kuzatib, Kulon qonuni bilan bog‘lang.',
    'Metall bankani zaryadlangan jismga yaqinlashtiring. Erkin zaryadlar o‘tkazgich sirtida qayta taqsimlanishini chizma orqali ko‘rsating.',
    'Havo sharini sochga ishqalab, metall buyumga yaqinlashtiring. Kichik elektr razryadi paydo bo‘lsa, uning chaqmoq bilan umumiy sababini xavfsiz masofadan izohlang.',
    'Batareya, kalit, sim va kichik lampadan yopiq zanjir tuzing. Kalit ochiq va yopiq bo‘lganda lampaning holatini kuzatib, tok uchun yopiq yo‘l zarurligini tushuntiring.',
    'Limon, ikki xil metall plastinka va voltmetr yordamida sodda tok manbai tuzing. Kimyoviy energiyaning elektr energiyasiga aylanishini kuzating; limonni iste’mol qilmang.',
    'Oddiy zanjirda voltmetrni lampaga parallel ulang. Bir va ikki batareya bilan kuchlanishni o‘lchab, natijalarni taqqoslang.',
    'Oddiy zanjirda ampermetrni ketma-ket ulang. Qarshilik o‘zgarganda tok kuchi qanday o‘zgarishini o‘lchang.',
    'Berilgan tok kuchi, zaryad va vaqt qiymatlari uchun I = q/t formulasi bilan hisoblang. Natijalarni amperda yozib, birliklarning mosligini tekshiring.',
    'Bitta zanjirda ampermetrni ketma-ket, voltmetrni lampaga parallel ulang. Ikkala asbob ko‘rsatishini bir vaqtda yozib, ulanish qoidalarini chizmada belgilang.',
    'Bir xil materialdan tayyorlangan turli uzunlik va qalinlikdagi simlarni taqqoslang. Uzunlik ortishi va kesim yuzasi kattalashishi qarshilikka qanday ta’sir qilishini izohlang.',
    'Grafit qalam izi ustida ikki kontakt orasidagi masofani o‘zgartirib qarshilikni o‘lchang. Faol uzunlik o‘zgarganda reostatning ishlash tamoyilini tushuntiring.',
    'Rezistorli zanjirda kuchlanishni bosqichma-bosqich o‘zgartirib, tok kuchini o‘lchang. U/I nisbatini har safar hisoblab, qarshilik o‘zgarmasligini tekshiring.',
    'Om qonuniga oid uchta masalani yeching. U ikki marta ortganda yoki R ikki marta kamayganda I qanday o‘zgarishini jadvalda ko‘rsating.',
    'Reostatni lampali zanjirga ketma-ket ulang. Surilgichni siljitib, lampaning yorqinligi va ampermetr ko‘rsatkichi qanday o‘zgarishini kuzating.',
    'Rezistor uchun kamida beshta U va I juftligini o‘lchang. U–I grafigini chizib, chiziqning qiyaligi orqali qarshilikni aniqlang.',
    'Uchta kartonda bir balandlikda kichik teshik oching. Sham yoki fonar nurini teshiklardan o‘tkazib, kartonlardan biri siljitilganda nur nega ko‘rinmay qolishini tushuntiring.',
    'Chiroq, katta va kichik shar yordamida Quyosh–Yer–Oy modelini tuzing. Soyalar joylashuvini o‘zgartirib, Quyosh va Oy tutilishi holatlarini ajrating.',
    'Lazer ko‘rsatkichni ko‘zga yo‘naltirmasdan, suv yuzasi va yassi ko‘zguga tushiring. Tushish, qaytish va sinish burchaklarini transportir bilan o‘lchab taqqoslang.',
    'Qavariq linza yordamida uzoqdagi yorug‘ obyekt tasvirini oq qog‘ozga tushiring. Linza bilan ekran masofasini o‘zgartirib, fokus holatini toping.',
    'Yassi ko‘zgu, qog‘oz va transportirdan foydalanib, uch xil tushish burchagida qaytish burchagini o‘lchang. Ikkala burchak tengligini jadval bilan tekshiring.',
  ];

  const summaries = [
    'O‘rta Osiyo allomalari kuzatish, o‘lchash va hisoblash orqali fizika hamda astronomiya rivojiga katta hissa qo‘shgan. Al-Xorazmiy, Forobiy, Ibn Sino, Beruniy, Farg‘oniy va Ulug‘bekning ilmiy merosi bugungi fan uchun ham muhimdir.',
    'O‘zbekiston fiziklari yadro fizikasi, Quyosh energetikasi, yarimo‘tkazgichlar, optika va yuqori energiyalar sohalarida ilmiy maktablar yaratgan. Ularning tadqiqotlari zamonaviy texnika va energetika rivojiga xizmat qiladi.',
    'Fizik kattalik son qiymati, belgisi va o‘lchov birligi bilan ifodalanadi. Xalqaro birliklar sistemasi turli o‘lchash natijalarini yagona va tushunarli ko‘rinishga keltiradi.',
    'Fizik tadqiqot kuzatish, muammoni belgilash, faraz tuzish, tajriba o‘tkazish, natijani tahlil qilish va xulosa chiqarish bosqichlaridan iborat.',
    'Faqat son qiymatiga ega kattalik skalyar, son qiymati bilan birga yo‘nalishga ega kattalik esa vektor kattalik deyiladi. Vektor uzunligi uning modulini, strelka esa yo‘nalishini ko‘rsatadi.',
    'Ushbu darsda fizik kattaliklarni SI birliklariga keltirish, vektorlarni chizish va ularni geometrik usulda qo‘shishga oid masalalar bosqichma-bosqich yechiladi.',
    'Jismning boshqa jismlarga nisbatan vaziyati vaqt davomida o‘zgarsa, u mexanik harakatda bo‘ladi. Harakat yoki tinchlik holati tanlangan sanoq jismiga bog‘liq.',
    'Moddiy nuqta, trayektoriya, yo‘l va ko‘chish kinematikaning asosiy tushunchalaridir. Yo‘l trayektoriya uzunligi, ko‘chish esa boshlang‘ich nuqtadan oxirgi nuqtaga yo‘nalgan vektordir.',
    'To‘g‘ri chiziqli tekis harakatda jism teng vaqt oralig‘ida teng masofa bosib o‘tadi. Tezlik bosib o‘tilgan yo‘lning sarflangan vaqtga nisbatiga teng.',
    'Tekis harakatga oid masalalarda masofa, tezlik va vaqt orasidagi bog‘lanish ishlatiladi. Grafiklar harakatni ko‘rish va noma’lum kattalikni topishga yordam beradi.',
    'Notekis harakatda jism teng vaqt oralig‘ida turli masofalarni bosib o‘tadi. O‘rtacha tezlik umumiy yo‘lni umumiy vaqtga bo‘lish orqali aniqlanadi.',
    'Laboratoriya ishida jismning bosib o‘tgan yo‘li va harakat vaqti o‘lchanib, notekis harakatning o‘rtacha tezligi tajriba orqali aniqlanadi.',
    'Notekis harakat masalalarida yo‘lning barcha bo‘laklari va ularga ketgan vaqtlar qo‘shiladi. O‘rtacha tezlik alohida tezliklarning oddiy o‘rtachasi bo‘lavermaydi.',
    'Aylana bo‘ylab harakat davr, chastota va aylanishlar soni bilan tavsiflanadi. Davr bitta to‘liq aylanish vaqti, chastota esa vaqt birligidagi aylanishlar sonidir.',
    'Aylanma harakat masalalarida davr, chastota, vaqt va aylanishlar soni orasidagi bog‘lanishlar qo‘llanadi. Davr bilan chastota o‘zaro teskari kattaliklardir.',
    'Massa jismning inertlik xossasini ifodalovchi fizik kattalikdir. Uning SI birligi kilogramm bo‘lib, massa tarozi yordamida o‘lchanadi.',
    'Zichlik modda massasining uning hajmiga nisbatiga teng. Bir xil hajmli jismlardan massasi kattaroq bo‘lgani zichroq modda hisoblanadi.',
    'Laboratoriya ishida to‘g‘ri va noto‘g‘ri shakldagi jismlarning massasi hamda hajmi o‘lchanib, ularning zichligi hisoblanadi.',
    'Kuch jismlarning o‘zaro ta’sirini ifodalaydi va jismning tezligi, harakat yo‘nalishi yoki shaklini o‘zgartirishi mumkin. Kuchning SI birligi nyutondir.',
    'Bosim sirtga tik ta’sir qiluvchi kuchning shu sirt yuzasiga nisbatiga teng. Bir xil kuch kichikroq yuzaga ta’sir qilsa, bosim kattaroq bo‘ladi.',
    'Bosimga oid masalalarda kuch, tayanch yuzasi va bosim orasidagi bog‘lanish ishlatiladi. Barcha kattaliklar hisoblashdan oldin SI birliklariga keltiriladi.',
    'Paskal qonuniga ko‘ra, berk suyuqlik yoki gazga berilgan tashqi bosim barcha yo‘nalishda o‘zgarishsiz uzatiladi. Bu qoida gidravlik qurilmalarning asosidir.',
    'Tinch suyuqlik ichidagi bosim suyuqlik zichligi, erkin tushish tezlanishi va chuqurlikka bog‘liq. Chuqurlik ortgan sari gidrostatik bosim ham ortadi.',
    'Suyuqlik bosimiga oid masalalarda p = ρgh munosabati ishlatiladi. Bosim kuchini topishda bosim natijasi sirt yuzasiga ko‘paytiriladi.',
    'Atmosfera Yer atrofini o‘rab turgan havo qobig‘idir va o‘z og‘irligi tufayli barcha jismlarga bosim beradi. Atmosfera bosimi barometr bilan o‘lchanadi.',
    'Mexanik ish kuch ta’sirida jism ma’lum masofaga ko‘chganda bajariladi. Kuch bilan ko‘chish bir yo‘nalishda bo‘lsa, ish ularning ko‘paytmasiga teng.',
    'Kinetik energiya harakatga, potensial energiya esa jismlarning o‘zaro joylashuvi yoki deformatsiyasiga bog‘liq. Yopiq tizimda energiya bir turdan boshqasiga aylanadi.',
    'Mexanik energiyaga oid masalalarda kinetik va potensial energiya formulalari hamda energiyaning saqlanish qonuni qo‘llanadi.',
    'Quvvat ish bajarilish tezligini ko‘rsatadi va bajarilgan ishning vaqtga nisbatiga teng. Bir xil ishni qisqaroq vaqtda bajargan qurilma quvvatliroqdir.',
    'Ish va quvvat masalalarida kuch, masofa, vaqt va energiya orasidagi bog‘lanishlar qo‘llanadi. Natijalar joul va vatt birliklarida ifodalanadi.',
    'Ichki energiya jism zarralarining tartibsiz harakat kinetik energiyasi va ularning o‘zaro ta’sir potensial energiyasi yig‘indisidir.',
    'Issiqlik miqdori issiqlik almashinuvida jism olgan yoki bergan energiyani ifodalaydi. U massa, solishtirma issiqlik sig‘imi va temperatura o‘zgarishiga bog‘liq.',
    'Issiqlik miqdoriga oid masalalarda massa, temperatura o‘zgarishi va solishtirma issiqlik sig‘imi SI birliklarida olinib, Q = cmΔT formulasi qo‘llanadi.',
    'Issiq va sovuq suv aralashtirilganda issiq suv energiya beradi, sovuq suv esa energiya oladi. Issiqlik yo‘qotilishi kichik bo‘lsa, berilgan va olingan issiqlik miqdorlari teng bo‘ladi.',
    'Yoqilg‘ining solishtirma yonish issiqligi bir kilogramm yoqilg‘i to‘liq yonganda ajraladigan energiyani ko‘rsatadi. Ajralgan issiqlik yoqilg‘i massasi va yonish issiqligiga bog‘liq.',
    'Bug‘lanish suyuqlik sirtida barcha temperaturada sodir bo‘ladi, qaynash esa butun hajm bo‘ylab ma’lum temperaturada kechadi. Kondensatsiyada bug‘ suyuqlikka aylanadi.',
    'Erish vaqtida qattiq jism suyuqlikka, qotishda esa suyuqlik qattiq holatga o‘tadi. Kristall moddaning erish va qotish temperaturasi bir xil bo‘ladi.',
    'Fazaviy o‘tish masalalarida erish, qotish, bug‘lanish va kondensatsiya uchun sarflanadigan yoki ajraladigan issiqlik miqdori hisoblanadi.',
    'Jismlar ishqalanish, tegish yoki ta’sir orqali elektrlanishi mumkin. Elektrlanishda elektronlar bir jismdan boshqasiga o‘tadi, umumiy zaryad esa saqlanadi.',
    'Elektr zaryad musbat yoki manfiy bo‘ladi va elementar zaryadning butun karralari bilan ifodalanadi. Bir xil ishorali zaryadlar itarishadi, turli ishorali zaryadlar tortishadi.',
    'Elektroskop jismning elektrlanganini aniqlaydi, elektrometr esa zaryad yoki potensiallar farqini taqqoslashga yordam beradi.',
    'Elektr o‘tkazgichlarda erkin zaryadlar harakatlana oladi, dielektriklarda esa zaryadlar erkin ko‘cha olmaydi. Izolyatorlar elektr xavfsizligini ta’minlaydi.',
    'Zaryadlangan jismlarning o‘zaro ta’sir kuchi zaryadlar kattaligiga va ular orasidagi masofaga bog‘liq. Masofa ortganda elektr kuchi kamayadi.',
    'O‘tkazgichga zaryad berilganda erkin zaryadlar asosan uning tashqi sirtida taqsimlanadi. Uchli joylarda zaryad zichligi kattaroq bo‘ladi.',
    'Chaqmoq bulutlar orasida yoki bulut bilan Yer orasida yuz beradigan kuchli elektr razryadidir. Yashinqaytargich razryad tokini xavfsiz ravishda yerga o‘tkazadi.',
    'Elektr toki zaryadlangan zarralarning tartibli harakatidir. Tok mavjud bo‘lishi uchun erkin zaryadlar, elektr maydon va yopiq zanjir kerak.',
    'Tok manbai boshqa turdagi energiyani elektr energiyasiga aylantirib, qutblari orasida kuchlanish hosil qiladi. Galvanik element, akkumulyator va Quyosh elementi tok manbalaridir.',
    'Elektr kuchlanish zanjir qismida birlik zaryadni ko‘chirishda bajarilgan ishni ifodalaydi. Kuchlanish voltmetr bilan o‘lchanadi va iste’molchiga parallel ulanadi.',
    'Tok kuchi o‘tkazgich kesimidan vaqt birligida o‘tgan zaryad miqdorini ko‘rsatadi. U ampermetr bilan o‘lchanadi va zanjirga ketma-ket ulanadi.',
    'Tok, zaryad, vaqt, kuchlanish va bajarilgan ishga oid masalalarda I = q/t hamda U = A/q munosabatlari qo‘llanadi.',
    'Laboratoriya ishida ampermetr zanjirga ketma-ket, voltmetr esa iste’molchiga parallel ulanib, tok kuchi va kuchlanish tajribada o‘lchanadi.',
    'Elektr qarshilik o‘tkazgichning tokka qarshilik ko‘rsatish xossasidir. U material turiga, sim uzunligiga, ko‘ndalang kesim yuzasiga va temperaturaga bog‘liq.',
    'Rezistor zanjirda ma’lum qarshilik hosil qiladi, reostat esa faol sim uzunligini o‘zgartirib tok kuchini rostlaydi.',
    'Om qonuniga ko‘ra, zanjir qismidagi tok kuchi kuchlanishga to‘g‘ri, qarshilikka teskari proporsional. Bu bog‘lanish I = U/R formula bilan ifodalanadi.',
    'Om qonuniga oid masalalarda kuchlanish, tok kuchi va qarshilikdan ikkitasi ma’lum bo‘lsa, uchinchi kattalik formula yordamida topiladi.',
    'Amaliy mashg‘ulotda reostat surilgichi siljitilib, zanjir qarshiligi va tok kuchi qanday o‘zgarishi ampermetr orqali kuzatiladi.',
    'Laboratoriya ishida turli kuchlanishlarda tok kuchi o‘lchanadi va R = U/I orqali o‘tkazgich qarshiligi aniqlanadi.',
    'Bir jinsli shaffof muhitda yorug‘lik to‘g‘ri chiziq bo‘ylab tarqaladi. To‘siq ortida soya va yarimsoya hosil bo‘lishi shu qonun bilan tushuntiriladi.',
    'Quyosh tutilishida Oy Quyosh bilan Yer orasiga, Oy tutilishida esa Yer Quyosh bilan Oy orasiga kiradi. Hodisalar soya va yarimsoya hosil bo‘lishiga bog‘liq.',
    'Yorug‘lik silliq sirtdan qaytadi, muhit chegarasidan o‘tganda esa yo‘nalishini o‘zgartirib sinadi. Qaytish burchagi tushish burchagiga teng.',
    'Linza yorug‘lik nurlarini yig‘uvchi yoki sochuvchi shaffof jismdir. Fokus masofasiga teskari kattalik linzaning optik kuchi deyiladi.',
    'Amaliy mashg‘ulotda yassi ko‘zguga tushgan va undan qaytgan nurlar chizilib, tushish va qaytish burchaklari transportir bilan o‘lchanadi.',
  ];

  const applications = [
    'Astronomik kuzatish, taqvim tuzish, navigatsiya va aniq o‘lchash usullari allomalar ilmiy merosiga tayanadi.',
    'Quyosh pechi, yadro tibbiyoti, yarimo‘tkazgich asboblar va zamonaviy materiallar o‘zbekistonlik olimlar tadqiqotlarining amaliy natijalaridir.',
    'SI birliklari laboratoriya, qurilish, tibbiyot va muhandislikdagi o‘lchashlarni bir xil talqin qilish imkonini beradi.',
    'Ilmiy metod yangi qurilma yaratishdan tortib kundalik muammoning sababini tekshirishgacha qo‘llanadi.',
    'Vektorlar shamol, tezlik, kuch, ko‘chish va navigatsiya yo‘nalishlarini ifodalashda ishlatiladi.',
    'Xarita, parvoz va muhandislik hisoblarida bir nechta vektorning natijaviy qiymati topiladi.',
    'Transport harakati, sun’iy yo‘ldosh navigatsiyasi va sport natijalari sanoq sistemasiga nisbatan tavsiflanadi.',
    'Yo‘nalish tanlash, xaritada marshrut qurish va robot harakatini rejalashda yo‘l bilan ko‘chish farqi muhim.',
    'Spidometr, yo‘l vaqti va transport jadvali tezlik formulasiga asoslanadi.',
    'Safar va yetib borish vaqtini rejalashda tezlik, vaqt va masofa hisoblari qo‘llanadi.',
    'Shahar transporti, poyga va odam yurishi odatda notekis harakatdir.',
    'Harakat datchiklari va tajriba o‘lchovlarida o‘rtacha tezlik aniqlanadi.',
    'Safarning umumiy tezligini baholashda barcha yo‘l bo‘laklari hisobga olinadi.',
    'G‘ildirak, ventilyator, turbina, soat mili va sayyoralar harakati aylana bo‘ylab harakatdir.',
    'Dvigatel aylanishi va mexanizmlar ish tezligi davr hamda chastota orqali hisoblanadi.',
    'Transport yukini, mahsulot miqdorini va jism inertligini baholashda massa o‘lchanadi.',
    'Zichlik materialni aniqlash, kemaning suzishi va qurilish materiali tanlashda ishlatiladi.',
    'Noma’lum jism materialini aniqlashda uning tajribada topilgan zichligi jadval qiymati bilan solishtiriladi.',
    'Mashina tezlanishi, sport, qurilish va mexanizmlar ishlashi kuch ta’siriga bog‘liq.',
    'Pichoq tig‘i, chang‘i, traktor shinasi va bino poydevori bosimni o‘zgartirish uchun turli yuzaga ega.',
    'Tayanch, poydevor va mexanik detallarning xavfsizligi bosim hisoblari bilan tekshiriladi.',
    'Gidravlik tormoz, avtomobil ko‘targich va press Paskal qonuni asosida ishlaydi.',
    'To‘g‘on devori va suv idishi pastki qismda kattaroq bosimga chidamli qilib quriladi.',
    'Suv inshootlari va quvurlardagi bosim chuqurlik hamda zichlik orqali hisoblanadi.',
    'Ob-havo, samolyot balandligi va vakuum qurilmalari atmosfera bosimiga bog‘liq.',
    'Kran, lift va ishlab chiqarish mexanizmlarining bajargan ishi kuch bilan ko‘chish orqali baholanadi.',
    'Tebranma, attraksion, kamon va gidroelektr stansiyada energiya bir turdan boshqasiga aylanadi.',
    'Balandlik va tezlikka qarab transport hamda sport tizimlarining energiyasi hisoblanadi.',
    'Dvigatel, nasos va maishiy qurilmalarning ish unumdorligi quvvat bilan taqqoslanadi.',
    'Qurilma tanlashda bajariladigan ish va unga ketadigan vaqt bo‘yicha quvvat hisoblanadi.',
    'Ishqalanish, tormozlash va aralashtirish mexanik energiyani ichki energiyaga aylantiradi.',
    'Ovqat pishirish, uy isitish va sovitish tizimlarida moddalarning issiqlik sig‘imi hisobga olinadi.',
    'Isitgich quvvati va kerakli energiyani tanlashda issiqlik miqdori hisoblanadi.',
    'Kalorimetr, isitish tizimi va ichimlik temperaturasini sozlash issiqlik balansiga asoslanadi.',
    'Yoqilg‘i tanlashda uning energiya berishi, massasi va samaradorligi taqqoslanadi.',
    'Kiyim qurishi, terlash, sovitkich va distillash bug‘lanish hamda kondensatsiyaga asoslanadi.',
    'Muzlatish, metall quyish va issiqlik saqlash qurilmalarida erish hamda qotish hisobga olinadi.',
    'Sovitish va isitish texnikasida fazaviy o‘tishga ketadigan energiya oldindan hisoblanadi.',
    'Statik elektr nusxa ko‘chirish qurilmasi, bo‘yash texnologiyasi va chang tutgichlarda qo‘llanadi.',
    'Elektronika va atom tuzilishini tushunishda elementar zaryad hamda zaryad saqlanishi muhim.',
    'Elektroskop laboratoriyada jismning zaryadlanganini xavfsiz aniqlashga yordam beradi.',
    'Sim qoplamasi, himoya qo‘lqopi va elektr jihoz korpusi o‘tkazgich hamda izolyator xossalariga qarab tanlanadi.',
    'Elektrostatik kuchlar zarralarni boshqarish, purkagich va havo tozalagichlarda ishlatiladi.',
    'Metall korpus elektr maydondan himoya qiladi, uchli o‘tkazgich esa zaryadni tezroq chiqaradi.',
    'Yashinqaytargich bino va inshootlarni chaqmoq razryadidan himoya qiladi.',
    'Yoritish, aloqa va barcha elektr qurilmalar yopiq zanjirdagi tok hisobiga ishlaydi.',
    'Batareya, akkumulyator va Quyosh paneli ko‘chma qurilmalarni elektr energiyasi bilan ta’minlaydi.',
    'Qurilmaning nominal kuchlanishi va elektr xavfsizligi voltmetr o‘lchovlari bilan tekshiriladi.',
    'Sug‘urta, sim va elektr asbobning ruxsat etilgan toki ampermetr yordamida nazorat qilinadi.',
    'Zaryadlovchi va elektr qurilmada tok, vaqt hamda bajarilgan ish oldindan hisoblanadi.',
    'Elektr ustasi zanjirni tekshirishda ampermetr va voltmetrni belgilangan tartibda ulaydi.',
    'Kabel, isitkich va elektron qurilma uchun o‘tkazgich qarshiligi to‘g‘ri tanlanadi.',
    'Rezistor elektron zanjirni himoya qiladi, reostat esa lampa yorqinligi yoki motor tezligini boshqaradi.',
    'Elektr qurilmalarda tokning xavfsiz qiymati Om qonuni yordamida hisoblanadi.',
    'Sim va rezistor tanlashda kuchlanish, tok hamda qarshilik orasidagi bog‘lanish ishlatiladi.',
    'Reostat laboratoriya va boshqaruv zanjirlarida tokni silliq o‘zgartirishga yordam beradi.',
    'O‘lchangan U va I qiymatlari orqali noma’lum rezistorning qarshiligi aniqlanadi.',
    'Soya, Quyosh soati, kamera-obskura va yorug‘lik nuri yo‘li to‘g‘ri chiziqli tarqalish bilan tushuntiriladi.',
    'Tutilishlarni oldindan hisoblash astronomik kuzatish va kosmik parvozlar uchun muhim.',
    'Ko‘zgu, periskop, prizma va optik tola qaytish hamda sinish qonunlariga asoslanadi.',
    'Ko‘zoynak, fotoapparat, mikroskop va teleskop linzalar yordamida tasvir hosil qiladi.',
    'Yassi ko‘zgu va periskopda nur yo‘li qaytish qonuni orqali loyihalanadi.',
  ];

  const phraseRepairs = [
    [/\bta[’‘']\s+sir/giu, 'ta’sir'],
    [/\bto[’‘']g[’‘']\s+ri/giu, 'to‘g‘ri'],
    [/\bo[’‘']\s+zaro/giu, 'o‘zaro'],
    [/\bo[’‘']\s+zgar/giu, 'o‘zgar'],
    [/\bki\s+yim/giu, 'kiyim'],
    [/\byo\s+rug[’‘']lik/giu, 'yorug‘lik'],
    [/\bfo\s+kus/giu, 'fokus'],
    [/\bshaf\s+fof/giu, 'shaffof'],
    [/\bshi\s+sha/giu, 'shisha'],
    [/\bpar\s+allel/giu, 'parallel'],
    [/\bketma\s+ket/giu, 'ketma-ket'],
    [/\bbir\s+bir/giu, 'bir-bir'],
    [/\bsa\s+bab/giu, 'sabab'],
    [/\buzluk\s+siz/giu, 'uzluksiz'],
    [/\bma\s+teriya/giu, 'materiya'],
    [/\bqa\s+ral/giu, 'qaral'],
    [/\bto[’‘']\s+lqin/giu, 'to‘lqin'],
    [/\bta[’‘']\s+lim/giu, 'ta’lim'],
    [/\bqo[’‘']\s+llan/giu, 'qo‘llan'],
    [/\bpaydo\s+bo[’‘']l/giu, 'paydo bo‘l'],
    [/\btashab\s+bus/giu, 'tashabbus'],
    [/\bmaterialshunos\s+ligi/giu, 'materialshunosligi'],
    [/\bMAKT\s+AB/gu, 'MAKTAB'],
    [/\bR\s+espublika/gu, 'Respublika'],
    [/\belektr\s+chi\s+roqlari/giu, 'elektr chiroqlari'],
    [/\bavtomo\s+bil/giu, 'avtomobil'],
    [/\bgener\s+ator/giu, 'generator'],
    [/\bzamonavi\s+y/giu, 'zamonaviy'],
    [/\bharakatla\s+nishi/giu, 'harakatlanishi'],
    [/\bqa\s+rama-qarshi/giu, 'qarama-qarshi'],
    [/\bchi\s+ziq/giu, 'chiziq'],
    [/\btush\s+mas/giu, 'tushmas'],
    [/\bko[’‘']pin\s+cha/giu, 'ko‘pincha'],
    [/\bso[’‘']r\s+ang/giu, 'so‘rang'],
    [/\bizoh\s+lash\s+ga/giu, 'izohlashga'],
    [/\byax\s+shi/giu, 'yaxshi'],
    [/\bbu\s+riladi/giu, 'buriladi'],
    [/\by\s+ot\s+gan/giu, 'yotgan'],
    [/\bAylanayot\s+gan/gu, 'Aylanayotgan'],
    [/\bku\s+chi\b/giu, 'kuchi'],
    [/\(The Islamic World Academy of Sciences,\s*IAS\)/giu, '(Islom dunyosi fanlar akademiyasi)'],
    [/\(The World Academy of Sciences,\s*TWAS\)/giu, '(Butunjahon fanlar akademiyasi)'],
  ];

  function clean(value) {
    let text = String(value || '');
    for (const [pattern, replacement] of phraseRepairs) text = text.replace(pattern, replacement);
    text = text
      .replace(/\b([\p{Ll}‘’']{3,})\s+(ning|dan|ga|da|lar|lari|lik|ligi|chi|ni|gan|gani|adi|ydi|maydi|moqda|miz|di)\b/gu, '$1$2')
      .replace(/\b([\p{Ll}‘’']{3,})\s+(ning|dan|ga|da|lar|lari|lik|ligi|chi|ni|gan|gani|adi|ydi|maydi|moqda|miz|di)\b/gu, '$1$2')
      .replace(/\b([\p{L}]+[‘’'])\s+([\p{Ll}]{1,})\b/gu, '$1$2')
      .replace(/([\p{L}]{2,})-\s+([\p{Ll}]{2,})/gu, '$1$2')
      .replace(/\s+([,.;:!?])/g, '$1')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\s{2,}/g, ' ')
      .trim();
    text = text
      .replace(/\bLeonardoda Vinchi\b/gu, 'Leonardo da Vinchi')
      .replace(/\bVelosiped chi\b/gu, 'Velosipedchi')
      .replace(/\bBirin chi\b/gu, 'Birinchi')
      .replace(/\bShu ning\b/gu, 'Shuning')
      .replace(/\bJism ni\b/gu, 'Jismni')
      .replace(/\bRuchka ni\b/gu, 'Ruchkani')
      .replace(/\bOy ning\b/gu, 'Oyning');
    return text;
  }

  function sanitizeTheory(value) {
    let text = clean(value)
      .replace(/Massa ingliz imlosida mass deb yoziladi\.\s*/giu, '')
      .replace(/Bosim inglizcha pressure, ya’ni bosim so‘zining bosh harfi\s*[–—-]\s*p bilan belgilanadi\./giu, 'Bosim p harfi bilan belgilanadi.')
      .replace(/\bvoltmeter\b/giu, 'voltmetr')
      .replace(/\bXalqa ro\b/gu, 'Xalqaro')
      .replace(/\bvaqtdavomida\b/gu, 'vaqt davomida')
      .replace(/\bo‘gan\b/gu, 'o‘tgan')
      .replace(/\bt ortib\b/gu, 'tortib')
      .replace(/\bg acha\b/gu, 'gacha')
      .replace(/\bchi qar g an\b/gu, 'chiqargan')
      .replace(/\bmas s asi\b/gu, 'massasi')
      .replace(/\bra dioga\b/gu, 'radioga')
      .replace(/\bhol larda\b/gu, 'hollarda')
      .replace(/\blampoch kaning\b/gu, 'lampochkaning')
      .replace(/\btanlangan sanoq avtomobildan\b/gu, 'tanlangan sanoq jismidan');
    text = text.replace(/O‘zR FAning academy\.uz saytida/giu, 'O‘zbekiston Fanlar akademiyasining rasmiy saytida');

    if (/Berilgan:\s*Formula\s*Hisoblash/iu.test(text)) {
      const statement = text.split(/Berilgan:\s*Formula\s*Hisoblash/iu)[0]
        .replace(/\bTopish kerak:\s*.*$/iu, '')
        .trim();
      text = `${statement} Yechishda mavzuning asosiy formulasi qo‘llanadi; son qiymatlar SI birliklariga keltirilib, ketma-ket hisoblanadi.`;
    }
    return clean(text)
      .replace(/\s*Topish kerak:\s*[^.?!]*(?:[.?!]|$)/giu, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  course.version = Math.max(Number(course.version) || 0, 7);
  course.lessons.forEach((lesson, index) => {
    const number = String(index + 1).padStart(2, '0');
    lesson.summary = summaries[index] || lesson.summary;
    lesson.application = applications[index] || lesson.application;
    lesson.figure = `assets/physics7/visuals/lesson-${number}.svg`;
    delete lesson.figurePage;
    lesson.hasSimulation = simulationIds.has(lesson.id);
    lesson.simulation = lesson.hasSimulation ? 'rasmiy' : null;
    lesson.video = videos[lesson.id] || null;
    lesson.experimentVideo = experimentVideos[lesson.id] || null;
    lesson.experiment = experiments[index];
    lesson.experimentQuestion = `Kuzatuv natijasi “${lesson.title}” mavzusidagi qaysi fizik qonun yoki tushunchani tasdiqladi?`;
    lesson.experimentExplanation = `${lesson.relationship} Tajribada kuzatilgan natija aynan shu bog‘lanish bilan tushuntiriladi.`;

    for (const field of ['title', 'summary', 'formulaExplanation', 'relationship', 'application', 'experiment', 'experimentQuestion', 'experimentExplanation']) {
      lesson[field] = clean(lesson[field]);
    }
    const page = lesson.pageNumbers?.[0] || 1;
    const rule = clean(lesson.relationship || lesson.formulaExplanation || lesson.summary);
    const formulaText = clean(lesson.formulaExplanation || (
      lesson.formula && lesson.formula !== '—'
        ? `${lesson.formula} — mavzuning asosiy matematik bog‘lanishi.`
        : 'Bu mavzu kuzatish va sabab–oqibat bog‘lanishi orqali o‘rganiladi.'
    ));
    lesson.paragraphs = [lesson.summary, rule, lesson.application].filter(Boolean);
    lesson.theoryBlocks = [
      {type:'paragraph', text:lesson.summary, page},
      {type:'paragraph', text:`Asosiy qoida: ${rule}`, page},
      {type:'paragraph', text:formulaText, page},
      {type:'paragraph', text:`Amaliy ahamiyati: ${lesson.application}`, page},
      {type:'paragraph', text:`O‘zingizni tekshiring: “${lesson.title}” mavzusida sabab va natijani o‘z so‘zingiz bilan tushuntiring.`, page},
    ];
  });
})();

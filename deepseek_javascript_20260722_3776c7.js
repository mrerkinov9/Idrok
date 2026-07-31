(() => {
  'use strict';

  // ============================================================
  // 10-SINF FIZIKA KURSI
  // ============================================================
  // Darslik: "Fizika 10" (2022)
  // 7 bob, 59 dars
  // ============================================================

  const PHYSICS10_COURSE = {
    version: 1,
    chapters: [
      { title: "Dinamika. Statika elementlari", icon: "atom", accent: "#6C4DFF", description: "Kuchlar, harakat va muvozanat qonunlari" },
      { title: "Mexanik tebranishlar va to‘lqinlar", icon: "heat", accent: "#FF6B6B", description: "Tebranma harakat va to‘lqinlar" },
      { title: "Gidrodinamika va aerodinamika", icon: "drop", accent: "#4ECDC4", description: "Suyuqlik va gazlar harakati" },
      { title: "Elektrostatik maydon", icon: "atom", accent: "#FFD93D", description: "Elektr zaryadlari va maydonlar" },
      { title: "O‘zgarmas tok qonunlari", icon: "engine", accent: "#FF9F43", description: "Elektr zanjirlari va Om qonuni" },
      { title: "Turli muhitlarda elektr toki", icon: "atom", accent: "#A29BFE", description: "Elektr toki turli muhitlarda" },
      { title: "Magnit maydon", icon: "atom", accent: "#FD79A8", description: "Magnit maydon va elektromagnit induksiya" }
    ],
    lessons: [
      // ============================================================
      // I BOB: DINAMIKA. STATIKA ELEMENTLARI (14 DARS)
      // ============================================================

      // 1-mavzu. Kuchlarni qo‘shish
      {
        id: 'l1',
        number: 1,
        chapter: 0,
        title: "Kuchlarni qo‘shish",
        summary: "Jismga qo‘shimcha kuchlar ta’sir qilmasa, u o‘zining nisbiy tinch holatini saqlaydi yoki to‘g‘ri chiziqli tekis harakatini davom ettiradi.",
        formula: "F = √(F₁² + F₂² + 2F₁F₂·cosα)",
        unit: "N",
        relationship: "Kuchlarning teng ta’sir etuvchisi ularning vektor yig‘indisiga teng. α = 0° da F = F₁ + F₂, α = 90° da F = √(F₁² + F₂²), α = 180° da F = |F₁ − F₂|.",
        application: "Arqon tortish musobaqasida kuchlarni qo‘shish orqali g‘olib aniqlanadi.",
        experiment: "Ikki dinamometr yordamida turli burchaklardagi kuchlarni o‘lchab, natijaviy kuchni toping.",
        experimentQuestion: "Kuchlar orasidagi burchak o‘zgarganda natijaviy kuch qanday o‘zgaradi?",
        experimentExplanation: "Kuchlar orasidagi burchak ortishi bilan natijaviy kuch kamayadi. Burchak 180° bo‘lganda kuchlar bir-birini muvozanatlaydi (F = |F₁ − F₂|).",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 8, type: 'heading', text: "Muvozanatlashgan kuchlar" },
          { page: 8, type: 'paragraph', text: "To‘xtab turgan avtomobil, suvning ichidagi ixtiyoriy nuqtada tinch turgan jism, stol ustidagi buyumlar nima sababdan tinch turadi? Stol ustida tinch turgan kitobga ikkita kuch ta’sir qiladi. F1 – og‘irlik kuchi. F2 – stol tomonidan jismni yuqoriga ko‘tarib turuvchi, ya’ni tayanchning normal reaksiya kuchi. Bu kuchlarning miqdori teng, yo‘nalishi esa qarama-qarshi bo‘lgani uchun ularning yig‘indisi nolga teng bo‘ladi. Natijada ular bir-birini muvozanatlaydi." },
          { page: 8, type: 'paragraph', text: "Jismning tinch holatini yoki harakat tezligini o‘zgartirmaydigan kuchlar muvozanatlashgan kuchlar deyiladi." },
          { page: 8, type: 'paragraph', text: "Nyutonning I qonuniga asosan: jismga qo‘shimcha kuchlar ta’sir qilmasa, u o‘zining nisbiy tinch holatini saqlaydi yoki to‘g‘ri chiziqli tekis harakatini davom ettiradi. F₁ + F₂ + … + Fₙ = 0 bo‘lsa, a = 0 va v = const bo‘ladi." },
          { page: 9, type: 'heading', text: "Muvozanatlashmagan kuchlar" },
          { page: 9, type: 'paragraph', text: "Tabiatda tinch turgan yoki o‘zgarmas tezlik bilan tekis harakat qilayotgan jismlardan tashqari tezligi o‘zgaruvchan bo‘lgan jismlarni ham ko‘p uchratamiz. Masalan, suvda cho‘kayotgan jism, joyidan qo‘zg‘alib tezligini oshirayotgan avtomobil yoki tezligini kamaytirib bekatga kirib kelayotgan poyezd va shunga o‘xshash misollarni keltirish mumkin." },
          { page: 9, type: 'paragraph', text: "Jism tezligining o‘zgarishiga sabab bo‘ladigan kuchlar muvozanatlashmagan kuchlar deyiladi." },
          { page: 9, type: 'heading', text: "Teng ta’sir etuvchi kuch va kuchning tashkil etuvchilari" },
          { page: 9, type: 'paragraph', text: "Tabiatda jismning faqat bitta kuch ta’siri ostidagi harakatini deyarli uchratmaymiz. Ko‘p hollarda jismga bir vaqtning o‘zida bir nechta kuchlar ta’sir qiladi. Bu kuchlarning jismga ta’sirini tavsiflash uchun kuchlarning teng ta’sir etuvchisi (natijaviy kuch) degan kattalik kiritilgan." },
          { page: 9, type: 'paragraph', text: "Jismga ta’sir qiluvchi kuchlarning vektor yig‘indisi shu kuchlarning teng ta’sir etuvchisi deyiladi. Agar jismga bir vaqtning o‘zida bir nechta kuch ta’sir qilayotgan bo‘lsa, jismning harakati bu kuchlarning yo‘nalishi va moduliga bog‘liq ravishda o‘zgaradi." },
          { page: 10, type: 'heading', text: "Masala yechish namunasi" },
          { page: 10, type: 'paragraph', text: "Orasidagi burchak 120° ga, har birining moduli 5 N ga teng bo‘lgan ikki kuch jismning bir nuqtasiga qo‘yilgan. Bu kuchlarning teng ta’sir etuvchisini toping. F = √(5² + 5² + 2·5·5·cos120°) = √(25 + 25 + 50·(-0.5)) = √(50 − 25) = 5 N." }
        ],
        reward: 80,
        simulation: 'vectors'
      },

      // 2-mavzu. Markazga intilma kuch
      {
        id: 'l2',
        number: 2,
        chapter: 0,
        title: "Markazga intilma kuch",
        summary: "Aylana bo‘ylab harakat qilayotgan har qanday jism markazga intilma tezlanishga ega bo‘ladi. Bu tezlanishni tashqi kuchlar vujudga keltiradi.",
        formula: "F_m.i = mv²/R = mω²R",
        unit: "N",
        relationship: "Markazga intilma kuch jismning chiziqli tezlik vektoriga tik yo‘nalgan bo‘lib, uni aylanma harakatga keltiradi. Bu kuch tezlikning yo‘nalishini o‘zgartiradi, modulini esa o‘zgartirmaydi.",
        application: "Avtomobil yo‘lning burilish qismida markazga intilma kuch tufayli buriladi.",
        experiment: "Ipga bog‘langan sharchani aylantirib, ipning tarangligini his qiling.",
        experimentQuestion: "Aylanish tezligi oshganda ipning tarangligi qanday o‘zgaradi?",
        experimentExplanation: "Tezlik oshganda markazga intilma kuch ortadi, shuning uchun ipning tarangligi ham ortadi. F_m.i = mv²/R munosabatiga ko‘ra, tezlik 2 marta ortsa, kuch 4 marta ortadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 11, type: 'heading', text: "Aylana bo‘ylab harakatda kuchlar" },
          { page: 11, type: 'paragraph', text: "Nima uchun Oy Yer atrofida aylana bo‘ylab harakat qiladi va uzoqlashib ketmaydi? Nyutonning ikkinchi qonuniga ko‘ra, jism tashqi kuch ta’sirida tezlanish bilan harakat qiladi." },
          { page: 11, type: 'paragraph', text: "R radiusli aylana bo‘ylab v tezlik bilan harakat qilayotgan har qanday jism aylana markaziga yo‘nalgan tezlanishga ega bo‘ladi: a_m.i = v²/R." },
          { page: 11, type: 'paragraph', text: "Bu tezlanishni ham tashqi kuchlar vujudga keltiradi. Bu yerda tashqi kuch markazga intilma kuchdir. Markazga intilma kuch alohida bir turdagi kuch emas. U faqat jismni aylanma harakatga keltiruvchi natijaviy kuchdir." },
          { page: 11, type: 'paragraph', text: "Markazga intilma kuchga: ipga mahkamlangan jismning aylana bo‘ylab harakatida ipning taranglik kuchini; yo‘lning aylanish qismida harakatlanishda avtomobillarning burilishiga sabab bo‘ladigan kuchni misol qilib keltirishimiz mumkin." },
          { page: 11, type: 'paragraph', text: "Markazga intilma kuch (F_m.i) ga nisbatan Nyutonning II qonunini qo‘llaymiz: a_m.i = F_m.i / m. Formulalardan F_m.i = mv²/R." },
          { page: 12, type: 'paragraph', text: "Aylana bo‘ylab harakatda jismning chiziqli tezligi v = ωR ekanligidan markazga intilma kuchni quyidagicha ham ifodalashimiz mumkin: F_m.i = mω²R." },
          { page: 12, type: 'heading', text: "Ippa mahkamlangan sharning aylana bo‘ylab harakati. Markazdan qochma kuch" },
          { page: 12, type: 'paragraph', text: "Ippa bog‘langan sharning aylana bo‘ylab harakatida ham markazga intilma kuch mavjud. Bu kuch ipning uzunligi bo‘ylab aylana markaziga yo‘nalgan bo‘ladi." },
          { page: 12, type: 'paragraph', text: "Nyutonning III qonuniga asosan, shar ham ipga shu kuchga modul jihatidan teng, yo‘nalishi qarama-qarshi bo‘lgan kuch bilan ta’sir qiladi. Bu kuch markazdan qochma kuch (F_m.q) deyiladi. U radius bo‘ylab aylana markazidan shar tomon yo‘nalgan bo‘ladi va ip orqali qo‘lga ta’sir qiladi. F_m.q = mv²/R = mω²R." },
          { page: 13, type: 'heading', text: "Masala yechish namunasi" },
          { page: 13, type: 'paragraph', text: "Massasi 1 t bo‘lgan avtomobil radiusi 100 m bo‘lgan aylana bo‘ylab o‘zgarmas 20 m/s tezlik bilan harakatlanmoqda. Avtomobilga ta’sir qilayotgan markazga intilma kuchni toping. F = mv²/R = 1000·400/100 = 4000 N = 4 kN." }
        ],
        reward: 80,
        simulation: 'collision'
      },

      // 3-mavzu. Gravitatsiya maydonidagi harakat
      {
        id: 'l3',
        number: 3,
        chapter: 0,
        title: "Gravitatsiya maydonidagi harakat",
        summary: "Yerning tortishish kuchi jismlarni o‘ziga tortadi. Butun olam tortishish qonuniga asosan, F = G·mM/r².",
        formula: "v₁ = √(gR) ≈ 7.9 km/s",
        unit: "m/s",
        relationship: "Birinchi kosmik tezlik Yer sirti yaqinida aylana trayektoriya bo‘ylab harakatlanish uchun zarur minimal tezlikdir. v₁ = √(gR) ≈ 7.9 km/s. Ikkinchi kosmik tezlik v₂ = √(2gR) ≈ 11.2 km/s. Uchinchi kosmik tezlik v₃ ≈ 16.7 km/s.",
        application: "Sun’iy yo‘ldoshlar va kosmik kemalar Yer atrofida aylana orbita bo‘ylab harakatlanadi.",
        experiment: "Turli balandlikdan gorizontal otilgan jismning uchish uzoqligini kuzating.",
        experimentQuestion: "Boshlang‘ich tezlik oshganda jismning uchish uzoqligi qanday o‘zgaradi?",
        experimentExplanation: "Boshlang‘ich tezlik oshganda uchish uzoqligi ortadi. Agar tezlik 7.9 km/s ga yetsa, jism Yer atrofida aylana orbita bo‘ylab harakatlanadi va sun’iy yo‘ldoshga aylanadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 14, type: 'heading', text: "Tortishish maydoni" },
          { page: 14, type: 'paragraph', text: "Odatda jismlar nega Yerga qaytib tushadi? Yerning tabiiy yo‘ldoshi Oy nega Yerdan uzoqlashib ketmaydi? Yer jismlarni o‘ziga tortishi haqida Galileo Galiley, Isaak Nyuton, Genri Kavendish kabi olimlar ko‘plab ilmiy tadqiqot ishlarini olib borgan." },
          { page: 14, type: 'paragraph', text: "Atrofimizdagi barcha jismlarning harakatiga Yerning tortishish kuchi o‘z ta’sirini ko‘rsatadi. Butun olam tortishish qonuniga asosan, jismlarga Yerning tortishish F = G·mM/r² kuchi ta’sir qilib turadi." },
          { page: 14, type: 'paragraph', text: "Biror jismni Yer sirtidan tik yuqoriga otsak, ma’lum balandlikka ko‘tarilib, qaytib otilgan joyiga tushadi. Agar jism ma’lum balandlikdan gorizontal yoki gorizontga qiya otilsa, otilish nuqtasidan ma’lum bir masofaga borib tushadi." },
          { page: 15, type: 'heading', text: "Kosmik tezliklar" },
          { page: 15, type: 'paragraph', text: "Yer sun’iy yo‘ldoshlarining harakati Yerning tortish maydonidagi harakatga misol bo‘la oladi. Boshlang‘ich tezlikning ma’lum bir qiymatiga erishganida jism Yer atrofida aylana orbita bo‘ylab harakat qiladi." },
          { page: 15, type: 'paragraph', text: "Jismning Yer sirti yaqinida aylana trayektoriya bo‘ylab harakatlanishi uchun zarur bo‘lgan minimal tezlik birinchi kosmik tezlik deyiladi." },
          { page: 15, type: 'paragraph', text: "Jism Yer sirtiga yaqin masofada Yerning tortish maydonida aylana trayektoriya bo‘ylab harakatlanganda jismga ta’sir etuvchi markazga intilma kuch Yerning tortishish kuchidan iborat bo‘ladi: mv²/R = G·mM/R², bundan v₁ = √(GM/R). g = GM/R² bo‘lgani uchun v₁ = √(gR)." },
          { page: 15, type: 'paragraph', text: "Yerning radiusi R = 6370 km, g = 9.81 m/s² ekanligini inobatga olib, birinchi kosmik tezlikning son qiymatini hisoblaymiz: v₁ = √(9.81·6370000) ≈ 7.9 km/s." },
          { page: 15, type: 'paragraph', text: "Ikkinchi kosmik tezlik birinchi kosmik tezlikdan √2 marta katta bo‘ladi: v₂ = √2·v₁ = √(2gR) ≈ 11.2 km/s." },
          { page: 16, type: 'paragraph', text: "Kosmik kema Quyosh sistemasidan chiqib, uzoq koinotni tadqiq qilish uchun galaktika bo‘ylab harakatlanishi kerak. Quyoshning tortishish kuchini yengib, Quyosh sistemasini tark etishi uchun kosmik kemaga uchinchi kosmik tezlik berish kerak. v₃ ≈ 16.7 km/s." },
          { page: 16, type: 'heading', text: "Masala yechish namunasi" },
          { page: 16, type: 'paragraph', text: "Sun’iy yo‘ldosh Yerdan h = 1600 km balandlikda ekvator tekisligida joylashgan aylana orbita bo‘ylab uchishi uchun Yerga nisbatan qanday v_h tezlikka ega bo‘lishi kerak? Yer radiusi R = 6400 km. v_h = √(gR²/(R+h)) = √(9.8·(64·10⁵)²/(64·10⁵+16·10⁵)) ≈ 7 km/s." }
        ],
        reward: 100,
        simulation: 'gravity'
      },

      // 4-mavzu. Masalalar yechish
      {
        id: 'l4',
        number: 4,
        chapter: 0,
        title: "Masalalar yechish",
        summary: "Dinamika va statika bo‘limlariga oid masalalarni yechish usullari.",
        formula: "F_m.i = mv²/R, F = G·mM/r², P = m(g ± a)",
        unit: "N",
        relationship: "Kuch, massa va tezlanish orasidagi bog‘lanish Nyuton qonunlari orqali ifodalanadi.",
        application: "Avtomobilning burilishdagi harakati, sun’iy yo‘ldoshlarning orbital harakati.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 17, type: 'heading', text: "Masala yechish namunalari" },
          { page: 17, type: 'paragraph', text: "1. Agar massasi 4 t bo‘lgan avtomobil radiusi 10 m bo‘lgan burilishda 36 km/h tezlik bilan harakatlansa, u asfaltga gorizontal yo‘nalishda necha nyuton kuch bilan ta’sir qiladi? v = 36 km/h = 10 m/s. F = mv²/R = 4000·100/10 = 40000 N = 40 kN." },
          { page: 17, type: 'paragraph', text: "2. Yer o‘rtacha 30 km/s tezlik bilan orbita bo‘ylab harakat qiladi. Yer orbitasining radiusi 1.5·10⁸ km ekanligidan foydalanib Quyoshning massasini toping. M = Rv²/G = 1.5·10¹¹·(3·10⁴)²/6.67·10⁻¹¹ ≈ 2·10³⁰ kg." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 5-mavzu. Jism og‘irligining harakat turiga bog‘liqligi
      {
        id: 'l5',
        number: 5,
        chapter: 0,
        title: "Jism og‘irligining harakat turiga bog‘liqligi",
        summary: "Jism og‘irligi uning harakat turiga bog‘liq. Jism tinch turganda P = mg. Tezlanuvchan harakatda P = m(g ± a).",
        formula: "P = m(g − a) — pastga tezlanuvchan; P = m(g + a) — yuqoriga tezlanuvchan",
        unit: "N",
        relationship: "Og‘irlik kuchi har doim jismning o‘ziga ta’sir qiladi. Og‘irlik esa tayanchga yoki osmaga ta’sir qiladi. P = m(g − a) pastga tezlanuvchan yoki yuqoriga sekinlanuvchan harakatda; P = m(g + a) yuqoriga tezlanuvchan yoki pastga sekinlanuvchan harakatda.",
        application: "Liftda harakatlanayotganda og‘irlikning o‘zgarishi, Nesterov halqasida uchuvchining og‘irligi.",
        experiment: "Liftda harakatlanayotganda tarozida turib, og‘irlikning o‘zgarishini kuzating.",
        experimentQuestion: "Lift yuqoriga tezlanish bilan harakatlanganda og‘irlik qanday o‘zgaradi?",
        experimentExplanation: "Lift yuqoriga tezlanish bilan harakatlanganda P = m(g + a) bo‘lgani uchun og‘irlik ortadi. Lift pastga tezlanish bilan harakatlanganda P = m(g − a) bo‘lgani uchun og‘irlik kamayadi. Erkin tushishda (a = g) P = 0 — vaznsizlik holati yuzaga keladi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 19, type: 'heading', text: "Jism og‘irligi" },
          { page: 19, type: 'paragraph', text: "Jism og‘irligi unga Yerning tortish kuchi ta’siri hamda uning harakat turi tufayli vujudga keladi. Shu sababli jism og‘irligi uning harakat turiga bog‘liq bo‘ladi. Jismning tayanchga yoki osmaga ko‘rsatadigan ta’siri jismning og‘irligi deyiladi." },
          { page: 19, type: 'paragraph', text: "Tayanchda turgan yoki osmaga osilgan jismning og‘irligi (P) jism tinch turganda og‘irlik kuchiga teng bo‘ladi: P = mg. Og‘irlik kuchi har doim jismning o‘ziga ta’sir qiladi." },
          { page: 19, type: 'paragraph', text: "Umumiy holda jism og‘irligi P = m√(g² + a² − 2gacosα) formula bilan ifodalanadi." },
          { page: 20, type: 'heading', text: "Jismning qavariq sirtdagi harakati" },
          { page: 20, type: 'paragraph', text: "Qavariq ko‘prik ustida v tezlik bilan tekis harakatlanayotgan avtomobil ko‘prikning eng yuqorisida R radiusli aylananing bir qismi bo‘ylab harakatlanadi. P = mg − ma = m(g − v²/R). Demak, ko‘prikning yuqori nuqtasida avtomobilning og‘irligi kamayadi." },
          { page: 20, type: 'heading', text: "Jismning botiq sirtdagi harakati (Nesterov halqasi)" },
          { page: 20, type: 'paragraph', text: "Vertikal tekislikda egri chiziqli trayektoriya bo‘ylab harakatlanayotgan samolyot ichidagi uchuvchining og‘irligi o‘zgaradi. Trayektoriyaning quyi qismida P = mg + ma = m(g + v²/R), ya’ni P > mg." },
          { page: 21, type: 'heading', text: "Vaznsizlik" },
          { page: 21, type: 'paragraph', text: "Faqat gravitatsiya kuchi ta’sirida erkin harakat qilayotgan har qanday jism vaznsizlik holatida bo‘ladi. Jismning tayanchga yoki osmaga ko‘rsatadigan ta’sir kuchi nolga teng bo‘lsa, ya’ni og‘irligi yo‘qoladigan holati ham vaznsizlik holatidir. P = mg − ma = 0." },
          { page: 21, type: 'heading', text: "Masala yechish namunasi" },
          { page: 21, type: 'paragraph', text: "Massasi 100 kg bo‘lgan yukning og‘irligi: a) 0.3 m/s² tezlanish bilan yuqoriga ko‘tarilganda: P = 100(10 + 0.3) = 1030 N = 1.03 kN; b) tekis harakat qilganda: P = 1000 N = 1 kN; d) 0.4 m/s² tezlanish bilan pastga tushganda: P = 100(10 − 0.4) = 960 N = 0.96 kN; e) erkin tushganda: P = 0 N." }
        ],
        reward: 80,
        simulation: 'forces'
      },

      // 6-mavzu. Jismning bir nechta kuch ta’siridagi harakati
      {
        id: 'l6',
        number: 6,
        chapter: 0,
        title: "Jismning bir nechta kuch ta’siridagi harakati",
        summary: "Jismga bir vaqtning o‘zida bir nechta kuchlar ta’sir qilishi mumkin. Ularning teng ta’sir etuvchisi jismning tezlanishini aniqlaydi.",
        formula: "F = F_t − F_ishq, a = (F_t − μmg)/m",
        unit: "m/s²",
        relationship: "Jismning tezlanishi unga ta’sir qilayotgan barcha kuchlarning vektor yig‘indisiga (teng ta’sir etuvchi kuchga) to‘g‘ri proporsional va massaga teskari proporsional.",
        application: "Avtomobilning tortilishi, yuklarni ko‘chmas blok yordamida ko‘tarish.",
        experiment: "Gorizontal sirtda jismni turli kuchlar bilan tortib, tezlanishni o‘lchang.",
        experimentQuestion: "Ishqalanish kuchi jismning harakatiga qanday ta’sir qiladi?",
        experimentExplanation: "Ishqalanish kuchi harakatga qarama-qarshi yo‘nalgan bo‘lib, jismning tezlanishini kamaytiradi. F = F_t − F_ishq, a = (F_t − μmg)/m. Ishqalanish kuchi ortishi bilan tezlanish kamayadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 23, type: 'heading', text: "Jismning gorizontal tekislikdagi harakati" },
          { page: 23, type: 'paragraph', text: "Gorizontal sirtda turgan jismni sirt bo‘ylab yo‘nalgan tortuvchi kuch bilan harakatlantirganda unga quyidagi kuchlar ta’sir qiladi: tortuvchi kuch (F), ishqalanish kuchi (F_ishq), og‘irlik kuchi (F_og), tayanchning normal reaksiya kuchi (N)." },
          { page: 23, type: 'paragraph', text: "Jismni harakatlantirish uchun tortuvchi kuch tinchlikdagi ishqalanish kuchidan katta bo‘lishi kerak: F_t > F_ishq. Bunda jism joyidan qo‘zg‘alib, tezlanish bilan harakatlana boshlaydi." },
          { page: 23, type: 'paragraph', text: "Jism tezlanishini topish uchun harakat yo‘nalishidagi teng ta’sir etuvchi kuchni aniqlash kerak. F = F_t − F_ishq, F_ishq = μN = μmg, a = (F_t − μmg)/m." },
          { page: 24, type: 'heading', text: "Jismlarning ko‘chmas blokdagi harakati" },
          { page: 24, type: 'paragraph', text: "Massalari m₁ va m₂ bo‘lgan jismlar vaznsiz ko‘chmas blokka cho‘zilmas va vaznsiz ip orqali osib qo‘yilgan. Jismlarning massalari har xil (m₂ > m₁) bo‘lsa, ikkinchi jism pastga, birinchi jism esa yuqoriga tezlanish bilan harakatlanadi." },
          { page: 24, type: 'paragraph', text: "a = (m₂ − m₁)/(m₁ + m₂)·g, T = 2m₁m₂/(m₁ + m₂)·g." },
          { page: 25, type: 'heading', text: "Masala yechish namunasi" },
          { page: 25, type: 'paragraph', text: "Massalari 230 g dan bo‘lgan ikkita yuk vaznsiz ip yordamida o‘zaro bog‘lanib, ko‘chmas blokka osilgan. Agar yuklardan birortasiga 30 g qo‘shimcha yuk osilsa, ular qanday tezlanish bilan harakatlanadi? a = (30·10⁻³·10)/((230·10⁻³+30·10⁻³)+230·10⁻³) = 0.61 m/s². v = at = 0.61·5 = 3.05 m/s. s = at²/2 = 0.61·25/2 = 7.5 m." }
        ],
        reward: 80,
        simulation: 'forces'
      },

      // 7-mavzu. Masalalar yechish
      {
        id: 'l7',
        number: 7,
        chapter: 0,
        title: "Masalalar yechish",
        summary: "Jism og‘irligi va bir nechta kuch ta’siridagi harakatga oid masalalarni yechish.",
        formula: "P = m(g ± a), a = (m₂ − m₁)/(m₁ + m₂)·g",
        unit: "N, m/s²",
        relationship: "Jism og‘irligi tezlanishga bog‘liq. Ko‘chmas blokda jismlarning tezlanishi ularning massalar farqiga proporsional.",
        application: "Liftdagi og‘irlik, blokli sistemalar.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 26, type: 'heading', text: "Masala yechish namunalari" },
          { page: 26, type: 'paragraph', text: "1. Lift 3 m/s² tezlanish bilan vertikal pastga harakatlanmoqda, liftdagi 50 kg massali bolaning og‘irligi qanday bo‘ladi? P = m(g − a) = 50·(10 − 3) = 350 N." },
          { page: 26, type: 'paragraph', text: "2. Vagonning tezlanishini iplarning taranglik kuchlari orqali topish." },
          { page: 26, type: 'paragraph', text: "3. Rasmda tasvirlangan qurilmada cho‘zilmas ipning taranglik kuchini va jismning tezlanishini toping. m = 100 g = 0.1 kg, F = 1.2 N. F = T = 1.2 N, a = (F − mg)/m = (1.2 − 0.1·10)/0.1 = 2 m/s²." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 8-mavzu. Jismning qiya tekislikdagi harakati
      {
        id: 'l8',
        number: 8,
        chapter: 0,
        title: "Jismning qiya tekislikdagi harakati",
        summary: "Qiya tekislikda jismga og‘irlik kuchi, ishqalanish kuchi va normal reaksiya kuchi ta’sir qiladi. Og‘irlik kuchining qiya tekislik bo‘ylab tashkil etuvchisi F_x = mg·sinα.",
        formula: "F_x = mg·sinα, F_y = mg·cosα, a = g(sinα − μcosα)",
        unit: "N, m/s²",
        relationship: "Qiya tekislik qiyalik burchagi ortishi bilan jismni pastga tortuvchi kuch ortadi. Ishqalanish kuchi esa normal reaksiya kuchiga proporsional: F_ishq = μmg·cosα.",
        application: "Rampalar, qiya yo‘llar, yuk ortish estakadalari.",
        experiment: "Qiya tekislikda brusokning sirpanishini kuzating.",
        experimentQuestion: "Qiyalik burchagi o‘zgarganda jismning tezlanishi qanday o‘zgaradi?",
        experimentExplanation: "Qiyalik burchagi ortishi bilan a = g(sinα − μcosα) formula bo‘yicha tezlanish ortadi, chunki sinα ortadi va cosα kamayadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 28, type: 'heading', text: "Qiya tekislikda jismga ta’sir qiluvchi og‘irlik kuchining tashkil etuvchilari" },
          { page: 28, type: 'paragraph', text: "Og‘irlik kuchi doimo vertikal pastga yo‘nalgan. Bu kuchning qiya tekislik bo‘ylab pastga tomon yo‘nalgan tashkil etuvchisi F_x = mg·sinα. Bu kuch jismni qiyalik bo‘ylab pastga sirpantiruvchi kuch hisoblanadi." },
          { page: 28, type: 'paragraph', text: "Og‘irlik kuchining qiya tekislikka tik yo‘nalgan tashkil etuvchisi F_y = mg·cosα formula bilan aniqlanadi. Bu kuch sirt tomonidan jismga ta’sir etuvchi normal reaksiya kuchiga teng bo‘ladi: N = mg·cosα." },
          { page: 29, type: 'heading', text: "Qiya tekislikda ishqalanish kuchi" },
          { page: 29, type: 'paragraph', text: "Jism tinch turganda tinchlikdagi ishqalanish kuchi F_t.i = F_x = mg·sinα. Jism sirpanayotganda F_s.i = μN = μmg·cosα." },
          { page: 29, type: 'paragraph', text: "Jismni pastga tortuvchi kuch tinchlikdagi ishqalanish kuchidan kichik bo‘lsa (F_x < F_t.i), jism tinch turadi. F_x = F_ishq bo‘lganda jism tekis harakat qiladi. F_x > F_s.i bo‘lganda jism tezlanish bilan harakatlanadi: a = g(sinα − μcosα)." },
          { page: 30, type: 'heading', text: "Masala yechish namunasi" },
          { page: 30, type: 'paragraph', text: "Bola qorli qiya tekislikdan chang‘ida pastga tushmoqda. Qiya tekislikning gorizontga nisbatan burchagi 30° va chang‘i bilan qor orasidagi sirpanish ishqalanish koeffitsiyenti 0.15 ga teng. Bola va chang‘ining birgalikdagi massasi 65 kg. Qiya tekislikdan tushishda bolaning tezlanishini aniqlang. a = g(sin30° − 0.15·cos30°) = 9.8·(0.5 − 0.15·0.866) ≈ 3.63 m/s²." }
        ],
        reward: 80,
        simulation: 'ramp'
      },

      // 9-mavzu. Jismni qiya tekislik bo‘ylab ko‘chirishda bajarilgan ish. Qiya tekislikning FIKi
      {
        id: 'l9',
        number: 9,
        chapter: 0,
        title: "Jismni qiya tekislik bo‘ylab ko‘chirishda bajarilgan ish. Qiya tekislikning FIKi",
        summary: "Jismni qiya tekislik bo‘ylab ko‘tarishda foydali ish A_f = mgh, umumiy ish A_um = mgh + μmg·l·cosα. Qiya tekislikning FIKi η = A_f/A_um.",
        formula: "η = mgh/(mgh + μmg·l·cosα) = 1/(1 + μ·ctgα)",
        unit: "%",
        relationship: "Qiya tekislikning FIKi qiyalik burchagiga bog‘liq. Burchak ortishi bilan FIK ortadi, lekin sarflanadigan kuch ham ortadi.",
        application: "Yuk ortish rampalari, qiya yo‘llar.",
        experiment: "Qiya tekislikda yukni ko‘tarishda dinamometr yordamida kuchni o‘lchab, FIKni hisoblang.",
        experimentQuestion: "Qiya tekislikning FIKi nimaga bog‘liq?",
        experimentExplanation: "Qiya tekislikning FIKi qiyalik burchagi va ishqalanish koeffitsiyentiga bog‘liq. Burchak ortishi bilan FIK ortadi, chunki ishqalanishga ketgan ish nisbatan kamayadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 31, type: 'heading', text: "Jismni qiya tekislik bo‘ylab ko‘chirishda bajarilgan ish" },
          { page: 31, type: 'paragraph', text: "Jismni tik yuqoriga tekis ko‘tarishda og‘irlik kuchiga qarshi ish bajaramiz. Bunda bajarilgan ish A₁ = mgh ga teng bo‘ladi." },
          { page: 31, type: 'paragraph', text: "Jismni qiya tekislik bo‘ylab tekis ko‘tarishda esa og‘irlik va ishqalanish kuchlariga qarshi ish bajaramiz. Bu holda bajarilgan ish A₂ = mgh + μmg·l·cosα formula bilan aniqlanadi." },
          { page: 31, type: 'heading', text: "Qiya tekislikning foydali ish koeffitsiyenti" },
          { page: 31, type: 'paragraph', text: "Qiya tekislikning FIKi (η) bajarilgan foydali ishning umumiy ishga nisbati bilan aniqlanadi: η = A_f/A_um = mgh/(mgh + μmg·l·cosα) = 1/(1 + μ·ctgα)." },
          { page: 32, type: 'paragraph', text: "Demak, qiyalik burchagi ortishi bilan qiya tekislikning FIKi ortadi va bajariladigan umumiy ish kamayadi. Lekin qiyalik burchagining ortishi sarflanadigan kuch ortishiga olib keladi." },
          { page: 32, type: 'heading', text: "Masala yechish namunasi" },
          { page: 32, type: 'paragraph', text: "Yuk qiya tekislik bo‘ylab yuqoriga tekis siljitilganda unga ilingan dinamometr 39.2 N ni ko‘rsatdi. Agar jism og‘irligi 117.6 N, qiya tekislik uzunligi 1.8 m, balandligi 30 cm bo‘lsa, yukka ta’sir etuvchi ishqalanish kuchi va qiya tekislikning FIKi qanchaga teng? η = Ph/Fl · 100% = 117.6·0.3/(39.2·1.8)·100% = 50%. F_ishq = F − P·h/l = 39.2 − 117.6·0.3/1.8 = 19.6 N." }
        ],
        reward: 80,
        simulation: 'ramp'
      },

      // 10-mavzu. Masalalar yechish
      {
        id: 'l10',
        number: 10,
        chapter: 0,
        title: "Masalalar yechish",
        summary: "Qiya tekislik va FIKga oid masalalarni yechish.",
        formula: "η = A_f/A_um, a = g(sinα − μcosα)",
        unit: "%, m/s²",
        relationship: "Qiya tekislikning FIKi va jismning tezlanishi qiyalik burchagi va ishqalanish koeffitsiyentiga bog‘liq.",
        application: "Yuk ko‘tarish mexanizmlari, rampali qurilmalar.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 33, type: 'heading', text: "Masala yechish namunalari" },
          { page: 33, type: 'paragraph', text: "1. Og‘irligi 1000 N bo‘lgan jism gorizont bilan 30° burchak hosil qilgan tekislik bo‘ylab yuqoriga harakatlanmoqda. Yuqoriga tortuvchi kuch qiya tekislikka parallel bo‘lib, uning qiymati 800 N. Ishqalanish koeffitsiyenti 0.05 ga teng. 2 s davomida yuk qancha masofaga siljiydi? s = ((F_t/P) − μcosα − sinα)·gt²/2 = (0.8 − 0.05·0.866 − 0.5)·9.8·4/2 ≈ 5 m." },
          { page: 33, type: 'paragraph', text: "2. Og‘irligi 49·10⁵ N bo‘lgan elektropoyezd qiya tekislikdan yuqoriga tekis harakatlanib, 5 minutda 3 km masofani bosib o‘tdi. Tekislikning qiyaligi 1 km ga 4 m ni tashkil etadi. Ishqalanish koeffitsiyenti 0.002 bo‘lsa, poyezdning bajargan ishi va quvvatini toping. A = P(sinα + μcosα)s = 49·10⁵·(0.004 + 0.002)·3000 = 88.2 MJ. N = A/t = 88.2·10⁶/300 = 294 kW." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 11-mavzu. Laboratoriya ishi. Qiya tekislikning FIKini aniqlash
      {
        id: 'l11',
        number: 11,
        chapter: 0,
        title: "Laboratoriya ishi. Qiya tekislikning FIKini aniqlash",
        summary: "Qiya tekislikning foydali ish koeffitsiyentini tajriba yo‘li bilan aniqlash.",
        formula: "η = Ph/(Fl) · 100%",
        unit: "%",
        relationship: "Qiya tekislikning FIKi qiyalik burchagiga bog‘liq. Burchak ortishi bilan FIK ortadi.",
        application: "Laboratoriya ishi - qiya tekislikning FIKini o‘lchash.",
        experiment: "Qiya tekislik, dinamometr, brusok yordamida FIKni aniqlash.",
        experimentQuestion: "Qiya tekislikning FIKi qiyalik burchagiga qanday bog‘liq?",
        experimentExplanation: "Qiyalik burchagi ortishi bilan FIK ortadi, chunki ishqalanishga ketgan ish nisbatan kamayadi. η = 1/(1 + μ·ctgα) formulaga ko‘ra, α ortishi bilan ctgα kamayadi, shuning uchun η ortadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 35, type: 'heading', text: "Ishning maqsadi" },
          { page: 35, type: 'paragraph', text: "Qiya tekislik va undan nima maqsadda foydalanishni o‘rganish. Qiya tekislikda jismni ko‘tarishda bajariladigan foydali va to‘la ishlarni hamda qiya tekislikning foydali ish koeffitsiyenti haqidagi bilimlarni mustahkamlash." },
          { page: 35, type: 'paragraph', text: "Kerakli asbob va materiallar: uzun yupqa taxta, qisqichli shtativ, yog‘och brusok, chizg‘ich, yuklar to‘plami, dinamometr." },
          { page: 35, type: 'paragraph', text: "Ishni bajarish tartibi: 1. Qiya tekislik uzunligi (l) va balandligi (h) o‘lchanadi. 2. Brusokning og‘irligi P aniqlanadi. 3. Brusokni qiya tekislik bo‘ylab F kuch bilan bir tekisda tortamiz. 4. A_f = Ph, A_um = Fl hisoblanadi. 5. η = A_f/A_um · 100% hisoblanadi." }
        ],
        reward: 60,
        simulation: 'scale'
      },

      // 12-mavzu. Massa markazi. Muvozanat turlari. Kuch momenti
      {
        id: 'l12',
        number: 12,
        chapter: 0,
        title: "Massa markazi. Muvozanat turlari. Kuch momenti",
        summary: "Jismning massa markazi uning og‘irlik markazi bilan ustma-ust tushadi. Muvozanat turg‘un, turg‘unmas va farqsiz bo‘ladi. Kuch momenti M = F·l.",
        formula: "M = F·l, M₁ = M₂ (muvozanat sharti)",
        unit: "N·m",
        relationship: "Kuch momenti kuch va kuch yelkasining ko‘paytmasiga teng. Richag muvozanatda bo‘lishi uchun uni soat strelkasi bo‘yicha aylantiruvchi momentlar yig‘indisi teskari yo‘nalishdagilarga teng bo‘lishi kerak.",
        application: "Richaglar, tarozi, qaychi, omburlar.",
        experiment: "Sterjen va yuklar yordamida richag muvozanatini o‘rganing.",
        experimentQuestion: "Kuch yelkasi o‘zgarganda muvozanat sharti qanday o‘zgaradi?",
        experimentExplanation: "Richag muvozanatda bo‘lishi uchun F₁·l₁ = F₂·l₂. Kuch yelkasi katta bo‘lsa, muvozanatni saqlash uchun kichikroq kuch qo‘yish yetarli.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 36, type: 'heading', text: "Massa markazi va ularni aniqlash usullari" },
          { page: 36, type: 'paragraph', text: "Jismlarning muvozanatda bo‘lishi ularning massa markazi vaziyatiga bog‘liq bo‘ladi. Massa markazi jism yoki jismlar sistemasiga nisbatan aniqlanadigan nuqtadir. Jismlarning massa markazlari ularning og‘irlik markazlari bilan ustma-ust tushadi." },
          { page: 36, type: 'paragraph', text: "Jismning barcha qismiga ta’sir etuvchi og‘irlik kuchlarining teng ta’sir etuvchisi jismning og‘irlik markazidan o‘tuvchi to‘g‘ri chiziqda yotadi." },
          { page: 37, type: 'heading', text: "Jismlarning muvozanat turlari" },
          { page: 37, type: 'paragraph', text: "Muvozanat turlari uch xil bo‘ladi: turg‘un muvozanat, turg‘unmas muvozanat, farqsiz muvozanat." },
          { page: 37, type: 'paragraph', text: "Jism muvozanat vaziyatidan chiqarilib, qo‘yib yuborilganda uni dastlabki vaziyatiga qaytaruvchi kuch hosil bo‘lsa — turg‘un muvozanat." },
          { page: 37, type: 'paragraph', text: "Jism muvozanat vaziyatidan chiqarilib, qo‘yib yuborilganda uni dastlabki vaziyatidan yanada ko‘proq uzoqlashtiradigan kuch hosil bo‘lsa — turg‘unmas muvozanat." },
          { page: 37, type: 'paragraph', text: "Jism muvozanat vaziyatidan chiqarilib, qo‘yib yuborilganda uning vaziyatini o‘zgartiradigan hech qanday kuch hosil bo‘lmasa — farqsiz muvozanat." },
          { page: 37, type: 'heading', text: "Kuch momenti" },
          { page: 37, type: 'paragraph', text: "Aylanish o‘qidan kuchning ta’sir etish chizig‘igacha bo‘lgan eng qisqa masofa kuch yelkasi deb ataladi. Aylanish o‘qiga ega bo‘lgan jismga qo‘yilgan kuch va kuch yelkasining ko‘paytmasi kuch momenti deb ataladi. M = F·l." },
          { page: 38, type: 'paragraph', text: "Richagning muvozanatda bo‘lish sharti: F₁·l₁ = F₂·l₂, M₁ = M₂." },
          { page: 39, type: 'heading', text: "Masala yechish namunasi" },
          { page: 39, type: 'paragraph', text: "Richagning uzun yelkasi 6 m ga, qisqa yelkasi esa 2 m ga teng. Uzun yelkasiga qo‘yilgan 500 N kuch yordamida qisqa tomonning uchi bilan qanday massali yukni ko‘tarish mumkin? m = F₁l₁/(g·l₂) = 500·6/(9.8·2) ≈ 153 kg." }
        ],
        reward: 80,
        simulation: 'balance'
      },

      // 13-mavzu. Momentlar qoidasiga asoslanib ishlaydigan oddiy mexanizmlar
      {
        id: 'l13',
        number: 13,
        chapter: 0,
        title: "Momentlar qoidasiga asoslanib ishlaydigan oddiy mexanizmlar",
        summary: "Momentlar qoidasiga asosan, jismni bir tomonga aylantiruvchi kuchlar momentlarining yig‘indisi qarama-qarshi tomonga aylantiruvchi kuchlar momentlari yig‘indisiga teng bo‘lganda jism muvozanatda bo‘ladi.",
        formula: "M₁ + M₂ + ... + Mₙ = 0, F = mg/(2ⁿ)",
        unit: "N·m, N",
        relationship: "Polispastda kuchdan yutuq ko‘char bloklar soniga bog‘liq: F = mg/(2ⁿ), bunda n — ko‘char bloklar soni.",
        application: "Richag, ko‘chmas va ko‘char bloklar, chig‘iriq, vint, domkrat.",
        experiment: "Polispast yordamida yukni ko‘tarish.",
        experimentQuestion: "Polispastda ko‘char bloklar soni ortishi bilan kuch qanday o‘zgaradi?",
        experimentExplanation: "Ko‘char bloklar soni ortishi bilan F = mg/(2ⁿ) formula bo‘yicha kuch kamayadi, ya’ni kuchdan yutuq ortadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 40, type: 'heading', text: "Juft kuchlar" },
          { page: 40, type: 'paragraph', text: "Aylanish o‘qiga ega bo‘lgan jism kuch momenti ta’sirida harakatga keladi. Bunda jismga ta’sir etayotgan kuch momenti juft kuch ta’siriga o‘xshash bo‘ladi." },
          { page: 41, type: 'paragraph', text: "Momentlar qoidasi: M₁ + M₂ + ... + Mₙ = 0. Bu qoidani Arximed aniqlagan." },
          { page: 41, type: 'heading', text: "Bloklar va vintlar" },
          { page: 41, type: 'paragraph', text: "Polispastda kuchdan yutuq: F = mg/(2ⁿ), bunda n — ko‘char bloklar soni. Ishqalanish bo‘lganda η = mg/(2ⁿF)." },
          { page: 42, type: 'heading', text: "Chig‘iriq (lebyodka)lar va ponalar" },
          { page: 42, type: 'paragraph', text: "Chig‘iriqning kuchdan necha marta yutuq berishi n = R/r formula yordamida topiladi. Lebyodkalarning kuchdan necha marta yutuq berishi n = R₁/R₂." }
        ],
        reward: 80,
        simulation: 'balance'
      },

      // 14-mavzu. Masalalar yechish
      {
        id: 'l14',
        number: 14,
        chapter: 0,
        title: "Masalalar yechish",
        summary: "Momentlar qoidasi va oddiy mexanizmlarga oid masalalarni yechish.",
        formula: "F₁·l₁ = F₂·l₂, F = mg/(2ⁿ)",
        unit: "N, N·m",
        relationship: "Richag va bloklarning muvozanat shartlari.",
        application: "Richag, blok, polispast hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 43, type: 'heading', text: "Masala yechish namunalari" },
          { page: 43, type: 'paragraph', text: "1. Richagning A nuqtasida massasi 200 g bo‘lgan yuk osilgan. Richag muvozanatda turgan bo‘lsa, B nuqtaga osilgan dinamometr necha N kuchni ko‘rsatadi? AO = 5 cm, OB = 2 cm. F₂ = F₁·l₁/l₂ = mg·l₁/l₂ = 0.2·10·0.05/0.02 = 5 N." },
          { page: 43, type: 'paragraph', text: "2. Rasmda tasvirlangan blok muvozanatda turishi uchun 10 kg massali yukni qaysi nuqtaga ilish kerak? l_x = m₁·l₀/m₂ = 4·5/10 = 2 m." },
          { page: 43, type: 'paragraph', text: "3. Og‘irlik kuchi P = 400 N bo‘lgan yukni tekis ko‘tarish uchun ipning uchidagi A nuqtaga necha N kuch qo‘yish kerak? (Rasmga qarab)" }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // ============================================================
      // II BOB: MEXANIK TEBRANISHLAR VA TO‘LQINLAR (6 DARS)
      // ============================================================

      // 15-mavzu. Mexanik tebranishlar
      {
        id: 'l15',
        number: 15,
        chapter: 1,
        title: "Mexanik tebranishlar",
        summary: "Muayyan vaqt oraliqlarida vaziyati davriy ravishda takrorlanib turadigan harakatga tebranma harakat yoki tebranishlar deyiladi.",
        formula: "T = t/N, ν = N/t, ω = 2π/T = 2πν",
        unit: "s, Hz, rad/s",
        relationship: "Tebranish davri va chastotasi o‘zaro teskari munosabatda: T = 1/ν. Siklik chastota ω = 2π/T = 2πν.",
        application: "Soat mayatnigi, prujinadagi yuk, musiqa asboblari torlari.",
        experiment: "Prujinaga osilgan yukning tebranishini kuzating.",
        experimentQuestion: "Tebranish davri amplitudaga bog‘liqmi?",
        experimentExplanation: "Kichik amplitudalar uchun tebranish davri amplitudaga bog‘liq emas (izoxronlik xossasi). Davr faqat sistemaning xususiyatlariga (massa, prujina bikrligi, mayatnik uzunligi) bog‘liq.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 48, type: 'heading', text: "Mexanik tebranishlar" },
          { page: 48, type: 'paragraph', text: "Muayyan vaqt oraliqlarida vaziyati davriy ravishda takrorlanib turadigan harakatga tebranma harakat yoki tebranishlar deyiladi." },
          { page: 48, type: 'heading', text: "Erkin tebranishlar va majburiy tebranishlar" },
          { page: 48, type: 'paragraph', text: "Muvozanat vaziyatidan chiqarilib, qo‘yib yuborilgach, jismning ichki kuchlar ta’siridagi tebranma harakati erkin tebranishlar deyiladi." },
          { page: 48, type: 'paragraph', text: "Tashqi davriy kuch ta’sirida bo‘ladigan tebranishlar majburiy tebranishlar deyiladi." },
          { page: 49, type: 'heading', text: "Tebranish davri, chastotasi va siklik chastotasi" },
          { page: 49, type: 'paragraph', text: "Tebranish davri T = t/N. Tebranish chastotasi ν = N/t. Siklik chastota ω = 2π/T = 2πν." },
          { page: 49, type: 'paragraph', text: "Tebranishning siljishi va amplitudasi: tebranayotgan jismning muvozanat vaziyatidan uzoqlashish masofasi uning siljishi deyiladi. Muvozanat vaziyatidan eng katta siljishi tebranish amplitudasi deyiladi." },
          { page: 50, type: 'heading', text: "Rezonans hodisasi" },
          { page: 50, type: 'paragraph', text: "Tebranayotgan sistemaga ta’sir qiluvchi tashqi kuchning chastotasi, sistemaning xususiy tebranish chastotasiga tenglashganda majburiy tebranish amplitudasining keskin ortib ketish hodisasiga rezonans deyiladi." },
          { page: 50, type: 'heading', text: "Garmonik tebranishlar" },
          { page: 50, type: 'paragraph', text: "Parametrlari sinus yoki kosinus qonuniyati bo‘yicha o‘zgaruvchi tebranma harakat garmonik tebranishlar deyiladi. x = A·sin(ωt + φ₀) yoki x = A·cos(ωt + φ₀)." },
          { page: 51, type: 'heading', text: "Masala yechish namunasi" },
          { page: 51, type: 'paragraph', text: "Moddiy nuqtaning garmonik tebranish tenglamasi x = 0.02·cos(πt) ko‘rinishga ega. Nuqtaning 0.25 s va 1/3 s dan keyingi siljishlarini toping. x₁ = 0.02·cos(π·0.25) = 0.02·√2/2 = 0.0141 m. x₂ = 0.02·cos(π/3) = 0.02·0.5 = 0.01 m." }
        ],
        reward: 80,
        simulation: 'pendulum'
      },

      // 16-mavzu. Prujinali va matematik mayatniklar
      {
        id: 'l16',
        number: 16,
        chapter: 1,
        title: "Prujinali va matematik mayatniklar",
        summary: "Prujinaga osilgan yukning tebranish davri T = 2π√(m/k). Matematik mayatnikning tebranish davri T = 2π√(l/g).",
        formula: "T_p = 2π√(m/k), T_m = 2π√(l/g)",
        unit: "s",
        relationship: "Prujinali mayatnik davri massaning kvadrat ildiziga to‘g‘ri, bikrlikning kvadrat ildiziga teskari proporsional. Matematik mayatnik davri uzunlikning kvadrat ildiziga to‘g‘ri, g ning kvadrat ildiziga teskari proporsional.",
        application: "Soatlar, seysmograflar, mayatnikli asboblar.",
        experiment: "Har xil uzunlikdagi mayatniklarning tebranish davrini solishtiring.",
        experimentQuestion: "Mayatnik uzunligi o‘zgarganda tebranish davri qanday o‘zgaradi?",
        experimentExplanation: "T = 2π√(l/g) formulaga ko‘ra, uzunlik 4 marta ortsa, davr 2 marta ortadi. Uzunlik 16 marta kamaysa, davr 4 marta kamayadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 52, type: 'heading', text: "Prujinali mayatnik" },
          { page: 52, type: 'paragraph', text: "Prujinaga mahkamlangan jism va elastiklik kuchi ta’sirida tebranma harakat qiladigan sistema prujinali mayatnik deyiladi. Elastiklik kuchi F = −k·Δx." },
          { page: 52, type: 'paragraph', text: "Prujinali mayatnikning tebranish davri T = 2π√(m/k). Chastotasi ν = (1/2π)√(k/m)." },
          { page: 52, type: 'heading', text: "Matematik mayatnik" },
          { page: 52, type: 'paragraph', text: "Cho‘zilmaydigan vaznsiz uzun ipga osilgan jism va og‘irlik kuchi ta’sirida tebranma harakat qiladigan sistema matematik mayatnik deyiladi." },
          { page: 52, type: 'paragraph', text: "Matematik mayatnikning tebranish davri T = 2π√(l/g). Bu formula Gyuygens formulasi deb ataladi." },
          { page: 53, type: 'heading', text: "Masala yechish namunasi" },
          { page: 53, type: 'paragraph', text: "Birinchi mayatnikning tebranish davri 3 s, ikkinchisiniki 4 s ga teng. Ular uzunliklari yig‘indisiga teng bo‘lgan mayatnikning tebranish davrini toping. T = √(T₁² + T₂²) = √(9 + 16) = 5 s." }
        ],
        reward: 80,
        simulation: 'pendulum'
      },

      // 17-mavzu. Laboratoriya ishi. Matematik mayatnik yordamida erkin tushish tezlanishini aniqlash
      {
        id: 'l17',
        number: 17,
        chapter: 1,
        title: "Laboratoriya ishi. Matematik mayatnik yordamida erkin tushish tezlanishini aniqlash",
        summary: "Matematik mayatnik yordamida erkin tushish tezlanishini aniqlash.",
        formula: "g = 4π²·l/T²",
        unit: "m/s²",
        relationship: "Erkin tushish tezlanishi mayatnik uzunligiga to‘g‘ri, davr kvadratiga teskari proporsional.",
        application: "Laboratoriya ishi.",
        experiment: "Matematik mayatnik yordamida g ni o‘lchash.",
        experimentQuestion: "Erkin tushish tezlanishi qanday kattaliklarga bog‘liq?",
        experimentExplanation: "Erkin tushish tezlanishi Yer sirtida 9.8 m/s² ga teng. U balandlik va geografik kenglikka bog‘liq. Ekvatorda kichikroq, qutblarda kattaroq.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 54, type: 'heading', text: "Ishning maqsadi" },
          { page: 54, type: 'paragraph', text: "Erkin tushish tezlanishini matematik mayatnik yordamida aniqlash usulini o‘rganish." },
          { page: 54, type: 'paragraph', text: "Kerakli asbob-uskunalar: laboratoriya universal shtativi; cho‘zilmas ip; sharcha; sekundomer; o‘lchov lentasi." },
          { page: 54, type: 'paragraph', text: "Ishni bajarish tartibi: 1. Ipnni imkon boricha uzunroq holda mahkamlang. 2. Ip uzunligini o‘lchang. 3. Sharchani kichik burchakka og‘dirib qo‘yib yuboring va sekundomerni ishga tushiring. 4. N ta tebranish vaqtini o‘lchang. 5. T = t/N dan davrni toping. 6. g = 4π²·l/T² dan g ni hisoblang." }
        ],
        reward: 60,
        simulation: 'pendulum'
      },

      // 18-mavzu. Mexanik to‘lqinlar
      {
        id: 'l18',
        number: 18,
        chapter: 1,
        title: "Mexanik to‘lqinlar",
        summary: "Mexanik tebranishlarning muhitda tarqalishi mexanik to‘lqin deyiladi. To‘lqinlar ko‘ndalang va bo‘ylama bo‘ladi.",
        formula: "λ = v·T, λ = v/ν",
        unit: "m",
        relationship: "To‘lqin uzunligi to‘lqinning tarqalish tezligi va davrining ko‘paytmasiga teng. λ = v/ν.",
        application: "Suv to‘lqinlari, tovush, seysmik to‘lqinlar.",
        experiment: "Suv sirtida to‘lqin hosil qilib, ularning tarqalishini kuzating.",
        experimentQuestion: "To‘lqin uzunligi qanday aniqlanadi?",
        experimentExplanation: "To‘lqin uzunligi — bir marta to‘la tebranish davomida to‘lqin tarqaladigan masofa. U qo‘shni do‘ngliklar orasidagi masofaga teng.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 55, type: 'heading', text: "Ko‘ndalang va bo‘ylama to‘lqinlar" },
          { page: 55, type: 'paragraph', text: "Mexanik tebranishlarning muhitda tarqalishi mexanik to‘lqin deyiladi. To‘lqinlar tarqalganda muhit zarralari ko‘chmaydi, balki zarralar muvozanat vaziyati atrofida tebranadi." },
          { page: 55, type: 'paragraph', text: "Bo‘ylama to‘lqinlarda muhit zarralari to‘lqin tarqalish yo‘nalishida tebranadi. Ko‘ndalang to‘lqinlarda esa muhit zarralari to‘lqinning tarqalish yo‘nalishiga tik yo‘nalishda tebranadi." },
          { page: 55, type: 'paragraph', text: "Gazlarda faqat bo‘ylama to‘lqinlar tarqaladi. Suyuqlik sirtida ko‘ndalang to‘lqin, suyuqlik ichida esa bo‘ylama to‘lqin tarqaladi. Qattiq jismlarda ham bo‘ylama, ham ko‘ndalang to‘lqinlar tarqaladi." },
          { page: 56, type: 'heading', text: "To‘lqin tavsiflari" },
          { page: 56, type: 'paragraph', text: "To‘lqin uzunligi λ = v·T = v/ν." },
          { page: 56, type: 'heading', text: "Masala yechish namunasi" },
          { page: 56, type: 'paragraph', text: "Ko‘l yuzida hosil qilingan to‘lqinlar 6 m/s tezlik bilan tarqalmoqda. Bunda to‘lqinning qo‘shni do‘ngliklari orasidagi masofa 1.5 m. Unda qalqib turgan plastik idishning tebranish davri va chastotasi nimaga teng? T = λ/v = 1.5/6 = 0.25 s. ν = v/λ = 6/1.5 = 4 Hz." }
        ],
        reward: 80,
        simulation: 'wavesIntro'
      },

      // 19-mavzu. Tovush to‘lqinlari
      {
        id: 'l19',
        number: 19,
        chapter: 1,
        title: "Tovush to‘lqinlari",
        summary: "Inson eshita oladigan mexanik to‘lqinlarga tovush to‘lqinlari deyiladi. Tovush chastotasi 17-20000 Hz oralig‘ida bo‘ladi.",
        formula: "v = λ·ν",
        unit: "m/s",
        relationship: "Tovush tezligi muhitning zichligiga va temperaturasiga bog‘liq. Havoda 20°C da 343 m/s, suvda 1440 m/s, temirda 5850 m/s.",
        application: "Tovush, ultratovush, infratovush, exolokatsiya.",
        experiment: "Turli muhitlarda tovushning tarqalishini solishtiring.",
        experimentQuestion: "Tovush qattiqligi nimaga bog‘liq?",
        experimentExplanation: "Tovush qattiqligi amplitudaga bog‘liq. Tovush balandligi chastotaga bog‘liq. Tovush tembri tebranishlarning chastotalar bo‘yicha taqsimlanishiga bog‘liq.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 57, type: 'heading', text: "Tovush nima?" },
          { page: 57, type: 'paragraph', text: "Inson eshita oladigan mexanik to‘lqinlarga tovush to‘lqinlari deyiladi. Tovush elastik muhitda tarqaladi, vakuumda tarqala olmaydi. Inson qulog‘i sezadigan tovush to‘lqinlarining chastotasi 17-20000 Hz oralig‘ida bo‘ladi." },
          { page: 57, type: 'heading', text: "Tovushning tezligi" },
          { page: 57, type: 'paragraph', text: "Havo temperaturasi 0°C bo‘lganda tovushning tarqalish tezligi 330 m/s ga teng. Havo temperaturasi 20°C bo‘lganda 343 m/s ga teng. Suvda 8°C da 1440 m/s. Temirda 20°C da 5850 m/s." },
          { page: 58, type: 'heading', text: "Tovush kattaliklari" },
          { page: 58, type: 'paragraph', text: "Tovush qattiqligi — amplituda bilan o‘lchanadi, Bell va Detsibell (dB) larda o‘lchanadi. Inson qulog‘ining og‘riq sezish chegarasi 130 dB." },
          { page: 58, type: 'paragraph', text: "Tovush balandligi — chastota bilan tavsiflanadi." },
          { page: 58, type: 'paragraph', text: "Tovush tembri — tebranishlarning chastotalar bo‘yicha taqsimlanishini tavsiflovchi kattalik." },
          { page: 59, type: 'heading', text: "Ultratovushlar" },
          { page: 59, type: 'paragraph', text: "Chastotasi 20000 Hz dan katta bo‘lgan tovush to‘lqinlariga ultratovushlar deyiladi. Ultratovush texnikada va tibbiyotda keng qo‘llanadi." },
          { page: 59, type: 'paragraph', text: "Chastotasi 17 Hz dan kichik bo‘lgan elastik to‘lqinlar infratovush deb ataladi." },
          { page: 60, type: 'heading', text: "Masala yechish namunasi" },
          { page: 60, type: 'paragraph', text: "Qoya ro‘parasida turgan bola ovozining aks sadosini 2 s dan so‘ng eshitdi. Boladan qoyagacha bo‘lgan masofa qanchaga teng? s = v·t/2 = 340·2/2 = 340 m." }
        ],
        reward: 80,
        simulation: 'sound'
      },

      // 20-mavzu. Masalalar yechish
      {
        id: 'l20',
        number: 20,
        chapter: 1,
        title: "Masalalar yechish",
        summary: "Tebranishlar va to‘lqinlarga oid masalalarni yechish.",
        formula: "T = t/N, ν = N/t, λ = v·T, x = A·cos(ωt)",
        unit: "s, Hz, m, m",
        relationship: "Tebranish davri va chastotasi o‘zaro teskari. To‘lqin uzunligi tezlik va davr ko‘paytmasiga teng.",
        application: "Mayatnik, to‘lqin, tovush hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 61, type: 'heading', text: "Masala yechish namunalari" },
          { page: 61, type: 'paragraph', text: "1. Jism x = A·cos(ωt) tenglamaga muvofiq tebranma harakat qilmoqda. Tebranuvchi jism 0.8 s da 50 cm siljisa, tebranish amplitudasini, davrini va chastotasini toping. ω = 2.5π s⁻¹. T = 2π/ω = 2π/(2.5π) = 0.8 s. ν = 1/T = 1.25 Hz. A = 0.5 m." },
          { page: 61, type: 'paragraph', text: "2. Prujinaga m massali yuk osib, qo‘yib yuborilganda u 9 cm ga cho‘zilib, tebrana boshladi. Prujinaning tebranish davrini toping. T = 2π√(Δx/g) = 2π√(0.09/9.8) ≈ 0.6 s." },
          { page: 61, type: 'paragraph', text: "3. Ko‘lda suv betidagi to‘lqin 6 m/s tezlik bilan tarqaladi. Agar to‘lqin uzunligi 3 m bo‘lsa, uning tebranish davrini va chastotasini toping. T = λ/v = 3/6 = 0.5 s. ν = v/λ = 6/3 = 2 Hz." },
          { page: 62, type: 'paragraph', text: "4. Rasmdagi to‘lqinning uzunligini aniqlang (m). Bunda ikki qo‘shni do‘nglik orasidagi masofa to‘lqinning uzunligiga teng bo‘ladi. Rasmdan ko‘rinib turibdiki, to‘lqin uzunligi 4 m ga teng." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // ============================================================
      // III BOB: GIDRODINAMIKA VA AERODINAMIKA (3 DARS)
      // ============================================================

      // 21-mavzu. Suyuqlik va gazlar harakati
      {
        id: 'l21',
        number: 21,
        chapter: 2,
        title: "Suyuqlik va gazlar harakati",
        summary: "Suyuqlik yoki gazlarning qatlam-qatlam bo‘lib oqishi laminar oqim, tartibsiz oqishi turbulent oqim deyiladi. Oqim uzluksizligi tenglamasi: S₁v₁ = S₂v₂.",
        formula: "S₁v₁ = S₂v₂",
        unit: "m³/s",
        relationship: "Suyuqlik tezligi kesim yuzasiga teskari proporsional: v₂ = v₁·S₁/S₂.",
        application: "Vodoprovod, daryolar, shamol, qon oqimi.",
        experiment: "Turli diametrli shlanglardan suv oqimini kuzating.",
        experimentQuestion: "Nayning tor qismida suv tezligi qanday o‘zgaradi?",
        experimentExplanation: "Oqim uzluksizligi tenglamasiga ko‘ra, nayning tor qismida tezlik ortadi, chunki S₁v₁ = S₂v₂, v₂ = v₁·S₁/S₂.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 66, type: 'heading', text: "Laminar oqim" },
          { page: 66, type: 'paragraph', text: "Suyuqlik yoki gazlarning qatlam-qatlam bo‘lib oqishi laminar oqim deyiladi. Laminar oqimda suyuqlik yoki gaz zarralari bir-birining yo‘llarini kesmasdan to‘g‘ri yo‘nalishda oqadi." },
          { page: 66, type: 'heading', text: "Turbulent oqim" },
          { page: 66, type: 'paragraph', text: "Suyuqlik yoki gaz tez oqqanda uning qismlari alohida qatlam ko‘rinishida bo‘lmasdan, girdob, ya’ni uyurma ko‘rinishidagi harakatlarni hosil qiladi. Turbulent oqimda suyuqlik yoki gaz zarralari har xil yo‘nalish bo‘ylab tartibsiz harakat qiladi." },
          { page: 67, type: 'heading', text: "Oqim uzluksizligi" },
          { page: 67, type: 'paragraph', text: "Suyuqlik siqilmas bo‘lganligi sababli nayning ixtiyoriy kesim yuzasi orqali bir xil Δt vaqt oralig‘ida oqib o‘tadigan suyuqliklar massasi teng bo‘ladi: ρ₁S₁v₁Δt = ρ₂S₂v₂Δt. ρ₁ = ρ₂ bo‘lgani uchun S₁v₁ = S₂v₂." },
          { page: 68, type: 'heading', text: "Bernulli tenglamasi" },
          { page: 68, type: 'paragraph', text: "p + ρgh + ρv²/2 = const. Suyuqlik oqayotgan nayning keng qismida gidrodinamik bosim kichik, gidrostatik bosim esa katta bo‘ladi." },
          { page: 68, type: 'heading', text: "Masala yechish namunasi" },
          { page: 68, type: 'paragraph', text: "O‘zgaruvchan kesimli quvurning kesimi 50 cm² bo‘lgan qismida oqayotgan suvning tezligi 4 m/s ga teng bo‘lsa, kesimi 10 cm² bo‘lgan qismidagi suvning tezligini aniqlang. v₂ = v₁·S₁/S₂ = 4·50/10 = 20 m/s." }
        ],
        reward: 80,
        simulation: 'fluid'
      },

      // 22-mavzu. Harakatlanayotgan gaz va suyuqlik bosimining tezlikka bog‘liqligidan texnikada foydalanish
      {
        id: 'l22',
        number: 22,
        chapter: 2,
        title: "Harakatlanayotgan gaz va suyuqlik bosimining tezlikka bog‘liqligidan texnikada foydalanish",
        summary: "Bernulli qonuni samolyot qanotini ko‘taruvchi kuch, Magnus effekti va Torrichelli formulasida qo‘llanadi.",
        formula: "v = √(2gh) — Torrichelli formulasi",
        unit: "m/s",
        relationship: "Suyuqlik tezligi idishdagi suyuqlik sathining balandligiga bog‘liq: v = √(2gh).",
        application: "Samolyot qanoti, Magnus effekti, idishdagi teshikdan otilib chiqayotgan suyuqlik.",
        experiment: "Qog‘oz varaqlari orasiga puflab, ularning tortilishini kuzating.",
        experimentQuestion: "Nima uchun qog‘ozlar bir-biriga tortiladi?",
        experimentExplanation: "Qog‘ozlar orasidagi havo puflash natijasida harakatga keladi va ular orasidagi bosim kamayadi. Qog‘ozlarning tashqi tomonidagi bosim ichki qismidagidan katta bo‘lib qolganligi tufayli qog‘ozlarni siquvchi kuch paydo bo‘ladi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 70, type: 'heading', text: "Samolyot qanotini ko‘taruvchi kuch" },
          { page: 70, type: 'paragraph', text: "Samolyot qanoti suyri shakliga ega bo‘ladi. Qanotning ustki qismida shamol o‘tishi kerak bo‘lgan yo‘l pastki qismidagi yo‘ldan kattaroq bo‘lganligi sababli ustki qismidagi shamol tezligi pastki qismidagi shamol tezligidan kattaroq bo‘ladi. Bernulli tenglamasiga muvofiq, qanotning ustki qismida bosim kichikroq, ostki qismida bosim kattaroq bo‘ladi." },
          { page: 71, type: 'heading', text: "Magnus effekti" },
          { page: 71, type: 'paragraph', text: "Suyuqlik yoki gaz aylanuvchi jism atrofidan oqib o‘tganda sodir bo‘ladigan fizik hodisaga Magnus effekti deyiladi. Bu hodisada oqimga tik yo‘nalgan jismga ta’sir etuvchi kuch paydo bo‘ladi." },
          { page: 71, type: 'heading', text: "Idishdagi tirqishdan otilib chiqayotgan suyuqlik tezligini hisoblash" },
          { page: 71, type: 'paragraph', text: "Torrichelli formulasi: v = √(2gh)." }
        ],
        reward: 80,
        simulation: 'fluid'
      },

      // 23-mavzu. Masalalar yechish
      {
        id: 'l23',
        number: 23,
        chapter: 2,
        title: "Masalalar yechish",
        summary: "Gidrodinamika va aerodinamikaga oid masalalarni yechish.",
        formula: "S₁v₁ = S₂v₂, v = √(2gh), p₁ + ρv₁²/2 = p₂ + ρv₂²/2",
        unit: "m/s, m³/s, Pa",
        relationship: "Oqim uzluksizligi va Bernulli tenglamasini qo‘llash.",
        application: "Suyuqlik oqimi, bosim, tezlik hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 72, type: 'heading', text: "Masala yechish namunalari" },
          { page: 72, type: 'paragraph', text: "1. Trubaning ko‘ndalang kesimidan yarim soatda 500 l karbonat angidrid gazi oqib o‘tganligi ma’lum bo‘lsa, trubadagi gazning oqim tezligini toping. Trubaning diametri 2 cm ga teng. v = 4V/(πD²t) = 4·0.5/(3.14·0.02²·1800) ≈ 0.88 m/s." },
          { page: 72, type: 'paragraph', text: "2. Trubaning ko‘ndalang kesimidan yarim soatda 0.51 kg karbonat angidrid gazi oqib o‘tganligi ma’lum bo‘lsa, trubadagi gazning oqim tezligini toping. Gazning zichligi 7.5 kg/m³, trubaning diametri 2 cm. v = 4m/(πρD²t) = 4·0.51/(3.14·7.5·0.02²·1800) ≈ 0.12 m/s." },
          { page: 72, type: 'paragraph', text: "3. Bo‘yi 5 m bo‘lgan sisternada yerdan 50 cm balandlikda jo‘mrak o‘rnatilgan. Jo‘mrak ochilsa, undan suyuqlik qanday tezlik bilan otilib chiqadi? v = √(2g(H-h)) = √(2·10·(5-0.5)) ≈ 9.5 m/s." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // ============================================================
      // IV BOB: ELEKTROSTATIK MAYDON (8 DARS)
      // ============================================================

      // 24-mavzu. Elektr maydon kuchlanganligining superpozitsiya prinsipi
      {
        id: 'l24',
        number: 24,
        chapter: 3,
        title: "Elektr maydon kuchlanganligining superpozitsiya prinsipi",
        summary: "Elektr maydonga kiritilgan birlik musbat sinov zaryadiga maydon tomonidan ta’sir etuvchi kuchga son jihatidan teng bo‘lgan kattalik elektr maydon kuchlanganligi deyiladi.",
        formula: "E = F/q_s, E = k·|q|/r², E = E₁ + E₂ + ... + Eₙ",
        unit: "N/C, V/m",
        relationship: "Zaryadlar sistemasining biror nuqtada hosil qilgan elektr maydon kuchlanganligi sistemaga kiruvchi har bir zaryadning o‘sha nuqtadagi maydon kuchlanganliklarining vektor yig‘indisiga teng.",
        application: "Elektr maydon chiziqlari, zaryadlarning o‘zaro ta’siri.",
        experiment: "Elektroskop yordamida zaryadlarni va maydonni kuzating.",
        experimentQuestion: "Ikki zaryad orasidagi maydon kuchlanganligi qanday topiladi?",
        experimentExplanation: "Superpozitsiya prinsipiga ko‘ra, natijaviy maydon kuchlanganligi har bir zaryadning maydon kuchlanganliklarining vektor yig‘indisiga teng: E = E₁ + E₂.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 76, type: 'heading', text: "Elektrostatik maydon" },
          { page: 76, type: 'paragraph', text: "Qo‘zg‘almas zaryadlar atrofida hosil bo‘ladigan elektr maydoni elektrostatik maydon deyiladi." },
          { page: 76, type: 'heading', text: "Elektrostatik maydon kuchlanganligi" },
          { page: 76, type: 'paragraph', text: "Elektr maydonga kiritilgan birlik musbat sinov zaryadiga maydon tomonidan ta’sir etuvchi kuchga son jihatidan teng bo‘lgan kattalik elektr maydon kuchlanganligi deyiladi. E = F/q_s." },
          { page: 76, type: 'paragraph', text: "Nuqtaviy zaryadning elektr maydon kuchlanganligi: E = k·|q|/r², k = 9·10⁹ N·m²/C²." },
          { page: 77, type: 'heading', text: "Elektr maydonning superpozitsiya prinsipi" },
          { page: 77, type: 'paragraph', text: "Zaryadlar sistemasining biror nuqtada hosil qilgan elektr maydon kuchlanganligi sistemaga kiruvchi har bir zaryadning o‘sha nuqtadagi maydon kuchlanganliklarining vektor yig‘indisiga teng: E = E₁ + E₂ + ... + Eₙ." },
          { page: 78, type: 'heading', text: "Natijaviy elektr maydon kuchlanganligi" },
          { page: 78, type: 'paragraph', text: "E = √(E₁² + E₂² + 2E₁E₂·cosα). α = 0° da E = E₁ + E₂; α = 90° da E = √(E₁² + E₂²); α = 180° da E = |E₁ − E₂|." },
          { page: 78, type: 'heading', text: "Masala yechish namunasi" },
          { page: 78, type: 'paragraph', text: "Ikkita nuqtaviy zaryadning zaryadlari q₁ = 6 nC va q₂ = -16 nC havoda bir-biridan r = 5 cm masofada joylashgan. Musbat zaryaddan r₁ = 3 cm va manfiy zaryaddan r₂ = 4 cm masofada joylashgan nuqtada elektr maydon kuchlanganligining modulini aniqlang. E₁ = k·|q₁|/r₁² = 9·10⁹·6·10⁻⁹/0.03² = 60000 N/C. E₂ = 9·10⁹·16·10⁻⁹/0.04² = 90000 N/C. E = √(E₁² + E₂²) = √(36·10⁸ + 81·10⁸) ≈ 108·10³ N/C." }
        ],
        reward: 80,
        simulation: 'chargesFields'
      },

      // 25-mavzu. Zaryadlangan sharning elektr maydoni
      {
        id: 'l25',
        number: 25,
        chapter: 3,
        title: "Zaryadlangan sharning elektr maydoni",
        summary: "Zaryadlangan shar ichida elektr maydon nolga teng. Shar sirtida va tashqarisida maydon nuqtaviy zaryad maydoniga o‘xshaydi.",
        formula: "E = k·|q|/r² (r > R), E = 0 (r < R)",
        unit: "N/C, V/m",
        relationship: "Zaryadlangan sharning sirtida elektr maydon kuchlanganligi E = σ/ε₀, bunda σ — zaryadning sirt zichligi.",
        application: "Metall sharlar, kondensatorlar, elektr maydon himoyasi.",
        experiment: "Zaryadlangan shar atrofidagi maydonni elektroskop yordamida kuzating.",
        experimentQuestion: "Zaryadlangan shar ichida elektr maydon nima uchun nolga teng?",
        experimentExplanation: "Zaryadlar shar sirti bo‘ylab taqsimlanganligi uchun shar ichida natijaviy maydon nolga teng. Bu elektrostatik induksiya hodisasi bilan izohlanadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 80, type: 'heading', text: "Zaryadlangan metall sharning elektr maydoni" },
          { page: 80, type: 'paragraph', text: "Radiusi R bo‘lgan elektr o‘tkazuvchi shar q zaryad bilan zaryadlangan bo‘lsin. Zaryadlangan shar (sfera)ning hosil qilayotgan elektr maydon kuchlanganligi uning markazida, sirtida va tashqarisidagi biror nuqtada turlicha bo‘ladi." },
          { page: 80, type: 'paragraph', text: "Shar sirtidan tashqaridagi elektr maydon kuch chiziqlari xuddi nuqtaviy zaryadning kuchlanganlik chiziqlari kabi bo‘ladi: E = k·|q|/r²." },
          { page: 80, type: 'paragraph', text: "Shar ichida (r < R) elektr maydon kuchlanganligi doim nolga teng (E_ichki = 0)." },
          { page: 81, type: 'heading', text: "Zaryadning sirt zichligi" },
          { page: 81, type: 'paragraph', text: "Sirtning birlik yuzaga to‘g‘ri keladigan zaryad miqdori bilan o‘lchanadigan kattalik zaryadning sirt zichligi deb ataladi. σ = q/S = q/(4πR²)." },
          { page: 81, type: 'paragraph', text: "Shar sirtidagi elektr maydon kuchlanganligi: E = σ/ε₀." },
          { page: 82, type: 'heading', text: "Muhitning dielektrik singdiruvchanligi" },
          { page: 82, type: 'paragraph', text: "Muhitning nisbiy dielektrik singdiruvchanligi moddaning elektr xossalarini xarakterlaydi: ε = E₀/E. Dielektrik ichida E = E₀/ε." },
          { page: 83, type: 'heading', text: "Masala yechish namunasi" },
          { page: 83, type: 'paragraph', text: "Biror muhitda turgan radiusi 4 cm ga teng bo‘lgan shar sirtidan uning diametriga teng masofada elektr maydon kuchlanganligi 123 V/m ga teng. Agar sharga 16 nC zaryad berilgan bo‘lsa, muhitning dielektrik singdiruvchanligini toping. ε = k·q/(E·r²) = 9·10⁹·16·10⁻⁹/(123·(0.12)²) ≈ 81." }
        ],
        reward: 80,
        simulation: 'chargesFields'
      },

      // 26-mavzu. Masalalar yechish
      {
        id: 'l26',
        number: 26,
        chapter: 3,
        title: "Masalalar yechish",
        summary: "Elektrostatik maydonga oid masalalarni yechish.",
        formula: "E = k·|q|/r², E = E₁ + E₂, E = √(E₁² + E₂²)",
        unit: "N/C, V/m",
        relationship: "Nuqtaviy zaryad va zaryadlar sistemasining maydon kuchlanganligi.",
        application: "Zaryadlarning o‘zaro ta’siri, maydon hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 84, type: 'heading', text: "Masala yechish namunalari" },
          { page: 84, type: 'paragraph', text: "1. Tomoni a bo‘lgan teng tomonli uchburchakning uchlariga uchta bir xil q zaryadlar joylashtirilgan. Uchburchakning biror tomoni o‘rtasidagi elektr maydon kuchlanganligini va uning yo‘nalishini aniqlang. E = kq/r², r = √3·a/2. E₁ = E₂ = kq/(a/2)² = 4kq/a². E = √(E₁² + E₂²) = 4kq/a²." },
          { page: 84, type: 'paragraph', text: "2. Birining zaryadi 3q, ikkinchisiniki 16q bo‘lgan zaryadlar joylashgan. K nuqtadagi maydon kuchlanganligini toping. E₁ = k·3q/d² = 3E, E₂ = k·16q/(2d)² = 4E. E_k = √(E₁² + E₂²) = 5E = 5kq/d²." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 27-mavzu. Elektrostatik maydonda nuqtaviy zaryadni ko‘chirishda bajarilgan ish
      {
        id: 'l27',
        number: 27,
        chapter: 3,
        title: "Elektrostatik maydonda nuqtaviy zaryadni ko‘chirishda bajarilgan ish",
        summary: "Elektrostatik maydonda zaryadni ko‘chirishda bajarilgan ish trayektoriya shakliga bog‘liq emas, faqat boshlang‘ich va oxirgi nuqtalarga bog‘liq.",
        formula: "A = q·E·Δd, A = q(φ₁ − φ₂)",
        unit: "J",
        relationship: "Elektrostatik kuch konservativ kuchdir. Yopiq kontur bo‘ylab bajarilgan ish nolga teng.",
        application: "Elektr maydonda zaryadni ko‘chirish, energiya almashinuvi.",
        experiment: "Elektrometr yordamida zaryadni ko‘chirishda bajarilgan ishni kuzating.",
        experimentQuestion: "Nima uchun elektrostatik kuch konservativ hisoblanadi?",
        experimentExplanation: "Elektrostatik maydonda zaryadni ko‘chirishda bajarilgan ish trayektoriya shakliga bog‘liq emas, faqat boshlang‘ich va oxirgi nuqtalarga bog‘liq. Shuning uchun bu kuch konservativdir.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 85, type: 'heading', text: "Konservativ va nokonservativ kuchlar" },
          { page: 85, type: 'paragraph', text: "Agar kuchning bajargan ishi trayektoriya shakliga bog‘liq bo‘lmasa, bu kuch konservativ kuch deyiladi. Og‘irlik kuchi, elastiklik kuchi, gravitatsion kuch, elektrostatik kuch kabilar konservativ kuchlarga misol bo‘ladi." },
          { page: 85, type: 'paragraph', text: "Agar kuchning bajargan ishi trayektoriya shakliga bog‘liq bo‘lsa, bu kuch nokonservativ kuch deyiladi." },
          { page: 86, type: 'heading', text: "Elektrostatik maydonda nuqtaviy zaryadni ko‘chirishda bajarilgan ish" },
          { page: 86, type: 'paragraph', text: "Bir jinsli elektr maydonda nuqtaviy zaryadni ko‘chirishda bajarilgan ish zaryadning harakat trayektoriyasi shakliga bog‘liq bo‘lmay, faqat zaryadning maydon yo‘nalishidagi boshlang‘ich va oxirgi vaziyatlari bilan aniqlanadi." },
          { page: 86, type: 'paragraph', text: "A = q·E·Δd = q(φ₁ − φ₂)." },
          { page: 86, type: 'heading', text: "Masala yechish namunasi" },
          { page: 86, type: 'paragraph', text: "Nuqtaviy zaryad maydon kuchlanganligi 4 kV/m bo‘lgan bir jinsli elektr maydonda 100 µC zaryadli zarra 4 cm ga ko‘chganda elektrostatik maydon 8 mJ ish bajardi. Maydon kuch chiziqlari va ko‘chish vektori orasidagi burchakni toping. cosα = A/(q·E·S) = 8·10⁻³/(10⁻⁴·4·10³·4·10⁻²) = 0.5, α = 60°." }
        ],
        reward: 80,
        simulation: 'chargesFields'
      },

      // 28-mavzu. Elektr maydonda joylashgan nuqtaviy zaryadning potensial energiyasi
      {
        id: 'l28',
        number: 28,
        chapter: 3,
        title: "Elektr maydonda joylashgan nuqtaviy zaryadning potensial energiyasi",
        summary: "Elektr maydonda zaryadning potensial energiyasi W_p = q·φ. Potensial φ = W_p/q. Potensiallar farqi Δφ = A/q.",
        formula: "φ = k·q/r, W_p = q·φ, A = q(φ₁ − φ₂)",
        unit: "V, J",
        relationship: "Nuqtaviy zaryad maydonining potensiali zaryad miqdoriga to‘g‘ri, masofaga teskari proporsional: φ = k·q/r.",
        application: "Elektr maydon energiyasi, kondensatorlar, potensial tenglashtirish.",
        experiment: "Elektrometr yordamida turli nuqtalardagi potensialni o‘lchang.",
        experimentQuestion: "Potensial va kuchlanganlik orasidagi farq nima?",
        experimentExplanation: "Kuchlanganlik maydonning kuch xarakteristikasi, potensial esa energiya xarakteristikasidir. Kuchlanganlik vektor, potensial skalyar kattalikdir.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 87, type: 'heading', text: "Elektr maydonda joylashgan nuqtaviy zaryadning potensial energiyasi" },
          { page: 87, type: 'paragraph', text: "Elektr maydonning bajargan ishi hisobiga zaryadning potensial energiyasi kamayadi. A₁₂ = W_p₁ − W_p₂." },
          { page: 87, type: 'paragraph', text: "Zaryadlarning o‘zaro ta’sir potensial energiyasi: W = k·q₁q₂/r." },
          { page: 88, type: 'heading', text: "Nuqtaviy zaryad maydonining potensiali" },
          { page: 88, type: 'paragraph', text: "Elektr maydonning biror nuqtasidagi potensiali maydonning shu nuqtasiga kiritilgan birlik musbat sinov zaryadining potensial energiyasiga son jihatdan teng bo‘lgan fizik kattalikdir. φ = W_p/q₀." },
          { page: 88, type: 'paragraph', text: "Nuqtaviy q zaryad hosil qilgan maydonning biror nuqtasidagi potensial: φ = k·q/r." },
          { page: 88, type: 'heading', text: "Potensiallar farqi" },
          { page: 88, type: 'paragraph', text: "Birlik musbat zaryadni maydonning bir nuqtasidan ikkinchi nuqtasiga ko‘chirishda bajarilgan ishga miqdor jihatidan teng bo‘lgan fizik kattalik elektr maydonning ikki nuqtasi orasidagi potensiallar farqi deyiladi. Δφ = A/q₀." },
          { page: 89, type: 'heading', text: "Ekvipotensial sirtlar" },
          { page: 89, type: 'paragraph', text: "Potensiallari bir xil bo‘lgan nuqtalarning geometrik o‘rni ekvipotensial sirt deyiladi." },
          { page: 89, type: 'heading', text: "Masala yechish namunasi" },
          { page: 89, type: 'paragraph', text: "Havoda turgan 5 cm radiusli metall sferaga 30 nC zaryad berildi. Zaryadlangan sfera markazidan 2 cm, sfera sirtida va sfera sirtidan 5 cm masofadagi nuqtada maydon potensialini aniqlang. φ_ichida = φ_sirtida = k·q/r = 9·10⁹·30·10⁻⁹/0.05 = 5400 V. φ_tashqarisida = 9·10⁹·30·10⁻⁹/0.10 = 2700 V." }
        ],
        reward: 80,
        simulation: 'chargesFields'
      },

      // 29-mavzu. Elektr maydon energiyasi
      {
        id: 'l29',
        number: 29,
        chapter: 3,
        title: "Elektr maydon energiyasi",
        summary: "Zaryadlangan o‘tkazgichning energiyasi W = q·φ/2 = C·φ²/2 = q²/(2C). Zaryadlangan kondensator energiyasi W = qU/2 = CU²/2.",
        formula: "W = qU/2 = CU²/2 = q²/(2C), ω = ε₀εE²/2",
        unit: "J, J/m³",
        relationship: "Energiya maydon kuchlanganligining kvadratiga va hajmga proporsional: W = (ε₀εE²/2)·V.",
        application: "Kondensatorlar, elektr maydon energiyasi, energiya saqlash.",
        experiment: "Kondensatorni zaryadlab, razryadlashda energiya almashinuvini kuzating.",
        experimentQuestion: "Kondensator energiyasi qanday kattaliklarga bog‘liq?",
        experimentExplanation: "Kondensator energiyasi W = CU²/2 formula bo‘yicha sig‘imga va kuchlanish kvadratiga proporsional. Kuchlanish ortishi bilan energiya keskin ortadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 91, type: 'heading', text: "Elektr maydon energiyasi" },
          { page: 91, type: 'paragraph', text: "Zaryadlangan har qanday o‘tkazgich ma’lum energiyaga ega bo‘ladi. Zaryadsizlanish vaqtida esa o‘tkazgich shu energiyani sarflaydi. W_el = A." },
          { page: 91, type: 'paragraph', text: "Yakkalangan o‘tkazgichning elektr maydon energiyasi: W_el = q·φ/2 = C·φ²/2 = q²/(2C)." },
          { page: 92, type: 'heading', text: "Kondensatorning elektr maydon energiyasi" },
          { page: 92, type: 'paragraph', text: "Zaryadlangan kondensatorning elektr maydon energiyasi: W_el = qU/2 = CU²/2 = q²/(2C)." },
          { page: 92, type: 'paragraph', text: "Zaryadlangan yassi kondensatorning energiyasi W = ε₀εE²/2 · V." },
          { page: 92, type: 'heading', text: "Elektr maydon energiyasining zichligi" },
          { page: 92, type: 'paragraph', text: "Maydonning hajm birligiga to‘g‘ri kelgan energiyasi energiya zichligi deyiladi: ω = W/V = ε₀εE²/2." },
          { page: 93, type: 'heading', text: "Masala yechish namunasi" },
          { page: 93, type: 'paragraph', text: "Yassi havo kondensatorining sig‘imi 0.1 µF ga teng bo‘lib, 200 V potensiallar farqiga ega. Kondensatordagi elektr maydon energiyasini hisoblang. W = CU²/2 = 10⁻⁷·4·10⁴/2 = 2·10⁻³ J = 2 mJ." }
        ],
        reward: 80,
        simulation: 'capacitor'
      },

      // 30-mavzu. Amaliy mashg‘ulot. Energiyaning bir turdan boshqasiga aylanishi
      {
        id: 'l30',
        number: 30,
        chapter: 3,
        title: "Amaliy mashg‘ulot. Energiyaning bir turdan boshqasiga aylanishi",
        summary: "Energiya bir turdan boshqasiga aylanishi mumkin. Mexanik energiya elektr energiyasiga, elektr energiya yorug‘lik energiyasiga aylanishi mumkin.",
        formula: "—",
        unit: "—",
        relationship: "Energiya saqlanish va aylanish qonuni: energiya yo‘qolmaydi, faqat bir turdan boshqasiga aylanadi.",
        application: "Elektr dvigatel, generator, quyosh panellari, shamol generatorlari.",
        experiment: "Disk va elektr dvigatel yordamida mexanik energiyani elektr energiyasiga aylantirish.",
        experimentQuestion: "Energiyaning bir turdan boshqasiga aylanishiga misollar keltiring.",
        experimentExplanation: "Mexanik energiya elektr energiyasiga (generator), elektr energiya mexanik energiyaga (dvigatel), kimyoviy energiya elektr energiyasiga (galvanik element), yorug‘lik energiyasi elektr energiyasiga (fotoelement) aylanishi mumkin.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 94, type: 'heading', text: "Ishning maqsadi" },
          { page: 94, type: 'paragraph', text: "Energiyaning saqlanish va aylanish qonunini o‘rganish." },
          { page: 94, type: 'paragraph', text: "Kerakli jihozlar: 2 ta yog‘och bo‘lagi, 2 ta DVD disk, 2 ta plastik idish qopqog‘i, 2 ta bolt-gayka va shayba, ruchkaning ustki plastmassa qismi, 1 dona elektr dvigatel, yorug‘lik diodi, termoyelim, elektr kavsharlagich, karton." },
          { page: 94, type: 'paragraph', text: "Ishni bajarish tartibi: Diskni aylantirganda dvigatelga mahkamlangan yorug‘lik diodining yonishini kuzating. Mexanik energiya elektr energiyasiga, so‘ngra yorug‘lik energiyasiga aylanadi." }
        ],
        reward: 60,
        simulation: 'battery'
      },

      // 31-mavzu. Masalalar yechish
      {
        id: 'l31',
        number: 31,
        chapter: 3,
        title: "Masalalar yechish",
        summary: "Elektr maydon energiyasi va potensialga oid masalalarni yechish.",
        formula: "W = qU/2 = CU²/2, φ = k·q/r, E = U/d",
        unit: "J, V, V/m",
        relationship: "Elektr maydon energiyasi, potensial va kuchlanganlik orasidagi bog‘lanish.",
        application: "Kondensator, maydon energiyasi hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 95, type: 'heading', text: "Masala yechish namunasi" },
          { page: 95, type: 'paragraph', text: "Massasi 10 g bo‘lgan sharcha potensiali 100 V bo‘lgan A nuqtadan potensiali nolga teng B nuqtaga ko‘chirilyapti. Sharchaning zaryadi 10 nC, A nuqtadagi tezligi 2 cm/s. Sharchaning B nuqtadagi tezligini aniqlang. v_B = √(v_A² − 2q(φ_A−φ_B)/m) = √(4·10⁻⁴ − 2·10⁻⁸·100/0.01) ≈ 1.4 cm/s." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // ============================================================
      // V BOB: O‘ZGARMAS TOK QONUNLARI (6 DARS)
      // ============================================================

      // 32-mavzu. Tok kuchi va tok zichligi
      {
        id: 'l32',
        number: 32,
        chapter: 4,
        title: "Tok kuchi va tok zichligi",
        summary: "O‘tkazgichning ko‘ndalang kesim yuzasidan birlik vaqt ichida oqib o‘tgan zaryad miqdoriga son jihatidan teng bo‘lgan kattalik tok kuchi deyiladi.",
        formula: "I = q/t, j = I/S = n·q₀·v",
        unit: "A, A/m²",
        relationship: "Tok zichligi zaryad tashuvchilar konsentratsiyasi, zaryadi va tartibli harakat tezligining ko‘paytmasiga teng: j = n·q₀·v.",
        application: "Elektr zanjirlari, o‘tkazgichlar, elektr o‘lchash asboblari.",
        experiment: "Ampermetr yordamida tok kuchini o‘lchash.",
        experimentQuestion: "Tok kuchi qanday o‘lchanadi?",
        experimentExplanation: "Tok kuchi ampermetr yordamida o‘lchanadi. Ampermetr zanjirga ketma-ket ulanadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 98, type: 'heading', text: "Tok kuchi va uning birligi" },
          { page: 98, type: 'paragraph', text: "O‘tkazgichning ko‘ndalang kesim yuzasidan birlik vaqt ichida oqib o‘tgan zaryad miqdoriga son jihatidan teng bo‘lgan kattalik tok kuchi deyiladi. I = q/t." },
          { page: 98, type: 'paragraph', text: "Tok kuchining XBSdagi birligi amper (A)." },
          { page: 98, type: 'paragraph', text: "Tokning ta’sirlari: issiqlik ta’siri, kimyoviy ta’siri, magnit ta’siri." },
          { page: 100, type: 'heading', text: "Tok zichligi va uning birligi" },
          { page: 100, type: 'paragraph', text: "O‘tkazgich ko‘ndalang kesimi yuzasi birligidan o‘tayotgan tok kuchiga son jihatidan teng bo‘lgan kattalik elektr tokining zichligi deyiladi. j = I/S = n·q₀·v." },
          { page: 101, type: 'heading', text: "Masala yechish namunalari" },
          { page: 101, type: 'paragraph', text: "1. Diametri 1 mm bo‘lgan o‘tkazgichdan 5 A tok o‘tmoqda. O‘tkazgichdagi tok zichligini hisoblang. S = πD²/4 = 3.14·(10⁻³)²/4 = 0.785·10⁻⁶ m². j = I/S = 5/0.785·10⁻⁶ ≈ 6.37·10⁶ A/m²." },
          { page: 101, type: 'paragraph', text: "2. Ko‘ndalang kesim yuzasi 1 mm² bo‘lgan o‘tkazgichdan 1 A tok o‘tayotgan bo‘lsa, elektronlarning dreyf harakat tezligi qanday? n = 10²⁸ m⁻³. v = I/(e·n·S) = 1/(1.6·10⁻¹⁹·10²⁸·10⁻⁶) = 6.25·10⁻⁴ m/s." }
        ],
        reward: 80,
        simulation: 'circuits'
      },

      // 33-mavzu. To‘liq zanjir uchun Om qonuni
      {
        id: 'l33',
        number: 33,
        chapter: 4,
        title: "To‘liq zanjir uchun Om qonuni",
        summary: "Yopiq zanjirdan o‘tayotgan tok kuchi manbaning elektr yurituvchi kuchiga to‘g‘ri proporsional va zanjirning to‘la qarshiligiga teskari proporsionaldir.",
        formula: "I = ε/(R + r), ε = I·R + I·r",
        unit: "A, V, Ω",
        relationship: "Manbaning EYKi tashqi va ichki qarshiliklardagi kuchlanish tushuvlari yig‘indisiga teng: ε = U_R + U_r.",
        application: "Elektr zanjirlari, batareyalar, qisqa tutashuv.",
        experiment: "Om qonunini tekshirish uchun zanjir yig‘ish.",
        experimentQuestion: "Qisqa tutashuvda tok kuchi qanday bo‘ladi?",
        experimentExplanation: "Qisqa tutashuvda R = 0, shuning uchun I_qt = ε/r. Bu tok manbai bera oladigan eng katta tokdir.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 103, type: 'heading', text: "Tok manbaida chet kuchlarning zaryadni ko‘chirishda bajargan ishi" },
          { page: 103, type: 'paragraph', text: "Tok manbalari zaryadlarni ajratish ishini bajaradi. Chet kuchlar tabiati bilan elektrostatik kuchlardan farqlanadi." },
          { page: 104, type: 'heading', text: "Manbaning elektr yurituvchi kuchi" },
          { page: 104, type: 'paragraph', text: "Chet kuchlarning berk zanjir bo‘ylab birlik musbat zaryadni ko‘chirishda bajargan ishiga teng bo‘lgan fizik kattalik manbaning elektr yurituvchi kuchi (EYK) deb ataladi. ε = A_chet/q." },
          { page: 104, type: 'paragraph', text: "Manbaning EYKi zanjir ochiq bo‘lganda uning qutblaridagi potensiallar farqiga teng." },
          { page: 104, type: 'heading', text: "To‘liq zanjir uchun Om qonuni" },
          { page: 105, type: 'paragraph', text: "Yopiq zanjirdan o‘tayotgan tok kuchi manbaning elektr yurituvchi kuchiga to‘g‘ri proporsional va zanjirning to‘la qarshiligiga teskari proporsionaldir. I = ε/(R + r)." },
          { page: 105, type: 'heading', text: "Tok manbaida qisqa tutashuv" },
          { page: 105, type: 'paragraph', text: "Agar tashqi zanjirni uzib, manba qutblari o‘zaro ulansa (R = 0), qisqa tutashuv hosil bo‘ladi. I_qt = ε/r." },
          { page: 105, type: 'heading', text: "Masala yechish namunasi" },
          { page: 105, type: 'paragraph', text: "Manbaning EYKi va ichki qarshiligini aniqlash uchun avval uning qisqchalariga 2 Ω, so‘ng 4 Ω qarshilikli rezistorlar navbat bilan ulanadi. Birinchi holda tok kuchi 0.5 A, ikkinchi holda esa 0.3 A bo‘lgan bo‘lsa, manbaning ichki qarshiligi va EYKi nimaga teng? r = (I₁R₁ − I₂R₂)/(I₂ − I₁) = (0.5·2 − 0.3·4)/(0.3 − 0.5) = 1 Ω. ε = I₁(R₁ + r) = 0.5·(2+1) = 1.5 V." }
        ],
        reward: 80,
        simulation: 'ohm'
      },

      // 34-mavzu. Masalalar yechish
      {
        id: 'l34',
        number: 34,
        chapter: 4,
        title: "Masalalar yechish",
        summary: "Om qonuni va EYK ga oid masalalarni yechish.",
        formula: "I = ε/(R + r), U = I·R, ε = U + I·r",
        unit: "A, V, Ω",
        relationship: "To‘liq zanjir uchun Om qonuni va manba parametrlari.",
        application: "Elektr zanjirlari hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 107, type: 'heading', text: "Masala yechish namunalari" },
          { page: 107, type: 'paragraph', text: "1. Tok manbai R₁ = 1.8 Ω tashqi qarshilikka ulanganda I₁ = 1.7 A tok beradi. Tashqi qarshilik R₂ = 2.3 Ω bo‘lganda tok kuchi I₂ = 0.56 A bo‘lgan bo‘lsa, manbaning EYKi ε ni va ichki qarshiligi r ni toping. r = (I₁R₁ − I₂R₂)/(I₂ − I₁) = (0.56·2.3 − 0.7·1.8)/(0.7 − 0.56) = 0.2 Ω. ε = I₁(R₁ + r) = 0.7·(1.8 + 0.2) = 1.4 V." },
          { page: 107, type: 'paragraph', text: "2. Diametri 2 mm bo‘lgan o‘tkazgichdan 3.14 A tok o‘tayotgan bo‘lsa, undagi tok zichligini toping. S = πD²/4 = 3.14·(2·10⁻³)²/4 = 3.14·10⁻⁶ m². j = I/S = 3.14/(3.14·10⁻⁶) = 1·10⁶ A/m²." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 35-mavzu. Laboratoriya ishi. Tok manbaining EYKi va ichki qarshiligini aniqlash
      {
        id: 'l35',
        number: 35,
        chapter: 4,
        title: "Laboratoriya ishi. Tok manbaining EYKi va ichki qarshiligini aniqlash",
        summary: "Ampermetr va voltmetr yordamida tok manbaining EYKi va ichki qarshiligini aniqlash.",
        formula: "r = (ε − U)/I, ε = U_v (zanjir ochiq)",
        unit: "V, Ω",
        relationship: "Manbaning ichki qarshiligi EYK va tashqi zanjirdagi kuchlanish orqali topiladi.",
        application: "Laboratoriya ishi.",
        experiment: "Ampermetr va voltmetr yordamida manba parametrlarini o‘lchash.",
        experimentQuestion: "Manbaning ichki qarshiligi nimaga bog‘liq?",
        experimentExplanation: "Ichki qarshilik manbaning tuzilishiga, elektrodlar materialiga va elektrolit konsentratsiyasiga bog‘liq. Galvanik elementda ichki qarshilik elektrolit eritmasi va elektrodlarning qarshiligidan iborat.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 109, type: 'heading', text: "Ishning maqsadi" },
          { page: 109, type: 'paragraph', text: "Ampermetr va voltmetr yordamida tok manbaining elektr yurituvchi kuchini va ichki qarshiligini aniqlash." },
          { page: 109, type: 'paragraph', text: "Kerakli asboblar: laboratoriya universal tok manbai yoki akkumulyator, ampermetr, voltmetr, kalit, ulash simlari, 10 Ω va 20 Ω qarshilikka ega bo‘lgan rezistorlar." },
          { page: 109, type: 'paragraph', text: "Ishni bajarish tartibi: 1. Zanjirni yig‘ing. 2. Kalit ochiq holda voltmetr ko‘rsatishini yozing (U_v = ε). 3. Kalitni ulang va ampermetr ko‘rsatishini yozing. 4. r = (ε − U)/I formula bo‘yicha ichki qarshilikni hisoblang." }
        ],
        reward: 60,
        simulation: 'circuits'
      },

      // 36-mavzu. Metall o‘tkazgichlar qarshiligining temperaturaga bog‘liqligi
      {
        id: 'l36',
        number: 36,
        chapter: 4,
        title: "Metall o‘tkazgichlar qarshiligining temperaturaga bog‘liqligi",
        summary: "Metall o‘tkazgichlar qarshiligi temperatura oshishi bilan ortadi. R = R₀(1 + α·ΔT).",
        formula: "R = R₀(1 + α·ΔT), ρ = ρ₀(1 + α·ΔT)",
        unit: "Ω, Ω·m",
        relationship: "Qarshilikning temperatura koeffitsiyenti α temperatura 1°C ga o‘zgarganda qarshilikning nisbiy o‘zgarishini ko‘rsatadi.",
        application: "Termometrlar, reostatlar, qarshilik termometrlari.",
        experiment: "Metall simni qizdirib, qarshilik o‘zgarishini kuzating.",
        experimentQuestion: "Nima uchun metall qarshiligi temperatura bilan ortadi?",
        experimentExplanation: "Temperatura ortishi bilan kristall panjara ionlarining tebranish amplitudasi ortadi, elektronlar ular bilan ko‘proq to‘qnashadi, natijada qarshilik ortadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 110, type: 'heading', text: "Metall o‘tkazgichlar qarshiligining temperaturaga bog‘liqligi" },
          { page: 110, type: 'paragraph', text: "Metallarda temperaturaning ortishi erkin elektronlar tezligining va to‘qnashishlar sonining ortishiga olib keladi. Kristall panjara tugunlaridagi ionlarning tebranish amplitudasi va uning harakatlanayotgan elektronlar bilan to‘qnashuvlari soni ortadi." },
          { page: 111, type: 'paragraph', text: "Qarshilikning temperatura koeffitsiyenti: α = (ρ − ρ₀)/(ρ₀(T − T₀)). ρ = ρ₀(1 + α·ΔT). R = R₀(1 + α·ΔT)." },
          { page: 111, type: 'paragraph', text: "α ning qiymati metall uchun 0.0039 (mis) dan 0.0065 (nikel) gacha." },
          { page: 112, type: 'heading', text: "O‘ta o‘tkazuvchanlik" },
          { page: 112, type: 'paragraph', text: "Ayrim metallarning solishtirma qarshiligi absolyut nolga yaqin temperaturada nolgacha kamayadi va ular o‘ta o‘tkazuvchan bo‘lib qoladi. Bu hodisani 1911-yilda G. Kamerling Onnes kashf qilgan." },
          { page: 113, type: 'heading', text: "Masala yechish namunasi" },
          { page: 113, type: 'paragraph', text: "Elektr lampochkasidagi volframdan yasalgan spiralning 20°C dagi qarshiligi 30 Ω ga teng. Lampochka 220 V o‘zgarmas tok manbaiga ulanganda undan o‘tuvchi tok kuchi 0.6 A ga teng bo‘ldi. Lampochka yonish vaqtidagi spiral temperaturasini aniqlang. α = 0.005 1/°C. R₀ = R₁/(1+αt₁) = 30/(1+0.005·20) ≈ 27 Ω. R = U/I = 220/0.6 ≈ 367 Ω. ΔT = (R − R₀)/(R₀·α) = (367−27)/(27·0.005) ≈ 2518°C." }
        ],
        reward: 80,
        simulation: 'resistance'
      },

      // 37-mavzu. Masalalar yechish
      {
        id: 'l37',
        number: 37,
        chapter: 4,
        title: "Masalalar yechish",
        summary: "Qarshilikning temperaturaga bog‘liqligi va Om qonuniga oid masalalarni yechish.",
        formula: "R = R₀(1 + α·ΔT), I = U/R",
        unit: "Ω, A",
        relationship: "Qarshilik va temperatura orasidagi chiziqli bog‘lanish.",
        application: "Qarshilik termometrlari, elektr lampalar.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 115, type: 'heading', text: "Masala yechish namunalari" },
          { page: 115, type: 'paragraph', text: "1. Cho‘g‘lanma lampochka volfram tolasining qarshiligi t₁ = 20°C temperaturada R₁ = 40 Ω ga teng, uning t₀ = 0°C temperaturadagi qarshiligi R₀ ni toping. R₀ = R₁/(1+αt₁) = 40/(1+0.0046·20) ≈ 36.63 Ω." },
          { page: 115, type: 'paragraph', text: "2. Elektr lampochkadagi volfram tolasining qarshiligi 20°C temperaturada 35.8 Ω ga teng. Lampochka 120 V kuchlanishli tarmoqqa ulanganda toladan 0.33 A tok oqib o‘tsa, tolaning temperaturasini aniqlang. t₂ = (U(1+αt₁) − I·R₁)/(α·I·R₁) = (120·(1+0.0046·20) − 0.33·35.8)/(0.0046·0.33·35.8) ≈ 1935°C." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // ============================================================
      // VI BOB: TURLI MUHITLARDA ELEKTR TOKI (9 DARS)
      // ============================================================

      // 38-mavzu. Suyuqliklarda elektr toki
      {
        id: 'l38',
        number: 38,
        chapter: 5,
        title: "Suyuqliklarda elektr toki",
        summary: "Eritmalarda moddaning musbat va manfiy ionlarga ajralish jarayoni elektrolitik dissotsiatsiya deyiladi. Ionlarga dissotsiatsiyalanib elektr tokini o‘tkazadigan eritmalar elektrolitlar deyiladi.",
        formula: "—",
        unit: "—",
        relationship: "Elektrolitlarda tok tashuvchilar ionlardir. Musbat ionlar katodga, manfiy ionlar anodga harakatlanadi.",
        application: "Galvanik elementlar, akkumulyatorlar, elektroliz.",
        experiment: "Tuz eritmasining elektr o‘tkazuvchanligini tekshirish.",
        experimentQuestion: "Distillangan suv nega elektr tokini o‘tkazmaydi?",
        experimentExplanation: "Distillangan suvda erkin zaryad tashuvchilar (ionlar) deyarli yo‘q. Tuz eritmasida esa ionlar mavjud bo‘lib, ular elektr tokini o‘tkazadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 122, type: 'heading', text: "Ionli bog‘lanish" },
          { page: 122, type: 'paragraph', text: "Ionlar orasida Kulon kuchi tufayli vujudga keladigan kimyoviy bog‘lanish ionli bog‘lanish deb ataladi." },
          { page: 123, type: 'heading', text: "Elektrolitlar" },
          { page: 123, type: 'paragraph', text: "Eritmalarda moddaning musbat va manfiy ionlarga ajralish jarayoni elektrolitik dissotsiatsiya deyiladi." },
          { page: 123, type: 'paragraph', text: "Elektr manbaining musbat qutbiga ulangan elektrod anod deb, manfiy qutbiga ulangan elektrod katod deb ataladi." },
          { page: 123, type: 'paragraph', text: "Ionlarga dissotsiatsiyalanishi natijasida o‘zidan elektr tokini o‘tkazadigan ishqor, kislota, tuz va boshqa birikmalarning eritmalariga elektrolitlar deb ataladi." }
        ],
        reward: 80,
        simulation: 'circuits'
      },

      // 39-mavzu. Faradeyning birinchi va ikkinchi qonuni
      {
        id: 'l39',
        number: 39,
        chapter: 5,
        title: "Faradeyning birinchi va ikkinchi qonuni",
        summary: "Elektroliz vaqtida elektrodda ajralib chiqqan modda massasi elektrolitdan o‘tgan zaryad miqdoriga to‘g‘ri proporsional: m = k·q. Moddaning elektrokimyoviy ekvivalenti uning kimyoviy ekvivalentiga proporsional: k = M/(F·Z).",
        formula: "m = k·I·t, k = M/(F·Z), F = 96500 C/mol",
        unit: "kg, kg/C",
        relationship: "Elektrolizda ajralgan modda massasi tok kuchiga, vaqtga va moddaning kimyoviy ekvivalentiga bog‘liq.",
        application: "Metallarni ajratib olish, galvanostegiya, galvanoplastika.",
        experiment: "Mis sulfat eritmasidan mis ajratib olish.",
        experimentQuestion: "Faradey doimiysi qanday fizik ma’noga ega?",
        experimentExplanation: "Faradey doimiysi F = 96500 C/mol — bir valentli moddaning 1 molini ajratish uchun zarur zaryad miqdori.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 125, type: 'heading', text: "Elektroliz hodisasi" },
          { page: 125, type: 'paragraph', text: "Elektrolitdan elektr toki o‘tganda elektrodlarda modda ajralib chiqish hodisasiga elektroliz deb ataladi." },
          { page: 126, type: 'heading', text: "Faradeyning birinchi qonuni" },
          { page: 126, type: 'paragraph', text: "Elektroliz vaqtida elektrodda ajralib chiqqan modda massasi elektrolitdan o‘tgan zaryad miqdoriga to‘g‘ri proporsional: m = k·q. k — moddaning elektrokimyoviy ekvivalenti." },
          { page: 127, type: 'heading', text: "Faradeyning ikkinchi qonuni" },
          { page: 127, type: 'paragraph', text: "Moddaning elektrokimyoviy ekvivalenti uning kimyoviy ekvivalentiga to‘g‘ri proporsional: k = M/(F·Z). F ≈ 96500 C/mol." },
          { page: 128, type: 'heading', text: "Masala yechish namunasi" },
          { page: 128, type: 'paragraph', text: "Sulfat kislota eritmasidan 0.1 A tok o‘tkazib, 1 g vodorod olish uchun qancha vaqt kerak? Vodorodning molyar massasi 1 g/mol, valentligi 1. t = F·Z·m/(M·I) = 96500·1·10⁻³/(10⁻³·0.1) = 9.65·10⁵ s ≈ 268 soat." }
        ],
        reward: 80,
        simulation: 'circuits'
      },

      // 40-mavzu. Masalalar yechish
      {
        id: 'l40',
        number: 40,
        chapter: 5,
        title: "Masalalar yechish",
        summary: "Elektroliz va elektrokimyoga oid masalalarni yechish.",
        formula: "m = k·I·t, k = M/(F·Z)",
        unit: "kg, A·s, C/mol",
        relationship: "Faradey qonunlarini qo‘llash.",
        application: "Elektroliz hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 129, type: 'heading', text: "Masala yechish namunalari" },
          { page: 129, type: 'paragraph', text: "1. Sirt yuzi 25 cm² bo‘lgan temir qoshiqni qalinligi 0.08 mm bo‘lgan kumush bilan qoplash uchun kumush tuzi eritmasi orqali qancha zaryad o‘tishi kerak? Kumush zichligi 10.5·10³ kg/m³, k = 1.118·10⁻⁶ kg/C. q = ρ·S·d/k = 10.5·10³·2.5·10⁻³·8·10⁻⁵/(1.118·10⁻⁶) ≈ 1878 C." },
          { page: 129, type: 'paragraph', text: "2. 42 V kuchlanishga mo‘ljallangan, foydali quvvati 10 kW bo‘lgan elektroliz qurilmasida 2 soatda qancha mis moddasi yig‘iladi? k = 0.329·10⁻⁶ kg/C. m = k·P·t/U = 0.329·10⁻⁶·10⁴·7200/42 ≈ 0.564 kg." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 41-mavzu. Elektrolizdan turmushda va texnikada foydalanish
      {
        id: 'l41',
        number: 41,
        chapter: 5,
        title: "Elektrolizdan turmushda va texnikada foydalanish",
        summary: "Elektrolizdan mis ajratib olish, galvanostegiya (buyumlar sirtini metall bilan qoplash) va galvanoplastika (nusxa olish)da foydalaniladi.",
        formula: "—",
        unit: "—",
        relationship: "Elektroliz jarayonida metallar tozalanadi, sirtlar qoplanadi va nusxalar olinadi.",
        application: "Mis tozalash, nikellash, kumush yugurtirish, oltin yugurtirish, matritsalar tayyorlash.",
        experiment: "Buyumlarni elektrolitik usulda qoplash.",
        experimentQuestion: "Galvanostegiya va galvanoplastika o‘rtasidagi farq nima?",
        experimentExplanation: "Galvanostegiya — buyumlar sirtini qiyin oksidlanadigan metallar bilan qoplash. Galvanoplastika — murakkab shakldagi sirtlarning va buyumlarning aniq nusxalarini olish.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 130, type: 'heading', text: "Mis ajratib olish" },
          { page: 130, type: 'paragraph', text: "Elektrolitik vannada mis kuporosi eritmasi orqali tok o‘tkazib, sof mis olinadi. Tozalanmagan mis anod sifatida, sof mis plastinkalari katod sifatida ishlatiladi." },
          { page: 130, type: 'heading', text: "Galvanostegiya" },
          { page: 131, type: 'paragraph', text: "Elektrolizdan foydalanib buyumlarning sirtini qiyin oksidlanadigan metallar bilan qoplash galvanostegiya deb ataladi." },
          { page: 131, type: 'heading', text: "Galvanoplastika" },
          { page: 131, type: 'paragraph', text: "Shakl hosil qilish uchun buyumlar sirtiga elektrolitik usulda metall yugurtirish galvanoplastika deb ataladi." }
        ],
        reward: 80,
        simulation: 'circuits'
      },

      // 42-mavzu. Gazlarda elektr toki
      {
        id: 'l42',
        number: 42,
        chapter: 5,
        title: "Gazlarda elektr toki",
        summary: "Gaz orqali elektr tokining o‘tish jarayoni gaz razryadi deb ataladi. Gaz razryadi mustaqil va nomustaqil bo‘ladi. Mustaqil razryad: miltillama, uchqun, toj va yoy razryadlariga bo‘linadi.",
        formula: "U = E·d (teshilish sharti)",
        unit: "V",
        relationship: "Havoning teshilishi elektr maydon kuchlanganligi 30 kV/cm ga yetganda sodir bo‘ladi.",
        application: "Chaqmoq, neon chiroqlar, payvandlash, projektorlar.",
        experiment: "Elektrodlar orasida uchqun razryadini kuzating.",
        experimentQuestion: "Uchqun razryad va yoy razryad o‘rtasidagi farq nima?",
        experimentExplanation: "Uchqun razryad qisqa muddatli, yuqori kuchlanishda hosil bo‘ladi. Yoy razryad uzoq muddatli, past kuchlanishda (40-50 V) ham hosil bo‘lishi mumkin.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 132, type: 'heading', text: "Gazlarda elektr razryadi" },
          { page: 132, type: 'paragraph', text: "Gaz orqali elektr tokining o‘tish jarayoni gaz razryadi deb ataladi. Oddiy sharoitda gaz dielektrik hisoblanadi." },
          { page: 132, type: 'heading', text: "Gazlarning ionlanishi" },
          { page: 132, type: 'paragraph', text: "Qizdirish, kuchli nurlanish, elektr maydoni ta’sirida gazda musbat va manfiy ionlar hamda erkin elektronlar hosil bo‘ladi." },
          { page: 133, type: 'paragraph', text: "Elektron va musbat zaryadli ionlarning qo‘shilishi natijasida neytral atomlarning hosil bo‘lishi jarayoni gazlarda zaryadlarning rekombinatsiyasi deb ataladi." },
          { page: 133, type: 'heading', text: "Gaz razryadlarining turlari" },
          { page: 133, type: 'paragraph', text: "Nomustaqil razryad — faqat tashqi ionizator ta’sirida mavjud. Mustaqil razryad — tashqi ionizator ta’sirisiz ham mavjud." },
          { page: 134, type: 'paragraph', text: "Mustaqil razryad turlari: miltillama razryad, uchqun razryad, toj razryad, yoy razryad." },
          { page: 136, type: 'heading', text: "Masala yechish namunasi" },
          { page: 136, type: 'paragraph', text: "Yassi kondensator 6 kV kuchlanishli manbaga ulangan. Agar maydon kuchlanganligi 3 MV/m bo‘lganda havoning teshilishi yuz bersa, plastinkalar orasidagi masofa qanday bo‘lgan? d = U/E = 6·10³/(3·10⁶) = 2·10⁻³ m = 2 mm." }
        ],
        reward: 80,
        simulation: 'staticElectricity'
      },

      // 43-mavzu. Yarimo‘tkazgichlar va ularning metallardan farqi
      {
        id: 'l43',
        number: 43,
        chapter: 5,
        title: "Yarimo‘tkazgichlar va ularning metallardan farqi",
        summary: "Yarimo‘tkazgichlarning elektr o‘tkazuvchanligi tashqi ta’sirlarga (qizdirish, yorug‘lik, aralashmalar) sezgir. Metallarda esa bunday sezgirlik past.",
        formula: "—",
        unit: "—",
        relationship: "Yarimo‘tkazgichlarda temperatura ortishi bilan qarshilik kamayadi, metallarda esa ortadi.",
        application: "Diodlar, tranzistorlar, fotorezistorlar, termorezistorlar.",
        experiment: "Yarimo‘tkazgich qarshiligining temperaturaga bog‘liqligini o‘rganish.",
        experimentQuestion: "Nima uchun yarimo‘tkazgich qarshiligi temperatura bilan kamayadi?",
        experimentExplanation: "Temperatura ortishi bilan yarimo‘tkazgichda kovalent bog‘lanishlar uziladi, erkin elektronlar va kovaklar soni ortadi, natijada qarshilik kamayadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 137, type: 'heading', text: "Yarimo‘tkazgichlarning metallardan farqi" },
          { page: 137, type: 'paragraph', text: "Yarimo‘tkazgichlar — elektr o‘tkazuvchanligi o‘tkazgichlarnikidan kichik, lekin dielektriklarnikidan katta bo‘lgan moddalar." },
          { page: 137, type: 'paragraph', text: "Tashqi ta’sirlar, masalan, qizdirish, yorug‘lik ta’sir etishi yoki tarkibiga boshqa kimyoviy element atomlarini kiritish orqali yarimo‘tkazgichlarning elektr o‘tkazuvchanligini keskin o‘zgartirish mumkin." },
          { page: 137, type: 'paragraph', text: "Metallarning elektr o‘tkazuvchanligi esa bunday ta’sirlarga sezgirligi juda past." },
          { page: 138, type: 'heading', text: "Yarimo‘tkazgichli moddalar" },
          { page: 138, type: 'paragraph', text: "Kremniy — yarimo‘tkazgichli elektronika asboblarini ishlab chiqarishda eng ko‘p qo‘llanadigan modda. Yer qobig‘ining ~27.6% ini tashkil etadi." }
        ],
        reward: 80,
        simulation: 'particles'
      },

      // 44-mavzu. Yarimo‘tkazgichlarning elektr o‘tkazuvchanligi
      {
        id: 'l44',
        number: 44,
        chapter: 5,
        title: "Yarimo‘tkazgichlarning elektr o‘tkazuvchanligi",
        summary: "Yarimo‘tkazgichlarda elektron o‘tkazuvchanlik (n-tur) va kovakli o‘tkazuvchanlik (p-tur) mavjud. Donor aralashmalar n-tur, akseptor aralashmalar p-tur o‘tkazuvchanlikni hosil qiladi.",
        formula: "I = I_e + I_k",
        unit: "A",
        relationship: "Sof yarimo‘tkazgichlarda erkin elektronlar soni kovaklar soniga teng. Aralashmali yarimo‘tkazgichlarda asosiy tok tashuvchilar turiga qarab n- yoki p-tur deyiladi.",
        application: "Diodlar, tranzistorlar, mikrosxemalar.",
        experiment: "Yarimo‘tkazgichli fotoelement ishini o‘rganish.",
        experimentQuestion: "Donor va akseptor aralashmalar o‘rtasidagi farq nima?",
        experimentExplanation: "Donor aralashma elektron beradi (n-tur), akseptor aralashma elektron olib, kovak hosil qiladi (p-tur).",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 139, type: 'heading', text: "Elektron o‘tkazuvchanlik" },
          { page: 139, type: 'paragraph', text: "Yarimo‘tkazgichlarda erkin elektronlarning ko‘chishi tufayli tok hosil bo‘lishiga elektron o‘tkazuvchanlik yoki n turdagi o‘tkazuvchanlik deyiladi." },
          { page: 139, type: 'heading', text: "Kovak o‘tkazuvchanlik" },
          { page: 139, type: 'paragraph', text: "Yarimo‘tkazgichlarda kovaklar ishtirokidagi elektr o‘tkazuvchanlik kovakli o‘tkazuvchanlik yoki p tur o‘tkazuvchanlik deb ataladi." },
          { page: 140, type: 'heading', text: "Aralashmali yarimo‘tkazgichlar" },
          { page: 140, type: 'paragraph', text: "Donor aralashma — yarimo‘tkazgich tarkibiga kiritilganda elektronini beradigan aralashma. Akseptor aralashma — kovakli o‘tkazuvchanlikni hosil qiladigan aralashma." }
        ],
        reward: 80,
        simulation: 'particles'
      },

      // 45-mavzu. Yarimo‘tkazgichli asboblar va ularning texnikada qo‘llanishi
      {
        id: 'l45',
        number: 45,
        chapter: 5,
        title: "Yarimo‘tkazgichli asboblar va ularning texnikada qo‘llanishi",
        summary: "Yarimo‘tkazgichli diod tokni bir tomonlama o‘tkazadi. Tranzistor ikkita p-n o‘tishdan tashkil topgan uch elektrodli asbob bo‘lib, signallarni kuchaytiradi.",
        formula: "—",
        unit: "—",
        relationship: "p-n o‘tishda berikituvchi qatlam hosil bo‘ladi. To‘g‘ri ulanganda qarshilik kichik, teskari ulanganda qarshilik katta.",
        application: "Diodlar, tranzistorlar, integral mikrosxemalar, mikrochiplar.",
        experiment: "Yarimo‘tkazgichli diodning tokni bir tomonlama o‘tkazishini kuzatish.",
        experimentQuestion: "Tranzistor qanday ishlaydi?",
        experimentExplanation: "Tranzistor emitter-baza zanjiridagi kichik o‘zgarishlarni kollektor zanjirida katta o‘zgarishlarga aylantiradi, ya’ni signallarni kuchaytiradi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 142, type: 'heading', text: "Yarimo‘tkazgichlarda p-n o‘tish" },
          { page: 142, type: 'paragraph', text: "p-n o‘tish — p va n turdagi yarimo‘tkazgichlar chegarasida hosil bo‘ladigan o‘tish. Berikituvchi qatlam tokni bir tomonlama o‘tkazish xususiyatini beradi." },
          { page: 143, type: 'heading', text: "Yarimo‘tkazgichli diod" },
          { page: 143, type: 'paragraph', text: "Bitta p-n o‘tishga ega bo‘lgan yarimo‘tkazgichli asbobga yarimo‘tkazgichli diod deyiladi." },
          { page: 144, type: 'heading', text: "Tranzistor haqida tushuncha" },
          { page: 144, type: 'paragraph', text: "Tranzistor — ikkita p-n o‘tishdan tashkil topgan uch elektrodli (emitter, baza, kollektor) elektron asbob bo‘lib, u elektr signallarini hosil qilish, kuchaytirish va boshqarish vazifalarini bajaradi." },
          { page: 145, type: 'heading', text: "Integral mikrosxemalar" },
          { page: 145, type: 'paragraph', text: "Mikrosxemalarda tranzistorlar bilan birgalikda diodlar, kondensatorlar, rezistorlar joylashtirilgan. Mikrochiplar asosida kompyuterlar, telefonlar va boshqa qurilmalar yasaladi." }
        ],
        reward: 80,
        simulation: 'particles'
      },

      // 46-mavzu. Laboratoriya ishi. Yarimo‘tkazgichli diodning volt-amper tavsifini o‘rganish
      {
        id: 'l46',
        number: 46,
        chapter: 5,
        title: "Laboratoriya ishi. Yarimo‘tkazgichli diodning volt-amper tavsifini o‘rganish",
        summary: "Yarimo‘tkazgichli dioddan o‘tuvchi tok kuchining unga qo‘yilgan kuchlanishga bog‘liqligini o‘rganish.",
        formula: "—",
        unit: "—",
        relationship: "Diod to‘g‘ri ulanganda tok kuchi keskin ortadi, teskari ulanganda tok deyarli o‘tmaydi.",
        application: "Laboratoriya ishi.",
        experiment: "Diodning volt-amper tavsifini olish.",
        experimentQuestion: "Diodning volt-amper tavsifi nima uchun nochiziqli?",
        experimentExplanation: "Diodda p-n o‘tishning qarshiligi kuchlanishga bog‘liq. To‘g‘ri ulanganda berikituvchi qatlam torayadi, qarshilik kamayadi. Teskari ulanganda berikituvchi qatlam kengayadi, qarshilik ortadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 147, type: 'heading', text: "Ishning maqsadi" },
          { page: 147, type: 'paragraph', text: "Yarimo‘tkazgichli dioddan o‘tuvchi tok kuchining unga qo‘yilgan kuchlanishga bog‘liqligini o‘rganish." },
          { page: 147, type: 'paragraph', text: "Kerakli asboblar: yarimo‘tkazgichli diod; o‘zgarmas tok manbai (36-42 V); kalit; o‘tkazgich simlari; milliampermetr; reostat; voltmetr." },
          { page: 147, type: 'paragraph', text: "Ishni bajarish tartibi: 1. Zanjirni yig‘ing. 2. Reostat yordamida kuchlanishni o‘zgartirib, voltmetr va milliampermetr ko‘rsatishlarini yozing. 3. Tok manbai qutblarini almashtirib, tajribani takrorlang. 4. Grafik chizing." }
        ],
        reward: 60,
        simulation: 'particles'
      },

      // ============================================================
      // VII BOB: MAGNIT MAYDON (13 DARS)
      // ============================================================

      // 47-mavzu. Magnit maydon induksiyasi. Tokli o‘tkazgichlarning magnit maydoni
      {
        id: 'l47',
        number: 47,
        chapter: 6,
        title: "Magnit maydon induksiyasi. Tokli o‘tkazgichlarning magnit maydoni",
        summary: "Magnit maydonining kuch xarakteristikasi magnit induksiya vektoridir. B = F_max/(I·l).",
        formula: "B = μ₀·I/(2π·d) — to‘g‘ri o‘tkazgich; B = μ₀·I/(2R) — aylana o‘tkazgich; B = μ₀·N·I/l — solenoid",
        unit: "T (Tesla)",
        relationship: "Magnit induksiyasi tok kuchiga to‘g‘ri, masofaga teskari proporsional.",
        application: "Elektromagnitlar, solenoidlar, toroidlar.",
        experiment: "Tokli o‘tkazgich atrofidagi magnit maydonni magnit strelkasi yordamida kuzating.",
        experimentQuestion: "Magnit induksiya vektori qanday yo‘nalgan?",
        experimentExplanation: "Magnit induksiya vektorining yo‘nalishi magnit maydonga kiritilgan erkin harakatlana oladigan magnit strelkasining shimoliy qutbi ko‘rsatadigan yo‘nalish bilan aniqlanadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 150, type: 'heading', text: "Magnit maydon induksiyasi" },
          { page: 150, type: 'paragraph', text: "Magnit maydoniga kiritilgan 1 A tok kuchiga ega bo‘lgan 1 m uzunlikdagi to‘g‘ri o‘tkazgichga maydon tomonidan ta’sir qiluvchi maksimal kuchga son jihatdan teng bo‘lgan kattalik magnit induksiyasi deyiladi." },
          { page: 150, type: 'paragraph', text: "Magnit induksiya vektorining yo‘nalishi sifatida magnit maydoniga kiritilgan erkin harakatlana oladigan magnit strelkasining shimoliy qutbi ko‘rsatadigan yo‘nalish qabul qilingan." },
          { page: 151, type: 'heading', text: "Tokli to‘g‘ri o‘tkazgichning magnit maydon induksiyasi" },
          { page: 151, type: 'paragraph', text: "Cheksiz uzun tokli to‘g‘ri o‘tkazgichdan d uzoqlikda joylashgan nuqtada: B = μ₀·I/(2π·d)." },
          { page: 151, type: 'paragraph', text: "Magnit maydon uchun superpozitsiya prinsipi: B = B₁ + B₂ + ... + Bₙ." },
          { page: 152, type: 'heading', text: "Tokli aylana o‘tkazgich markazidagi magnit maydon induksiyasi" },
          { page: 152, type: 'paragraph', text: "B = μ₀·I/(2R)." },
          { page: 152, type: 'heading', text: "Tokli g‘altakning magnit maydon induksiyasi" },
          { page: 152, type: 'paragraph', text: "Solenoid ichidagi magnit maydon: B = μ₀·N·I/l." },
          { page: 152, type: 'heading', text: "Tokli toroidning magnit maydon induksiyasi" },
          { page: 152, type: 'paragraph', text: "B = μ₀·N·I/(2π·R)." },
          { page: 153, type: 'heading', text: "Masala yechish namunasi" },
          { page: 153, type: 'paragraph', text: "O‘ramlar soni 2000 ta, o‘qining radiusi 15 cm bo‘lgan toroiddan o‘tayotgan tokning kuchi 3 A bo‘lsa, toroid o‘qida yotgan nuqtalardagi magnit induksiyasining son qiymatini toping. B = μ₀·N·I/(2π·R) = 4π·10⁻⁷·2000·3/(2π·0.15) = 8·10⁻³ T." }
        ],
        reward: 80,
        simulation: 'electromagnets'
      },

      // 48-mavzu. Magnit maydonning tokli o‘tkazgichga ta’siri
      {
        id: 'l48',
        number: 48,
        chapter: 6,
        title: "Magnit maydonning tokli o‘tkazgichga ta’siri",
        summary: "Magnit maydonda joylashgan tokli o‘tkazgichga Amper kuchi ta’sir qiladi: F = I·l·B·sinα.",
        formula: "F = I·l·B·sinα, M = I·S·B·sinα",
        unit: "N, N·m",
        relationship: "Amper kuchi tok kuchiga, o‘tkazgich uzunligiga, magnit induksiyasiga va burchak sinusiga proporsional.",
        application: "Elektr dvigatellar, galvanometrlar, ampermetrlar.",
        experiment: "Tokli o‘tkazgichning magnit maydonda harakatini kuzating.",
        experimentQuestion: "Amper kuchining yo‘nalishi qanday aniqlanadi?",
        experimentExplanation: "Amper kuchining yo‘nalishi chap qo‘l qoidasi bilan aniqlanadi: kaftga magnit kuch chiziqlari kirsa va barmoqlar tok yo‘nalishini ko‘rsatsa, bosh barmoq kuch yo‘nalishini ko‘rsatadi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 154, type: 'heading', text: "Amper kuchi" },
          { page: 154, type: 'paragraph', text: "Magnit maydon tomonidan shu maydonda joylashgan tokli o‘tkazgich qismiga ta’sir qiluvchi kuch F = I·l·B·sinα. Bu kuch Amper kuchi deyiladi." },
          { page: 155, type: 'heading', text: "Chap qo‘l qoidasi" },
          { page: 155, type: 'paragraph', text: "Magnit maydonga chap qo‘limizni shunday joylashtiramizki, bunda qo‘limizning kaftiga magnit maydon kuch chiziqlari kirsin. Yoyilgan to‘rt barmoq uchining yo‘nalishi o‘tkazgichdagi tok yo‘nalishi bilan mos tushsa, 90° ga ochilgan bosh barmoq Amper kuchining yo‘nalishini ko‘rsatadi." },
          { page: 155, type: 'heading', text: "Bir jinsli magnit maydonda tokli ramkani aylantiruvchi moment" },
          { page: 155, type: 'paragraph', text: "Tokli ramkaga magnit maydon tomonidan juft kuch ta’sir qiladi. M = I·S·B·sinα." },
          { page: 156, type: 'paragraph', text: "Tokli ramkaning magnit momenti: p_m = I·S." },
          { page: 157, type: 'heading', text: "Masala yechish namunasi" },
          { page: 157, type: 'paragraph', text: "Yuzasi 20 cm², o‘ramlar soni 100 ta bo‘lgan simli ramka magnit maydonga joylashtirilgan. Ramkadan 2 A tok o‘tganda unda 0.5 mN·m maksimal aylantiruvchi moment hosil bo‘ladi. Magnit maydonning induksiyasini aniqlang. B = M_max/(N·I·S) = 0.5·10⁻³/(100·2·2·10⁻³) = 1.25·10⁻³ T." }
        ],
        reward: 80,
        simulation: 'electromagnets'
      },

      // 49-mavzu. Tokli o‘tkazgichlarning o‘zaro ta’siri
      {
        id: 'l49',
        number: 49,
        chapter: 6,
        title: "Tokli o‘tkazgichlarning o‘zaro ta’siri",
        summary: "Parallel tokli o‘tkazgichlar bir-biriga tortiladi (toklar bir xil yo‘nalishda) yoki itariladi (toklar qarama-qarshi yo‘nalishda).",
        formula: "F = μ₀·I₁·I₂·l/(2π·d)",
        unit: "N",
        relationship: "O‘zaro ta’sir kuchi toklarning ko‘paytmasiga to‘g‘ri, masofaga teskari proporsional.",
        application: "Elektr uzatish liniyalari, tok o‘lchash asboblari.",
        experiment: "Ikkita parallel o‘tkazgichning o‘zaro ta’sirini kuzating.",
        experimentQuestion: "Nima uchun bir xil yo‘nalishdagi toklar tortiladi?",
        experimentExplanation: "Bir xil yo‘nalishdagi toklar bir-biriga magnit maydon orqali ta’sir qiladi va tortiladi. Qarama-qarshi yo‘nalishdagi toklar esa itariladi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 159, type: 'heading', text: "Tokli to‘g‘ri parallel o‘tkazgichlarning ta’sirlashuvi" },
          { page: 159, type: 'paragraph', text: "Tokli o‘tkazgichlar orasida o‘zaro ta’sir kuchlari mavjud. Bir xil yo‘nalishdagi tokli o‘tkazgichlar tortiladi, qarama-qarshi yo‘nalishdagi toklar itariladi." },
          { page: 159, type: 'heading', text: "Parallel toklarning o‘zaro ta’sir kuchi" },
          { page: 159, type: 'paragraph', text: "Cheksiz uzun parallel tokli o‘tkazgichlarning birlik uzunligiga ta’sir qilayotgan o‘zaro ta’sir kuchi: F = μ₀·I₁·I₂/(2π·d)." },
          { page: 160, type: 'paragraph', text: "1 Amperning ta’rifi: cheksiz uzun parallel o‘tkazgichlar orasidagi masofa 1 m bo‘lganda o‘tkazgichlarning har bir metr uzunligi 2·10⁻⁷ N kuch bilan o‘zaro ta’sirlashsa, bu o‘tkazgichlardan o‘tayotgan tokning kuchi 1 A ga teng." },
          { page: 160, type: 'heading', text: "Masala yechish namunasi" },
          { page: 160, type: 'paragraph', text: "Orasidagi masofa 1.6 m bo‘lgan qo‘sh simli o‘zgarmas elektr toki uzatish liniyasi simlarining har bir metr uzunligiga to‘g‘ri keluvchi o‘zaro ta’sir kuchini toping. I = 40 A. F = μ₀·I₁·I₂/(2π·d)·l = 4π·10⁻⁷·40·40/(2π·1.6)·1 = 2·10⁻⁴ N." }
        ],
        reward: 80,
        simulation: 'electromagnets'
      },

      // 50-mavzu. Tokli o‘tkazgichni magnit maydonda ko‘chirishda bajarilgan ish
      {
        id: 'l50',
        number: 50,
        chapter: 6,
        title: "Tokli o‘tkazgichni magnit maydonda ko‘chirishda bajarilgan ish",
        summary: "Tokli o‘tkazgichni magnit maydonda ko‘chirishda Amper kuchi A = I·ΔΦ ish bajaradi.",
        formula: "A = I·ΔΦ, A = I·B·l·d·sinα",
        unit: "J",
        relationship: "Bajarilgan ish tok kuchi va magnit oqimi o‘zgarishining ko‘paytmasiga teng.",
        application: "Elektr dvigatellar, generatorlar, elektromagnit qurilmalar.",
        experiment: "Tokli o‘tkazgichni magnit maydonda ko‘chirish.",
        experimentQuestion: "Magnit oqimi nima?",
        experimentExplanation: "Magnit oqimi — Φ = B·S·cosα. Sirtni kesib o‘tayotgan magnit kuch chiziqlarining sonini tavsiflaydi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 161, type: 'heading', text: "Magnit maydon oqimi" },
          { page: 161, type: 'paragraph', text: "Magnit oqimi: Φ = B·S·cosα. Birligi — Veber (Wb)." },
          { page: 161, type: 'heading', text: "Tokli to‘g‘ri o‘tkazgichni magnit maydonda ko‘chirishda bajarilgan ish" },
          { page: 161, type: 'paragraph', text: "Tokli o‘tkazgichni magnit maydonda ko‘chirishda Amper kuchining bajargan ishi o‘tkazgichdan o‘tayotgan tok kuchi va magnit oqimi o‘zgarishining ko‘paytmasiga teng: A = I·ΔΦ." },
          { page: 162, type: 'heading', text: "Masala yechish namunasi" },
          { page: 162, type: 'paragraph', text: "Uzunligi 30 cm bo‘lgan o‘tkazgichdan 2 A tok o‘tmoqda. O‘tkazgich induksiyasi 1.5 T bo‘lgan bir jinsli magnit maydonning induksiya chiziqlariga 30° burchak ostida joylashgan. O‘tkazgich Amper kuchi yo‘nalishida 4 cm ga ko‘chganda qanday ish bajariladi? A = I·B·l·d·sinα = 2·1.5·0.3·0.04·0.5 = 0.018 J = 18 mJ." }
        ],
        reward: 80,
        simulation: 'generator'
      },

      // 51-mavzu. Magnit maydonda zaryadli zarraning harakati
      {
        id: 'l51',
        number: 51,
        chapter: 6,
        title: "Magnit maydonda zaryadli zarraning harakati",
        summary: "Magnit maydonda harakatlanayotgan zaryadli zarraga Lorens kuchi ta’sir qiladi: F_L = q·v·B·sinα.",
        formula: "F_L = q·v·B·sinα, R = m·v/(q·B), T = 2π·m/(q·B)",
        unit: "N, m, s",
        relationship: "Lorens kuchi harakat yo‘nalishiga perpendikulyar, shuning uchun ish bajarmaydi. Zarra aylana bo‘ylab harakatlanadi.",
        application: "Mass-spektrometrlar, siklotronlar, qutb yog‘dusi.",
        experiment: "Magnit maydonda elektron nurlarining og‘ishini kuzating.",
        experimentQuestion: "Nima uchun Lorens kuchi ish bajarmaydi?",
        experimentExplanation: "Lorens kuchi harakat tezligiga perpendikulyar yo‘nalgan, shuning uchun ko‘chish yo‘nalishi bo‘yicha tashkil etuvchisi nolga teng. Natijada ish bajarilmaydi, kinetik energiya o‘zgarmaydi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 164, type: 'heading', text: "Lorens kuchi" },
          { page: 164, type: 'paragraph', text: "Magnit maydonda harakatlanayotgan zaryadli zarraga shu maydon tomonidan ta’sir etuvchi kuch Lorens kuchi deyiladi: F_L = q·v·B·sinα." },
          { page: 164, type: 'paragraph', text: "Lorens kuchining yo‘nalishi chap qo‘l qoidasi yordamida aniqlanadi." },
          { page: 165, type: 'heading', text: "Bir jinsli magnit maydonida zaryadli zarraning harakati" },
          { page: 165, type: 'paragraph', text: "Zarra magnit maydon kuch chiziqlariga tik yo‘nalishda uchib kirsa, aylana bo‘ylab harakatlanadi: R = m·v/(q·B), T = 2π·m/(q·B)." },
          { page: 166, type: 'heading', text: "Masala yechish namunasi" },
          { page: 166, type: 'paragraph', text: "Elektron magnit maydon induksiyasi 12 mT bo‘lgan maydon induksiya chiziqlariga tik uchib kirib, 4 cm radiusli aylana bo‘ylab harakatni davom ettirgan bo‘lsa, u qanday tezlik bilan maydonga uchib kirgan? v = e·B·R/m = 1.6·10⁻¹⁹·12·10⁻³·4·10⁻²/(9.1·10⁻³¹) ≈ 8.4·10⁷ m/s." }
        ],
        reward: 80,
        simulation: 'chargesFields'
      },

      // 52-mavzu. O‘zgarmas tok elektr dvigateli
      {
        id: 'l52',
        number: 52,
        chapter: 6,
        title: "O‘zgarmas tok elektr dvigateli",
        summary: "O‘zgarmas tok elektr dvigateli stator va rotordan iborat. Elektr energiyasini mexanik energiyaga aylantiradi.",
        formula: "—",
        unit: "—",
        relationship: "Magnit maydonda tokli ramkaga ta’sir qiluvchi aylantiruvchi moment dvigatelning ishlash asosidir.",
        application: "Elektr dvigatellar, transport, maishiy texnika, sanoat.",
        experiment: "Oddiy elektr dvigatel modelini yasash.",
        experimentQuestion: "Elektr dvigatelda qanday energiya aylanishi sodir bo‘ladi?",
        experimentExplanation: "Elektr dvigatelda elektr energiyasi mexanik energiyaga aylanadi. Tokli ramkaga magnit maydoni ta’sir qilib, uni aylantiradi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 167, type: 'heading', text: "Elektr dvigatelning tuzilishi" },
          { page: 167, type: 'paragraph', text: "O‘zgarmas tok elektr dvigateli ikki asosiy qism — stator va rotordan iborat qurilma bo‘lib, o‘zgarmas tok elektr energiyasini mexanik energiyaga aylantirib beradi." },
          { page: 167, type: 'paragraph', text: "Stator — qo‘zg‘almas qism, doimiy magnit yoki elektromagnitdan iborat. Rotor — aylanuvchi qism, yakor (ramka) va kollektordan iborat." },
          { page: 167, type: 'heading', text: "Elektr dvigatelning ishlash prinsipi" },
          { page: 168, type: 'paragraph', text: "Magnit maydonda tokli ramkaga ta’sir qiluvchi kuchlar uni aylantiradi. Kollektor va cho‘tkalar yordamida tok yo‘nalishi o‘zgarib turadi, natijada ramka uzluksiz aylanadi." }
        ],
        reward: 80,
        simulation: 'generator'
      },

      // 53-mavzu. Masalalar yechish
      {
        id: 'l53',
        number: 53,
        chapter: 6,
        title: "Masalalar yechish",
        summary: "Magnit maydonga oid masalalarni yechish.",
        formula: "F = I·l·B·sinα, F_L = q·v·B·sinα, R = m·v/(q·B)",
        unit: "N, m",
        relationship: "Amper va Lorens kuchlarini qo‘llash.",
        application: "Magnit maydon hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 169, type: 'heading', text: "Masala yechish namunalari" },
          { page: 169, type: 'paragraph', text: "1. Ikki parallel cheksiz uzun to‘g‘ri o‘tkazgich vakuumda bir-biridan 40 cm masofada joylashgan. Agar ularning biridan 12 A, ikkinchisidan 18 A tok o‘tayotgan bo‘lsa, simlarning uzunlik birligiga ta’sir qiluvchi kuchni toping. F/l = μ₀·I₁·I₂/(2π·d) = 4π·10⁻⁷·12·18/(2π·0.4) = 1.08·10⁻⁴ N/m." },
          { page: 169, type: 'paragraph', text: "2. Induksiyasi 0.4 T bo‘lgan magnit maydonda kuch chiziqlari yo‘nalishiga 45° burchak ostida joylashgan 0.5 m uzunlikdagi o‘tkazgichga 0.42 N kuch ta’sir qilsa, o‘tkazgichdan o‘tayotgan tokning kuchini toping. I = F/(B·l·sinα) = 0.42/(0.4·0.5·0.7) ≈ 3 A." },
          { page: 169, type: 'paragraph', text: "3. Induksiyasi 10⁻³ T bo‘lgan bir jinsli magnit maydonda 1.5 cm radiusli aylana bo‘ylab magnit kuch chiziqlariga tik yo‘nalishda harakatlanayotgan elektronning tezligini toping. v = e·B·R/m = 1.6·10⁻¹⁹·10⁻³·1.5·10⁻²/(9.1·10⁻³¹) ≈ 2.64·10⁶ m/s." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 54-mavzu. Elektromagnit induksiya
      {
        id: 'l54',
        number: 54,
        chapter: 6,
        title: "Elektromagnit induksiya",
        summary: "Berk konturda induksion tok faqat o‘tkazgich konturi bilan chegaralangan sirt orqali o‘tayotgan magnit oqimi o‘zgarganda yuzaga keladi.",
        formula: "ε_i = −ΔΦ/Δt, ε_i = −N·ΔΦ/Δt",
        unit: "V",
        relationship: "Induksion EYK magnit oqimining o‘zgarish tezligiga proporsional. Lens qoidasi: induksion tok o‘zining magnit maydoni bilan uni hosil qilgan oqim o‘zgarishiga qarshilik ko‘rsatadi.",
        application: "Generatorlar, transformatorlar, elektr o‘lchash asboblari.",
        experiment: "G‘altakda magnit harakatlantirib, induksion tokni kuzating.",
        experimentQuestion: "Induksion tok qanday shartda hosil bo‘ladi?",
        experimentExplanation: "Induksion tok faqat magnit oqimi o‘zgarganda hosil bo‘ladi. Magnit tinch turganda oqim o‘zgarmaydi va induksion tok hosil bo‘lmaydi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 171, type: 'heading', text: "Elektromagnit induksiya hodisasi" },
          { page: 171, type: 'paragraph', text: "Faradey xulosasi: berk konturda induksion tok faqat o‘tkazgich konturi bilan chegaralangan sirt orqali o‘tayotgan magnit induksiya oqimi o‘zgarganda yuzaga keladi." },
          { page: 172, type: 'heading', text: "Induksion elektr yurituvchi kuch. Faradey qonuni" },
          { page: 172, type: 'paragraph', text: "ε_i = −ΔΦ/Δt. Bu elektromagnit induksiya qonuni yoki Faradey-Maksvell qonuni deyiladi." },
          { page: 172, type: 'paragraph', text: "Lens qoidasi: berk konturda hosil bo‘lgan induksion tok shunday yo‘nalishga ega bo‘ladiki, u o‘zining magnit maydoni bilan shu tokni hosil qilayotgan tashqi magnit oqimining o‘zgarishiga qarshilik ko‘rsatadi." },
          { page: 173, type: 'heading', text: "Masala yechish namunasi" },
          { page: 173, type: 'paragraph', text: "O‘tkazgich halqa orqali o‘tgan magnit oqimi 0.2 s davomida 5 mWb ga o‘zgargan. Halqa 0.25 Ω elektr qarshiligiga ega bo‘lsa, halqada hosil bo‘lgan induksion tokni toping. ε_i = ΔΦ/Δt = 5·10⁻³/0.2 = 0.025 V. I = ε_i/R = 0.025/0.25 = 0.1 A." }
        ],
        reward: 80,
        simulation: 'faraday'
      },

      // 55-mavzu. Amaliy mashg‘ulot. Elektromagnit induksiya hodisasini o‘rganish
      {
        id: 'l55',
        number: 55,
        chapter: 6,
        title: "Amaliy mashg‘ulot. Elektromagnit induksiya hodisasini o‘rganish",
        summary: "Induksion tok va EYK ning magnit oqimiga bog‘liqligini o‘rganish.",
        formula: "ε_i = −N·ΔΦ/Δt",
        unit: "V",
        relationship: "Induksion EYK o‘ramlar soni va magnit oqimi o‘zgarish tezligiga proporsional.",
        application: "Amaliy mashg‘ulot.",
        experiment: "G‘altak va temir o‘zak yordamida induksion EYK ni o‘lchash.",
        experimentQuestion: "Induksion tok qanday kattaliklarga bog‘liq?",
        experimentExplanation: "Induksion tok magnit oqimining o‘zgarish tezligiga, o‘ramlar soniga va g‘altakka berilgan kuchlanishga bog‘liq.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 174, type: 'heading', text: "Ishning maqsadi" },
          { page: 174, type: 'paragraph', text: "Induksiya toki va induksiya elektr yurituvchi kuchi hosil bo‘lishini kuzatish, induksiya tokining magnit oqimiga bog‘liqligini o‘rganish." },
          { page: 174, type: 'paragraph', text: "Kerakli asbob va jihozlar: o‘zgaruvchan tok manbai, o‘zgaruvchan tok ampermetri va voltmetri, ko‘ndalang kesim yuzi turli xil bo‘lgan g‘altaklar, temir o‘zak va ulash simlari." }
        ],
        reward: 60,
        simulation: 'faraday'
      },

      // 56-mavzu. O‘zinduksiya. Induktivlik
      {
        id: 'l56',
        number: 56,
        chapter: 6,
        title: "O‘zinduksiya. Induktivlik",
        summary: "O‘zinduksiya — konturdan o‘tayotgan tok o‘zgarganda konturda EYK hosil bo‘lish hodisasi. Induktivlik — g‘altakning tok o‘zgarishiga qarshilik ko‘rsatish qobiliyati.",
        formula: "ε_i = −L·ΔI/Δt, Φ = L·I",
        unit: "V, H (Henri)",
        relationship: "Induktivlik g‘altakning geometrik o‘lchamlari va o‘zak materialiga bog‘liq: L = μ₀·μ·N²·S/l.",
        application: "Drossellar, transformatorlar, elektromagnitlar.",
        experiment: "O‘zinduksiya hodisasini kuzatish (lampaning kech yonishi).",
        experimentQuestion: "Induktivlik mexanikadagi qaysi kattalikka o‘xshaydi?",
        experimentExplanation: "Induktivlik mexanikadagi massaga o‘xshaydi. Massa qancha katta bo‘lsa, jism shuncha inert bo‘lgani kabi, induktivlik qancha katta bo‘lsa, zanjirdagi tokning o‘zgarishi shuncha sekin bo‘ladi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 176, type: 'heading', text: "O‘zinduksiya hodisasi" },
          { page: 176, type: 'paragraph', text: "Konturdan o‘tayotgan tok o‘zgarsa, u hosil qilgan magnit oqimi ham o‘zgaradi. Natijada konturda induksion EYK hosil bo‘ladi. Bu hodisa o‘zinduksiya hodisasi deb ataladi." },
          { page: 176, type: 'heading', text: "Induktivlik" },
          { page: 176, type: 'paragraph', text: "Φ = L·I. L — g‘altakning induktivligi. Birligi — Genri (H)." },
          { page: 177, type: 'heading', text: "O‘zinduksiya elektr yurituvchi kuch" },
          { page: 177, type: 'paragraph', text: "ε_i = −L·ΔI/Δt. Uzunligi l, ko‘ndalang kesim yuzasi S, o‘ramlar soni N bo‘lgan solenoid induktivligi: L = μ₀·μ·N²·S/l." },
          { page: 177, type: 'heading', text: "Masala yechish namunasi" },
          { page: 177, type: 'paragraph', text: "G‘altakdagi tok 0.2 s davomida noldan 3 A gacha tekis o‘zgarganda 1.5 V o‘zinduksiya EYK hosil bo‘lsa, g‘altakning induktivligi qanchaga teng? L = ε_i·Δt/ΔI = 1.5·0.2/3 = 0.1 H." }
        ],
        reward: 80,
        simulation: 'faraday'
      },

      // 57-mavzu. Masalalar yechish
      {
        id: 'l57',
        number: 57,
        chapter: 6,
        title: "Masalalar yechish",
        summary: "O‘zinduksiya va induktivlikka oid masalalarni yechish.",
        formula: "ε_i = −L·ΔI/Δt, Φ = L·I, L = μ₀·μ·N²·S/l",
        unit: "V, H, Wb",
        relationship: "O‘zinduksiya EYK va induktivlikni hisoblash.",
        application: "Induktivlik hisoblashlari.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 179, type: 'heading', text: "Masala yechish namunalari" },
          { page: 179, type: 'paragraph', text: "1. Solenoiddagi tokning o‘zgarish tezligi ΔI/Δt = 50 A/s ga teng bo‘lganda uning uchlarida 0.075 V o‘zinduksiya EYK hosil bo‘lgan bo‘lsa, solenoidning induktivligini toping. L = ε_i/(ΔI/Δt) = 0.075/50 = 1.5·10⁻³ H." }
        ],
        reward: 60,
        simulation: 'measure'
      },

      // 58-mavzu. Tokning magnit maydon energiyasi. Moddalarning magnit xossalari
      {
        id: 'l58',
        number: 58,
        chapter: 6,
        title: "Tokning magnit maydon energiyasi. Moddalarning magnit xossalari",
        summary: "Tokli o‘tkazgichning magnit maydon energiyasi W = L·I²/2. Moddalar magnit singdiruvchanligiga qarab diamagnetik, paramagnetik va ferromagnetiklarga bo‘linadi.",
        formula: "W = L·I²/2, ω = W/V = B²/(2μ₀·μ)",
        unit: "J, J/m³",
        relationship: "Magnit maydon energiyasi induktivlik va tok kuchi kvadratiga proporsional. Moddaning magnit singdiruvchanligi μ = B/B₀.",
        application: "Elektromagnitlar, transformatorlar, magnit materiallar.",
        experiment: "G‘altak va turli o‘zaklar yordamida magnit maydonni o‘lchash.",
        experimentQuestion: "Ferromagnitlar nima?",
        experimentExplanation: "Ferromagnitlar — magnit singdiruvchanligi birdan juda katta bo‘lgan moddalar (temir, nikel, kobalt). Ular magnit maydonni kuchaytiradi va magnitlanib qoladi.",
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 180, type: 'heading', text: "Tokli o‘tkazgichning magnit maydon energiyasi" },
          { page: 180, type: 'paragraph', text: "Tokli o‘tkazgich atrofida hosil bo‘lgan magnit maydon energiyaga ega bo‘ladi. W_mag = L·I²/2." },
          { page: 180, type: 'paragraph', text: "Magnit maydon energiya zichligi: ω_mag = W_mag/V." },
          { page: 181, type: 'heading', text: "Moddalarning magnit xossalari" },
          { page: 181, type: 'paragraph', text: "Magnit maydon ta’sirida magnitlanib qoladigan moddalarga magnetiklar deyiladi." },
          { page: 182, type: 'heading', text: "Muhitning magnit singdiruvchanligi" },
          { page: 182, type: 'paragraph', text: "B = μ·B₀. μ — muhitning magnit singdiruvchanligi." },
          { page: 182, type: 'paragraph', text: "Diamagnetiklar: μ < 1 (oltin, kumush, mis). Paramagnetiklar: μ > 1 (platina, alyuminiy). Ferromagnetiklar: μ >> 1 (temir, nikel, kobalt)." },
          { page: 183, type: 'heading', text: "Masala yechish namunasi" },
          { page: 183, type: 'paragraph', text: "Magnit maydon induksiyasi 0.5 T bo‘lgan o‘zaksiz g‘altakka magnit singdiruvchanligi 60 ga teng bo‘lgan ferromagnit kiritildi. G‘altak ichida magnit maydon induksiyasi qanchaga o‘zgaradi? B = μ·B₀ = 60·0.5 = 30 T. ΔB = B − B₀ = 30 − 0.5 = 29.5 T." }
        ],
        reward: 80,
        simulation: 'generator'
      },

      // 59-mavzu. Masalalar yechish
      {
        id: 'l59',
        number: 59,
        chapter: 6,
        title: "Masalalar yechish",
        summary: "Magnit maydon energiyasi va magnit xossalarga oid masalalarni yechish.",
        formula: "W = L·I²/2, μ = B/B₀, Φ = B·S",
        unit: "J, Wb",
        relationship: "Magnit maydon energiyasi, oqim va induksiya orasidagi bog‘lanish.",
        application: "Elektromagnitlar, magnit zanjirlar.",
        experiment: null,
        experimentQuestion: null,
        experimentExplanation: null,
        figure: "",
        video: null,
        experimentVideo: null,
        theoryBlocks: [
          { page: 184, type: 'heading', text: "Masala yechish namunalari" },
          { page: 184, type: 'paragraph', text: "1. Induktivligi 0.6 H ga teng bo‘lgan g‘altakdan 5 A tok o‘tayotgan bo‘lsa, g‘altakda hosil bo‘lgan magnit maydonning energiyasini toping. W = L·I²/2 = 0.6·25/2 = 7.5 J." },
          { page: 184, type: 'paragraph', text: "2. Magnit maydonning energiyasi 4 mJ bo‘lishi uchun induktivligi 0.2 H bo‘lgan g‘altak chulg‘amidagi tok kuchi qanday bo‘lishi lozim? I = √(2W/L) = √(2·4·10⁻³/0.2) = 0.2 A." },
          { page: 184, type: 'paragraph', text: "3. Vakuumdagi tokli g‘altak ichida magnit maydon induksiyasi B₀ = 2·10⁻⁴ T ga teng. G‘altakka po‘lat o‘zak kiritilganda induksiyasi B = 1.2 T gacha ortgan bo‘lsa, po‘latning shu sharoitdagi magnit singdiruvchanligini toping. μ = B/B₀ = 1.2/(2·10⁻⁴) = 6000." },
          { page: 184, type: 'paragraph', text: "4. O‘zaksiz g‘altakning ichidagi magnit maydonning induksiyasi B₀ = 2·10⁻⁴ T ga teng. Agar g‘altakning ichiga nikel o‘zak kiritiladigan bo‘lsa, o‘zakda magnit maydonning induksiyasi va o‘zakning ko‘ndalang kesimi S = 10 cm² orqali o‘tuvchi magnit induksiya oqimini toping. B = μ·B₀ = 800·2·10⁻⁴ = 0.16 T. Φ = B·S = 0.16·10⁻³ = 1.6·10⁻⁴ Wb." }
        ],
        reward: 60,
        simulation: 'measure'
      }
    ]
  };

  window.PHYSICS10_COURSE = PHYSICS10_COURSE;
})();
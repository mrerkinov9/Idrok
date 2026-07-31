(() => {
  'use strict';
  const course = window.PHYSICS_COURSE;
  if (!course || !Array.isArray(course.lessons)) return;

  // PDF matnidan qolgan mayda OCR xatolarini mazmunni qisqartirmasdan tozalaydi.
  const cleanText = value => {
    if (typeof value !== 'string') return value;
    return value
      .normalize('NFC')
      .replace(/[\u00a0\u2007\u202f]/g, ' ')
      .replace(/[“”]/g, '"')
      .replace(/\bo[‘’']\s+(?=[\p{L}])/giu, 'o‘')
      .replace(/\bg[‘’']\s+(?=[\p{L}])/giu, 'g‘')
      .replace(/\b([Tt])a\s*[’']\s*sir\b/gu, '$1a’sir')
      .replace(/\b([Mm])a\s*[’']\s*lum\b/gu, '$1a’lum')
      .replace(/\b([Yy])a\s*[’']\s*ni\b/gu, '$1a’ni')
      .replace(/\b([Ee])\s*[’']\s*tib/gu, '$1’tib')
      .replace(/\bo\s*[’']\s*lch/giu, 'o‘lch')
      .replace(/\bso\s*[’']\s*ng/giu, 'so‘ng')
      .replace(/\bqo\s*[’']\s*sh/giu, 'qo‘sh')
      .replace(/\bbo\s*[’']\s*lin/giu, 'bo‘lin')
      .replace(/\bekanligisut\s*ni\b/giu, 'ekanligini')
      .replace(/\bekanglisut\s*ni\b/giu, 'ekanligini')
      .replace(/\bharakatsuv\s+lanishini\b/giu, 'harakatlanishini')
      .replace(/\bqo‘rg‘ooshihJ\s+shin\b/giu, 'qo‘rg‘oshin')
      .replace(/\bsirt\s+lari\b/giu, 'sirtlari')
      .replace(/\btosh\s*bolta\b/giu, 'toshbolta')
      .replace(/\btabiatshu\s+noslikdan\b/giu, 'tabiatshunoslikdan')
      .replace(/\buzluk\s+siz\b/giu, 'uzluksiz')
      .replace(/\bto‘lqin\s+larining\b/giu, 'to‘lqinlarining')
      .replace(/\bqabulqilgich\b/giu, 'qabul qilgich')
      .replace(/\bmaterial\s+lar\b/giu, 'materiallar')
      .replace(/\baku\s+stikaning\b/giu, 'akustikaning')
      .replace(/\bqanday\s+dir\b/giu, 'qandaydir')
      .replace(/\bsa\s+bab\b/giu, 'sabab')
      .replace(/\bqa\s+ralgan\b/giu, 'qaralgan')
      .replace(/\bma\s+teriyaning\b/giu, 'materiyaning')
      .replace(/\bso\s+’ng\b/giu, 'so‘ng')
      .replace(/\bOltm\b/g, 'Oltin')
      .replace(/\bo\s+tin\b/giu, 'oltin')
      .replace(/\bM\s*H20\b/g, 'M(H₂O)')
      .replace(/\bH20\b/g, 'H₂O')
      .replace(/\b02\b/g, 'O₂')
      .replace(/\bIVA\b/g, 'Nₐ')
      .replace(/\bIOOO\s*kg\b/g, '1000 kg')
      .replace(/\bIO(?=\s*[-−]?\s*\d)/g, '10')
      .replace(/•\s*IO(?=\s*[-−]?\s*\d)/g, '·10')
      .replace(/\bIO\b/g, '10')
      .replace(/\b10\s+I\b/g, '10 l')
      .replace(/\b(\d+(?:[.,]\d+)?)\s*oc\b/giu, '$1 °C')
      .replace(/\bo\s*[’']\s*[Il]ch/giu, 'o‘lch')
      .replace(/\bÉk\b/g, 'Ēₖ')
      .replace(/<</g, '«')
      .replace(/>>/g, '»')
      .replace(/\b([Oo])\s*lish\b/gu, (_, first) => `${first.toLowerCase()}lish`)
      .replace(/\b([Oo])\s*lgan\b/gu, (_, first) => `${first.toLowerCase()}lgan`)
      .replace(/\biSh\b/g, 'ish')
      .replace(/\bnis\s+biy\b/giu, 'nisbiy')
      .replace(/\bko‘ri\s+nishga\b/giu, 'ko‘rinishga')
      .replace(/\bo‘\s+zaro\b/giu, 'o‘zaro')
      .replace(/\bto‘\s+g‘ri\b/giu, 'to‘g‘ri')
      .replace(/\b(o‘|bo‘|to‘|qo‘|so‘|bog‘|ko‘)\s+(?=[\p{L}])/giu, '$1')
      .replace(/\bta[’']\s+lim\b/giu, 'ta’lim')
      .replace(/\bto[‘’']Iqin\b/giu, 'to‘lqin')
      .replace(/\bSindi\s+rish\b/g, 'sindirish')
      .replace(/\bma\s+teriallar\b/giu, 'materiallar')
      .replace(/\bakus\s+tika\b/giu, 'akustika')
      .replace(/\bhola\)\s*b\)\s*da\b/giu, 'holda')
      .replace(/\(2-a\s+I\s*-rasm\.\s*rasm\)/giu, '(2-a rasm)')
      .replace(/\ba\)\s*b\)\s*jismlarning\b/giu, 'jismlarning')
      .replace(/\b([Il])\.(?=\s)/g, '1.')
      .replace(/\s+([,.;:!?])/g, '$1')
      .replace(/([([{])\s+/g, '$1')
      .replace(/\s+([)\]}])/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const exactTheoryReplacements = {
    l2: [
      {
        test: /Vodorod molekulasi\s+Kislorod molekulasi\s+Suv molekulasi/i,
        text: 'Vodorod molekulasi ikki vodorod atomidan (H₂), kislorod molekulasi ikki kislorod atomidan (O₂), suv molekulasi esa ikki vodorod va bir kislorod atomidan (H₂O) tashkil topadi.',
      },
      {
        test: /V\s*=\s*[Il1].*mm3.*10\s*[-−]?9/i,
        text: 'Molekulaning chiziqli o‘lchamini yupqa moy qatlamining hajmi va yuzasi orqali baholash mumkin: d = V/S. Bunda 1 mm = 10⁻³ m va 1 mm³ = 10⁻⁹ m³.',
      },
      {
        test: /^[ab]\)\s*[ab]\).*6-rasm.*Moddalar mayda zarralardan/i,
        text: 'Moddalar mayda zarralardan — molekula va atomlardan tashkil topadi. Moddaning kimyoviy xossasini o‘zida saqlab qoladigan eng kichik zarra molekula deyiladi.',
      },
    ],
  };

  const figureOnlyText = /^(?:[ab]\)\s*)*(?:\d+\s*[-–]?\s*rasm[.,]?\s*)+$/iu;
  const unreadableFigureText = [
    /^(?:b\)\s*)?a\)\s*6-rasm\.?$/i,
    /^2\s+2\s+II\s*-\s*rasm\.?$/i,
    /^P2\s+20-rasm\.\s*21\s*-\s*rasm\.?$/i,
    /^b\)\s*a\)\s*A<O\s*28\s*-\s*rasm\.?$/i,
    /^b\)\s*a\)\s*46-rasm\.?$/i,
    /^b\)\s*a\)\s*1\s+2\s+1\s+3\s+1\s+2\s+71\s*-\s*rasm\.?$/i,
    /^a\)\s*b\)\s*74-rasm\.?$/i,
    /^83-rasm\.\s*84-rasm\.?$/i,
    /^86-rasm\.?$/i,
  ];

  const cleanTheoryBlock = (lessonId, block) => {
    let text = cleanText(block.text);
    const replacement = (exactTheoryReplacements[lessonId] || []).find(item => item.test.test(text));
    if (replacement) text = replacement.text;
    if (/\bBerilgan:/iu.test(text)) {
      const statement = text.split(/\bBerilgan:/iu)[0].trim();
      text = statement.length >= 80 ? statement : '';
    }
    const brokenWorkedExample = /^(?:Masala yechish namunasi\s+)?(?:Berilgan|Formulasi):.*(?:Hisoblash|Topish kerak)/iu.test(text)
      || (/Berilgan:\s*Formulasi:\s*Hisoblash:/iu.test(text) && (text.match(/\d/g) || []).length > 5)
      || /(?:Formulasi:|Hisoblash:)/iu.test(text)
      || (/(?:Topish kerak:|Javob:)/iu.test(text) && (text.match(/\d/g) || []).length > 2);
    const compactLength = text.replace(/\s/g, '').length;
    const letterRatio = (text.match(/\p{L}/gu) || []).length / Math.max(1, compactLength);
    const formulaDebris = (text.length > 20 && letterRatio < 0.38)
      || (/^A\).*B\).*C\).*D\)/iu.test(text) && text.length < 220);
    if (figureOnlyText.test(text) || unreadableFigureText.some(pattern => pattern.test(text)) || brokenWorkedExample || formulaDebris) return null;
    return text ? {...block, text} : null;
  };

  const figureFallbacks = {
    l29: {figure: 'assets/physics/book/page-087.jpg', figurePage: 87},
    l59: {figure: 'assets/physics/book/page-166.jpg', figurePage: 166},
  };

  const exactExperimentVideos = new Set([
    'l1', 'l7', 'l10', 'l12', 'l15', 'l16', 'l26', 'l27', 'l28', 'l31',
    'l33', 'l34', 'l41', 'l44', 'l45', 'l47', 'l49', 'l54', 'l57', 'l58',
  ]);

  const videoOverrides = {
    l21: {
      id: '3g5RegoDxFY',
      title: 'Yoqilg‘ining solishtirma yonish issiqligi',
      duration: '',
      source: 'https://raqamlitalim.trm.uz/labs/fizika/7-sinf/3/3517/5547',
      embed: 'https://www.youtube-nocookie.com/embed/3g5RegoDxFY?rel=0',
      provider: 'Raqamli ta’lim — TRM',
      type: 'youtube',
      verified: true,
    },
  };

  const formulaExplanations = {
    l1: 'n — birlik hajmdagi zarralar soni; N — jami zarralar soni, V — hajm. Bir xil hajmda N ortsa, n ham ortadi.',
    l2: 'Bitta molekula massasi m₀ molyar massa M ning Avogadro soni Nₐ ga nisbatiga teng.',
    l3: 'Modda miqdori ν ni zarralar soni N orqali ham, massa m va molyar massa M orqali ham topish mumkin.',
    l4: 'ν mol modda tarkibidagi zarralar soni N = νNₐ, massasi esa m = νM orqali aniqlanadi.',
    l5: 'Gaz bosimi molekulalar massasi, son zichligi va tezlik kvadratining o‘rtacha qiymatiga bog‘liq.',
    l6: 'Mutlaq temperatura T ni topish uchun Selsiy temperaturasi t ga 273,15 qo‘shiladi.',
    l7: 'Gaz molekulalarining o‘rtacha kvadratik tezligi temperatura ortganda oshadi, molyar massa ortganda kamayadi.',
    l8: 'Ikki gaz tezligining nisbati ularning temperaturasi va molyar massasiga bog‘liq.',
    l9: 'Ideal gazda bosim p, hajm V, modda miqdori ν va temperatura T pV = νRT orqali bog‘langan.',
    l10: 'Temperatura o‘zgarmasa, gaz bosimi bilan hajmining ko‘paytmasi o‘zgarmaydi.',
    l11: 'Bosim o‘zgarmasa, gaz hajmining mutlaq temperaturaga nisbati o‘zgarmaydi.',
    l12: 'Hajm o‘zgarmasa, gaz bosimining mutlaq temperaturaga nisbati o‘zgarmaydi.',
    l13: 'Yupqa qatlam qalinligi d uning hajmi V ni yoyilgan yuza S ga bo‘lish orqali baholanadi.',
    l14: 'Bir xil miqdordagi gazning ikki holati uchun pV/T nisbati o‘zgarmaydi.',
    l15: 'Ichki energiya U zarralarning kinetik va o‘zaro ta’sir potensial energiyalari yig‘indisidir.',
    l16: 'O‘zgarmas bosimda gaz bajargan ish bosim p bilan hajm o‘zgarishi ΔV ko‘paytmasiga teng.',
    l17: 'Jism olgan issiqlik Q modda turi c, massa m va temperatura o‘zgarishi ΔT ga bog‘liq.',
    l18: 'Solishtirma issiqlik sig‘imi 1 kg moddani 1 K isitish uchun kerak bo‘ladigan energiyani ifodalaydi.',
    l19: 'Yopiq issiqlik almashinuvida issiq jism bergan energiya sovuq jism olgan energiyaga teng.',
    l20: 'Qattiq jismning solishtirma issiqlik sig‘imi kalorimetrdagi energiya balansi orqali topiladi.',
    l21: 'Yoqilg‘i yonganda ajralgan issiqlik Q uning massasi m va solishtirma yonish issiqligi q ga teng proporsional.',
    l22: 'Berilgan issiqlik Q ichki energiyani o‘zgartirish ΔU va ish A bajarishga sarflanadi.',
    l23: 'Ichki energiya o‘zgarishi berilgan issiqlikdan tizim bajargan ishni ayirish orqali topiladi.',
    l24: 'Izolyatsiyalangan tizimda entropiya kamaymaydi; qaytmas jarayonda u ortadi.',
    l25: 'Aralashtirishda issiq suv bergan issiqlik sovuq suv olgan issiqlikka taxminan teng.',
    l26: 'Dvigatel FIKi η foydali ish A ning isitkichdan olingan issiqlik Q₁ ga nisbatidir.',
    l27: 'Issiqlik dvigatelining foydali ishi olingan Q₁ va sovitkichga berilgan Q₂ issiqliklar farqiga teng.',
    l28: 'FIK olingan issiqlikning necha foizi foydali ishga aylanganini ko‘rsatadi.',
    l29: 'Ajraladigan karbonat angidrid massasi yoqilg‘i massasi va chiqindi koeffitsiyentiga bog‘liq.',
    l30: 'Foydali ish yoqilg‘i energiyasi qm ning η qismiga teng.',
    l31: 'Sirt taranglik kuchi F koeffitsiyent σ va chegara uzunligi l ga teng proporsional.',
    l32: 'Kapillyarda ko‘tarilish h sirt taranglikka ortadi, zichlik va nay radiusiga teskari bog‘liq.',
    l33: 'Suyuqlik bosimi p zichlik ρ, erkin tushish tezlanishi g va chuqurlik h ga bog‘liq.',
    l34: 'Sirt taranglik koeffitsiyenti σ kuch F ning chegara uzunligi l ga nisbatidir.',
    l35: 'Zichlik ρ jism massasi m ning hajmi V ga nisbatidir.',
    l36: 'Mexanik kuchlanish σ kuchning yuzaga nisbatini, nisbiy deformatsiya ε esa uzayishning boshlang‘ich uzunlikka nisbatini bildiradi.',
    l37: 'Guk qonunida elastiklik kuchi uzayishga proporsional; Yung moduli kuchlanishning deformatsiyaga nisbatidir.',
    l38: 'Jismni eritish uchun kerak bo‘ladigan issiqlik Q massa m va solishtirma erish issiqligi λ ga bog‘liq.',
    l39: 'Solishtirma erish issiqligi λ bir kilogramm moddani eritish uchun kerak bo‘ladigan energiyadir.',
    l40: 'Bug‘lantirish uchun issiqlik Q massa m va solishtirma bug‘lanish issiqligi L ga bog‘liq.',
    l41: 'Nisbiy namlik φ suv bug‘i bosimining shu temperaturadagi to‘yingan bug‘ bosimiga foiz nisbatidir.',
    l42: 'Nisbiy namlikni haqiqiy bug‘ zichligining to‘yingan bug‘ zichligiga foiz nisbati orqali topish mumkin.',
    l43: 'Umumiy issiqlik eritish, temperaturani o‘zgartirish va bug‘lantirish energiyalari yig‘indisidan topiladi.',
    l44: 'Yorug‘lik tezligi bosib o‘tilgan masofa s ning vaqt t ga nisbatidir; vakuumda u taxminan 3·10⁸ m/s.',
    l45: 'Qaytishda tushish va qaytish burchaklari teng; sinishda Snell qonuni bajariladi.',
    l46: 'Muhitning sindirish ko‘rsatkichi tushish burchagi sinusi bilan sinish burchagi sinusi nisbatiga teng.',
    l47: 'Kritik burchak zichroq va siyrakroq muhitlarning sindirish ko‘rsatkichlari nisbatiga bog‘liq.',
    l48: 'Kritik burchak n₂/n₁ nisbatining arksinusi orqali hisoblanadi.',
    l49: 'Shishaning sindirish ko‘rsatkichi o‘lchangan tushish va sinish burchaklari sinuslari nisbatidan topiladi.',
    l50: 'Linzaning optik kuchi D fokus masofasi F ga teskari; F metrda olinsa, D dioptriyada chiqadi.',
    l51: 'Yupqa linza formulasi fokus, jism va tasvir masofalarini o‘zaro bog‘laydi.',
    l52: 'Chiziqli kattalashtirish tasvir va jism o‘lchamlari yoki ularning linzagacha masofalari nisbatidir.',
    l53: 'Optik kuch fokus masofasining teskarisi bo‘lib, linzaning nurni qanchalik kuchli sindirishini ko‘rsatadi.',
    l54: 'Murakkab optik asbobning umumiy kattalashtirishi uning qismlari kattalashtirishlari ko‘paytmasiga teng.',
    l55: 'Ko‘zoynak linzasining optik kuchi fokus masofasining teskarisi orqali aniqlanadi.',
    l56: 'Optik asbob masalalarida linza kuchi fokus orqali, tasvir kattaligi esa H/h nisbati orqali topiladi.',
    l57: 'Quyosh qurilmasi FIKi olingan foydali energiyaning tushgan quyosh energiyasiga foiz nisbatidir.',
    l58: 'Eynshteyn munosabatiga ko‘ra massa m energiyaning E = mc² miqdoriga mos keladi.',
    l59: 'Quvvat P bajarilgan ish A ning shu ishga ketgan vaqt t ga nisbatidir.',
  };

  const promoteExperimentToLessonVideo = lesson => {
    if (!lesson?.experimentVideo?.embed) return;
    lesson.video = {
      ...lesson.experimentVideo,
      title: cleanText(lesson.experimentVideo.title),
      provider: cleanText(lesson.experimentVideo.provider || 'O‘zbekcha fizika videosi'),
      type: lesson.experimentVideo.embed.includes('t.me/') ? 'telegram' : 'iframe',
      verified: true,
    };
    // Bir videoni darsda ikki marta ko‘rsatmaymiz.
    lesson.experimentVideo.verified = false;
  };

  course.lessons.forEach(lesson => {
    const fallback = figureFallbacks[lesson.id];
    if (fallback && !lesson.figure) Object.assign(lesson, fallback);

    ['title', 'pages', 'summary', 'formula', 'unit', 'relationship', 'application',
      'experiment', 'experimentQuestion', 'experimentExplanation'].forEach(key => {
      lesson[key] = cleanText(lesson[key]);
    });
    lesson.formulaExplanation = cleanText(formulaExplanations[lesson.id] || lesson.relationship);
    lesson.paragraphs = Array.isArray(lesson.paragraphs) ? lesson.paragraphs.map(cleanText) : [];
    lesson.theoryBlocks = Array.isArray(lesson.theoryBlocks)
      ? lesson.theoryBlocks.map(block => cleanTheoryBlock(lesson.id, block)).filter(Boolean)
      : [];

    if (lesson.video) {
      lesson.video.title = cleanText(lesson.video.title);
      lesson.video.provider = cleanText(lesson.video.provider);
      lesson.video.verified = true;
    }
    if (lesson.experimentVideo) {
      lesson.experimentVideo.title = cleanText(lesson.experimentVideo.title);
      lesson.experimentVideo.provider = cleanText(lesson.experimentVideo.provider);
      lesson.experimentVideo.verified = exactExperimentVideos.has(lesson.id);
    }

    if (videoOverrides[lesson.id]) lesson.video = {...lesson.video, ...videoOverrides[lesson.id]};
  });

  // Bu mavzularda mavjud qisqa o‘zbekcha video aynan hodisaning o‘zini ko‘rsatadi.
  promoteExperimentToLessonVideo(course.lessons.find(lesson => lesson.id === 'l26'));
  promoteExperimentToLessonVideo(course.lessons.find(lesson => lesson.id === 'l57'));

  // Mavzuga aloqasiz umumiy videoni ko‘rsatishdan ko‘ra, halol ravishda yashiramiz.
  ['l35', 'l59'].forEach(id => {
    const lesson = course.lessons.find(item => item.id === id);
    if (lesson?.video) lesson.video.verified = false;
  });

  course.quality = {
    textCleaned: true,
    verifiedLessonVideos: course.lessons.filter(lesson => lesson.video?.verified).length,
    verifiedExperimentVideos: course.lessons.filter(lesson => lesson.experimentVideo?.verified).length,
  };
})();

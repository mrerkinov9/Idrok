(() => {
  'use strict';
  const course = window.PHYSICS_COURSE;
  if (!course || course.grade !== 10) return;
  const enrichment = [
  {
    "id": "l1",
    "video": {
      "id": "6EYrg4RSAYc",
      "title": "Vektorlarni ikki oʻlchamdagi tashkil etuvchilar orqali tasvirlash",
      "duration": "16:05",
      "source": "https://t.me/kau_fizika/89",
      "embed": "https://www.youtube-nocookie.com/embed/6EYrg4RSAYc?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Kuchlarni qo‘shish: hisoblash",
      "given": "F₁ = 6 N va F₂ = 8 N o‘zaro perpendikulyar.",
      "steps": [
        "F = √(F₁² + F₂²)",
        "F = √(36 + 64)",
        "F = 10 N"
      ],
      "answer": 10,
      "unit": "N",
      "prompt": "F₁ = 5 N va F₂ = 12 N bo‘lsa, natijaviy kuchni toping.",
      "practice": 13
    }
  },
  {
    "id": "l2",
    "video": {
      "id": "Njc5QCRU4ZQ",
      "title": "Markazga intilma kuch va markazga intilma tezlanish",
      "duration": "10:43",
      "source": "https://t.me/kau_fizika/149",
      "embed": "https://www.youtube-nocookie.com/embed/Njc5QCRU4ZQ?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-327",
      "title": "📌 PIZIK endi Xorazmda ham o'z faoliyatini olib bormoqda!! 📅 Aprel va May oylari davomida Pizikning Xorazmdagi ambassadori Charos Bekturdiyeva Ogahiy nomidagi IMI da fizika targ'ibot tadbirlari tashkillashtirdi. ✅ Xorazmlik Pizik o'quvchilarga Nyuton qonunlari, markazga intilma kuch, va Bernulli prinsipli mavzularni qiziqarli va mo'jizali tajribalar orqali tushuntirdi. O‘zbekistondagi eng yirik ilm-fan tashabbusimizni boshqalar bilan ham ulashishni unutmang! @pizik_lab — 🍎 Oddiy olmadan odamlargacha 👉 Telegram | Instagram | YouTube",
      "duration": "1:17",
      "source": "https://t.me/pizik_lab/327",
      "embed": "https://t.me/pizik_lab/327?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 73,
      "verified": true
    },
    "problem": {
      "title": "Markazga intilma kuch: hisoblash",
      "given": "m = 2 kg, v = 4 m/s, R = 2 m.",
      "steps": [
        "F = mv²/R",
        "F = 2·16/2",
        "F = 16 N"
      ],
      "answer": 16,
      "unit": "N",
      "prompt": "m = 3 kg, v = 6 m/s va R = 3 m bo‘lsa, F ni toping.",
      "practice": 36
    }
  },
  {
    "id": "l3",
    "video": {
      "id": "9qKK4LI0OYg",
      "title": "Gravitatsiya – butun olam tortishish qonuni",
      "duration": "17:29",
      "source": "https://t.me/kau_fizika/160",
      "embed": "https://www.youtube-nocookie.com/embed/9qKK4LI0OYg?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-22",
      "title": "#qiziqarli #gravitatsiya Gravitatsiya yorug'lik tezligida harakat qiladi Ya'ni, agar Quyosh to'satdan g'oyib bo'lsa, tortishish maydonining o'zgarishi haqidagi ma'lumot bizga etib kelguniga qadar, Yer bo'sh fazo atrofida 8 daqiqa 20 soniyagacha aylanishda davom etadi. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/22",
      "embed": "https://t.me/Fizikadan_tajribalar/22?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 43,
      "verified": true
    },
    "problem": {
      "title": "Gravitatsiya maydonidagi harakat: hisoblash",
      "given": "g = 10 m/s², R = 6,4 m.",
      "steps": [
        "v₁ = √(gR)",
        "v₁ = √64",
        "v₁ = 8 m/s"
      ],
      "answer": 8,
      "unit": "m/s",
      "prompt": "g = 10 m/s² va R = 10 m bo‘lsa, v₁ ni toping.",
      "practice": 10
    }
  },
  {
    "id": "l4",
    "video": {
      "id": "BkUyufANeo4",
      "title": "Nyutonning ikkinchi qonuni",
      "duration": "7:33",
      "source": "https://t.me/kau_fizika/107",
      "embed": "https://www.youtube-nocookie.com/embed/BkUyufANeo4?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-17",
      "title": "#qiziqarli #dinamika Elastiklik va Arximed kuchi birlashganda. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:05",
      "source": "https://t.me/Fizikadan_tajribalar/17",
      "embed": "https://t.me/Fizikadan_tajribalar/17?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 33,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: dinamika: hisoblash",
      "given": "m = 6 kg jism 2 m/s² tezlanmoqda.",
      "steps": [
        "F = ma",
        "F = 6·2",
        "F = 12 N"
      ],
      "answer": 12,
      "unit": "N",
      "prompt": "m = 8 kg va a = 3 m/s² bo‘lsa, F ni toping.",
      "practice": 24
    }
  },
  {
    "id": "l5",
    "video": {
      "id": "f0rLK1V5KnU",
      "title": "Liftda normal kuch",
      "duration": "11:57",
      "source": "https://t.me/kau_fizika/112",
      "embed": "https://www.youtube-nocookie.com/embed/f0rLK1V5KnU?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-32",
      "title": "#qiziqarli #mexanika Gorizontal tekislik bo'ylab jism harakati, uchta holat: 1️Jism tekis harakat qiladi, 2️Jism tezlashadi 3️Jism sekinlashadi. 👉@Fi https://t.me/Fizikadan_tajribalar",
      "duration": "1:00",
      "source": "https://t.me/Fizikadan_tajribalar/32",
      "embed": "https://t.me/Fizikadan_tajribalar/32?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 43,
      "verified": true
    },
    "problem": {
      "title": "Jism og‘irligining harakat turiga bog‘liqligi: hisoblash",
      "given": "m = 50 kg lift yuqoriga a = 2 m/s² tezlanadi, g = 10 m/s².",
      "steps": [
        "P = m(g + a)",
        "P = 50(10 + 2)",
        "P = 600 N"
      ],
      "answer": 600,
      "unit": "N",
      "prompt": "m = 40 kg va a = 1 m/s² bo‘lsa, og‘irlikni toping.",
      "practice": 440
    }
  },
  {
    "id": "l6",
    "video": {
      "id": "JRfEbz32HLU",
      "title": "Muvozanatlashgan va muvozanatlashmagan kuchlar",
      "duration": "8:45",
      "source": "https://t.me/kau_fizika/115",
      "embed": "https://www.youtube-nocookie.com/embed/JRfEbz32HLU?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-412",
      "title": "#blok harakati Kòchmas blok va bir nechta kóchar bloklar orqali 1 kg li jism kótarildi. Va shkalaga e'tibor bering. https://t.me/Fizikadan_tajribalar",
      "duration": "0:51",
      "source": "https://t.me/Fizikadan_tajribalar/412",
      "embed": "https://t.me/Fizikadan_tajribalar/412?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 43,
      "verified": true
    },
    "problem": {
      "title": "Jismning bir nechta kuch ta’siridagi harakati: hisoblash",
      "given": "Jismga o‘ngga 30 N, chapga 10 N kuch ta’sir qiladi; m = 4 kg.",
      "steps": [
        "F = 30 − 10 = 20 N",
        "a = F/m",
        "a = 20/4 = 5 m/s²"
      ],
      "answer": 5,
      "unit": "m/s²",
      "prompt": "50 N va 20 N qarama-qarshi kuchlar 6 kg jismga ta’sir qilsa, a ni toping.",
      "practice": 5
    }
  },
  {
    "id": "l7",
    "video": {
      "id": "Kagw9kiMLwc",
      "title": "Oʻzaro bogʻlangan jismlar sistemasi (qiyinroq usul)",
      "duration": "9:54",
      "source": "https://t.me/kau_fizika/131",
      "embed": "https://www.youtube-nocookie.com/embed/Kagw9kiMLwc?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Masalalar yechish: kuchlar: hisoblash",
      "given": "m = 12 kg va a = 3 m/s².",
      "steps": [
        "F = ma",
        "F = 12·3",
        "F = 36 N"
      ],
      "answer": 36,
      "unit": "N",
      "prompt": "m = 10 kg va a = 4 m/s² bo‘lsa, F ni toping.",
      "practice": 40
    }
  },
  {
    "id": "l8",
    "video": {
      "id": "n6ohuuj_Nno",
      "title": "Qiya tekislikda kuchning komponentlari",
      "duration": "8:57",
      "source": "https://t.me/kau_fizika/119",
      "embed": "https://www.youtube-nocookie.com/embed/n6ohuuj_Nno?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-101",
      "title": "Balandlikdan gorizontal otilgan jism harakati. 🔍#giff ⚡️⚡️⚡️ Kanalga obuna bo'ling Yaqinlaringizga va guruppalarga ulashing yanada ko'proq malumotlar shu kanalda👇🏻 ✅ https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/101",
      "embed": "https://t.me/Fizikadan_tajribalar/101?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Jismning qiya tekislikdagi harakati: hisoblash",
      "given": "Ishqalanishsiz qiya tekislik: g = 10 m/s², sinα = 0,5.",
      "steps": [
        "a = g sinα",
        "a = 10·0,5",
        "a = 5 m/s²"
      ],
      "answer": 5,
      "unit": "m/s²",
      "prompt": "sinα = 0,8 bo‘lsa, tezlanishni toping.",
      "practice": 8
    }
  },
  {
    "id": "l9",
    "video": {
      "id": "xEjxdFQqZGc",
      "title": "Koʻchar blok va qiya tekislik yordamida kuchdan yutish",
      "duration": "12:08",
      "source": "https://t.me/kau_fizika/197",
      "embed": "https://www.youtube-nocookie.com/embed/xEjxdFQqZGc?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Qiya tekislikda bajarilgan ish va FIK: hisoblash",
      "given": "Foydali ish 400 J, sarflangan ish 500 J.",
      "steps": [
        "η = Aᶠ/Aˢ·100%",
        "η = 400/500·100%",
        "η = 80%"
      ],
      "answer": 80,
      "unit": "%",
      "prompt": "Aᶠ = 450 J va Aˢ = 600 J bo‘lsa, FIKni toping.",
      "practice": 75
    }
  },
  {
    "id": "l10",
    "video": {
      "id": "oDNNudX-pVc",
      "title": "Qiya tekislik boʻylab tezlayotgan muz",
      "duration": "8:26",
      "source": "https://t.me/kau_fizika/120",
      "embed": "https://www.youtube-nocookie.com/embed/oDNNudX-pVc?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-142",
      "title": "#qiziqarli #mexanika Gorizontal tekislik bo'ylab jism harakati, uchta holat: 1️Jism tekis harakat qiladi, 2️Jism tezlashadi 3️Jism sekinlashadi. 👉@Fi https://t.me/Fizikadan_tajribalar",
      "duration": "1:00",
      "source": "https://t.me/Fizikadan_tajribalar/142",
      "embed": "https://t.me/Fizikadan_tajribalar/142?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: qiya tekislik: hisoblash",
      "given": "F = 25 N kuch jismni 4 m siljitdi.",
      "steps": [
        "A = Fs",
        "A = 25·4",
        "A = 100 J"
      ],
      "answer": 100,
      "unit": "J",
      "prompt": "F = 30 N va s = 6 m bo‘lsa, ishni toping.",
      "practice": 180
    }
  },
  {
    "id": "l11",
    "video": {
      "id": "0LbdP0msVX4",
      "title": "Mexanikada kuchdan yutish",
      "duration": "9:23",
      "source": "https://t.me/kau_fizika/195",
      "embed": "https://www.youtube-nocookie.com/embed/0LbdP0msVX4?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-5",
      "title": "Xommi yoki Qaynatilgan🥚? Keling, aniqlaymiz! Agar tuxumni aylantirib, to‘xtatsangiz-u, u yana o‘zi aylana boshlasa, bilingki u xom. Buning sababi — ichidagi suyuqlik inersiyasi. Siz tuxum po'stloq qobig'ini to‘xtatasiz, lekin ichidagi sarigi hali ham aylanishda davom etadi va u qobiqni yana harakatga keltiradi. Bu Nyutonning birinchi qonuni — inersiya bilan tushuntiriladi: jism harakatda bo‘lsa va unga hech qanday tashqi kuch ta'sir qilmasa, o'zining harakatida davom etadi. Ammo qaynatilgan tuxumda ichkarida hech qanday suyuqlik yo‘q, hamma narsa qotgan bo‘lgani uchun siz tuxumni to‘xtatsangiz, u darhol to‘xtaydi va harakatlanmaydi. Shu oddiy usul bilan tuxum xommi yoki qaynatilganini aniqlash mumkin. ✅ @pizik_lab—oson fizika 🔍",
      "duration": "1:07",
      "source": "https://t.me/pizik_lab/5",
      "embed": "https://t.me/pizik_lab/5?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 30,
      "verified": true
    },
    "problem": {
      "title": "Laboratoriya: qiya tekislikning FIKini aniqlash: hisoblash",
      "given": "m = 2 kg yuk 3 m ko‘tarildi; F = 40 N, s = 2 m, g = 10.",
      "steps": [
        "η = mgh/(Fs)·100%",
        "η = 60/80·100%",
        "η = 75%"
      ],
      "answer": 75,
      "unit": "%",
      "prompt": "m = 3 kg, h = 4 m, F = 50 N, s = 3 m bo‘lsa, FIKni toping.",
      "practice": 80
    }
  },
  {
    "id": "l12",
    "video": {
      "id": "-Q6HuiA-f50",
      "title": "Jismning massa markazi (ogʻirlik markazi)",
      "duration": "15:03",
      "source": "https://t.me/kau_fizika/209",
      "embed": "https://www.youtube-nocookie.com/embed/-Q6HuiA-f50?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-7",
      "title": "Agar sharni mixlarga bossam, yoriladimi?🎈 Javob: Yorilmaydi. Qanday qilib?😳 Xullas, bu hammasi bosim va yuzaga bog'liq! Agar sharni bitta mixga bossam, butun kuch aynan o'sha bitta nuqtaga tushadi - bosim katta bo'ladi va shar yoriladi 💥. Lekin agar ko'p mixlarga bossam, kuch barcha mixlarga teng taqsimlanadi. Har bir mixga tushadigan bosim juda kichik bo'ladi, shuning uchun shar yorilmaydi 🎈✅. Tajriba Sardor Karim tomonidan taqdim etildi. 👍 Qiziqarli ilmiy kontentlar uchun OBUNA bo'ling! @pizik_lab - oson fizika 🔍",
      "duration": "0:47",
      "source": "https://t.me/pizik_lab/7",
      "embed": "https://t.me/pizik_lab/7?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Massa markazi, muvozanat turlari va kuch momenti: hisoblash",
      "given": "F = 20 N, kuch yelkasi d = 0,3 m.",
      "steps": [
        "M = Fd",
        "M = 20·0,3",
        "M = 6 N·m"
      ],
      "answer": 6,
      "unit": "N·m",
      "prompt": "F = 15 N va d = 0,4 m bo‘lsa, momentni toping.",
      "practice": 6
    }
  },
  {
    "id": "l13",
    "video": {
      "id": "3ymyYSzhNeA",
      "title": "Mexanikada kuchdan yutish. Kuch momenti",
      "duration": "8:56",
      "source": "https://t.me/kau_fizika/196",
      "embed": "https://www.youtube-nocookie.com/embed/3ymyYSzhNeA?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-451",
      "title": "#qiziqarli Orqaga qaytish kuchining oddiy va vizual namoyishi. 📣 https://t.me/Fizikadan_tajribalar",
      "duration": "0:12",
      "source": "https://t.me/Fizikadan_tajribalar/451",
      "embed": "https://t.me/Fizikadan_tajribalar/451?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Momentlar qoidasiga asoslangan oddiy mexanizmlar: hisoblash",
      "given": "F₁ = 20 N, l₁ = 0,6 m, l₂ = 0,3 m.",
      "steps": [
        "F₁l₁ = F₂l₂",
        "F₂ = F₁l₁/l₂",
        "F₂ = 40 N"
      ],
      "answer": 40,
      "unit": "N",
      "prompt": "F₁ = 30 N, l₁ = 0,4 m, l₂ = 0,6 m bo‘lsa, F₂ ni toping.",
      "practice": 20
    }
  },
  {
    "id": "l14",
    "video": {
      "id": "3E4jF1YvdFw",
      "title": "Bir nechta kuchning umumiy kuch momenti",
      "duration": "15:10",
      "source": "https://t.me/kau_fizika/218",
      "embed": "https://www.youtube-nocookie.com/embed/3E4jF1YvdFw?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-272",
      "title": "#qiziqarli #statika Giroskop yordamida nishonga olishda tank trubasining muvozanati 👌 Bu texnologiya Gollivud videokameralarida ham filmlar suratga olishda qo‘llaniladi va operator ishlaganda tasvir endi yuqoriga va pastga tushmaydi. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:15",
      "source": "https://t.me/Fizikadan_tajribalar/272",
      "embed": "https://t.me/Fizikadan_tajribalar/272?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: statika: hisoblash",
      "given": "Soat yo‘nalishidagi moment 8 N·m, teskarisi 12 N·m.",
      "steps": [
        "M = 12 − 8",
        "M = 4 N·m",
        "Natija teskari yo‘nalishda"
      ],
      "answer": 4,
      "unit": "N·m",
      "prompt": "Qarama-qarshi momentlar 15 va 9 N·m bo‘lsa, natijani toping.",
      "practice": 6
    }
  },
  {
    "id": "l15",
    "video": {
      "id": "lXkYDHqK8oA",
      "title": "Amplituda va davr",
      "duration": "9:39",
      "source": "https://t.me/kau_fizika/231",
      "embed": "https://www.youtube-nocookie.com/embed/lXkYDHqK8oA?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-442",
      "title": "Ajoyib dvigatel!💁🏻‍♂️ Suyuqlikdan chiqayotgan bug’ hisobiga harakatga kelivchi dvigatel. Issiqlik energiyasini mexanik energiyaga aylantirishning bir yo’li!!! 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:23",
      "source": "https://t.me/Fizikadan_tajribalar/442",
      "embed": "https://t.me/Fizikadan_tajribalar/442?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Mexanik tebranishlar: hisoblash",
      "given": "A = 0,1 m va faza 0.",
      "steps": [
        "x = A cosφ",
        "x = 0,1·cos0",
        "x = 0,1 m"
      ],
      "answer": 0.1,
      "unit": "m",
      "prompt": "A = 0,2 m va φ = 60° bo‘lsa, x ni toping.",
      "practice": 0.1
    }
  },
  {
    "id": "l16",
    "video": {
      "id": "hDUogZ2UBUc",
      "title": "Prujinali mayatnikning tebranish davri",
      "duration": "10:29",
      "source": "https://t.me/kau_fizika/233",
      "embed": "https://www.youtube-nocookie.com/embed/hDUogZ2UBUc?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-89",
      "title": "Neptun matematik hisob-kitoblar orqali kashf etilgan birinchi sayyora. P.S. Hozirgi kunda olimlar Quyosh tizimidagi 9-sayyorani borligini taxmin qilib, qidirishmoqda. https://t.me/Fizikadan_tajribalar",
      "duration": "0:13",
      "source": "https://t.me/Fizikadan_tajribalar/89",
      "embed": "https://t.me/Fizikadan_tajribalar/89?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Prujinali va matematik mayatniklar: hisoblash",
      "given": "m = 1 kg, k = 100 N/m.",
      "steps": [
        "T = 2π√(m/k)",
        "T = 2π√0,01",
        "T ≈ 0,628 s"
      ],
      "answer": 0.628,
      "unit": "s",
      "prompt": "m = 0,25 kg va k = 100 N/m bo‘lsa, T ni toping.",
      "practice": 0.314
    }
  },
  {
    "id": "l17",
    "video": {
      "id": "d39_0OA4uFE",
      "title": "Matematik mayatnik",
      "duration": "14:39",
      "source": "https://t.me/kau_fizika/235",
      "embed": "https://www.youtube-nocookie.com/embed/d39_0OA4uFE?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-9",
      "title": "#qiziqarli #mayatnik Bu dunyodagi eng baland belanchak. Ular Xitoyning Chongging shahrida joylashgan. Ushbu attraksionning balandligi 100 metrga etadi (taxminan 30 qavatli binoning balandligi). Va u 700 metrlik qoyaning chetida. Bu belanchakda siz soatiga 120 km tezlikka erisha olasiz. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:17",
      "source": "https://t.me/Fizikadan_tajribalar/9",
      "embed": "https://t.me/Fizikadan_tajribalar/9?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Laboratoriya: matematik mayatnik yordamida g ni aniqlash: hisoblash",
      "given": "l = 1 m, T = 2 s.",
      "steps": [
        "g = 4π²l/T²",
        "g = 4π²/4",
        "g ≈ 9,87 m/s²"
      ],
      "answer": 9.87,
      "unit": "m/s²",
      "prompt": "l = 0,81 m va T = 1,8 s bo‘lsa, g ni toping.",
      "practice": 9.87
    }
  },
  {
    "id": "l18",
    "video": {
      "id": "7u3cVS7mn2E",
      "title": "Toʻlqin nima?",
      "duration": "16:55",
      "source": "https://t.me/kau_fizika/239",
      "embed": "https://www.youtube-nocookie.com/embed/7u3cVS7mn2E?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-268",
      "title": "#qiziqarli #tolqin Statik to'lqinlar 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:30",
      "source": "https://t.me/Fizikadan_tajribalar/268",
      "embed": "https://t.me/Fizikadan_tajribalar/268?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Mexanik to‘lqinlar: hisoblash",
      "given": "λ = 2 m va ν = 5 Hz.",
      "steps": [
        "v = λν",
        "v = 2·5",
        "v = 10 m/s"
      ],
      "answer": 10,
      "unit": "m/s",
      "prompt": "λ = 0,5 m va ν = 20 Hz bo‘lsa, v ni toping.",
      "practice": 10
    }
  },
  {
    "id": "l19",
    "video": {
      "id": "y4zWZKVR0kI",
      "title": "Tovush toʻlqinlarining hosil boʻlishi",
      "duration": "4:31",
      "source": "https://t.me/kau_fizika/242",
      "embed": "https://www.youtube-nocookie.com/embed/y4zWZKVR0kI?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-28",
      "title": "#qiziqarli #tolqin Yomg'ir paytida va undan keyin eshitish yaxshilanadi, chunki atmosferada chang, gulchang va tovush to'lqinlarini o'ziga singdiruvchi va susaytiradigan boshqa zarralar kam. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/28",
      "embed": "https://t.me/Fizikadan_tajribalar/28?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 41,
      "verified": true
    },
    "problem": {
      "title": "Tovush to‘lqinlari: hisoblash",
      "given": "P = 2 W quvvat S = 0,5 m² yuzaga tushadi.",
      "steps": [
        "I = P/S",
        "I = 2/0,5",
        "I = 4 W/m²"
      ],
      "answer": 4,
      "unit": "W/m²",
      "prompt": "P = 3 W va S = 0,75 m² bo‘lsa, I ni toping.",
      "practice": 4
    }
  },
  {
    "id": "l20",
    "video": {
      "id": "rHVYQ-hu5AA",
      "title": "Tovushning xossalari: amplituda, davr, chastota, toʻlqin uzunligi",
      "duration": "6:43",
      "source": "https://t.me/kau_fizika/243",
      "embed": "https://www.youtube-nocookie.com/embed/rHVYQ-hu5AA?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-328",
      "title": "#qiziqarli #tolqin Kvadrat to'lqinlar Ajoyib tabiat hodisasi. Bu to'lqinlarning bir nechta manbalari mavjud bo'lganda yoki shamol doimo yo'nalishini o'zgartirganda sodir bo'ladi. Ham suzuvchilar, ham kemalar uchun juda xavfli, chunki ularga moslashish qiyin. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/328",
      "embed": "https://t.me/Fizikadan_tajribalar/328?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: tebranishlar va to‘lqinlar: hisoblash",
      "given": "λ = 1,5 m va ν = 4 Hz.",
      "steps": [
        "v = λν",
        "v = 1,5·4",
        "v = 6 m/s"
      ],
      "answer": 6,
      "unit": "m/s",
      "prompt": "λ = 0,8 m va ν = 10 Hz bo‘lsa, v ni toping.",
      "practice": 8
    }
  },
  {
    "id": "l21",
    "video": {
      "id": "zyPlftqdm7w",
      "title": "Suyuqlikning oqim tezligi va hajmning doimiylik tenglamasi",
      "duration": "9:54",
      "source": "https://t.me/kau_fizika/273",
      "embed": "https://www.youtube-nocookie.com/embed/zyPlftqdm7w?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-51",
      "title": "#qiziqarli #gidromexanika QURUQ SUV Suv nam ekanligini hamma biladi. Lekin quruq suv bor desakchi? 🤔🤔 Bu suyuqlik oddiy suvga juda o'xshaydi, lekin qarama-qarshi xususiyatlarga ega. Misol uchun, u ozgina namlanadi va juda tez bug'lanadi. Bundan tashqari, 49°C da qaynaydi, shuning uchun barmoqlaringizni qaynoq quruq suvga solib, kuymaysiz. Ammo unda choy damlay olmaysiz. Chunki quruq suv boshqa moddalarni, masalan, bo'yoqlarni rad etadi. Ushbu moddaning bug'lari shunchalik og'irki, ular kislorodni siqib chiqaradi va idishlarga joylashadi, ular hatto shamni ham o'chirishi mumkin. Quruq suv ham elektr tokini o'tkazmaydi, shuning uchun bunday suvga tushgan telefon xavf ostida emas. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:27",
      "source": "https://t.me/Fizikadan_tajribalar/51",
      "embed": "https://t.me/Fizikadan_tajribalar/51?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Suyuqlik va gazlar harakati: hisoblash",
      "given": "S₁ = 4 cm², v₁ = 2 m/s, S₂ = 2 cm².",
      "steps": [
        "S₁v₁ = S₂v₂",
        "v₂ = S₁v₁/S₂",
        "v₂ = 4 m/s"
      ],
      "answer": 4,
      "unit": "m/s",
      "prompt": "S₁ = 6 cm², v₁ = 3 m/s, S₂ = 2 cm² bo‘lsa, v₂ ni toping.",
      "practice": 9
    }
  },
  {
    "id": "l22",
    "video": {
      "id": "XHcfSztFswE",
      "title": "Bernulli tenglamasi (1-qism)",
      "duration": "9:01",
      "source": "https://t.me/kau_fizika/274",
      "embed": "https://www.youtube-nocookie.com/embed/XHcfSztFswE?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-161",
      "title": "#qiziqarli #gidromexanika QURUQ SUV Suv nam ekanligini hamma biladi. Lekin quruq suv bor desakchi? 🤔🤔 Bu suyuqlik oddiy suvga juda o'xshaydi, lekin qarama-qarshi xususiyatlarga ega. Misol uchun, u ozgina namlanadi va juda tez bug'lanadi. Bundan tashqari, 49°C da qaynaydi, shuning uchun barmoqlaringizni qaynoq quruq suvga solib, kuymaysiz. Ammo unda choy damlay olmaysiz. Chunki quruq suv boshqa moddalarni, masalan, bo'yoqlarni rad etadi. Ushbu moddaning bug'lari shunchalik og'irki, ular kislorodni siqib chiqaradi va idishlarga joylashadi, ular hatto shamni ham o'chirishi mumkin. Quruq suv ham elektr tokini o'tkazmaydi, shuning uchun bunday suvga tushgan telefon xavf ostida emas. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:27",
      "source": "https://t.me/Fizikadan_tajribalar/161",
      "embed": "https://t.me/Fizikadan_tajribalar/161?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Harakatlanayotgan gaz va suyuqlik bosimidan texnikada foydalanish: hisoblash",
      "given": "Suv oqimida v₁ = 2 m/s, v₂ = 4 m/s, ρ = 1000 kg/m³.",
      "steps": [
        "Δp = ρ(v₂² − v₁²)/2",
        "Δp = 1000(16 − 4)/2",
        "Δp = 6000 Pa"
      ],
      "answer": 6000,
      "unit": "Pa",
      "prompt": "v₁ = 3 m/s va v₂ = 5 m/s bo‘lsa, bosimlar farqini toping.",
      "practice": 8000
    }
  },
  {
    "id": "l23",
    "video": {
      "id": "ByXX5uJKvtI",
      "title": "Bernulli tenglamasi yordamida misol ishlash",
      "duration": "7:11",
      "source": "https://t.me/kau_fizika/278",
      "embed": "https://www.youtube-nocookie.com/embed/ByXX5uJKvtI?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-83",
      "title": "#qiziqarli #gidrodinamika Sirt taranglik kuchi 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/83",
      "embed": "https://t.me/Fizikadan_tajribalar/83?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: gidrodinamika: hisoblash",
      "given": "S = 0,02 m², v = 3 m/s.",
      "steps": [
        "Q = Sv",
        "Q = 0,02·3",
        "Q = 0,06 m³/s"
      ],
      "answer": 0.06,
      "unit": "m³/s",
      "prompt": "S = 0,03 m² va v = 4 m/s bo‘lsa, Q ni toping.",
      "practice": 0.12
    }
  },
  {
    "id": "l24",
    "video": {
      "id": "zzY49qpB5xc",
      "title": "Tekislikda yotgan 2 ta zaryadning natijaviy elektr maydon kuchlanganligi",
      "duration": "9:08",
      "source": "https://t.me/kau_fizika/321",
      "embed": "https://www.youtube-nocookie.com/embed/zzY49qpB5xc?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-238",
      "title": "📣 PIZIK Qoraqalpog'istonda! Pizik jamoasi Qoraqalpog'istondagi 11-maktabga tashrif buyurdi. ✅ 20 ga yaqin o‘quvchilar Bernulli prinsipi mavzusini amaliy tajribalar orqali o‘rgandilar. 🫡 Boshqalarga ham ulashishni unutmang! #fizika #stem #eksperiment @pizik_lab — 🍎 from apple to people. Physics for everyone. 👉 Instagram | YouTube | Telegram",
      "duration": "0:55",
      "source": "https://t.me/pizik_lab/238",
      "embed": "https://t.me/pizik_lab/238?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Elektr maydon kuchlanganligining superpozitsiya prinsipi: hisoblash",
      "given": "Bir yo‘nalishdagi E₁ = 200 N/C va E₂ = 300 N/C.",
      "steps": [
        "E = E₁ + E₂",
        "E = 200 + 300",
        "E = 500 N/C"
      ],
      "answer": 500,
      "unit": "N/C",
      "prompt": "E₁ = 150 N/C va E₂ = 250 N/C bo‘lsa, E ni toping.",
      "practice": 400
    }
  },
  {
    "id": "l25",
    "video": {
      "id": "kW3u_H8FDqo",
      "title": "Nuqtaviy zaryadning elektr maydon kuchlanganligi modulini topish",
      "duration": "15:25",
      "source": "https://t.me/kau_fizika/319",
      "embed": "https://www.youtube-nocookie.com/embed/kW3u_H8FDqo?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-537",
      "title": "Elektrostatika, zaryadlangan jisimlarning o'zaro tasiri https://t.me/Fizikadan_tajribalar",
      "duration": "0:59",
      "source": "https://t.me/Fizikadan_tajribalar/537",
      "embed": "https://t.me/Fizikadan_tajribalar/537?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 33,
      "verified": true
    },
    "problem": {
      "title": "Zaryadlangan sharning elektr maydoni: hisoblash",
      "given": "q = 1 μC, r = 0,3 m, k = 9·10⁹.",
      "steps": [
        "E = kq/r²",
        "E = 9·10⁹·10⁻⁶/0,09",
        "E = 100000 N/C"
      ],
      "answer": 100000,
      "unit": "N/C",
      "prompt": "q = 2 μC va r = 0,3 m bo‘lsa, E ni toping.",
      "practice": 200000
    }
  },
  {
    "id": "l26",
    "video": {
      "id": "iatBXZUX1Xk",
      "title": "Bir toʻgʻri chiziqda yotgan 2 ta zaryad oʻrtasidagi natijaviy elektr maydon kuchlanganligi",
      "duration": "9:36",
      "source": "https://t.me/kau_fizika/320",
      "embed": "https://www.youtube-nocookie.com/embed/iatBXZUX1Xk?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-295",
      "title": "Quyosh tojidagi yomg'ir Quyosh tojida issiq plazma kuchli magnit maydon tasirida kondensatsiyalanadi va yuqori qatlamlardan Quyosh yuzasiga sovib qayta tushadi. Ushbu tushayotgan moddaning tezligi 50-100 km/s 🚀 bo'lib, temperaturasi 50 000 K ga teng🔥 https://t.me/Fizikadan_tajribalar kanali",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/295",
      "embed": "https://t.me/Fizikadan_tajribalar/295?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: elektr maydon: hisoblash",
      "given": "F = 0,02 N, q = 2 μC.",
      "steps": [
        "E = F/q",
        "E = 0,02/(2·10⁻⁶)",
        "E = 10000 N/C"
      ],
      "answer": 10000,
      "unit": "N/C",
      "prompt": "F = 0,03 N va q = 3 μC bo‘lsa, E ni toping.",
      "practice": 10000
    }
  },
  {
    "id": "l27",
    "video": {
      "id": "KV2LWFYCnZ0",
      "title": "Zaryadni koʻchirishda bajarilgan ish",
      "duration": "10:20",
      "source": "https://t.me/kau_fizika/326",
      "embed": "https://www.youtube-nocookie.com/embed/KV2LWFYCnZ0?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Elektrostatik maydonda zaryadni ko‘chirishda bajarilgan ish: hisoblash",
      "given": "q = 2 μC, E = 5000 N/C, d = 0,2 m.",
      "steps": [
        "A = qEd",
        "A = 2·10⁻⁶·5000·0,2",
        "A = 0,002 J"
      ],
      "answer": 0.002,
      "unit": "J",
      "prompt": "q = 4 μC, E = 3000 N/C, d = 0,5 m bo‘lsa, A ni toping.",
      "practice": 0.006
    }
  },
  {
    "id": "l28",
    "video": {
      "id": "PwXvtlzcb_M",
      "title": "Zaryadning elektr potensial energiyasi",
      "duration": "9:33",
      "source": "https://t.me/kau_fizika/325",
      "embed": "https://www.youtube-nocookie.com/embed/PwXvtlzcb_M?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-377",
      "title": "Kondensator energiyasi",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/377",
      "embed": "https://t.me/Fizikadan_tajribalar/377?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 25,
      "verified": true
    },
    "problem": {
      "title": "Elektr maydondagi zaryadning potensial energiyasi: hisoblash",
      "given": "q = 2 μC, φ = 1000 V.",
      "steps": [
        "W = qφ",
        "W = 2·10⁻⁶·1000",
        "W = 0,002 J"
      ],
      "answer": 0.002,
      "unit": "J",
      "prompt": "q = 3 μC va φ = 2000 V bo‘lsa, W ni toping.",
      "practice": 0.006
    }
  },
  {
    "id": "l29",
    "video": {
      "id": "b79UdDlQvw8",
      "title": "Kondensator energiyasi",
      "duration": "9:17",
      "source": "https://t.me/kau_fizika/343",
      "embed": "https://www.youtube-nocookie.com/embed/b79UdDlQvw8?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-358",
      "title": "#qiziqarli Magnit qum soati - ferromagnit qum yog'och taglikdagi neodim magnit ustida yig'iladi. Har bir ferromagnit temir zarrachalari asosda magnit maydon mavjudligida vaqtinchalik dipol magnitga aylanadi. 📣 t.me/fizikamaxsus",
      "duration": "0:34",
      "source": "https://t.me/Fizikadan_tajribalar/358",
      "embed": "https://t.me/Fizikadan_tajribalar/358?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Elektr maydon energiyasi: hisoblash",
      "given": "C = 2 μF, U = 100 V.",
      "steps": [
        "W = CU²/2",
        "W = 2·10⁻⁶·10000/2",
        "W = 0,01 J"
      ],
      "answer": 0.01,
      "unit": "J",
      "prompt": "C = 4 μF va U = 50 V bo‘lsa, W ni toping.",
      "practice": 0.005
    }
  },
  {
    "id": "l30",
    "video": {
      "id": "R97ptRkXgD8",
      "title": "Energiyaning saqlanish qonuni",
      "duration": "11:24",
      "source": "https://t.me/kau_fizika/181",
      "embed": "https://www.youtube-nocookie.com/embed/R97ptRkXgD8?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-197",
      "title": "#sayyora Haumea- shar shakliga ega bo'lmagan yagona rasmiy mitti sayyora. Uning ikkita kichik yo'ldoshi bor va ular Quyoshdan 5,1 dan 7,7 milliard km masofada joylashgan. Bir kuni atigi to'rt soat davom etadi, bu uni Quyosh sistemamizda eng tez aylanadigan jismlardan biriga aylantiradi. Ba'zi astronomlar uning tez aylanishi uning oval shaklini tushuntirishi mumkin deb o'ylashadi. U 2004 yilda AQShning Palomar rasadxonasida Caltechdan Mayk Braun boshchiligidagi guruh tomonidan kashf etilgan Orbital davri: 284 yil Radius: 816 km Kashf etilgan: 28 dekabr 2004 yil Yulduzli tizim: Quyosh tizimi Yo'ldoshlari: Salom, Namaka Kashfiyotchilar: Maykl E. Braun, Xose Luis Ortiz Moreno 🛰 https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/197",
      "embed": "https://t.me/Fizikadan_tajribalar/197?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Amaliy mashg‘ulot: energiyaning bir turdan boshqasiga aylanishi: hisoblash",
      "given": "Kinetik energiya 12 J, potensial energiya 8 J.",
      "steps": [
        "E = Eₖ + Eₚ",
        "E = 12 + 8",
        "E = 20 J"
      ],
      "answer": 20,
      "unit": "J",
      "prompt": "Eₖ = 15 J va Eₚ = 5 J bo‘lsa, umumiy energiyani toping.",
      "practice": 20
    }
  },
  {
    "id": "l31",
    "video": {
      "id": "w2aOmCdRbDw",
      "title": "Bir nechta zaryadning umumiy maydon potensialini topish",
      "duration": "6:29",
      "source": "https://t.me/kau_fizika/330",
      "embed": "https://www.youtube-nocookie.com/embed/w2aOmCdRbDw?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Masalalar yechish: elektrostatika: hisoblash",
      "given": "A = 0,006 J, q = 3 μC.",
      "steps": [
        "φ = A/q",
        "φ = 0,006/(3·10⁻⁶)",
        "φ = 2000 V"
      ],
      "answer": 2000,
      "unit": "V",
      "prompt": "A = 0,01 J va q = 5 μC bo‘lsa, φ ni toping.",
      "practice": 2000
    }
  },
  {
    "id": "l32",
    "video": {
      "id": "wgPtas0ubso",
      "title": "Kirxgofning tok kuchiga oid qonuni",
      "duration": "7:55",
      "source": "https://t.me/kau_fizika/337",
      "embed": "https://www.youtube-nocookie.com/embed/wgPtas0ubso?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-71",
      "title": "#laboratoriya #8sinf 8-sinf laboratoriya ishi: ELEKTR ZANJIRINI YIG'ISH. UNI TURLI QISMLARIDA TOK KUCHI VA KUCHLANISHNI O'LCHASH 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "6:14",
      "source": "https://t.me/Fizikadan_tajribalar/71",
      "embed": "https://t.me/Fizikadan_tajribalar/71?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 33,
      "verified": true
    },
    "problem": {
      "title": "Tok kuchi va tok zichligi: hisoblash",
      "given": "q = 12 C zaryad 3 s da o‘tdi.",
      "steps": [
        "I = q/t",
        "I = 12/3",
        "I = 4 A"
      ],
      "answer": 4,
      "unit": "A",
      "prompt": "q = 20 C va t = 5 s bo‘lsa, I ni toping.",
      "practice": 4
    }
  },
  {
    "id": "l33",
    "video": {
      "id": "ob4F2SiSWa8",
      "title": "Om qonuni",
      "duration": "12:22",
      "source": "https://t.me/kau_fizika/331",
      "embed": "https://www.youtube-nocookie.com/embed/ob4F2SiSWa8?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-494",
      "title": "Katta tezlikda aylantirilgan zanjir obruchga aylanishini ko'ring. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:42",
      "source": "https://t.me/Fizikadan_tajribalar/494",
      "embed": "https://t.me/Fizikadan_tajribalar/494?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "To‘liq zanjir uchun Om qonuni: hisoblash",
      "given": "ε = 12 V, R = 5 Ω, r = 1 Ω.",
      "steps": [
        "I = ε/(R + r)",
        "I = 12/6",
        "I = 2 A"
      ],
      "answer": 2,
      "unit": "A",
      "prompt": "ε = 18 V, R = 8 Ω, r = 1 Ω bo‘lsa, I ni toping.",
      "practice": 2
    }
  },
  {
    "id": "l34",
    "video": {
      "id": "v_f_OZHhvrI",
      "title": "Bir nechta qarshilikdan iborat zanjirni tahlil qilish",
      "duration": "6:24",
      "source": "https://t.me/kau_fizika/334",
      "embed": "https://www.youtube-nocookie.com/embed/v_f_OZHhvrI?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Masalalar yechish: o‘zgarmas tok: hisoblash",
      "given": "U = 12 V, I = 3 A.",
      "steps": [
        "R = U/I",
        "R = 12/3",
        "R = 4 Ω"
      ],
      "answer": 4,
      "unit": "Ω",
      "prompt": "U = 20 V va I = 4 A bo‘lsa, R ni toping.",
      "practice": 5
    }
  },
  {
    "id": "l35",
    "video": {
      "id": "EGj609puNPU",
      "title": "Kirxgofning kuchlanishga oid qonuni",
      "duration": "7:57",
      "source": "https://t.me/kau_fizika/338",
      "embed": "https://www.youtube-nocookie.com/embed/EGj609puNPU?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-70",
      "title": "#laboratoriya #8sinf 8-sinf laboratoriya ishi: AMPERMETR VA VOLTMETR YIRDAMIDA O'TKAZGICH QARSHILIGINI ANIQLASH 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "2:47",
      "source": "https://t.me/Fizikadan_tajribalar/70",
      "embed": "https://t.me/Fizikadan_tajribalar/70?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 43,
      "verified": true
    },
    "problem": {
      "title": "Laboratoriya: tok manbaining EYKi va ichki qarshiligini aniqlash: hisoblash",
      "given": "U = 10 V, I = 2 A, r = 1 Ω.",
      "steps": [
        "ε = U + Ir",
        "ε = 10 + 2·1",
        "ε = 12 V"
      ],
      "answer": 12,
      "unit": "V",
      "prompt": "U = 15 V, I = 3 A, r = 1 Ω bo‘lsa, ε ni toping.",
      "practice": 18
    }
  },
  {
    "id": "l36",
    "video": {
      "id": "gYbpjsSfOqA",
      "title": "Ketma-ket ulangan qarshiliklar",
      "duration": "9:03",
      "source": "https://t.me/kau_fizika/332",
      "embed": "https://www.youtube-nocookie.com/embed/gYbpjsSfOqA?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Metall qarshiligining temperaturaga bog‘liqligi: hisoblash",
      "given": "R₀ = 10 Ω, α = 0,004 K⁻¹, ΔT = 50 K.",
      "steps": [
        "R = R₀(1 + αΔT)",
        "R = 10(1 + 0,2)",
        "R = 12 Ω"
      ],
      "answer": 12,
      "unit": "Ω",
      "prompt": "R₀ = 20 Ω, α = 0,005 va ΔT = 40 K bo‘lsa, R ni toping.",
      "practice": 24
    }
  },
  {
    "id": "l37",
    "video": {
      "id": "j0rQHktZyYA",
      "title": "Qarshiliklarning parallel ulanishi",
      "duration": "12:25",
      "source": "https://t.me/kau_fizika/333",
      "embed": "https://www.youtube-nocookie.com/embed/j0rQHktZyYA?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Masalalar yechish: qarshilik: hisoblash",
      "given": "U = 24 V, R = 8 Ω.",
      "steps": [
        "I = U/R",
        "I = 24/8",
        "I = 3 A"
      ],
      "answer": 3,
      "unit": "A",
      "prompt": "U = 30 V va R = 10 Ω bo‘lsa, I ni toping.",
      "practice": 3
    }
  },
  {
    "id": "l38",
    "video": {
      "id": "T3IXJDRD6e8",
      "title": "Elekrolitning oʻtkazuvchanligi",
      "duration": "10:54",
      "source": "https://t.me/kau_fizika/340",
      "embed": "https://www.youtube-nocookie.com/embed/T3IXJDRD6e8?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-39",
      "title": "#qiziqarli #elektr Elektroliz effekti. Elektroliz - elektrodlardagi ikkilamchi reaktsiyalar natijasida erigan moddalar yoki boshqa moddalarning tarkibiy qismlarini elektrodlarga chiqarishdan iborat bo'lgan fizik-kimyoviy jarayon bo'lib, u eritma yoki elektrolit eritmasidan elektr toki o'tganda sodir bo'ladi. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:14",
      "source": "https://t.me/Fizikadan_tajribalar/39",
      "embed": "https://t.me/Fizikadan_tajribalar/39?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Suyuqliklarda elektr toki: hisoblash",
      "given": "k = 0,0003 kg/C, I = 2 A, t = 100 s.",
      "steps": [
        "m = kIt",
        "m = 0,0003·2·100",
        "m = 0,06 kg"
      ],
      "answer": 0.06,
      "unit": "kg",
      "prompt": "k = 0,0002, I = 3 A, t = 200 s bo‘lsa, m ni toping.",
      "practice": 0.12
    }
  },
  {
    "id": "l39",
    "video": {
      "id": "iJr8w0gN9IE",
      "title": "Elektrolit tekshiruv (suv va sirka)",
      "duration": "1:32",
      "source": "https://t.me/kau_fizika/466",
      "embed": "https://www.youtube-nocookie.com/embed/iJr8w0gN9IE?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "_y-xQKdcbps",
      "title": "🔗 https://www.youtube.com/watch?v=_y-xQKdcbps 🎙 Pizik Ilmiy Kommunikatsiya Seriyasi 🌎 Ikkinchi sonimiz mehmoni — Shohzod Yuldashev, O'zbekistondagi kimyo fani tar'gibotchisi. Ushbu suhbatda biz quyidagilarni muhokama qildik: 📡 Shohzod akaning kimyo tajribalarini qilishdan asosiy maqsadi 🩸Sun'iy qon tajribasi va turli qiziqarli kimyoviy tajribalar 📜 Odamlarni ilmiy mavzularga qiziqtirish va ularni jalb etish usullari 🎙 Mashhur bo'lishning hayoti hamda karyerasiga ta’siri. 🎓 Ilmiy ta’lim, yoshlar va fan targ‘iboti haqida fikrlari. @pizik_lab — ☀️ oson fizika",
      "duration": "",
      "source": "https://t.me/pizik_lab/50",
      "embed": "https://www.youtube-nocookie.com/embed/_y-xQKdcbps?rel=0",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Faradeyning birinchi va ikkinchi qonuni: hisoblash",
      "given": "Elektrokimyoviy ekvivalent 0,00025 kg/C, I = 4 A, t = 100 s.",
      "steps": [
        "m = kIt",
        "m = 0,00025·4·100",
        "m = 0,1 kg"
      ],
      "answer": 0.1,
      "unit": "kg",
      "prompt": "k = 0,0002, I = 5 A, t = 100 s bo‘lsa, m ni toping.",
      "practice": 0.1
    }
  },
  {
    "id": "l40",
    "video": {
      "id": "C2hYieykE04",
      "title": "Elektrolit (kuchli kislotani sinash)",
      "duration": "0:53",
      "source": "https://t.me/kau_fizika/468",
      "embed": "https://www.youtube-nocookie.com/embed/C2hYieykE04?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-149",
      "title": "#qiziqarli #elektr Elektroliz effekti. Elektroliz - elektrodlardagi ikkilamchi reaktsiyalar natijasida erigan moddalar yoki boshqa moddalarning tarkibiy qismlarini elektrodlarga chiqarishdan iborat bo'lgan fizik-kimyoviy jarayon bo'lib, u eritma yoki elektrolit eritmasidan elektr toki o'tganda sodir bo'ladi. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:14",
      "source": "https://t.me/Fizikadan_tajribalar/149",
      "embed": "https://t.me/Fizikadan_tajribalar/149?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: elektroliz: hisoblash",
      "given": "m = 0,06 kg, k = 0,0003 kg/C, I = 2 A.",
      "steps": [
        "t = m/(kI)",
        "t = 0,06/0,0006",
        "t = 100 s"
      ],
      "answer": 100,
      "unit": "s",
      "prompt": "m = 0,12 kg, k = 0,0002 va I = 3 A bo‘lsa, t ni toping.",
      "practice": 200
    }
  },
  {
    "id": "l41",
    "video": {
      "id": "aOcw3oJfSDM",
      "title": "Elektrolit (tuzni tekshirish)",
      "duration": "1:14",
      "source": "https://t.me/kau_fizika/469",
      "embed": "https://www.youtube-nocookie.com/embed/aOcw3oJfSDM?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Elektrolizdan turmush va texnikada foydalanish: hisoblash",
      "given": "k = 0,0002 kg/C, I = 4 A, t = 300 s.",
      "steps": [
        "m = kIt",
        "m = 0,0002·4·300",
        "m = 0,24 kg"
      ],
      "answer": 0.24,
      "unit": "kg",
      "prompt": "k = 0,0003, I = 2 A, t = 400 s bo‘lsa, m ni toping.",
      "practice": 0.24
    }
  },
  {
    "id": "l42",
    "video": {
      "id": "0lZkSdivWCk",
      "title": "Oʻtkazgich va izolyatorlar",
      "duration": "13:49",
      "source": "https://t.me/kau_fizika/315",
      "embed": "https://www.youtube-nocookie.com/embed/0lZkSdivWCk?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-463",
      "title": "#qiziqarli #gif #erkintushish Vakuumda hamma jismlar bir vaqtda yerga tushadi. 👉 https://t.me/UYS_qiziqarli_fizika",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/463",
      "embed": "https://t.me/Fizikadan_tajribalar/463?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Gazlarda va vakuumda elektr toki: hisoblash",
      "given": "q = 30 C zaryad 5 s da o‘tdi.",
      "steps": [
        "I = q/t",
        "I = 30/5",
        "I = 6 A"
      ],
      "answer": 6,
      "unit": "A",
      "prompt": "q = 48 C va t = 8 s bo‘lsa, I ni toping.",
      "practice": 6
    }
  },
  {
    "id": "l43",
    "video": {
      "id": "tiLnsU8xRNA",
      "title": "Ishqalanish yoʻli bilan zaryadlanish",
      "duration": "5:15",
      "source": "https://t.me/kau_fizika/313",
      "embed": "https://www.youtube-nocookie.com/embed/tiLnsU8xRNA?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Yarimo‘tkazgichlar va ularning metallardan farqi: hisoblash",
      "given": "q = 1,6·10⁻¹⁹ C, n = 10²² m⁻³, μ = 0,01.",
      "steps": [
        "σ = qnμ",
        "σ = 1,6·10⁻¹⁹·10²²·0,01",
        "σ = 16 S/m"
      ],
      "answer": 16,
      "unit": "S/m",
      "prompt": "n = 2·10²² m⁻³ bo‘lsa, σ ni toping.",
      "practice": 32
    }
  },
  {
    "id": "l44",
    "video": {
      "id": "fZGbkgMl390",
      "title": "Elektrostatik telegraflar",
      "duration": "9:02",
      "source": "https://t.me/kau_fizika/489",
      "embed": "https://www.youtube-nocookie.com/embed/fZGbkgMl390?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Yarimo‘tkazgichlarning elektr o‘tkazuvchanligi: hisoblash",
      "given": "Solishtirma qarshilik ρ = 0,02 Ω·m.",
      "steps": [
        "σ = 1/ρ",
        "σ = 1/0,02",
        "σ = 50 S/m"
      ],
      "answer": 50,
      "unit": "S/m",
      "prompt": "ρ = 0,04 Ω·m bo‘lsa, σ ni toping.",
      "practice": 25
    }
  },
  {
    "id": "l45",
    "video": {
      "id": "Lp_8X5pSKJk",
      "title": "2 ta manbadan tashkil topgan elektr zanjirni tahlil qilish",
      "duration": "6:55",
      "source": "https://t.me/kau_fizika/335",
      "embed": "https://www.youtube-nocookie.com/embed/Lp_8X5pSKJk?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Yarimo‘tkazgichli asboblar va ularning qo‘llanishi: hisoblash",
      "given": "Diodda U = 0,7 V va I = 0,02 A.",
      "steps": [
        "R = U/I",
        "R = 0,7/0,02",
        "R = 35 Ω"
      ],
      "answer": 35,
      "unit": "Ω",
      "prompt": "U = 0,6 V va I = 0,01 A bo‘lsa, R ni toping.",
      "practice": 60
    }
  },
  {
    "id": "l46",
    "video": {
      "id": "9YQ9irb1FxM",
      "title": "Voltmetr va ampermetr",
      "duration": "15:05",
      "source": "https://t.me/kau_fizika/339",
      "embed": "https://www.youtube-nocookie.com/embed/9YQ9irb1FxM?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-488",
      "title": "#qiziqarli 230 000 Volt kuchlanish https://t.me/Fizikadan_tajribalar",
      "duration": "0:10",
      "source": "https://t.me/Fizikadan_tajribalar/488",
      "embed": "https://t.me/Fizikadan_tajribalar/488?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Laboratoriya: diodning volt-amper tavsifi: hisoblash",
      "given": "VAX nuqtasida U = 0,8 V va I = 0,04 A.",
      "steps": [
        "R = U/I",
        "R = 0,8/0,04",
        "R = 20 Ω"
      ],
      "answer": 20,
      "unit": "Ω",
      "prompt": "U = 0,9 V va I = 0,03 A bo‘lsa, R ni toping.",
      "practice": 30
    }
  },
  {
    "id": "l47",
    "video": {
      "id": "8ozgNOs4aqw",
      "title": "Tokli oʻtkazgich hosil qilgan magnit maydon",
      "duration": "11:11",
      "source": "https://t.me/kau_fizika/354",
      "embed": "https://www.youtube-nocookie.com/embed/8ozgNOs4aqw?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-38",
      "title": "#qiziqarli #magnit Magnitning magnit maydoni ko'rinishi. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/38",
      "embed": "https://t.me/Fizikadan_tajribalar/38?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 36,
      "verified": true
    },
    "problem": {
      "title": "Magnit maydon induksiyasi va tokli o‘tkazgich magnit maydoni: hisoblash",
      "given": "I = 5 A, r = 0,1 m, μ₀ = 4π·10⁻⁷.",
      "steps": [
        "B = μ₀I/(2πr)",
        "B = 2·10⁻⁷·5/0,1",
        "B = 0,00001 T"
      ],
      "answer": 0.00001,
      "unit": "T",
      "prompt": "I = 10 A va r = 0,1 m bo‘lsa, B ni toping.",
      "practice": 0.00002
    }
  },
  {
    "id": "l48",
    "video": {
      "id": "mbVqq7GDbrQ",
      "title": "Magnit maydon tomonidan tokli oʻtkazgichga taʼsir qiladigan kuch",
      "duration": "10:22",
      "source": "https://t.me/kau_fizika/353",
      "embed": "https://www.youtube-nocookie.com/embed/mbVqq7GDbrQ?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-182",
      "title": "#Jonli_tarix Yadro portlashining 1.1 kilometr uzoqlikdagi uyga ta'siri. Nevada poligoni, 1953 yil. https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/182",
      "embed": "https://t.me/Fizikadan_tajribalar/182?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Magnit maydonning tokli o‘tkazgichga ta’siri: hisoblash",
      "given": "B = 0,2 T, I = 3 A, l = 0,5 m.",
      "steps": [
        "F = BIl",
        "F = 0,2·3·0,5",
        "F = 0,3 N"
      ],
      "answer": 0.3,
      "unit": "N",
      "prompt": "B = 0,4 T, I = 2 A, l = 0,5 m bo‘lsa, F ni toping.",
      "practice": 0.4
    }
  },
  {
    "id": "l49",
    "video": {
      "id": "3rBCBMoow8M",
      "title": "Parallel toʻgʻri toklarning oʻzaro magnit taʼsirlashuvi",
      "duration": "9:51",
      "source": "https://t.me/kau_fizika/355",
      "embed": "https://www.youtube-nocookie.com/embed/3rBCBMoow8M?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-324",
      "title": "#qiziqarli Rangli ferromagnit displey hujayralari. Qiziqarli xatti-harakat magnit kuch va sirt tarangligi o'rtasidagi o'zaro ta'sir tufayli yuzaga keladi, natijada suyuqlik kuchli neodim magnitining kuch chiziqlariga to'g'ri kelmoqchi bo'lganida, nosimmetrik shpiklar qatorlari paydo bo'ladi. 📣 https://t.me/Fizikadan_tajribalar",
      "duration": "0:51",
      "source": "https://t.me/Fizikadan_tajribalar/324",
      "embed": "https://t.me/Fizikadan_tajribalar/324?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "Tokli o‘tkazgichlarning o‘zaro ta’siri: hisoblash",
      "given": "I₁ = 10 A, I₂ = 5 A, l = 1 m, r = 0,1 m.",
      "steps": [
        "F = μ₀I₁I₂l/(2πr)",
        "F = 2·10⁻⁷·10·5/0,1",
        "F = 0,0001 N"
      ],
      "answer": 0.0001,
      "unit": "N",
      "prompt": "I₁ = I₂ = 10 A bo‘lsa, F ni toping.",
      "practice": 0.0002
    }
  },
  {
    "id": "l50",
    "video": {
      "id": "WgBwc9EnG08",
      "title": "2 ta vektorning vektor koʻpaytmasi (1-qism)",
      "duration": "9:28",
      "source": "https://t.me/kau_fizika/349",
      "embed": "https://www.youtube-nocookie.com/embed/WgBwc9EnG08?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Tokli o‘tkazgichni magnit maydonda ko‘chirishda bajarilgan ish: hisoblash",
      "given": "B = 0,5 T, I = 2 A, l = 0,4 m, s = 0,3 m.",
      "steps": [
        "A = BIls",
        "A = 0,5·2·0,4·0,3",
        "A = 0,12 J"
      ],
      "answer": 0.12,
      "unit": "J",
      "prompt": "B = 0,2 T, I = 3 A, l = 0,5 m, s = 0,4 m bo‘lsa, A ni toping.",
      "practice": 0.12
    }
  },
  {
    "id": "l51",
    "video": {
      "id": "-lklhIOzq6A",
      "title": "Zaryadlangan zarrachaga magnit maydon tomonidan taʼsir qiladigan kuch",
      "duration": "10:16",
      "source": "https://t.me/kau_fizika/348",
      "embed": "https://www.youtube-nocookie.com/embed/-lklhIOzq6A?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-199",
      "title": "Gorizontal burchak ostida otilgan jism harakati H maksimal 😁 S maksimal 😊 https://t.me/Fizikadan_tajribalar",
      "duration": "0:06",
      "source": "https://t.me/Fizikadan_tajribalar/199",
      "embed": "https://t.me/Fizikadan_tajribalar/199?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Magnit maydonda zaryadli zarraning harakati: hisoblash",
      "given": "q = 2 μC, v = 100 m/s, B = 0,5 T.",
      "steps": [
        "F = qvB",
        "F = 2·10⁻⁶·100·0,5",
        "F = 0,0001 N"
      ],
      "answer": 0.0001,
      "unit": "N",
      "prompt": "q = 1 μC, v = 200 m/s, B = 0,5 T bo‘lsa, F ni toping.",
      "practice": 0.0001
    }
  },
  {
    "id": "l52",
    "video": {
      "id": "7BIS_mtUgKE",
      "title": "Elektr motor (1-qism)",
      "duration": "9:51",
      "source": "https://t.me/kau_fizika/358",
      "embed": "https://www.youtube-nocookie.com/embed/7BIS_mtUgKE?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-31",
      "title": "#qiziqarli #molekulyar fizika Bu dunyodagi eng katta dizel dvigateli Uning balandligi 13,4 metr, uzunligi 27 metr va og'irligi 2300 tonnani tashkil qiladi. U soatiga 6000 litrdan ortiq yoqilg‘i sarflaydi va 109 ming ot kuchi ishlab chiqaradi. Ushbu dvigatellar konteyner kemalari uchun mo'ljallangan 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "0:16",
      "source": "https://t.me/Fizikadan_tajribalar/31",
      "embed": "https://t.me/Fizikadan_tajribalar/31?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 28,
      "verified": true
    },
    "problem": {
      "title": "O‘zgarmas tok elektr dvigateli: hisoblash",
      "given": "B = 0,5 T, I = 2 A, S = 0,01 m², N = 100.",
      "steps": [
        "M = BISN",
        "M = 0,5·2·0,01·100",
        "M = 1 N·m"
      ],
      "answer": 1,
      "unit": "N·m",
      "prompt": "B = 0,2 T, I = 3 A, S = 0,02 m², N = 50 bo‘lsa, M ni toping.",
      "practice": 0.6
    }
  },
  {
    "id": "l53",
    "video": {
      "id": "V_hJW3pjj34",
      "title": "Magnit maydon tomonidan protonga taʼsir qiladigan kuch (2-qism)",
      "duration": "9:10",
      "source": "https://t.me/kau_fizika/352",
      "embed": "https://www.youtube-nocookie.com/embed/V_hJW3pjj34?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-201",
      "title": "Elektromagnit maydon tarqalish yunalishi",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/201",
      "embed": "https://t.me/Fizikadan_tajribalar/201?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 25,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: magnit maydon: hisoblash",
      "given": "B = 0,4 T, I = 5 A, l = 0,2 m.",
      "steps": [
        "F = BIl",
        "F = 0,4·5·0,2",
        "F = 0,4 N"
      ],
      "answer": 0.4,
      "unit": "N",
      "prompt": "B = 0,5 T, I = 4 A, l = 0,3 m bo‘lsa, F ni toping.",
      "practice": 0.6
    }
  },
  {
    "id": "l54",
    "video": {
      "id": "wbFDpocOBNM",
      "title": "Faradeyning elektromagnit induksiya qonuni",
      "duration": "6:26",
      "source": "https://t.me/kau_fizika/365",
      "embed": "https://www.youtube-nocookie.com/embed/wbFDpocOBNM?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-378",
      "title": "Faradeyning elektromagnit induksiya qonuni",
      "duration": "0:49",
      "source": "https://t.me/Fizikadan_tajribalar/378",
      "embed": "https://t.me/Fizikadan_tajribalar/378?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 50,
      "verified": true
    },
    "problem": {
      "title": "Elektromagnit induksiya: hisoblash",
      "given": "Magnit oqimi 0,02 Wb ga 0,1 s da o‘zgardi.",
      "steps": [
        "ε = ΔΦ/Δt",
        "ε = 0,02/0,1",
        "ε = 0,2 V"
      ],
      "answer": 0.2,
      "unit": "V",
      "prompt": "ΔΦ = 0,03 Wb va Δt = 0,05 s bo‘lsa, ε ni toping.",
      "practice": 0.6
    }
  },
  {
    "id": "l55",
    "video": {
      "id": "AxzO7yGlkWs",
      "title": "Oʻtkazgichda hosil qilingan induksion tok",
      "duration": "7:56",
      "source": "https://t.me/kau_fizika/357",
      "embed": "https://www.youtube-nocookie.com/embed/AxzO7yGlkWs?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-360",
      "title": "#qiziqarli 😳 Magnit levitatsiya va elektromagnit induksiyaning mukammal kombinatsiyasi namoyishi! https://t.me/Fizikadan_tajribalar",
      "duration": "0:59",
      "source": "https://t.me/Fizikadan_tajribalar/360",
      "embed": "https://t.me/Fizikadan_tajribalar/360?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 41,
      "verified": true
    },
    "problem": {
      "title": "Amaliy mashg‘ulot: elektromagnit induksiya: hisoblash",
      "given": "N = 200, ΔΦ = 0,01 Wb, Δt = 0,2 s.",
      "steps": [
        "ε = NΔΦ/Δt",
        "ε = 200·0,01/0,2",
        "ε = 10 V"
      ],
      "answer": 10,
      "unit": "V",
      "prompt": "N = 100, ΔΦ = 0,02 Wb, Δt = 0,1 s bo‘lsa, ε ni toping.",
      "practice": 20
    }
  },
  {
    "id": "l56",
    "video": {
      "id": "dqPZyUuSllo",
      "title": "Lens qoidasi",
      "duration": "6:00",
      "source": "https://t.me/kau_fizika/366",
      "embed": "https://www.youtube-nocookie.com/embed/dqPZyUuSllo?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "O‘zinduksiya va induktivlik: hisoblash",
      "given": "L = 0,5 H, ΔI = 4 A, Δt = 0,2 s.",
      "steps": [
        "ε = LΔI/Δt",
        "ε = 0,5·4/0,2",
        "ε = 10 V"
      ],
      "answer": 10,
      "unit": "V",
      "prompt": "L = 0,2 H, ΔI = 5 A, Δt = 0,1 s bo‘lsa, ε ni toping.",
      "practice": 10
    }
  },
  {
    "id": "l57",
    "video": {
      "id": "u6xIqpMPr6I",
      "title": "Faradey qonuniga misol",
      "duration": "8:12",
      "source": "https://t.me/kau_fizika/367",
      "embed": "https://www.youtube-nocookie.com/embed/u6xIqpMPr6I?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-373",
      "title": "#qiziqarli 😳 Magnit levitatsiya va elektromagnit induksiyaning mukammal kombinatsiyasi namoyishi! https://t.me/Fizikadan_tajribalar",
      "duration": "0:59",
      "source": "https://t.me/Fizikadan_tajribalar/373",
      "embed": "https://t.me/Fizikadan_tajribalar/373?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 41,
      "verified": true
    },
    "problem": {
      "title": "Masalalar yechish: elektromagnit induksiya: hisoblash",
      "given": "ε = 12 V, Δt = 0,5 s, ΔI = 3 A.",
      "steps": [
        "L = εΔt/ΔI",
        "L = 12·0,5/3",
        "L = 2 H"
      ],
      "answer": 2,
      "unit": "H",
      "prompt": "ε = 10 V, Δt = 0,4 s, ΔI = 2 A bo‘lsa, L ni toping.",
      "practice": 2
    }
  },
  {
    "id": "l58",
    "video": {
      "id": "6_xVNqLOKBw",
      "title": "Doimiy magnit",
      "duration": "12:37",
      "source": "https://t.me/kau_fizika/347",
      "embed": "https://www.youtube-nocookie.com/embed/6_xVNqLOKBw?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": {
      "id": "tg-132",
      "title": "#qiziqarli #gravitatsiya Gravitatsiya yorug'lik tezligida harakat qiladi Ya'ni, agar Quyosh to'satdan g'oyib bo'lsa, tortishish maydonining o'zgarishi haqidagi ma'lumot bizga etib kelguniga qadar, Yer bo'sh fazo atrofida 8 daqiqa 20 soniyagacha aylanishda davom etadi. 👉 https://t.me/Fizikadan_tajribalar",
      "duration": "",
      "source": "https://t.me/Fizikadan_tajribalar/132",
      "embed": "https://t.me/Fizikadan_tajribalar/132?embed=1&mode=tme",
      "provider": "O‘zbekcha fizika tajribalari",
      "matchScore": 23,
      "verified": true
    },
    "problem": {
      "title": "Tok magnit maydonining energiyasi va moddalarning magnit xossalari: hisoblash",
      "given": "L = 0,5 H, I = 4 A.",
      "steps": [
        "W = LI²/2",
        "W = 0,5·16/2",
        "W = 4 J"
      ],
      "answer": 4,
      "unit": "J",
      "prompt": "L = 0,2 H va I = 10 A bo‘lsa, W ni toping.",
      "practice": 10
    }
  },
  {
    "id": "l59",
    "video": {
      "id": "LF8wlIeuvEQ",
      "title": "Qarama-qarshi toʻgʻri toklarning oʻzaro magnit taʼsirlashuvi",
      "duration": "11:32",
      "source": "https://t.me/kau_fizika/356",
      "embed": "https://www.youtube-nocookie.com/embed/LF8wlIeuvEQ?rel=0",
      "provider": "Khan Academy O‘zbek",
      "type": "youtube",
      "verified": true
    },
    "experimentVideo": null,
    "problem": {
      "title": "Masalalar yechish: magnit xossalar: hisoblash",
      "given": "Moddada B = 0,004 T, vakuumda B₀ = 0,001 T.",
      "steps": [
        "μ = B/B₀",
        "μ = 0,004/0,001",
        "μ = 4"
      ],
      "answer": 4,
      "unit": "marta",
      "prompt": "B = 0,006 T va B₀ = 0,002 T bo‘lsa, μ ni toping.",
      "practice": 3
    }
  }
];
  const byId = new Map(enrichment.map(item => [item.id, item]));
  course.lessons.forEach(lesson => {
    const item = byId.get(lesson.id);
    if (!item) return;
    lesson.video = item.video;
    lesson.experimentVideo = item.experimentVideo;
    lesson.problem = item.problem;
  });
})();

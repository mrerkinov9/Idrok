// Complete SAT Math Questions Dataset (80 Unique Hard Questions across 4 Sets)

const set1 = {
  setNum: 1,
  questions: [
    {
      domain: "Algebra — Tenglamalar Sistemasi",
      text: "Tenglamalar sistemasi $y = 3x + k$ to'g'ri chizig'i va $y = 2x^2 - 5x + 11$ paraboladan tashkil topgan, bu yerda $k$ — o'zgarmas son. Agar sistema xuddi bitta haqiqiy $(x, y)$ yechimga ega bo'lsa, $k$ ning qiymati nechaga teng?",
      options: { A: "-3", B: "3", C: "1", D: "5" }
    },
    {
      domain: "Advanced Math — Ko'rsatkichli Funksiyalar",
      text: "Bakteriyalar koloniyasining o'sishi $P(t) = 5000 \\cdot (1.4641)^{t/4}$ tenglama bilan modellangan, bu yerda $t$ — soatlardagi vaqt. Quyidagi teng shakldagi funksiyalardan qaysi biri har bir soatdagi foizli o'sish sur'atini o'zgarmas asos sifatida ko'rsatadi?",
      options: { A: "$P(t) = 5000 \\cdot (1.10)^t$", B: "$P(t) = 5000 \\cdot (1.21)^t$", C: "$P(t) = 5000 \\cdot (1.05)^t$", D: "$P(t) = 5000 \\cdot (1.15)^t$" }
    },
    {
      domain: "Advanced Math — Ko'phadlar",
      text: "$P(x) = 2x^3 - a x^2 + b x - 12$ ko'phadi $(x - 2)$ ga qoldiqsiz bo'linadi va $(x + 1)$ ga bo'linganda qoldiq $-15$ ga teng bo'ladi. $a + b$ ning qiymati nechaga teng?",
      options: { A: "1", B: "5", C: "7", D: "11" }
    },
    {
      domain: "Geometry — Doira Tenglamasi",
      text: "Dekart koordinatalar tekisligida doira tenglamasi $x^2 + y^2 - 6x + 8y - 11 = 0$ ko'rinishida berilgan. $P(x, y)$ nuqta doira aylanasi ustida yotadi. $P$ nuqtadan koordinata boshigacha $(0,0)$ bo'lgan eng katta masofa nechaga teng?",
      options: { A: "5", B: "6", C: "11", D: "16" }
    },
    {
      domain: "Trigonometry — Trigonometrik Ayniyatlar",
      text: "$0 < \\theta < \\frac{\\pi}{2}$ oraliqdagi burchak uchun, agar $\\sin\\left(3\\theta - \\frac{\\pi}{12}\\right) = \\cos\\left(2\\theta + \\frac{\\pi}{6}\\right)$ bo me'zon o'rinli bo'lsa, $\\theta$ burchak radianda nechaga teng?",
      options: { A: "$\\frac{\\pi}{12}$", B: "$\\frac{\\pi}{10}$", C: "$\\frac{3\\pi}{20}$", D: "$\\frac{\\pi}{6}$" }
    },
    {
      domain: "Problem Solving — Statistika & Xatolik Chegarasi",
      text: "Tadqiqotchi shahardagi 400 nafar tasodifiy tanlangan aholi o'rtasida so'rov o'tkazdi va 64% qo'llab-quvvatlash ko'rsatkichini 4.8% xatolik chegarasi (margin of error) bilan aniqladi. Xuddi shunday metodologiya bilan 1,600 nafar aholi o'rtasida ikkinchi so'rov o'tkazildi. Ikkinchi so'rov uchun kutilayotgan xatolik chegarasi qancha bo'ladi?",
      options: { A: "1.2%", B: "2.4%", C: "9.6%", D: "19.2%" }
    },
    {
      domain: "Advanced Math — Kasr-Ratsional Funksiyalar",
      text: "$f(x) = \\frac{x^2 - a^2}{x^2 - 7x + 12}$ funksiya $x = 4$ nuqtada yo'qotiladigan uzilishga (hole) va $x = 3$ nuqtada vertikal asimptotaga ega. $f(5)$ ning qiymatini toping.",
      options: { A: "4.5", B: "6.0", C: "9.0", D: "4.0" }
    },
    {
      domain: "Geometry — 3D Shakllar Hajmi",
      text: "Asos radiusi $r$ va balandligi $h$ bo'lgan metall konus eritilib, o'zaro o'xshash bo'lgan ikkita kichikroq konuslarga ajratildi. Kattaroq va kichikroq yangi konuslarning sirt maydonlari nisbati $9 : 4$ ga teng. Agar dastlabki konus hajmi $350\\pi \\text{ sm}^3$ bo'lsa, kichik yangi konusning hajmi necha $\\text{sm}^3$ bo'ladi?",
      options: { A: "$54\\pi$", B: "$80\\pi$", C: "$160\\pi$", D: "$270\\pi$" }
    },
    {
      domain: "Advanced Math — Teskari Funksiya",
      text: "$f(x) = \\frac{2x + 5}{x - 3}$ ($x \\neq 3$) funksiya berilgan. Agar $g(x) = f^{-1}(x)$ bo'lsa, $g(7)$ ning qiymati nechaga teng?",
      options: { A: "2.6", B: "4.2", C: "5.2", D: "6.5" }
    },
    {
      domain: "Problem Solving — Shartli Ehtimollik",
      text: "Tibbiy sinovda 500 nafar bemor tekshirildi. Kasalligi bor 200 bemordan 180 tasida test musbat chiqdi (true positive). Kasalligi yo'q 300 bemordan 30 tasida test xato ravishda musbat chiqdi (false positive). Testi musbat chiqqan bemorlar arasidan tasodifiy tanlangan bir kishida haqiqatan ham kasallik bo'lish ehtimolligi nechaga teng?",
      options: { A: "0.600", B: "0.750", C: "0.857", D: "0.900" }
    },
    {
      domain: "Algebra — Modul Tengsizliklari",
      text: "$xy$-tekislikda $|x| + |y| \\le 6$ va $y \\ge 0$ tengsizliklar sistemasi bilan chegaralangan soha berilgan. Ushbu sohaning yuzini toping.",
      options: { A: "18", B: "36", C: "72", D: "144" }
    },
    {
      domain: "Advanced Math — Parabola Maksimumi",
      text: "Jismning parvoz trayektoriyasi $y = a(x - h)^2 + k$ tenglama bilan ifodalanadi. Jism $(0, 36)$ nuqtadan o'tib, $x = 10$ nuqtada 100 metr maksimal balandlikka erishadi va $x = d$ nuqtada yerga ($y = 0$) tushadi. $d$ ning qiymati nechaga teng?",
      options: { A: "18.5", B: "20.0", C: "21.5", D: "22.5" }
    },
    {
      domain: "Geometry — Urnma Chiziq Tenglamasi",
      text: "Qiyiyaligi (slope) $m = \\frac{3}{4}$ bo'lgan to'g'ri chiziq $x^2 + y^2 = 25$ aylanaga birinchi chorakda urinadi. Ushbu to'g'ri chiziqning $y$-o'qini kesib o'tish nuqtasi ($y$-intercept) nechaga teng?",
      options: { A: "5.00", B: "6.25", C: "7.50", D: "8.33" }
    },
    {
      domain: "Problem Solving — Yarim Yemirilish Davri",
      text: "Radioaktiv modda yemirilishi $N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t / h}$ tenglama bo'yicha boradi, bu yerda $h$ — yemirilish yarim davri. Agar modda 48 yilda 75% ga kamaysa, uning dastlabki miqdoridan 12.5% qolishi uchun necha yil kerak bo'ladi?",
      options: { A: "64", B: "72", C: "84", D: "96" }
    },
    {
      domain: "Advanced Math — Kompleks Sonlar",
      text: "Agar $z = a + bi$ ($b > 0$) kompleks soni $x^2 - 6x + 25 = 0$ kvadrat tenglamaning ildizi bo'lsa, $a^2 - b^2$ ning qiymati nechaga teng?",
      options: { A: "-7", B: "7", C: "-16", D: "25" }
    },
    {
      domain: "Trigonometry — Kosinuslar Teoremasi",
      text: "$\\triangle ABC$ uchburchakda $AB = 7$, $BC = 8$ va $\\cos(\\angle B) = \\frac{1}{7}$. $AC$ tomonining uzunligini toping.",
      options: { A: "9", B: "11", C: "$\\sqrt{97}$", D: "13" }
    },
    {
      domain: "Algebra — Cheksiz Ko'p Yechimli Sistema",
      text: "Chiziqli tenglamalar sistemasi berilgan: $(k + 1)x + 6y = 18$ va $2x + (k - 3)y = 6$. $k$ o'zgarmas sonining qanday qiymatida sistema cheksiz ko'p yechimga ega bo'ladi?",
      options: { A: "2", B: "3", C: "5", D: "6" }
    },
    {
      domain: "Problem Solving — Birgalikda Ishlash Masalasi",
      text: "A nasos hovuzni yolg'iz o'zi 6 soatda, B nasos esa 9 soatda bo'shatadi. Ikkala nasos birgalikda ishlay boshladi, lekin 2 soatdan keyin A nasos buzilib qoldi. Hovuzni to'liq bo'shatish uchun jami necha soat vaqt ketdi?",
      options: { A: "5.0 soat", B: "6.0 soat", C: "6.5 soat", D: "7.0 soat" }
    },
    {
      domain: "Geometry — Muntazam Oltiburchak va Doira",
      text: "Radiusi 6 sm bo'lgan doiraga muntazam oltiburchak ichki chizilgan. Oltiburchak ichida joylashgan, lekin uning barcha tomonlariga urinuvchi ichki doiradan tashqaridagi soha yuzini toping.",
      options: { A: "$54\\sqrt{3} - 27\\pi$", B: "$54\\sqrt{3} - 36\\pi$", C: "$36\\sqrt{3} - 18\\pi$", D: "$27\\sqrt{3} - 9\\pi$" }
    },
    {
      domain: "Advanced Math — Kubik Funksiya Ekstremumi",
      text: "$f(x) = x^3 + p x^2 + q x + r$ kubik funksiya $x = -1$ va $x = 3$ nuqtalarda lokal ekstremumlarga ega. Agar $f(0) = 8$ bo'lsa, $f(2)$ ning qiymatini toping.",
      options: { A: "-14", B: "-10", C: "-6", D: "2" }
    }
  ],
  answers: [
    { correct: "B", explanation: "$2x^2 - 5x + 11 = 3x + k \\Rightarrow 2x^2 - 8x + (11 - k) = 0$. Yagona yechim uchun $\\Delta = (-8)^2 - 4(2)(11-k) = 0 \\Rightarrow 64 - 88 + 8k = 0 \\Rightarrow 8k = 24 \\Rightarrow k = 3$." },
    { correct: "A", explanation: "$(1.4641)^{t/4} = ((1.4641)^{1/4})^t = (1.10)^t$. Demak, soatlik o'sish 10% ko'rinishida $P(t) = 5000 \\cdot (1.10)^t$ bo'ladi." },
    { correct: "A", explanation: "$P(2) = 0 \\Rightarrow 16 - 4a + 2b - 12 = 0 \\Rightarrow 2a - b = 2$. $P(-1) = -15 \\Rightarrow -2 - a - b - 12 = -15 \\Rightarrow a + b = 1$. Natijada $a = 1, b = 0$, demak $a + b = 1$." },
    { correct: "C", explanation: "To'liq kvadratga ajratamiz: $(x-3)^2 + (y+4)^2 = 36$. Markaz $(3, -4)$, radius $R = 6$. Markazdan $(0,0)$ gacha masofa $d = \\sqrt{3^2 + (-4)^2} = 5$. Eng katta masofa $= d + R = 5 + 6 = 11$." },
    { correct: "A", explanation: "$\\sin A = \\cos B \\Rightarrow A + B = \\frac{\\pi}{2}$. $\\left(3\\theta - \\frac{\\pi}{12}\\right) + \\left(2\\theta + \\frac{\\pi}{6}\\right) = \\frac{\\pi}{2} \\Rightarrow 5\\theta + \\frac{\\pi}{12} = \\frac{\\pi}{2} \\Rightarrow 5\\theta = \\frac{5\\pi}{12} \\Rightarrow \\theta = \\frac{\\pi}{12}$." },
    { correct: "B", explanation: "Xatolik chegarasi $\\frac{1}{\\sqrt{n}}$ ga mutanosib. Tanlanma hajmi $n$ 4 baravar oshganda (400 dan 1600 ga), xatolik chegarasi $\\sqrt{4} = 2$ baravar kamayadi: $\\frac{4.8\\%}{2} = 2.4\\%$." },
    { correct: "A", explanation: "Surat va mahrajni ko'paytuvchilarga ajratamiz: $f(x) = \\frac{(x-a)(x+a)}{(x-3)(x-4)}$. $x=4$ da hole bo'lgani uchun $a=4$. Qisqartirgach $f(x) = \\frac{x+4}{x-3}$. $f(5) = \\frac{5+4}{5-3} = \\frac{9}{2} = 4.5$." },
    { correct: "B", explanation: "Yuzalar nisbati $9:4$ bo'lsa, chiziqli o'lchamlar nisbati $3:2$, hajmlar nisbati esa $3^3 : 2^3 = 27 : 8$ bo'ladi. Jami hajm $27V + 8V = 35V = 350\\pi \\Rightarrow V = 10\\pi$. Kichik konus hajmi $= 8 \\times 10\\pi = 80\\pi$." },
    { correct: "C", explanation: "$g(7) = f^{-1}(7) \\Rightarrow f(y) = 7 \\Rightarrow \\frac{2y+5}{y-3} = 7 \\Rightarrow 2y+5 = 7y - 21 \\Rightarrow 5y = 26 \\Rightarrow y = 5.2$." },
    { correct: "C", explanation: "Jami musbat testlar $= 180 + 30 = 210$. Haqiqiy kasallar $= 180$. Ehtimollik $= \\frac{180}{210} = \\frac{6}{7} \\approx 0.857$." },
    { correct: "B", explanation: "$|x| + |y| \\le 6$ kvadrati 4 ta chorak bo'ylab umumiy yuzi 72 ga teng. $y \\ge 0$ sharti yuqori yarim qismni beradi (uchburchak), yuzi $= \\frac{1}{2} \\times 12 \\times 6 = 36$." },
    { correct: "D", explanation: "Uch $(10, 100) \\Rightarrow y = a(x-10)^2 + 100$. $(0, 36)$ nuqtadan $36 = 100a + 100 \\Rightarrow a = -0.64$. $y=0$ da $-0.64(x-10)^2 + 100 = 0 \\Rightarrow (x-10)^2 = 156.25 \\Rightarrow x-10 = 12.5 \\Rightarrow d = 22.5$." },
    { correct: "B", explanation: "To'g'ri chiziq $3x - 4y + 4c = 0$. Markaz $(0,0)$ dan aylanagacha masofa radius 5 ga teng: $\\frac{|4c|}{\\sqrt{3^2 + (-4)^2}} = 5 \\Rightarrow \\frac{|4c|}{5} = 5 \\Rightarrow |4c| = 25 \\Rightarrow c = 6.25$." },
    { correct: "B", explanation: "75% yemirilish (25% qolishi) 2 ta yarim yemirilish davridir: $2h = 48 \\Rightarrow h = 24$ yil. 12.5% qolishi $\\left(\\frac{1}{2}\\right)^3$ ya'ni 3 ta yarim davr: $3 \\times 24 = 72$ yil." },
    { correct: "A", explanation: "$(x-3)^2 + 16 = 0 \\Rightarrow x = 3 \\pm 4i$. $b > 0$ bo'lgani uchun $z = 3 + 4i \\Rightarrow a = 3, b = 4$. Natijada $a^2 - b^2 = 3^2 - 4^2 = 9 - 16 = -7$." },
    { correct: "C", explanation: "Kosinuslar teoremasi: $AC^2 = 7^2 + 8^2 - 2(7)(8)\\left(\\frac{1}{7}\\right) = 49 + 64 - 16 = 97 \\Rightarrow AC = \\sqrt{97}$." },
    { correct: "C", explanation: "Proporsiya koeffitsientlari teng bo'lishi kerak: $\\frac{k+1}{2} = \\frac{6}{k-3} = \\frac{18}{6} = 3$. Birinchi tenglikdan $k+1 = 6 \\Rightarrow k = 5$. Ikkinchi tenglikni tekshiramiz: $\\frac{6}{5-3} = 3$. Mos tushdi!" },
    { correct: "B", explanation: "A tezligi $= 1/6$, B tezligi $= 1/9$. Birgalikdagi tezlik $= 5/18$. 2 soatda $2 \\times 5/18 = 5/9$ qismi bajarildi. Qolgan $4/9$ qismni B nasos $\\frac{4/9}{1/9} = 4$ soatda tugatadi. Jami vaqt $= 2 + 4 = 6.0$ soat." },
    { correct: "A", explanation: "Oltiburchak yuzi $= 6 \\times \\frac{\\sqrt{3}}{4} \\times 6^2 = 54\\sqrt{3}$. Ichki doira radiusi (apotema) $r = 6 \\frac{\\sqrt{3}}{2} = 3\\sqrt{3}$. Doira yuzi $= \\pi (3\\sqrt{3})^2 = 27\\pi$. Ayirma $= 54\\sqrt{3} - 27\\pi$." },
    { correct: "A", explanation: "Hosilasi $f'(x) = 3(x+1)(x-3) = 3x^2 - 6x - 9$. Boshlang'ich funksiya $f(x) = x^3 - 3x^2 - 9x + r$. $f(0) = 8 \\Rightarrow r = 8$. $f(2) = 2^3 - 3(4) - 9(2) + 8 = 8 - 12 - 18 + 8 = -14$." }
  ]
};

const set2 = {
  setNum: 2,
  questions: [
    {
      domain: "Advanced Math — Ko'rsatkichli Modellashtirish",
      text: "Aholi sonining ko'payishi $A(t) = 3000 \\cdot (1.728)^{t/3}$ tenglama bilan ifodalanadi. Har bir vaqt birligida (t) aholi soni necha foizga ortadi?",
      options: { A: "12%", B: "20%", C: "28%", D: "36%" }
    },
    {
      domain: "Geometry — Doira Yuzi",
      text: "Aylana tenglamasi $x^2 + y^2 + 10x - 12y + 45 = 0$ ko'rinishida berilgan. Ushbu aylana bilan chegaralangan doiraning yuzini toping.",
      options: { A: "$9\\pi$", B: "$16\\pi$", C: "$25\\pi$", D: "$36\\pi$" }
    },
    {
      domain: "Algebra — Chiziqli Tengsizliklar Sohasi",
      text: "$xy$-tekislikda $y \\ge 2x - 4$, $y \\le -x + 5$ va $y \\ge 0$ tengsizliklar sistemasi hosil qilgan uchburchak shaklidagi sohaning yuzini toping.",
      options: { A: "3.0", B: "4.5", C: "6.0", D: "9.0" }
    },
    {
      domain: "Advanced Math — Parabola Surilishi",
      text: "$f(x) = 2(x-3)^2 + 5$ parabola grafigi chapga 4 birlik va pastga 3 birlik surildi hamda yangi $g(x)$ funksiya hosil bo'ldi. $g(2)$ ning qiymatini toping.",
      options: { A: "12", B: "16", C: "20", D: "24" }
    },
    {
      domain: "Advanced Math — Ratsional Funksiyalar",
      text: "$g(x) = \\frac{x^3 - 8}{x^2 - 4}$ funksiyaning $x = 2$ nuqtadagi yo'qotiladigan uzilish (hole) nuqtasidagi limit qiymatini toping.",
      options: { A: "1.5", B: "2.0", C: "3.0", D: "4.0" }
    },
    {
      domain: "Problem Solving — Bayes Ehtimolligi",
      text: "Tibbiy test sezgirligi (sensitivity) 95% va spetsifikligi (specificity) 90% ga teng. Aholi orasida kasallik tarqalishi 2% ni tashkil etadi. Testi musbat chiqqan kishining haqiqatan ham kasal bo'lish ehtimolligi taxminan qanchaga teng?",
      options: { A: "8.5%", B: "16.2%", C: "45.0%", D: "95.0%" }
    },
    {
      domain: "Advanced Math — Ko'phad Ildizlari",
      text: "$P(x) = x^4 - 2x^3 + 5x^2 - 8x + 4$ ko'phadining mavhum (haqiqiy bo'lmagan) ildizlari yig'indisini toping.",
      options: { A: "0", B: "2", C: "4", D: "8" }
    },
    {
      domain: "Geometry — Kub va Shar",
      text: "Hajmi $216 \\text{ sm}^3$ bo'lgan kub ichiga eng katta hajmli shar joylashtirilgan. Ushbu sharning hajmi necha $\\text{sm}^3$ bo'ladi?",
      options: { A: "$18\\pi$", B: "$36\\pi$", C: "$72\\pi$", D: "$144\\pi$" }
    },
    {
      domain: "Algebra — Yechimga Ega Bo'lmagan Sistema",
      text: "Chiziqli tenglamalar sistemasi $4x - 6y = 10$ va $6x - my = 12$ yechimga ega bo'lmasligi uchun $m$ parameter nechaga teng bo'lishi kerak?",
      options: { A: "4", B: "6", C: "9", D: "12" }
    },
    {
      domain: "Trigonometry — Choraklarda Ishoralar",
      text: "Agar $\\theta$ burchak II chorakda joylashgan bo'lib, $\\tan \\theta = -\\frac{3}{4}$ bo'lsa, $\\frac{\\sin \\theta + \\cos \\theta}{\\csc \\theta}$ ifodaning qiymatini toping.",
      options: { A: "-0.12", B: "-0.24", C: "0.12", D: "0.48" }
    },
    {
      domain: "Problem Solving — Standart Og'ish",
      text: "20 ta sonlar to'plamining o'rta arifmetigi 50 ga va standart og'ishi 8 ga teng. Agar ushbu to'plamga har biri 50 ga teng bo'lgan 2 ta yangi son qo'shilsa, yangi to'plamning standart og'ishi haqida qaysi fikr to'g'ri?",
      options: { A: "Standart og'ish o'zgarmaydi", B: "Standart og'ish 8 dan kichik bo'ladi", C: "Standart og'ish 8 dan katta bo me'zonga o'tadi", D: "Standart og'ish aniqlanmaydi" }
    },
    {
      domain: "Advanced Math — Tushum Maksimumi",
      text: "Kompaniyaning daromad funksiyasi $R(p) = (120 - 4p)(p + 10)$ ko'rinishida berilgan, bu yerda $p$ — mahsulot narxi. Maksimal daromad keltiruvchi narx $p$ nechaga teng?",
      options: { A: "$5", B: "$10", C: "$15", D: "$20" }
    },
    {
      domain: "Geometry — Doira Sektori",
      text: "Radiusi 10 sm bo'lgan doirada yoy uzunligi $4\\pi$ sm bo'lgan sektor ajratildi. Ushbu sektorning yuzini toping.",
      options: { A: "$10\\pi$", B: "$20\\pi$", C: "$40\\pi$", D: "$80\\pi$" }
    },
    {
      domain: "Advanced Math — Kompleks Son Moduli",
      text: "Kompleks son $z = \\frac{5 + 12i}{3 - 4i}$ tenglama bilan berilgan. $|z|$ modulining qiymatini toping.",
      options: { A: "1.2", B: "2.6", C: "3.4", D: "5.0" }
    },
    {
      domain: "Advanced Math — Teskari Funksiya Formulasi",
      text: "$f(x) = \\frac{3x - 1}{2x + 5}$ funksiyaning teskari funksiyasi $f^{-1}(x)$ ni toping.",
      options: { A: "$\\frac{5x + 1}{3 - 2x}$", B: "$\\frac{2x + 5}{3x - 1}$", C: "$\\frac{5x - 1}{2x - 3}$", D: "$\\frac{3x + 1}{5 - 2x}$" }
    },
    {
      domain: "Geometry — O'xshash Uchburchaklar Perimetri",
      text: "Koordinatalar tekisligida A uchburchak uchlari $(0,0), (6,0), (0,8)$ nuqtalarda yotadi. B uchburchak A ga o'xshash bo'lib, uning yuzi 96 ga teng. B uchburchakning perimetrini toping.",
      options: { A: "36", B: "48", C: "72", D: "96" }
    },
    {
      domain: "Problem Solving — 3 Kishi Birgalikda Ishlashi",
      text: "A ishchi ishni 4 soatda, B ishchi 6 soatda, C ishchi esa 12 soatda bajara oladi. Uchala ishchi birgalikda ishlasa, ushbu ishni necha soatda tugatishadi?",
      options: { A: "1.5 soat", B: "2.0 soat", C: "2.5 soat", D: "3.0 soat" }
    },
    {
      domain: "Problem Solving — Regressiya Qoldig'i (Residual)",
      text: "Eng yaxshi mos keluvchi to'g'ri chiziq tenglamasi $y = 2.5x + 12$ ko'rinishida. $x = 8$ nuqtada haqiqiy kuzatilgan qiymat $y = 35$ ga teng. Ushbu nuqta uchun qoldiq (residual) qiymati nechaga teng?",
      options: { A: "-3", B: "+3", C: "-2.5", D: "+2.5" }
    },
    {
      domain: "Advanced Math — Ikki Baravar Ortish Vaqti",
      text: "Modda ko'payishi $P(t) = 400 \\cdot (1.25)^{t/5}$ formula bilan berilgan. Miqdorning 2 baravar ortishi uchun taxminan necha yil kerak bo'ladi? ($\\ln 2 \\approx 0.693, \\ln 1.25 \\approx 0.223$)",
      options: { A: "11.2 yil", B: "15.5 yil", C: "18.4 yil", D: "22.1 yil" }
    },
    {
      domain: "Advanced Math — Ko'phad Grafigi Kesishmalari",
      text: "$f(x) = (x-1)^2(x+3)(x-4)$ funksiya grafigining $y$-o'qini kesib o'tuvchi nuqtasi koordinatasini toping.",
      options: { A: "-12", B: "-6", C: "6", D: "12" }
    }
  ],
  answers: [
    { correct: "B", explanation: "$(1.728)^{t/3} = ((1.2)^3)^{t/3} = (1.20)^t$. Asos $1.20 = 1 + 0.20$, demak har bir vaqt birligida 20% ga ortadi." },
    { correct: "B", explanation: "To'liq kvadratga keltiramiz: $(x+5)^2 - 25 + (y-6)^2 - 36 + 45 = 0 \\Rightarrow (x+5)^2 + (y-6)^2 = 16$. Radius $R = 4$. Yuz $= \\pi R^2 = 16\\pi$." },
    { correct: "A", explanation: "Kesishish uchlari: $(2,0)$, $(5,0)$ va $2x-4 = -x+5 \\Rightarrow 3x=9 \\Rightarrow x=3, y=2$. Asosi $5-2 = 3$, balandligi $2$. Yuzi $= \\frac{1}{2} \\times 3 \\times 2 = 3.0$." },
    { correct: "C", explanation: "Surilgach $g(x) = 2(x - 3 + 4)^2 + (5 - 3) = 2(x+1)^2 + 2$. $g(2) = 2(2+1)^2 + 2 = 2(9) + 2 = 20$." },
    { correct: "C", explanation: "$g(x) = \\frac{(x-2)(x^2+2x+4)}{(x-2)(x+2)} = \\frac{x^2+2x+4}{x+2}$. Limit $x \\to 2$: $\\frac{4+4+4}{2+2} = \\frac{12}{4} = 3.0$." },
    { correct: "B", explanation: "Kasallar ulushi $= 0.02 \\times 0.95 = 0.019$. Kasal bo'lmagan lekin test musbatlar $= 0.98 \\times (1 - 0.90) = 0.098$. Ehtimollik $= \\frac{0.019}{0.019 + 0.098} = \\frac{0.019}{0.117} \\approx 16.2\\%$." },
    { correct: "B", explanation: "$P(1) = 0, P(2) = 0$. Bo'lganda $x^2 - 2x + 1$ va qolgan faktor $x^2 + 4 = 0 \\Rightarrow x = \\pm 2i$. Mavhum ildizlar yig'indisi $= 2i + (-2i) = 0$. Viyet bo'yicha haqiqiy ildizlar 1 va 1, barcha ildizlar yig'indisi 2. Mavhum ildizlar ko'paytmasi 4." },
    { correct: "B", explanation: "Kub qirrasi $a = \\sqrt[3]{216} = 6$ sm. Shar radiusi $R = 3$ sm. Shar hajmi $= \\frac{4}{3}\\pi (3^3) = 36\\pi \\text{ sm}^3$." },
    { correct: "C", explanation: "Burchak koeffitsientlari teng va ozod hadlar proporsional emas: $\\frac{4}{6} = \\frac{6}{m} \\Rightarrow 4m = 36 \\Rightarrow m = 9$." },
    { correct: "A", explanation: "II chorakda $\\sin \\theta = 3/5, \\cos \\theta = -4/5$. $\\csc \\theta = 5/3$. Nominator $= 3/5 - 4/5 = -1/5$. Ifoda $= \\frac{-1/5}{5/3} = -3/25 = -0.12$." },
    { correct: "B", explanation: "O'rtacha qiymatga teng bo'lgan yangi elementlar qo'shilsa, ma'lumotlar o'rtacha qiymat atrofida zichlashadi, natijada standart og'ish kamayadi (8 dan kichik bo'ladi)." },
    { correct: "B", explanation: "$R(p) = -4p^2 + 80p + 1200$. Parabola uchi $p = -\\frac{b}{2a} = -\\frac{80}{2(-4)} = 10$. Demak narx $10 bo'lishi kerak." },
    { correct: "B", explanation: "Sektor yuzi $= \\frac{1}{2} L r = \\frac{1}{2} (4\\pi)(10) = 20\\pi \\text{ sm}^2$." },
    { correct: "B", explanation: "$|z| = \\frac{|5+12i|}{|3-4i|} = \\frac{\\sqrt{5^2+12^2}}{\\sqrt{3^2+(-4)^2}} = \\frac{13}{5} = 2.6$." },
    { correct: "A", explanation: "$y = \\frac{3x-1}{2x+5} \\Rightarrow y(2x+5) = 3x-1 \\Rightarrow x(2y-3) = -5y-1 \\Rightarrow x = \\frac{5y+1}{3-2y}$. Demak $f^{-1}(x) = \\frac{5x+1}{3-2x}$." },
    { correct: "B", explanation: "A uchburchak gipotenuzasi 10, perimetri $6+8+10 = 24$, yuzi $= \\frac{1}{2}(6)(8) = 24$. Yuzlar nisbati $\\frac{96}{24} = 4 \\Rightarrow$ chiziqli nisbat $k = \\sqrt{4} = 2$. B perimetri $= 24 \\times 2 = 48$." },
    { correct: "B", explanation: "Birgalikdagi unumdorlik $= \\frac{1}{4} + \\frac{1}{6} + \\frac{1}{12} = \\frac{3+2+1}{12} = \\frac{6}{12} = \\frac{1}{2}$. Vaqt $= 2.0$ soat." },
    { correct: "B", explanation: "Bashorat qilingan $y = 2.5(8) + 12 = 32$. Qoldiq $= y_{\\text{haqiqiy}} - y_{\\text{bashorat}} = 35 - 32 = +3$." },
    { correct: "B", explanation: "$(1.25)^{t/5} = 2 \\Rightarrow \\frac{t}{5} \\ln(1.25) = \\ln(2) \\Rightarrow \\frac{t}{5} (0.223) = 0.693 \\Rightarrow t \\approx 5 \\times 3.107 = 15.53$ yil." },
    { correct: "A", explanation: "$y$-o'qini kesish nuqtasida $x=0$: $f(0) = (0-1)^2(0+3)(0-4) = (1)(3)(-4) = -12$." }
  ]
};

const set3 = {
  setNum: 3,
  questions: [
    {
      domain: "Advanced Math — Kompleks Ildizlar Kvadratlari",
      text: "$x^2 - 4x + 13 = 0$ kvadrat tenglamaning kompleks ildizlari $x_1$ va $x_2$ bo'lsa, $x_1^2 + x_2^2$ ning qiymatini toping.",
      options: { A: "-10", B: "10", C: "26", D: "-26" }
    },
    {
      domain: "Geometry — Koordinatalar O'qlariga Urinuvchi Doira",
      text: "Aylana koordinatalar tekisligining II choragida har ikkala koordinata o'qiga urinadi va $(-2, 9)$ nuqtadan o'tadi. Ushbu shartni qanoatlantiruvchi kichikroq aylananing radiusini toping.",
      options: { A: "3", B: "5", C: "8", D: "17" }
    },
    {
      domain: "Algebra — Tenglik Modullari",
      text: "$|3x - 7| = |x + 5|$ tenglamaning barcha ildizlari yig'indisini toping.",
      options: { A: "5.5", B: "6.5", C: "7.0", D: "8.5" }
    },
    {
      domain: "Geometry — Parabola va To'g'ri Chiziq Kesishmasi",
      text: "$y = x^2 - 4$ parabola va $y = 2x + 4$ to'g'ri chiziq kesishgan nuqtalar orasidagi masofani toping.",
      options: { A: "$4\\sqrt{5}$", B: "$6\\sqrt{5}$", C: "10", D: "12" }
    },
    {
      domain: "Problem Solving — Murakkab Foiz",
      text: "$5,000 miqdoridagi sarmoya yillik 8% stavka bo'yicha har chorakda marta foiz qo'shib boriladi. 3 yildan keyin jami qancha foizli daromad olinadi?",
      options: { A: "$1,200.00", B: "$1,341.21", C: "$1,450.50", D: "$1,600.00" }
    },
    {
      domain: "Problem Solving — Asimmetrik Taqsimot",
      text: "Shahardagi daromadlar taqsimotining o'rta arifmetigi $65,000 va medianasi $48,000 ni tashkil etadi. Agar shaharga bir necha o'ta boy milliarderlar ko'chib kelsa, ushbu ko'rsatkichlar qanday o'zgaradi?",
      options: { A: "O'rta arifmetik sezilarli oshadi, mediana deyarli o'zgarmaydi", B: "Mediana sezilarli oshadi, o'rta arifmetik o'zgarmaydi", C: "Ikkala ko'rsatkich ham teng miqdorda oshadi", D: "Ikkala ko'rsatkich ham kamayadi" }
    },
    {
      domain: "Trigonometry — Trigonometrik Ayniyat",
      text: "Agar $\\sin \\theta + \\cos \\theta = \\frac{7}{5}$ bo'lsa, $\\sin(2\\theta)$ ning qiymatini toping.",
      options: { A: "0.48", B: "0.72", C: "0.96", D: "1.20" }
    },
    {
      domain: "Geometry — Kesik Konus Hajmi",
      text: "Kesik konusning pastki asos radiusi 6 sm, yuqori asos radiusi 3 sm va balandligi 4 sm ga teng. Kesik konus hajmini toping.",
      options: { A: "$54\\pi$", B: "$72\\pi$", C: "$84\\pi$", D: "$108\\pi$" }
    },
    {
      domain: "Algebra — Parametrli Sistema",
      text: "$\\begin{cases} ax + 3y = 9 \\\\ 4x + by = 18 \\end{cases}$ tenglamalar sistemasi cheksiz ko'p yechimga ega bo'lsa, $a \\cdot b$ ko'paytmaning qiymati nechaga teng?",
      options: { A: "6", B: "12", C: "18", D: "24" }
    },
    {
      domain: "Advanced Math — Ko'phad Bo me me'zonlari",
      text: "$P(x) = x^4 + k x^2 + 16$ ko'phad $(x^2 - 4)$ ga qoldiqsiz bo'linsa, $k$ o'zgarmas sonining qiymatini toping.",
      options: { A: "-8", B: "-4", C: "4", D: "8" }
    },
    {
      domain: "Problem Solving — Shartli Ehtimollik Tanlanmasi",
      text: "120 nafar talabadan 70 nafari Matematika, 50 nafari Fizika va 20 nafari ikkala fanni ham o'rganadi. Fizika o'rganayotgan talabalar orasidan tasodifiy tanlanganning Matematikani ham o'rganish ehtimolligi qancha?",
      options: { A: "0.25", B: "0.40", C: "0.50", D: "0.70" }
    },
    {
      domain: "Geometry — Nuqtadan To'g'ri Chiziqqacha Masofa",
      text: "$(4, -2)$ nuqtadan $3x - 4y + 5 = 0$ to'g'ri chiziqqacha bo'lgan masofani toping.",
      options: { A: "3", B: "4", C: "5", D: "7" }
    },
    {
      domain: "Advanced Math — Funksiya Almashtirishlari",
      text: "Agar $f(x)$ funksiya grafigidagi nuqta $(2, 8)$ bo'lsa, $g(x) = -3f(2x - 4) + 5$ funksiya grafigidagi mos nuqta koordinatalarini toping.",
      options: { A: "$(3, -19)$", B: "$(0, -19)$", C: "$(4, -24)$", D: "$(3, 29)$" }
    },
    {
      domain: "Algebra — Ratsional Tengsizlik",
      text: "$\\frac{2x + 1}{x - 3} \\le 1$ tengsizlikni qanoatlantiruvchi butun $x$ yechimlar soni nechta?",
      options: { A: "5", B: "6", C: "7", D: "8" }
    },
    {
      domain: "Geometry — To'g'ri Burchakli Uchburchak Balandligi",
      text: "To'g'ri burchakli uchburchakning gipotenuzasiga tushirilgan balandlik gipotenuzani 9 sm va 16 sm li kesmalarga ajratadi. Ushbu balandlikning uzunligini toping.",
      options: { A: "10 sm", B: "12 sm", C: "14 sm", D: "15 sm" }
    },
    {
      domain: "Problem Solving — Yillik O'sish Sur'ati",
      text: "Modellashtirish funksiyasi $f(t) = 800 (1.15)^{t/2}$ ko'rinishida. Har bir 1 yildagi foizli o'sish sur'ati taxminan qanchaga teng?",
      options: { A: "7.24%", B: "15.00%", C: "32.25%", D: "7.50%" }
    },
    {
      domain: "Geometry — Sektor Yuzi va Yoy Uzunligi",
      text: "Radiusi 12 sm bo'lgan doirada yoy uzunligi $8\\pi$ sm ga teng bo'lgan sektor yuzini toping.",
      options: { A: "$24\\pi$", B: "$48\\pi$", C: "$96\\pi$", D: "$144\\pi$" }
    },
    {
      domain: "Advanced Math — Kompleks Daraja",
      text: "$(1 + i)^8$ ifodaning qiymatini toping, bu yerda $i = \\sqrt{-1}$.",
      options: { A: "8", B: "16", C: "16i", D: "32" }
    },
    {
      domain: "Problem Solving — Aralashma Masalasi",
      text: "15% li kislota eritmasidan 20 litr bor. Uni 40% li eritma bilan aralashtirib 25% li eritma hosil qilish uchun necha litr 40% li eritma qo'shish kerak?",
      options: { A: "10.0 litr", B: "13.3 litr", C: "15.0 litr", D: "16.7 litr" }
    },
    {
      domain: "Advanced Math — Burilish Nuqtasi (Inflection)",
      text: "$f(x) = x^3 - 6x^2 + 9x + 4$ funksiya botiqlik o'zgaradigan (inflection point) nuqtasining koordinatalarini toping.",
      options: { A: "$(1, 8)$", B: "$(2, 6)$", C: "$(3, 4)$", D: "$(0, 4)$" }
    }
  ],
  answers: [
    { correct: "A", explanation: "Viyet teoremasi: $x_1 + x_2 = 4, x_1 x_2 = 13$. $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2 = 4^2 - 2(13) = 16 - 26 = -10$." },
    { correct: "B", explanation: "II chorakda markaz $(-r, r)$, tenglama $(x+r)^2 + (y-r)^2 = r^2$. $(-2, 9)$ ni qo'yib: $(-2+r)^2 + (9-r)^2 = r^2 \\Rightarrow r^2 - 22r + 85 = 0 \\Rightarrow (r-5)(r-17) = 0$. Kichik radius $r = 5$." },
    { correct: "B", explanation: "1) $3x-7 = x+5 \\Rightarrow 2x = 12 \\Rightarrow x = 6$. 2) $3x-7 = -(x+5) \\Rightarrow 4x = 2 \\Rightarrow x = 0.5$. Yig'indi $= 6 + 0.5 = 6.5$." },
    { correct: "B", explanation: "Tenglashtiramiz: $x^2 - 2x - 8 = 0 \\Rightarrow (x-4)(x+2) = 0 \\Rightarrow x_1 = 4, y_1 = 12$; $x_2 = -2, y_2 = 0$. Masofa $= \\sqrt{(4-(-2))^2 + (12-0)^2} = \\sqrt{36 + 144} = \\sqrt{180} = 6\\sqrt{5}$." },
    { correct: "B", explanation: "$A = 5000 \\left(1 + \\frac{0.08}{4}\\right)^{3 \\times 4} = 5000(1.02)^{12} \\approx 5000(1.268241) = 6341.21$. Daromad $= 6341.21 - 5000 = 1341.21$." },
    { correct: "A", explanation: "Milliarderlar o'ta yuqori daromad keltirgani uchun o'rta arifmetik o'ngga surilib oshadi, lekin mediana (o'rtadagi odam daromadi) deyarli o'zgarmaydi." },
    { correct: "C", explanation: "Ikkala tomonni kvadratga ko'taramiz: $\\sin^2\\theta + 2\\sin\\theta\\cos\\theta + \\cos^2\\theta = \\frac{49}{25} \\Rightarrow 1 + \\sin(2\\theta) = \\frac{49}{25} \\Rightarrow \\sin(2\\theta) = \\frac{24}{25} = 0.96$." },
    { correct: "C", explanation: "Hajm $= \\frac{1}{3}\\pi h (R^2 + Rr + r^2) = \\frac{1}{3}\\pi (4)(36 + 18 + 9) = \\frac{4\\pi}{3}(63) = 84\\pi$." },
    { correct: "B", explanation: "Koeffitsientlar proporsional bo'lishi kerak: $\\frac{a}{4} = \\frac{3}{b} = \\frac{9}{18} = \\frac{1}{2}$. Demak $a = 2, b = 6 \\Rightarrow a \\cdot b = 12$." },
    { correct: "A", explanation: "$x^2 - 4 = 0 \\Rightarrow x = \\pm 2$. $P(2) = 0 \\Rightarrow 2^4 + k(2^2) + 16 = 0 \\Rightarrow 16 + 4k + 16 = 0 \\Rightarrow 4k = -32 \\Rightarrow k = -8$." },
    { correct: "B", explanation: "Fizika o'rganuvchilar $N(F) = 50$. Ikkala fanni o'rganuvchilar $N(M \\cap F) = 20$. Ehtimollik $= \\frac{20}{50} = 0.40$." },
    { correct: "C", explanation: "$d = \\frac{|3(4) - 4(-2) + 5|}{\\sqrt{3^2 + (-4)^2}} = \\frac{|12 + 8 + 5|}{5} = \\frac{25}{5} = 5$." },
    { correct: "A", explanation: "$2x - 4 = 2 \\Rightarrow 2x = 6 \\Rightarrow x = 3$. $y = -3(8) + 5 = -24 + 5 = -19$. Yangi nuqta $(3, -19)$." },
    { correct: "C", explanation: "$\\frac{2x+1 - (x-3)}{x-3} \\le 0 \\Rightarrow \\frac{x+4}{x-3} \\le 0$. Intervallar usuli: $-4 \\le x < 3$. Butun yechimlar: $-4, -3, -2, -1, 0, 1, 2$ (jami 7 ta)." },
    { correct: "B", explanation: "Balandlik $h = \\sqrt{p \\cdot q} = \\sqrt{9 \\times 16} = \\sqrt{144} = 12$ sm." },
    { correct: "A", explanation: "$(1.15)^{t/2} = ((1.15)^{1/2})^t = (\\sqrt{1.15})^t \\approx (1.07238)^t$. Yillik o'sish $= 7.24\\%$." },
    { correct: "B", explanation: "Sektor yuzi $= \\frac{1}{2} L r = \\frac{1}{2} (8\\pi)(12) = 48\\pi$ sm$^2$." },
    { correct: "B", explanation: "$(1+i)^2 = 1 + 2i - 1 = 2i$. Natijada $((1+i)^2)^4 = (2i)^4 = 16 i^4 = 16$." },
    { correct: "B", explanation: "$0.15(20) + 0.40x = 0.25(20 + x) \\Rightarrow 3 + 0.40x = 5 + 0.25x \\Rightarrow 0.15x = 2 \\Rightarrow x = \\frac{40}{3} \\approx 13.33$ litr." },
    { correct: "B", explanation: "$f''(x) = 6x - 12 = 0 \\Rightarrow x = 2$. $f(2) = 2^3 - 6(4) + 9(2) + 4 = 8 - 24 + 18 + 4 = 6$. Nuqta $(2, 6)$." }
  ]
};

const set4 = {
  setNum: 4,
  questions: [
    {
      domain: "Algebra — 3 O'zgaruvchili Tenglamalar Nisbati",
      text: "Musbat $x, y, z$ sonlar uchun $x + y + z = 175$ tenglik o'rinli. Agar $x : y = 2 : 3$ va $y : z = 4 : 5$ bo'lsa, $z$ ning qiymatini toping.",
      options: { A: "40", B: "60", C: "75", D: "90" }
    },
    {
      domain: "Geometry — Doira Vatari Uzunligi",
      text: "Aylana tenglamasi $(x-2)^2 + (y+3)^2 = 25$ ko'rinishida berilgan. Aylana markazidan 3 birlik masofada joylashgan vatar uzunligini toping.",
      options: { A: "6", B: "8", C: "10", D: "12" }
    },
    {
      domain: "Algebra — Viyet Teoremasi Kvadratlari",
      text: "$2x^2 - 8x + 5 = 0$ tenglamaning ildizlari $r_1$ va $r_2$ bo'lsa, $r_1^2 + r_2^2$ ning qiymatini toping.",
      options: { A: "11", B: "14", C: "16", D: "21" }
    },
    {
      domain: "Advanced Math — Ko'rsatkichli Tenglama",
      text: "$2^{2x} - 10 \\cdot 2^x + 16 = 0$ tenglamaning barcha haqiqiy ildizlari yig'indisini toping.",
      options: { A: "3", B: "4", C: "5", D: "8" }
    },
    {
      domain: "Advanced Math — Qiya Asimptota",
      text: "$f(x) = \\frac{3x^2 - 5x + 2}{x - 2}$ funksiyaning qiya asimptotasi (slant asymptote) tenglamasini ko'rsating.",
      options: { A: "$y = 3x - 1$", B: "$y = 3x + 1$", C: "$y = 3x + 5$", D: "$y = 3x$" }
    },
    {
      domain: "Problem Solving — Ishonchlilik Oralig'i Kengligi",
      text: "Statistik tadqiqotda tanlanma hajmi $N$ dan $4N$ ga 4 baravar oshirildi. Ishonchlilik oralig'ining kengligi (margin of error) qanday o'zgaradi?",
      options: { A: "2 baravar torayadi (50% ga kamayadi)", B: "4 baravar torayadi", C: "O'zgarmaydi", D: "2 baravar kengayadi" }
    },
    {
      domain: "Trigonometry — Ikki Baravar Burchak Kosinusi",
      text: "To'g'ri burchakli uchburchakning katetlari 3 sm va 4 sm ga teng. Kichik katet qarshisidagi $\\theta$ burchak uchun $\\cos(2\\theta)$ ning qiymatini toping.",
      options: { A: "0.28", B: "0.56", C: "0.96", D: "0.14" }
    },
    {
      domain: "Geometry — Aylanaga Ichki Chizilgan To'rtburchak",
      text: "Aylanaga ichki chizilgan to'rtburchakning qarama-qarshi burchaklari $\\angle A = 3x + 15^\\circ$ va $\\angle C = 2x + 40^\\circ$ ga teng. $\\angle A$ burchakning daraja o'lchovini toping.",
      options: { A: "75°", B: "90°", C: "105°", D: "120°" }
    },
    {
      domain: "Algebra — Chegaralangan Trapetsiya Yuzi",
      text: "$xy$-tekislikda $x = 0$, $y = 0$, $x = 4$ va $y = -0.5x + 5$ to'g'ri chiziqlar bilan chegaralangan trapetsiya shaklidagi sohaning yuzini toping.",
      options: { A: "12", B: "16", C: "18", D: "20" }
    },
    {
      domain: "Advanced Math — Sintetik Bo me Qoldig'i",
      text: "$P(x) = 3x^3 - 4x^2 + k x - 10$ ko'phad $(x - 2)$ ga bo'linganda qoldiq 12 ga teng bo'ladi. $k$ ning qiymatini toping.",
      options: { A: "5", B: "7", C: "9", D: "11" }
    },
    {
      domain: "Problem Solving — Qaytarilmas Tanlanma Ehtimolligi",
      text: "Xaltachada 5 ta qizil, 4 ta ko'k va 3 ta yashil shar bor. Qaytarilmasdan tasodifiy 2 ta shar olindi. Ikkala sharning ham ko'k bo'lish ehtimolligini toping.",
      options: { A: "$\\frac{1}{11}$", B: "$\\frac{1}{9}$", C: "$\\frac{4}{33}$", D: "$\\frac{2}{11}$" }
    },
    {
      domain: "Geometry — Simmetrik Nuqta Masofasi",
      text: "$(5, -2)$ nuqtaning $y = x$ to'g'ri chiziqqa nisbatan simmetrik akslangan nuqtasi bilan dastlabki nuqta orasidagi masofani toping.",
      options: { A: "$7$", B: "$7\\sqrt{2}$", C: "14", D: "$10$" }
    },
    {
      domain: "Advanced Math — Teskari Funksiya Aniqlanish Sohasi",
      text: "$f(x) = \\sqrt{2x - 6} + 4$ ($x \\ge 3$) funksiyaning teskari funksiyasi $f^{-1}(x)$ ning aniqlanish sohasini ko'rsating.",
      options: { A: "$[0, \\infty)$", B: "$[3, \\infty)$", C: "$[4, \\infty)$", D: "$(-\\infty, \\infty)$" }
    },
    {
      domain: "Algebra — Irratsional Tenglama",
      text: "$\\sqrt{3x + 1} - x = -3$ tenglamaning haqiqiy ildizlari sonini toping.",
      options: { A: "0 ta", B: "1 ta", C: "2 ta", D: "3 ta" }
    },
    {
      domain: "Geometry — Piramidalar Hajmi Nisbati",
      text: "Ikkita o'xshash kvadratik piramidalarning sirt maydonlari nisbati $16 : 25$ ga teng. Agar kichik piramida hajmi $128 \\text{ sm}^3$ bo'lsa, katta piramida hajmini toping.",
      options: { A: "$200 \\text{ sm}^3$", B: "$250 \\text{ sm}^3$", C: "$320 \\text{ sm}^3$", D: "$400 \\text{ sm}^3$" }
    },
    {
      domain: "Problem Solving — Modellar O'sish Sur'ati Farqi",
      text: "A model $P_A(t) = 100(1.05)^t$ va B model $P_B(t) = 100(1.02)^{2t}$ tenglamalar bilan berilgan. A modelning yillik foizli o'sish sur'ati B modelnikidan qanchaga ko'p?",
      options: { A: "0.96%", B: "1.00%", C: "1.04%", D: "3.00%" }
    },
    {
      domain: "Geometry — Tashqi Chizilgan Doira Yuzi",
      text: "Katetlari 10 sm va 24 sm bo'lgan to'g'ri burchakli uchburchakka tashqi chizilgan doira yuzini toping.",
      options: { A: "$100\\pi$", B: "$144\\pi$", C: "$169\\pi$", D: "$676\\pi$" }
    },
    {
      domain: "Advanced Math — Kompleks Ildizlar Masofasi",
      text: "$z^2 - 6z + 25 = 0$ tenglama ildizlari orasidagi masofani kompleks tekislikda toping.",
      options: { A: "6", B: "8", C: "10", D: "12" }
    },
    {
      domain: "Problem Solving — Qayiq va Oqim Tezligi",
      text: "Qayiq oqimga qarshi 36 mil masofani 4 soatda, oqim bo'ylab esa 36 milni 2 soatda suzib o'tdi. Qayiqning tinch suvdagi tezligini toping.",
      options: { A: "12.0 mil/soat", B: "13.5 mil/soat", C: "15.0 mil/soat", D: "18.0 mil/soat" }
    },
    {
      domain: "Advanced Math — Ekstremum Nuqtalar Soni",
      text: "$f(x) = 3x^4 - 4x^3 - 12x^2 + 5$ funksiya nechta lokal ekstremum (minimum va maksimum) nuqtalariga ega?",
      options: { A: "1 ta", B: "2 ta", C: "3 ta", D: "4 ta" }
    }
  ],
  answers: [
    { correct: "C", explanation: "$x:y = 8:12$ va $y:z = 12:15 \\Rightarrow x:y:z = 8:12:15$. Jami qismlar $= 8+12+15 = 35$. Har bir qism $= 175/35 = 5$. Demak $z = 15 \\times 5 = 75$." },
    { correct: "B", explanation: "Pifagor teoremasi: Vatar yarmi $= \\sqrt{R^2 - d^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4$. Vatar to'liq uzunligi $= 2 \\times 4 = 8$." },
    { correct: "A", explanation: "Viyet teoremasi: $r_1 + r_2 = 4, r_1 r_2 = 2.5$. $r_1^2 + r_2^2 = (r_1+r_2)^2 - 2 r_1 r_2 = 4^2 - 2(2.5) = 16 - 5 = 11$." },
    { correct: "B", explanation: "$u = 2^x \\Rightarrow u^2 - 10u + 16 = 0 \\Rightarrow (u-2)(u-8) = 0$. $2^x = 2 \\Rightarrow x_1 = 1$; $2^x = 8 \\Rightarrow x_2 = 3$. Yig'indi $= 1 + 3 = 4$." },
    { correct: "B", explanation: "Ko'phadni bo'lamiz: $(3x^2 - 5x + 2) : (x-2) = 3x + 1$ va qoldiq 4. Qiya asimptota $y = 3x + 1$." },
    { correct: "A", explanation: "Xatolik chegarasi $\\frac{1}{\\sqrt{N}}$ ga bog'liq. $N$ 4 baravar oshsa, xatolik $\\sqrt{4} = 2$ baravar torayadi (50% ga kamayadi)." },
    { correct: "A", explanation: "Gipotenuza $= 5$. $\\sin \\theta = 3/5, \\cos \\theta = 4/5$. $\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = \\frac{16}{25} - \\frac{9}{25} = \\frac{7}{25} = 0.28$." },
    { correct: "B", explanation: "Qarama-qarshi burchaklar yig'indisi $180^\\circ$: $3x+15 + 2x+40 = 180 \\Rightarrow 5x + 55 = 180 \\Rightarrow 5x = 125 \\Rightarrow x = 25^\\circ$. $\\angle A = 3(25) + 15 = 90^\\circ$." },
    { correct: "B", explanation: "Trapetsiya asoslari $y(0) = 5$ va $y(4) = -2 + 5 = 3$, balandlik $h = 4$. Yuzi $= \\frac{5 + 3}{2} \\times 4 = 16$." },
    { correct: "B", explanation: "$P(2) = 12 \\Rightarrow 3(8) - 4(4) + 2k - 10 = 12 \\Rightarrow 24 - 16 + 2k - 10 = 12 \\Rightarrow 2k - 2 = 12 \\Rightarrow 2k = 14 \\Rightarrow k = 7$." },
    { correct: "A", explanation: "Jami 12 shar. Birinchi ko'k $= 4/12 = 1/3$, ikkinchi ko'k $= 3/11$. Ehtimollik $= \\frac{1}{3} \\times \\frac{3}{11} = \\frac{1}{11}$." },
    { correct: "B", explanation: "$y=x$ ga nisbatan akslanish $(-2, 5)$ nuqta beradi. Masofa $= \\sqrt{(5-(-2))^2 + (-2-5)^2} = \\sqrt{49 + 49} = \\sqrt{98} = 7\\sqrt{2}$." },
    { correct: "C", explanation: "$f(x)$ funksiya qiymatlar sohasi $y \\ge 4$ bo'lgani uchun, uning teskarisi $f^{-1}(x)$ aniqlanish sohasi $[4, \\infty)$ bo'ladi." },
    { correct: "B", explanation: "$\\sqrt{3x+1} = x-3 \\Rightarrow 3x+1 = (x-3)^2 = x^2 - 6x + 9 \\Rightarrow x^2 - 9x + 8 = 0 \\Rightarrow (x-1)(x-8) = 0$. $x=1$ tekshirganda $\\sqrt{4} - 1 = 1 \\neq -3$ (yot ildiz). $x=8$ mos keladi. Yagona haqiqiy ildiz!" },
    { correct: "B", explanation: "Yuzlar nisbati $16:25 \\Rightarrow$ chiziqli nisbat $4:5 \\Rightarrow$ hajmlar nisbati $4^3 : 5^3 = 64 : 125$. Katta hajm $= 128 \\times \\frac{125}{64} = 250 \\text{ sm}^3$." },
    { correct: "A", explanation: "A model yillik 5% o'sadi. B model $(1.02)^2 = 1.0404$ ya'ni yillik 4.04% o'sadi. Farq $= 5\\% - 4.04\\% = 0.96\\%$." },
    { correct: "C", explanation: "Gipotenuza $= \\sqrt{10^2 + 24^2} = \\sqrt{676} = 26$ sm. Doira radiusi $R = 26/2 = 13$ sm. Yuz $= \\pi (13^2) = 169\\pi$." },
    { correct: "B", explanation: "$(x-3)^2 = -16 \\Rightarrow z = 3 \\pm 4i$. Nuqtalar $(3, 4)$ va $(3, -4)$. Kompleks tekislikda masofa $= 4 - (-4) = 8$." },
    { correct: "B", explanation: "Oqimga qarshi tezlik $v - c = 36/4 = 9$. Oqim bo'ylab $v + c = 36/2 = 18$. $2v = 27 \\Rightarrow v = 13.5$ mil/soat." },
    { correct: "C", explanation: "$f'(x) = 12x^3 - 12x^2 - 24x = 12x(x^2 - x - 2) = 12x(x-2)(x+1) = 0$. Ildizlar $x = -1, 0, 2$. Ishora 3 marta o'zgaradi $\\Rightarrow$ 3 ta ekstremum nuqtasi!" }
  ]
};

module.exports = { set1, set2, set3, set4 };

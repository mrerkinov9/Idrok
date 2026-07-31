const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'assets', 'physics8');
const visuals = path.join(out, 'visuals');
fs.mkdirSync(visuals, {recursive: true});

const chapters = [
  {title:'Elektr zaryad. Elektr maydon', icon:'charge', accent:'#7857ff'},
  {title:'Elektr toki', icon:'current', accent:'#18a9a1'},
  {title:'Elektr tokining ishi va quvvati', icon:'power', accent:'#ff8a3d'},
  {title:'Turli muhitlarda elektr toki', icon:'electrolysis', accent:'#e94d91'},
  {title:'Magnit maydon', icon:'magnet', accent:'#287ee8'},
];
const chapterEnds = [8, 29, 39, 48, 60];

const r = (number, start, title, formula, unit, definition, key, application) =>
  ({number, start, title, formula, unit, definition, key, application});

const rows = [
  r(1,4,'Jismlarning zaryadlanishi','q = ±Ne','C','Ikki jism ishqalanganda elektronlar bir jismdan ikkinchisiga o‘tadi; elektron olgan jism manfiy, elektron yo‘qotgan jism musbat zaryadlanadi.','Zaryad yangidan yaratilmaydi: u jismlar orasida qayta taqsimlanadi.','Statik elektr, printer, bo‘yoq purkash va chang tutgichlar shu hodisaga asoslanadi.'),
  r(2,9,'Elektr zaryad','q = Ne','C','Elektr zaryad jismlarning elektr va magnit o‘zaro ta’sirini belgilovchi fizik kattalikdir. Proton musbat, elektron manfiy elementar zaryadga ega.','Zaryad diskret: har qanday zaryad elementar zaryadning butun sonli karralisidir.','Elektroskop, ionlash, sensorlar va elektronika zaryad miqdorini boshqarishga tayanadi.'),
  r(3,12,'Zaryadlarning o‘zaro ta’siri. Kulon qonuni','F = k·|q₁q₂|/r²','N','Ikki nuqtaviy zaryad orasidagi kuch zaryadlar ko‘paytmasiga to‘g‘ri, ular orasidagi masofa kvadratiga teskari proporsional.','Bir xil ishorali zaryadlar itaradi, qarama-qarshi ishorali zaryadlar tortadi.','Kulon qonuni atomlar, elektrostatik filtrlar va zaryadlangan zarrachalar harakatini tushuntiradi.'),
  r(4,15,'Masalalar yechish: elektr zaryad va Kulon qonuni','F = k·|q₁q₂|/r²','N','Kulon qonuni masalalarida zaryadlar kulonda, masofa metrda olinadi va kuch yo‘nalishi zaryad ishoralariga qarab belgilanadi.','Masofa ikki marta ortsa, kuch to‘rt marta kamayadi.','Hisoblash elektrostatik qurilmalar xavfsiz masofasini baholashda kerak bo‘ladi.'),
  r(5,18,'Elektr maydon','E = F/q','N/C','Har bir zaryad o‘z atrofida elektr maydon hosil qiladi. Maydonning berilgan nuqtadagi kuchlanganligi shu nuqtadagi musbat sinov zaryadiga ta’sir qiluvchi kuch orqali aniqlanadi.','Elektr maydon kuch chiziqlari musbat zaryaddan chiqib, manfiy zaryadda tugaydi.','Elektr maydon sensor, kondensator va elektron nurli qurilmalarda zaryadlarni boshqaradi.'),
  r(6,22,'O‘tkazgichlarda elektr zaryadlarning taqsimlanishi','Eichki = 0','N/C','Elektrostatik muvozanatda o‘tkazgich ichida elektr maydon nol bo‘ladi, ortiqcha zaryad esa uning tashqi sirtida joylashadi.','Zaryad sirtning egriligi katta, ya’ni uchli joylarda ko‘proq to‘planadi.','Faradey qafasi, chaqmoqqaytargich va ekranlangan kabellar shu xossadan foydalanadi.'),
  r(7,25,'Masalalar yechish: elektr maydon','E = F/q','N/C','Elektr maydon masalalarida kuchlanganlik vektor kattalik bo‘lib, bir nechta zaryad maydoni vektor qo‘shish orqali topiladi.','Sinov zaryadi kichik olinadi, chunki u tekshirilayotgan maydonni o‘zgartirmasligi kerak.','Maydonni hisoblash elektron asboblarda zaryad trayektoriyasini oldindan aytishga yordam beradi.'),
  r(8,27,'Tabiatdagi elektr hodisalar','q = It','C','Chaqmoq bulutlar, havo va Yer orasida katta zaryadlar ajralib, elektr maydon havoni teshib o‘tganda yuz beradigan kuchli razryaddir.','Momaqaldiroq chaqmoq qizdirgan havoning keskin kengayishi natijasida hosil bo‘ladi.','Chaqmoqqaytargich zaryadni xavfsiz yo‘l bilan Yerga o‘tkazadi.'),

  r(9,32,'Elektr toki haqida tushuncha','I = q/t','A','Elektr toki zaryadlangan zarrachalarning tartibli harakatidir. Tok bo‘lishi uchun erkin zaryad tashuvchilar, elektr maydon va yopiq zanjir kerak.','Metallarda tok tashuvchilar elektronlar bo‘lsa-da, tokning shartli yo‘nalishi musbat zaryad harakati yo‘nalishida olinadi.','Elektr toki yoritish, isitish, aloqa va boshqaruv qurilmalariga energiya uzatadi.'),
  r(10,34,'Tok manbalari','ε = Atashqi/q','V','Tok manbai kimyoviy, mexanik, yorug‘lik yoki issiqlik energiyasini elektr energiyaga aylantirib, qutblari orasida potensiallar farqini saqlaydi.','Manba ichida tashqi kuchlar zaryadlarni elektr maydoniga qarshi ko‘chiradi.','Batareya, akkumulyator, generator va quyosh paneli turli energiya manbalaridir.'),
  r(11,39,'Elektr kuchlanish va uni o‘lchash','U = A/q','V','Kuchlanish elektr maydonning birlik zaryadni zanjirning bir nuqtasidan ikkinchisiga ko‘chirishda bajargan ishini ko‘rsatadi.','Voltmetr o‘lchanayotgan iste’molchiga parallel ulanadi va katta ichki qarshilikka ega bo‘ladi.','Kuchlanishni to‘g‘ri o‘lchash elektr qurilmalarini xavfsiz ishlatish uchun zarur.'),
  r(12,42,'Tok kuchi va uni o‘lchash','I = q/t','A','Tok kuchi o‘tkazgich kesimidan vaqt birligida o‘tgan zaryad miqdoriga teng.','Ampermetr zanjirga ketma-ket ulanadi; uni manbaga bevosita ulash mumkin emas.','Tok kuchi sim qizishi, qurilma quvvati va himoya saqlagichini tanlashda muhim.'),
  r(13,45,'Masalalar yechish: tok kuchi va kuchlanish','q = It; A = Uq','C; J','Tok va kuchlanish masalalarida zaryad, vaqt, ish va energiya orasidagi bog‘lanishlar birliklari bilan birga tekshiriladi.','1 amper tok bir sekundda 1 kulon zaryad o‘tishiga mos keladi.','Hisoblash batareya sig‘imi va qurilmaning ishlash vaqtini baholashga yordam beradi.'),
  r(14,46,'Laboratoriya: elektr zanjirni yig‘ish, tok kuchi va kuchlanishni o‘lchash','I = q/t; U = A/q','A; V','Oddiy elektr zanjiri manba, kalit, iste’molchi va ulovchi simlardan tuziladi. Tok kuchi ampermetr, kuchlanish voltmetr bilan o‘lchanadi.','Ampermetr ketma-ket, voltmetr parallel ulanadi; asbob qutblari manba qutblariga mos bo‘lishi kerak.','Bu ko‘nikma elektr sxemalarini yig‘ish va nosozlikni aniqlashning asosidir.'),
  r(15,47,'Elektr qarshilik','R = ρl/S','Ω','Elektr qarshilik o‘tkazgichning tokka ko‘rsatadigan qarshiligidir. U materialning solishtirma qarshiligi va uzunligiga to‘g‘ri, kesim yuziga teskari proporsional.','Uzun va ingichka simning qarshiligi qisqa va yo‘g‘on simnikidan katta.','Qizdirgich, sensor va elektron sxemalarda kerakli tok qarshilik bilan boshqariladi.'),
  r(16,52,'Rezistorlar. Reostatlar. Potensiometrlar','R = ρl/S','Ω','Rezistor zanjirda ma’lum qarshilik hosil qiladi, reostat faol sim uzunligini o‘zgartirib tokni rostlaydi, potensiometr esa kuchlanishni bo‘lib beradi.','Surilgich siljiganda zanjirga ulangan faol o‘tkazgich uzunligi va qarshilik o‘zgaradi.','Ovoz balandligi, yorug‘lik va motor tezligini boshqarishda o‘zgaruvchan qarshiliklar ishlatiladi.'),
  r(17,56,'Zanjirning bir qismi uchun Om qonuni','I = U/R','A','Om qonuniga ko‘ra o‘tkazgichdagi tok kuchi uning uchlaridagi kuchlanishga to‘g‘ri, qarshiligiga teskari proporsional.','Qarshilik o‘zgarmasa, U-I grafigi koordinata boshidan o‘tuvchi to‘g‘ri chiziq bo‘ladi.','Om qonuni deyarli barcha sodda elektr zanjirlarini hisoblashning asosidir.'),
  r(18,60,'Masalalar yechish: Om qonuni','R = U/I','Ω','Om qonuni masalalarida U, I va R kattaliklaridan ikkitasi berilib, uchinchisi formulani almashtirish orqali topiladi.','Milliamper amperga, kiloom omga o‘tkazilgandan keyin hisob bajariladi.','To‘g‘ri hisob qurilma uchun xavfsiz rezistor tanlash imkonini beradi.'),
  r(19,61,'Laboratoriya: Om qonunini o‘rganish','R = U/I','Ω','Tajriba davomida kuchlanish bir necha marta o‘zgartirilib, har safar tok kuchi o‘lchanadi. U/I nisbatining o‘zgarmasligi Om qonunini tasdiqlaydi.','O‘lchov nuqtalari U-I grafigida bitta to‘g‘ri chiziq bo‘ylab joylashishi kerak.','Laboratoriya elektr o‘lchov asboblari bilan ishlash va grafik tahlil ko‘nikmasini rivojlantiradi.'),
  r(20,63,'Amaliy mashg‘ulot: reostat yordamida tok kuchini rostlash','I = U/R','A','Reostatning surilgichi siljiganda faol sim uzunligi va qarshilik o‘zgaradi, natijada zanjirdagi tok kuchi ham o‘zgaradi.','Reostatni ulashdan oldin qarshilikni eng katta holatga qo‘yish asboblarni ortiqcha tokdan himoya qiladi.','Reostat motor tezligi va lampaning yorqinligini silliq boshqarishda qo‘llanadi.'),
  r(21,64,'Iste’molchilarni ketma-ket ulash','R = R₁ + R₂ + ...','Ω','Ketma-ket zanjirda barcha iste’molchilardan bir xil tok o‘tadi, umumiy kuchlanish qismlardagi kuchlanishlar yig‘indisiga teng.','Bitta element uzilsa, butun ketma-ket zanjirda tok to‘xtaydi.','Ketma-ket ulanish kuchlanishni bo‘lish va umumiy qarshilikni oshirishda ishlatiladi.'),
  r(22,67,'Iste’molchilarni parallel ulash','1/R = 1/R₁ + 1/R₂ + ...','Ω','Parallel tarmoqlarning uchlaridagi kuchlanish bir xil, umumiy tok esa tarmoq toklarining yig‘indisiga teng.','Parallel ulanishda har bir iste’molchi boshqalardan mustaqil ishlaydi.','Uy elektr tarmog‘idagi jihozlar parallel ulanadi.'),
  r(23,71,'Amaliy mashg‘ulot: tok manbalarini ulash','εketma = ε₁ + ε₂ + ...','V','Tok manbalari ketma-ket ulanganda kuchlanishlar qo‘shiladi; parallel ulash esa tok berish imkoniyatini oshiradi.','Manbalarni ulashda bir xil tur, kuchlanish va qutblanishga rioya qilish kerak.','Fonar, akkumulyator bloki va zaxira quvvat tizimlarida manbalar guruhlab ulanadi.'),
  r(24,72,'Laboratoriya: o‘tkazgichlarni ketma-ket va parallel ulash','Rketma = ΣR; 1/Rparallel = Σ(1/R)','Ω','Laboratoriyada rezistorlar ikki usulda ulanib, umumiy tok, kuchlanish va qarshilik o‘lchanadi.','Ketma-ket ulash qarshilikni oshiradi, parallel ulash esa umumiy qarshilikni eng kichik tarmoq qarshiligidan ham kamaytiradi.','Tajriba murakkab zanjirlarni qismlarga ajratib tahlil qilishga o‘rgatadi.'),
  r(25,75,'Iste’molchilarni aralash ulash','Rekv = Rketma + Rparallel','Ω','Aralash zanjir ketma-ket va parallel qismlardan iborat. Hisoblash eng sodda parallel yoki ketma-ket bo‘lakdan boshlanadi.','Har bir soddalashtirishdan keyin zanjir ekvivalent qarshilik bilan qayta chiziladi.','Elektron qurilma va avtomobil elektr tizimlarida aralash ulanishlar ko‘p uchraydi.'),
  r(26,76,'Masalalar yechish: elektr zanjirlar','I = U/Rekv','A','Murakkab zanjir masalalarida avval ekvivalent qarshilik, keyin umumiy tok va har bir bo‘lakdagi kuchlanish yoki tok topiladi.','Parallel tarmoqlar uchun toklar yig‘indisi kiruvchi tokka teng.','Zanjir tahlili qisqa tutashuv va ortiqcha yuklanishni oldindan aniqlashga yordam beradi.'),
  r(27,78,'Elektr sig‘imi. Kondensatorlar','C = q/U','F','Kondensator ikki o‘tkazgich orasida elektr maydon energiyasini va zaryadni to‘playdigan qurilmadir. Uning sig‘imi zaryadning kuchlanishga nisbatiga teng.','Plastinalar yuzi kattalashsa sig‘im ortadi, ular orasidagi masofa oshsa sig‘im kamayadi.','Kondensatorlar quvvat manbai filtri, fotochaqnoq va sensorlarda ishlatiladi.'),
  r(28,82,'Kondensatorlarni parallel va ketma-ket ulash','Cparallel = ΣC; 1/Cketma = Σ(1/C)','F','Parallel ulashda umumiy sig‘im qo‘shiladi; ketma-ket ulashda esa ekvivalent sig‘im eng kichik kondensator sig‘imidan ham kichik bo‘ladi.','Ketma-ket kondensatorlarda zaryad miqdori bir xil, kuchlanishlar esa bo‘linadi.','Kerakli sig‘im va ish kuchlanishini olish uchun kondensatorlar guruhlanadi.'),
  r(29,84,'Masalalar yechish: kondensatorlar','W = CU²/2','J','Kondensator masalalarida sig‘im, zaryad, kuchlanish va to‘plangan energiya orasidagi bog‘lanishlar ishlatiladi.','Sig‘im faradda, zaryad kulonda, kuchlanish voltda olinadi.','Hisoblash elektron sxemadagi kondensatorning xavfsiz kuchlanishini tanlashga yordam beradi.'),

  r(30,88,'Elektr tokining ishi','A = UIt','J','Elektr toki iste’molchida energiyani boshqa ko‘rinishlarga aylantirganda ish bajaradi. Ish kuchlanish, tok kuchi va vaqt ko‘paytmasiga teng.','1 joul - 1 volt kuchlanishda 1 kulon zaryad ko‘chganda bajarilgan ish.','Elektr hisoblagich sarflangan energiyani amalda kilovatt-soatda o‘lchaydi.'),
  r(31,90,'Elektr tokining quvvati','P = UI','W','Elektr quvvat tokning vaqt birligida bajargan ishini ko‘rsatadi va kuchlanish bilan tok kuchi ko‘paytmasiga teng.','Bir xil kuchlanishda katta tok oladigan qurilmaning quvvati kattaroq bo‘ladi.','Qurilma pasportidagi quvvat energiya sarfi va sim yuklanishini baholashga yordam beradi.'),
  r(32,94,'Masalalar yechish: ish va quvvat','A = Pt = UIt','J','Ish va quvvat masalalarida vaqt sekundda, quvvat vattda olinsa energiya joul chiqadi. Maishiy hisobda kW·h ham ishlatiladi.','1 kW·h = 3,6·10⁶ J.','Hisoblash qurilmaning oy davomidagi energiya sarfi va xarajatini baholaydi.'),
  r(33,96,'Laboratoriya: lampochkaning elektr quvvatini aniqlash','P = UI','W','Lampochka uchlaridagi kuchlanish voltmetr, undan o‘tuvchi tok ampermetr bilan o‘lchanadi va quvvat P = UI orqali topiladi.','Asboblarning ulanishi va o‘lchash chegarasi tajriba boshlanishidan oldin tekshiriladi.','Tajriba qurilma yorlig‘idagi quvvatni amaliy o‘lchov bilan solishtirishga imkon beradi.'),
  r(34,97,'Elektr toki ta’sirida o‘tkazgichlarning qizishi','Q = I²Rt','J','Tok o‘tganda elektronlar kristall panjara ionlari bilan to‘qnashib, elektr energiyaning bir qismini ichki energiyaga aylantiradi.','Tok ikki marta oshsa, bir xil sharoitda ajralgan issiqlik to‘rt marta ortadi.','Elektr pech, dazmol, choynak va saqlagichning ishlashi o‘tkazgich qizishiga asoslanadi.'),
  r(35,100,'Masalalar yechish: Joul-Lens qonuni','Q = I²Rt','J','Joul-Lens masalalarida tok kuchi kvadrat bilan kirgani uchun birliklar va sonlarni ehtiyotkor almashtirish zarur.','Q ni U²t/R yoki UIt ko‘rinishida ham hisoblash mumkin.','Sim kesimini tanlashda ruxsat etilgan qizish hisobga olinadi.'),
  r(36,102,'Joul-Lens qonunining amaliy tatbiqlari','Q = I²Rt','J','Isitish asboblarida katta solishtirma qarshilikli va yuqori temperaturaga chidamli qotishma spiral ishlatiladi.','Saqlagichdagi ingichka sim ortiqcha tokda erib, zanjirni uzadi.','Termostat va avtomatik himoya qurilmalari ortiqcha qizishning oldini oladi.'),
  r(37,104,'Xonadonlardagi elektr zanjirlar va ulashlar','Pumumiy = ΣP','W','Xonadondagi iste’molchilar parallel ulanadi, chunki har biri tarmoq kuchlanishida va mustaqil ishlashi kerak.','Avtomat o‘chirgich va yerga ulash odamni elektr toki urishidan hamda simlarni qizishdan himoya qiladi.','Yuklamani hisoblash rozetka, kabel va himoya avtomatini to‘g‘ri tanlashga yordam beradi.'),
  r(38,108,'Elektr xavfsizlik choralari','I = U/R','A','Inson tanasidan o‘tuvchi tok kuchlanish va tana qarshiligiga bog‘liq. Namlik qarshilikni kamaytirib, xavfni keskin oshiradi.','Shikastlangan simga tegmaslik, quvvatni uzish va kattalarga yoki mutaxassisga murojaat qilish kerak.','Himoya avtomati, yerga ulash va differensial himoya hayotni saqlaydi.'),
  r(39,111,'Masalalar yechish: elektr energiyasi va xavfsizlik','P = UI; A = Pt','W; J','Elektr energiyasi masalalarida qurilmalar quvvati qo‘shilib, umumiy tok va sarflangan energiya topiladi.','Tarmoq toki himoya qurilmasining ruxsat etilgan qiymatidan oshmasligi kerak.','Hisoblash bir rozetkaga ortiqcha yuklama ulash xavfini ko‘rsatadi.'),

  r(40,115,'Metallarda elektr toki','I = neSv','A','Metallarda elektr toki erkin elektronlarning elektr maydon ta’siridagi tartibli harakatidan iborat.','Elektronlarning tartibli siljish tezligi kichik bo‘lsa ham, elektr maydon zanjir bo‘ylab juda tez tarqaladi.','Metall o‘tkazgichlar elektr uzatish, elektronika va aloqa tizimlarining asosidir.'),
  r(41,117,'Suyuqliklarda elektr toki','I = q/t','A','Elektrolitlarda elektr toki musbat va manfiy ionlarning qarama-qarshi yo‘nalishdagi tartibli harakatidan hosil bo‘ladi.','Eritmada ionlar qancha ko‘p va harakatchan bo‘lsa, elektr o‘tkazuvchanlik shuncha katta.','Akkumulyator, elektroliz va kimyoviy sensorlar ion tokidan foydalanadi.'),
  r(42,120,'Elektroliz. Faradeyning birinchi qonuni','m = kIt','kg','Elektrolizda elektr toki elektroddagi kimyoviy ajralishga sabab bo‘ladi. Ajralgan modda massasi elektrolitdan o‘tgan zaryadga proporsional.','I·t ko‘paytma qancha katta bo‘lsa, elektrodda ajralgan modda massasi shuncha katta.','Metall qoplash, misni tozalash va moddalarni ajratib olish elektrolizga asoslanadi.'),
  r(43,123,'Faradeyning ikkinchi qonuni','k = M/(Fnz)','kg/C','Elektrokimyoviy ekvivalent moddaning molyar massasi va ion valentligiga bog‘liq.','Bir xil zaryad o‘tganda molyar massasi katta va valentligi kichik modda ko‘proq ajraladi.','Qonun elektroliz jarayonini aniq rejalash va mahsulot massasini hisoblashga yordam beradi.'),
  r(44,125,'Masalalar yechish: elektroliz','m = kIt','kg','Elektroliz masalalarida tok amperda, vaqt sekundda olinib, zaryad q = It va ajralgan massa m = kq orqali topiladi.','Massani grammdan kilogrammga yoki aksincha to‘g‘ri o‘tkazish muhim.','Hisoblash galvanik qoplamaning kerakli qalinligini boshqarishga yordam beradi.'),
  r(45,127,'Elektrolizdan turmushda va texnikada foydalanish','m = kIt','kg','Elektroplatlash buyum sirtini korroziyadan himoya qilish yoki bezash uchun unga yupqa metall qatlami qoplaydi.','Elektroliz vaqtida buyum qoplanadigan metall ionlari mavjud eritmaga tushiriladi va elektrod sifatida ulanadi.','Xromlash, nikellash, misni tozalash va alyuminiy olish sanoatdagi muhim qo‘llanishlardir.'),
  r(46,129,'Vakuumda elektr toki','I = q/t','A','Vakuumda erkin zaryad tashuvchilar bo‘lmagani uchun tok faqat katoddan elektronlar chiqarilganda hosil bo‘ladi.','Qizdirilgan katoddan elektron chiqishi termoelektron emissiya deyiladi.','Vakuum lampalari, rentgen trubkasi va elektron mikroskop elektron oqimini boshqaradi.'),
  r(47,131,'Gazlarda elektr toki','I = q/t','A','Oddiy sharoitda gaz dielektrik, lekin ionlashtirilganda elektron va ionlar tok tashuvchiga aylanadi.','Gaz razryadi mustaqil bo‘lishi uchun zarrachalarning yangi ionlar hosil qilishi yetarli bo‘lishi kerak.','Neon lampa, plazma, chaqmoq va elektr payvandlash gaz razryadlariga misol bo‘ladi.'),
  r(48,133,'Elektr razryadlarining turlari va ulardan foydalanish','E = U/d','V/m','Uchqun, yoy, toj va miltillama razryadlar bosim, kuchlanish va elektrod shakliga qarab yuz beradi.','Elektr maydon kuchlanganligi gazning teshilish qiymatidan oshganda razryad boshlanadi.','Yoy razryadi payvandlashda, toj razryadi elektrofiltrlarda, miltillama razryad reklama lampalarida ishlatiladi.'),

  r(49,139,'Magnit maydon. Doimiy magnit va uning qutblari','N ↔ S','—','Magnit maydon harakatlanuvchi zaryadlar, tokli o‘tkazgichlar va magnitlar atrofida hosil bo‘ladi. Har bir magnit shimoliy va janubiy qutbga ega.','Bir xil magnit qutblar itaradi, har xil qutblar tortadi; alohida magnit qutb ajratib olinmaydi.','Kompas, eshik datchigi, dinamik va ma’lumot saqlash qurilmalari magnit maydondan foydalanadi.'),
  r(50,143,'Magnit maydonni xarakterlovchi parametrlar','B = F/(Il·sinα)','T','Magnit induksiya B magnit maydonning tokli o‘tkazgichga ko‘rsatadigan kuch ta’sirini tavsiflaydi.','Magnit induksiya yo‘nalishi kompasning shimoliy qutbi ko‘rsatgan yo‘nalish bilan aniqlanadi.','Magnit maydonni o‘lchash motor, generator va tibbiy MRT qurilmalarini loyihalashda kerak.'),
  r(51,145,'Yerning magnit maydoni','B ≈ 25–65 μT','T','Yer ulkan magnit kabi atrofida magnit maydon hosil qiladi. Kompas strelkasi shu maydon bo‘ylab yo‘naladi.','Geografik va magnit qutblar aynan bir nuqtada joylashmagan, magnit og‘ish va qiyalik joyga bog‘liq.','Kompas navigatsiyasi va kosmik ob-havo kuzatuvlari Yer magnit maydoniga tayanadi.'),
  r(52,146,'Tokning magnit maydoni','B ∝ I/r','T','Tok o‘tayotgan to‘g‘ri o‘tkazgich atrofida konsentrik aylana ko‘rinishidagi magnit maydon hosil bo‘ladi.','Maydon yo‘nalishi o‘ng qo‘l qoidasi bilan, kuchi esa tok ortishi va masofa kamayishi bilan aniqlanadi.','Tokning magnit maydoni elektromagnit, rele va transformatorning asosidir.'),
  r(53,149,'Magnit maydonning tokli o‘tkazgichga ta’siri','F = BIl·sinα','N','Magnit maydondagi tokli o‘tkazgichga Amper kuchi ta’sir qiladi. Kuch maydon va tok yo‘nalishiga perpendikulyar.','Kuch yo‘nalishi chap qo‘l qoidasi bilan aniqlanadi va o‘tkazgich maydonga tik bo‘lganda eng katta bo‘ladi.','Elektr motor, karnay va o‘lchov asboblari Amper kuchidan foydalanadi.'),
  r(54,151,'Masalalar yechish: Amper kuchi','F = BIl·sinα','N','Amper kuchi masalalarida magnit induksiya teslada, tok amperda, o‘tkazgich uzunligi metrda olinadi.','O‘tkazgich maydon chiziqlariga parallel bo‘lsa, kuch nol bo‘ladi.','Hisoblash motor chulg‘amidagi kuch va aylantiruvchi momentni baholaydi.'),
  r(55,153,'Bir jinsli magnit maydonda tokli ramkaning aylanma harakati','M = BIS·sinα','N·m','Magnit maydondagi tokli ramkaning qarama-qarshi tomonlariga yo‘nalishi teskari kuchlar ta’sir qilib, aylantiruvchi moment hosil qiladi.','Moment tok, magnit induksiya, ramka yuzi va o‘ramlar soni ortishi bilan kattalashadi.','Elektr motorlarda tokli g‘altakning uzluksiz aylanishi shu hodisaga asoslanadi.'),
  r(56,155,'Magnit maydonda zaryadli zarraning harakati','F = qvB·sinα','N','Harakatlanuvchi zaryadga Lorens kuchi ta’sir qiladi. Kuch tezlikka tik bo‘lgani uchun zarra tezligining qiymatini emas, yo‘nalishini o‘zgartiradi.','Zarra maydonga tik kirsa aylana bo‘ylab, qiya kirsa vint chizig‘i bo‘ylab harakat qiladi.','Mass-spektrometr, tezlatgich va qutb yog‘dusi zaryadlarning magnit maydondagi harakati bilan bog‘liq.'),
  r(57,157,'Elektromagnitlar. Elektromagnit rele','B ∝ NI','T','Tokli g‘altak ichidagi magnit maydon o‘ramlar soni, tok kuchi va o‘zak materialiga bog‘liq. Temir o‘zak maydonni kuchaytiradi.','Tok uzilganda elektromagnitning ta’siri keskin kamayadi, shu sababli u boshqariladigan magnit sifatida qulay.','Rele, elektromagnit kran, eshik qulfı va qo‘ng‘iroq elektromagnitdan foydalanadi.'),
  r(58,161,'Laboratoriya: eng oddiy elektromagnitni yig‘ish va ishlashini o‘rganish','B ∝ NI','T','Izolyatsiyalangan sim mix atrofida o‘ralib, past kuchlanishli manbaga qisqa vaqtga ulanadi. O‘ramlar soni yoki tok o‘zgarganda tortish kuchi solishtiriladi.','G‘altak qizib ketmasligi uchun zanjir faqat qisqa muddatga yopiladi.','Tajriba elektr energiyaning boshqariladigan magnit maydonga aylanishini ko‘rsatadi.'),
  r(59,162,'O‘zgarmas tok elektr dvigateli','M = BIS·sinα','N·m','Elektr dvigatel magnit maydonning tokli ramkaga ta’sirini uzluksiz aylanma harakatga aylantiradi. Kollektor har yarim aylanishda tok yo‘nalishini almashtiradi.','Rotor g‘altak, stator magnit maydon hosil qiladi; cho‘tkalar aylanuvchi qismga tok uzatadi.','Ventilyator, o‘yinchoq, nasos va elektr transportda doimiy tok motorlari ishlatiladi.'),
  r(60,165,'Masalalar yechish: magnit maydon','F = BIl; F = qvB','N','Magnit maydon masalalarida avval kuchning qaysi jismga - tokli o‘tkazgich yoki zaryadli zarrachaga - ta’sir qilayotgani aniqlanadi.','Vektor yo‘nalishi qo‘l qoidalari bilan, son qiymati esa tegishli formula va SI birliklari bilan topiladi.','Hisoblash motor, elektromagnit va zaryadlar harakatini oldindan baholashga yordam beradi.'),
];

if (rows.length !== 60) throw new Error(`60 dars kutilgan, topildi: ${rows.length}`);

const kau = JSON.parse(fs.readFileSync(path.join(root, 'tmp', 'kau_videos.json'), 'utf8'));
const byId = new Map(kau.filter(item => item.youtubeId).map(item => [item.youtubeId, item]));
const lessonVideoIds = {
  1:'tiLnsU8xRNA',2:'fT1fSpyUDFI',3:'sKVH4HZA_4U',4:'sKVH4HZA_4U',5:'geJV9cb9mmk',6:'0lZkSdivWCk',7:'kW3u_H8FDqo',
  11:'rdFMK-tIz1A',14:'9YQ9irb1FxM',15:'ob4F2SiSWa8',16:'ob4F2SiSWa8',17:'ob4F2SiSWa8',18:'ob4F2SiSWa8',19:'9YQ9irb1FxM',
  21:'gYbpjsSfOqA',22:'j0rQHktZyYA',24:'v_f_OZHhvrI',25:'v_f_OZHhvrI',26:'v_f_OZHhvrI',
  27:'bD42lm-Ypac',28:'U0bJ3k9pwYg',29:'b79UdDlQvw8',30:'Yl9BktxN6U4',31:'Yl9BktxN6U4',32:'Yl9BktxN6U4',33:'9YQ9irb1FxM',
  40:'0lZkSdivWCk',41:'T3IXJDRD6e8',42:'T3IXJDRD6e8',43:'T3IXJDRD6e8',44:'T3IXJDRD6e8',45:'T3IXJDRD6e8',
  49:'6_xVNqLOKBw',50:'6_xVNqLOKBw',51:'kpWNx_O5vac',52:'8ozgNOs4aqw',53:'mbVqq7GDbrQ',54:'mbVqq7GDbrQ',
  55:'7BIS_mtUgKE',56:'-lklhIOzq6A',57:'aXcp2i4rDU8',58:'dKnD_kTO4KY',59:'7BIS_mtUgKE',60:'mbVqq7GDbrQ',
};
const experimentVideoIds = {
  1:'MToK-iXNYn0',2:'4FUkTqku-YI',3:'Xrbw4DOrtSc',6:'fZGbkgMl390',10:'Jc4TTDIhO3o',
  15:'LTpaWXXrNTw',16:'Rt-H4QXAzUE',20:'6lQIXHWalj4',21:'UlS8j3pcNP4',
  41:'iJr8w0gN9IE',42:'aOcw3oJfSDM',43:'tteS4orSGVo',45:'yd8Bt0v7Xws',
  49:'R6vDJ4Mz0tc',51:'twmx66tC05M',52:'eWSZujn4mok',57:'Uzyhs5u96W0',58:'dKnD_kTO4KY',59:'HIypTa61pp0',
};

const makeVideo = id => {
  const item = byId.get(id);
  if (!item) return null;
  const title = String(item.title).replace(/^\d+\.\s*/, '').split(' Fizika.')[0].trim();
  return {
    id,
    title,
    source:`https://www.youtube.com/watch?v=${id}`,
    embed:`https://www.youtube-nocookie.com/embed/${id}?rel=0`,
    provider:'Khan Academy O‘zbek',
    type:'youtube',
    duration:item.duration || '',
    verified:true,
  };
};

const experiments = [
  'Havo sharini jun matoga ishqalab, mayda qog‘oz bo‘laklariga yaqinlashtiring. Sharni devorga ham yaqinlashtirib, elektronlarning ko‘chishi va qutblanishni izohlang.',
  'Oddiy folgali elektroskop yasang. Zaryadlangan taroq yaqinlashganda va tekkizilganda yaproqchalar holatini solishtiring.',
  'Ikki yengil sharni bir xil usulda zaryadlab, ipga osing. Masofani o‘zgartirib, tortishish yoki itarish kuchining o‘zgarishini kuzating.',
  'Batareya, kichik lampochka, kalit va simlardan faqat past kuchlanishli yopiq zanjir tuzing. Kalit ochiq va yopiq holatda zaryadlar uchun yo‘l mavjudligini chizmada ko‘rsating.',
  'Batareya, grafit qalam izi va kichik lampochka yordamida qarshilikni tekshiring. Kontaktlar orasidagi masofa ortganda lampaning yorqinligini kuzating.',
  'Ikki rezistorni avval ketma-ket, keyin parallel ulang. Har holatda umumiy tokni o‘lchab, ekvivalent qarshilik haqida xulosa qiling.',
  'Kichik lampochkaning kuchlanishi va tokini past kuchlanishli manbada o‘lchang. P = UI bo‘yicha quvvatni hisoblab, yorqinlik bilan taqqoslang.',
  'Tuzli suv, distillangan suv va sirka eritmasining o‘tkazuvchanligini LEDli past kuchlanishli tekshiruv zanjirida solishtiring. Elektrodlarni ichimlikka ishlatmaslik kerak.',
  'Mix atrofiga izolyatsiyalangan sim o‘rab, batareyaga qisqa muddat ulang. O‘ramlar soni oshganda nechta qog‘oz qisqich tortilishini solishtiring.',
  'Magnit ustiga qog‘oz qo‘yib, temir qirindisi o‘rniga mayda kompaslardan foydalaning. Maydon chiziqlari qutblar atrofida qanday yo‘nalishini chizing.',
];
const experimentFor = (lesson, chapter) => {
  if (chapter === 0) return experiments[lesson.number <= 2 ? lesson.number - 1 : 2];
  if (chapter === 1) return experiments[lesson.number <= 16 ? 3 : lesson.number <= 20 ? 4 : 5];
  if (chapter === 2) return experiments[6];
  if (chapter === 3) return experiments[7];
  return lesson.number >= 57 ? experiments[8] : experiments[9];
};

const problemFor = (lesson, chapter) => {
  if (chapter === 0) {
    if (/Kulon/.test(lesson.title)) return {title:'Kulon kuchini hisoblash',given:'q₁ = 2 μC, q₂ = 3 μC, r = 0,30 m.',steps:['Zaryadlarni kulonga o‘tkazamiz','F = k·|q₁q₂|/r²','F = 0,60 N'],answer:0.6,unit:'N',prompt:'q₁ = 1 μC, q₂ = 4 μC, r = 0,30 m bo‘lsa, F qancha?',practice:0.4};
    return {title:'Zaryad va maydonni hisoblash',given:'q = 6 μC zaryadga F = 0,12 N kuch ta’sir qiladi.',steps:['E = F/q','E = 0,12/(6·10⁻⁶)','E = 20 000 N/C'],answer:20000,unit:'N/C',prompt:'q = 4 μC zaryadga 0,08 N kuch ta’sir qilsa, E qancha?',practice:20000};
  }
  if (chapter === 1) return {title:'Om qonunini qo‘llash',given:'U = 12 V, R = 6 Ω.',steps:['I = U/R','I = 12/6','I = 2 A'],answer:2,unit:'A',prompt:'U = 18 V va R = 9 Ω bo‘lsa, tok kuchi qancha?',practice:2};
  if (chapter === 2) return {title:'Elektr energiyasini hisoblash',given:'U = 12 V, I = 2 A, t = 30 s.',steps:['A = UIt','A = 12·2·30','A = 720 J'],answer:720,unit:'J',prompt:'U = 10 V, I = 3 A va t = 20 s bo‘lsa, ish qancha?',practice:600};
  if (chapter === 3) return {title:'Elektroliz massasini hisoblash',given:'k = 0,3 mg/C, I = 2 A, t = 100 s.',steps:['q = It = 200 C','m = kq','m = 60 mg'],answer:60,unit:'mg',prompt:'k = 0,25 mg/C, I = 2 A va t = 120 s bo‘lsa, massa qancha?',practice:60};
  return {title:'Magnit kuchini hisoblash',given:'B = 0,4 T, I = 2 A, l = 0,5 m, α = 90°.',steps:['F = BIl·sinα','sin90° = 1','F = 0,4 N'],answer:0.4,unit:'N',prompt:'B = 0,3 T, I = 4 A, l = 0,5 m va α = 90° bo‘lsa, F qancha?',practice:0.6};
};

const exactExperimentFor = lesson => {
  const n = lesson.number;
  if (n === 1) return experiments[0];
  if (n === 2 || n === 6) return experiments[1];
  if ((n >= 3 && n <= 5) || n === 7) return experiments[2];
  if (n === 8) return 'Qorong‘i xonada sintetik kiyimni yechayotganda paydo bo‘ladigan mayda uchqunlarni kuzating. Hodisani chaqmoqning juda kichik modeli sifatida zaryad ajralishi va havo razryadi bilan izohlang.';
  if (n >= 9 && n <= 14) return experiments[3];
  if (n >= 15 && n <= 20) return experiments[4];
  if (n >= 21 && n <= 26) return experiments[5];
  if (n >= 27 && n <= 29) return 'Ikki metall folga plastinasini yupqa dielektrik bilan ajratib, sodda kondensator modelini yasang. Plastinalar yuzasi va oralig‘ini o‘zgartirib, sig‘im qanday o‘zgarishini oldindan ayting.';
  if (n >= 30 && n <= 33) return experiments[6];
  if (n >= 34 && n <= 36) return 'Past kuchlanishli zanjirda bir xil uzunlikdagi ingichka va yo‘g‘on simlarning qizishini faqat kattalar nazoratida solishtiring. Tokni qisqa vaqt ulang va Joul–Lens qonuni bilan izohlang.';
  if (n >= 37 && n <= 39) return 'Uy jihozlari yorlig‘idagi quvvatlarni yozib oling. Bir vaqtda ishlaydigan qurilmalar quvvatini qo‘shib, umumiy tokni I = P/U orqali baholang; elektr tarmog‘iga tajriba tariqasida tegmang.';
  if (n === 40) return 'Batareya, LED va turli metall simlardan past kuchlanishli zanjir tuzing. Metall almashtirilganda yorqinlik o‘zgarishini erkin elektronlar va qarshilik bilan izohlang.';
  if (n >= 41 && n <= 45) return experiments[7];
  if (n === 46) return 'Vakuum trubkasining tayyor animatsiyasi yoki xavfsiz videosida qizdirilgan katoddan elektronlar chiqishini kuzating. Uy sharoitida yuqori kuchlanishli vakuum tajribasini takrorlamang.';
  if (n === 47 || n === 48) return 'Plazma shariga barmoqni yaqinlashtirib, yorug‘ kanalning barmoq tomon yo‘nalishini kuzating. Gazning ionlanishi va elektr maydon kuchlanganligi bilan izohlang.';
  if (n === 49 || n === 51) return experiments[9];
  if (n === 50 || n === 52) return 'Tokli sim yaqiniga bir nechta kichik kompas qo‘ying. Tok yo‘nalishini almashtirganda strelkalar burilishini kuzatib, o‘ng qo‘l qoidasini tekshiring.';
  if ((n >= 53 && n <= 56) || n === 59 || n === 60) return 'Magnit oralig‘iga erkin siljiy oladigan yengil tokli ramka modelini joylashtiring. Tok yo‘nalishini almashtirib, kuch va aylanish yo‘nalishi qanday o‘zgarishini kuzating.';
  return experiments[8];
};

const exactProblem = (title, given, steps, unit, prompt, practice) => {
  const finalStep = String(steps.at(-1) || '');
  const finalPart = finalStep.includes('=') ? finalStep.split('=').at(-1) : finalStep;
  const match = finalPart.match(/-?\d[\d\s]*(?:[.,]\d+)?(?:·10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)?/);
  const answer = match ? match[0].trim() : practice;
  return {title, given, steps, answer, unit, prompt, practice};
};

const exactProblemFor = lesson => {
  const n = lesson.number;
  if (n <= 2) return exactProblem('Elementar zaryadlar sonini topish','Jism zaryadi q = 4,8·10⁻¹⁹ C.',['N = |q|/e','N = 4,8·10⁻¹⁹/(1,6·10⁻¹⁹)','N = 3 ta elektron'],'ta elektron','q = 8·10⁻¹⁹ C bo‘lsa, nechta elektron ko‘chgan?',5);
  if (n === 3 || n === 4) return exactProblem('Kulon kuchini hisoblash','q₁ = 2 μC, q₂ = 3 μC, r = 0,30 m.',['Zaryadlarni kulonga o‘tkazamiz','F = k·|q₁q₂|/r²','F = 0,60 N'],'N','q₁ = 1 μC, q₂ = 4 μC, r = 0,30 m bo‘lsa, F qancha?',0.4);
  if (n === 5 || n === 7) return exactProblem('Elektr maydon kuchlanganligi','q = 6 μC zaryadga F = 0,12 N kuch ta’sir qiladi.',['E = F/q','E = 0,12/(6·10⁻⁶)','E = 20 000 N/C'],'N/C','q = 4 μC zaryadga 0,08 N kuch ta’sir qilsa, E qancha?',20000);
  if (n === 6) return exactProblem('O‘tkazgich ichidagi maydon','O‘tkazgich elektrostatik muvozanatda.',['Erkin zaryadlar qayta taqsimlanadi','Ichki maydonlar o‘zaro kompensatsiyalanadi','Eichki = 0 N/C'],'N/C','Elektrostatik muvozanatdagi o‘tkazgich ichida E qancha?',0);
  if (n === 8) return exactProblem('Chaqmoqdagi zaryad miqdori','Razryad toki I = 20 kA, davomiyligi t = 0,02 s.',['q = It','q = 20 000·0,02','q = 400 C'],'C','I = 15 kA va t = 0,04 s bo‘lsa, q qancha?',600);
  if (n === 9 || n === 12) return exactProblem('Tok kuchini topish','q = 12 C zaryad t = 4 s da o‘tdi.',['I = q/t','I = 12/4','I = 3 A'],'A','q = 20 C zaryad 5 s da o‘tsa, I qancha?',4);
  if (n === 10) return exactProblem('Tok manbaining EYuKsi','Tashqi kuchlar 6 C zaryadni ko‘chirishda 72 J ish bajardi.',['ε = Atashqi/q','ε = 72/6','ε = 12 V'],'V','A = 90 J va q = 10 C bo‘lsa, ε qancha?',9);
  if (n === 11) return exactProblem('Kuchlanishni topish','2 C zaryadni ko‘chirishda 18 J ish bajarildi.',['U = A/q','U = 18/2','U = 9 V'],'V','A = 24 J va q = 3 C bo‘lsa, U qancha?',8);
  if (n === 13 || n === 14) return exactProblem('Zaryad va elektr ishini topish','I = 2 A, t = 5 s, U = 12 V.',['q = It = 10 C','A = Uq','A = 120 J'],'J','I = 3 A, t = 4 s, U = 10 V bo‘lsa, A qancha?',120);
  if (n === 15 || n === 16) return exactProblem('O‘tkazgich qarshiligi','ρ = 0,017 Ω·mm²/m, l = 20 m, S = 0,5 mm².',['R = ρl/S','R = 0,017·20/0,5','R = 0,68 Ω'],'Ω','ρ = 0,028 Ω·mm²/m, l = 10 m, S = 0,7 mm² bo‘lsa, R qancha?',0.4);
  if (n >= 17 && n <= 20) return exactProblem('Om qonunini qo‘llash','U = 12 V, R = 6 Ω.',['I = U/R','I = 12/6','I = 2 A'],'A','U = 18 V va R = 9 Ω bo‘lsa, I qancha?',2);
  if (n === 21) return exactProblem('Ketma-ket qarshilik','R₁ = 4 Ω va R₂ = 6 Ω ketma-ket ulangan.',['R = R₁ + R₂','R = 4 + 6','R = 10 Ω'],'Ω','3 Ω va 9 Ω rezistorlar ketma-ket ulansa, R qancha?',12);
  if (n === 22) return exactProblem('Parallel qarshilik','R₁ = 6 Ω va R₂ = 3 Ω parallel ulangan.',['1/R = 1/6 + 1/3','1/R = 1/2','R = 2 Ω'],'Ω','4 Ω va 4 Ω rezistorlar parallel ulansa, R qancha?',2);
  if (n === 23) return exactProblem('Manbalarni ketma-ket ulash','Har biri 1,5 V bo‘lgan 3 element ketma-ket ulangan.',['ε = ε₁ + ε₂ + ε₃','ε = 1,5·3','ε = 4,5 V'],'V','1,5 V li 4 element ketma-ket ulansa, ε qancha?',6);
  if (n >= 24 && n <= 26) return exactProblem('Aralash zanjirni soddalashtirish','6 Ω va 3 Ω parallel, ularga 4 Ω ketma-ket ulangan.',['Rparallel = 2 Ω','Rekv = 2 + 4','Rekv = 6 Ω'],'Ω','4 Ω va 4 Ω parallel, ularga 3 Ω ketma-ket ulansa, Rekv qancha?',5);
  if (n === 27) return exactProblem('Kondensator sig‘imi','q = 24 μC, U = 12 V.',['C = q/U','C = 24/12','C = 2 μF'],'μF','q = 30 μC va U = 10 V bo‘lsa, C qancha?',3);
  if (n === 28) return exactProblem('Parallel kondensatorlar','C₁ = 2 μF va C₂ = 3 μF parallel ulangan.',['C = C₁ + C₂','C = 2 + 3','C = 5 μF'],'μF','4 μF va 6 μF parallel ulansa, C qancha?',10);
  if (n === 29) return exactProblem('Kondensator energiyasi','C = 4 μF, U = 100 V.',['W = CU²/2','W = 4·10⁻⁶·100²/2','W = 0,02 J'],'J','C = 2 μF va U = 100 V bo‘lsa, W qancha?',0.01);
  if (n === 30 || n === 32) return exactProblem('Elektr ishini hisoblash','U = 12 V, I = 2 A, t = 30 s.',['A = UIt','A = 12·2·30','A = 720 J'],'J','U = 10 V, I = 3 A va t = 20 s bo‘lsa, A qancha?',600);
  if (n === 31 || n === 33) return exactProblem('Elektr quvvatini hisoblash','U = 220 V, I = 0,5 A.',['P = UI','P = 220·0,5','P = 110 W'],'W','U = 12 V va I = 2 A bo‘lsa, P qancha?',24);
  if (n >= 34 && n <= 36) return exactProblem('Joul–Lens issiqligi','I = 2 A, R = 5 Ω, t = 30 s.',['Q = I²Rt','Q = 2²·5·30','Q = 600 J'],'J','I = 3 A, R = 4 Ω, t = 10 s bo‘lsa, Q qancha?',360);
  if (n === 37 || n === 39) return exactProblem('Xonadonning umumiy toki','Qurilmalar umumiy quvvati P = 2,2 kW, U = 220 V.',['I = P/U','I = 2200/220','I = 10 A'],'A','P = 3,3 kW va U = 220 V bo‘lsa, I qancha?',15);
  if (n === 38) return exactProblem('Tana orqali o‘tuvchi tok','U = 36 V, tana qarshiligi R = 12 kΩ.',['I = U/R','I = 36/12000','I = 0,003 A = 3 mA'],'mA','U = 24 V va R = 8 kΩ bo‘lsa, I necha mA?',3);
  if (n === 40) return exactProblem('Metallardagi tok','n = 8·10²⁸ m⁻³, e = 1,6·10⁻¹⁹ C, S = 10⁻⁶ m², v = 10⁻⁴ m/s.',['I = neSv','Sonlarni ko‘paytiramiz','I = 1,28 A'],'A','n = 5·10²⁸, S = 10⁻⁶ m², v = 10⁻⁴ m/s bo‘lsa, I qancha?',0.8);
  if (n === 41 || n === 46 || n === 47) return exactProblem('Muhitdagi tokni topish','q = 18 C zaryad 6 s da o‘tdi.',['I = q/t','I = 18/6','I = 3 A'],'A','q = 28 C va t = 7 s bo‘lsa, I qancha?',4);
  if (n === 42 || n === 44 || n === 45) return exactProblem('Elektroliz massasini hisoblash','k = 0,3 mg/C, I = 2 A, t = 100 s.',['q = It = 200 C','m = kq','m = 60 mg'],'mg','k = 0,25 mg/C, I = 2 A va t = 120 s bo‘lsa, m qancha?',60);
  if (n === 43) return exactProblem('Elektrokimyoviy ekvivalent','M = 0,064 kg/mol, n = 2, F = 96500 C/mol.',['k = M/(Fn)','k = 0,064/(96500·2)','k ≈ 3,32·10⁻⁷ kg/C'],'·10⁻⁷ kg/C','M = 0,0965 kg/mol, n = 1 bo‘lsa, k necha ·10⁻⁷ kg/C?',10);
  if (n === 48) return exactProblem('Gazning teshilish maydoni','U = 3000 V, elektrod oralig‘i d = 0,01 m.',['E = U/d','E = 3000/0,01','E = 300 000 V/m'],'V/m','U = 2000 V va d = 0,02 m bo‘lsa, E qancha?',100000);
  if (n === 49) return exactProblem('Magnit qutblarni aniqlash','Ikki magnitning N qutblari yaqinlashtirildi.',['Bir xil qutblar itaradi','N va N — bir xil qutblar','Kuch 2 qarama-qarshi yo‘nalishda ta’sir qiladi'],'ta yo‘nalish','Bir xil qutblar orasida nechta o‘zaro ta’sir yo‘nalishi bor?',2);
  if (n === 50) return exactProblem('Magnit induksiyani topish','F = 0,4 N, I = 2 A, l = 0,5 m, α = 90°.',['B = F/(Il)','B = 0,4/(2·0,5)','B = 0,4 T'],'T','F = 0,6 N, I = 3 A, l = 0,5 m bo‘lsa, B qancha?',0.4);
  if (n === 51) return exactProblem('Yer magnit maydonini solishtirish','Bir joyda B = 50 μT.',['Bu qiymat 25–65 μT oralig‘ida','50 − 25 = 25 μT','Qiymat quyi chegaradan 25 μT katta'],'μT','B = 60 μT bo‘lsa, u 25 μT dan qancha katta?',35);
  if (n === 52) return exactProblem('Tok maydonining o‘zgarishi','Tok ikki marta oshdi, masofa o‘zgarmadi.',['B ∝ I/r','I ikki marta oshsa','B ham 2 marta oshadi'],'marta','Tok 3 marta oshsa, B necha marta oshadi?',3);
  if (n === 53 || n === 54 || n === 60) return exactProblem('Amper kuchini hisoblash','B = 0,4 T, I = 2 A, l = 0,5 m, α = 90°.',['F = BIl·sinα','sin90° = 1','F = 0,4 N'],'N','B = 0,3 T, I = 4 A, l = 0,5 m bo‘lsa, F qancha?',0.6);
  if (n === 55 || n === 59) return exactProblem('Tokli ramka momenti','B = 0,5 T, I = 2 A, S = 0,04 m², α = 90°.',['M = BIS·sinα','M = 0,5·2·0,04','M = 0,04 N·m'],'N·m','B = 0,4 T, I = 3 A, S = 0,05 m² bo‘lsa, M qancha?',0.06);
  if (n === 56) return exactProblem('Lorens kuchini hisoblash','q = 2 μC, v = 1000 m/s, B = 0,5 T, α = 90°.',['F = qvB','F = 2·10⁻⁶·1000·0,5','F = 0,001 N'],'N','q = 4 μC, v = 500 m/s, B = 0,5 T bo‘lsa, F qancha?',0.001);
  return exactProblem('Elektromagnitni kuchaytirish','O‘ramlar soni 100 dan 200 taga oshirildi, tok o‘zgarmadi.',['B ∝ NI','N ikki marta oshdi','B taxminan 2 marta oshadi'],'marta','O‘ramlar soni 3 marta oshsa, B necha marta oshadi?',3);
};

const chapterFor = number => chapterEnds.findIndex(end => number <= end);
const lessons = rows.map((lesson, index) => {
  const chapter = chapterFor(lesson.number);
  const end = rows[index + 1] ? rows[index + 1].start - 1 : 168;
  const pages = `${lesson.start}${end > lesson.start ? `–${end}` : ''}`;
  const experiment = exactExperimentFor(lesson);
  const formulaNote = lesson.formula === '—'
    ? 'Bu mavzu sifat jihatdan kuzatiladi; yo‘nalish va sabab-oqibat bog‘lanishi asosiy o‘rinda turadi.'
    : `${lesson.formula} munosabati mavzudagi asosiy kattaliklarni bog‘laydi. Hisoblashdan oldin barcha qiymatlar SI birliklariga o‘tkaziladi.`;
  return {
    id:`l${lesson.number}`,
    chapter,
    number:lesson.number,
    title:lesson.title,
    pages,
    pageNumbers:Array.from({length:end-lesson.start+1},(_,i)=>lesson.start+i),
    summary:lesson.definition,
    paragraphs:[lesson.definition, lesson.key, lesson.application],
    formula:lesson.formula,
    formulaExplanation:formulaNote,
    unit:lesson.unit,
    relationship:lesson.key,
    application:lesson.application,
    theoryBlocks:[
      {type:'paragraph',text:lesson.definition,page:lesson.start},
      {type:'paragraph',text:`Asosiy qoida: ${lesson.key}`,page:lesson.start},
      {type:'paragraph',text:formulaNote,page:lesson.start},
      {type:'paragraph',text:`Amaliy ahamiyati: ${lesson.application}`,page:lesson.start},
      {type:'paragraph',text:`O‘zingizni tekshiring: “${lesson.title}” hodisasida qaysi kattalik sabab, qaysi kattalik natija ekanini ayting va formuladagi birliklarni tekshiring.`,page:lesson.start},
    ],
    figure:`assets/physics8/visuals/lesson-${String(lesson.number).padStart(2,'0')}.svg`,
    figurePage:lesson.start,
    video:makeVideo(lessonVideoIds[lesson.number]),
    experimentVideo:makeVideo(experimentVideoIds[lesson.number]),
    experiment,
    experimentQuestion:`Kuzatilgan natija nima sababdan yuz berdi? Javobingizni “${lesson.title}” mavzusidagi asosiy qoida bilan bog‘lang.`,
    experimentExplanation:`${lesson.key} ${lesson.application}`,
    simulation:'interactive',
    hasSimulation:false,
    problem:exactProblemFor(lesson),
    reward:90 + chapter * 15 + (lesson.number % 3) * 5,
  };
});

const course = {
  version:'2026.07-grade8-v1',
  grade:8,
  title:'8-sinf Fizika',
  chapters:chapters.map((chapter, index) => ({
    ...chapter,
    number:index + 1,
    lessonStart:index ? chapterEnds[index - 1] + 1 : 1,
    lessonEnd:chapterEnds[index],
  })),
  lessons,
  totalPages:176,
  source:'Fizika 8-sinf, 2019',
};

const js = `window.PHYSICS_COURSE=${JSON.stringify(course)};\n`;
fs.writeFileSync(path.join(out, 'physics-content.js'), js, 'utf8');

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const scene = (chapter, index) => {
  const shift = (index % 5) * 16;
  if (chapter === 0) return `<circle cx="310" cy="300" r="76" fill="#7557ff"/><text x="310" y="322" text-anchor="middle" font-size="60" fill="#fff">+</text><circle cx="590" cy="300" r="76" fill="#ee598b"/><text x="590" y="322" text-anchor="middle" font-size="60" fill="#fff">−</text><g stroke="#5ee1d0" stroke-width="5" fill="none">${[0,1,2,3,4].map(i=>`<path d="M390 ${245+i*28} C455 ${210+i*20} 520 ${210+i*20} 510 ${245+i*28}"/>`).join('')}</g>`;
  if (chapter === 1) return `<path d="M210 210H650V440H210Z" fill="none" stroke="#dce6ff" stroke-width="10"/><path d="M210 280h55m0-35v70m32-50v30M650 315h-85" stroke="#ffc35b" stroke-width="10"/><rect x="${360+shift}" y="175" width="150" height="70" rx="18" fill="#7557ff"/><path d="M380 ${210}h110" stroke="#fff" stroke-width="8"/><circle cx="440" cy="440" r="55" fill="#13aaa2"/><text x="440" y="458" text-anchor="middle" fill="#fff" font-size="48">A</text>`;
  if (chapter === 2) return `<path d="M285 405c0-95 40-155 145-155s145 60 145 155" fill="#ffb54033" stroke="#ffb540" stroke-width="12"/><path d="M355 250c0-70 35-110 75-110s75 40 75 110" fill="none" stroke="#fff4b0" stroke-width="10"/><path d="M340 405h180" stroke="#dce6ff" stroke-width="18"/><g fill="#ff8a3d">${[0,1,2,3].map(i=>`<rect x="${245+i*145}" y="${500-(i+1)*55}" width="80" height="${(i+1)*55}" rx="12"/>`).join('')}</g>`;
  if (chapter === 3) return `<path d="M245 180H625V470H245Z" fill="#4ca9ff22" stroke="#cfe9ff" stroke-width="10"/><path d="M245 285H625V470H245Z" fill="#3e9cf06a"/><path d="M330 145v245M540 145v245" stroke="#ffca63" stroke-width="18"/><g font-size="30" font-weight="800">${[0,1,2,3,4,5].map(i=>`<text x="${300+(i%3)*115}" y="${330+Math.floor(i/3)*90}" fill="${i%2?'#ff6d96':'#5ce0d0'}">${i%2?'−':'+'}</text>`).join('')}</g>`;
  return `<rect x="300" y="240" width="280" height="120" rx="20" fill="url(#mag)"/><text x="345" y="318" fill="#fff" font-size="58" font-weight="900">S</text><text x="505" y="318" fill="#fff" font-size="58" font-weight="900">N</text><g fill="none" stroke="#5ce0d0" stroke-width="6">${[0,1,2,3].map(i=>`<path d="M300 ${260+i*28} C${190-i*18} ${160+i*28} ${690+i*18} ${160+i*28} 580 ${260+i*28}"/>`).join('')}</g><path d="M650 180c-70 0-70 240 0 240s70-240 0-240z" fill="none" stroke="#ffbd55" stroke-width="16"/>`;
};

lessons.forEach((lesson, index) => {
  const chapter = lesson.chapter;
  const accent = chapters[chapter].accent;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img">
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b1630"/><stop offset="1" stop-color="#172143"/></linearGradient><linearGradient id="mag"><stop stop-color="#357be8"/><stop offset=".5" stop-color="#357be8"/><stop offset=".5" stop-color="#ed4e75"/><stop offset="1" stop-color="#ed4e75"/></linearGradient></defs>
  <rect width="1200" height="675" rx="36" fill="url(#bg)"/><circle cx="80" cy="70" r="210" fill="${accent}" opacity=".15"/><circle cx="1120" cy="650" r="260" fill="#18b8aa" opacity=".1"/>
  <rect x="48" y="45" width="90" height="50" rx="16" fill="${accent}"/><text x="93" y="79" text-anchor="middle" fill="#fff" font-family="Inter,Arial" font-size="22" font-weight="850">${String(index+1).padStart(2,'0')}</text>
  <text x="165" y="80" fill="#fff" font-family="Inter,Arial" font-size="25" font-weight="800">8-SINF FIZIKA</text>
  <g font-family="Inter,Arial">${scene(chapter,index)}</g>
  <rect x="760" y="145" width="390" height="390" rx="34" fill="#ffffff0d" stroke="#ffffff27" stroke-width="3"/>
  <text x="800" y="205" fill="${accent}" font-family="Inter,Arial" font-size="18" font-weight="850" letter-spacing="2">MAVZUGA OID MODEL</text>
  <foreignObject x="800" y="235" width="310" height="145"><div xmlns="http://www.w3.org/1999/xhtml" style="font:800 31px/1.2 Inter,Arial;color:white">${esc(lesson.title)}</div></foreignObject>
  <path d="M800 405H1110" stroke="#ffffff25" stroke-width="2"/>
  <foreignObject x="800" y="430" width="310" height="70"><div xmlns="http://www.w3.org/1999/xhtml" style="font:700 24px/1.25 Inter,Arial;color:#cbd7f5">${esc(lesson.formula)}</div></foreignObject>
  <text x="65" y="625" fill="#afbcda" font-family="Inter,Arial" font-size="19">Idrok • formulani chizma va tajriba bilan tushuning</text>
  </svg>`;
  fs.writeFileSync(path.join(visuals, `lesson-${String(index+1).padStart(2,'0')}.svg`), svg, 'utf8');
});

const template = fs.readFileSync(path.join(root, 'physics7.html'), 'utf8');
const html = template
  .replaceAll('physics7', 'physics8')
  .replaceAll('Physics7', 'Physics8')
  .replaceAll('PHYSICS_COURSE7', 'PHYSICS_COURSE8')
  .replaceAll('IDROK_PHET7', 'IDROK_PHET8')
  .replaceAll('phet-map7', 'phet-map8')
  .replaceAll('7-sinf', '8-sinf')
  .replaceAll('7-SINF', '8-SINF')
  .replaceAll('62 dars', '60 dars')
  .replaceAll('0 / 62', '0 / 60')
  .replaceAll('FIZIKA • 8-SINF • 62 DARS', 'FIZIKA • 8-SINF • 60 DARS')
  .replaceAll('76 soat', '74 soat')
  .replaceAll('<strong>62 ta</strong>', '<strong>60 ta</strong>')
  .replace('Mexanik harakat, kuch va energiya, issiqlik hodisalari, elektr hamda optika bo‘yicha 62 ta to‘liq dars.', 'Elektr zaryad, elektr toki, energiya, turli muhitlardagi tok va magnit maydon bo‘yicha 60 ta to‘liq dars.')
  .replace("courseCode: '7'", "courseCode: '8'")
  .replace("certificateStorageKey: 'idrokCertificate7'", "certificateStorageKey: 'idrokCertificate8'")
  .replace("certificateGrade: '7'", "certificateGrade: '8'")
  .replace("aiHistoryKey: 'idrokAiHistory7'", "aiHistoryKey: 'idrokAiHistory8'")
  .replace(/\s*<script src="assets\/physics8\/physics-content-fixes\.js[^>]*><\/script>/, '')
  .replace(/\s*<script src="assets\/physics8\/physics-content-audit\.js[^>]*><\/script>/, '')
  .replace(/\s*<script src="phet-map8-audit\.js[^>]*><\/script>/, '');
fs.writeFileSync(path.join(root, 'physics8.html'), html, 'utf8');

console.log(JSON.stringify({chapters:chapters.length,lessons:lessons.length,videos:lessons.filter(x=>x.video).length,experimentVideos:lessons.filter(x=>x.experimentVideo).length,visuals:lessons.length},null,2));

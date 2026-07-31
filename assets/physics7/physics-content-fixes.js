(() => {
  'use strict';
  const course = window.PHYSICS_COURSE;
  if (!course || course.grade !== 7 || !Array.isArray(course.lessons)) return;

  const repairs = [
    ['Ar- Roziy', 'Ar-Roziy'], ['davr- dayoq', 'davrdayoq'], ['bo‘la- di', 'bo‘ladi'],
    ['shi- fokor', 'shifokor'], ['mo‘yna- dan', 'mo‘ynadan'], ['xulo- saga', 'xulosaga'],
    ['nuri- ning', 'nurining'], ['bir biriga', 'bir-biriga'], ['bir biridan', 'bir-biridan'],
    ['kuchi ga', 'kuchiga'], ['ki chik', 'kichik'], ['ta yoqcha', 'tayoqcha'],
    ['qan day', 'qanday'], ['bo‘l gan', 'bo‘lgan'], ['mum kin', 'mumkin'],
    ['ku chining', 'kuchining'], ['qan cha', 'qancha'], ['kine tik', 'kinetik'],
    ['jism dan', 'jismdan'], ['beru niy', 'Beruniy'], ['katt aliklar', 'kattaliklar'],
    ['hara kat', 'harakat'], ['kuch ga', 'kuchga'], ['bosh qa', 'boshqa'],
    ['belgi lanadi', 'belgilanadi'], ['olin gan', 'olingan'], ['o‘l chashda', 'o‘lchashda'],
    ['zich ligi', 'zichligi'], ['aniq lang', 'aniqlang'], ['jadv alga', 'jadvalga'],
    ['birin chi', 'birinchi'], ['za ryadlangan', 'zaryadlangan'], ['shi sha', 'shisha'],
    ['ba tareya', 'batareya'], ['kuch lanish', 'kuchlanish'], ['volt metr', 'voltmetr'],
    ['ata ladi', 'ataladi'], ['qar shiligini', 'qarshiligini'], ['zarra chalar', 'zarrachalar'],
    ['ko‘p chilik', 'ko‘pchilik'], ['ay tib', 'aytib'], ['tosh kent', 'Toshkent'],
    ['makt ab', 'maktab'], ['o‘ zbekiston', 'O‘zbekiston'], ['o‘z bekiston', 'O‘zbekiston'],
    ['muko foti', 'mukofoti'], ['dav lat', 'davlat'], ['rossi ya', 'Rossiya'],
    ['qu rilgan', 'qurilgan'], ['fanla ri', 'fanlari'], ['katta liklar', 'kattaliklar'],
    ['masa lan', 'masalan'], ['o‘l chanadigan', 'o‘lchanadigan'], ['namu naviy', 'namunaviy'],
    ['kat ta', 'katta'], ['tani shasiz', 'tanishasiz'], ['mav jud', 'mavjud'],
    ['hajmi ni', 'hajmini'], ['maq sadda', 'maqsadda'], ['hajmi ga', 'hajmiga'],
    ['men zur', 'menzur'], ['qili nadi', 'qilinadi'], ['qay naydi', 'qaynaydi'],
    ['jism larning', 'jismlarning'], ['bir galikda', 'birgalikda'], ['uzil gan', 'uzilgan'],
    ['tushi shi', 'tushishi'], ['suv ning', 'suvning'], ['cha nadi', 'chanadi'],
    ['skal yar', 'skalyar'], ['ko‘ri nib', 'ko‘rinib'], ['jism ning', 'jismning'],
    ['jism larga', 'jismlarga'], ['as lida', 'aslida'], ['bili shadi', 'bilishadi'],
    ['qi lingan', 'qilingan'], ['tushu namiz', 'tushunamiz'], ['payt dagi', 'paytdagi'],
    ['tele fon', 'telefon'], ['o‘zga rishsiz', 'o‘zgarishsiz'], ['bo‘la digan', 'bo‘ladigan'],
    ['nuqta dan', 'nuqtadan'], ['suz gan', 'suzgan'], ['tra yektoriyasi', 'trayektoriyasi'],
    ['yo‘li ga', 'yo‘liga'], ['har akatda', 'harakatda'], ['maso falarni', 'masofalarni'],
    ['bun da', 'bunda'], ['pi yoda', 'piyoda'], ['be ring', 'bering'],
    ['bo sib', 'bosib'], ['cha nadigan', 'chanadigan'], ['vaqt da', 'vaqtda'],
    ['da vomida', 'davomida'], ['qiyma tini', 'qiymatini'], ['sk alyar', 'skalyar'],
    ['ayla nish', 'aylanish'], ['chi ziqdan', 'chiziqdan'], ['ma sofani', 'masofani'],
    ['tezli gini', 'tezligini'], ['o‘t gach', 'o‘tgach'], ['sha harlar', 'shaharlar'],
    ['torri chelli', 'Torrichelli'], ['xalqa ro', 'xalqaro'], ['o‘l chanadi', 'o‘lchanadi'],
    ['qo‘yi ladi', 'qo‘yiladi'], ['kel tirilgan', 'keltirilgan'], ['bo‘la di', 'bo‘ladi'],
    ['jihat dan', 'jihatdan'], ['yuqo ri', 'yuqori'], ['geo metrik', 'geometrik'],
    ['to‘l dirilgan', 'to‘ldirilgan'], ['fo ydali', 'foydali'], ['dina mometrga', 'dinamometrga'],
    ['turli cha', 'turlicha'], ['katta ligiga', 'kattaligiga'], ['o‘l chamlarini', 'o‘lchamlarini'],
    ['bal lonlarining', 'ballonlarining'], ['su yuqlik', 'suyuqlik'], ['mah kamlab', 'mahkamlab'],
    ['qil gan', 'qilgan'], ['zar ralarining', 'zarralarining'], ['por shenning', 'porshenning'],
    ['ma shina', 'mashina'], ['gaz ga', 'gazga'], ['gaz ning', 'gazning'],
    ['qi ladigan', 'qiladigan'], ['quyi dagi', 'quyidagi'], ['idish ga', 'idishga'],
    ['yo g‘och', 'yog‘och'], ['milli metr', 'millimetr'], ['ba rometr', 'barometr'],
    ['ba landlikda', 'balandlikda'], ['atmos fera', 'atmosfera'], ['at mosfera', 'atmosfera'],
    ['vazi fani', 'vazifani'], ['mexa nik', 'mexanik'], ['kuch ning', 'kuchning'],
    ['hara katlanmoqda', 'harakatlanmoqda'], ['yig ‘indisidan', 'yig‘indisidan'],
    ['to la', 'to‘la'], ['tufay li', 'tufayli'], ['jism ni', 'jismni'],
    ['ish ga', 'ishga'], ['ener giyaga', 'energiyaga'], ['qo‘li mizni', 'qo‘limizni'],
    ['bi lan', 'bilan'], ['bosh qasiga', 'boshqasiga'], ['shak li', 'shakli'],
    ['sovi shi', 'sovishi'], ['o‘z garishi', 'o‘zgarishi'], ['ho disalari', 'hodisalari'],
    ['mole kulalari', 'molekulalari'], ['tash kil', 'tashkil'], ['orta di', 'ortadi'],
    ['ka mayadi', 'kamayadi'], ['orqa li', 'orqali'], ['kat talik', 'kattalik'],
    ['is siqlik', 'issiqlik'], ['qu ying', 'quying'], ['bi rinchi', 'birinchi'],
    ['qay noq', 'qaynoq'], ['suv dagi', 'suvdagi'], ['qizi ganda', 'qiziganda'],
    ['termo metr', 'termometr'], ['o‘l chang', 'o‘lchang'], ['an gidrid', 'angidrid'],
    ['ker ak', 'kerak'], ['sabab dan', 'sababdan'], ['ke tadi', 'ketadi'],
    ['tempe ratura', 'temperatura'], ['tem peratura', 'temperatura'], ['suv da', 'suvda'],
    ['suv dan', 'suvdan'], ['jara yoni', 'jarayoni'], ['pro porsionallik', 'proporsionallik'],
    ['sovi ganda', 'soviganda'], ['jara yonida', 'jarayonida'], ['chi qargan', 'chiqargan'],
    ['tem peraturali', 'temperaturali'], ['tash qariga', 'tashqariga'], ['alyu miniy', 'alyuminiy'],
    ['hiso biga', 'hisobiga'], ['ish lab', 'ishlab'], ['shu ning', 'shuning'],
    ['ola siz', 'olasiz'], ['za ryadlanishi', 'zaryadlanishi'], ['tayoq chaning', 'tayoqchaning'],
    ['mo ‘ynaga', 'mo‘ynaga'], ['bo‘ ladigan', 'bo‘ladigan'], ['ish qalangan', 'ishqalangan'],
    ['ki ritilgan', 'kiritilgan'], ['ma toga', 'matoga'], ['ruch ka', 'ruchka'],
    ['texni ka', 'texnika'], ['ele mentar', 'elementar'], ['zar yadlar', 'zaryadlar'],
    ['sha hri da', 'shahrida'], ['shahri da', 'shahrida'], ['Beruniy ning', 'Beruniyning'],
    ['Xorazm ning', 'Xorazmning'], ['sathi ni', 'sathini'], ['o‘lchov chi', 'o‘lchovchi'],
    ['baho langan', 'baholangan'], ['bobokalonlarimiz ning', 'bobokalonlarimizning'],
    ['isho namiz', 'ishonamiz'], ['egal lashga', 'egallashga'], ['davomi da', 'davomida'],
  ];

  const openingExperiments = {
    l1: 'Quyoshli kunda tayoq soyasining yo‘nalishi va uzunligini uch xil vaqtda o‘lchang. Natijalarni jadvalga yozib, O‘rta Osiyo astronomlari kuzatish va o‘lchashdan qanday foydalanganini izohlang.',
    l2: 'O‘zbekistonlik fizik olimlardan birini tanlang. Uning kashfiyoti yoki ilmiy yo‘nalishini bitta sodda tajriba, chizma yoki o‘lchash misoli bilan sinfdoshingizga tushuntiring.',
    l3: 'Stol uzunligini avval santimetrda, keyin metrda o‘lchang. Natijalarni SI birligiga keltiring va o‘lchash aniqligini chizg‘ich bo‘linmasi bilan baholang.',
    l4: 'Oddiy mayatnik yasang. Faqat ip uzunligini o‘zgartirib, 10 ta tebranish vaqtini o‘lchang; kuzatish, faraz, tajriba va xulosa bosqichlarini alohida yozing.',
    l5: 'Katakli qog‘ozda ikki xil yo‘nalishdagi vektorni strelka bilan chizing. Ularni parallelogramm usulida qo‘shing va natijani oddiy son kattaligi bilan taqqoslang.',
    l6: 'Xona rejasida 1 cm = 1 m masshtab tanlang. Ikki ketma-ket ko‘chishni vektorlar bilan chizib, natijaviy ko‘chishning uzunligi va yo‘nalishini aniqlang.',
  };

  function clean(value) {
    let text = String(value || '');
    for (const [wrong, right] of repairs) text = text.replaceAll(wrong, right);
    text = text.replace(/([A-Za-zÀ-ž‘’]{2,})-\s+([a-zà-ž‘’]{2,})/g, '$1$2');
    text = text.replace(/\s+([,.;:!?])/g, '$1').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
    return text.replace(/\s{2,}/g, ' ').trim();
  }

  for (const lesson of course.lessons) {
    for (const field of ['summary', 'formulaExplanation', 'relationship', 'application', 'experiment', 'experimentQuestion', 'experimentExplanation']) {
      lesson[field] = clean(lesson[field]);
    }
    lesson.paragraphs = (lesson.paragraphs || []).map(clean);
    lesson.theoryBlocks = (lesson.theoryBlocks || []).map(block => ({...block, text: clean(block.text)}));
    const repeatedTitle = lesson.title.toLocaleUpperCase('uz-UZ');
    if (lesson.summary.toLocaleUpperCase('uz-UZ').startsWith(repeatedTitle)) {
      lesson.summary = lesson.summary.slice(repeatedTitle.length).trim();
    }
    if (openingExperiments[lesson.id]) {
      lesson.experiment = openingExperiments[lesson.id];
      lesson.experimentQuestion = `Tajriba natijasi “${lesson.title}” mavzusidagi asosiy fikrni qanday tasdiqladi?`;
      lesson.experimentExplanation = `${lesson.relationship} Kuzatish va o‘lchash natijasini shu qoida asosida izohlang.`;
    }
  }
})();

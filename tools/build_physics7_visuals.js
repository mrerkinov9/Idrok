const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'physics7', 'visuals');
fs.mkdirSync(outDir, {recursive: true});

const lessons = [
  ['Allomalar va fizika tarixi','Kuzatish • o‘lchash • hisoblash','timeline'],
  ['O‘zbekiston fizik olimlari','Ilmiy maktablar va kashfiyotlar','scientists'],
  ['Fizik kattaliklar va SI','Qiymat = son × birlik','measure'],
  ['Fizik tadqiqot metodlari','Kuzatish → faraz → tajriba → xulosa','method'],
  ['Skalyar va vektor kattaliklar','Vektor: qiymat va yo‘nalish','vectors'],
  ['Vektorlar bilan masala','Natijaviy vektor','vectorSum'],
  ['Mexanik harakat','Vaziyat vaqt davomida o‘zgaradi','motion'],
  ['Trayektoriya, yo‘l va ko‘chish','Yo‘l va ko‘chish bir xil emas','trajectory'],
  ['Tekis harakat','v = s / t','speed'],
  ['Tekis harakat masalalari','s = vt','speedTask'],
  ['Notekis harakat','v o‘rt = s umumiy / t umumiy','uneven'],
  ['O‘rtacha tezlik tajribasi','Masofa va vaqtni o‘lchash','ramp'],
  ['Notekis harakat masalalari','Harakat qismlarini qo‘shish','segments'],
  ['Aylana bo‘ylab harakat','T = t / N   •   ν = N / t','circle'],
  ['Aylanma harakat masalalari','v = 2πR / T','wheel'],
  ['Massa','Jism inertligining o‘lchovi','mass'],
  ['Zichlik','ρ = m / V','density'],
  ['Zichlikni aniqlash','Massa va hajmni o‘lchash','densityLab'],
  ['Jismlarning o‘zaro ta’siri','F = ma','force'],
  ['Bosim','p = F / S','pressure'],
  ['Bosim masalalari','Yuza kichraysa, bosim ortadi','pressureTask'],
  ['Paskal qonuni','Bosim barcha tomonga uzatiladi','hydraulic'],
  ['Suyuqlik bosimi','p = ρgh','waterPressure'],
  ['Suyuqlik bosimi masalalari','Chuqurlik ortsa, bosim ortadi','aquarium'],
  ['Atmosfera bosimi','Havo ham bosim beradi','barometer'],
  ['Mexanik ish','A = Fs','work'],
  ['Mexanik energiya','Ek = mv²/2   •   Ep = mgh','energy'],
  ['Energiya masalalari','Ek + Ep = o‘zgarmas','energyBars'],
  ['Mexanik quvvat','P = A / t','power'],
  ['Ish va quvvat masalalari','Bir xil ish, turli vaqt','stairs'],
  ['Ichki energiya','Zarralar harakati va ta’siri','particles'],
  ['Issiqlik miqdori','Q = cmΔT','calorimeter'],
  ['Issiqlik masalalari','Temperatura grafigi','heatGraph'],
  ['Issiqlik almashinuvi','Q bergan = Q olgan','mixing'],
  ['Yoqilg‘ining yonish issiqligi','Q = qm','fuel'],
  ['Bug‘lanish va qaynash','Suyuqlik → bug‘','boiling'],
  ['Erish va qotish','Q = λm','melting'],
  ['Fazaviy o‘tishlar','Isitish bosqichlari','phaseGraph'],
  ['Jismlarning elektrlanishi','Elektron almashinuvi','rubCharge'],
  ['Elektr zaryad','q = ±Ne','charges'],
  ['Elektroskop va elektrometr','Zaryadni aniqlash','electroscope'],
  ['O‘tkazgich va dielektrik','Erkin va bog‘langan zaryadlar','conductor'],
  ['Zaryadlarning o‘zaro ta’siri','Bir xil itaradi, har xil tortadi','chargeForce'],
  ['O‘tkazgichda zaryad taqsimoti','Zaryad sirt bo‘ylab tarqaladi','faraday'],
  ['Tabiatdagi elektr hodisalar','Bulutlar orasidagi razryad','lightning'],
  ['Elektr toki','Zaryadlarning tartibli harakati','current'],
  ['Tok manbalari','Energiyani elektr energiyaga aylantirish','battery'],
  ['Elektr kuchlanish','Voltmetr parallel ulanadi','voltage'],
  ['Tok kuchi','Ampermetr ketma-ket ulanadi','amperage'],
  ['Tok va kuchlanish masalalari','A = UIt','circuitTask'],
  ['Tok va kuchlanishni o‘lchash','Ampermetr va voltmetr','meters'],
  ['Elektr qarshilik','R = ρl / S','wire'],
  ['Rezistor va reostat','Qarshilikni boshqarish','rheostat'],
  ['Om qonuni','I = U / R','ohm'],
  ['Om qonuni masalalari','U, I va R bog‘lanishi','ohmTriangle'],
  ['Reostat bilan tokni rostlash','R ortsa, I kamayadi','rheostatLab'],
  ['Om qonuni laboratoriyasi','U–I grafigi','ohmGraph'],
  ['Yorug‘likning tarqalishi','Bir jinsli muhitda to‘g‘ri chiziq','lightRays'],
  ['Quyosh va Oy tutilishi','Soya va yarimsoya','eclipse'],
  ['Qaytish va sinish','α = β','refraction'],
  ['Linza','D = 1 / F','lens'],
  ['Yassi ko‘zguda qaytish','Tushish burchagi = qaytish burchagi','mirror'],
];

const palettes = [
  ['#5b4be7','#18b6aa','#0d1330'],
  ['#e55c8a','#ffb84d','#1a1029'],
  ['#168fa2','#60d394','#071d2a'],
  ['#ef7a45','#f6c85f','#21110c'],
  ['#3478f6','#8a63ff','#0b1633'],
];

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const arrow = (x1,y1,x2,y2,color='url(#accent)',width=9) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" marker-end="url(#arrow)"/>`;
const label = (x,y,text,size=24,anchor='middle',fill='#eaf0ff') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-size="${size}" font-weight="650">${esc(text)}</text>`;
const dot = (x,y,r=12,fill='url(#accent)') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

function graph(points, color='url(#accent)') {
  return `<path d="M180 485H680M180 485V150" fill="none" stroke="#8090b8" stroke-width="4"/>
    <path d="${points}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    ${dot(180,485,8)}${dot(680,150,8)}`;
}

function scene(type) {
  const commonBox = `<rect x="140" y="135" width="590" height="390" rx="30" fill="#ffffff0a" stroke="#ffffff24" stroke-width="3"/>`;
  const scenes = {
    timeline: `${commonBox}<path d="M195 350H675" stroke="#b8c4e8" stroke-width="5"/>${[220,365,510,650].map((x,i)=>`${dot(x,350,18)}${label(x,410,['Al-Xorazmiy','Beruniy','Farg‘oniy','Ulug‘bek'][i],20)}`).join('')}<path d="M525 205a78 78 0 1 0 0 1M525 205l50-35" fill="none" stroke="url(#accent)" stroke-width="12" stroke-linecap="round"/>`,
    scientists: `${commonBox}<circle cx="325" cy="300" r="92" fill="#ffffff12" stroke="url(#accent)" stroke-width="8"/><path d="M270 448c20-90 170-90 190 0" fill="#ffffff12" stroke="url(#accent)" stroke-width="8"/><path d="M520 220h130v190H520z" fill="#ffffff0c" stroke="#85e4d7" stroke-width="7"/><path d="M545 370l35-70 28 38 30-88" fill="none" stroke="#ffbe63" stroke-width="10"/>`,
    measure: `${commonBox}<path d="M210 260H650v90H210z" fill="#ffffff10" stroke="url(#accent)" stroke-width="8"/>${[230,300,370,440,510,580,650].map((x,i)=>`<path d="M${x} 260v${i%2?35:55}" stroke="#dfe8ff" stroke-width="5"/>`).join('')}${label(430,430,'1 m = 100 cm',38)}`,
    method: `${commonBox}${[['Kuzatish',280,230],['Faraz',585,230],['Tajriba',585,425],['Xulosa',280,425]].map(([t,x,y])=>`<rect x="${x-85}" y="${y-42}" width="170" height="84" rx="24" fill="#ffffff10" stroke="url(#accent)" stroke-width="5"/>${label(x,y+8,t,25)}`).join('')}${arrow(375,230,485,230)}${arrow(585,280,585,340)}${arrow(495,425,385,425)}${arrow(280,345,280,285)}`,
    vectors: `${commonBox}${arrow(245,430,520,430,'#59d8ca',12)}${arrow(245,430,400,225,'#ffb75d',12)}${label(535,438,'a',30,'start')}${label(405,215,'b',30,'start')}${label(430,495,'qiymat + yo‘nalish',24)}`,
    vectorSum: `${commonBox}${arrow(235,440,470,440,'#59d8ca',10)}${arrow(470,440,610,245,'#ffb75d',10)}${arrow(235,440,610,245,'#9a7bff',13)}${label(420,500,'a + b = c',34)}`,
    motion: `${commonBox}<path d="M190 430H680" stroke="#7787ae" stroke-width="10" stroke-linecap="round"/><rect x="250" y="335" width="150" height="75" rx="18" fill="#5f75ff"/><circle cx="285" cy="420" r="24" fill="#dce4ff"/><circle cx="370" cy="420" r="24" fill="#dce4ff"/>${arrow(420,370,625,370,'#5de0cf',10)}${label(430,245,'x₁',30)}${label(620,245,'x₂',30)}`,
    trajectory: `${commonBox}<path d="M205 440C300 170 510 520 665 210" fill="none" stroke="#ffbd5d" stroke-width="10" stroke-dasharray="18 14"/>${arrow(205,440,665,210,'#5fe2d1',11)}${label(345,510,'yo‘l',25)}${label(510,320,'ko‘chish',25)}`,
    speed: `${commonBox}${graph('M180 485L680 170')}${label(445,545,'masofa',22)}${label(140,180,'vaqt',22,'middle')}`,
    speedTask: `${commonBox}<path d="M200 420H660" stroke="#7787ae" stroke-width="8"/>${arrow(240,360,620,360,'#64decf',11)}${label(430,285,'s = vt',46)}${label(240,455,'0 m',22)}${label(620,455,'180 m',22)}`,
    uneven: `${commonBox}${graph('M180 485L300 420L390 260L505 230L680 155','#ffb75d')}${label(440,545,'vaqt',22)}${label(132,170,'yo‘l',22)}`,
    ramp: `${commonBox}<path d="M205 440L650 210" stroke="#8797bd" stroke-width="16"/><rect x="350" y="300" width="105" height="60" rx="15" fill="#5f75ff" transform="rotate(-27 402 330)"/><circle cx="365" cy="357" r="17" fill="#dce4ff"/><circle cx="435" cy="321" r="17" fill="#dce4ff"/>${arrow(300,470,590,470,'#5de0cf',9)}${label(445,510,'s',30)}`,
    segments: `${commonBox}<path d="M185 390H685" stroke="#7787ae" stroke-width="8"/>${[210,365,520,665].map(x=>dot(x,390,13)).join('')}${label(285,340,'s₁,t₁',26)}${label(445,340,'s₂,t₂',26)}${label(595,340,'s₃,t₃',26)}${label(435,485,'v o‘rt = Σs / Σt',34)}`,
    circle: `${commonBox}<circle cx="430" cy="330" r="155" fill="none" stroke="#ffffff28" stroke-width="9"/>${dot(430,330,13,'#ffffff')}${dot(565,250,28)}${arrow(430,330,565,250,'#ffb75d',8)}${arrow(565,250,640,360,'#5de0cf',8)}${label(435,515,'davr T • chastota ν',28)}`,
    wheel: `${commonBox}<circle cx="430" cy="330" r="150" fill="none" stroke="url(#accent)" stroke-width="16"/><circle cx="430" cy="330" r="28" fill="#eaf0ff"/><path d="M430 180v300M280 330h300M325 225l210 210M535 225L325 435" stroke="#ffffff42" stroke-width="6"/>${label(430,535,'2πR — bir aylanish yo‘li',27)}`,
    mass: `${commonBox}<path d="M230 430H640" stroke="#8694b8" stroke-width="12"/><path d="M435 200v230" stroke="#e8edff" stroke-width="10"/><path d="M275 295h320" stroke="url(#accent)" stroke-width="12"/><path d="M295 295l-55 115h110zM575 295l-55 115h110z" fill="#ffffff10" stroke="#e8edff" stroke-width="6"/>${label(430,500,'massa — kg',34)}`,
    density: `${commonBox}<rect x="245" y="250" width="150" height="150" fill="#5c74ff" rx="12"/><rect x="500" y="315" width="95" height="95" fill="#5fd9c9" rx="12"/>${label(320,225,'katta massa',23)}${label(548,290,'kichik massa',23)}${label(430,495,'ρ = m / V',42)}`,
    densityLab: `${commonBox}<path d="M230 220h180v250H230z" fill="#4fa9ff25" stroke="#8bdcff" stroke-width="7"/><path d="M230 330h180v140H230z" fill="#4fa9ff66"/><rect x="280" y="275" width="80" height="110" rx="10" fill="#ffb75d"/><path d="M500 230h150v240H500z" fill="#ffffff08" stroke="#dce5ff" stroke-width="7"/>${label(575,345,'m',55)}${label(320,520,'V — siqib chiqargan suv',24)}`,
    force: `${commonBox}<rect x="345" y="290" width="180" height="150" rx="18" fill="#5c74ff"/><path d="M190 440H680" stroke="#8795b7" stroke-width="9"/>${arrow(325,355,205,355,'#ffb75d',11)}${arrow(545,355,665,355,'#5de0cf',11)}${label(430,510,'kuch harakatni o‘zgartiradi',27)}`,
    pressure: `${commonBox}<rect x="315" y="235" width="230" height="160" rx="18" fill="#5c74ff"/><path d="M315 395h230" stroke="#ffb75d" stroke-width="18"/>${arrow(430,170,430,225,'#5de0cf',12)}${label(430,465,'p = F / S',42)}`,
    pressureTask: `${commonBox}<path d="M260 200l150 250h-210z" fill="#ffb75d" stroke="#ffe0a8" stroke-width="5"/><path d="M525 200l45 250h-90z" fill="#5de0cf" stroke="#c9fff7" stroke-width="5"/>${label(305,505,'katta yuza — kichik bosim',22)}${label(525,545,'kichik yuza — katta bosim',22)}`,
    hydraulic: `${commonBox}<path d="M220 300h140v170H220zM500 220h170v250H500zM360 430h140" fill="#47a9ff35" stroke="#8bdcff" stroke-width="8"/><path d="M235 360h110v110M515 330h140v140" fill="#4daeff75"/><path d="M245 270h90M525 190h120" stroke="url(#accent)" stroke-width="18"/>${arrow(290,180,290,255,'#ffb75d',10)}${arrow(585,315,585,235,'#5de0cf',10)}`,
    waterPressure: `${commonBox}<path d="M220 190h420v285H220z" fill="#4caaff22" stroke="#9adfff" stroke-width="8"/><path d="M220 270h420v205H220z" fill="#4caaff66"/>${[315,375,435].map((y,i)=>`${dot(560,y,10,'#fff')}${arrow(575,y,650+i*15,y,'#ffb75d',6)}`).join('')}${label(420,520,'chuqurlik ↑  bosim ↑',30)}`,
    aquarium: `${commonBox}<path d="M230 210h400v260H230z" fill="#4caaff2f" stroke="#9adfff" stroke-width="8"/><path d="M230 285h400v185H230z" fill="#4caaff62"/><circle cx="365" cy="365" r="32" fill="#ffb75d"/><path d="M397 365l55-32v64z" fill="#ffb75d"/>${arrow(535,325,660,325,'#ffe06c',6)}${arrow(535,420,690,420,'#ff8d61',9)}`,
    barometer: `${commonBox}<path d="M350 455V190h160v265" fill="#ffffff0b" stroke="#dce5ff" stroke-width="8"/><path d="M390 455V260h80v195" fill="#5c74ff"/><circle cx="430" cy="455" r="80" fill="#5c74ff"/>${arrow(250,250,330,250,'#5de0cf',8)}${arrow(610,250,530,250,'#5de0cf',8)}${label(430,555,'atmosfera bosimi',28)}`,
    work: `${commonBox}<rect x="315" y="350" width="220" height="130" rx="18" fill="#5c74ff"/>${arrow(425,350,425,190,'#ffb75d',12)}${arrow(565,430,660,310,'#5de0cf',10)}${label(430,535,'A = F · s',42)}`,
    energy: `${commonBox}<path d="M190 470C300 180 520 180 680 470" fill="none" stroke="#7483aa" stroke-width="18"/><circle cx="275" cy="315" r="34" fill="#ffb75d"/><circle cx="570" cy="320" r="34" fill="#5de0cf"/>${label(275,260,'Ep',30)}${label(570,260,'Ek',30)}${label(430,530,'energiya saqlanadi',30)}`,
    energyBars: `${commonBox}${[['Ep',260,210,210],['Ek',390,330,90],['E',520,170,250]].map(([t,x,y,h])=>`<rect x="${x}" y="${y}" width="85" height="${h}" rx="14" fill="${t==='Ep'?'#ffb75d':t==='Ek'?'#5de0cf':'#8b72ff'}"/>${label(x+42,485,t,25)}`).join('')}${label(430,535,'Ep + Ek = E',34)}`,
    power: `${commonBox}<path d="M250 455v-80h90v-90h90v-90h90v-70" fill="none" stroke="#8795b7" stroke-width="18"/>${arrow(250,430,535,145,'#5de0cf',11)}${label(430,520,'P = A / t',42)}`,
    stairs: `${commonBox}<path d="M205 455v-70h95v-70h95v-70h95v-70h120" fill="none" stroke="#8795b7" stroke-width="18"/><circle cx="335" cy="270" r="28" fill="#ffb75d"/><circle cx="525" cy="135" r="28" fill="#5de0cf"/>${label(335,520,'sekin',26)}${label(525,520,'tez — quvvat katta',26)}`,
    particles: `${commonBox}${Array.from({length:28},(_,i)=>dot(220+(i*83)%430,190+(i*67)%250,8+(i%3)*2,i%2?'#5de0cf':'#ffb75d')).join('')}${arrow(285,495,575,495,'#8b72ff',8)}${label(430,545,'harakat tezligi ↑  ichki energiya ↑',25)}`,
    calorimeter: `${commonBox}<path d="M255 230h250v250H255z" fill="#4caaff25" stroke="#dce5ff" stroke-width="8"/><path d="M255 335h250v145H255z" fill="#4caaff65"/><path d="M550 190v250" stroke="#ff6f65" stroke-width="12"/><circle cx="550" cy="455" r="34" fill="#ff6f65"/>${arrow(350,530,510,530,'#ffb75d',8)}${label(430,580,'Q = cmΔT',36)}`,
    heatGraph: `${commonBox}${graph('M180 485L310 400L440 305L560 215L680 150','#ff785f')}${label(435,540,'Q',26)}${label(135,175,'T',26)}`,
    mixing: `${commonBox}<path d="M215 245h170v220H215z" fill="#ef695b55" stroke="#ff9a84" stroke-width="7"/><path d="M485 245h170v220H485z" fill="#4caaff55" stroke="#8bdcff" stroke-width="7"/>${arrow(385,350,455,350,'#ffb75d',8)}${arrow(485,390,415,390,'#5de0cf',8)}${label(300,520,'issiq',26)}${label(570,520,'sovuq',26)}`,
    fuel: `${commonBox}<path d="M430 160c-90 125-130 180-130 260a130 130 0 0 0 260 0c0-72-37-128-89-208-10 80-55 92-41-52z" fill="url(#fire)"/>${label(430,540,'Q = q · m',42)}`,
    boiling: `${commonBox}<path d="M255 300h350v185H255z" fill="#4caaff55" stroke="#dce5ff" stroke-width="8"/>${[310,385,465,540].map((x,i)=>`<circle cx="${x}" cy="${430-i*35}" r="${18+i*3}" fill="none" stroke="#dff7ff" stroke-width="5"/>`).join('')}<path d="M320 260c-35-50 30-70 0-120M430 260c-35-50 30-70 0-120M540 260c-35-50 30-70 0-120" fill="none" stroke="#dff7ff" stroke-width="8"/>`,
    melting: `${commonBox}<path d="M250 240l160-70 160 70-160 70zM250 240v170l160 80 160-80V240" fill="#78d9ff44" stroke="#bceeff" stroke-width="7"/><path d="M590 350c40 65 55 90 55 122a56 56 0 0 1-112 0c0-32 17-61 57-122z" fill="#4caaff"/>${label(410,555,'qattiq ↔ suyuq',32)}`,
    phaseGraph: `${commonBox}${graph('M180 485L300 390L430 390L560 270L680 270','#ff8c64')}${label(360,365,'erish',22)}${label(620,245,'qaynash',22)}`,
    rubCharge: `${commonBox}<path d="M250 410c110-50 180-155 250-215" stroke="#ffb75d" stroke-width="28" stroke-linecap="round"/><ellipse cx="560" cy="260" rx="85" ry="115" fill="#8b72ff"/><path d="M560 375v100" stroke="#dce5ff" stroke-width="7"/>${['−','−','+','−','+'].map((t,i)=>label(330+i*55,470-(i%2)*38,t,34)).join('')}`,
    charges: `${commonBox}<circle cx="305" cy="330" r="95" fill="#5c74ff"/>${label(305,350,'+',60)}<circle cx="555" cy="330" r="95" fill="#ef647c"/>${label(555,350,'−',60)}${arrow(420,330,365,330,'#5de0cf',8)}${arrow(440,330,495,330,'#ffb75d',8)}`,
    electroscope: `${commonBox}<circle cx="430" cy="205" r="55" fill="#ffb75d"/><path d="M430 260v145M430 405l-75 80M430 405l75 80" stroke="#dce5ff" stroke-width="12" stroke-linecap="round"/>${['+','+','+','+'].map((t,i)=>label(350+i*55,550,t,30)).join('')}`,
    conductor: `${commonBox}<rect x="205" y="240" width="230" height="170" rx="25" fill="#5c74ff55" stroke="#8193ff" stroke-width="7"/>${Array.from({length:12},(_,i)=>dot(235+(i%4)*55,275+Math.floor(i/4)*55,9,'#5de0cf')).join('')}<rect x="485" y="240" width="180" height="170" rx="25" fill="#ffb75d3d" stroke="#ffcb7c" stroke-width="7"/>${Array.from({length:9},(_,i)=>`<circle cx="${520+(i%3)*55}" cy="${280+Math.floor(i/3)*55}" r="14" fill="none" stroke="#ffcb7c" stroke-width="5"/>`).join('')}${label(320,470,'o‘tkazgich',24)}${label(575,470,'dielektrik',24)}`,
    chargeForce: `${commonBox}<circle cx="285" cy="315" r="68" fill="#5c74ff"/>${label(285,335,'+',48)}<circle cx="575" cy="315" r="68" fill="#ef647c"/>${label(575,335,'−',48)}${arrow(390,315,350,315,'#5de0cf',8)}${arrow(470,315,510,315,'#ffb75d',8)}${label(430,480,'qarama-qarshi zaryadlar tortishadi',25)}`,
    faraday: `${commonBox}<path d="M235 450V245L430 155l195 90v205z" fill="#5c74ff20" stroke="#8a9cff" stroke-width="10"/>${Array.from({length:18},(_,i)=>label(270+(i%6)*65,230+Math.floor(i/6)*110,i%2?'+':'−',25)).join('')}<circle cx="430" cy="350" r="48" fill="#ffffff12" stroke="#dce5ff" stroke-width="6"/>${label(430,365,'E = 0',25)}`,
    lightning: `${commonBox}<path d="M245 245c10-70 90-92 142-45 40-80 165-45 158 35 80-8 112 85 52 128H235c-70-35-55-118 10-118z" fill="#8b72ff66" stroke="#b7a9ff" stroke-width="7"/><path d="M450 340l-70 105h55l-45 95 120-135h-62l50-65z" fill="#ffe26a"/>`,
    current: `${commonBox}<path d="M230 335H630" stroke="#9aa9cc" stroke-width="40" stroke-linecap="round"/>${Array.from({length:8},(_,i)=>`${dot(270+i*48,335,10,'#5de0cf')}${arrow(270+i*48,290,305+i*48,290,'#ffb75d',4)}`).join('')}${label(430,455,'I = q / t',42)}`,
    battery: `${commonBox}<rect x="300" y="230" width="260" height="200" rx="25" fill="#ffffff0c" stroke="#dce5ff" stroke-width="8"/><rect x="365" y="195" width="55" height="35" fill="#dce5ff"/><rect x="445" y="175" width="55" height="55" fill="#dce5ff"/>${label(390,355,'−',60)}${label(480,355,'+',60)}${label(430,495,'kimyoviy → elektr',30)}`,
    voltage: `${commonBox}<circle cx="430" cy="330" r="130" fill="#ffffff0c" stroke="url(#accent)" stroke-width="10"/>${label(430,355,'V',72)}<path d="M255 330H180v170h500V330h-75" fill="none" stroke="#dce5ff" stroke-width="9"/>${label(430,545,'parallel ulanish',28)}`,
    amperage: `${commonBox}<circle cx="430" cy="330" r="115" fill="#ffffff0c" stroke="url(#accent)" stroke-width="10"/>${label(430,355,'A',72)}<path d="M180 330h135M545 330h135" stroke="#dce5ff" stroke-width="10"/>${label(430,500,'ketma-ket ulanish',28)}`,
    circuitTask: `${commonBox}<path d="M220 240h420v250H220z" fill="none" stroke="#dce5ff" stroke-width="10"/><path d="M220 315h55M275 285v60M300 300v30M640 315h-80" stroke="#ffb75d" stroke-width="9"/><circle cx="430" cy="240" r="45" fill="#5c74ff"/>${label(430,255,'I',30)}${label(430,550,'A = UIt',42)}`,
    meters: `${commonBox}<path d="M205 245h460v250H205z" fill="none" stroke="#dce5ff" stroke-width="9"/><circle cx="335" cy="245" r="48" fill="#5c74ff"/>${label(335,260,'A',30)}<circle cx="525" cy="370" r="48" fill="#ffb75d"/>${label(525,385,'V',30)}<rect x="390" y="330" width="90" height="80" rx="12" fill="#8b72ff"/>`,
    wire: `${commonBox}<path d="M220 310H650" stroke="#ffb75d" stroke-width="34" stroke-linecap="round"/><path d="M220 410H650" stroke="#5de0cf" stroke-width="13" stroke-linecap="round"/>${label(430,250,'uzunlik l',28)}${label(430,490,'kesim yuzi S',28)}${label(430,555,'R = ρl / S',38)}`,
    rheostat: `${commonBox}<path d="M240 360c35-120 70 120 105 0s70 120 105 0 70 120 105 0 70 120 105 0" fill="none" stroke="#ffb75d" stroke-width="12"/><path d="M430 195v125" stroke="#5de0cf" stroke-width="12"/>${arrow(430,195,430,315,'#5de0cf',10)}${label(430,500,'surilgich qarshilikni o‘zgartiradi',26)}`,
    ohm: `${commonBox}<path d="M210 455H660M210 455V175" stroke="#8b98ba" stroke-width="6"/>${arrow(220,445,625,205,'#5de0cf',10)}${label(675,470,'U',28)}${label(190,165,'I',28)}${label(430,535,'I = U / R',38)}`,
    ohmTriangle: `${commonBox}<path d="M430 175l205 310H225z" fill="#ffffff0a" stroke="url(#accent)" stroke-width="9"/><path d="M325 330h210M430 175v155" stroke="#dce5ff" stroke-width="5"/>${label(430,285,'U',55)}${label(330,430,'I',55)}${label(530,430,'R',55)}`,
    rheostatLab: `${commonBox}<path d="M220 280h420v190H220z" fill="none" stroke="#dce5ff" stroke-width="9"/><path d="M300 280c25-80 50 80 75 0s50 80 75 0 50 80 75 0" fill="none" stroke="#ffb75d" stroke-width="10"/><path d="M430 150v95" stroke="#5de0cf" stroke-width="10"/>${arrow(430,150,430,240,'#5de0cf',8)}<circle cx="590" cy="375" r="48" fill="#5c74ff"/>${label(590,390,'A',30)}`,
    ohmGraph: `${commonBox}${graph('M180 485L680 170','#5de0cf')}${[0,1,2,3,4].map(i=>dot(180+i*125,485-i*79,10,'#ffb75d')).join('')}${label(430,545,'o‘lchov nuqtalari',26)}`,
    lightRays: `${commonBox}<circle cx="245" cy="330" r="55" fill="#ffe26a"/><path d="M300 330H680M275 290L650 180M275 370L650 480" stroke="#ffe26a" stroke-width="9" stroke-linecap="round"/><rect x="520" y="150" width="24" height="360" fill="#dce5ff"/><circle cx="544" cy="330" r="52" fill="#10162b"/>`,
    eclipse: `${commonBox}<circle cx="220" cy="330" r="95" fill="#ffe26a"/><circle cx="455" cy="330" r="45" fill="#dce5ff"/><circle cx="650" cy="330" r="76" fill="#4d7ee8"/><path d="M265 270L650 255M265 390L650 405" stroke="#ffcf65" stroke-width="5"/><path d="M500 300L650 280V380L500 360z" fill="#00000055"/>${label(430,520,'Quyosh — Oy — Yer',28)}`,
    refraction: `${commonBox}<path d="M180 350H680" stroke="#8bdcff" stroke-width="8"/><path d="M430 155V520" stroke="#ffffff55" stroke-width="5" stroke-dasharray="14 12"/><path d="M250 185L430 350L610 225M430 350L540 500" fill="none" stroke="#ffe26a" stroke-width="10" stroke-linecap="round"/>${label(295,210,'tushgan nur',22)}${label(560,210,'qaytgan nur',22)}${label(555,510,'singan nur',22)}`,
    lens: `${commonBox}<path d="M430 145c-90 75-90 295 0 370 90-75 90-295 0-370z" fill="#4caaff55" stroke="#9adfff" stroke-width="8"/><path d="M180 245H430L650 330M180 330H650M180 415H430L650 330" fill="none" stroke="#ffe26a" stroke-width="8"/><circle cx="650" cy="330" r="14" fill="#ffb75d"/>${label(650,380,'F',28)}`,
    mirror: `${commonBox}<path d="M430 155V500" stroke="#b7c7ea" stroke-width="18"/><path d="M430 155V500" stroke="#ffffff" stroke-width="4"/><path d="M430 330L255 195M430 330L605 195" stroke="#ffe26a" stroke-width="10"/><path d="M180 330H680" stroke="#ffffff55" stroke-width="5" stroke-dasharray="12 12"/>${label(315,260,'α',36)}${label(545,260,'β',36)}${label(430,555,'α = β',42)}`,
  };
  return scenes[type] || scenes.method;
}

function makeSvg(index, title, subtitle, type) {
  const palette = palettes[Math.floor(index / 15) % palettes.length];
  const [a,b,bg] = palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title><desc id="desc">${esc(subtitle)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#101936"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <linearGradient id="fire" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#ff563d"/><stop offset=".55" stop-color="#ffb536"/><stop offset="1" stop-color="#fff08b"/></linearGradient>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${b}"/></marker>
    <filter id="glow"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="1200" height="675" rx="36" fill="url(#bg)"/>
  <circle cx="155" cy="80" r="180" fill="${a}" opacity=".16" filter="url(#glow)"/>
  <circle cx="1030" cy="610" r="210" fill="${b}" opacity=".13" filter="url(#glow)"/>
  <rect x="42" y="42" width="84" height="48" rx="17" fill="url(#accent)"/>
  <text x="84" y="76" text-anchor="middle" fill="#fff" font-family="Inter,Arial,sans-serif" font-size="22" font-weight="800">${String(index + 1).padStart(2,'0')}</text>
  <text x="155" y="78" fill="#ffffff" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="750">7-SINF FIZIKA</text>
  <g font-family="Inter,Arial,sans-serif">${scene(type)}</g>
  <g transform="translate(780 160)" font-family="Inter,Arial,sans-serif">
    <rect width="360" height="360" rx="30" fill="#ffffff0d" stroke="#ffffff26" stroke-width="3"/>
    <text x="38" y="60" fill="${b}" font-size="17" font-weight="800" letter-spacing="2">MAVZUGA OID CHIZMA</text>
    <foreignObject x="36" y="90" width="290" height="140"><div xmlns="http://www.w3.org/1999/xhtml" style="font:800 31px/1.22 Inter,Arial,sans-serif;color:#fff">${esc(title)}</div></foreignObject>
    <path d="M38 250H322" stroke="#ffffff22" stroke-width="2"/>
    <foreignObject x="36" y="275" width="290" height="65"><div xmlns="http://www.w3.org/1999/xhtml" style="font:650 21px/1.35 Inter,Arial,sans-serif;color:#cbd6f5">${esc(subtitle)}</div></foreignObject>
  </g>
  <text x="68" y="620" fill="#aebbdc" font-family="Inter,Arial,sans-serif" font-size="18">Idrok • mavzuni tushunish uchun vizual model</text>
</svg>`;
}

lessons.forEach(([title, subtitle, type], index) => {
  fs.writeFileSync(path.join(outDir, `lesson-${String(index + 1).padStart(2,'0')}.svg`), makeSvg(index, title, subtitle, type), 'utf8');
});

console.log(`Yaratildi: ${lessons.length} ta mavzuga mos SVG chizma.`);

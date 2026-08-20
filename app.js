const courses = [
  {id:'physics7',category:'fizika',tone:'yellow',number:'01',icon:'↗',tag:'FIZIKA',title:'7-sinf Fizika',description:'5 bob va 62 dars: mexanik harakat, kuch va energiya, issiqlik, elektr hamda optikani to‘liq nazariya, rasmlar, masalalar, videolar, tajribalar, simulyatsiyalar va quizlar bilan o‘rganing.',lessons:62,level:'To‘liq kurs',impulse:7520,lesson:'Fizika tabiat hodisalarini tajriba, kuzatish va o‘lchash orqali o‘rganadi.',fact:'7-sinf kursi fizikaning asosiy tushunchalarini ketma-ket va amaliy usulda o‘rgatadi.',question:'Fizik tadqiqot nimadan boshlanadi?',options:['Kuzatish va tajribadan','Faqat yodlashdan','Taxminiy javobdan'],answer:0},
  {id:'physics8',category:'fizika',tone:'purple',number:'02',icon:'↗',tag:'FIZIKA',title:'8-sinf Fizika',description:'5 bob va 60 dars: elektr zaryad, elektr toki, energiya, turli muhitlardagi tok va magnit maydonni to‘liq nazariya, masala, o‘zbekcha video, tajriba, simulyatsiya va quizlar bilan o‘rganing.',lessons:60,level:'To‘liq kurs',impulse:7800,lesson:'Elektr va magnit hodisalar zaryadlarning o‘zaro ta’siri va harakati bilan tushuntiriladi.',fact:'8-sinf kursi kundalik elektr qurilmalarining qanday ishlashini tajriba orqali ochib beradi.',question:'Elektr toki nima?',options:['Zaryadlarning tartibli harakati','Jismlarning sovishi','Yorug‘likning sinishi'],answer:0},
  {id:'mexanika',category:'fizika',tone:'green',number:'03',icon:'↗',tag:'FIZIKA',title:'9-sinf Fizika',description:'6 bob va 59 darsni to‘liq nazariya, chizmalar, videolar, tajribalar, simulyatsiyalar va bosqichli quizlar bilan o‘rganing.',lessons:59,level:'To‘liq kurs',impulse:8250,lesson:'Moddalar atom va molekulalardan tashkil topgan.',fact:'To‘liq 9-sinf fizika kursini ochish uchun kartani bosing.',question:'Molekulalar qanday harakat qiladi?',options:['Tartibsiz va uzluksiz','Harakatsiz','Faqat yuqoriga'],answer:0},
  {id:'physics10',category:'fizika',tone:'blue',number:'04',icon:'↗',tag:'FIZIKA',title:'10-sinf Fizika',description:'7 bob va 59 dars: dinamika, tebranishlar, gidrodinamika, elektr toki va magnit maydonni nazariya, masala, video, tajriba hamda simulyatsiyalar bilan o‘rganing.',lessons:59,level:'To‘liq kurs',impulse:8250,lesson:'Kuchlar, tebranishlar, suyuqliklar, elektr va magnit hodisalarni tajribalar orqali boshqaring.',fact:'10-sinf kursida fizik qonunlar o‘lchash, masala va interaktiv laboratoriyalar orqali mustahkamlanadi.',question:'Kuchlarning vektor yig‘indisi nima deyiladi?',options:['Natijaviy kuch','Bosim','Quvvat'],answer:0},
  {id:'physics11',category:'fizika',tone:'purple',number:'05',icon:'↗',tag:'FIZIKA',title:'11-sinf Fizika',description:'7 bob va 45 dars: magnit maydon, elektromagnit induksiya, tebranishlar, to‘lqin optikasi, nisbiylik, kvant va yadro fizikasini to‘liq o‘rganing.',lessons:45,level:'To‘liq kurs',impulse:8800,lesson:'Klassik elektromagnetizmdan kvant va yadro fizikasigacha bo‘lgan qonuniyatlarni tajriba va masalalarda tekshiring.',fact:'11-sinf kursi zamonaviy fizikaning nisbiylik, foton, atom va yadro tushunchalarini bir yo‘lda bog‘laydi.',question:'Foton energiyasi qaysi formula bilan aniqlanadi?',options:['E = hν','F = ma','p = ρgh'],answer:0},
  {id:'elektronika',category:'muhandislik',tone:'yellow',number:'06',icon:'⌁',tag:'MUHANDISLIK',title:'Elektronika 101',description:'Elektr zanjirlari, tok va kuchlanish bilan ilk qurilmangni yarat.',lessons:16,level:'Boshlang‘ich',impulse:80,lesson:'Elektr toki — zaryadlangan zarrachalarning tartibli harakati. Oddiy zanjir energiya manbai, o‘tkazgich va iste’molchidan tashkil topadi.',fact:'LED chiroqni ulashda uzun oyoqcha odatda musbat qutb bo‘ladi.',question:'Elektr tokini o‘lchaydigan asbob nima?',options:['Ampermetr','Termometr','Barometr'],answer:0},
  {id:'astronomiya',category:'fizika',tone:'blue',number:'07',icon:'◉',tag:'KOINOT',title:'Koinot sari',description:'Sayyoralar, yulduzlar va galaktikalar orasidagi ulkan olamga sayohat.',lessons:10,level:'O‘rta',impulse:140,lesson:'Yulduzlar o‘z yadrosida vodorodni geliyga aylantirib, ulkan energiya chiqaradi. Quyosh ham bizga eng yaqin yulduzdir.',fact:'Quyosh nuri Yerga taxminan 8 daqiqa 20 soniyada yetib keladi.',question:'Yerga eng yaqin yulduz qaysi?',options:['Sirius','Quyosh','Vega'],answer:1},
  {id:'robot',category:'muhandislik',tone:'green',number:'08',icon:'⚙',tag:'ROBOTOTEXNIKA',title:'Robotlar olami',description:'Sensor, motor va algoritmlarni birlashtirib aqlli tizimlar yarat.',lessons:14,level:'O‘rta',impulse:140,lesson:'Robot muhitni sensorlar orqali sezadi, dastur orqali qaror qiladi va motorlar yordamida harakat bajaradi.',fact:'Robot so‘zi ilk bor 1920-yildagi chex pyesasida ishlatilgan.',question:'Robot muhitni qaysi qism orqali sezadi?',options:['Sensor','G‘ildirak','Batareya'],answer:0}
];
const courseIcons={
  physics7:'<svg viewBox="0 0 100 100"><path d="M18 72h64M26 72V35h48v37M36 35V22h28v13M43 48h14M43 58h14"/><circle cx="50" cy="15" r="5"/></svg>',
  physics8:'<svg viewBox="0 0 100 100"><path d="M16 50h20l7-19 14 38 8-24 7 5h12"/><circle cx="24" cy="26" r="7"/><circle cx="76" cy="76" r="7"/></svg>',
  mexanika:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="9"/><ellipse cx="50" cy="50" rx="38" ry="16"/><ellipse cx="50" cy="50" rx="38" ry="16" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="38" ry="16" transform="rotate(120 50 50)"/></svg>',
  physics10:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="9"/><ellipse cx="50" cy="50" rx="38" ry="16"/><ellipse cx="50" cy="50" rx="38" ry="16" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="38" ry="16" transform="rotate(120 50 50)"/></svg>',
  physics11:'<svg viewBox="0 0 100 100"><path d="M15 62h14l8-27 13 45 11-36 8 18h16"/><circle cx="20" cy="23" r="7"/><path d="M20 12V6m0 34v-6m11-11h6M3 23h6"/></svg>',
  elektronika:'<svg viewBox="0 0 100 100"><path d="M58 8 24 55h25l-7 37 34-49H52z"/><path d="M15 22h18M67 77h18"/></svg>',
  astronomiya:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25"/><path d="M12 61c13 12 42 12 66-1s16-23 6-24M50 13V5M50 95v-8M13 50H5M95 50h-8"/></svg>',
  robot:'<svg viewBox="0 0 100 100"><rect x="23" y="27" width="54" height="48" rx="12"/><path d="M50 27V15m-26 32H13m74 0H76M35 75v12m30-12v12"/><circle cx="38" cy="48" r="4"/><circle cx="62" cy="48" r="4"/><path d="M38 62h24"/></svg>'
};

const state = JSON.parse(localStorage.getItem('idrokState') || '{"completed":[],"score":0,"impulse":0,"theme":"light"}');
state.impulse ??= 0;
const users = JSON.parse(localStorage.getItem('idrokUsers') || '[]');
let currentEmail = localStorage.getItem('idrokCurrentUser') || '';
let authToken = localStorage.getItem('idrokAuthToken') || '';
const gardenCore = window.IDROK_GARDEN_CORE;
let leaderMode = 'overall';
async function apiRequest(path, options={}){if(window.IDROK_AUTH?.configured&&path.startsWith('/api/'))return window.IDROK_AUTH.request(path,options);let response;try{response=await fetch(path,{...options,headers:{'Content-Type':'application/json',...(authToken?{Authorization:`Bearer ${authToken}`}:{}) ,...(options.headers||{})}})}catch{throw new Error('Xizmat bilan bog‘lanib bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.')}const contentType=response.headers.get('content-type')||'',payload=contentType.includes('application/json')?await response.json().catch(()=>({})):{};if(!response.ok)throw new Error(payload.error||'Kirish xizmati hozir javob bermayapti. Birozdan keyin qayta urinib ko‘ring.');return payload}
const blankPhysicsState=()=>({version:4,completed:[],scores:{},current:'l1',stages:{},startedAt:Date.now()});
function readStored(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function readGardenView(){
  const fallback=gardenCore?.createGarden?.()||{level:1,items:[],stats:{}};
  const stored=readStored('idrokGarden',currentUser()?.garden||fallback);
  return gardenCore?.publicGarden?.(stored)||{...stored,gardenPoints:0,focusMinutes:0,dimensions:{name:'Nihollar hovlisi'}};
}
const grid = document.querySelector('#courseGrid');
const modal = document.querySelector('#courseModal');
const dashboard = document.querySelector('#dashboardModal');
const authModal = document.querySelector('#authModal');

function renderCourses(filter='all'){
  grid.innerHTML = courses.filter(c=>filter==='all'||c.category===filter).map(c=>`
    <article class="course-card ${c.tone}" data-course="${c.id}">
      <div class="course-meta"><span>${c.number} / ${c.tag}</span><span>${c.level.toUpperCase()}</span></div>
      <div class="course-illustration">${courseIcons[c.id]}</div><h3>${c.title}</h3><p>${c.description}</p>
      <div class="course-bottom"><span>${c.lessons} TA DARS • +${c.impulse} ϟ ${state.completed.includes(c.id)?'• YAKUNLANGAN':''}</span><button class="round-arrow" aria-label="${c.title} kursini ochish">→</button></div>
    </article>`).join('');
}

function openCourse(id){
  const c=courses.find(x=>x.id===id); if(!c)return;
  document.querySelector('#modalKicker').textContent=`${c.tag} • ${c.lessons} TA DARS`;
  document.querySelector('#modalTitle').textContent=c.title;
  document.querySelector('#modalDescription').textContent=c.description;
  document.querySelector('#lessonText').textContent=c.lesson;
  document.querySelector('#lessonFact').textContent=c.fact;
  document.querySelector('#quizBox').innerHTML=`<h3>Bilimingni tekshir</h3><p>${c.question}</p><div class="quiz-options">${c.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}">${o}</button>`).join('')}</div><div class="quiz-result"></div>`;
  document.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>answerQuiz(c,btn)));
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}

function answerQuiz(course,button){
  const buttons=[...document.querySelectorAll('.quiz-option')]; if(buttons.some(b=>b.disabled))return;
  buttons.forEach(b=>b.disabled=true); const picked=Number(button.dataset.answer); const correct=picked===course.answer;
  button.classList.add(correct?'correct':'wrong'); buttons[course.answer].classList.add('correct');
  document.querySelector('.quiz-result').textContent=correct?'Ajoyib! Javobingiz to‘g‘ri. 🎉':'Yaxshi urinish! To‘g‘ri javob yashil rangda ko‘rsatildi.';
  if(!state.completed.includes(course.id)){state.completed.push(course.id);if(correct){state.score++;state.impulse+=course.impulse}saveState();renderCourses();}
  showToast(correct?`+${course.impulse} Impulse olindi!`:'Natijangiz saqlandi');
}

function currentUser(){return users.find(u=>u.email===currentEmail)}
function saveUsers(){localStorage.setItem('idrokUsers',JSON.stringify(users))}
function applyAuthenticatedUser(user){
  if(!user)return null;
  const index=users.findIndex(item=>item.email===user.email);
  if(index>=0)users[index]={...users[index],...user};else users.push(user);
  currentEmail=user.email;localStorage.setItem('idrokCurrentUser',currentEmail);saveUsers();
  localStorage.setItem('idrokPhysics7',JSON.stringify(user.physics7State||{...blankPhysicsState(),version:1}));
  localStorage.setItem('idrokPhysics8',JSON.stringify(user.physics8State||{...blankPhysicsState(),version:1}));
  localStorage.setItem('idrokPhysics',JSON.stringify(user.physicsState||blankPhysicsState()));
  localStorage.setItem('idrokPhysics10',JSON.stringify(user.physics10State||{...blankPhysicsState(),version:20}));
  localStorage.setItem('idrokPhysics11',JSON.stringify(user.physics11State||{...blankPhysicsState(),version:1}));
  localStorage.setItem('idrokGarden',JSON.stringify(user.garden||gardenCore?.createGarden?.()||{}));
  state.completed=[...(user.completed||[])];state.score=Number(user.score)||0;state.impulse=Number(user.impulse)||0;state.theme=user.theme||'light';
  localStorage.setItem('idrokState',JSON.stringify(state));document.body.classList.toggle('dark',state.theme==='dark');
  updateDashboard();renderCourses();renderLeaderboard();return users.find(item=>item.email===user.email);
}
function continueAfterAuth(){
  const next=new URLSearchParams(location.search).get('next');
  if(next&&/^[a-z0-9_-]+\.html(?:[?#].*)?$/i.test(next)){location.replace(next);return true}
  history.replaceState(null,'',location.pathname+location.hash);return false;
}
function saveState(){localStorage.setItem('idrokState',JSON.stringify(state));const user=currentUser();if(user){user.impulse=state.impulse;user.completed=[...state.completed];user.score=state.score;user.theme=state.theme;user.garden=readGardenView();user.physics7State=readStored('idrokPhysics7',{...blankPhysicsState(),version:1});user.physics8State=readStored('idrokPhysics8',{...blankPhysicsState(),version:1});user.physicsState=readStored('idrokPhysics',blankPhysicsState());user.physics10State=readStored('idrokPhysics10',{...blankPhysicsState(),version:20});user.physics11State=readStored('idrokPhysics11',{...blankPhysicsState(),version:1});saveUsers();if(authToken)apiRequest('/api/progress',{method:'POST',body:JSON.stringify({impulse:state.impulse,score:state.score,completed:state.completed,theme:state.theme,physics7State:user.physics7State,physics8State:user.physics8State,physicsState:user.physicsState,physics10State:user.physics10State,physics11State:user.physics11State})}).catch(()=>{})}updateDashboard();renderLeaderboard()}
function updateDashboard(){
  const physics7=JSON.parse(localStorage.getItem('idrokPhysics7')||'{"completed":[],"scores":{},"current":"l1"}');
  const grade7Done=Array.isArray(physics7.completed)?physics7.completed.length:0;
  const physics8=JSON.parse(localStorage.getItem('idrokPhysics8')||'{"completed":[],"scores":{},"current":"l1"}');
  const grade8Done=Array.isArray(physics8.completed)?physics8.completed.length:0;
  const physics=JSON.parse(localStorage.getItem('idrokPhysics')||'{"completed":[],"scores":{},"current":"l1"}');
  const grade9Done=Array.isArray(physics.completed)?physics.completed.length:0;
  const physics10=JSON.parse(localStorage.getItem('idrokPhysics10')||'{"completed":[],"scores":{},"current":"l1"}');
  const grade10Done=Array.isArray(physics10.completed)?physics10.completed.length:0;
  const physics11=JSON.parse(localStorage.getItem('idrokPhysics11')||'{"completed":[],"scores":{},"current":"l1"}');
  const grade11Done=Array.isArray(physics11.completed)?physics11.completed.length:0;
  const physicsDone=grade9Done;
  const otherDone=state.completed.filter(x=>!/^physics(?:7|8|9|10|11)?-/.test(String(x)) && !['physics7','physics8','physics10','physics11','mexanika'].includes(String(x))).length;
  const totalDone=grade7Done+grade8Done+grade9Done+grade10Done+grade11Done+otherDone;
  const physicsTotal=59;
  const physicsPercent=Math.round(physicsDone/physicsTotal*100);
  const adminMode=currentUser()?.role==='admin';document.querySelector('#completedCount').textContent=totalDone;document.querySelector('#impulseCount').textContent=adminMode?'∞ ϟ':state.impulse+' ϟ';document.querySelector('#streakCount').textContent=totalDone?Math.min(totalDone,7):1;
  const side=document.querySelector('#sideProgress');if(side)side.textContent=physicsPercent+'%';
  const user=currentUser(),name=user?.name||'IDROK';document.querySelector('#accountName').textContent=name;document.querySelector('#accountAvatar').textContent=name.slice(0,2).toUpperCase();document.querySelector('#accountStatus').textContent=user?(adminMode?'Administrator':'Shaxsiy kabinet'):'Google orqali kirish';document.querySelector('#headerAuthButton').textContent=user?'Kabinet':'Kirish';document.querySelector('#headerImpulse').querySelector('b').textContent=adminMode?'∞':state.impulse;const adminLink=document.querySelector('#adminPanelLink');if(adminLink)adminLink.hidden=!adminMode;
  const physicsScores=[...Object.values(physics7.scores||{}),...Object.values(physics8.scores||{}),...Object.values(physics.scores||{}),...Object.values(physics10.scores||{}),...Object.values(physics11.scores||{})].map(value=>Math.max(0,Math.min(10,Number(value)||0))),physicsCorrect=physicsScores.reduce((sum,value)=>sum+value,0),physicsQuestions=physicsScores.length*10,otherCorrect=Math.min(otherDone,Math.max(0,state.score-physicsCorrect)),possible=physicsQuestions+otherDone,accuracy=possible?Math.min(100,Math.round((physicsCorrect+otherCorrect)/possible*100)):0;
  const streak=totalDone?Math.min(totalDone,7):1,daily=Math.min(Math.round(state.impulse/110*100),100);
  document.querySelector('#welcomeName').textContent=user?`${user.name}!`:'izlanuvchi!';document.querySelector('#homeImpulse').textContent=adminMode?'∞':state.impulse;document.querySelector('#homeCompleted').textContent=totalDone;document.querySelector('#homeAccuracy').textContent=accuracy+'%';document.querySelector('#homeStreak').textContent=streak+' kun';document.querySelector('#dailyPercent').textContent=adminMode?'100%':daily+'%';document.querySelector('#dailyTrack').style.width=adminMode?'100%':daily+'%';document.querySelector('#homeLeague').textContent=adminMode?'Admin':state.impulse>=800?'Magnit':state.impulse>=300?'Tok':'Uchqun';
  const physicsCourse=window.PHYSICS_COURSE,courseLessons=physicsCourse?.lessons||[],courseChapters=physicsCourse?.chapters||[];
  const nextLesson=courseLessons.find(lesson=>!physics.completed?.includes(lesson.id))||courseLessons.at(-1);
  const setText=(selector,value)=>{const node=document.querySelector(selector);if(node)node.textContent=value};
  const physics7Percent=Math.round(grade7Done/62*100),course7Lessons=window.PHYSICS_COURSE7?.lessons||[],nextLesson7=course7Lessons.find(lesson=>!physics7.completed?.includes(lesson.id))||course7Lessons.at(-1);
  setText('#dashboardPhysics7Meta',`${grade7Done} / 62 dars`);setText('#dashboardPhysics7Percent',`${physics7Percent}%`);setText('#dashboardCurrentLesson7',nextLesson7?`${nextLesson7.number}-dars: ${nextLesson7.title}`:'Kurs ma’lumoti yuklanmoqda');
  const dashboardTrack7=document.querySelector('#dashboardPhysics7Track');if(dashboardTrack7)dashboardTrack7.style.width=physics7Percent+'%';
  const homeTrack7=document.querySelector('#homePhysics7Track');if(homeTrack7)homeTrack7.style.width=physics7Percent+'%';
  setText('#homePhysics7Percent',`${physics7Percent}%`);
  const physics8Percent=Math.round(grade8Done/60*100),course8Lessons=window.PHYSICS_COURSE8?.lessons||[],nextLesson8=course8Lessons.find(lesson=>!physics8.completed?.includes(lesson.id))||course8Lessons.at(-1);
  setText('#dashboardPhysics8Meta',`${grade8Done} / 60 dars`);setText('#dashboardPhysics8Percent',`${physics8Percent}%`);setText('#dashboardCurrentLesson8',nextLesson8?`${nextLesson8.number}-dars: ${nextLesson8.title}`:'Kurs ma’lumoti yuklanmoqda');
  const dashboardTrack8=document.querySelector('#dashboardPhysics8Track');if(dashboardTrack8)dashboardTrack8.style.width=physics8Percent+'%';
  const homeTrack8=document.querySelector('#homePhysics8Track');if(homeTrack8)homeTrack8.style.width=physics8Percent+'%';
  setText('#homePhysics8Percent',`${physics8Percent}%`);
  setText('#dashboardPhysicsMeta',`${physicsDone} / ${physicsTotal} dars`);setText('#dashboardPhysicsPercent',`${physicsPercent}%`);setText('#dashboardCurrentLesson',nextLesson?`${nextLesson.number}-dars: ${nextLesson.title}`:'Kurs ma’lumoti yuklanmoqda');
  const dashboardTrack=document.querySelector('#dashboardPhysicsTrack');if(dashboardTrack)dashboardTrack.style.width=physicsPercent+'%';
  const homeTrack=document.querySelector('#homePhysicsTrack');if(homeTrack)homeTrack.style.width=physicsPercent+'%';
  setText('#homePhysicsPercent',`${physicsPercent}%`);
  setText('#homeJourneyPercent',`${physicsPercent}%`);setText('#homeJourneyCount',`${physicsDone} / ${physicsTotal} dars`);setText('#homeJourneyTitle',nextLesson?.title||'9-sinf Fizika');setText('#homeJourneySummary',nextLesson?.summary||nextLesson?.relationship||'Navbatdagi fizik hodisani nazariya, tajriba va masalalar orqali o‘rganing.');
  const journeyDial=document.querySelector('#homeJourneyDial');if(journeyDial)journeyDial.style.setProperty('--progress',adminMode?100:physicsPercent);
  const physics10Percent=Math.round(grade10Done/59*100),course10Lessons=window.PHYSICS_COURSE10?.lessons||[],nextLesson10=course10Lessons.find(lesson=>!physics10.completed?.includes(lesson.id))||course10Lessons.at(-1);
  setText('#dashboardPhysics10Meta',`${grade10Done} / 59 dars`);setText('#dashboardPhysics10Percent',`${physics10Percent}%`);setText('#dashboardCurrentLesson10',nextLesson10?`${nextLesson10.number}-dars: ${nextLesson10.title}`:'Kurs ma’lumoti yuklanmoqda');
  const dashboardTrack10=document.querySelector('#dashboardPhysics10Track');if(dashboardTrack10)dashboardTrack10.style.width=physics10Percent+'%';
  const homeTrack10=document.querySelector('#homePhysics10Track');if(homeTrack10)homeTrack10.style.width=physics10Percent+'%';
  setText('#homePhysics10Percent',`${physics10Percent}%`);
  const physics11Percent=Math.round(grade11Done/45*100),course11Lessons=window.PHYSICS_COURSE11?.lessons||[],nextLesson11=course11Lessons.find(lesson=>!physics11.completed?.includes(lesson.id))||course11Lessons.at(-1);
  setText('#dashboardPhysics11Meta',`${grade11Done} / 45 dars`);setText('#dashboardPhysics11Percent',`${physics11Percent}%`);setText('#dashboardCurrentLesson11',nextLesson11?`${nextLesson11.number}-dars: ${nextLesson11.title}`:'Kurs ma’lumoti yuklanmoqda');
  const dashboardTrack11=document.querySelector('#dashboardPhysics11Track');if(dashboardTrack11)dashboardTrack11.style.width=physics11Percent+'%';
  const homeTrack11=document.querySelector('#homePhysics11Track');if(homeTrack11)homeTrack11.style.width=physics11Percent+'%';
  setText('#homePhysics11Percent',`${physics11Percent}%`);
  setText('#homeLeagueHint',adminMode?'Barcha imkoniyatlar ochiq':state.impulse>=800?'Eng yuqori faol liga':state.impulse>=300?'Keyingi bosqich: Magnit':'Keyingi bosqich: Tok');
  const garden=readGardenView(),grown=garden.items.filter(item=>item.state==='mature').length;
  setText('#homeGardenPlants',grown);setText('#homeGardenFocus',garden.focusMinutes||0);setText('#homeGardenMessage',garden.focus?'Fokus davom etmoqda — darsga qayting.':grown?'Bog‘ingiz yashnamoqda. Yangi nihol eking.':'Birinchi niholingizni eking va dars bilan o‘stiring.');
  setText('#dashboardGardenName',garden.dimensions?.name||'Nihollar hovlisi');setText('#dashboardGardenMeta',`${grown} o‘simlik · ${garden.focusMinutes||0} daqiqa fokus`);setText('#dashboardGardenPoints',`${garden.gardenPoints||0} ball`);
  const chapterGrid=document.querySelector('#dashboardChapters');if(chapterGrid&&courseChapters.length){chapterGrid.innerHTML=courseChapters.map((chapter,index)=>{const chapterLessons=courseLessons.filter(lesson=>lesson.chapter===index),done=chapterLessons.filter(lesson=>physics.completed?.includes(lesson.id)).length;return `<div><span>${String(index+1).padStart(2,'0')}</span><p><b>${chapter.title}</b><small>${done}/${chapterLessons.length} dars</small></p><i style="width:${done/chapterLessons.length*100}%"></i></div>`}).join('')}
  const dashboardTitle=document.querySelector('#dashboardModal h2');if(dashboardTitle)dashboardTitle.textContent=`Salom, ${user?.name||'izlanuvchi'}!`;
  const logout=document.querySelector('#logoutButton');if(logout)logout.style.display=user?'inline-flex':'none';
}
async function renderLeaderboard(){
  const list=document.querySelector('#leaderList');let leaders=[];try{leaders=(await apiRequest('/api/leaderboard')).leaders||[]}catch{leaders=users.map(({name,email,impulse,lifetimeImpulse,garden})=>{const view=gardenCore?.publicGarden?.(garden||gardenCore.createGarden())||{};const gardenPoints=Number(view.gardenPoints)||0,beautyScore=Number(view.beautyScore)||gardenPoints,focusMinutes=Number(view.focusMinutes)||0,lifetime=Math.max(Number(lifetimeImpulse)||0,Number(impulse)||0);return{name,email,impulse:Number(impulse)||0,lifetimeImpulse:lifetime,gardenPoints,beautyScore,focusMinutes,overall:lifetime+beautyScore+focusMinutes*2}})}
  const metric=leaderMode==='garden'?'beautyScore':leaderMode==='impulse'?'lifetimeImpulse':'overall';
  const user=currentUser();leaders.sort((a,b)=>(Number(b[metric])||0)-(Number(a[metric])||0));list.innerHTML=leaders.length?leaders.slice(0,10).map((u,i)=>{const current=u.id===user?.id||u.email===currentEmail,score=Number(u[metric])||0,label=leaderMode==='garden'?`${score} go‘zallik`:leaderMode==='impulse'?`${score} ϟ`:`${score} ball`;return `<div class="leader-item ${current?'current':''}"><span class="leader-rank">${String(i+1).padStart(2,'0')}</span><span class="leader-avatar">${u.name.slice(0,2).toUpperCase()}</span><span class="leader-name"><b>${u.name}${current?' (Siz)':''}</b><small>${u.gardenPoints||0} bog‘ ball · ${u.focusMinutes||0} daqiqa fokus</small></span><span class="leader-score">${label}</span></div>`}).join(''):'<div class="leader-empty"><b>Reyting hali bo‘sh</b><small>Birinchi haqiqiy ishtirokchi bo‘ling.</small></div>';
}
function closeAll(){
  if(authModal.classList.contains('open')&&!currentUser()){authModal.querySelector('.auth-card')?.classList.remove('show-form');return}
  [modal,dashboard,authModal].forEach(panel=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});
  setHomeAiOpen(false);document.body.style.overflow='';
}
function showToast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

const homeAiPanel=document.querySelector('#homeAiPanel'),homeAiMessages=document.querySelector('#homeAiMessages');
let homeAiHistory=[];try{homeAiHistory=JSON.parse(localStorage.getItem('idrokAiHistory')||'[]')}catch{homeAiHistory=[]}if(!Array.isArray(homeAiHistory))homeAiHistory=[];
function homeAiLesson(){const physics=readStored('idrokPhysics',blankPhysicsState()),all=window.PHYSICS_COURSE?.lessons||[];return all.find(item=>item.id===physics.current)||all[0]}
function updateHomeAiContext(){const lesson=homeAiLesson(),node=document.querySelector('#homeAiContext');if(node)node.textContent=lesson?`${lesson.number}-dars · ${lesson.title}`:'9-sinf fizika'}
function setHomeAiOpen(open){if(!homeAiPanel)return;homeAiPanel.classList.toggle('open',open);homeAiPanel.setAttribute('aria-hidden',String(!open));document.querySelector('#homeAiLauncher')?.setAttribute('aria-expanded',String(open));if(open){updateHomeAiContext();setTimeout(()=>document.querySelector('#homeAiInput')?.focus(),100)}}
function addHomeAiMessage(text,role,remember=true){const row=document.createElement('div');row.className=`home-ai-message ${role}`;if(role==='assistant'){const mark=document.createElement('span');mark.textContent='✦';row.appendChild(mark)}const p=document.createElement('p');p.textContent=text;row.appendChild(p);homeAiMessages.appendChild(row);homeAiMessages.scrollTop=homeAiMessages.scrollHeight;if(remember){homeAiHistory.push({text,role});homeAiHistory=homeAiHistory.slice(-20);localStorage.setItem('idrokAiHistory',JSON.stringify(homeAiHistory))}}
function homeAiAnswer(kind,question=''){const lesson=homeAiLesson();if(!lesson)return'Avval fizika kursini oching — shunda mavzu bo‘yicha yordam beraman.';const q=question.toLocaleLowerCase('uz-UZ');if(!kind){if(/formula|tenglama|birlik/.test(q))kind='formula';else if(/misol|masala|yech|hisob/.test(q))kind='example';else if(/qoida|qonun|asosiy/.test(q))kind='rule';else if(/quiz|test|savol/.test(q))kind='quiz';else kind='explain'}const answers={explain:`${lesson.title} mavzusining sodda mazmuni: ${lesson.summary}\n\nMuhim bog‘lanish: ${lesson.relationship}\n\nHayotiy misol: ${lesson.application}`,rule:`Asosiy qoida: ${lesson.relationship}\n\nEslab qoling: ${lesson.summary}`,formula:`Asosiy formula: ${lesson.formula}\nBirlik: ${lesson.unit}.\n\nFizik ma’nosi: ${lesson.formulaExplanation||lesson.relationship}`,example:`Bu mavzudagi masalalarda avval berilgan kattaliklarni yozing, keyin ${lesson.formula} munosabatini tanlang. Birliklarni ${lesson.unit} tizimiga keltirib, sonlarni formulaga qo‘ying.`,quiz:`Quiz oldidan uch narsani takrorlang:\n1) ${lesson.summary}\n2) Formula: ${lesson.formula}\n3) ${lesson.application}`};return answers[kind]||answers.explain}
function askHomeAi(kind,question=''){const labels={explain:'Mavzuni tushuntir',rule:'Asosiy qoidani ayt',formula:'Formulani tushuntir',example:'Misolni tushuntir',quiz:'Quizga tayyorla'};addHomeAiMessage(question||labels[kind]||'Mavzuni tushuntir','user');document.querySelector('#homeAiInput').value='';setTimeout(()=>addHomeAiMessage(homeAiAnswer(kind,question),'assistant'),220)}
homeAiHistory.slice(-8).forEach(message=>addHomeAiMessage(message.text,message.role,false));
document.querySelector('#homeAiLauncher').addEventListener('click',()=>setHomeAiOpen(!homeAiPanel.classList.contains('open')));
document.querySelector('#homeAiSpotlight')?.addEventListener('click',()=>setHomeAiOpen(true));
document.querySelector('#homeAiNav').addEventListener('click',()=>{closeSidebar();setHomeAiOpen(true)});
document.querySelector('#homeAiClose').addEventListener('click',()=>setHomeAiOpen(false));
document.querySelectorAll('[data-home-ai]').forEach(button=>button.addEventListener('click',()=>askHomeAi(button.dataset.homeAi)));
document.querySelector('#homeAiForm').addEventListener('submit',event=>{event.preventDefault();const question=document.querySelector('#homeAiInput').value.trim();if(question)askHomeAi('',question)});

grid.addEventListener('click',e=>{const card=e.target.closest('[data-course]');if(!card)return;if(card.dataset.course==='physics7'){location.href='physics7.html'}else if(card.dataset.course==='physics8'){location.href='physics8.html'}else if(card.dataset.course==='mexanika'){location.href='physics.html'}else if(card.dataset.course==='physics10'){location.href='physics10.html'}else if(card.dataset.course==='physics11'){location.href='physics11.html'}else openCourse(card.dataset.course)});
document.querySelector('#filterRow').addEventListener('click',e=>{if(!e.target.matches('.filter'))return;document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');renderCourses(e.target.dataset.filter)});
document.querySelector('.header-search input').addEventListener('input',e=>{const query=e.target.value.trim().toLowerCase();grid.innerHTML=courses.filter(c=>(c.title+' '+c.tag+' '+c.description).toLowerCase().includes(query)).map(c=>`<article class="course-card ${c.tone}" data-course="${c.id}"><div class="course-meta"><span>${c.number} / ${c.tag}</span><span>${c.level.toUpperCase()}</span></div><div class="course-illustration">${courseIcons[c.id]}</div><h3>${c.title}</h3><p>${c.description}</p><div class="course-bottom"><span>${c.lessons} TA DARS • +${c.impulse} ϟ</span><button class="round-arrow">→</button></div></article>`).join('');if(query)document.querySelector('#kurslar').scrollIntoView()});
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeAll));
document.querySelectorAll('[data-open-dashboard]').forEach(el=>el.addEventListener('click',()=>{updateDashboard();dashboard.classList.add('open');dashboard.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}));
document.querySelectorAll('[data-close-dashboard]').forEach(el=>el.addEventListener('click',closeAll));
document.querySelector('#demoButton').addEventListener('click',()=>{location.href='physics.html'});
document.querySelectorAll('[data-course-launch]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.courseLaunch==='physics7')location.href='physics7.html';else if(btn.dataset.courseLaunch==='physics8')location.href='physics8.html';else if(btn.dataset.courseLaunch==='mexanika')location.href='physics.html';else if(btn.dataset.courseLaunch==='physics10')location.href='physics10.html';else if(btn.dataset.courseLaunch==='physics11')location.href='physics11.html';else openCourse(btn.dataset.courseLaunch)}));
function openAuth(){
  authModal.querySelector('.auth-card')?.classList.add('show-form');authModal.classList.add('open');authModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  setTimeout(()=>document.querySelector('[data-google-auth]')?.focus(),180);
}
function openDiscovery(){authModal.querySelector('.auth-card')?.classList.remove('show-form');authModal.classList.add('open');authModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';authModal.querySelector('.auth-card')?.scrollTo({top:0,behavior:'instant'})}
const authStory=document.querySelector('.auth-story');
authStory?.addEventListener('pointermove',event=>{const rect=authStory.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;authStory.style.setProperty('--auth-tilt-x',`${(-y*10).toFixed(2)}deg`);authStory.style.setProperty('--auth-tilt-y',`${(x*13).toFixed(2)}deg`)});
authStory?.addEventListener('pointerleave',()=>{authStory.style.setProperty('--auth-tilt-x','-3deg');authStory.style.setProperty('--auth-tilt-y','4deg')});
document.querySelectorAll('[data-open-auth]').forEach(button=>button.addEventListener('click',openAuth));
document.querySelectorAll('[data-auth-back]').forEach(button=>button.addEventListener('click',openDiscovery));
document.querySelector('#headerAuthButton').addEventListener('click',()=>{if(currentUser()){updateDashboard();dashboard.classList.add('open');dashboard.setAttribute('aria-hidden','false')}else openAuth()});
document.querySelector('#accountButton').addEventListener('click',()=>{if(currentUser()){updateDashboard();dashboard.classList.add('open');dashboard.setAttribute('aria-hidden','false')}else openAuth()});
document.querySelector('#logoutButton').addEventListener('click',async()=>{
  saveState();
  await window.IDROK_ACCOUNT?.logout?.();localStorage.removeItem('idrokCurrentUser');currentEmail='';
  localStorage.removeItem('idrokAuthToken');authToken='';sessionStorage.removeItem('idrokAuthPreviewed');
  state.completed=[];state.score=0;state.impulse=0;
  localStorage.setItem('idrokState',JSON.stringify(state));localStorage.setItem('idrokPhysics7',JSON.stringify({...blankPhysicsState(),version:1}));localStorage.setItem('idrokPhysics8',JSON.stringify({...blankPhysicsState(),version:1}));localStorage.setItem('idrokPhysics',JSON.stringify(blankPhysicsState()));localStorage.setItem('idrokPhysics10',JSON.stringify({...blankPhysicsState(),version:20}));localStorage.setItem('idrokPhysics11',JSON.stringify({...blankPhysicsState(),version:1}));localStorage.setItem('idrokGarden',JSON.stringify(gardenCore?.createGarden?.()||{}));
  document.body.classList.toggle('dark',state.theme==='dark');closeAll();updateDashboard();renderCourses();renderLeaderboard();showToast('Hisobdan chiqdingiz.');openAuth();
});
function friendlyAuthError(error){const message=String(error?.message||'').toLowerCase();if(message.includes('provider is not enabled')||message.includes('unsupported provider'))return'Google orqali kirish serverda hali yoqilmagan.';if(message.includes('popup')||message.includes('cancel'))return'Google oynasi yopildi. Qayta urinib ko‘ring.';if(message.includes('network')||message.includes('fetch'))return'Internet bilan aloqa uzildi. Ulanishni tekshirib, qayta urinib ko‘ring.';if(message.includes('signup')&&message.includes('disabled'))return'Yangi hisob yaratish vaqtincha yopiq.';return error?.message||'Google orqali kirishda kutilmagan xato yuz berdi.'}
function requireCloudAuth(){if(!window.IDROK_AUTH?.configured)throw new Error('Kirish xizmati hali ulanmagan. Sayt administratoriga xabar bering.');return window.IDROK_AUTH}
document.querySelectorAll('[data-google-auth]').forEach(button=>button.addEventListener('click',async()=>{const label=button.querySelector('.google-copy b'),message=document.querySelector('#googleAuthPanel .form-message'),original=label.textContent;button.disabled=true;message.textContent='';label.textContent='Google ochilmoqda…';try{await requireCloudAuth().signInWithGoogle()}catch(error){message.textContent=friendlyAuthError(error);button.disabled=false;label.textContent=original}}));
const sidebar=document.querySelector('#sidebar');const sidebarOverlay=document.querySelector('#sidebarOverlay');
function closeSidebar(){sidebar.classList.remove('open');sidebarOverlay.classList.remove('open')}
document.querySelector('#menuButton').addEventListener('click',()=>{sidebar.classList.add('open');sidebarOverlay.classList.add('open')});
document.querySelector('#sidebarClose').addEventListener('click',closeSidebar);sidebarOverlay.addEventListener('click',closeSidebar);
document.querySelectorAll('.side-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.side-nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active');closeSidebar()}));
document.querySelector('#themeButton').addEventListener('click',()=>{document.body.classList.toggle('dark');state.theme=document.body.classList.contains('dark')?'dark':'light';saveState()});
document.querySelector('#leaderTabs')?.addEventListener('click',event=>{
  const button=event.target.closest('[data-leader-mode]');if(!button)return;
  leaderMode=button.dataset.leaderMode;
  document.querySelectorAll('[data-leader-mode]').forEach(node=>node.classList.toggle('active',node===button));
  renderLeaderboard();
});
addEventListener('idrok:garden-update',()=>{
  const latest=readStored('idrokState',state);
  state.impulse=Math.max(0,Number(latest.impulse)||0);
  updateDashboard();renderLeaderboard();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
if(state.theme==='dark')document.body.classList.add('dark');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
async function bootstrapAccount(){
  const requestedTab=new URLSearchParams(location.search).get('auth');
  let restored=null;try{restored=await window.IDROK_ACCOUNT?.ready}catch{}
  authToken=localStorage.getItem('idrokAuthToken')||'';
  currentEmail=localStorage.getItem('idrokCurrentUser')||'';
  if(restored){applyAuthenticatedUser(restored);authModal.classList.remove('open');document.body.style.overflow='';continueAfterAuth();return}
  updateDashboard();renderCourses();renderLeaderboard();
  if(requestedTab==='register'||requestedTab==='login')openAuth();else openDiscovery();
}
async function configureAuthProviders(){try{const availability=await window.IDROK_AUTH?.providers?.();if(availability&&availability.google===false){const button=document.querySelector('[data-google-auth]'),message=document.querySelector('#googleAuthPanel .form-message');if(button)button.disabled=true;if(message)message.textContent='Google login Supabase panelida yoqilishi kutilmoqda.'}}catch{}}
renderCourses();updateDashboard();renderLeaderboard();bootstrapAccount();configureAuthProviders();

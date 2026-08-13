import * as THREE from './vendor/three.module.min.js';

if(window.IDROK_ACCOUNT?.ready)await window.IDROK_ACCOUNT.ready;

const catalogApi=window.IDROK_GARDEN_CATALOG;
const core=window.IDROK_GARDEN_CORE;
if(!catalogApi||!core)throw new Error('Bog‘ katalogi yuklanmadi.');

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const token=localStorage.getItem('idrokAuthToken')||'';
const guestKey='idrokGarden';
const state=JSON.parse(localStorage.getItem('idrokState')||'{"impulse":0,"theme":"light"}');
let impulse=Math.max(0,Number(state.impulse)||0);
let garden=core.createGarden();
let missions=[];
let shopType='plant',shopFilter='all',pendingCatalogId='',movingId='',selectedItemId='',placementRotation=0,busy=false,modalPlantId='';
let history=[],redoHistory=[],toastTimer=0,sellConfirmTimer=0;

const missionDefs=[
  {id:'first-bloom',title:'Birinchi gullash',description:'Bitta o‘simlikni to‘liq o‘stiring.',reward:30,test:g=>g.items.some(item=>item.state==='mature')},
  {id:'five-colors',title:'Ranglar uyg‘unligi',description:'5 xil bog‘ elementidan foydalaning.',reward:75,test:g=>new Set(g.items.map(item=>item.catalogId)).size>=5},
  {id:'focus-hour',title:'Bir soatlik bog‘bon',description:'Jami 60 daqiqa fokus qiling.',reward:80,test:g=>core.focusMinutes(g)>=60},
  {id:'garden-designer',title:'Bog‘ dizayneri',description:'Bog‘ingizga 20 ta element joylashtiring.',reward:100,test:g=>g.items.length>=20},
];
const icons={rayhon:'🌿',yalpiz:'🍃',moychechak:'🌼',atirgul:'🌹',lola:'🌷',nargiz:'🌻',lavanda:'🪻',kungaboqar:'🌻',gortenziya:'🟣',olma:'🍎',gilos:'🍒',orik:'🟠',sakura:'🌸',archa:'🌲',chinor:'🌳',magnoliya:'🌺',yolak:'▦',shaghal:'◌',tuproq:'◼',chiroq:'💡',orindiq:'🪑','tirik-devor':'▰','gul-arkasi':'⚘',koprik:'⌒',hovuz:'💧',favvora:'⛲',pergola:'⌂','atom-haykali':'⚛',raketa:'🚀'};
const filters={
  plant:[['all','Barchasi'],['flower','Gullar'],['herb','Giyohlar'],['bush','Butalar'],['tree','Daraxtlar']],
  decor:[['all','Barchasi'],['path','Yo‘lak'],['water','Suv'],['furniture','Mebel'],['architecture','Arxitektura'],['idrok','Idrok']],
};
const kindGroup=kind=>['flower'].includes(kind)?'flower':['herb'].includes(kind)?'herb':['bush'].includes(kind)?'bush':['fruit-tree','blossom-tree','pine','tree'].includes(kind)?'tree':['path','soil'].includes(kind)?'path':['pond','fountain','bridge'].includes(kind)?'water':['bench','lamp','hedge'].includes(kind)?'furniture':['arch','pergola'].includes(kind)?'architecture':'idrok';

function toast(message,error=false){
  const node=$('#gardenToast');node.textContent=message;node.classList.toggle('error',error);node.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3600);
}
function readGuest(){try{return core.normalizeGarden(JSON.parse(localStorage.getItem(guestKey)||'null'))}catch{return core.createGarden()}}
function currentUser(){
  try{const email=localStorage.getItem('idrokCurrentUser')||'';return(JSON.parse(localStorage.getItem('idrokUsers')||'[]')||[]).find(user=>user.email===email)||null}catch{return null}
}
function isAdminAccount(){return currentUser()?.role==='admin'}
function impulseLabel(){return isAdminAccount()?'∞':impulse.toLocaleString('uz-UZ')}
function syncLocal(){
  state.impulse=impulse;localStorage.setItem('idrokState',JSON.stringify(state));localStorage.setItem(guestKey,JSON.stringify(garden));
  try{const email=localStorage.getItem('idrokCurrentUser')||'',users=JSON.parse(localStorage.getItem('idrokUsers')||'[]'),user=users.find(entry=>entry.email===email);if(user){user.impulse=impulse;user.garden=core.publicGarden(garden);localStorage.setItem('idrokUsers',JSON.stringify(users))}}catch{}
  dispatchEvent(new CustomEvent('idrok:garden-update',{detail:core.publicGarden(garden)}));
}
async function api(path,options={}){
  const response=await fetch(path,{...options,headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`,...options.headers}});
  const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Bog‘ serverida xato yuz berdi.');return data;
}
function guestMissions(){
  const claimed=new Set(garden.stats.missionsClaimed||[]);
  return missionDefs.map(({test,...item})=>({...item,ready:test(garden),claimed:claimed.has(item.id)}));
}

/* ---------- THREE.JS SAHNA ---------- */
const canvas=$('#gardenCanvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(47,1,.1,520);
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
const world=new THREE.Group();scene.add(world);
let terrain=null,grid=null,sceneryGroup=null,hemisphere=null,sunLight=null,fillLight=null,selectionRing=null,ghost=null,ghostRing=null,hoverCell=null,skyDome=null;
let itemGroups=new Map(),animated=[],butterflies=[],waterObjects=[],lampLights=[];
let cameraTarget=new THREE.Vector3(),cameraDistance=32,cameraAzimuth=.75,cameraElevation=.8;
let pointerDown=null,dragMode='',lastFrame=performance.now(),audioContext=null,ambientSource=null;
let publicPlots=[],activePlotId='mine',worldReady=false;
const WORLD_SIZE=280,WORLD_SEGMENTS=150,PLOT_GAP=82,ownPlotCenter=new THREE.Vector3(0,0,0);
const textureCache={};

const mat=(color,options={})=>new THREE.MeshStandardMaterial({color,roughness:.78,metalness:.03,...options});
function seededNoise(x,z,seed=17){
  const value=Math.sin(x*127.1+z*311.7+seed*74.7)*43758.5453;
  return value-Math.floor(value);
}
function canvasTexture(name,base,accent,count=900){
  if(textureCache[name])return textureCache[name];
  const size=256,canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  const context=canvas.getContext('2d');context.fillStyle=base;context.fillRect(0,0,size,size);
  for(let i=0;i<count;i++){
    const x=Math.random()*size,y=Math.random()*size,r=.3+Math.random()*1.8;
    context.globalAlpha=.025+Math.random()*.12;context.fillStyle=i%5?accent:'#ffffff';context.beginPath();context.ellipse(x,y,r*.45,r*2,Math.random()*Math.PI,0,Math.PI*2);context.fill();
  }
  for(let i=0;i<45;i++){context.globalAlpha=.035;context.strokeStyle=i%2?accent:'#ffffff';context.beginPath();context.moveTo(0,Math.random()*size);context.bezierCurveTo(70,Math.random()*size,180,Math.random()*size,size,Math.random()*size);context.stroke()}
  context.globalAlpha=1;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textureCache[name]=texture;return texture;
}
function terrainHeight(x,z){
  const nearPlot=publicPlots.some(plot=>{
    const dx=Math.abs(x-plot.position.x),dz=Math.abs(z-plot.position.z),size=Math.max(plot.dimensions?.cols||24,plot.dimensions?.rows||24)/2+8;
    return dx<size&&dz<size;
  })||Math.abs(x)<42&&Math.abs(z)<42;
  const road=Math.min(Math.abs(x),Math.abs(z))<4.5;
  if(nearPlot||road)return 0;
  const broad=Math.sin(x*.035)*2.8+Math.cos(z*.028)*2.3+Math.sin((x+z)*.017)*3.2;
  const detail=(seededNoise(Math.floor(x*.28),Math.floor(z*.28))-.5)*1.1;
  const edge=Math.max(0,(Math.hypot(x,z)-78)/30);
  return broad+detail+edge*edge*5;
}
function plotCenter(plotId=activePlotId){
  if(plotId==='mine')return ownPlotCenter;
  const plot=publicPlots.find(entry=>entry.id===plotId);return plot?new THREE.Vector3(plot.position.x,0,plot.position.z):ownPlotCenter;
}
function addMesh(group,geometry,material,x=0,y=0,z=0,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){
  const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);object.scale.set(sx,sy,sz);object.rotation.set(rx,ry,rz);object.castShadow=true;object.receiveShadow=true;group.add(object);return object;
}
function leaf(group,x,y,z,color='#4b9f55',scale=1,rotation=0){
  const shape=new THREE.Shape();shape.moveTo(0,-.2);shape.bezierCurveTo(.16,-.12,.22,.11,0,.28);shape.bezierCurveTo(-.22,.11,-.16,-.12,0,-.2);
  const geometry=new THREE.ShapeGeometry(shape,5),material=mat(color,{roughness:.72,side:THREE.DoubleSide});
  const object=addMesh(group,geometry,material,x,y,z,scale,scale,scale,-1.15,rotation,.35);
  const vein=addMesh(group,new THREE.CylinderGeometry(.008,.008,.39,5),mat('#d5e8a9',{roughness:1}),x,y+.03,z,.65*scale,.65*scale,.65*scale,0,0,-.18);
  object.userData.leaf=true;vein.userData.leaf=true;return object;
}
function flowerHead(group,x,y,z,primary,center='#f3c64f',scale=1){
  for(let layer=0;layer<2;layer++)for(let i=0;i<7;i++){
    const a=i/7*Math.PI*2+layer*.35,r=(.13+layer*.07)*scale;
    addMesh(group,new THREE.SphereGeometry(.12,12,8),mat(layer?primary:new THREE.Color(primary).offsetHSL(0,.04,.08)),x+Math.cos(a)*r,y+layer*.035,z+Math.sin(a)*r,1.35*scale,.42*scale,.82*scale,0,-a,.18);
  }
  addMesh(group,new THREE.SphereGeometry(.105,14,10),mat(center,{roughness:.9}),x,y+.055,z,scale,.75*scale,scale);
}
function seedModel(catalog,progress=0,wilted=false){
  const g=new THREE.Group(),soil=canvasTexture('soil','#5f3a25','#301b12',550);
  soil.repeat.set(1,1);addMesh(g,new THREE.CylinderGeometry(.48,.54,.12,20),mat('#6a4128',{map:soil,roughness:1}),0,.04,0);
  const height=.18+progress*.72,color=wilted?'#796747':'#4b9d55';
  addMesh(g,new THREE.CylinderGeometry(.025,.045,height,10),mat(color),0,.1+height/2,0,1,1,1,0,0,wilted?.65:0);
  if(progress>.08){leaf(g,-.09,.26+height*.43,0,color,.7,-.8);leaf(g,.1,.34+height*.35,0,color,.72,.75)}
  if(progress>.55)addMesh(g,new THREE.SphereGeometry(.08,10,8),mat(catalog.colors[0]),0,.16+height,0,.75,1,.75);
  return g;
}
function flowerModel(catalog,item){
  if(item.state==='seed')return seedModel(catalog,.05);if(item.state==='wilted')return seedModel(catalog,.55,true);
  const g=new THREE.Group(),progress=item.state==='mature'?1:Math.max(.16,item.progress),count=catalog.kind==='bush'?11:catalog.id==='lavanda'?14:catalog.id==='moychechak'?8:5;
  const soil=canvasTexture('soil','#5f3a25','#301b12',550);addMesh(g,new THREE.CylinderGeometry(.53,.58,.1,24),mat('#61402b',{map:soil,roughness:1}),0,.03,0);
  for(let i=0;i<count;i++){
    const a=i*2.399+(item.variant||0),r=.08+(i%4)*.12,x=Math.cos(a)*r,z=Math.sin(a)*r,h=(.48+(i%5)*.11)*(.42+progress*.58);
    addMesh(g,new THREE.CylinderGeometry(.018,.032,h,8),mat(i%2?'#347447':'#3f8b51'),x,h/2+.08,z,1,1,1,.03*Math.sin(a),0,.03*Math.cos(a));
    leaf(g,x-.06,h*.42+.08,z,catalog.colors[1],.52+(i%3)*.08,-.7+a);leaf(g,x+.07,h*.64+.08,z,catalog.colors[1],.48+(i%2)*.1,.65+a);
    if(progress>.58)flowerHead(g,x,h+.08,z,catalog.colors[0],catalog.id==='moychechak'?'#efb92d':'#f3c64f',catalog.id==='kungaboqar'?1.45:catalog.id==='lavanda'?.42:.72);
    else addMesh(g,new THREE.SphereGeometry(.085,11,8),mat(catalog.colors[0]),x,h+.08,z,.75,1.18,.75);
  }
  const scale=.52+progress*.55;g.scale.setScalar(scale);return g;
}
function treeModel(catalog,item){
  if(item.state==='seed')return seedModel(catalog,.05);if(item.state==='wilted')return seedModel(catalog,.7,true);
  const g=new THREE.Group(),progress=item.state==='mature'?1:Math.max(.18,item.progress),h=Math.max(2.5,catalog.height*1.35)*(.4+progress*.6),bark=canvasTexture('bark','#6e4930','#352316',450);
  bark.repeat.set(1,4);
  if(catalog.kind==='pine'){
    addMesh(g,new THREE.CylinderGeometry(.1,.25,h*.82,12),mat('#6d4a31',{map:bark,roughness:1}),0,h*.41,0);
    for(let i=0;i<7;i++)addMesh(g,new THREE.ConeGeometry(1.05-i*.09,.95,18),mat(i%2?'#1d5739':'#286d45',{roughness:.95}),0,h*.35+i*.42,0);
  }else{
    addMesh(g,new THREE.CylinderGeometry(.11,.29,h*.66,14),mat('#765039',{map:bark,roughness:1}),0,h*.33,0);
    const branches=[[.44,.64,.1],[-.42,.7,.08],[.18,.78,.42],[-.1,.72,-.45]];
    branches.forEach(([x,y,z],index)=>{const length=.8+index*.08,branch=addMesh(g,new THREE.CylinderGeometry(.045,.1,length,9),mat('#69412b',{map:bark}),x*.48,h*y,z*.48);branch.rotation.z=x>0?-.72:.72;branch.rotation.x=z*.5});
    const canopyColor=catalog.colors[0],positions=[[-.58,.72,0],[.52,.74,.12],[0,.88,.42],[.08,.8,-.5],[-.32,1.02,.08],[.38,.97,-.18],[-.02,1.08,.22]];
    positions.forEach(([x,y,z],index)=>{const geometry=new THREE.IcosahedronGeometry(.72+(index%3)*.08,2);const pos=geometry.attributes.position;for(let j=0;j<pos.count;j++){const n=1+(seededNoise(j,index)-.5)*.16;pos.setXYZ(j,pos.getX(j)*n,pos.getY(j)*n,pos.getZ(j)*n)}geometry.computeVertexNormals();addMesh(g,geometry,mat(index%2?canopyColor:catalog.colors[1],{roughness:1}),x,h*y,z,1,index%2?.84:1,1)});
    if(item.state==='mature'){
      const fruitColor=catalog.kind==='blossom-tree'?catalog.colors[0]:catalog.colors[1];
      for(let i=0;i<22;i++){const a=i*2.16+(item.variant||0),r=.35+(i%4)*.16,y=h*(.72+(i%5)*.065);addMesh(g,new THREE.SphereGeometry(catalog.kind==='blossom-tree'?.09:.065,10,8),mat(fruitColor,{emissive:catalog.kind==='blossom-tree'?fruitColor:'#000000',emissiveIntensity:.04}),Math.cos(a)*r,y,Math.sin(a)*r)}
    }
  }
  g.scale.setScalar(.56+progress*.44);return g;
}
function decorModel(catalog,item){
  const g=new THREE.Group(),c1=catalog.colors[0],c2=catalog.colors[1],kind=catalog.kind,[fw,fh]=catalog.footprint;
  if(kind==='path'||kind==='soil'){addMesh(g,new THREE.BoxGeometry(fw*.92,.08,fh*.92),mat(c1),0,.03,0);if(kind==='path')for(let i=0;i<5;i++)addMesh(g,new THREE.BoxGeometry(.22,.025,.16),mat(c2),-.32+i*.16,.08,(i%2-.5)*.24,1,1,1,0,.2*(i%3),0)}
  if(kind==='lamp'){addMesh(g,new THREE.CylinderGeometry(.045,.065,1.15,9),mat(c2,{metalness:.45}),0,.58,0);addMesh(g,new THREE.BoxGeometry(.32,.3,.32),mat('#ffe784',{emissive:'#ffd45a',emissiveIntensity:1.2}),0,1.22,0);const light=new THREE.PointLight('#ffd987',0,5,2);light.position.set(0,1.4,0);g.add(light);lampLights.push(light)}
  if(kind==='bench'){for(let i=0;i<3;i++)addMesh(g,new THREE.BoxGeometry(1.45,.12,.18),mat(c1),0,.48+i*.26,-.16,1,1,1,-.08,0,0);addMesh(g,new THREE.BoxGeometry(1.5,.13,.48),mat(c1),0,.45,.18);[-.55,.55].forEach(x=>addMesh(g,new THREE.BoxGeometry(.1,.58,.1),mat(c2),x,.25,0))}
  if(kind==='hedge'){for(let i=0;i<5;i++)addMesh(g,new THREE.SphereGeometry(.38,10,7),mat(i%2?c1:c2),-.78+i*.39,.48,0,1,.95,1)}
  if(kind==='arch'){[-.65,.65].forEach(x=>addMesh(g,new THREE.CylinderGeometry(.07,.09,1.9,9),mat(c2),x,.95,0));addMesh(g,new THREE.TorusGeometry(.65,.07,8,20,Math.PI),mat(c2),0,1.87,0,1,1,1,0,0,0);for(let i=0;i<8;i++){const a=i/7*Math.PI;flowerHead(g,Math.cos(a)*.65,1.86+Math.sin(a)*.65,0,c1,'#ffd76b',.55)}}
  if(kind==='bridge'){for(let i=-5;i<=5;i++)addMesh(g,new THREE.BoxGeometry(.22,.09,1.05),mat(i%2?c1:c2),i*.23,.18+Math.cos(i/5*Math.PI)*.15,0,1,1,1,0,0,.03*i);[-.55,.55].forEach(z=>addMesh(g,new THREE.CylinderGeometry(.035,.035,2.7,7),mat(c2),0,.55,z,1,1,1,0,0,Math.PI/2))}
  if(kind==='pond'){addMesh(g,new THREE.CylinderGeometry(1.42,1.5,.16,30),mat('#6b7780'),0,.05,0);const water=addMesh(g,new THREE.CylinderGeometry(1.32,1.32,.05,32),mat(c1,{transparent:true,opacity:.82,metalness:.1,roughness:.18}),0,.15,0);waterObjects.push(water);for(let i=0;i<5;i++)addMesh(g,new THREE.CircleGeometry(.12,12),mat('#69a94d'),Math.cos(i*2.1)*.75,.19,Math.sin(i*2.1)*.75,1,1,1,-Math.PI/2)}
  if(kind==='fountain'){addMesh(g,new THREE.CylinderGeometry(1.25,1.35,.28,30),mat(c2),0,.14,0);addMesh(g,new THREE.CylinderGeometry(1.08,1.08,.08,30),mat('#58c6df',{transparent:true,opacity:.8}),0,.31,0);addMesh(g,new THREE.CylinderGeometry(.16,.22,1.12,12),mat(c2),0,.78,0);addMesh(g,new THREE.SphereGeometry(.22,14,10),mat(c1),0,1.38,0);for(let i=0;i<12;i++){const drop=addMesh(g,new THREE.SphereGeometry(.035,7,5),mat('#9ce8f5',{emissive:'#5bcde1',emissiveIntensity:.3}),Math.cos(i*.9)*.5,.55+(i%5)*.14,Math.sin(i*.9)*.5);waterObjects.push(drop)}}
  if(kind==='pergola'){[-1,1].forEach(x=>[-.62,.62].forEach(z=>addMesh(g,new THREE.BoxGeometry(.13,2,.13),mat(c2),x,1,z)));for(let i=-2;i<=2;i++)addMesh(g,new THREE.BoxGeometry(2.35,.12,.12),mat(c2),0,2.05,i*.3);for(let i=0;i<8;i++)leaf(g,-1+i*.28,2.08,(i%3-.5)*.4,c1,1.2,i)}
  if(kind==='atom'){addMesh(g,new THREE.SphereGeometry(.23,16,10),mat(c1,{emissive:c1,emissiveIntensity:.25}),0,1,0);for(let i=0;i<3;i++){const ring=addMesh(g,new THREE.TorusGeometry(.78,.035,8,36),mat(c2,{emissive:c2,emissiveIntensity:.2}),0,1,0,1,1,1,i*.8,i*.7,0);animated.push({object:ring,type:'spin',speed:.22+i*.05})}}
  if(kind==='rocket'){addMesh(g,new THREE.CylinderGeometry(.28,.34,1.7,14),mat(c1,{metalness:.25}),0,1.05,0);addMesh(g,new THREE.ConeGeometry(.29,.65,14),mat(c2),0,2.22,0);for(let i=0;i<3;i++){const a=i/3*Math.PI*2;addMesh(g,new THREE.BoxGeometry(.1,.55,.38),mat(c2),Math.cos(a)*.3,.48,Math.sin(a)*.3,1,1,1,0,-a,0)}const flame=addMesh(g,new THREE.ConeGeometry(.16,.55,10),mat('#ffb63f',{emissive:'#ff6f28',emissiveIntensity:1.1}),0,.03,0,1,1,1,Math.PI);animated.push({object:flame,type:'pulse',speed:5})}
  return g;
}
function createItemModel(item,preview=false){
  const catalog=catalogApi.byId[item.catalogId];let group;
  if(catalog.type==='decor')group=decorModel(catalog,item);
  else if(['fruit-tree','blossom-tree','pine','tree'].includes(catalog.kind))group=treeModel(catalog,item);
  else group=flowerModel(catalog,item);
  group.userData.itemId=item.id;group.userData.catalogId=item.catalogId;group.userData.baseScale=group.scale.x;
  if(preview)group.traverse(object=>{if(object.isMesh){object.material=object.material.clone();object.material.transparent=true;object.material.opacity=.52;object.castShadow=false}});
  return group;
}
function itemPosition(item,center=ownPlotCenter,dims=core.expansionFor(garden)){
  const catalog=catalogApi.byId[item.catalogId],[w,h]=core.footprintFor(catalog,item.rotation||0);
  const x=center.x+item.x-dims.cols/2+w/2,z=center.z+item.y-dims.rows/2+h/2;
  return new THREE.Vector3(x,.1+terrainHeight(x,z),z);
}
function disposeGroup(group){group.traverse(object=>{if(object.geometry)object.geometry.dispose();if(object.material){const list=Array.isArray(object.material)?object.material:[object.material];list.forEach(material=>material.dispose())}})}
function clearWorld(){
  itemGroups.forEach(group=>{world.remove(group);disposeGroup(group)});itemGroups.clear();animated=[];waterObjects=[];lampLights=[];
  if(sceneryGroup){world.remove(sceneryGroup);disposeGroup(sceneryGroup);sceneryGroup=null}
  if(selectionRing){world.remove(selectionRing);selectionRing.geometry.dispose();selectionRing.material.dispose();selectionRing=null}
}
function addPlotSurface(parent,center,dims,isMine=false){
  const texture=canvasTexture(isMine?'lawn-mine':'lawn-public',isMine?'#679d4d':'#5d9148',isMine?'#8ab765':'#77a95b',1200);
  texture.repeat.set(Math.max(4,dims.cols/5),Math.max(4,dims.rows/5));
  const ground=addMesh(parent,new THREE.BoxGeometry(dims.cols+2,.16,dims.rows+2),mat('#6f9f51',{map:texture,roughness:1}),center.x,.04,center.z);
  ground.receiveShadow=true;
}
function addFence(parent,center,dims,style='stone'){
  const halfX=dims.cols/2+1.1,halfZ=dims.rows/2+1.1,stone=canvasTexture('stone','#7c817d','#4f5552',650),wood=canvasTexture('wood','#754a2d','#3f2718',500);
  const material=style==='hedge'?mat('#2f7044',{roughness:1}):mat(style==='wood'?'#6a4228':'#777b76',{map:style==='wood'?wood:stone,roughness:1});
  const segment=2.4,wallH=style==='hedge'?1.45:.78;
  for(let x=-halfX;x<=halfX;x+=segment){
    if(Math.abs(x)>2.4)addMesh(parent,new THREE.BoxGeometry(segment*.94,wallH,.42),material,center.x+x,wallH/2,center.z-halfZ);
    addMesh(parent,new THREE.BoxGeometry(segment*.94,wallH,.42),material,center.x+x,wallH/2,center.z+halfZ);
  }
  for(let z=-halfZ+segment;z<halfZ;z+=segment){
    addMesh(parent,new THREE.BoxGeometry(.42,wallH,segment*.94),material,center.x-halfX,wallH/2,center.z+z);
    addMesh(parent,new THREE.BoxGeometry(.42,wallH,segment*.94),material,center.x+halfX,wallH/2,center.z+z);
  }
  [-2.4,2.4].forEach(x=>addMesh(parent,new THREE.BoxGeometry(.5,1.5,.5),mat('#525751',{map:stone,roughness:1}),center.x+x,.75,center.z-halfZ));
  addMesh(parent,new THREE.BoxGeometry(4.2,1.05,.12),mat('#5d351f',{map:wood,roughness:1}),center.x,.58,center.z-halfZ+.08);
}
function addCottage(parent,center,variant=0){
  const wallColors=['#e4c79e','#d5d7c8','#d9b894','#c6d6c7'],roofColors=['#7a3928','#3e555b','#7b4d31','#5a3d35'];
  const wall=mat(wallColors[variant%wallColors.length],{roughness:.95}),roof=mat(roofColors[variant%roofColors.length],{roughness:1});
  addMesh(parent,new THREE.BoxGeometry(5.5,3.2,4.1),wall,center.x,1.6,center.z);
  addMesh(parent,new THREE.BoxGeometry(3.45,.28,4.8),roof,center.x-1.32,3.75,center.z,1,1,1,0,0,.6);
  addMesh(parent,new THREE.BoxGeometry(3.45,.28,4.8),roof,center.x+1.32,3.75,center.z,1,1,1,0,0,-.6);
  addMesh(parent,new THREE.BoxGeometry(1.2,2.25,.16),mat('#623d25',{roughness:1}),center.x,1.15,center.z-2.12);
  [-1.75,1.75].forEach(x=>{addMesh(parent,new THREE.BoxGeometry(1.25,1.2,.12),mat('#9bd4e4',{metalness:.05,roughness:.12}),center.x+x,1.85,center.z-2.13);addMesh(parent,new THREE.BoxGeometry(.06,1.2,.16),mat('#f4f0de'),center.x+x,1.85,center.z-2.2);addMesh(parent,new THREE.BoxGeometry(1.25,.06,.16),mat('#f4f0de'),center.x+x,1.85,center.z-2.2)});
  addMesh(parent,new THREE.CylinderGeometry(.24,.3,2.2,10),mat('#6c4d3b',{roughness:1}),center.x+1.8,4.1,center.z+.9);
}
function labelSprite(text,color='#59d3be'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const context=canvas.getContext('2d');
  context.fillStyle='rgba(8,20,38,.88)';context.roundRect(6,6,500,116,30);context.fill();context.strokeStyle=color;context.lineWidth=5;context.stroke();
  context.fillStyle='#ffffff';context.font='700 38px Inter, sans-serif';context.textAlign='center';context.textBaseline='middle';context.fillText(String(text).slice(0,22),256,64);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.scale.set(8,2,1);return sprite;
}
function addPublicPlot(parent,plot,index){
  const center=new THREE.Vector3(plot.position.x,0,plot.position.z),dims=plot.dimensions||{cols:24,rows:24};
  addPlotSurface(parent,center,dims,false);addFence(parent,center,dims,index%2?'hedge':'stone');
  addCottage(parent,new THREE.Vector3(center.x,0,center.z+dims.rows/2-4),index);
  const sign=labelSprite(plot.name||`Bog‘bon ${index+1}`);sign.position.set(center.x,4.8,center.z-dims.rows/2-2.4);parent.add(sign);
  const items=(plot.items||[]).slice(0,90);
  if(items.length){
    items.forEach(item=>{if(!catalogApi.byId[item.catalogId])return;const model=createItemModel(item);model.position.copy(itemPosition(item,center,dims));model.rotation.y=THREE.MathUtils.degToRad(-(item.rotation||0));model.traverse(object=>{object.userData.publicPlotId=plot.id});parent.add(model)});
  }else{
    const defaults=['atirgul','lola','moychechak','lavanda','olma','archa'];
    for(let i=0;i<18;i++){const id=defaults[(i+index)%defaults.length],fake={id:`demo-${plot.id}-${i}`,catalogId:id,state:'mature',progress:1,variant:i,rotation:0,x:3+(i*3)%Math.max(6,dims.cols-6),y:3+(Math.floor(i/5)*4)%Math.max(6,dims.rows-8)};const model=createItemModel(fake);model.position.copy(itemPosition(fake,center,dims));model.traverse(object=>{object.userData.publicPlotId=plot.id});parent.add(model)}
  }
}
function rebuildTerrain(){
  if(terrain){world.remove(terrain);terrain.geometry.dispose();terrain.material.dispose()}if(grid){world.remove(grid);grid.geometry.dispose();grid.material.dispose()}
  const geometry=new THREE.PlaneGeometry(WORLD_SIZE,WORLD_SIZE,WORLD_SEGMENTS,WORLD_SEGMENTS),position=geometry.attributes.position;
  for(let i=0;i<position.count;i++)position.setZ(i,terrainHeight(position.getX(i),-position.getY(i)));
  geometry.computeVertexNormals();
  const texture=canvasTexture('world-grass','#527d3f','#789c4d',1800);texture.repeat.set(34,34);
  terrain=new THREE.Mesh(geometry,mat('#698f4c',{map:texture,roughness:1}));terrain.rotation.x=-Math.PI/2;terrain.receiveShadow=true;terrain.userData.ground=true;world.add(terrain);
  const dims=core.expansionFor(garden);grid=new THREE.GridHelper(Math.max(dims.cols,dims.rows),Math.max(dims.cols,dims.rows),'#d8f0bb','#43633a');grid.position.set(ownPlotCenter.x,.13,ownPlotCenter.z);grid.material.transparent=true;grid.material.opacity=activePlotId==='mine'?.12:0;world.add(grid);
  $('#worldSize').textContent=`${dims.cols} × ${dims.rows} shaxsiy yer`;
}
function addScenery(){
  const dims=core.expansionFor(garden),count=garden.settings.quality==='high'?85:38;
  sceneryGroup=new THREE.Group();world.add(sceneryGroup);
  addPlotSurface(sceneryGroup,ownPlotCenter,dims,true);addFence(sceneryGroup,ownPlotCenter,dims,'stone');addCottage(sceneryGroup,new THREE.Vector3(0,0,dims.rows/2-4),0);
  publicPlots.forEach((plot,index)=>addPublicPlot(sceneryGroup,plot,index));
  for(let i=0;i<count;i++){
    const angle=i*2.399,radius=48+(i%11)*8,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
    if(publicPlots.some(plot=>Math.abs(x-plot.position.x)<22&&Math.abs(z-plot.position.z)<22))continue;
    const fake={state:'mature',progress:1,variant:i},catalog={...catalogApi.byId[i%5===0?'archa':'chinor'],height:2.7+(i%4)*.35,colors:[i%3?'#356f40':'#4b8045','#244b30']};
    const model=treeModel(catalog,fake);model.position.set(x,terrainHeight(x,z),z);model.scale.multiplyScalar(.82+(i%5)*.1);model.rotation.y=seededNoise(i,8)*Math.PI;sceneryGroup.add(model);animated.push({object:model,type:'sway',speed:.25+i%4*.03,phase:i});
  }
  const mountainMat=mat('#697664',{roughness:1}),snowMat=mat('#dbe2db',{roughness:.95});
  for(let i=0;i<18;i++){const angle=i/18*Math.PI*2,r=118+(i%4)*8,x=Math.cos(angle)*r,z=Math.sin(angle)*r,height=18+(i%6)*5;addMesh(sceneryGroup,new THREE.ConeGeometry(13+(i%3)*4,height,10),mountainMat,x,terrainHeight(x,z)+height/2,z,1,1,1,0,seededNoise(i,9)*2,0);if(i%3===0)addMesh(sceneryGroup,new THREE.ConeGeometry(4.8,height*.3,10),snowMat,x,terrainHeight(x,z)+height*.82,z)}
  const waterMat=mat('#2b88a3',{transparent:true,opacity:.82,roughness:.18,metalness:.15});const lake=addMesh(sceneryGroup,new THREE.CircleGeometry(18,64),waterMat,-63,.18,58,1,.72,1,-Math.PI/2);waterObjects.push(lake);
  for(let i=0;i<24;i++){const x=-50+(i%8)*4,z=44+Math.floor(i/8)*4,rock=addMesh(sceneryGroup,new THREE.DodecahedronGeometry(.5+(i%4)*.25,1),mat(i%2?'#777a71':'#5f655e',{roughness:1}),x,terrainHeight(x,z)+.3,z,1,.65,1);rock.rotation.set(i*.2,i*.7,0)}
  const roadMat=mat('#9a835f',{map:canvasTexture('road','#9d8a69','#6f624e',800),roughness:1});
  addMesh(sceneryGroup,new THREE.BoxGeometry(WORLD_SIZE*.72,.06,5.4),roadMat,0,.055,-42);addMesh(sceneryGroup,new THREE.BoxGeometry(5.4,.06,WORLD_SIZE*.72),roadMat,-42,.06,0);
  for(let i=0;i<8;i++){const cloud=new THREE.Group();for(let p=0;p<5;p++){const puff=addMesh(cloud,new THREE.SphereGeometry(2.4+(p%3),14,9),new THREE.MeshLambertMaterial({color:'#ffffff',transparent:true,opacity:.34,depthWrite:false}),p*2.6-5.2,(p%2)*1.2,0,1,.52,1);puff.castShadow=false;puff.receiveShadow=false}cloud.position.set((i-4)*34,34+(i%3)*6,-86+(i%4)*54);sceneryGroup.add(cloud);animated.push({object:cloud,type:'cloud',speed:.35+(i%3)*.1,phase:i})}
  butterflies=[];
  const butterflyCount=garden.settings.quality==='high'?14:5;
  for(let i=0;i<butterflyCount;i++){const b=new THREE.Group(),wingMat=new THREE.MeshBasicMaterial({color:i%2?'#ffd45f':'#da72ff',side:THREE.DoubleSide});const wingGeo=new THREE.CircleGeometry(.12,12);const l=new THREE.Mesh(wingGeo,wingMat),r=l.clone();l.position.x=-.08;r.position.x=.08;b.add(l,r);b.position.set((Math.random()-.5)*dims.cols*.7,1+Math.random()*2,(Math.random()-.5)*dims.rows*.7);sceneryGroup.add(b);butterflies.push({group:b,l,r,phase:i*1.7,radius:2+i*.3,base:b.position.clone()})}
}
function renderWorldItems(){
  clearWorld();rebuildTerrain();
  for(const item of garden.items){
    const group=createItemModel(item);group.position.copy(itemPosition(item));group.rotation.y=THREE.MathUtils.degToRad(-(item.rotation||0));world.add(group);itemGroups.set(item.id,group);
    if(catalogApi.byId[item.catalogId]?.type==='plant'&&item.state!=='wilted')animated.push({object:group,type:'sway',speed:.45+(item.variant||0)*.03,phase:item.variant||0});
  }
  addScenery();selectItem(selectedItemId,false);applyEnvironment(garden.settings.timeOfDay,false);
}
function demoWorldPlots(){
  return[
    {id:'demo-zilola',name:'Zilola bog‘i',level:2,beautyScore:640,focusMinutes:180,dimensions:{cols:28,rows:28},items:[],position:{x:PLOT_GAP,z:0}},
    {id:'demo-temur',name:'Temur tajriba bog‘i',level:3,beautyScore:910,focusMinutes:265,dimensions:{cols:32,rows:30},items:[],position:{x:0,z:PLOT_GAP}},
    {id:'demo-madina',name:'Madina gullar vodiysi',level:2,beautyScore:735,focusMinutes:210,dimensions:{cols:28,rows:30},items:[],position:{x:-PLOT_GAP,z:0}},
    {id:'demo-aziz',name:'Aziz fizika hovlisi',level:4,beautyScore:1180,focusMinutes:340,dimensions:{cols:34,rows:32},items:[],position:{x:0,z:-PLOT_GAP}},
  ];
}
async function loadPublicWorld(){
  let plots=[];try{const data=await api('/api/garden/world');plots=Array.isArray(data.plots)?data.plots:[]}catch{}
  const me=currentUser(),real=plots.filter(plot=>!me?.id||plot.id!==me.id).slice(0,4);
  const slots=[{x:PLOT_GAP,z:0},{x:0,z:PLOT_GAP},{x:-PLOT_GAP,z:0},{x:0,z:-PLOT_GAP}];
  publicPlots=real.map((plot,index)=>({...plot,position:slots[index]}));
  for(const demo of demoWorldPlots())if(publicPlots.length<4&&!publicPlots.some(plot=>plot.id===demo.id))publicPlots.push({...demo,position:slots[publicPlots.length]});
}
function renderWorldMap(filter=''){
  const clean=String(filter||'').trim().toLocaleLowerCase('uz'),plots=publicPlots.filter(plot=>!clean||plot.name.toLocaleLowerCase('uz').includes(clean));
  const visual=$('#worldMapVisual');visual.innerHTML=`<button class="map-plot mine ${activePlotId==='mine'?'active':''}" data-visit="mine" type="button" style="left:50%;top:50%" aria-label="O‘z bog‘im"><span>🏡</span></button>${plots.map(plot=>{const left=50+plot.position.x/PLOT_GAP*31,top=50+plot.position.z/PLOT_GAP*31;return`<button class="map-plot ${activePlotId===plot.id?'active':''}" data-visit="${plot.id}" type="button" style="left:${left}%;top:${top}%" aria-label="${plot.name}"><span>🌳</span></button>`}).join('')}`;
  $('#worldPlotList').innerHTML=`<button class="world-plot" data-visit="mine" type="button"><span>🏡</span><div><b>Mening bog‘im</b><small>${core.expansionFor(garden).cols} × ${core.expansionFor(garden).rows} yer · qurish mumkin</small></div><em>Uyim</em></button>${plots.map(plot=>`<button class="world-plot" data-visit="${plot.id}" type="button"><span>🌿</span><div><b>${plot.name}</b><small>${plot.dimensions?.cols||24} × ${plot.dimensions?.rows||24} yer · ${plot.focusMinutes||0} daqiqa fokus</small></div><em>${plot.beautyScore||0} ball</em></button>`).join('')}`;
  $$('[data-visit]').forEach(button=>button.addEventListener('click',()=>visitPlot(button.dataset.visit)));
}
function openWorldMap(open=true){
  open?openModal('worldMapModal'):closeModal('worldMapModal');if(open){$('#worldSearch').value='';renderWorldMap()}
}
function visitPlot(plotId){
  const mine=plotId==='mine',plot=mine?null:publicPlots.find(entry=>entry.id===plotId);if(!mine&&!plot)return;
  activePlotId=mine?'mine':plot.id;cancelPlacement();selectItem('',false);const center=mine?ownPlotCenter:new THREE.Vector3(plot.position.x,0,plot.position.z);
  cameraTarget.set(center.x,1.2,center.z);cameraDistance=mine?Math.max(25,core.expansionFor(garden).cols*.92):Math.max(27,(plot.dimensions?.cols||24)*.95);cameraElevation=.64;cameraAzimuth=.78;updateCamera();
  $('#gardenWorldCard').classList.toggle('visiting',!mine);$('#visitBanner').classList.toggle('show',!mine);$('#visitBanner').setAttribute('aria-hidden',String(mine));
  if(!mine){$('#visitGardenName').textContent=plot.name;$('#gardenMessage').textContent=`${plot.name}: bu hudud faqat tomosha uchun ochildi.`}else $('#gardenMessage').textContent='O‘z bog‘ingizga qaytdingiz. Endi ekish va bezash mumkin.';
  if(grid)grid.material.opacity=mine?.12:0;openWorldMap(false);renderWorldMap();
}
function createLights(){
  hemisphere=new THREE.HemisphereLight('#cdeaff','#314a2d',1.7);scene.add(hemisphere);
  sunLight=new THREE.DirectionalLight('#fff1d2',4.1);sunLight.position.set(-45,68,32);sunLight.castShadow=true;sunLight.shadow.mapSize.set(2048,2048);sunLight.shadow.camera.left=-95;sunLight.shadow.camera.right=95;sunLight.shadow.camera.top=95;sunLight.shadow.camera.bottom=-95;sunLight.shadow.camera.far=210;sunLight.shadow.bias=-.0004;scene.add(sunLight);
  fillLight=new THREE.DirectionalLight('#91b9ff',.85);fillLight.position.set(44,26,-52);scene.add(fillLight);
  skyDome=new THREE.Mesh(new THREE.SphereGeometry(220,32,18),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color('#4ca8e2')},bottom:{value:new THREE.Color('#d8eff5')}},vertexShader:'varying vec3 vWorld; void main(){vec4 w=modelMatrix*vec4(position,1.0);vWorld=w.xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform vec3 top;uniform vec3 bottom;varying vec3 vWorld;void main(){float h=normalize(vWorld).y*.5+.5;gl_FragColor=vec4(mix(bottom,top,smoothstep(.05,.95,h)),1.0);}'}));scene.add(skyDome);
}
function applyEnvironment(mode='day',persist=true){
  garden.settings.timeOfDay=mode;
  const themes={day:{bg:'#8fcdf0',fog:'#b9def0',top:'#3a98d5',bottom:'#d7edf2',hemi:1.7,sun:4.1,fill:.85,weather:['☀','Yorqin kun']},sunset:{bg:'#e89279',fog:'#d8a48c',top:'#5d5ea5',bottom:'#f5ad78',hemi:1.15,sun:2.8,fill:1.2,weather:['◐','Oltin shom']},night:{bg:'#07142c',fog:'#0d2340',top:'#02081a',bottom:'#122b50',hemi:.38,sun:.26,fill:.28,weather:['☾','Yulduzli tun']}};
  const theme=themes[mode];scene.background=new THREE.Color(theme.bg);scene.fog=new THREE.Fog(theme.fog,120,310);hemisphere.intensity=theme.hemi;sunLight.intensity=theme.sun;fillLight.intensity=theme.fill;if(skyDome){skyDome.material.uniforms.top.value.set(theme.top);skyDome.material.uniforms.bottom.value.set(theme.bottom)}lampLights.forEach(light=>light.intensity=mode==='night'?2.2:mode==='sunset'?.7:0);
  $$('.environment-tools [data-time]').forEach(button=>button.classList.toggle('active',button.dataset.time===mode));
  $('#worldWeather').innerHTML=`<span>${theme.weather[0]}</span><div><small>HOZIRGI MUHIT</small><b>${theme.weather[1]}</b></div>`;
  if(persist)persistSettings();
}
function updateCamera(){
  const horizontal=Math.cos(cameraElevation)*cameraDistance;
  camera.position.set(cameraTarget.x+Math.sin(cameraAzimuth)*horizontal,cameraTarget.y+Math.sin(cameraElevation)*cameraDistance,cameraTarget.z+Math.cos(cameraAzimuth)*horizontal);
  camera.lookAt(cameraTarget);
}
function resetCamera(){
  const dims=activePlotId==='mine'?core.expansionFor(garden):(publicPlots.find(plot=>plot.id===activePlotId)?.dimensions||{cols:24});
  const center=plotCenter();cameraTarget.set(center.x,1.2,center.z);cameraDistance=Math.max(24,Math.min(58,dims.cols*.92));cameraAzimuth=.75;cameraElevation=.68;updateCamera();if(activePlotId==='mine')persistCamera();
}
function resize(){
  const rect=canvas.getBoundingClientRect(),ratio=garden.settings.quality==='high'?Math.min(devicePixelRatio,1.7):1;
  renderer.setPixelRatio(ratio);renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();
}
function pointerToGround(event){
  if(activePlotId!=='mine')return null;
  const rect=canvas.getBoundingClientRect();pointer.x=(event.clientX-rect.left)/rect.width*2-1;pointer.y=-(event.clientY-rect.top)/rect.height*2+1;raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObject(terrain,false)[0];if(!hit)return null;
  const dims=core.expansionFor(garden),x=Math.floor(hit.point.x-ownPlotCenter.x+dims.cols/2),y=Math.floor(hit.point.z-ownPlotCenter.z+dims.rows/2);
  return{x,y,point:hit.point};
}
function objectAt(event){
  const rect=canvas.getBoundingClientRect();pointer.x=(event.clientX-rect.left)/rect.width*2-1;pointer.y=-(event.clientY-rect.top)/rect.height*2+1;raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects([...itemGroups.values()],true);
  for(const hit of hits){let node=hit.object;while(node&&!node.userData.itemId)node=node.parent;if(node?.userData.itemId)return node.userData.itemId}
  return'';
}
function removeGhost(){if(ghost){world.remove(ghost);disposeGroup(ghost);ghost=null}if(ghostRing){world.remove(ghostRing);ghostRing.geometry.dispose();ghostRing.material.dispose();ghostRing=null}hoverCell=null;canvas.classList.remove('placing');$('#placementTip').classList.remove('show')}
function buildGhost(catalogId){
  removeGhost();const catalog=catalogApi.byId[catalogId],fake={id:'preview',catalogId,state:catalog.type==='plant'?'mature':'placed',progress:1,rotation:placementRotation,variant:1};
  ghost=createItemModel(fake,true);world.add(ghost);ghostRing=new THREE.Mesh(new THREE.RingGeometry(.42,.58,32),new THREE.MeshBasicMaterial({color:'#56e59a',transparent:true,opacity:.55,side:THREE.DoubleSide}));ghostRing.rotation.x=-Math.PI/2;world.add(ghostRing);canvas.classList.add('placing');
  $('#placementIcon').textContent=icons[catalogId]||'✿';$('#placementName').textContent=catalog.name;$('#placementTip').classList.add('show');
}
function updateGhost(event){
  if(!ghost||(!pendingCatalogId&&!movingId))return;const cell=pointerToGround(event);if(!cell)return;hoverCell=cell;
  const item=movingId?garden.items.find(entry=>entry.id===movingId):null,catalogId=item?.catalogId||pendingCatalogId,rotation=movingId?(item?.rotation??placementRotation):placementRotation;
  const catalog=catalogApi.byId[catalogId],[w,h]=core.footprintFor(catalog,rotation),dims=core.expansionFor(garden),valid=core.canPlace(garden,catalogId,cell.x,cell.y,rotation,movingId);
  const px=ownPlotCenter.x+cell.x-dims.cols/2+w/2,pz=ownPlotCenter.z+cell.y-dims.rows/2+h/2,py=.12+terrainHeight(px,pz);ghost.position.set(px,py,pz);ghost.rotation.y=THREE.MathUtils.degToRad(-rotation);ghostRing.position.set(px,py-.04,pz);ghostRing.scale.set(w,h,1);ghostRing.material.color.set(valid?'#50e39b':'#f05d76');
  $('#placementState').textContent=valid?'Yashil joyga bosing':'Bu joy band';$('#placementTip').classList.toggle('invalid',!valid);hoverCell.valid=valid;hoverCell.rotation=rotation;
}
function animate(now){
  const dt=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;
  animated.forEach(entry=>{if(entry.type==='sway')entry.object.rotation.z=Math.sin(now*.001*entry.speed+entry.phase)*.012;if(entry.type==='spin')entry.object.rotation.y+=dt*entry.speed;if(entry.type==='pulse')entry.object.scale.y=.85+Math.sin(now*.001*entry.speed)*.18;if(entry.type==='cloud'){entry.object.position.x+=dt*entry.speed;if(entry.object.position.x>145)entry.object.position.x=-145}});
  butterflies.forEach((b,index)=>{const t=now*.00025+index;b.group.position.x=b.base.x+Math.cos(t*(1+index*.03))*b.radius;b.group.position.z=b.base.z+Math.sin(t*.9)*b.radius;b.group.position.y=b.base.y+Math.sin(t*4)*.25;b.l.rotation.y=Math.sin(t*18)*.8;b.r.rotation.y=-Math.sin(t*18)*.8;b.group.lookAt(camera.position)});
  waterObjects.forEach((object,index)=>{object.position.y+=Math.sin(now*.002+index)*.00035});
  if(selectionRing)selectionRing.rotation.z+=dt*.55;if(ghostRing)ghostRing.material.opacity=.42+Math.sin(now*.004)*.12;
  renderer.render(scene,camera);requestAnimationFrame(animate);
}

/* ---------- 3D BOSHQARUV ---------- */
canvas.addEventListener('contextmenu',event=>event.preventDefault());
canvas.addEventListener('pointerdown',event=>{
  canvas.setPointerCapture(event.pointerId);pointerDown={x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,moved:false};
  dragMode=event.button===2||event.pointerType==='touch'?'rotate':'pan';canvas.classList.add('dragging');
});
canvas.addEventListener('pointermove',event=>{
  updateGhost(event);if(!pointerDown)return;
  const dx=event.clientX-pointerDown.lastX,dy=event.clientY-pointerDown.lastY;pointerDown.lastX=event.clientX;pointerDown.lastY=event.clientY;
  if(Math.hypot(event.clientX-pointerDown.x,event.clientY-pointerDown.y)>6)pointerDown.moved=true;
  if(dragMode==='rotate'){cameraAzimuth-=dx*.006;cameraElevation=THREE.MathUtils.clamp(cameraElevation+dy*.004,.28,1.2)}
  else{const factor=cameraDistance*.0015,right=new THREE.Vector3(Math.cos(cameraAzimuth),0,-Math.sin(cameraAzimuth)),forward=new THREE.Vector3(Math.sin(cameraAzimuth),0,Math.cos(cameraAzimuth));cameraTarget.addScaledVector(right,-dx*factor).addScaledVector(forward,-dy*factor);cameraTarget.x=THREE.MathUtils.clamp(cameraTarget.x,-118,118);cameraTarget.z=THREE.MathUtils.clamp(cameraTarget.z,-118,118)}
  updateCamera();
});
canvas.addEventListener('pointerup',async event=>{
  canvas.releasePointerCapture(event.pointerId);canvas.classList.remove('dragging');const clicked=pointerDown&&!pointerDown.moved;pointerDown=null;persistCamera();
  if(!clicked)return;
  if((pendingCatalogId||movingId)&&hoverCell?.valid){if(movingId)await moveItem(movingId,hoverCell.x,hoverCell.y,hoverCell.rotation);else await purchase(pendingCatalogId,hoverCell.x,hoverCell.y,placementRotation);return}
  const itemId=objectAt(event);selectItem(itemId);
});
canvas.addEventListener('pointerleave',()=>{if(pointerDown){pointerDown=null;canvas.classList.remove('dragging')}});
canvas.addEventListener('wheel',event=>{event.preventDefault();cameraDistance=THREE.MathUtils.clamp(cameraDistance+event.deltaY*.025,7,175);updateCamera()},{passive:false});

function selectItem(itemId,announce=true){
  selectedItemId=garden.items.some(item=>item.id===itemId)?itemId:'';
  if(selectionRing){world.remove(selectionRing);selectionRing.geometry.dispose();selectionRing.material.dispose();selectionRing=null}
  const panel=$('#selectionPanel');panel.classList.toggle('show',!!selectedItemId);panel.setAttribute('aria-hidden',String(!selectedItemId));
  if(!selectedItemId)return;
  const item=garden.items.find(entry=>entry.id===selectedItemId),catalog=catalogApi.byId[item.catalogId],position=itemPosition(item),[w,h]=core.footprintFor(catalog,item.rotation);
  selectionRing=new THREE.Mesh(new THREE.RingGeometry(.42,.58,40),new THREE.MeshBasicMaterial({color:'#78f4d0',transparent:true,opacity:.85,side:THREE.DoubleSide}));selectionRing.rotation.x=-Math.PI/2;selectionRing.position.set(position.x,.06,position.z);selectionRing.scale.set(w,h,1);world.add(selectionRing);
  $('#selectionArt').textContent=icons[catalog.id]||'✿';$('#selectionName').textContent=catalog.name;$('#selectionMeta').textContent=`${catalog.type==='plant'?`${catalog.minutes} daqiqa · `:''}${w}×${h} joy · ${item.state==='mature'?'gullagan':item.state==='wilted'?'qurigan':item.state==='growing'?`${Math.round(item.progress*100)}% o‘sgan`:'yangi'}`;
  const focusButton=$('#focusSelected');focusButton.style.display=catalog.type==='plant'&&['seed','wilted'].includes(item.state)?'block':'none';
  if(announce)$('#gardenMessage').textContent=`${catalog.name} tanlandi. Uni ko‘chirish, aylantirish yoki sotish mumkin.`;
}
function beginPlacement(catalogId){
  if(activePlotId!=='mine'){toast('Tashrif rejimida boshqa bog‘ni o‘zgartirib bo‘lmaydi.',true);return}
  pendingCatalogId=catalogId;movingId='';selectedItemId='';placementRotation=0;selectItem('',false);buildGhost(catalogId);
  const catalog=catalogApi.byId[catalogId];$('#gardenMessage').textContent=`${catalog.name}: kursorni yerda yurgizing va yashil joyga bosing.`;renderShop();closeShopMobile();
}
function beginMove(){
  const item=garden.items.find(entry=>entry.id===selectedItemId);if(!item)return;movingId=item.id;pendingCatalogId='';placementRotation=item.rotation||0;buildGhost(item.catalogId);itemGroups.get(item.id).visible=false;$('#gardenMessage').textContent='Element uchun yangi joyni belgilang.';
}
function cancelPlacement(){
  if(movingId&&itemGroups.get(movingId))itemGroups.get(movingId).visible=true;
  pendingCatalogId='';movingId='';removeGhost();renderShop();
}
function layoutSnapshot(){return garden.items.map(({id,x,y,rotation})=>({id,x,y,rotation:rotation||0}))}
function pushHistory(){history.push(layoutSnapshot());history=history.slice(-20);redoHistory=[];renderHistory()}
function renderHistory(){$('#undoGarden').disabled=!history.length;$('#redoGarden').disabled=!redoHistory.length}
async function applyLayout(layout){
  if(token){const data=await api('/api/garden/layout',{method:'POST',body:JSON.stringify({items:layout})});garden=core.normalizeGarden(data.garden)}
  else{const map=new Map(layout.map(item=>[item.id,item]));garden.items=garden.items.map(item=>({...item,...map.get(item.id)}));garden=core.normalizeGarden(garden);syncLocal()}
  renderAll();
}
async function undo(){if(!history.length||busy)return;busy=true;try{redoHistory.push(layoutSnapshot());await applyLayout(history.pop());toast('Oxirgi joylashuv bekor qilindi.')}catch(error){toast(error.message,true)}finally{busy=false;renderHistory()}}
async function redo(){if(!redoHistory.length||busy)return;busy=true;try{history.push(layoutSnapshot());await applyLayout(redoHistory.pop());toast('Joylashuv qaytarildi.')}catch(error){toast(error.message,true)}finally{busy=false;renderHistory()}}

/* ---------- IQTISOD VA SERVER ---------- */
async function purchase(catalogId,x,y,rotation){
  const item=catalogApi.byId[catalogId];if(!item||busy)return;if(!isAdminAccount()&&impulse<item.price){toast(`${item.name} uchun yana ${item.price-impulse} Impulse kerak.`,true);return}
  busy=true;try{
    if(token){const data=await api('/api/garden/purchase',{method:'POST',body:JSON.stringify({catalogId,x,y,rotation})});garden=core.normalizeGarden(data.garden);impulse=data.impulse}
    else{if(!core.canPlace(garden,catalogId,x,y,rotation))throw new Error('Bu joy band.');garden.items.push({id:core.makeId(),catalogId,x,y,rotation,state:item.type==='plant'?'seed':'placed',progress:0,variant:Math.floor(Math.random()*6),plantedAt:new Date().toISOString(),maturedAt:null});garden.stats.impulseSpent+=item.price;if(!isAdminAccount())impulse-=item.price;garden.updatedAt=new Date().toISOString();syncLocal()}
    history=[];redoHistory=[];cancelPlacement();syncLocal();renderAll();toast(`${item.name} bog‘ingizga qo‘shildi.`);
  }catch(error){toast(error.message,true)}finally{busy=false}
}
async function moveItem(itemId,x,y,rotation){
  const item=garden.items.find(entry=>entry.id===itemId);if(!item||busy)return;pushHistory();busy=true;
  try{
    if(token){const data=await api('/api/garden/move',{method:'POST',body:JSON.stringify({itemId,x,y,rotation})});garden=core.normalizeGarden(data.garden)}
    else{if(!core.canPlace(garden,item.catalogId,x,y,rotation,item.id))throw new Error('Bu joy band.');item.x=x;item.y=y;item.rotation=rotation;syncLocal()}
    movingId='';removeGhost();syncLocal();renderAll();selectItem(itemId,false);toast('Element yangi joyga ko‘chirildi.');
  }catch(error){history.pop();if(itemGroups.get(itemId))itemGroups.get(itemId).visible=true;toast(error.message,true)}finally{busy=false;renderHistory()}
}
async function rotateSelected(){
  const item=garden.items.find(entry=>entry.id===selectedItemId);if(!item||busy)return;const rotation=((item.rotation||0)+90)%360;
  if(!core.canPlace(garden,item.catalogId,item.x,item.y,rotation,item.id)){toast('Bu yerda aylantirish uchun joy yetarli emas.',true);return}
  await moveItem(item.id,item.x,item.y,rotation);
}
async function sellSelected(){
  const item=garden.items.find(entry=>entry.id===selectedItemId),catalog=item&&catalogApi.byId[item.catalogId];if(!item||!catalog||busy)return;
  const button=$('#sellSelected'),refund=Math.max(1,Math.floor(catalog.price*.65));
  if(button.dataset.confirm!=='yes'){button.dataset.confirm='yes';button.textContent=`Tasdiqlash: +${refund} ϟ`;clearTimeout(sellConfirmTimer);sellConfirmTimer=setTimeout(()=>{button.dataset.confirm='';button.textContent='Sotish'},3500);return}
  busy=true;try{
    if(token){const data=await api('/api/garden/sell',{method:'POST',body:JSON.stringify({itemId:item.id})});garden=core.normalizeGarden(data.garden);impulse=data.impulse}
    else{if(garden.focus?.plantId===item.id)throw new Error('Fokusdagi o‘simlikni sotib bo‘lmaydi.');garden.items=garden.items.filter(entry=>entry.id!==item.id);garden.stats.itemsSold+=1;impulse+=refund;syncLocal()}
    selectedItemId='';history=[];redoHistory=[];syncLocal();renderAll();toast(`${catalog.name} sotildi: +${refund} Impulse.`);
  }catch(error){toast(error.message,true)}finally{busy=false;button.dataset.confirm='';button.textContent='Sotish'}
}
async function expand(){
  const next=catalogApi.expansions.find(item=>item.level===garden.level+1);if(!next||busy)return;if(!isAdminAccount()&&impulse<next.price){toast(`Kengaytirish uchun yana ${next.price-impulse} Impulse kerak.`,true);return}
  busy=true;try{
    if(token){const data=await api('/api/garden/expand',{method:'POST'});garden=core.normalizeGarden(data.garden);impulse=data.impulse}
    else{garden.level=next.level;garden.stats.impulseSpent+=next.price;if(!isAdminAccount())impulse-=next.price;garden.updatedAt=new Date().toISOString();syncLocal()}
    resetCamera();syncLocal();renderAll();toast(`${next.name} ochildi!`);
  }catch(error){toast(error.message,true)}finally{busy=false}
}
async function claimMission(id){
  const mission=missions.find(item=>item.id===id);if(!mission||!mission.ready||mission.claimed||busy)return;busy=true;
  try{
    if(token){const data=await api('/api/garden/mission/claim',{method:'POST',body:JSON.stringify({missionId:id})});garden=core.normalizeGarden(data.garden);impulse=data.impulse;missions=data.missions}
    else{garden.stats.missionsClaimed.push(id);impulse+=mission.reward;syncLocal();missions=guestMissions()}
    syncLocal();renderStats();renderMissions();toast(`Vazifa bajarildi: +${mission.reward} Impulse!`);
  }catch(error){toast(error.message,true)}finally{busy=false}
}

/* ---------- FOKUS ---------- */
function openFocus(item){
  const catalog=catalogApi.byId[item.catalogId],revive=item.state==='wilted',minutes=Math.round(catalog.minutes*(revive ? .6 : 1));modalPlantId=item.id;
  $('#focusPlantPreview').textContent=icons[catalog.id]||'🌱';$('#focusTitle').textContent=`${catalog.name}${revive?'ni tiklash':'ni o‘stirish'}`;$('#focusDescription').textContent=revive?`Qurigan ${catalog.name.toLowerCase()}ni ${minutes} daqiqalik fokus bilan qayta tiklang.`:`${catalog.name} ${minutes} daqiqalik faol o‘rganishdan keyin to‘liq o‘sadi.`;$('#focusDuration').textContent=`${minutes} daqiqa`;openModal('focusModal');
}
async function startFocus(){
  if(!modalPlantId||busy)return;busy=true;
  try{
    if(token){const data=await api('/api/garden/focus/start',{method:'POST',body:JSON.stringify({plantId:modalPlantId})});garden=core.normalizeGarden(data.garden);impulse=data.impulse}
    else{if(garden.focus)throw new Error('Avval joriy fokus sessiyasini yakunlang.');const plant=garden.items.find(item=>item.id===modalPlantId),catalog=plant&&catalogApi.byId[plant.catalogId];if(!plant||!catalog)throw new Error('O‘simlik topilmadi.');const durationSeconds=Math.round(catalog.minutes*60*(plant.state==='wilted' ? .6 : 1)),now=Date.now();plant.state='growing';plant.progress=0;garden.focus={id:core.makeId(),plantId:plant.id,status:'active',activeSeconds:0,durationSeconds,startedAt:now,lastHeartbeatAt:now,lastActiveAt:now};syncLocal()}
    closeModal('focusModal');syncLocal();renderAll();toast('Fokus boshlandi. Endi darsda faol o‘rganing.');setTimeout(()=>location.href='physics8.html',650);
  }catch(error){toast(error.message,true)}finally{busy=false}
}

/* ---------- UI ---------- */
function renderShop(){
  const list=catalogApi.catalog.filter(item=>item.type===shopType&&(shopFilter==='all'||kindGroup(item.kind)===shopFilter));
  $('#shopFilters').innerHTML=filters[shopType].map(([id,label])=>`<button class="${shopFilter===id?'active':''}" data-filter="${id}" type="button">${label}</button>`).join('');
  $('#shopList').innerHTML=list.map(item=>{const[w,h]=item.footprint;return`<button class="shop-item ${pendingCatalogId===item.id?'selected':''}" data-catalog="${item.id}" type="button"><span class="shop-art">${icons[item.id]||'✿'}</span><span class="shop-copy"><b>${item.name}</b><small>${item.description}</small><em>${item.type==='plant'?`${item.minutes} daqiqa fokus`:`${w}×${h} joy`}</em></span><span class="shop-price"><b>${item.price} ϟ</b><small>+${item.points} ball</small><i>${item.rarity}</i></span></button>`}).join('');
  $$('[data-catalog]').forEach(button=>button.addEventListener('click',()=>beginPlacement(button.dataset.catalog)));
  $$('#shopFilters [data-filter]').forEach(button=>button.addEventListener('click',()=>{shopFilter=button.dataset.filter;renderShop()}));
}
function renderStats(){
  const view=core.publicGarden(garden),dims=view.dimensions,mature=view.maturePlants;
  $('#gardenImpulse').textContent=impulseLabel();$('#shopImpulse').textContent=impulseLabel();$('#grownPlants').textContent=mature;$('#totalFocus').textContent=`${view.focusMinutes} daq`;$('#gardenPoints').textContent=view.beautyScore;$('#gardenDiversity').textContent=`${view.diversity} tur`;$('#gardenTitle').textContent=dims.name;$('#sideGardenLevel').textContent=garden.level;$('#sideGardenName').textContent=dims.name;$('#sideGardenTrack').style.width=`${garden.level/4*100}%`;
  const next=catalogApi.expansions.find(item=>item.level===garden.level+1);$('#sideGardenNext').textContent=next?`Keyingi kengayish: ${next.price} ϟ`:'Eng katta bog‘ darajasi';$('#expandGarden').disabled=!next;$('#expandName').textContent=next?.name||'Eng katta maydon';$('#expandMeta').textContent=next?`${next.cols} × ${next.rows} katak · ${next.price} Impulse`:'Bog‘ingiz to‘liq kengaygan';
  $('#heroFocusMinutes').textContent=`${view.focusMinutes} daqiqa`;$('#heroFocusStatus').textContent=garden.focus?'Fokus davom etmoqda — darsga qayting.':mature?'Bog‘ingiz yashnamoqda. Yangi kompozitsiya yarating.':'Yangi nihol eking va dars bilan o‘stiring.';
  const user=currentUser(),name=user?.name||'Izlanuvchi';$('#gardenUserName').textContent=name;$('#gardenAvatar').textContent=name.slice(0,2).toUpperCase();$('#gardenAccountMeta').textContent=token?'Bulutda saqlanadi':'Mahalliy bog‘';
}
function renderMissions(){
  const done=missions.filter(item=>item.claimed).length;$('#missionSideMeta').textContent=`${done} / ${missions.length||4} mukofot olindi`;
  $('#missionsList').innerHTML=missions.map(item=>`<article class="mission-item"><span>${item.claimed?'✓':item.ready?'★':'⚑'}</span><div><b>${item.title}</b><small>${item.description} · +${item.reward} Impulse</small></div><button class="${item.claimed?'claimed':''}" data-mission="${item.id}" type="button" ${!item.ready||item.claimed?'disabled':''}>${item.claimed?'Olindi':item.ready?'Olish':'Jarayonda'}</button></article>`).join('');
  $$('[data-mission]').forEach(button=>button.addEventListener('click',()=>claimMission(button.dataset.mission)));
}
function renderAll(){cancelPlacement();renderWorldItems();renderStats();renderShop();missions=token?missions:guestMissions();renderMissions();renderHistory()}
function openModal(id){$('#'+id).classList.add('open');$('#'+id).setAttribute('aria-hidden','false')}
function closeModal(id){$('#'+id).classList.remove('open');$('#'+id).setAttribute('aria-hidden','true')}
function setMenu(open){$('#gardenSidebar').classList.toggle('open',open);$('#gardenOverlay').classList.toggle('open',open)}
function openMissions(open){$('#missionsDrawer').classList.toggle('open',open);$('#missionsDrawer').setAttribute('aria-hidden',String(!open));$('#drawerBackdrop').classList.toggle('open',open)}
function closeShopMobile(){$('#gardenShop').classList.remove('open')}
async function persistSettings(){
  garden.updatedAt=new Date().toISOString();syncLocal();
  if(token)api('/api/garden/settings',{method:'POST',body:JSON.stringify({timeOfDay:garden.settings.timeOfDay,quality:garden.settings.quality,sound:garden.settings.sound})}).catch(()=>{});
}
function persistCamera(){
  garden.camera={targetX:cameraTarget.x,targetZ:cameraTarget.z,distance:cameraDistance,azimuth:cameraAzimuth,elevation:cameraElevation};syncLocal();
  if(token)api('/api/garden/settings',{method:'POST',body:JSON.stringify({camera:garden.camera})}).catch(()=>{});
}
function toggleQuality(){
  garden.settings.quality=garden.settings.quality==='high'?'low':'high';$('#qualityToggle').classList.toggle('active',garden.settings.quality==='high');persistSettings();resize();renderWorldItems();toast(garden.settings.quality==='high'?'Yuqori grafik sifati yoqildi.':'Tezkor grafik rejimi yoqildi.');
}
function toggleSound(){
  garden.settings.sound=!garden.settings.sound;$('#soundToggle').classList.toggle('active',garden.settings.sound);persistSettings();
  if(garden.settings.sound){
    audioContext??=new AudioContext();const length=audioContext.sampleRate*2,buffer=audioContext.createBuffer(1,length,audioContext.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*.14;ambientSource=audioContext.createBufferSource();ambientSource.buffer=buffer;ambientSource.loop=true;const filter=audioContext.createBiquadFilter(),gain=audioContext.createGain();filter.type='lowpass';filter.frequency.value=620;gain.gain.value=.035;ambientSource.connect(filter).connect(gain).connect(audioContext.destination);ambientSource.start();toast('Bog‘ shabadasi yoqildi.');
  }else{ambientSource?.stop();ambientSource=null;toast('Bog‘ ovozi o‘chirildi.')}
}

$('#openGardenMenu').addEventListener('click',()=>setMenu(true));$('#closeGardenMenu').addEventListener('click',()=>setMenu(false));$('#gardenOverlay').addEventListener('click',()=>setMenu(false));
$('#openShop').addEventListener('click',()=>$('#gardenShop').classList.add('open'));$('#closeShop').addEventListener('click',closeShopMobile);
$('#openHow').addEventListener('click',()=>openModal('howModal'));$$('[data-close-how]').forEach(node=>node.addEventListener('click',()=>closeModal('howModal')));
$$('[data-close-focus]').forEach(node=>node.addEventListener('click',()=>closeModal('focusModal')));$('#startFocus').addEventListener('click',startFocus);
$('#openMissions').addEventListener('click',()=>openMissions(true));$('#closeMissions').addEventListener('click',()=>openMissions(false));$('#drawerBackdrop').addEventListener('click',()=>openMissions(false));
$('#openWorldMap').addEventListener('click',()=>openWorldMap(true));$$('[data-close-world-map]').forEach(node=>node.addEventListener('click',()=>openWorldMap(false)));$('#worldSearch').addEventListener('input',event=>renderWorldMap(event.target.value));$('#returnHomePlot').addEventListener('click',()=>visitPlot('mine'));
$('#shopTabs').addEventListener('click',event=>{const button=event.target.closest('[data-shop]');if(!button)return;shopType=button.dataset.shop;shopFilter='all';$$('[data-shop]').forEach(node=>node.classList.toggle('active',node===button));renderShop()});
$('#moveSelected').addEventListener('click',beginMove);$('#rotateSelected').addEventListener('click',rotateSelected);$('#sellSelected').addEventListener('click',sellSelected);$('#focusSelected').addEventListener('click',()=>{const item=garden.items.find(entry=>entry.id===selectedItemId);if(item)openFocus(item)});$('#clearSelection').addEventListener('click',()=>selectItem(''));
$('#expandGarden').addEventListener('click',expand);$('#undoGarden').addEventListener('click',undo);$('#redoGarden').addEventListener('click',redo);
$('#cameraHome').addEventListener('click',resetCamera);$('#cameraLeft').addEventListener('click',()=>{cameraAzimuth-=Math.PI/4;updateCamera();if(activePlotId==='mine')persistCamera()});$('#cameraRight').addEventListener('click',()=>{cameraAzimuth+=Math.PI/4;updateCamera();if(activePlotId==='mine')persistCamera()});$('#cameraZoomIn').addEventListener('click',()=>{cameraDistance=Math.max(7,cameraDistance-7);updateCamera();if(activePlotId==='mine')persistCamera()});$('#cameraZoomOut').addEventListener('click',()=>{cameraDistance=Math.min(175,cameraDistance+7);updateCamera();if(activePlotId==='mine')persistCamera()});$('#cameraExplore').addEventListener('click',()=>{activePlotId='mine';cameraTarget.set(0,4,0);cameraDistance=118;cameraElevation=.58;cameraAzimuth=.72;updateCamera();$('#gardenMessage').textContent='Idrok dunyosi: atrofdagi bog‘lar, yo‘llar, ko‘l va tog‘larni ko‘ring.'});
$$('[data-time]').forEach(button=>button.addEventListener('click',()=>applyEnvironment(button.dataset.time)));$('#qualityToggle').addEventListener('click',toggleQuality);$('#soundToggle').addEventListener('click',toggleSound);$('#closeWorldHelp').addEventListener('click',()=>$('#worldHelp').remove());
$('#gardenTheme').addEventListener('click',()=>{document.body.classList.toggle('dark');state.theme=document.body.classList.contains('dark')?'dark':'light';localStorage.setItem('idrokState',JSON.stringify(state))});
addEventListener('resize',resize);addEventListener('keydown',event=>{if(event.key==='Escape'){cancelPlacement();selectItem('');closeModal('focusModal');closeModal('howModal');openWorldMap(false);openMissions(false);closeShopMobile();setMenu(false)}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo()}});
async function initialize(){
  if(state.theme==='dark')document.body.classList.add('dark');
  if(token){try{const data=await api('/api/garden');garden=core.normalizeGarden(data.garden);impulse=data.impulse;missions=data.missions||[]}catch(error){garden=readGuest();missions=guestMissions();toast(`${error.message} Mahalliy rejim ochildi.`,true)}}
  else{garden=readGuest();missions=guestMissions()}
  await loadPublicWorld();createLights();syncLocal();cameraTarget.set(garden.camera.targetX||0,1.2,garden.camera.targetZ||0);cameraDistance=Math.max(30,garden.camera.distance||38);cameraAzimuth=garden.camera.azimuth||.75;cameraElevation=garden.camera.elevation||.72;updateCamera();resize();renderAll();renderWorldMap();worldReady=true;$('#qualityToggle').classList.toggle('active',garden.settings.quality==='high');$('#soundToggle').classList.toggle('active',garden.settings.sound);
  requestAnimationFrame(animate);requestAnimationFrame(()=>{
    const loading=$('#worldLoading');loading.classList.add('hide');
    setTimeout(()=>{loading.hidden=true},450);
  });
}

initialize().catch(error=>{console.error(error);$('#worldLoading').innerHTML=`<span class="loading-seed">⚠</span><b>3D bog‘ ochilmadi</b><small>${error.message}</small>`});

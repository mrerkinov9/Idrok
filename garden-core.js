(() => {
  'use strict';
  const catalogApi=typeof module!=='undefined'&&module.exports?require('./garden-catalog.js'):window.IDROK_GARDEN_CATALOG;
  const nowIso=now=>new Date(now).toISOString();
  const makeId=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`g-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

  function createGarden(now=Date.now()){
    return{
      version:2,level:1,items:[],focus:null,
      stats:{totalFocusSeconds:0,completedSessions:0,failedSessions:0,plantsGrown:0,impulseSpent:0,itemsSold:0,missionsClaimed:[]},
      settings:{timeOfDay:'day',quality:'high',sound:false},
      camera:{targetX:0,targetZ:0,distance:32,azimuth:0.75,elevation:0.8},
      createdAt:nowIso(now),updatedAt:nowIso(now),
    };
  }

  function expansionFor(garden){
    return catalogApi.expansions.find(item=>item.level===Number(garden?.level))||catalogApi.expansions[0];
  }
  function footprintFor(catalog,rotation=0){
    const [w,h]=catalog?.footprint||[1,1];
    return Math.abs(Math.round(rotation/90))%2?[h,w]:[w,h];
  }
  function cellsFor(catalog,x,y,rotation=0){
    const [w,h]=footprintFor(catalog,rotation),cells=[];
    for(let dz=0;dz<h;dz++)for(let dx=0;dx<w;dx++)cells.push([x+dx,y+dz]);
    return cells;
  }
  function canPlace(garden,catalogId,x,y,rotation=0,exceptId=''){
    const catalog=catalogApi.byId[catalogId],expansion=expansionFor(garden);
    if(!catalog)return false;
    const cellX=Math.floor(Number(x)),cellY=Math.floor(Number(y));
    const candidate=cellsFor(catalog,cellX,cellY,rotation);
    if(candidate.some(([cx,cy])=>cx<0||cy<0||cx>=expansion.cols||cy>=expansion.rows))return false;
    const occupied=new Set();
    for(const item of garden.items||[]){
      if(item.id===exceptId)continue;
      const itemCatalog=catalogApi.byId[item.catalogId];
      cellsFor(itemCatalog,item.x,item.y,item.rotation||0).forEach(([cx,cy])=>occupied.add(`${cx}:${cy}`));
    }
    return candidate.every(([cx,cy])=>!occupied.has(`${cx}:${cy}`));
  }
  function isCellFree(garden,x,y,exceptId=''){return canPlace(garden,'yolak',x,y,0,exceptId)}
  function nearestFree(garden,catalogId,startX,startY,rotation=0){
    const expansion=expansionFor(garden),max=Math.max(expansion.cols,expansion.rows);
    for(let radius=0;radius<max;radius++){
      for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
        if(Math.max(Math.abs(dx),Math.abs(dz))!==radius)continue;
        const x=startX+dx,y=startY+dz;
        if(canPlace(garden,catalogId,x,y,rotation))return{x,y};
      }
    }
    return null;
  }

  function normalizeGarden(value,now=Date.now()){
    const base=createGarden(now);
    if(!value||typeof value!=='object')return base;
    const level=clamp(Math.floor(Number(value.level)||1),1,4);
    const legacy=Number(value.version||1)<2;
    const legacySizes={1:[6,5],2:[8,6],3:[10,7],4:[12,8]};
    const expansion=catalogApi.expansions.find(item=>item.level===level)||catalogApi.expansions[0];
    const offset=legacy?{
      x:Math.floor((expansion.cols-(legacySizes[level]?.[0]||6))/2),
      y:Math.floor((expansion.rows-(legacySizes[level]?.[1]||5))/2),
    }:{x:0,y:0};
    const garden={...base,...value,version:2,level,items:[],focus:null};
    const rawItems=Array.isArray(value.items)?value.items.slice(0,1800):[];
    for(const raw of rawItems){
      const catalog=catalogApi.byId[raw?.catalogId];
      if(!catalog)continue;
      const allowed=catalog.type==='plant'?['seed','growing','mature','wilted']:['placed'];
      const rotation=((Math.round(Number(raw.rotation)||0)/90)*90%360+360)%360;
      const wantedX=Math.floor(Number(raw.x)||0)+offset.x,wantedY=Math.floor(Number(raw.y)||0)+offset.y;
      const spot=canPlace(garden,catalog.id,wantedX,wantedY,rotation)?{x:wantedX,y:wantedY}:nearestFree(garden,catalog.id,wantedX,wantedY,rotation);
      if(!spot)continue;
      garden.items.push({
        id:String(raw.id||makeId()),catalogId:catalog.id,x:spot.x,y:spot.y,rotation,
        state:allowed.includes(raw.state)?raw.state:(catalog.type==='plant'?'seed':'placed'),
        progress:clamp(Number(raw.progress)||0,0,1),variant:clamp(Math.floor(Number(raw.variant)||0),0,5),
        plantedAt:raw.plantedAt||null,maturedAt:raw.maturedAt||null,
      });
    }
    garden.stats={
      totalFocusSeconds:Math.max(0,Number(value.stats?.totalFocusSeconds)||0),
      completedSessions:Math.max(0,Number(value.stats?.completedSessions)||0),
      failedSessions:Math.max(0,Number(value.stats?.failedSessions)||0),
      plantsGrown:Math.max(0,Number(value.stats?.plantsGrown)||0),
      impulseSpent:Math.max(0,Number(value.stats?.impulseSpent)||0),
      itemsSold:Math.max(0,Number(value.stats?.itemsSold)||0),
      missionsClaimed:Array.isArray(value.stats?.missionsClaimed)?[...new Set(value.stats.missionsClaimed.map(String))].slice(0,100):[],
    };
    garden.settings={
      timeOfDay:['day','sunset','night'].includes(value.settings?.timeOfDay)?value.settings.timeOfDay:'day',
      quality:['low','high'].includes(value.settings?.quality)?value.settings.quality:'high',
      sound:value.settings?.sound===true,
    };
    garden.camera={
      targetX:Number(value.camera?.targetX)||0,targetZ:Number(value.camera?.targetZ)||0,
      distance:clamp(Number(value.camera?.distance)||32,12,88),
      azimuth:Number(value.camera?.azimuth)||0.75,elevation:clamp(Number(value.camera?.elevation)||0.8,0.3,1.25),
    };
    if(value.focus&&typeof value.focus==='object'){
      const plant=garden.items.find(item=>item.id===value.focus.plantId&&catalogApi.byId[item.catalogId]?.type==='plant');
      if(plant&&['active','paused'].includes(value.focus.status)){
        garden.focus={id:String(value.focus.id||makeId()),plantId:plant.id,status:value.focus.status,activeSeconds:Math.max(0,Number(value.focus.activeSeconds)||0),durationSeconds:Math.max(60,Number(value.focus.durationSeconds)||catalogApi.byId[plant.catalogId].minutes*60),startedAt:Number(value.focus.startedAt)||now,lastHeartbeatAt:Number(value.focus.lastHeartbeatAt)||now,lastActiveAt:Number(value.focus.lastActiveAt)||now};
      }
    }
    garden.updatedAt=value.updatedAt||nowIso(now);
    return garden;
  }

  function gardenPoints(garden){
    return(garden.items||[]).reduce((total,item)=>{
      const catalog=catalogApi.byId[item.catalogId];if(!catalog)return total;
      if(catalog.type==='decor')return total+catalog.points;
      if(item.state==='mature')return total+catalog.points;
      if(item.state==='growing')return total+Math.round(catalog.points*Math.max(.1,item.progress*.6));
      return total;
    },0)+Math.max(0,Number(garden.level)-1)*100;
  }
  function focusMinutes(garden){return Math.floor((Number(garden.stats?.totalFocusSeconds)||0)/60)}
  function beautyScore(garden){
    const mature=(garden.items||[]).filter(item=>item.state==='mature');
    const decor=(garden.items||[]).filter(item=>catalogApi.byId[item.catalogId]?.type==='decor');
    const diversity=new Set([...mature,...decor].map(item=>item.catalogId)).size;
    const balance=Math.min(mature.length,decor.length)*8;
    return gardenPoints(garden)+diversity*22+balance;
  }
  function publicGarden(garden){
    const normalized=normalizeGarden(garden);
    const mature=normalized.items.filter(item=>item.state==='mature').length;
    return{...normalized,dimensions:expansionFor(normalized),gardenPoints:gardenPoints(normalized),focusMinutes:focusMinutes(normalized),beautyScore:beautyScore(normalized),diversity:new Set(normalized.items.map(item=>item.catalogId)).size,maturePlants:mature};
  }
  const api={createGarden,normalizeGarden,expansionFor,footprintFor,cellsFor,canPlace,isCellFree,nearestFree,gardenPoints,focusMinutes,beautyScore,publicGarden,makeId};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(typeof window!=='undefined')window.IDROK_GARDEN_CORE=api;
})();

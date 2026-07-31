const fs=require('fs');
const vm=require('vm');
const https=require('https');
const context={window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('phet-map.js','utf8'),context);
const catalog=context.window.IDROK_PHET.catalog;
const check=async item=>{
  const uz=`https://phet.colorado.edu/sims/html/${item.slug}/latest/${item.slug}_uz.html`;
  const uzResult=await new Promise(resolve=>{const request=https.request(uz,{method:'HEAD',timeout:15000},response=>{response.resume();resolve({status:response.statusCode});});request.on('timeout',()=>{request.destroy();resolve({status:0});});request.on('error',()=>resolve({status:0}));request.end();});
  if(uzResult.status>=200&&uzResult.status<400)return {key:item.key,slug:item.slug,status:uzResult.status,locale:'uz',url:uz};
  const en=`https://phet.colorado.edu/sims/html/${item.slug}/latest/${item.slug}_en.html`;
  const enResult=await new Promise(resolve=>{const request=https.request(en,{method:'HEAD',timeout:15000},response=>{response.resume();resolve({status:response.statusCode});});request.on('timeout',()=>{request.destroy();resolve({status:0});});request.on('error',()=>resolve({status:0}));request.end();});
  return {key:item.key,slug:item.slug,status:enResult.status,locale:enResult.status>=200&&enResult.status<400?'en':'none',url:en};
};
(async()=>{
  const results=[];
  for(let i=0;i<catalog.length;i+=10)results.push(...await Promise.all(catalog.slice(i,i+10).map(check)));
  const bad=results.filter(item=>item.status<200||item.status>=400), english=results.filter(item=>item.locale==='en');
  console.log(JSON.stringify({total:results.length,uzbek:results.length-bad.length-english.length,english:english.length,bad,englishFallback:english},null,2));
  process.exitCode=bad.length?1:0;
})();

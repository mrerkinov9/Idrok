(() => {
  'use strict';

  const catalog = [
    {id:'rayhon',type:'plant',kind:'herb',name:'Rayhon',family:'Xushbo‘y giyoh',minutes:10,price:25,points:35,footprint:[1,1],height:0.8,colors:['#56b86b','#2f7e49'],rarity:'Oddiy',description:'Tez o‘sadigan xushbo‘y ko‘kat. Birinchi fokus uchun qulay.'},
    {id:'yalpiz',type:'plant',kind:'herb',name:'Yalpiz',family:'Xushbo‘y giyoh',minutes:12,price:30,points:42,footprint:[1,1],height:0.75,colors:['#55c78a','#25835d'],rarity:'Oddiy',description:'Yashil barglari bilan yo‘lak chetlarini bezaydigan giyoh.'},
    {id:'moychechak',type:'plant',kind:'flower',name:'Moychechak',family:'Gul',minutes:15,price:38,points:55,footprint:[1,1],height:0.75,colors:['#fff7d6','#f0ba3e'],rarity:'Oddiy',description:'Oq yaproqli mayin gul. Naqshli gulzorlar uchun juda mos.'},
    {id:'atirgul',type:'plant',kind:'flower',name:'Atirgul',family:'Gul',minutes:20,price:50,points:75,footprint:[1,1],height:1,colors:['#ff668c','#a72f67'],rarity:'Oddiy',description:'20 daqiqalik chuqur fokusdan keyin ochiladigan nafis gul.'},
    {id:'lola',type:'plant',kind:'flower',name:'Lola',family:'Gul',minutes:25,price:62,points:92,footprint:[1,1],height:0.9,colors:['#ff8a3d','#e84870'],rarity:'Oddiy',description:'Rangli geometrik naqshlar yaratish uchun yorqin tanlov.'},
    {id:'nargiz',type:'plant',kind:'flower',name:'Nargiz',family:'Gul',minutes:28,price:70,points:102,footprint:[1,1],height:0.9,colors:['#ffe06c','#fff9d8'],rarity:'Noyob',description:'Sariq va oq rangli bahor guli.'},
    {id:'lavanda',type:'plant',kind:'bush',name:'Lavanda',family:'Butasimon gul',minutes:35,price:90,points:135,footprint:[1,1],height:1,colors:['#8b76e8','#5546a9'],rarity:'Noyob',description:'Uzun qatorlar va sokin binafsha gulzorlar uchun.'},
    {id:'kungaboqar',type:'plant',kind:'flower',name:'Kungaboqar',family:'Baland gul',minutes:40,price:105,points:160,footprint:[1,1],height:1.5,colors:['#ffd34f','#7d5422'],rarity:'Noyob',description:'Quyosh tomon buriladigan baland va quvnoq gul.'},
    {id:'gortenziya',type:'plant',kind:'bush',name:'Gortenziya',family:'Gulli buta',minutes:45,price:120,points:185,footprint:[2,2],height:1.2,colors:['#70a7ff','#b77bea'],rarity:'Noyob',description:'Katta rangli sharsimon gullar beradigan buta.'},
    {id:'olma',type:'plant',kind:'fruit-tree',name:'Olma daraxti',family:'Mevali daraxt',minutes:45,price:120,points:185,footprint:[2,2],height:2.6,colors:['#70bb55','#d84c4c'],rarity:'Noyob',description:'Fokusdan keyin qizil mevalar beradigan daraxt.'},
    {id:'gilos',type:'plant',kind:'fruit-tree',name:'Gilos daraxti',family:'Mevali daraxt',minutes:50,price:140,points:220,footprint:[2,2],height:2.7,colors:['#5daa52','#c93558'],rarity:'Noyob',description:'Mayda qizil mevalari bilan bog‘ga jon bag‘ishlaydi.'},
    {id:'orik',type:'plant',kind:'fruit-tree',name:'O‘rik daraxti',family:'Mevali daraxt',minutes:50,price:145,points:225,footprint:[2,2],height:2.7,colors:['#75b957','#f49b45'],rarity:'Noyob',description:'Oltin rang mevali iliq va tabiiy daraxt.'},
    {id:'sakura',type:'plant',kind:'blossom-tree',name:'Sakura',family:'Gullaydigan daraxt',minutes:55,price:160,points:255,footprint:[2,2],height:2.8,colors:['#ff9ec5','#9b5db5'],rarity:'Epik',description:'Pushti gullari shamolda uchadigan noyob daraxt.'},
    {id:'archa',type:'plant',kind:'pine',name:'Archa',family:'Doim yashil daraxt',minutes:60,price:175,points:285,footprint:[2,2],height:3.1,colors:['#3f8e58','#1f5b3d'],rarity:'Epik',description:'Bog‘ chegarasi va simmetrik kompozitsiyalar uchun.'},
    {id:'chinor',type:'plant',kind:'tree',name:'Chinor',family:'Ulkan daraxt',minutes:60,price:180,points:295,footprint:[3,3],height:3.5,colors:['#4f9f55','#235d3d'],rarity:'Epik',description:'Bog‘dagi eng salobatli va soyali daraxt.'},
    {id:'magnoliya',type:'plant',kind:'blossom-tree',name:'Magnoliya',family:'Gullaydigan daraxt',minutes:65,price:200,points:330,footprint:[3,3],height:3.3,colors:['#f6d1e0','#a7678f'],rarity:'Afsonaviy',description:'Katta oq-pushti gullari bilan markaziy bezak bo‘ladi.'},

    {id:'yolak',type:'decor',kind:'path',name:'Tosh yo‘lak',family:'Yo‘lak',minutes:0,price:8,points:4,footprint:[1,1],height:0.08,colors:['#d4c4a8','#8f806c'],rarity:'Oddiy',description:'Bog‘ ichida naqshli va tartibli yo‘llar yarating.'},
    {id:'shaghal',type:'decor',kind:'path',name:'Oq shag‘al',family:'Yo‘lak',minutes:0,price:8,points:4,footprint:[1,1],height:0.06,colors:['#eee9df','#b9b3aa'],rarity:'Oddiy',description:'Gulzorlar orasiga yorqin shag‘al yo‘li.'},
    {id:'tuproq',type:'decor',kind:'soil',name:'Gulzor tuprog‘i',family:'Yer qoplamasi',minutes:0,price:6,points:3,footprint:[1,1],height:0.04,colors:['#8a5b3d','#5f3a27'],rarity:'Oddiy',description:'Naqshli gulzorlar uchun yumshoq tuproq maydoni.'},
    {id:'chiroq',type:'decor',kind:'lamp',name:'Bog‘ chirog‘i',family:'Yoritish',minutes:0,price:30,points:15,footprint:[1,1],height:1.4,colors:['#ffe37a','#4c4350'],rarity:'Oddiy',description:'Tun rejimida atrofini haqiqiy yoritadi.'},
    {id:'orindiq',type:'decor',kind:'bench',name:'Yog‘och o‘rindiq',family:'Mebel',minutes:0,price:45,points:25,footprint:[2,1],height:0.8,colors:['#bd744a','#5d4435'],rarity:'Oddiy',description:'Yo‘lak yoniga qo‘yiladigan dam olish joyi.'},
    {id:'tirik-devor',type:'decor',kind:'hedge',name:'Tirik devor',family:'To‘siq',minutes:0,price:25,points:14,footprint:[2,1],height:1,colors:['#4f9f58','#27653b'],rarity:'Oddiy',description:'Bog‘ bo‘limlari va yashil labirintlar yaratadi.'},
    {id:'gul-arkasi',type:'decor',kind:'arch',name:'Gul arkasi',family:'Arxitektura',minutes:0,price:75,points:45,footprint:[2,1],height:2.2,colors:['#f39ab8','#675347'],rarity:'Noyob',description:'Yo‘lak boshiga qo‘yiladigan gullagan arka.'},
    {id:'koprik',type:'decor',kind:'bridge',name:'Yog‘och ko‘prik',family:'Arxitektura',minutes:0,price:110,points:70,footprint:[3,1],height:0.5,colors:['#c78854','#67462f'],rarity:'Noyob',description:'Hovuz yoki yo‘lak ustidan o‘tuvchi kichik ko‘prik.'},
    {id:'hovuz',type:'decor',kind:'pond',name:'Moviy hovuz',family:'Suv',minutes:0,price:130,points:85,footprint:[3,3],height:0.1,colors:['#55c8df','#276fb3'],rarity:'Noyob',description:'Jonli suv animatsiyali tinch hovuz.'},
    {id:'favvora',type:'decor',kind:'fountain',name:'Tosh favvora',family:'Suv',minutes:0,price:160,points:110,footprint:[3,3],height:1.7,colors:['#7fd7e6','#aab7c9'],rarity:'Epik',description:'Markazga harakat va suv zarrachalarini qo‘shadi.'},
    {id:'pergola',type:'decor',kind:'pergola',name:'Yashil pergola',family:'Arxitektura',minutes:0,price:190,points:130,footprint:[3,2],height:2.3,colors:['#77a568','#8b6546'],rarity:'Epik',description:'Bog‘ ichidagi soyali sayr va dam olish joyi.'},
    {id:'atom-haykali',type:'decor',kind:'atom',name:'Atom haykali',family:'Idrok bezagi',minutes:0,price:100,points:75,footprint:[2,2],height:1.8,colors:['#6b53eb','#45d4c6'],rarity:'Noyob',description:'Fizika bog‘ining yorqin bilim ramzi.'},
    {id:'raketa',type:'decor',kind:'rocket',name:'Idrok raketasi',family:'Idrok bezagi',minutes:0,price:180,points:140,footprint:[2,2],height:2.8,colors:['#f4f7ff','#f46b55'],rarity:'Afsonaviy',description:'Koinot sari intilishni ifodalovchi animatsiyali raketa.'},
  ];

  const expansions = [
    {level:1,cols:24,rows:24,price:0,name:'Nihollar vodiysi'},
    {level:2,cols:36,rows:36,price:280,name:'Keng yashil hovli'},
    {level:3,cols:48,rows:48,price:520,name:'Ilm bog‘i'},
    {level:4,cols:64,rows:64,price:900,name:'Idrok botanika olami'},
  ];

  const frozenCatalog=catalog.map(item=>Object.freeze({...item,footprint:Object.freeze(item.footprint),colors:Object.freeze(item.colors)}));
  const api=Object.freeze({
    version:2,
    catalog:Object.freeze(frozenCatalog),
    expansions:Object.freeze(expansions.map(item=>Object.freeze(item))),
    byId:Object.freeze(Object.fromEntries(frozenCatalog.map(item=>[item.id,item]))),
  });
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(typeof window!=='undefined')window.IDROK_GARDEN_CATALOG=api;
})();

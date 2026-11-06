/* PRD 3.0 integer matcher. No legacy storage or rule imports. */
(function(root){
 'use strict';
 const KEY='travel-edit.getaway.prototype.v1';
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 function validate(c,a,partial=false){
  if(!a||Array.isArray(a)||typeof a!=='object'||Object.entries(a).some(([k,v])=>!c.questions.some(q=>q.id===k)||!['a','b','c','d'].includes(v)))throw Error('Invalid answers');
  if(!partial&&c.questions.some(q=>!own(a,q.id)))throw Error('Seven answers required');return a;
 }
 function rank(c,a){
  validate(c,a);
  return c.destinations.map(d=>{
   const contributions=c.questions.map((q,i)=>{const letter=a[q.id].toUpperCase(),pair=d.affinities[i],affinity=q.id==='budget'&&letter==='D'?2:pair[0]===letter?3:pair[2]===letter?1:0;return {question:q.id,answer:a[q.id],label:q.options['abcd'.indexOf(a[q.id])],affinity,points:affinity*q.weight};});
   return {id:d.id,destination:d,contributions,score:contributions.reduce((s,v)=>s+v.points,0)};
  }).sort((a,b)=>{if(a.score!==b.score)return b.score-a.score;for(const q of c.tie_priority){const delta=b.contributions.find(v=>v.question===q).affinity-a.contributions.find(v=>v.question===q).affinity;if(delta)return delta;}return a.id<b.id?-1:a.id>b.id?1:0;});
 }
 function result(c,a){
  const ranking=rank(c,a),winner=ranking[0],priority=q=>c.tie_priority.indexOf(q);
  const reasons=winner.contributions.filter(v=>v.points>0).sort((a,b)=>b.points-a.points||priority(a.question)-priority(b.question)).slice(0,2);
  const tradePriority=['vacation','budget','dream','interests','pace','companions','packing'];
  const trade=winner.contributions.filter(v=>v.affinity<3&&!(v.question==='budget'&&v.answer==='d')).sort((a,b)=>a.affinity-b.affinity||tradePriority.indexOf(a.question)-tradePriority.indexOf(b.question))[0];
  const tied=ranking.filter(r=>r.score===winner.score);let tie='';
  if(tied.length>1){const rival=tied[1],decider=c.tie_priority.find(q=>winner.contributions.find(v=>v.question===q).affinity!==rival.contributions.find(v=>v.question===q).affinity);tie=`${tied.length} destinations tied on points. ${decider?`The ${decider} preference`:'Stable destination ID order'} placed ${winner.destination.name} first.`;}
  const order={a:[0,2,1],b:[1,0,2],c:[2,1,0],d:[0,1,2]}[a.interests];
  const attractions=order.map(i=>winner.destination.attractions[i]);
  const interest={a:'Explore local food traditions in the same area.',b:'Look for art and architectural details nearby.',c:'Leave time for a suitable outdoor walk nearby.',d:'Explore the neighborhood’s evening atmosphere.'}[a.interests];
  const company={a:'Keep the day flexible for your own interests.',b:'Leave a shared pause between stops.',c:'Agree on a meeting point and a group break.',d:'Choose a comfortable pace for everyone.'}[a.companions];
  const days=attractions.map((place,i)=>{
   const stops=[a.budget==='a'?`Explore the neighborhood around ${place}; check access before visiting.`:`Plan time for ${place}; check entry and access.`,interest];
   if(['b','c'].includes(a.pace))stops.push('Add a nearby neighborhood stop after a generous break.');
   return {title:`Day ${i+1}`,place,stops,optional:['c','d'].includes(a.pace)?'Optional: follow a nearby discovery if time and energy allow.':'Leave the remaining time open.',note:company};
  });
  return {winner,ranking,reasons,trade,tie,attractions,days};
 }
 function fresh(c){return {version:c.version,answers:{},fixture:{...c.fixture},revision:1,step:0,motion:true};}
 function choose(c,s,id,value){validate(c,{[id]:value},true);if(!['vacation','interests','pace'].includes(id))throw Error('Not a prototype question');if(s.answers[id]===value)return s;return {...s,answers:{...s.answers,[id]:value},revision:s.revision+1};}
 function canEnter(s,step){return Number.isInteger(step)&&step>=0&&step<=3&&['vacation','interests','pace'].slice(0,step).every(q=>own(s.answers,q));}
 function recover(c,raw){
  const s=JSON.parse(raw);if(!s||s.version!==c.version||Object.keys(s).some(k=>!['version','answers','fixture','revision','step','motion'].includes(k))||!Number.isSafeInteger(s.revision)||s.revision<1||typeof s.motion!=='boolean')throw Error('Incompatible prototype session');
  validate(c,s.answers,true);if(Object.keys(s.answers).some(q=>!['vacation','interests','pace'].includes(q)))throw Error('Unexpected prototype answer');
  validate(c,s.fixture,true);if(Object.keys(s.fixture).length!==4||['companions','budget','packing','dream'].some(q=>!own(s.fixture,q)))throw Error('Invalid fixture');
  if(s.revision<Object.keys(s.answers).length+1||!canEnter(s,s.step))throw Error('Unreachable prototype state');return s;
 }
 const api={KEY,validate,rank,result,fresh,choose,canEnter,recover};root.GetawayMatch=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

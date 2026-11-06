const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const G=require('../js/scene-core.js');global.Travel3D=G;
const M=require('../prototype/destination-models.js'),P=require('../prototype/destination-content.js'),Q=require('../prototype/matcher.js'),C=require('../prototype/catalog.json');
const samples=['paris','tokyo','bali','swiss-alps'];const witness=id=>Object.fromEntries(C.questions.map((q,i)=>[q.id,C.destinations.find(d=>d.id===id).affinities[i][0].toLowerCase()]));
function setup({reduce=false,fail=false,quality={}}={}){
 let doc,serial=0,time=0;const scheduled=new Map(),renderers=[];
 class El{constructor(tag){this.tagName=tag;this.children=[];this.events={};this.style={setProperty(k,v){this[k]=v;}};this.attrs={};this.dataset={};this.isConnected=true;}setAttribute(k,v){this.attrs[k]=v;}append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}addEventListener(t,f){(this.events[t]||=[]).push(f);}removeEventListener(t,f){this.events[t]=(this.events[t]||[]).filter(v=>v!==f);}fire(t,p={}){for(const f of this.events[t]||[])f({target:this,preventDefault(){},stopPropagation(){},...p});}click(){this.fire('click');}showModal(){this.open=true;}close(){this.open=false;this.fire('close');}remove(){this.isConnected=false;}focus(){doc.activeElement=this;}getBoundingClientRect(){return {width:1280,height:720,left:0,top:0};}setPointerCapture(){}}
 doc=new El('document');doc.body=new El('body');doc.createElement=t=>new El(t);doc.activeElement=new El('button');doc.hidden=false;
 const win=new El('window'),media=new El('media');media.matches=reduce;
 class Renderer{constructor(canvas,d){if(fail)throw Error('Blocked GPU');this.eye=d.eye;this.target=d.target;this.stats={triangles:0};renderers.push(this);}render(objects){this.objects=objects;this.stats.triangles=objects.reduce((n,o)=>n+o.geometry.indices.length/3,0);this.frames=(this.frames||0)+1;}dispose(){this.disposed=true;}inspectFrame(){return {triangles:this.stats.triangles};}}
 Object.assign(win,{Travel3D:G,DestinationModels:M,DestinationContent:P,GetawayMatch:Q,DestinationRenderer:Renderer,...quality});
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../prototype/destination-experience.js'),'utf8'),{window:win,document:doc,matchMedia:()=>media,ResizeObserver:class{observe(){}disconnect(){}},requestAnimationFrame:f=>{scheduled.set(++serial,f);return serial;},cancelAnimationFrame:id=>scheduled.delete(id)});
 function frames(n=1){for(let i=0;i<n;i++){time+=40;const jobs=[...scheduled.values()];scheduled.clear();jobs.forEach(f=>f(time));}}
 const find=(tag)=>{const walk=e=>[...(e.tagName===tag?[e]:[]),...e.children.flatMap(walk)];return walk(doc.body);};
 return {api:win.DestinationExperience,doc,win,media,scheduled,renderers,frames,find};
}
test('all fifteen destinations are retained; four have unique efficient real geometry',()=>{
 assert.deepEqual(C.destinations.map(d=>d.id),'paris rome barcelona london amsterdam lisbon tokyo kyoto new-york bali bangkok greek-islands swiss-alps iceland queenstown'.split(' '));
 assert.deepEqual(Object.keys(M.registry).sort(),C.destinations.map(d=>d.id).sort());assert.deepEqual(Object.keys(M.definitions),samples);const signatures=new Set();
 for(const id of samples){const model=M.build(id),objects=model.objects(1000);let triangles=0;assert.ok(objects.length<60,`${id} batch budget`);
  for(const o of objects){const g=o.geometry;assert.ok(g.positions.length/3<65536);assert.equal(g.positions.length,g.normals.length);assert.ok([...g.positions,...g.normals,...o.matrix].every(Number.isFinite));assert.ok(Array.from(g.indices).every(i=>i<g.positions.length/3));assert.doesNotThrow(()=>G.normalMatrix(o.matrix));triangles+=g.indices.length/3;}assert.ok(triangles<15000,`${id}: ${triangles}`);signatures.add(JSON.stringify(objects.map(o=>[o.geometry.positions.length,o.matrix[12]])));assert.equal(model.pins.length,3);
 }assert.equal(signatures.size,4);assert.equal(C.destinations.filter(d=>!M.build(d.id)).length,11);
});
test('each sample is a genuine matcher winner; personalization changes without changing destination',()=>{
 for(const id of samples){const a=witness(id),d=C.destinations.find(d=>d.id===id);assert.equal(Q.rank(C,a)[0].id,id);const first=P.personalize(d,a),changed=P.personalize(d,{...a,interests:a.interests==='a'?'b':'a',pace:'d',packing:'d'});assert.notDeepEqual(first.days,changed.days);assert.equal(new Set(first.days.map(d=>d.place)).size,3);assert.equal(P.bundles[id].flatMap(r=>r[1]).length,12);assert.ok(first.days.every(v=>v.title&&v.transfer&&v.company));}
});
test('all fallback plans work and personalization is deterministic without mutations',()=>{
 for(const d of C.destinations){const a=witness(d.id),before=JSON.stringify(a),one=P.personalize(d,a);assert.equal(one.days.length,3);assert.deepEqual(one,P.personalize(d,a));assert.equal(JSON.stringify(a),before);}
});
test('arrival, hover, attraction focus and alternative navigation preserve original answers',()=>{
 const t=setup(),a=witness('paris'),before=JSON.stringify(a),x=t.api.open(C,a);t.frames(60);const initial=[...t.renderers.at(-1).eye];
 t.find('canvas')[0].fire('pointermove',{pointerType:'mouse',clientX:1200,clientY:400});t.frames(40);assert.notDeepEqual(t.renderers.at(-1).eye,initial);
 t.find('button').find(b=>b.textContent==='01 Eiffel Tower').click();t.frames(50);assert.equal(x.state().selected,0);assert.notDeepEqual(t.renderers.at(-1).target,[0,1.6,0]);
 x.navigate('rome');assert.equal(x.state().ready,false);assert.equal(x.state().primary,'paris');assert.equal(t.scheduled.size,0);assert.ok(t.renderers[0].disposed);x.navigate('tokyo');t.frames(2);assert.equal(x.state().ready,true);assert.equal(JSON.stringify(a),before);x.close();assert.equal(t.scheduled.size,0);assert.ok(t.renderers.at(-1).disposed);
});
test('reduced motion has no idle loop but preserves keyboard, touch and attraction exploration',()=>{
 const t=setup({reduce:true}),x=t.api.open(C,witness('bali'));t.frames(2);assert.equal(t.scheduled.size,0);const canvas=t.find('canvas')[0],eye=[...t.renderers[0].eye];
 canvas.fire('keydown',{key:'ArrowRight'});t.frames(2);assert.notDeepEqual(t.renderers[0].eye,eye);assert.equal(t.scheduled.size,0);
 const second=[...t.renderers[0].eye];canvas.fire('pointerdown',{button:0,pointerId:1,clientX:100,clientY:100});canvas.fire('pointermove',{pointerType:'touch',pointerId:1,clientX:250,clientY:140});canvas.fire('pointerup');t.frames(2);assert.notDeepEqual(t.renderers[0].eye,second);assert.equal(x.state().motion,false);x.close();
});
test('context loss, visibility, resize scheduling and failed WebGL retain usable content',()=>{
 const t=setup(),x=t.api.open(C,witness('tokyo'));t.frames();const canvas=t.find('canvas')[0];canvas.fire('webglcontextlost');assert.equal(t.scheduled.size,0);canvas.fire('webglcontextrestored');t.frames();assert.equal(x.state().ready,true);
 t.doc.hidden=true;t.doc.fire('visibilitychange');assert.equal(t.scheduled.size,0);t.doc.hidden=false;t.doc.fire('visibilitychange');t.frames();assert.ok(t.scheduled.size);x.close();
 const f=setup({fail:true}),fallback=f.api.open(C,witness('swiss-alps'));assert.equal(fallback.state().ready,false);assert.equal(f.scheduled.size,0);assert.equal(f.find('article').length,3);f.find('button').find(b=>b.textContent==='03 Stellisee').click();assert.equal(fallback.state().selected,2);fallback.close();
});
test('marker projection remains finite at desktop and mobile aspect ratios',()=>{const t=setup();for(const id of samples){const d=M.definitions[id];for(const [w,h] of [[1280,720],[390,844]])for(const p of d.markers){const v=t.api.project(p.point,d.eye,d.target,w,h);assert.ok(Number.isFinite(v.x)&&Number.isFinite(v.y));}}});
test('different real answer sets with the same winning destination get different activity priorities',()=>{
 const pairs=new Map();for(let n=0;n<16384;n++){const a=Object.fromEntries(C.questions.map((q,i)=>[q.id,'abcd'[(n>>i*2)&3]])),winner=Q.rank(C,a)[0];if(!samples.includes(winner.id))continue;const pair=pairs.get(winner.id)||[];if(!pair.length||pair.length===1&&pair[0].interests!==a.interests)pair.push(a);pairs.set(winner.id,pair);if(samples.every(id=>pairs.get(id)?.length===2))break;}
 for(const id of samples){const pair=pairs.get(id),d=C.destinations.find(d=>d.id===id);assert.equal(pair.length,2);assert.equal(Q.rank(C,pair[0])[0].id,Q.rank(C,pair[1])[0].id);assert.notDeepEqual(P.personalize(d,pair[0]).days,P.personalize(d,pair[1]).days);}
});
test('prototype-only selector switches all fifteen destinations without altering ranking or answers',()=>{
 const t=setup({reduce:true}),a=witness('paris'),before=JSON.stringify(a),ranking=JSON.stringify(Q.rank(C,a)),x=t.api.open(C,a),select=t.find('select')[0];assert.equal(select.children.length,15);assert.match(select.attrs['aria-label'],/does not change quiz scoring/);
 for(const d of C.destinations){select.value=d.id;select.fire('change');t.frames(2);assert.equal(x.state().id,d.id);assert.equal(x.state().primary,'paris');assert.equal(x.state().ready,Boolean(M.definitions[d.id]));assert.equal(t.find('article').length,3);}
 assert.equal(JSON.stringify(a),before);assert.equal(JSON.stringify(Q.rank(C,a)),ranking);x.close();assert.equal(t.scheduled.size,0);
});

test('missing quality assets show an explicit notice and preserve the original preview',async()=>{
 let prepared=false;const t=setup({quality:{DestinationAssets:{assess:async()=>({ready:false,missing:['environment.glb']})},DestinationQuality:{prepare(){prepared=true;}}}}),x=t.api.open(C,witness('paris'));await new Promise(setImmediate);t.frames();assert.equal(prepared,false);assert.equal(x.state().ready,true);assert.ok(t.find('p').some(p=>p.textContent?.includes('VISUAL UPGRADE INCOMPLETE')));x.navigate('bali');assert.equal(x.state().id,'bali');x.close();
});
test('late quality assets cannot replace a destination selected during loading',async()=>{
 let resolve,disposed=false;const t=setup({quality:{DestinationAssets:{assess:async()=>({ready:true})},DestinationQuality:{prepare:()=>new Promise(r=>{resolve=r;}),attach(){throw Error('Stale asset must not attach');}}}}),x=t.api.open(C,witness('paris'));await new Promise(setImmediate);x.navigate('bali');resolve({dispose(){disposed=true;}});await new Promise(setImmediate);assert.equal(disposed,true);assert.equal(x.state().id,'bali');assert.equal(x.state().ready,true);x.close();
});

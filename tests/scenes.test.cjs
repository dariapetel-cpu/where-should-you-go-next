/* Scene lifecycle checks with a renderer adapter. GPU pixels are checked separately
   by browser-checks.html in a real WebGL 2 browser. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/travel-scenes.js'),'utf8');
function setup({fail=false}={}){
  let id=0,time=0;const scheduled=new Map(),renders=[],observers=[];
  class Target{
    constructor(){this.events={};this.dataset={};this.classes=new Set();this.classList={add:v=>this.classes.add(v),remove:v=>this.classes.delete(v)};this.error={hidden:true,textContent:''};}
    addEventListener(k,f){(this.events[k]||=[]).push(f);}
    fire(k,args={}){const e={preventDefault(){this.prevented=true;},...args};for(const f of this.events[k]||[])f(e);return e;}
    closest(){return this;}
    querySelector(){return this.error;}
    getBoundingClientRect(){return {left:0,top:0,width:500,height:500};}
  }
  const canvases=Object.fromEntries(['suitcase','map','compass','chair','cup','globe','journey'].map(n=>[n,new Target()]));
  const cards=['map','compass','chair','cup'].map(n=>{const t=new Target();t.dataset.modelChoice=n;return t;});
  const hero=new Target(),doc=new Target(),win=new Target();doc.hidden=false;
  doc.querySelector=s=>s==='#suitcase-stage'?hero:canvases[s.match(/data-model="(\w+)"/)[1]];
  doc.querySelectorAll=()=>cards;
  class Studio{
    constructor(canvas,options){if(fail)throw new Error('No WebGL');this.canvas=canvas;this.options=options;this.stats={frames:0,triangles:10};}
    render(objects){this.stats.frames++;renders.push({canvas:this.canvas,objects,eye:this.eye,target:this.target});}
    inspectFrame(){return {nonBackgroundPixels:123};}
  }
  win.Travel3D={Studio,chain:(...a)=>a,T:(...a)=>a,RY:v=>v,RZ:v=>v};
  win.TravelModels=Object.fromEntries(['suitcase','map','compass','chair','cup','globe','journey'].map(n=>[n,p=>({name:n,params:p})]));
  const raf=f=>{scheduled.set(++id,f);return id;};
  vm.runInNewContext(source,{window:win,document:doc,matchMedia:()=>({matches:false}),requestAnimationFrame:raf,cancelAnimationFrame:i=>scheduled.delete(i),ResizeObserver:class{constructor(f){observers.push(f);}observe(){}},console:{warn(){}}});
  function frames(n=1){for(let i=0;i<n;i++){time+=40;const todo=[...scheduled.values()];scheduled.clear();todo.forEach(f=>f(time));}}
  return {api:win.TravelScenes,frames,scheduled,renders,doc,win,hero,canvases,cards,observers};
}
test('only current slide renderers initialize; hidden scenes never continue rendering',()=>{
  const t=setup();t.api.setSlide('welcome');t.frames(2);assert.equal(t.api.status().renderers.length,1);
  const heroCount=t.renders.length;t.api.setSlide('priorities');t.frames(4);
  assert.equal(t.api.status().renderers.length,5);assert.equal(t.renders.filter(r=>r.canvas===t.canvases.suitcase).length,heroCount);
});
test('motion off snaps opening and rotation to their targets and stops animation',()=>{
  const t=setup();t.api.setSlide('welcome');t.api.setMotion(false);t.api.setSuitcaseOpen(true);t.api.rotateSuitcase(1);t.frames();
  assert.equal(t.canvases.suitcase.dataset.pose,'1.000');assert.equal(t.scheduled.size,0);
  assert.ok(t.renders.at(-1).objects.params.yaw>0);assert.equal(t.renders.at(-1).eye[2],8.3);
});
test('pointer tilt is bounded, resets on leave and ignores touch',()=>{
  const t=setup();t.api.setSlide('welcome');t.hero.fire('pointermove',{clientX:10000,clientY:10000,pointerType:'mouse'});t.frames(40);
  assert.ok(t.renders.at(-1).objects.params.yaw<=.205);assert.ok(t.renders.at(-1).objects.params.pitch<=.09);
  t.hero.fire('pointerleave');t.frames(40);assert.ok(Math.abs(t.renders.at(-1).objects.params.pitch)<.001);
  t.hero.fire('pointermove',{clientX:10000,clientY:10000,pointerType:'touch'});t.frames();assert.ok(Math.abs(t.renders.at(-1).objects.params.pitch)<.001);
});
test('off-screen tab cancels rendering and visibility restoration resumes it',()=>{
  const t=setup();t.api.setSlide('welcome');t.frames();t.doc.hidden=true;t.doc.fire('visibilitychange');assert.equal(t.scheduled.size,0);
  const count=t.renders.length;t.frames(3);assert.equal(t.renders.length,count);
  t.doc.hidden=false;t.doc.fire('visibilitychange');t.frames();assert.ok(t.renders.length>count);
});
test('WebGL failure exposes an honest fallback and does not loop forever',()=>{
  const t=setup({fail:true});t.api.setSlide('welcome');t.frames(4);
  assert.equal(t.canvases.suitcase.dataset.renderer,'unavailable');assert.equal(t.canvases.suitcase.error.hidden,false);assert.equal(t.scheduled.size,0);
  t.api.setSlide('mood');t.frames(4);assert.equal(t.api.status().slide,'mood');
});
test('context loss and restoration update fallback and restart a valid renderer',()=>{
  const t=setup();t.api.setSlide('welcome');t.frames();t.canvases.suitcase.fire('webglcontextlost');t.frames();
  assert.equal(t.canvases.suitcase.dataset.renderer,'unavailable');
  t.canvases.suitcase.fire('webglcontextrestored');t.frames();assert.equal(t.canvases.suitcase.dataset.renderer,'webgl2');assert.equal(t.canvases.suitcase.error.hidden,true);
});
test('hover and preference selection update the object scene; mood indices remain bounded',()=>{
  const t=setup();t.api.setSlide('priorities');t.cards[0].fire('pointerenter');t.frames(30);assert.ok(Number(t.canvases.map.dataset.pose)>.99);
  t.cards[0].fire('pointerleave');t.api.setPreference('map');t.frames(30);assert.ok(Number(t.canvases.map.dataset.pose)<.001);
  t.api.setSlide('mood');t.api.setMood(50);t.api.setMotion(false);t.frames();assert.equal(t.renders.at(-1).objects.params.mood,3);
});
test('diagnostics only read an available visible scene',()=>{
  const t=setup();assert.equal(t.api.inspectFrame('suitcase'),null);t.api.setSlide('welcome');t.frames();assert.ok(t.api.inspectFrame('suitcase').nonBackgroundPixels>0);
  t.api.setSlide('mood');t.frames();assert.equal(t.api.inspectFrame('suitcase'),null);
});

test('quiz slides reuse one renderer and stop hidden opening scenes',()=>{
  const t=setup();t.api.setSlide('welcome');t.frames();const before=t.canvases.suitcase.dataset.frames;
  t.api.setSlide('boarding');t.api.setMotion(false);t.frames();assert.equal(t.api.status().renderers.length,2);
  t.api.turnJourney();t.frames();assert.equal(t.renders.at(-1).objects.params.angle,0);
  for(const id of ['q1','q2','q3','q4','q5','q6','q7','match']){t.api.setSlide(id);t.frames();assert.equal(t.renders.at(-1).objects.params.slide,id);assert.equal(t.renders.at(-1).objects.params.angle,0);}
  assert.equal(t.api.status().renderers.length,2);assert.equal(t.canvases.suitcase.dataset.frames,before);assert.equal(t.scheduled.size,0);
  t.api.setJourneyResult(3);t.frames();assert.equal(t.renders.at(-1).objects.params.mood,3);
});

test('sample pointer tracking uses bounded spring easing, recenters and stops',()=>{
 const t=setup(),surface=t.canvases.journey;t.api.setSlide('boarding');t.frames();
 surface.fire('pointermove',{pointerType:'mouse',clientX:500,clientY:500});t.frames();
 let p=t.renders.at(-1).objects.params;assert.ok(p.angle>0&&p.angle<.24);assert.ok(p.pitch>0&&p.pitch<.14);
 t.frames(60);p=t.renders.at(-1).objects.params;assert.ok(Math.abs(p.angle-.24)<.001);assert.equal(t.scheduled.size,0);
 surface.fire('pointerleave');t.frames(60);assert.ok(Math.abs(t.renders.at(-1).objects.params.angle)<.001);assert.equal(t.scheduled.size,0);
});
test('sample touch drag requires contact; reduced motion ignores pointer movement but permits keyboard poses',()=>{
 const t=setup(),surface=t.canvases.journey;t.api.setSlide('q1');t.frames();
 surface.fire('pointermove',{pointerType:'touch',pointerId:1,clientX:400,clientY:400});t.frames();assert.equal(t.renders.at(-1).objects.params.angle,0);
 surface.fire('pointerdown',{pointerType:'touch',pointerId:1,clientX:100,clientY:100});surface.fire('pointermove',{pointerType:'touch',pointerId:1,clientX:180,clientY:140});t.frames(40);assert.ok(t.renders.at(-1).objects.params.angle>.2);
 surface.fire('pointercancel');t.frames(60);assert.ok(Math.abs(t.renders.at(-1).objects.params.angle)<.001);
 t.api.setMotion(false);surface.fire('pointermove',{pointerType:'mouse',clientX:500,clientY:500});t.frames();assert.equal(t.renders.at(-1).objects.params.angle,0);
 surface.fire('keydown',{key:'ArrowRight'});t.frames();assert.equal(t.renders.at(-1).objects.params.angle,.08);assert.equal(t.scheduled.size,0);
 surface.fire('keydown',{key:'Home'});t.frames();assert.equal(t.renders.at(-1).objects.params.angle,0);
});
test('sample selection restores the correct object; later slides retain their original click rotation',()=>{
 const t=setup();t.api.setSlide('q2');t.api.setSampleChoice('q2',2);t.frames();
 assert.equal(t.renders.at(-1).objects.params.choice,2);assert.ok(t.renders.at(-1).objects.params.packed<1);
 t.frames(60);assert.ok(t.renders.at(-1).objects.params.packed>.999);assert.equal(t.scheduled.size,0);
 t.api.setSlide('q3');t.api.setMotion(false);t.api.turnJourney();t.frames();assert.ok(t.renders.at(-1).objects.params.angle>1);
 t.api.setSlide('q2');t.frames();assert.equal(t.renders.at(-1).objects.params.choice,2);
});

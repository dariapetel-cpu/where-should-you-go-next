const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const G=require('../js/scene-core.js'),M=require('../js/travel-models.js');
const code=fs.readFileSync(require('node:path').join(__dirname,'../prototype/scenes.js'),'utf8');
function setup({fail=false,reduce=false}={}){
 class Target{constructor(){this.events={};this.dataset={};this.style={};this.hidden=false;}addEventListener(t,f){(this.events[t]||=[]).push(f);}fire(t,p={}){const e={preventDefault(){},...p};for(const f of this.events[t]||[])f(e);}setPointerCapture(){}getBoundingClientRect(){return {left:0,top:0,width:600,height:500};}}
 const nodes=Object.fromEntries(['scene','scene-control','scene-fallback','scene-reset'].map(id=>[id,new Target()])),doc=new Target(),win=new Target(),scheduled=new Map(),renders=[];let id=0,time=0;
 doc.querySelector=s=>nodes[s.slice(1)];doc.hidden=false;
 class Studio{constructor(){if(fail)throw Error('No GPU');this.stats={frames:0,triangles:0};}render(objects){this.stats.frames++;this.stats.triangles=objects.reduce((n,o)=>n+o.geometry.indices.length/3,0);renders.push(objects);}inspectFrame(){return {hash:this.stats.frames};}}
 win.Travel3D={...G,Studio};win.TravelModels=M;
 vm.runInNewContext(code,{window:win,document:doc,matchMedia:()=>({matches:reduce}),ResizeObserver:class{observe(){}},requestAnimationFrame:fn=>{scheduled.set(++id,fn);return id;},cancelAnimationFrame:id=>scheduled.delete(id)});
 function frames(n=1){for(let i=0;i<n;i++){time+=40;const todo=[...scheduled.values()];scheduled.clear();todo.forEach(fn=>fn(time));}}
 return {api:win.PrototypeScene,nodes,doc,win,scheduled,renders,frames};
}
test('airplane flies in, settles and idles; hidden preview renders no GPU scene',()=>{
 const t=setup();t.frames();const start=t.renders.at(-1)[0].matrix;t.frames(80);const end=t.renders.at(-1)[0].matrix;assert.notDeepEqual([...start],[...end]);assert.equal(t.scheduled.size,0);
 t.api.setStep(3);const count=t.renders.length;t.frames(20);assert.equal(t.renders.length,count);
});
test('miniature city supports free full rotation and keyboard reset',()=>{
 const t=setup();t.api.setStep(1);t.frames();const surface=t.nodes['scene-control'];surface.fire('pointerdown',{pointerId:1,clientX:0});surface.fire('pointermove',{pointerId:1,clientX:1000,clientY:250,pointerType:'touch'});t.frames(80);assert.ok(Number(t.nodes.scene.dataset.pose.split(',')[0])>6);
 surface.fire('pointerup');surface.fire('keydown',{key:'Home'});t.frames(80);assert.equal(t.nodes.scene.dataset.pose,'0.000,0.000');assert.equal(t.scheduled.size,0);
});
test('reduced motion skips flight and pointer parallax, retains keyboard view changes',()=>{
 const t=setup({reduce:true});t.frames();assert.equal(t.scheduled.size,0);t.nodes['scene-control'].fire('pointermove',{clientX:600,clientY:500,pointerType:'mouse'});t.frames();assert.equal(t.nodes.scene.dataset.pose,'0.000,0.000');
 t.nodes['scene-control'].fire('keydown',{key:'ArrowRight'});t.frames();assert.equal(t.nodes.scene.dataset.pose,'0.250,0.000');
});
test('context loss and visibility suspend rendering; fallback does not spin a loop',()=>{
 const t=setup();t.frames();t.doc.hidden=true;t.doc.fire('visibilitychange');assert.equal(t.scheduled.size,0);t.doc.hidden=false;t.doc.fire('visibilitychange');t.frames();
 t.nodes.scene.fire('webglcontextlost');assert.equal(t.api.status().available,false);assert.equal(t.nodes['scene-fallback'].hidden,false);assert.equal(t.scheduled.size,0);t.nodes.scene.fire('webglcontextrestored');t.frames();assert.equal(t.api.status().available,true);
 const failed=setup({fail:true});failed.frames();assert.equal(failed.scheduled.size,0);assert.equal(failed.api.status().available,false);
});
test('resting hero geometry fits narrow viewports; all pace objects stay below 50k triangles',()=>{
 const t=setup({reduce:true});const vp=G.mul(G.perspective(Math.PI/5.3,.9),G.lookAt([3,2.1,6.8],[0,0,0]));
 for(const step of [0,1,2])for(const choice of [0,1,2,3]){
  t.api.setStep(step,choice);t.frames();const objects=t.renders.at(-1);assert.ok(objects.reduce((n,o)=>n+o.geometry.indices.length/3,0)<50000);
  for(const o of objects){const m=G.mul(vp,o.matrix),p=o.geometry.positions;for(let i=0;i<p.length;i+=3){const coords=[0,1,2,3].map(k=>m[k]*p[i]+m[4+k]*p[i+1]+m[8+k]*p[i+2]+m[12+k]);assert.ok(Math.abs(coords[0]/coords[3])<1&&Math.abs(coords[1]/coords[3])<1,`Clipping in ${step}`);}}
 }
});

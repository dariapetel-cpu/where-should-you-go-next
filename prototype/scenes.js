/* Isolated scene director; shared renderer/models are read-only dependencies. */
(function(root){
 'use strict';
 const G=root.Travel3D,M=root.TravelModels,canvas=document.querySelector('#scene'),surface=document.querySelector('#scene-control');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const state={step:0,motion:!reduce.matches,x:0,y:0,vx:0,vy:0,tx:0,ty:0,orbit:0,flight:0,entry:0,pack:1,choice:-1,preview:0,drag:null};
 let studio,frame=0,last=0,failed=false,lastObjects=[],observer;
 const colors=['#E6EFF0','#F5E7D9','#F3EBDC','#F7F1E6'];
 function failure(){failed=true;document.querySelector('#scene-fallback').hidden=false;canvas.style.visibility='hidden';}
 function init(){try{studio=new G.Studio(canvas,{background:colors[state.step],eye:[3,2.1,6.8],target:[0,0,0],ground:-1.55,shadowSize:512});failed=false;canvas.style.visibility='';document.querySelector('#scene-fallback').hidden=true;wake();}catch{failure();}}
 const spring=(x,v,target,dt)=>{const e=Math.exp(-12*dt),d=x-target,t=(v+12*d)*dt;return [target+(d+t)*e,(v-12*t)*e];};
 const transform=(objects,matrix)=>objects.map(o=>({...o,matrix:G.chain(matrix,o.matrix)}));
 const cardMaterial=G.material('#F2C8A4',.7),ink=G.material('#296B72',.65);
 const basePlane=M.sampleScene({slide:'boarding'});
 const clay=G.material('#CD9176',.5),teal=G.material('#578D8A',.5),linen=G.material('#F1DFC1',.85);
 const baseCase=M.suitcase({open:.86}).map(o=>({...o,material:[M.palette.shell,M.palette.rib].includes(o.material)?clay:[M.palette.trim,M.palette.lavender].includes(o.material)?teal:o.material===M.palette.lining?linen:o.material}));
 const cities=Array.from({length:5},(_,i)=>M.sampleScene({slide:'q1',choice:i-1}));
 function objects(){
  const arrival=1-Math.pow(1-state.entry,3);
  const pose=G.chain(G.T(state.step===0?0:.35*(1-arrival),-state.y*.25,0),G.RY(state.x+(state.step===0?0:.16*(1-arrival))),G.RX(state.y),G.S(.95+.05*arrival));
  if(state.step===0){const ease=1-Math.pow(1-state.flight,3),m=G.chain(G.T(-5*(1-ease),.6*(1-ease),0),G.RZ(-.18*(1-ease)),pose);return transform(basePlane,m);}
  if(state.step===1){const mapped=[1,2,3,0][state.choice]??-1;return transform(cities[mapped+1],pose);}
  if(state.step===2){
   const m=G.chain(pose,G.T(.62,-.1,0),G.S(.72)),items=transform(baseCase,m);
   if(state.choice>=0){const card=G.chain(pose,G.T(.25,1.4-state.pack*1.05,.66),G.RZ(-.12));
    items.push({geometry:G.roundedBox(.66,.78,.065,.04),material:cardMaterial,matrix:card});
    const counts=[2,3,5,2][state.choice];for(let i=0;i<counts;i++)items.push({geometry:G.roundedBox(.36,.045,.02,.008),material:ink,matrix:G.chain(card,G.T(0,.22-i*.095,.05))});
   }return items;
  }
  return transform(M.sampleScene({slide:'q1',choice:state.choice<0?0:state.choice%4}),pose);
 }
 function tick(now){frame=0;if(document.hidden||failed||state.step===3)return;if(state.motion&&now-last<32){wake();return;}
  const dt=Math.min((now-last)/1000||.016,.05);last=now;
  if(state.motion){[state.x,state.vx]=spring(state.x,state.vx,state.orbit+state.tx,dt);[state.y,state.vy]=spring(state.y,state.vy,state.ty,dt);state.flight=Math.min(1,state.flight+dt/1.15);state.entry=Math.min(1,state.entry+dt/.55);state.pack+=(1-state.pack)*(1-Math.exp(-dt*10));}
  else{state.x=state.orbit;state.y=state.ty;state.vx=state.vy=0;state.flight=state.entry=state.pack=1;}
  studio.background=G.color(colors[state.step]);
  try{lastObjects=objects();studio.render(lastObjects);canvas.dataset.pose=`${state.x.toFixed(3)},${state.y.toFixed(3)}`;canvas.dataset.frames=String(studio.stats.frames);}catch{failure();return;}
  if(state.motion&&(state.flight<1||state.entry<1||Math.abs(state.x-state.orbit-state.tx)>.0005||Math.abs(state.y-state.ty)>.0005||Math.abs(state.vx)+Math.abs(state.vy)>.001||state.pack<.9995))wake();
 }
 function wake(){if(!frame&&!document.hidden&&!failed)frame=requestAnimationFrame(tick);}
 function reset(){state.orbit=state.tx=state.ty=state.x=state.y=state.vx=state.vy=0;state.drag=null;wake();}
 surface.addEventListener('pointerdown',e=>{if(!state.motion)return;state.drag={id:e.pointerId,x:e.clientX,start:state.orbit,moved:false};surface.setPointerCapture?.(e.pointerId);});
 surface.addEventListener('pointermove',e=>{
  if(!state.motion)return;
  if(state.drag&&state.drag.id===e.pointerId){const dx=e.clientX-state.drag.x;state.drag.moved ||= Math.abs(dx)>6;state.orbit=state.step===1?state.drag.start+dx*.007:Math.max(-.35,Math.min(.35,state.drag.start+dx*.003));}
  else if(e.pointerType!=='touch'){const r=surface.getBoundingClientRect();state.tx=Math.max(-.26,Math.min(.26,(e.clientX-r.left-r.width/2)/r.width*.52));state.ty=Math.max(-.13,Math.min(.13,(e.clientY-r.top-r.height/2)/r.height*.26));}
  wake();
 });
 let suppress=false;
 const end=()=>{suppress=Boolean(state.drag?.moved);state.drag=null;wake();};
 surface.addEventListener('pointerup',end);surface.addEventListener('pointercancel',end);
 surface.addEventListener('lostpointercapture',()=>{state.drag=null;wake();});
 surface.addEventListener('pointerleave',()=>{if(!state.drag){state.tx=state.ty=0;wake();}});
 surface.addEventListener('click',e=>{if(suppress&&e.detail!==0){suppress=false;return;}reset();});
 surface.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')reset();else{state.orbit+=({ArrowLeft:-.25,ArrowRight:.25}[e.key]||0);if(state.step!==1)state.orbit=Math.max(-.35,Math.min(.35,state.orbit));state.ty=Math.max(-.13,Math.min(.13,state.ty+({ArrowUp:-.06,ArrowDown:.06}[e.key]||0)));if(!state.motion){state.x=state.orbit;state.y=state.ty;}wake();}});
 document.querySelector('#scene-reset').addEventListener('click',reset);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failure();cancelAnimationFrame(frame);frame=0;});canvas.addEventListener('webglcontextrestored',init);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else wake();});
 root.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;});root.addEventListener('pageshow',wake);
 observer=new ResizeObserver(wake);observer.observe(canvas);
 root.PrototypeScene={
  setStep(step,choice=-1){state.step=step;state.entry=0;state.choice=choice;state.flight=step===0?0:1;state.pack=1;reset();},
  select(choice){if(state.choice!==choice){state.choice=choice;state.pack=0;}wake();},
  preview(index){state.preview=index;state.orbit=(index-1.5)*.08;wake();},
  motion(value){state.motion=Boolean(value)&&!reduce.matches;if(!state.motion)reset();wake();},
  inspect(){return failed?null:studio.inspectFrame(lastObjects);},
  status(){return {step:state.step,available:!failed,motion:state.motion,frames:studio?.stats.frames||0,triangles:studio?.stats.triangles||0};}
 };
 init();
})(window);

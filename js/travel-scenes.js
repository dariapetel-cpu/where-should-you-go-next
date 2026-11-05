/* Scene lifecycle and input bridge. Only the visible slide renders. */
(function(root){
  'use strict';
  const G=root.Travel3D,M=root.TravelModels;
  const state={slide:'welcome',motion:!matchMedia('(prefers-reduced-motion: reduce)').matches,open:false,openPose:0,yaw:0,pitch:0,targetYaw:0,targetPitch:0,manualYaw:0,preference:null,mood:0,angle:0,targetAngle:0};
  const views=new Map();let frame=0,last=0;
  const slideModels={welcome:['suitcase'],priorities:['map','compass','chair','cup'],mood:['globe']};
  function canvasFor(name){return document.querySelector(`[data-model="${name}"]`);}
  function fail(canvas,message){
    canvas.dataset.renderer='unavailable';canvas.closest('.scene-host').classList.add('scene-unavailable');
    const error=canvas.closest('.scene-host').querySelector('.scene-error');
    if(error){error.hidden=false;error.textContent='3D view unavailable. All slide controls still work.';}
    console.warn(`Travel 3D: ${message}`);
  }
  function getView(name){
    if(views.has(name))return views.get(name);
    const canvas=canvasFor(name);if(!canvas)return null;
    const options=name==='suitcase'?{eye:[3.6,2.3,6.8],target:[-.1,.13,0],ground:-1.65,background:'#F4EAF3'}:name==='globe'?{eye:[3,2.2,6.1],target:[.15,-.05,0],ground:-1.49,background:'#E5EEF5'}:{eye:[2.1,1.7,4.1],target:[0,0,0],ground:-1.03,background:{map:'#EBE5F4',compass:'#E3EDF5',chair:'#F5E3E9',cup:'#F5ECDC'}[name],shadowSize:512};
    const view={canvas,studio:null,hover:0,targetHover:0,failed:false,options};views.set(name,view);
    try{view.studio=new G.Studio(canvas,options);canvas.dataset.renderer='webgl2';canvas.closest('.scene-host').classList.add('scene-ready');}
    catch(error){view.failed=true;fail(canvas,error.message);return view;}
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();view.failed=true;fail(canvas,'Graphics context lost; reload to restore.');});
    canvas.addEventListener('webglcontextrestored',()=>{
      try{view.studio=new G.Studio(canvas,options);view.failed=false;canvas.dataset.renderer='webgl2';canvas.closest('.scene-host').classList.remove('scene-unavailable');const error=canvas.closest('.scene-host').querySelector('.scene-error');if(error)error.hidden=true;wake();}
      catch(error){fail(canvas,error.message);}
    });
    new ResizeObserver(wake).observe(canvas);
    return view;
  }
  const near=(a,b)=>Math.abs(a-b)<.0005;
  function tick(now){
    frame=0;if(document.hidden)return;
    if(now-last<32 && state.motion){frame=requestAnimationFrame(tick);return;}
    const dt=Math.min((now-last)/1000||.016,.06);last=now;
    const ease=state.motion?1-Math.exp(-dt*9):1;
    state.openPose+=(Number(state.open)-state.openPose)*ease;
    state.yaw+=(state.targetYaw+state.manualYaw-state.yaw)*ease;
    state.pitch+=(state.targetPitch-state.pitch)*ease;
    state.angle+=(state.targetAngle-state.angle)*(state.motion?1-Math.exp(-dt*5):1);
    let settling=!near(state.openPose,Number(state.open))||!near(state.yaw,state.targetYaw+state.manualYaw)||!near(state.pitch,state.targetPitch)||!near(state.angle,state.targetAngle);
    const time=state.motion?now/1000:0;
    for(const name of slideModels[state.slide]||[]){
      const view=getView(name);if(!view||view.failed)continue;
      view.hover+=(view.targetHover-view.hover)*ease;settling ||= !near(view.hover,view.targetHover);
      let objects;
      if(name==='suitcase'){
        // Reframe the wider open case, including on a nearly square phone canvas.
        const p=state.openPose;
        view.studio.eye=[3.6+.4*p,2.3+.3*p,6.8+1.5*p];
        view.studio.target=[-.1-.65*p,.13,.25*p];
        objects=M.suitcase({open:p,yaw:state.yaw+(state.motion?Math.sin(time*.45)*.045:0),pitch:state.pitch});
      }
      else if(name==='globe')objects=M.globe({angle:state.angle+(state.motion?Math.sin(time*.22)*.035:0),mood:state.mood});
      else {const chosen=state.preference===name,turn=(state.motion?view.hover*.25:0)+(chosen?.12:0);objects=M[name](G.chain(G.T(0,(chosen?.1:0)+view.hover*.055,0),G.RY(turn),G.RZ(name==='map'?-.08:0)));}
      try{view.lastObjects=objects;view.studio.render(objects);view.canvas.dataset.frames=String(view.studio.stats.frames);view.canvas.dataset.triangles=String(view.studio.stats.triangles);view.canvas.dataset.pose=name==='suitcase'?state.openPose.toFixed(3):name==='globe'?state.angle.toFixed(3):view.hover.toFixed(3);}
      catch(error){view.failed=true;fail(view.canvas,error.message);}
    }
    const activeViews=(slideModels[state.slide]||[]).map(n=>views.get(n));
    const alive=activeViews.some(v=>v&&!v.failed);
    if(state.motion&&alive&&(settling||state.slide==='welcome'||state.slide==='mood'))frame=requestAnimationFrame(tick);
  }
  function wake(){if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);}
  const hero=document.querySelector('#suitcase-stage');
  hero.addEventListener('pointermove',event=>{
    if(!state.motion||event.pointerType==='touch')return;
    const box=hero.getBoundingClientRect();
    state.targetYaw=Math.max(-.16,Math.min(.16,((event.clientX-box.left)/box.width-.5)*.32));
    state.targetPitch=Math.max(-.09,Math.min(.09,((event.clientY-box.top)/box.height-.5)*.18));wake();
  });
  hero.addEventListener('pointerleave',()=>{state.targetYaw=0;state.targetPitch=0;wake();});
  document.querySelectorAll('[data-preference]').forEach(button=>{
    const model=button.dataset.modelChoice;
    const hover=value=>{const view=getView(model);if(view)view.targetHover=value;wake();};
    button.addEventListener('pointerenter',()=>hover(1));button.addEventListener('pointerleave',()=>hover(0));
    button.addEventListener('focus',()=>hover(1));button.addEventListener('blur',()=>hover(0));
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
  root.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;});
  root.addEventListener('pageshow',wake);
  root.TravelScenes={
    setSlide(id){if(!(id in slideModels))return;state.slide=id;state.targetYaw=0;state.targetPitch=0;wake();},
    setMotion(value){state.motion=value;if(!value){state.targetYaw=0;state.targetPitch=0;state.yaw=state.manualYaw;state.pitch=0;}wake();},
    setSuitcaseOpen(value){state.open=Boolean(value);wake();},
    rotateSuitcase(direction){state.manualYaw=Math.max(-.5,Math.min(.5,state.manualYaw+direction*.16));wake();},
    resetView(){state.manualYaw=0;state.targetYaw=0;state.targetPitch=0;wake();},
    setPreference(name){state.preference=name;wake();},
    setMood(index){state.mood=Math.max(0,Math.min(3,index));state.targetAngle+=Math.PI*1.35;wake();},
    inspectFrame(name){const view=views.get(name);if(!view||view.failed||!view.lastObjects||!slideModels[state.slide].includes(name))return null;return view.studio.inspectFrame(view.lastObjects);},
    status(){return {slide:state.slide,motion:state.motion,open:state.open,renderers:[...views].map(([name,v])=>({name,available:!v.failed,frames:v.studio?.stats.frames||0}))};}
  };
})(window);

/* A reusable, disposable full-viewport scene, shared by quiz matches and the scene gallery. */
(function(root){'use strict';
const G=root.Travel3D,models=root.DestinationModels,content=root.DestinationContent;
let active=null;
function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;}
function button(text,action,cls=''){const el=node('button',cls,text);el.type='button';el.addEventListener('click',action);return el;}
function project(p,eye,target,width,height){const m=G.mul(G.perspective(Math.PI/5.3,width/height,.1,50),G.lookAt(eye,target));const v=[...p,1],r=[0,0,0,0];for(let i=0;i<4;i++)for(let j=0;j<4;j++)r[i]+=m[j*4+i]*v[j];return {x:(r[0]/r[3]*.5+.5)*width,y:(.5-r[1]/r[3]*.5)*height,visible:r[3]>0&&Math.abs(r[0]/r[3])<.95&&Math.abs(r[1]/r[3])<.95};}
function open(catalog,answers,{id,disclosure='Three quiz choices + four sample answers.',onClose=()=>{},motion=true}={}){
 root.GetawayMatch.validate(catalog,answers);if(active)active.close();
 const ranking=root.GetawayMatch.result(catalog,answers),primary=ranking.winner.id;id=id||primary;
 let destination=catalog.destinations.find(d=>d.id===id);if(!destination)throw Error('Unknown destination');
 const origin=document.activeElement,dialog=node('dialog','destination-experience');dialog.setAttribute('aria-label','Explore your destination');
 const canvas=node('canvas','destination-world');canvas.tabIndex=0;canvas.setAttribute('aria-label','3D environment. Drag to look. Arrow keys explore; Home resets.');
 const shade=node('div','destination-shade'),markers=node('div','destination-markers'),ui=node('div','destination-ui'),header=node('header','destination-toolbar');
 const title=node('h1','destination-name'),country=node('p','destination-eyebrow'),mood=node('p','destination-mood'),disclose=node('p','destination-disclosure',disclosure),hero=node('div','destination-hero');title.tabIndex=-1;
 const qualityNote=node('p','destination-quality-note');qualityNote.setAttribute('role','status');qualityNote.hidden=true;
 const status=node('p','destination-status');status.setAttribute('role','status');
 const explore=node('nav','destination-stops');explore.setAttribute('aria-label','Explore attractions');
 const info=node('section','destination-info'),place=node('h2'),activity=node('p'),source=node('a');source.target='_blank';source.rel='noopener noreferrer';source.textContent='Official guide ↗';info.append(place,activity,source);
 const itinerary=node('details','destination-itinerary'),summary=node('summary','', 'Three days, your way'),days=node('div','destination-days');itinerary.append(summary,days);
 const why=node('details','destination-why'),whySummary=node('summary','','Why this match?'),whyText=node('p');why.append(whySummary,whyText);
 const alternatives=node('nav','destination-alternatives');alternatives.setAttribute('aria-label','Alternative destinations');
 let generation=0,qualityError=null;
 let renderer=null,model=null,plan=null,raf=0,last=0,clock=0,enabled=motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches,entered=0,look=[0,0],desired=[0,0],drag=null,selected=-1,eye=[],target=[],endEye=[],endTarget=[],lost=false,closed=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const close=()=>{dialog.close();cleanup();};
 const motionButton=button('Pause motion',()=>{enabled=!enabled&&!reduced.matches;motionButton.textContent=enabled?'Pause motion':'Motion off';motionButton.setAttribute('aria-pressed',String(enabled));if(!enabled)desired=[0,0];wake();});
 const previewLabel=node('label','destination-selector','Prototype-only scene preview'),previewSelect=node('select');previewSelect.setAttribute('aria-label','Prototype-only destination preview; does not change quiz scoring');
 catalog.destinations.forEach(d=>{const option=node('option','',d.name+(models.definitions[d.id]?' · 3D':' · fallback'));option.value=d.id;previewSelect.append(option);});previewSelect.addEventListener('change',()=>navigate(previewSelect.value));previewLabel.append(previewSelect);
 header.append(button('← Match details',close),previewLabel,button('Reset view',reset),motionButton);hero.append(country,title,mood,disclose);ui.append(header,qualityNote,hero,explore,info,itinerary,why,alternatives,status);dialog.append(canvas,shade,markers,ui);document.body.append(dialog);
 const markerButtons=[];let attractionButtons=[];
 function reset(){selected=-1;desired=[0,0];look=[0,0];if(model){endEye=[...model.definition.eye];endTarget=[...model.definition.target];}info.hidden=true;attractionButtons.forEach(b=>b.setAttribute('aria-pressed','false'));wake();}
 function focusAttraction(i){selected=i;if(enabled)info.animate?.([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});const a=plan.activities[i];place.textContent=a.place;activity.textContent=a.title;source.href=a.source;info.hidden=false;attractionButtons.forEach((b,n)=>b.setAttribute('aria-pressed',String(i===n)));if(model){const p=model.definition.markers[i].point;endTarget=[p[0],Math.min(p[1],2.5),p[2]];endEye=[p[0]+3.5,Math.max(2.3,p[1]+1.2),p[2]+6];desired=[0,0];}status.textContent=`Exploring ${a.place}.`;wake();}
 function change(next){
  const nextDestination=catalog.destinations.find(d=>d.id===next);if(!nextDestination)return;destination=nextDestination;previewSelect.value=next;drag=null;
  const revision=++generation;qualityNote.hidden=true;qualityError=null;
  cancelAnimationFrame(raf);raf=0;renderer?.dispose();renderer=null;lost=false;model=models.build(next);plan=content.personalize(destination,answers);clock=0;last=0;entered=0;
  dialog.dataset.destination=next;dialog.dataset.immersive=String(!!model);title.textContent=destination.name;country.textContent=destination.country+' / '+(next===primary?'YOUR MATCH':'EXPLORING AN ALTERNATIVE');mood.textContent=model?model.definition.mood:destination.tagline;
  status.textContent=model?'Drag to look · choose a place to move closer.':'The immersive environment is being built. Your personalized highlights and itinerary are ready.';
  dialog.style.setProperty('--scene-accent',model?.definition.accent||'#E7B58B');
  canvas.hidden=!model;shade.hidden=!model;markers.replaceChildren();markerButtons.length=0;explore.replaceChildren();
  attractionButtons=plan.activities.map((a,i)=>{const b=button(`${String(i+1).padStart(2,'0')} ${a.place}`,()=>focusAttraction(i));b.setAttribute('aria-pressed','false');explore.append(b);return b;});
  if(model){for(let i=0;i<3;i++){const b=button(String(i+1),()=>focusAttraction(i),'destination-pin');b.tabIndex=-1;b.setAttribute('aria-hidden','true');markers.append(b);markerButtons.push(b);}try{renderer=new root.DestinationRenderer(canvas,model.definition);}catch{renderer=null;status.textContent='3D is unavailable. Explore every attraction and your itinerary below.';dialog.dataset.immersive='false';canvas.hidden=true;markers.hidden=true;}eye=model.definition.eye.map((v,i)=>v+[2,2,5][i]);target=[...model.definition.target];}
  days.replaceChildren(...plan.days.map(d=>{const article=node('article'),h=node('h3','',`Day ${d.day} / ${d.place}`);article.append(h,node('p','',d.title),node('p','',d.pace+' '+d.packing),node('p','',d.company+' '+d.budget),node('p','',d.transfer));return article;}));
  const score=ranking.ranking.find(r=>r.id===next);whyText.textContent=`${score.score}/60 editorial fit points. `+score.contributions.filter(r=>r.points>0).sort((a,b)=>b.points-a.points).slice(0,2).map(r=>`“${r.label}” adds ${r.points} points.`).join(' ')+` Your activity priorities use ${catalog.questions.map(q=>q.options['abcd'.indexOf(answers[q.id])]).join('; ')}. ${ranking.tie} These are draft suggestions, not verified bookings. Scenery compresses places for illustration; it is not a geographic map.`;
  alternatives.replaceChildren(node('span','','EXPLORE ALSO'));
  ranking.ranking.slice(1,3).filter(r=>r.id!==next).forEach(r=>alternatives.append(button(r.destination.name+' ↗',()=>navigate(r.id))));
  if(next!==primary)alternatives.append(button('← My match: '+ranking.winner.destination.name,()=>navigate(primary)));
  if(enabled){canvas.animate?.([{opacity:.15},{opacity:1}],{duration:650,easing:'ease-out'});hero.animate?.([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out'});}reset();if(!renderer)focusAttraction(0);else{markers.hidden=false;wake();}
  if(['paris','tokyo'].includes(next)&&root.DestinationAssets&&root.DestinationQuality)upgrade(next,revision);
 }
 async function upgrade(id,revision){
  qualityNote.hidden=false;qualityNote.textContent='Checking local quality assets… The original blockout remains available.';
  try{const report=await root.DestinationAssets.assess(id);if(closed||revision!==generation)return;
   if(!report.ready){qualityNote.textContent='VISUAL UPGRADE INCOMPLETE — missing reviewed local models/textures. Showing the original blockout, not the requested final quality.';return;}
   const prepared=await root.DestinationQuality.prepare(report);if(closed||revision!==generation){prepared.dispose();return;}
   renderer?.dispose();renderer=null;
   try{renderer=root.DestinationQuality.attach(canvas,prepared);}catch(e){prepared.dispose();renderer=new root.DestinationRenderer(canvas,model.definition);throw e;}
   model.definition={...model.definition,eye:prepared.config.camera.eye,target:prepared.config.camera.target,markers:model.definition.markers.map((p,i)=>({...p,point:prepared.anchors[i]}))};
   eye=[...prepared.config.camera.eye];target=[...prepared.config.camera.target];entered=0;reset();qualityNote.textContent=prepared.config.mode==='paris-landmark'?'PARIS ASSET PREVIEW — imported Eiffel Tower with an artistic silver finish. Original street details; animated people/traffic still missing. Compressed illustrative geography.':'Local glTF asset preview — visual approval pending.';wake();
  }catch(error){if(!closed&&revision===generation){qualityError=error.message||'Unknown asset-loading error';qualityNote.textContent='VISUAL UPGRADE INCOMPLETE — '+qualityError+'. The original blockout and itinerary remain available.';wake();}}
 }
 function navigate(next){change(next);title.focus({preventScroll:true});}
 function tick(now){raf=0;if(closed||document.hidden||lost||!renderer)return;if(now-last<32){wake();return;}const dt=Math.min((now-last)/1000||.033,.05);last=now;if(enabled)clock+=dt*1000;
  entered=enabled?Math.min(1,entered+dt/1.35):1;const ease=1-Math.exp(-dt*6);
  look=look.map((v,i)=>enabled?v+(desired[i]-v)*ease:0);
  const desiredEye=endEye.map((v,i)=>v+(entered<1?[2,2,5][i]*(1-entered)**3:0));
  eye=eye.map((v,i)=>enabled?v+(desiredEye[i]-v)*ease:desiredEye[i]);target=target.map((v,i)=>enabled?v+(endTarget[i]-v)*ease:endTarget[i]);
  renderer.eye=[eye[0]+look[0],eye[1]+look[1],eye[2]];renderer.target=[target[0]+look[0]*.25,target[1]+look[1]*.25,target[2]];
  renderer.setTime?.(clock,enabled);renderer.render(renderer.quality?undefined:model.objects(clock,enabled));const r=canvas.getBoundingClientRect();model.definition.markers.forEach((p,i)=>{const pos=project(p.point,renderer.eye,renderer.target,r.width,r.height),b=markerButtons[i];b.hidden=!pos.visible;b.style.left=pos.x+'px';b.style.top=pos.y+'px';});
  if(enabled)wake();
 }
 function wake(){if(!raf&&!closed&&!document.hidden&&renderer&&!lost)raf=requestAnimationFrame(tick);}
 const clamp=(v,n)=>Math.max(-n,Math.min(n,v));
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,base:[...desired]};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!enabled){if(drag){endEye[0]=clamp(endEye[0]-(e.clientX-drag.x)*.012,14);endEye[1]=Math.max(.6,Math.min(10,endEye[1]+(e.clientY-drag.y)*.008));drag.x=e.clientX;drag.y=e.clientY;wake();}return;}if(drag){desired=[clamp(drag.base[0]-(e.clientX-drag.x)*.012,4),clamp(drag.base[1]+(e.clientY-drag.y)*.008,1.5)];}else if(e.pointerType==='mouse'){const r=canvas.getBoundingClientRect();desired=[((e.clientX-r.left)/r.width-.5)*1.6,((e.clientY-r.top)/r.height-.5)*.6];}wake();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{drag=null;});canvas.addEventListener('pointerleave',()=>{if(!drag){desired=[0,0];wake();}});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();e.stopPropagation();if(e.key==='Home')reset();else{const i=['ArrowLeft','ArrowRight'].includes(e.key)?0:1,delta=['ArrowRight','ArrowUp'].includes(e.key)?.5:-.5;endEye[i]+=delta;endEye[i]=i===0?clamp(endEye[i],14):Math.max(.6,Math.min(10,endEye[i]));wake();}});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;status.textContent='3D paused: graphics context lost. Your highlights and itinerary still work.';markers.hidden=true;});
 canvas.addEventListener('webglcontextrestored',()=>{const current=destination.id;renderer=null;change(current);});
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else wake();};document.addEventListener('visibilitychange',visibility);
 const preference=()=>{enabled=motion&&!reduced.matches;motionButton.disabled=reduced.matches;motionButton.setAttribute('aria-pressed',String(enabled));motionButton.textContent=enabled?'Pause motion':'Motion off';wake();};reduced.addEventListener('change',preference);
 const resize=new ResizeObserver(()=>wake());resize.observe(canvas);
 const pagehide=()=>close();root.addEventListener('pagehide',pagehide);
 function cleanup(){if(closed)return;closed=true;generation++;cancelAnimationFrame(raf);renderer?.dispose();resize.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',preference);root.removeEventListener('pagehide',pagehide);dialog.remove();active=null;onClose();if(origin?.isConnected)origin.focus({preventScroll:true});}
 dialog.addEventListener('close',cleanup);
 dialog.showModal();change(id);preference();title.focus({preventScroll:true});
 active={close,navigate,inspect:()=>renderer?renderer.inspectFrame(model.objects(clock,enabled)):null,state:()=>({id:destination.id,primary,selected,motion:enabled,ready:!!renderer&&!lost,quality:renderer?.quality===true,qualityError,triangles:renderer?.stats.triangles,drawBatches:model?.objects().length,answers:{...answers}})};return active;
}
root.DestinationExperience={open,project,get active(){return active;}};
})(window);

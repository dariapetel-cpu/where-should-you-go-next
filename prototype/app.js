/* Prototype-only UI/state. Does not read, migrate or overwrite legacy storage. */
(() => {
 'use strict';
 const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],Q=window.GetawayMatch,scene=window.PrototypeScene;
 const ids=['vacation','interests','pace'],hashes=['vacation','interests','pace','preview'],media=window.matchMedia('(prefers-reduced-motion: reduce)');
 let catalog,state,pending=false,preview=0,day=0,derived,drag=null,suppressClick=false;
 const descriptions=['Salt in the air. Space to unwind.','New streets. A different perspective.','Fresh air. A bigger horizon.','Old stories. New discoveries.'];
 function notice(text){$('#notice').textContent=text;$('#notice').hidden=!text;}
 function save(){if(pending)return;try{sessionStorage.setItem(Q.KEY,JSON.stringify(state));}catch{notice('Tab recovery is unavailable. You can still explore this prototype.');}}
 function motion(){const enabled=state.motion&&!media.matches;document.documentElement.dataset.motion=enabled?'on':'off';$('#motion').setAttribute('aria-pressed',String(enabled));$('#motion').textContent=enabled?'Motion on':'Motion off';$('#motion').disabled=media.matches;scene?.motion(enabled);$('#scene-note').textContent=enabled?'MOVE YOUR POINTER · DRAG TO EXPLORE':'MOTION OFF · ARROW KEYS EXPLORE';}
 function cleanupDrag(){if(drag){drag.item.style.transform='';drag.item.removeAttribute('data-dragging');}$('#visual').removeAttribute('data-drop');drag=null;}
 function sync(){
  ids.forEach(id=>all(`#${id}-choices input`).forEach(input=>{input.checked=state.answers[id]===input.value;}));
  const count=Object.keys(state.answers).length;$('#answered').textContent=`${count} of 3 sample choices`;$('#progress').setAttribute('aria-valuenow',String(count));$('#progress').setAttribute('aria-valuetext',`${count} of 3 prototype questions answered`);$('#progress i').style.width=`${count/3*100}%`;
  all('[data-go]').forEach(button=>{button.disabled=!Q.canEnter(state,Number(button.dataset.go));button.setAttribute('aria-current',Number(button.dataset.go)===state.step?'step':'false');});
  ids.forEach(id=>{$(`#${id}-status`).textContent=state.answers[id]?`Selected: ${catalog.questions.find(q=>q.id===id).options['abcd'.indexOf(state.answers[id])]}`:'';});
 }
 function setPreview(index){preview=(index+4)%4;$('#preview-number').textContent=`0${preview+1} / 04`;$('#preview-label').textContent=catalog.questions[0].options[preview];$('#preview-description').textContent=descriptions[preview];$('#select-scene').textContent=state.answers.vacation==='abcd'[preview]?'Selected ✓':'Select this scene ＋';scene?.preview(preview);}
 function choose(id,value){state=Q.choose(catalog,state,id,value);notice('');save();sync();if(id==='vacation')setPreview('abcd'.indexOf(value));scene?.select('abcd'.indexOf(value));}
 function renderDay(index,focus=false){day=index;all('[role="tab"]').forEach((button,i)=>{button.setAttribute('aria-selected',String(i===day));button.tabIndex=i===day?0:-1;});const d=derived.days[day];$('#day-panel').setAttribute('aria-labelledby',`day-${day}`);$('#day-place').textContent=d.place;$('#day-stops').replaceChildren(...d.stops.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));$('#day-optional').textContent=d.optional;$('#day-note').textContent=d.note;if(focus)$(`#day-${day}`).focus();}
 function enterDestination(){if(window.DestinationExperience)window.DestinationExperience.open(catalog,{...state.answers,...state.fixture},{motion:state.motion});}
 function renderResult(){
  derived=Q.result(catalog,{...state.answers,...state.fixture});const r=derived,w=r.winner,d=w.destination;
  $('#result-heading').textContent=d.name;$('#country').textContent=d.country;$('#destination-line').textContent=d.tagline;$('#score').textContent=`${w.score}/60`;
  $('#reasons').replaceChildren(...r.reasons.map(reason=>{const p=document.createElement('p');p.textContent=`${ids.includes(reason.question)?'Your choice':'Sample answer'}: “${reason.label}”. This contributes ${reason.points} points to ${d.name}’s curated ${reason.question} fit.`;return p;}));
  $('#tradeoff').textContent=r.trade?`A trade-off: “${r.trade.label}” has ${r.trade.affinity} of 3 affinity points here. This is a best fit within fifteen destinations, not a perfect match.`:'This is an editorial match within fifteen destinations, not worldwide optimization.';
  $('#attractions').replaceChildren(...r.attractions.map(name=>{const li=document.createElement('li');li.textContent=name;return li;}));$('#source-link').href=d.source;
  $('#tie-note').textContent=r.tie||'No top-score tie. Results use the PRD’s fixed integer weights.';
  const table=document.createElement('table'),caption=document.createElement('caption');caption.textContent='Destination ranking · PRD 3.1 · catalog 2.0.0';table.append(caption);
  const head=document.createElement('tr');for(const t of ['Rank','Destination','Points']){const th=document.createElement('th');th.scope='col';th.textContent=t;head.append(th);}table.append(head);
  r.ranking.forEach((row,i)=>{const tr=document.createElement('tr');for(const text of [String(i+1),row.destination.name,String(row.score)]){const td=document.createElement('td');td.textContent=text;tr.append(td);}table.append(tr);});
  $('#score-table').replaceChildren(table);renderDay(day);
  const host=$('#result-alternatives');host.replaceChildren(...r.ranking.slice(1,3).map(row=>{const button=document.createElement('button');button.textContent=`Explore ${row.destination.name} ↗`;button.addEventListener('click',()=>window.DestinationExperience?.open(catalog,{...state.answers,...state.fixture},{id:row.id,motion:state.motion}));return button;}));
 }
 function show(step,{history=true,focus=true}={}){
  if(pending)return;if(!Q.canEnter(state,step)){notice('Choose one answer to continue.');return;}
  cleanupDrag();state.step=step;all('[data-panel]').forEach((panel,i)=>{panel.hidden=i!==step;panel.inert=i!==step;panel.classList.remove('entering');});document.body.dataset.step=String(step);
  const active=all('[data-panel]')[step];if(state.motion&&!media.matches)active.classList.add('entering');
  $('#back').disabled=step===0;$('#position').textContent=step<3?`Slide ${step+4} · Question ${step+1} of 7`:'Isolated destination preview';$('#visual-word').textContent=['depart.','discover.','your pace.',''][step];
  scene?.setStep(step,'abcd'.indexOf(state.answers[ids[step]]));
  if(step===0)setPreview('abcd'.indexOf(state.answers.vacation)>=0?'abcd'.indexOf(state.answers.vacation):preview);
  if(step===3)renderResult();sync();save();motion();
  if(history&&window.location.hash!==`#${hashes[step]}`)window.history.pushState(null,'',`#${hashes[step]}`);
  if(focus){active.querySelector('h1').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  if(step===3&&window.DestinationModels?.definitions[derived.winner.id])enterDestination();
 }
 function pack(grip){const input=grip.closest('.pace-item').querySelector('input');choose('pace',input.value);input.focus({preventScroll:true});}
 function buildChoices(){
  for(const q of catalog.questions.slice(0,3)){
   const host=$(`#${q.id}-choices`);
   q.options.forEach((text,i)=>{
    const label=document.createElement('label'),input=document.createElement('input'),copy=document.createElement('span');input.type='radio';input.name=q.id;input.value='abcd'[i];input.setAttribute('aria-label',text);copy.className='choice-text';copy.textContent=text;label.append(input);
    input.addEventListener('change',()=>choose(q.id,input.value));
    if(q.id==='pace'){
     const item=document.createElement('div');item.className='pace-item';const pattern=document.createElement('span');pattern.className='day-pattern';pattern.setAttribute('aria-hidden','true');for(let n=0;n<[2,3,5,2][i];n++)pattern.append(document.createElement('i'));label.append(pattern,copy);
     const grip=document.createElement('button');grip.type='button';grip.className='drag-handle';grip.textContent='⠿';grip.setAttribute('aria-label',`Pack day-plan: ${text}`);item.append(label,grip);host.append(item);
     grip.addEventListener('click',e=>{if(suppressClick&&e.detail!==0){suppressClick=false;return;}pack(grip);});
     grip.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;suppressClick=false;drag={id:e.pointerId,x:e.clientX,y:e.clientY,item,moved:false};grip.setPointerCapture(e.pointerId);});
     grip.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved ||= Math.hypot(dx,dy)>8;if(!drag.moved)return;item.dataset.dragging='true';item.style.transform=`translate(${dx}px,${dy}px)`;const r=$('#visual').getBoundingClientRect();$('#visual').dataset.drop=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom?'ready':'waiting';});
     grip.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved,r=$('#visual').getBoundingClientRect(),inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;cleanupDrag();suppressClick=moved;if(moved&&inside)pack(grip);});
     grip.addEventListener('pointercancel',()=>{suppressClick=true;cleanupDrag();});grip.addEventListener('lostpointercapture',()=>{if(drag){suppressClick=drag.moved;cleanupDrag();}});
    }else{label.append(copy);host.append(label);}
   });
  }
  for(const q of catalog.questions.slice(3)){
   const label=document.createElement('label'),select=document.createElement('select');label.textContent=`Sample ${q.id}`;select.setAttribute('aria-label',`Sample answer for ${q.id}`);
   q.options.forEach((text,i)=>{const option=document.createElement('option');option.value='abcd'[i];option.textContent=text;select.append(option);});select.value=state.fixture[q.id];
   select.addEventListener('change',()=>{if(state.fixture[q.id]===select.value)return;state.fixture[q.id]=select.value;state.revision++;save();if(state.step===3)renderResult();});label.append(select);$('#fixture-controls').append(label);
  }
 }
 $('#enter-destination').addEventListener('click',()=>{if(state&&state.step===3)enterDestination();});
 $('#scene-prev').addEventListener('click',()=>{if(catalog)setPreview(preview-1);});$('#scene-next').addEventListener('click',()=>{if(catalog)setPreview(preview+1);});$('#select-scene').addEventListener('click',()=>{if(catalog&&!pending)choose('vacation','abcd'[preview]);});
 let swipe;
 $('#scene-preview').addEventListener('pointerdown',e=>{swipe={x:e.clientX,id:e.pointerId};$('#scene-preview').setPointerCapture(e.pointerId);});$('#scene-preview').addEventListener('pointerup',e=>{if(swipe&&swipe.id===e.pointerId&&Math.abs(e.clientX-swipe.x)>35)setPreview(preview+(e.clientX<swipe.x?1:-1));swipe=null;});$('#scene-preview').addEventListener('pointercancel',()=>{swipe=null;});
 ids.forEach((id,i)=>$(`#${id}-next`).addEventListener('click',()=>{if(state)show(i+1);}));
 $('#back').addEventListener('click',()=>{if(state)show(state.step-1);});$('#review').addEventListener('click',()=>show(0));
 $('#motion').addEventListener('click',()=>{if(!state)return;state.motion=!state.motion;motion();save();});media.addEventListener('change',()=>{if(state)motion();});
 $('#overview-open').addEventListener('click',()=>$('#overview').showModal());$('#overview-close').addEventListener('click',()=>$('#overview').close());all('[data-go]').forEach(button=>button.addEventListener('click',()=>{$('#overview').close();if(state)show(Number(button.dataset.go));}));
 all('[role="tab"]').forEach((button,i)=>{button.addEventListener('click',()=>renderDay(i));button.addEventListener('keydown',e=>{const map={ArrowLeft:(day+2)%3,ArrowRight:(day+1)%3,Home:0,End:2};if(e.key in map){e.preventDefault();renderDay(map[e.key],true);}});});
 document.addEventListener('keydown',e=>{if(!state||pending||all('dialog').some(d=>d.open)||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('button, input, select, a, summary'))return;const map={ArrowLeft:state.step-1,ArrowRight:state.step+1,Home:0,End:3};if(e.key in map){e.preventDefault();show(map[e.key]);}});
 const restoreHash=()=>{if(!state||pending)return;const i=hashes.indexOf(window.location.hash.slice(1));if(i>=0)show(Q.canEnter(state,i)?i:state.step,{history:false});};window.addEventListener('popstate',restoreHash);window.addEventListener('hashchange',restoreHash);window.addEventListener('pagehide',cleanupDrag);
 $('#recovery').addEventListener('cancel',e=>e.preventDefault());$('#resume').addEventListener('click',()=>{pending=false;$('#recovery').close();show(state.step);});$('#fresh').addEventListener('click',()=>{state=Q.fresh(catalog);pending=false;$('#recovery').close();all('#fixture-controls select').forEach((select,i)=>{select.value=state.fixture[catalog.questions[i+3].id];});show(0);});
 notice('Loading the local getaway collection…');
 fetch('catalog.json').then(r=>{if(!r.ok)throw Error('Missing catalog');return r.json();}).then(c=>{
  catalog=c;state=Q.fresh(c);let raw;try{raw=sessionStorage.getItem(Q.KEY);}catch{}notice('');
  if(raw){pending=true;try{state=Q.recover(c,raw);}catch{$('#resume').hidden=true;$('#recovery-text').textContent='This prototype record could not be recovered. Start again; your legacy quiz remains untouched.';}}
  buildChoices();sync();motion();
  if(pending)$('#recovery').showModal();else{const index=hashes.indexOf(window.location.hash.slice(1));show(Q.canEnter(state,index)?index:0,{history:false,focus:false});}
  window.GetawayPrototype={ready:true,state:()=>JSON.parse(JSON.stringify(state)),ranking:()=>Q.result(catalog,{...state.answers,...state.fixture})};
 }).catch(()=>notice('The local catalog could not load. Serve the project over HTTP and refresh; existing progress has not been changed.'));
})();

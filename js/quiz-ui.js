/* Browser bridge: explicit downloads, tab-local recovery, no participant network requests. */
(() => {
  'use strict';
  const Q=window.TravelQuiz,$=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
  const key='travel-edit.quiz.v1',ids=['welcome','priorities','mood','boarding','q1','q2','q3','q4','q5','q6','q7','match'];
  let config,state,pending=false,navigate=()=>{},refresh=()=>{},setMotion=()=>{},current='welcome';
  const newId=()=>crypto.randomUUID();
  function notice(text){$('#journey-notice').textContent=text;$('#journey-notice').hidden=!text;}
  function save(){if(!state||pending)return;try{sessionStorage.setItem(key,JSON.stringify(state));}catch{notice('Refresh recovery is unavailable in this browser. You can still finish and export your quiz.');}}
  function render(){
    if(!config)return;
    const count=Object.keys(state.answers).length,done=Q.complete(config,state);
    all('.slide-question').forEach((slide,i)=>{
      slide.querySelector('.quiz-count').textContent=`Question ${i+1} of 7 · ${count} answered`;
      slide.querySelectorAll('[data-segment]').forEach(segment=>{
        const answered=Boolean(state.answers[segment.dataset.segment]);
        segment.dataset.answered=String(answered);segment.dataset.current=String(segment.dataset.segment===slide.id);
        if(segment.dataset.segment===slide.id)segment.setAttribute('aria-current','step');else segment.removeAttribute('aria-current');
        segment.setAttribute('aria-label',`${segment.dataset.segment.toUpperCase()}: ${answered?'answered':'unanswered'}`);
      });
      slide.querySelectorAll('input').forEach(input=>{input.checked=state.answers[slide.id]===input.value;});
      slide.querySelector('.return-results').hidden=!state.revealed||!done;
      slide.querySelector('.answer-status').textContent=state.answers[slide.id]?'Choice saved.':'';
    });
    if(done&&state.revealed){
      const r=Q.score(config,state);
      $('#match-heading').textContent=r.profile.name;
      $('.match-message').textContent=r.profile.message;
      $('.match-reasons').textContent=`You chose ${r.reasons.map(t=>'“'+t.replace(/\.$/,'')+'”').join(' and ')}. That puts this style first.`;
      $('.match-tip').textContent=r.profile.tip;
      $('#destination-name').textContent=r.profile.destination;
      $('#sample-day').replaceChildren(...r.day.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
      $('#score-details').replaceChildren(...Object.entries(r.counts).map(([id,n])=>{const p=document.createElement('p');p.textContent=`${config.profiles[id].name}: ${n} of 7`;return p;}));
      if(r.tied.length>1){const p=document.createElement('p');p.textContent=`${r.tied.length===2?'Two':'Three'} styles tied. Your answer to “${config.questions.find(q=>q.id===r.deciding).title}” selected ${r.profile.name}.`;$('#score-details').append(p);}
      window.TravelScenes?.setJourneyResult([1,0,2,3][Object.keys(config.profiles).indexOf(r.profile_id)]);
    }
    for(const id of ['q1','q2']){
      const options=config.questions.find(q=>q.id===id).options;
      window.TravelScenes?.setSampleChoice(id,options.findIndex(o=>o.id===state.answers[id]));
      const label=$(`#${id} .art-caption`);
      if(id==='q2')label.textContent=state.answers[id]?'PACKED. CHANGE YOUR MIND ANYTIME.':'DROP ONE IDEA HERE · OR SELECT AN ITEM';
    }
    refresh();
  }
  function fresh(){state=Q.fresh(config,newId());state.motion=document.documentElement.dataset.motion!=='off';pending=false;save();render();}
  function onSlide(id){
    current=id;
    window.TravelSample?.cancelDrag();
    const sample=['boarding','q1','q2'].includes(id);
    document.documentElement.dataset.sample=sample?id:'';
    if($('#journey-notice').textContent==='Choose one answer to continue.')notice('');
    const dock=$(`#${id} .journey-dock`),host=$('#journey-scene');
    host.hidden=!dock;if(dock)dock.append(host);$('.object-hint').textContent=sample?(document.documentElement.dataset.motion==='off'?'Motion off · arrow keys explore':'Move your pointer · drag to explore'):'Turn it around ↻';
    $('.journey-object').setAttribute('aria-label',sample?'Explore the 3D object. Arrow keys turn, Home or activation resets the view.':'Turn the 3D travel object');
    if(state&&!pending){state.slide=id;if(id==='match')state.revealed=true;render();save();}
  }
  window.QuizJourney={
    connect(callbacks){navigate=callbacks.navigate;refresh=callbacks.refresh;setMotion=callbacks.setMotion;},
    canEnter(index){return index<4||Boolean(config&&!pending&&Q.canEnter(config,state,index));},
    blocked(){notice(config?'Choose one answer to continue.':'Quiz content is loading. If it does not load, refresh using the local HTTP preview.');},
    onSlide,
    motion(value){if(['boarding','q1','q2'].includes(current))$('.object-hint').textContent=value?'Move your pointer · drag to explore':'Motion off · arrow keys explore';if(state){state.motion=value;save();}},
    get ready(){return Boolean(config);}
  };
  all('.slide-question').forEach((slide,i)=>{
    slide.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{
      if(!config||pending)return;
      state=Q.choose(config,state,slide.id,input.value);notice('');$('#export-status').textContent='';save();render();
      window.TravelScenes?.turnJourney();
    }));
    slide.querySelector('.quiz-next').addEventListener('click',()=>navigate(5+i));
    slide.querySelector('.return-results').addEventListener('click',()=>navigate(11));
  });
  $('#start-quiz').addEventListener('click',()=>navigate(4));
  $('.journey-object').addEventListener('click',()=>{if(['boarding','q1','q2'].includes(current)){window.TravelScenes?.resetSampleView();return;}window.TravelScenes?.turnJourney();$('.object-hint').textContent='View turned · turn again ↻';});
  $('#review-answers').addEventListener('click',()=>navigate(4));
  $('#replay-quiz').addEventListener('click',()=>$('#replay-dialog').showModal());
  $('#cancel-replay').addEventListener('click',()=>{$('#replay-dialog').close();$('#replay-quiz').focus();});
  $('#confirm-replay').addEventListener('click',()=>{$('#replay-dialog').close();fresh();$('#export-status').textContent='';navigate(4);});
  $('#recovery-dialog').addEventListener('cancel',e=>e.preventDefault());
  $('#resume-quiz').addEventListener('click',()=>{pending=false;$('#recovery-dialog').close();setMotion(state.motion);render();navigate(ids.indexOf(state.slide));});
  $('#fresh-quiz').addEventListener('click',()=>{$('#recovery-dialog').close();fresh();navigate(4);});
  $('#export-response').addEventListener('click',()=>{
    if(!config||!Q.complete(config,state))return;
    try{
      const data=Q.exportRecord(config,state),blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download=`traveler-${state.response_id}-r${state.revision}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      $('#export-status').textContent=`Download requested · revision ${state.revision}. Keep response files private. Nothing was uploaded.`;
    }catch{$('#export-status').textContent='Download unavailable. Your answers are still here; try again in a supported browser.';}
  });
  fetch('data/quiz-v1.json').then(response=>{if(!response.ok)throw new Error('Quiz data unavailable');return response.json();}).then(data=>{
    config=data;state=Q.fresh(config,newId());state.motion=document.documentElement.dataset.motion!=='off';
    let raw;try{raw=sessionStorage.getItem(key);}catch{notice('Refresh recovery is unavailable. You can still finish and export your quiz.');}
    if(raw){
      pending=true;
      try{state=Q.recover(config,JSON.parse(raw));}catch{$('#resume-quiz').hidden=true;$('#recovery-message').textContent='The saved quiz could not be recovered. Start fresh to continue.';}
      $('#recovery-dialog').showModal();
    }
    $('#destination-sources').replaceChildren(...config.sources.map(source=>{const p=document.createElement('p'),a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=source.title;p.append(a);return p;}));
    render();if(!pending){state.slide=current;save();}
  }).catch(()=>{notice('Quiz content could not load. Start the local HTTP server and refresh. Your saved quiz has not been changed.');});
})();

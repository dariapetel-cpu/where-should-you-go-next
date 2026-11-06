/* Run through tests/browser-checks.html. These are real browser checks, not mocks. */
'use strict';
const frame=document.querySelector('#app'),report=document.querySelector('#report'),run=document.querySelector('#run');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate,message){const end=Date.now()+6000;while(!predicate()){if(Date.now()>end)throw new Error(message);await pause(40);}}
run.addEventListener('click',async()=>{
  run.disabled=true;report.textContent='Running…\n';let passed=0,failed=0;const failures=[];
  async function check(label,fn){try{await fn();passed++;report.textContent+=`PASS  ${label}\n`;}catch(error){failed++;failures.push(label);report.textContent+=`FAIL  ${label}: ${error.message}\n`;}}
  function assert(value,message){if(!value)throw new Error(message);}
  const storageKey='travel-edit.quiz.v1';let previousSession,storageAvailable=false;
  try{previousSession=sessionStorage.getItem(storageKey);sessionStorage.removeItem(storageKey);storageAvailable=true;}catch{}
  try{
    frame.width=1280;frame.height=720;
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Presentation load timed out')),6000);
      frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});
      frame.src='../index.html?browser-checks=1';
    });
    await until(()=>frame.contentWindow.TravelScenes&&frame.contentDocument.querySelector('#hero-action'),'Application did not load');
    const win=frame.contentWindow,doc=frame.contentDocument,el=id=>doc.getElementById(id),click=id=>el(id).click();
    await until(()=>win.QuizJourney?.ready,'Quiz content did not load');
    // Disable ambient movement for deterministic GPU comparisons.
    if(el('motion-toggle').getAttribute('aria-pressed')==='true')click('motion-toggle');
    await until(()=>doc.querySelector('[data-model="suitcase"]').dataset.frames,'Suitcase did not render');
    let closedHash;
    await check('Suitcase draws actual WebGL pixels with no GL error',()=>{
      const image=win.TravelScenes.inspectFrame('suitcase');assert(image&&image.error===0,'WebGL unavailable or GL error');assert(image.nonBackgroundPixels>500,'No visible mesh pixels');closedHash=image.hash;
    });
    await check('Primary action opens a hinged 3D suitcase',async()=>{
      click('hero-action');await until(()=>Number(doc.querySelector('[data-model="suitcase"]').dataset.pose)>.999,'Lid did not open');
      assert(el('suitcase-stage').getAttribute('aria-pressed')==='true','Missing pressed state');
      assert(win.TravelScenes.inspectFrame('suitcase').hash!==closedHash,'GPU image did not change');
    });
    await check('Direct suitcase activation closes it',async()=>{
      click('suitcase-stage');await until(()=>Number(doc.querySelector('[data-model="suitcase"]').dataset.pose)<.001,'Lid did not close');
      assert(el('suitcase-stage').getAttribute('aria-pressed')==='false','Close state not reflected');
    });
    await check('Rotate and reset controls change and restore the rendered view',async()=>{
      const before=win.TravelScenes.inspectFrame('suitcase').hash;click('rotate-left');await pause(100);
      assert(win.TravelScenes.inspectFrame('suitcase').hash!==before,'Rotation did not change GPU image');click('rotate-right');click('reset-view');await pause(100);
      assert(win.TravelScenes.inspectFrame('suitcase').hash===before,'Reset did not restore view');
    });
    click('next-slide');
    await check('All four preference objects render as 3D geometry',async()=>{
      await until(()=>win.TravelScenes.status().renderers.length>=5,'Gallery did not initialize');await pause(100);
      for(const name of ['map','compass','chair','cup']){const image=win.TravelScenes.inspectFrame(name);assert(image&&image.error===0&&image.nonBackgroundPixels>150,`${name} did not render`);}
    });
    await check('Four selections provide exclusive state and distinct feedback',()=>{
      const cards=[...doc.querySelectorAll('[data-preference]')],messages=new Set();
      for(const card of cards){card.click();messages.add(el('preference-text').textContent);assert(cards.filter(c=>c.getAttribute('aria-pressed')==='true').length===1,'Selection is not exclusive');}
      assert(messages.size===4,'Scenario feedback is duplicated');assert(!el('preference-continue').disabled,'Continue was not enabled');
    });
    await check('Selected preference carries through to the globe',async()=>{
      click('preference-continue');await until(()=>doc.querySelector('[data-model="globe"]').dataset.frames,'Globe did not render');
      assert(!el('mood').hidden&&el('mood-name').textContent==='A taste of somewhere','Wrong destination slide or mood');
      const image=win.TravelScenes.inspectFrame('globe');assert(image&&image.error===0&&image.nonBackgroundPixels>500,'Globe pixels missing');
    });
    await check('Surprise me cycles all four moods and updates the 3D scene',async()=>{
      const names=new Set(),hashes=new Set();for(let i=0;i<4;i++){click('surprise-button');await pause(100);names.add(el('mood-name').textContent);hashes.add(win.TravelScenes.inspectFrame('globe').hash);}
      assert(names.size===4&&hashes.size===4,'Mood cycle did not produce four distinct states');
    });
    await check('Inactive scenes stop rendering',async()=>{
      const before=Number(doc.querySelector('[data-model="suitcase"]').dataset.frames);await pause(160);assert(Number(doc.querySelector('[data-model="suitcase"]').dataset.frames)===before,'Hidden suitcase kept rendering');
    });
    await check('Overview, navigation, heading focus and progress agree',()=>{
      click('overview-open');assert(el('slide-overview').open,'Overview did not open');doc.querySelectorAll('.overview-link')[0].click();
      assert(!el('slide-overview').open&&!el('welcome').hidden,'Overview selection failed');assert(doc.activeElement.id==='welcome-heading','Heading focus missing');assert(el('slide-counter').textContent==='Slide 1 of 12','Wrong progress');
      el('welcome-heading').dispatchEvent(new win.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert(!el('welcome').hidden,'End bypassed unanswered questions');
    });
    await check('Boarding pass and all seven questions render, gate navigation and reveal a complete match',async()=>{
      click('overview-open');doc.querySelectorAll('.overview-link')[3].click();
      await until(()=>win.TravelScenes.inspectFrame('journey'),'Shared 3D scene did not render');
      const surface=doc.querySelector('.journey-object');
      surface.dispatchEvent(new win.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await pause(100);
      assert(Number(doc.querySelector('[data-model="journey"]').dataset.pose.split(',')[0])>.05,'Keyboard view did not change');
      surface.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Home',bubbles:true}));await pause(100);
      if(!el('motion-toggle').disabled){
        click('motion-toggle');const box=surface.getBoundingClientRect();
        surface.dispatchEvent(new win.PointerEvent('pointermove',{pointerType:'mouse',clientX:box.right-1,clientY:box.bottom-1,bubbles:true}));await pause(600);
        assert(Number(doc.querySelector('[data-model="journey"]').dataset.pose.split(',')[0])>.1,'Pointer movement did not turn airplane');click('motion-toggle');
      }
      click('start-quiz');click('next-slide');assert(!el('q1').hidden,'Unanswered question was skipped');
      for(let i=1;i<=7;i++){
        const slide=el(`q${i}`);assert(!slide.hidden,`Q${i} not active`);await pause(100);
        const before=win.TravelScenes.inspectFrame('journey');assert(before&&before.error===0&&before.nonBackgroundPixels>150,`Q${i} has no 3D pixels`);
        if(i===2)slide.querySelector('[data-pack]').click();else slide.querySelector('input').click();await pause(100);
        assert(slide.querySelector('input').checked,'Choice not checked');
        assert(win.TravelScenes.inspectFrame('journey').hash!==before.hash,'Answer did not update the 3D scene');
        slide.querySelector('.quiz-next').click();
      }
      assert(!el('match').hidden,'Result did not reveal');assert(el('match-heading').textContent.startsWith('The '),'No personality');
      assert(el('destination-name').textContent.length>5,'No destination');assert(el('sample-day').children.length===3,'No personalized sample day');
      assert(win.TravelScenes.status().renderers.length===7,'Quiz allocated extra WebGL contexts');
    });
    await check('Review preserves choices and edits increase the export revision',()=>{
      const before=JSON.parse(win.sessionStorage.getItem(storageKey));click('review-answers');
      const choices=el('q1').querySelectorAll('input');assert(choices[0].checked,'Saved choice missing');choices[1].click();
      el('q1').querySelector('.return-results').click();const after=JSON.parse(win.sessionStorage.getItem(storageKey));
      assert(after.response_id===before.response_id&&after.revision===before.revision+1,'Revision identity incorrect');
      assert(!el('match').hidden,'Return to results failed');
    });
    for(const [width,height] of [[1280,720],[1440,900],[1920,1080],[768,1024],[390,844]]){
      await check(`Layout at ${width}×${height}`,async()=>{
        frame.width=width;frame.height=height;await pause(180);click('restart-slides');
        for(let i=0;i<12;i++){
          if(i)click('next-slide');await pause(100);
          assert(doc.documentElement.scrollWidth<=win.innerWidth+2,`Slide ${i+1} has horizontal overflow`);
          if(width>=1280)assert(doc.documentElement.scrollHeight<=win.innerHeight+2,`Slide ${i+1} needs desktop vertical scrolling`);
        }
      });
    }
    await check('WebGL context loss shows a fallback and recovery restores rendering',async()=>{
      frame.width=1280;frame.height=720;click('restart-slides');await pause(100);
      const canvas=doc.querySelector('[data-model="suitcase"]'),extension=canvas.getContext('webgl2').getExtension('WEBGL_lose_context');
      assert(extension,'Context-loss extension unavailable; test cannot run');extension.loseContext();
      await until(()=>canvas.dataset.renderer==='unavailable','Fallback did not appear');assert(!canvas.closest('.scene-host').querySelector('.scene-error').hidden,'No fallback message');
      await pause(250);extension.restoreContext();await until(()=>canvas.dataset.renderer==='webgl2','Context did not recover');
    });
    report.textContent+=`\n${passed} passed; ${failed} failed.\n`;
    report.textContent+='Manual checks still required: pointer movement, native keyboard activation/Escape, screen reader, 200% browser zoom, subjective visual quality and offline reload.\n';
    if(failures.length)report.textContent+='Failures: '+failures.join('; ');
  }catch(error){report.textContent+=`\nSETUP FAILED: ${error.message}\n`;}
  finally{if(storageAvailable){if(previousSession===null)sessionStorage.removeItem(storageKey);else sessionStorage.setItem(storageKey,previousSession);}run.disabled=false;}
});

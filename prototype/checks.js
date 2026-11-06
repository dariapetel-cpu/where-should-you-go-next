'use strict';
const frame=document.querySelector('#app'),report=document.querySelector('#report'),run=document.querySelector('#run');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn){for(let i=0;i<150;i++){if(fn())return;await pause(40);}throw Error('Timed out');}
run.addEventListener('click',async()=>{
 run.disabled=true;report.textContent='Running…\n';const key='travel-edit.getaway.prototype.v1';let saved,restore=false,passed=0,failed=0;
 const assert=(v,m)=>{if(!v)throw Error(m);};
 async function check(name,fn){try{await fn();passed++;report.textContent+=`PASS ${name}\n`;}catch(e){failed++;report.textContent+=`FAIL ${name}: ${e.message}\n`;}}
 try{
  const legacyKeys=['travel-edit.quiz.v1','travel-edit.getaway.v2'],legacyValues=legacyKeys.map(k=>sessionStorage.getItem(k));
  saved=sessionStorage.getItem(key);sessionStorage.removeItem(key);restore=true;
  await new Promise(resolve=>{frame.addEventListener('load',resolve,{once:true});frame.src='index.html';});
  await until(()=>frame.contentWindow.GetawayPrototype?.ready);
  const w=frame.contentWindow,d=frame.contentDocument,el=id=>d.getElementById(id),click=id=>el(id).click();
  if(el('motion').getAttribute('aria-pressed')==='true')click('motion');
  await until(()=>w.PrototypeScene.status().frames>0);
  await check('Actual airplane pixels and keyboard pose',async()=>{
   const a=w.PrototypeScene.inspect();assert(a&&a.error===0&&a.nonBackgroundPixels>500,'No GPU pixels');el('scene-control').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await pause(150);assert(w.PrototypeScene.inspect().hash!==a.hash,'Pose unchanged');click('scene-reset');
  });
  await check('Vacation preview does not commit, and forward movement is gated',()=>{
   click('scene-next');assert(!w.GetawayPrototype.state().answers.vacation,'Preview committed');click('vacation-next');assert(w.GetawayPrototype.state().step===0,'Skipped answer');click('select-scene');assert(w.GetawayPrototype.state().answers.vacation==='b','Wrong option ID');click('vacation-next');
  });
  await check('Miniature scene and actual interest selection',async()=>{
   await pause(120);const before=w.PrototypeScene.inspect().hash;el('interests-choices').querySelector('input').click();await pause(150);assert(w.PrototypeScene.inspect().hash!==before,'Marker did not change');assert(w.GetawayPrototype.state().answers.interests==='a','Wrong interest mapping');click('interests-next');
  });
  await check('Suitcase packing activation and result preview',async()=>{
   await pause(120);const before=w.PrototypeScene.inspect().hash;el('pace-choices').querySelector('.drag-handle').click();await pause(150);assert(w.PrototypeScene.inspect().hash!==before,'No packed item');assert(w.GetawayPrototype.state().answers.pace==='a','Pace mapping wrong');click('pace-next');assert(el('result-heading').textContent.length>2,'No destination');assert(el('attractions').children.length===3,'Missing attractions');click('day-2');assert(el('day-place').textContent.length>2,'Missing day 3');
  });
  for(const [width,height] of [[1280,720],[1440,900],[1920,1080],[768,1024],[390,844]])await check(`Layout ${width}×${height}`,async()=>{
   frame.width=width;frame.height=height;await pause(150);
   for(let i=0;i<4;i++){click('overview-open');d.querySelectorAll('[data-go]')[i].click();await pause(120);assert(d.documentElement.scrollWidth<=w.innerWidth+2,`Panel ${i}: horizontal overflow`);if(width>=1280&&i<3)assert(d.documentElement.scrollHeight<=w.innerHeight+2,`Panel ${i}: desktop vertical overflow`);}
  });
  await check('Legacy storage keys remain untouched',()=>{assert(w.GetawayMatch.KEY===key,'Wrong storage namespace');legacyKeys.forEach((k,i)=>assert(sessionStorage.getItem(k)===legacyValues[i],`Changed ${k}`));});
 }catch(e){report.textContent+=`SETUP FAILED: ${e.message}\n`;}
 finally{frame.src='about:blank';if(restore){if(saved===null)sessionStorage.removeItem(key);else sessionStorage.setItem(key,saved);}report.textContent+=`\n${passed} passed; ${failed} failed.\nManual: real touch, screen reader, 200% zoom, source review and Intel MacBook Air frame pacing.`;run.disabled=false;}
});

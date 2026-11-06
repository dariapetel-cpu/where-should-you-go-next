const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../data/quiz-v1.json'),Q=require('../js/quiz-core.js');
const {setup,active}=require('./helpers/dom.cjs');
const fresh=()=>Q.fresh(C,'test-response-00000001');
function fill(indices=[0,0,0,0,0,0,0]){return C.questions.reduce((s,q,i)=>Q.choose(C,s,q.id,q.options[indices[i]].id),fresh());}
function pick(t,i,option=0){const input=t.el(`q${i}`).querySelectorAll('input')[option];input.fire('change');}
function finish(t){t.el('start-quiz').click();for(let i=1;i<=7;i++){pick(t,i);t.el(`q${i}`).querySelector('.quiz-next').click();}}
test('every possible answer set has seven points and the independently computed tie winner',()=>{
  const wins=new Set();let ties=0;
  for(let n=0;n<4**7;n++){
    const digits=Array.from({length:7},(_,i)=>(n>>i*2)&3),state=fill(digits),r=Q.score(C,state);
    const selections=C.questions.map((q,i)=>q.options[digits[i]].profile_id),counts={planner:0,adventurer:0,relaxer:0,food_explorer:0};
    selections.forEach(p=>counts[p]++);
    const tied=Object.keys(counts).filter(p=>counts[p]===Math.max(...Object.values(counts)));
    const deciding=[6,0,4,3,1,2,5].find(i=>tied.includes(selections[i]));
    assert.deepEqual(r.counts,counts);assert.equal(r.profile_id,selections[deciding]);assert.equal(r.deciding,`q${deciding+1}`);assert.equal(Object.values(r.counts).reduce((a,b)=>a+b),7);
    assert.ok(r.reasons.every(text=>C.questions.some(q=>q.options.some(o=>state.answers[q.id]===o.id&&o.text===text&&o.profile_id===r.profile_id))));
    assert.equal(r.day[0],r.profile.mornings[Object.keys(C.profiles).indexOf(selections[3])]);wins.add(r.profile_id);if(tied.length>1)ties++;
  }
  assert.equal(wins.size,4);assert.ok(ties>0);
});
test('revision and export identity are stable on no-op; edits recompute and replay resets',()=>{
  let s=fill();assert.equal(s.revision,8);const a=Q.exportRecord(C,s);
  assert.deepEqual(Q.exportRecord(C,s),a);assert.equal(Q.choose(C,s,'q1',s.answers.q1),s);
  s=Q.choose(C,s,'q1',C.questions[0].options[1].id);assert.equal(s.revision,9);assert.equal(s.response_id,a.response_id);
  assert.notDeepEqual(Q.exportRecord(C,s),a);assert.equal(fresh().revision,1);
  assert.throws(()=>Q.exportRecord(C,fresh()));assert.throws(()=>Q.choose(C,s,'q99','unknown'));
});
test('session validation rejects invalid types, versions, options, reachability and early reveal',()=>{
  const good=fill();assert.deepEqual(Q.recover(C,good),good);
  for(const patch of [{schema_version:2},{revision:true},{revision:1},{response_id:'bad'},{answers:{q1:'wrong'}},{answers:[]},{answers:{q8:'q1o1'}},{motion:'yes'},{revealed:'yes'},{slide:'absent'},{extra:'private'}])assert.throws(()=>Q.recover(C,{...good,...patch}));
  assert.throws(()=>Q.recover(C,{...fresh(),slide:'match'}));assert.throws(()=>Q.recover(C,{...fresh(),revealed:true}));
  assert.throws(()=>Q.recover(C,{...fresh(),slide:'q2'}));assert.equal(Q.canEnter(C,fresh(),4),true);assert.equal(Q.canEnter(C,fresh(),5),false);
});
test('real app gates overview, forward navigation and keyboard shortcuts until answers exist',async()=>{
  const t=setup({quiz:true});await t.loaded();t.el('start-quiz').click();assert.deepEqual(active(t),['q1']);
  assert.equal(t.all('.overview-link')[5].disabled,true);t.el('next-slide').click();assert.deepEqual(active(t),['q1']);assert.match(t.el('journey-notice').textContent,/Choose one/);
  t.key('End',t.el('q1-heading'));assert.deepEqual(active(t),['q1']);
  pick(t,1);t.el('q1').querySelector('.quiz-next').click();assert.deepEqual(active(t),['q2']);
  t.key('ArrowRight',t.el('q2').querySelector('input'));assert.deepEqual(active(t),['q2']);
  t.el('previous-slide').click();assert.equal(t.el('q1').querySelector('input').checked,true);
});
test('full flow reveals personalized results, revises, downloads stable JSON, and confirms replay',async()=>{
  const t=setup({quiz:true});await t.loaded();finish(t);assert.deepEqual(active(t),['match']);
  assert.match(t.el('match-heading').textContent,/The /);assert.ok(t.el('destination-name').textContent.length>5);assert.equal(t.el('sample-day').children.length,3);
  t.el('export-response').click();t.el('export-response').click();assert.equal(t.downloads.length,2);assert.equal(await t.downloads[0].text(),await t.downloads[1].text());
  const original=JSON.parse(await t.downloads[0].text());t.el('review-answers').click();pick(t,1,1);t.el('q1').querySelector('.return-results').click();assert.deepEqual(active(t),['match']);
  t.el('export-response').click();const revised=JSON.parse(await t.downloads[2].text());assert.equal(revised.revision,original.revision+1);assert.equal(revised.response_id,original.response_id);
  t.el('replay-quiz').click();t.el('cancel-replay').click();assert.deepEqual(active(t),['match']);t.el('replay-quiz').click();t.el('confirm-replay').click();assert.deepEqual(active(t),['q1']);
  const record=JSON.parse(t.storage.get('travel-edit.quiz.v1'));assert.equal(record.revision,1);assert.notEqual(record.response_id,original.response_id);assert.deepEqual(record.answers,{});
});
test('reload requires resume, preserves selections and revision; corrupt session offers fresh start',async()=>{
  const first=setup({quiz:true});await first.loaded();first.el('start-quiz').click();pick(first,1);first.el('q1').querySelector('.quiz-next').click();
  const raw=first.storage.get('travel-edit.quiz.v1'),t=setup({quiz:true,stored:raw});await t.loaded();assert.equal(t.el('recovery-dialog').open,true);assert.equal(t.storage.get('travel-edit.quiz.v1'),raw);
  t.el('resume-quiz').click();assert.deepEqual(active(t),['q2']);assert.equal(t.el('q1').querySelector('input').checked,true);assert.equal(JSON.parse(t.storage.get('travel-edit.quiz.v1')).revision,2);
  const bad=setup({quiz:true,stored:'invalid json'});await bad.loaded();assert.equal(bad.el('resume-quiz').hidden,true);bad.el('fresh-quiz').click();assert.deepEqual(active(bad),['q1']);
});
test('storage failure stays usable; fetch failure cannot unlock quiz or overwrite saved state',async()=>{
  const t=setup({quiz:true,storageFails:true});await t.loaded();finish(t);assert.deepEqual(active(t),['match']);assert.match(t.el('journey-notice').textContent,/recovery is unavailable/);
  const bad=setup({quiz:true,fetchFails:true,stored:'keep me'});await bad.loaded();bad.el('start-quiz').click();assert.deepEqual(active(bad),['welcome']);assert.equal(bad.storage.get('travel-edit.quiz.v1'),'keep me');
});

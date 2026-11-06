const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const Q=require('../prototype/matcher.js'),C=require('../prototype/catalog.json');
const {setup,active}=require('./helpers/prototype-dom.cjs');
function answers(chars='bbbbdaa'){return Object.fromEntries(C.questions.map((q,i)=>[q.id,chars[i]]));}
function pick(t,id,i){const input=t.el(`${id}-choices`).querySelectorAll('input')[i];input.fire('change');}
async function initialized(options={}){const t=setup(options);await t.loaded();return t;}
const saved=t=>JSON.parse(t.storage.get(Q.KEY));
test('prototype vocabulary, weights and affinity table exactly match approved PRD 3.1',()=>{
 const prd=fs.readFileSync(require('node:path').join(__dirname,'../PRD.md'),'utf8');
 for(const q of C.questions)assert.ok(prd.includes(`| \`${q.id}\` / ${C.questions.indexOf(q)+4} | ${q.options.join(' | ')} | ${q.weight} |`));
 for(const d of C.destinations)assert.ok(prd.includes(`| \`${d.id}\` | ${d.affinities.join(' | ')} |`));
 assert.equal(C.destinations.length,15);assert.equal(Q.KEY,'travel-edit.getaway.prototype.v1');
});
test('all 16,384 combinations match an independent full-ranking calculation',()=>{
 const winners=new Set();for(let n=0;n<16384;n++){
  const a=Object.fromEntries(C.questions.map((q,i)=>[q.id,'abcd'[(n>>i*2)&3]]));
  const expected=C.destinations.map(d=>{const affinities=C.questions.map((q,i)=>q.id==='budget'&&a[q.id]==='d'?2:d.affinities[i][0].toLowerCase()===a[q.id]?3:d.affinities[i][2].toLowerCase()===a[q.id]?1:0);return {id:d.id,score:affinities.reduce((s,v,i)=>s+v*C.questions[i].weight,0),tuple:[0,6,1,4,2,3,5].map(i=>affinities[i])};}).sort((a,b)=>{if(a.score!==b.score)return b.score-a.score;for(let i=0;i<7;i++)if(a.tuple[i]!==b.tuple[i])return b.tuple[i]-a.tuple[i];return a.id<b.id?-1:1;});
  const actual=Q.rank(C,a);assert.deepEqual(actual.map(r=>[r.id,r.score]),expected.map(r=>[r.id,r.score]));winners.add(actual[0].id);
 }assert.equal(winners.size,15);
});
test('budget flexibility is neutral, reasons cite selected answers and pace changes the three-day outline',()=>{
 const a=answers('baabaaa');a.budget='d';const r=Q.result(C,a);assert.ok(r.ranking.every(d=>d.contributions[4].points===6));assert.ok(r.reasons.every(v=>a[v.question]===v.answer));assert.equal(r.days.length,3);assert.deepEqual(r.days.map(d=>d.place),r.attractions);
 const slow=Q.result(C,{...a,pace:'a'}),activePace=Q.result(C,{...a,pace:'c'});assert.ok(slow.days.every(d=>d.stops.length===2));assert.ok(activePace.days.every(d=>d.stops.length===3&&d.optional.startsWith('Optional')));
 assert.throws(()=>Q.rank(C,{vacation:'a'}));assert.throws(()=>Q.rank(C,{...a,budget:'x'}));
});
test('prototype storage rejects corrupt or incompatible records and preserves no-op revisions',()=>{
 let s=Q.fresh(C);s=Q.choose(C,s,'vacation','b');assert.equal(s.revision,2);assert.equal(Q.choose(C,s,'vacation','b'),s);assert.deepEqual(Q.recover(C,JSON.stringify(s)),s);
 for(const patch of [{version:'legacy'},{step:3},{revision:true},{fixture:{companions:'b'}},{answers:{q1:'q1o2'}},{extra:'private'}])assert.throws(()=>Q.recover(C,JSON.stringify({...s,...patch})));
});
test('previewing a scene does not answer; navigation gates all three questions',async()=>{
 const t=await initialized();assert.deepEqual(active(t),[0]);t.el('scene-next').click();assert.deepEqual(saved(t).answers,{});t.el('vacation-next').click();assert.deepEqual(active(t),[0]);
 t.el('select-scene').click();assert.equal(saved(t).answers.vacation,'b');t.el('vacation-next').click();assert.deepEqual(active(t),[1]);pick(t,'interests',2);t.el('interests-next').click();assert.deepEqual(active(t),[2]);
 t.all('.drag-handle')[1].fire('click',{detail:0});assert.equal(saved(t).answers.pace,'b');t.el('pace-next').click();assert.deepEqual(active(t),[3]);assert.ok(t.el('result-heading').textContent);assert.equal(t.el('attractions').children.length,3);
 t.el('day-2').click();assert.equal(t.el('day-panel').getAttribute('aria-labelledby'),'day-2');t.el('review').click();assert.equal(t.el('vacation-choices').querySelectorAll('input')[1].checked,true);
});
test('fixture answers stay separate from prototype selections; changing them recomputes ranking',async()=>{
 const t=await initialized();pick(t,'vacation',1);t.el('vacation-next').click();pick(t,'interests',0);t.el('interests-next').click();pick(t,'pace',0);t.el('pace-next').click();
 const before=JSON.stringify(saved(t).answers),select=t.el('fixture-controls').querySelectorAll('select')[1];select.value='a';select.fire('change');assert.equal(JSON.stringify(saved(t).answers),before);assert.equal(saved(t).fixture.budget,'a');assert.equal(t.win.GetawayPrototype.ranking().winner.destination.name,t.el('result-heading').textContent);
});
test('prototype resumes its own progress; failed fetch does not change a stored record',async()=>{
 const t=await initialized();pick(t,'vacation',3);t.el('vacation-next').click();const raw=t.storage.get(Q.KEY),r=await initialized({stored:raw});assert.equal(r.el('recovery').open,true);assert.equal(r.storage.get(Q.KEY),raw);r.el('resume').click();assert.deepEqual(active(r),[1]);assert.equal(saved(r).answers.vacation,'d');
 const bad=await initialized({stored:raw,fetchFails:true});assert.equal(bad.storage.get(Q.KEY),raw);assert.match(bad.el('notice').textContent,/catalog could not load/);
});
test('touch-style drag cancellation cannot commit pace; a valid drop commits once',async()=>{
 const t=await initialized();pick(t,'vacation',0);t.el('vacation-next').click();pick(t,'interests',0);t.el('interests-next').click();const grip=t.all('.drag-handle')[2];
 grip.fire('pointerdown',{pointerId:2,clientX:700,clientY:100,button:0});grip.fire('pointermove',{pointerId:2,clientX:250,clientY:200});grip.fire('pointercancel');assert.equal(saved(t).answers.pace,undefined);
 grip.fire('pointerdown',{pointerId:3,clientX:700,clientY:100,button:0});grip.fire('pointermove',{pointerId:3,clientX:250,clientY:200});grip.fire('pointerup',{pointerId:3,clientX:250,clientY:200});grip.fire('click',{detail:1});assert.equal(saved(t).answers.pace,'c');assert.equal(saved(t).revision,4);
});

test('prototype edits and fresh start never touch existing quiz namespaces',async()=>{
 const t=await initialized();t.storage.set('travel-edit.quiz.v1','legacy-sentinel');t.storage.set('travel-edit.getaway.v2','future-sentinel');pick(t,'vacation',2);t.el('fresh').click();
 assert.equal(t.storage.get('travel-edit.quiz.v1'),'legacy-sentinel');assert.equal(t.storage.get('travel-edit.getaway.v2'),'future-sentinel');assert.deepEqual(saved(t).answers,{});
});

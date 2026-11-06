const {test}=require('node:test'),assert=require('node:assert/strict');
const {setup,active}=require('./helpers/dom.cjs');
async function onPacking(){const t=setup({quiz:true});await t.loaded();t.el('start-quiz').click();t.el('q1').querySelector('input').fire('change');t.el('next-slide').click();return t;}
const saved=t=>JSON.parse(t.storage.get('travel-edit.quiz.v1'));
test('all packing shortcuts map to existing option IDs; repeated choice does not increment revision',async()=>{
 const t=await onPacking();assert.deepEqual(active(t),['q2']);
 for(const [i,grip] of t.all('[data-pack]').entries()){
  const before=saved(t).revision;grip.fire('click',{detail:0});assert.equal(saved(t).answers.q2,t.el('q2').querySelectorAll('input')[i].value);assert.equal(saved(t).revision,before+1);
  grip.fire('click',{detail:0});assert.equal(saved(t).revision,before+1);
 }
});
test('packing drag commits once inside the target, moves the entire item, and ignores canceled drops',async()=>{
 const t=await onPacking(),grip=t.all('[data-pack]')[1],slot=grip.closest('.pack-slot');
 const start=()=>grip.fire('pointerdown',{pointerId:1,button:0,clientX:700,clientY:100});
 start();grip.fire('pointermove',{pointerId:1,clientX:200,clientY:200});assert.match(slot.style.transform,/translate/);
 grip.fire('pointerup',{pointerId:1,clientX:200,clientY:200});grip.fire('click',{detail:1});assert.equal(saved(t).answers.q2,'q2o1');assert.equal(saved(t).revision,3);assert.equal(slot.style.transform,'');
 const other=t.all('[data-pack]')[2];other.fire('pointerdown',{pointerId:2,button:0,clientX:700,clientY:100});other.fire('pointermove',{pointerId:2,clientX:800,clientY:400});other.fire('pointerup',{pointerId:2,clientX:800,clientY:400});other.fire('click',{detail:1});assert.equal(saved(t).revision,3);
 start();grip.fire('pointermove',{pointerId:1,clientX:200,clientY:200});grip.fire('pointercancel');assert.equal(saved(t).revision,3);assert.equal(slot.style.transform,'');
 other.fire('click',{detail:0});assert.equal(saved(t).answers.q2,'q2o4');assert.equal(saved(t).revision,4);
});
test('existing progress resumes into sample and accents are removed on other slides',async()=>{
 const t=await onPacking();t.all('[data-pack]')[3].fire('click',{detail:0});const record=saved(t);
 const recovered=setup({quiz:true,stored:JSON.stringify(record)});await recovered.loaded();recovered.el('resume-quiz').click();
 assert.deepEqual(active(recovered),['q2']);assert.equal(recovered.el('q2').querySelectorAll('input')[3].checked,true);assert.equal(saved(recovered).revision,record.revision);
 assert.equal(recovered.doc.documentElement.dataset.sample,'q2');recovered.el('next-slide').click();assert.deepEqual(active(recovered),['q3']);assert.equal(recovered.doc.documentElement.dataset.sample,'');
});

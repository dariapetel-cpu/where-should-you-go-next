/* Pure quiz rules. data/quiz-v1.json is the shared contract for future Python analysis. */
(function(root){
  'use strict';
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  function validAnswers(config,answers){
    return answers && typeof answers==='object' && !Array.isArray(answers) && Object.entries(answers).every(([id,choice])=>config.questions.some(q=>q.id===id && q.options.some(o=>o.id===choice)));
  }
  function complete(config,state){return validAnswers(config,state.answers)&&config.questions.every(q=>own(state.answers,q.id));}
  function fresh(config,id){return {schema_version:config.schema_version,quiz_version:config.quiz_version,response_id:id,revision:1,answers:{},slide:'boarding',revealed:false,motion:true};}
  function choose(config,state,id,choice){
    if(!config.questions.some(q=>q.id===id&&q.options.some(o=>o.id===choice)))throw new Error('Unknown answer');
    if(state.answers[id]===choice)return state;
    return {...state,answers:{...state.answers,[id]:choice},revision:state.revision+1};
  }
  function score(config,state){
    if(!complete(config,state))throw new Error('Complete all seven answers first');
    const counts=Object.fromEntries(Object.keys(config.profiles).map(p=>[p,0]));
    const selected=Object.fromEntries(config.questions.map(q=>[q.id,q.options.find(o=>o.id===state.answers[q.id])]));
    for(const answer of Object.values(selected))counts[answer.profile_id]++;
    const highest=Math.max(...Object.values(counts)),tied=Object.keys(counts).filter(p=>counts[p]===highest);
    const deciding=config.tie_priority.find(q=>tied.includes(selected[q].profile_id));
    const profile_id=selected[deciding].profile_id,profile=config.profiles[profile_id];
    const reasons=config.tie_priority.filter(q=>selected[q].profile_id===profile_id).slice(0,2).map(q=>selected[q].text);
    const morningIndex=Object.keys(config.profiles).indexOf(selected.q4.profile_id);
    return {counts,profile_id,profile,reasons,day:[profile.mornings[morningIndex],...profile.day],tied,deciding};
  }
  function maxSlide(config,state){
    const missing=config.questions.findIndex(q=>!own(state.answers,q.id));
    return missing<0?11:4+missing;
  }
  function canEnter(config,state,index){return Number.isInteger(index)&&index>=0&&index<=maxSlide(config,state);}
  function recover(config,record){
    const ids=['welcome','priorities','mood','boarding',...config.questions.map(q=>q.id),'match'];
    const allowed=['schema_version','quiz_version','response_id','revision','answers','slide','revealed','motion'];
    if(!record||Object.keys(record).some(k=>!allowed.includes(k))||record.schema_version!==config.schema_version||record.quiz_version!==config.quiz_version||typeof record.response_id!=='string'||!/^[-a-zA-Z0-9]{16,80}$/.test(record.response_id)||!Number.isSafeInteger(record.revision)||record.revision<1||!validAnswers(config,record.answers)||record.revision<Object.keys(record.answers).length+1||typeof record.motion!=='boolean'||typeof record.revealed!=='boolean'||!ids.includes(record.slide)||!canEnter(config,record,ids.indexOf(record.slide))||(record.revealed&&!complete(config,record))||(record.slide==='match'&&!record.revealed))throw new Error('Saved quiz is incomplete or incompatible');
    return {...record,answers:{...record.answers}};
  }
  function exportRecord(config,state){
    const result=score(config,state);
    return {schema_version:config.schema_version,quiz_version:config.quiz_version,response_id:state.response_id,revision:state.revision,answers:config.questions.map(q=>({question_id:q.id,option_id:state.answers[q.id]})),counts:result.counts,profile_id:result.profile_id,data_origin:'participant'};
  }
  const api={validAnswers,complete,fresh,choose,score,maxSlide,canEnter,recover,exportRecord};
  root.TravelQuiz=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

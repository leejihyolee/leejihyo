import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,createState,gradeQuestion,resultForScore,submitAnswer,advanceQuestion,scoreState,hydrateState} from '../src/quiz.mjs';

test('the five requested subjects are present and only Antarctica is written response',()=>{
  assert.deepEqual(QUESTIONS.map(q=>q.subject),['물리','화학','지구과학','생명과학','수학']);
  assert.deepEqual(QUESTIONS.filter(q=>q.type==='text').map(q=>q.id),['earth']);
});
test('Antarctica accepts Korean spacing and English capitalization',()=>{
  for(const value of ['남극',' 남극 대륙 ','남극 사막','남극의 사막','Antarctica','ANTARCTIC DESERT']) assert.equal(gradeQuestion(2,value),true,value);
});
test('Antarctica rejects Sahara, Arctic, blank, and answers naming multiple regions',()=>{
  for(const value of ['사하라','북극','남극 또는 사하라','','<script>남극</script>']) assert.equal(gradeQuestion(2,value),false,value);
});
test('each choice question has one correct choice',()=>{
  QUESTIONS.forEach((q,i)=>{if(q.type==='choice')assert.equal(q.choices.filter((_,j)=>gradeQuestion(i,String(j))).length,1);});
});
test('cannot advance or submit empty answers before answering',()=>{
  const s={...createState(),view:'quiz'};
  assert.equal(advanceQuestion(s),s);assert.equal(submitAnswer(s,''),s);assert.equal(submitAnswer(s,'9'),s);
});
test('submitted choices are locked and double submission cannot alter a result',()=>{
  const s=submitAnswer({...createState(),view:'quiz'},'0');
  assert.equal(submitAnswer(s,'1'),s);assert.equal(scoreState(s),0);
});
test('complete five-question run reaches result and grades 5/5',()=>{
  let s={...createState(),view:'quiz'};
  for(let i=0;i<5;i++){s=submitAnswer(s,i===2?'남극 대륙':QUESTIONS[i].correct);s=advanceQuestion(s);}
  assert.equal(s.view,'result');assert.equal(scoreState(s),5);assert.equal(resultForScore(scoreState(s)).title,'서울대 상위 1%');
});
test('every requested score band maps correctly',()=>{
  assert.deepEqual([0,1,2,3,4,5].map(n=>resultForScore(n).title),['서울대...?','서울대 하위 1%','서울대 하위 10%','서울대 평균','서울대 상위 25%','서울대 상위 1%']);
});
test('resume preserves submitted answers and current question',()=>{
  let s=submitAnswer({...createState(),view:'quiz'},'1');s=advanceQuestion(s);
  assert.deepEqual(hydrateState(JSON.stringify(s)),s);
});
test('broken storage, skipped answers, and premature results start safely',()=>{
  for(const value of ['not json',null,JSON.stringify({...createState(),view:'result'}),JSON.stringify({...createState(),view:'quiz',index:3}),JSON.stringify({...createState(),answers:[null,'1',null,null,null]})]) assert.deepEqual(hydrateState(value),createState());
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,createState} from '../src/quiz.mjs';
import {renderResultBody,renderGoldenbellPage} from '../src/end-pages.mjs';

const registration='https://bit.ly/자연대골든벨';
function completedState(score) {
  return {...createState(),view:'result',index:4,answers:QUESTIONS.map((q,i)=>{
    if(i<score)return q.type==='text'?'남극':q.correct;
    return q.type==='text'?'사하라':String((Number(q.correct)+1)%4);
  })};
}

test('every score has a prominent curiosity CTA without revealing the event',()=>{
  const expected=['서울대...?','서울대 하위 1%','서울대 하위 10%','서울대 평균','서울대 상위 25%','서울대 상위 1%'];
  for(let score=0;score<=5;score++){
    const html=renderResultBody(completedState(score));
    assert.ok(html.includes(`<h2>${expected[score]}</h2>`));
    assert.ok(html.indexOf('내 상식 수준 더 알아보러 가기')<html.indexOf('정답과 해설 다시 보기'));
    assert.equal([...html.matchAll(/내 상식 수준 더 알아보러 가기/g)].length,2);
    assert.doesNotMatch(html,/골든벨|참가|신청|11\.18|28동|<svg/);
    assert.match(html,/<details class="result-review">/);
    assert.doesNotMatch(html,/<details class="result-review"[^>]*\bopen\b/);
    assert.equal([...html.matchAll(/data-action="invite"/g)].length,2);
    assert.match(html,/conversion-dock result-conversion-dock/);
  }
});

test('the event page has a separate event identity and directly opens the registration form',()=>{
  const html=renderGoldenbellPage({formUrl:registration});
  assert.match(html,/<main id="main-content" class="golden-page">/);
  assert.doesNotMatch(html,/class="paper|paper-header|paper-footer|상식능력평가/);
  assert.match(html,/<h1[^>]*>자연대<br><span>골든벨<\/span>/);
  assert.equal([...html.matchAll(/href="https:\/\/bit\.ly\/자연대골든벨"/g)].length,3);
  assert.ok(html.indexOf('골든벨 참가 신청하기')<html.indexOf('golden-poster-wrap'));
  assert.match(html,/conversion-dock golden-conversion-dock/);
  assert.match(html,/data-action="back-result"/);
});

test('the redesign retains the supplied event schedule, eligibility, team options, and prizes',()=>{
  const html=renderGoldenbellPage({formUrl:registration});
  for(const fact of ['11월 18일 (수)','18:30 – 20:30','자연과학대학 28동','10/29 (목) – 11/5 (목)','복수전공생','자유전공학부 진입생','서로 다른 학부·과 학생 3명','개인 신청자','애슐리 1인 식사권 3매','교류협력국장 이지효'])assert.ok(html.includes(fact),fact);
  for(let i=1;i<=3;i++)assert.ok(html.includes(`/assets/event-card-${i}.png`));
});

test('the redesigned answer review safely displays arbitrary written answers',()=>{
  const state=completedState(0);
  state.answers[2]='<img src=x onerror=alert(1)>';
  const html=renderResultBody(state);
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!html.includes('<img src=x'));
});

test('an event page cannot be produced with a missing registration link',()=>{
  assert.throws(()=>renderGoldenbellPage(),/registration URL/);
});

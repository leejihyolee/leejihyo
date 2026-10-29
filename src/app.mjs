import { QUESTIONS, STORAGE_KEY, gradeQuestion, resultForScore, createState, scoreState, submitAnswer, advanceQuestion, hydrateState } from './quiz.mjs';

const app = document.querySelector('#app');
const FORM_URL = 'https://bit.ly/자연대골든벨';
const SHARE_URL = '__SITE_ORIGIN__/';
const NUMBERS = ['①', '②', '③', '④'];
let state;
try { state = hydrateState(localStorage.getItem(STORAGE_KEY)); } catch { state = createState(); }
let draft = '';
let toastTimeout;

const escape = s => String(s).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const backArrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H5m6 6-6-6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const linkIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-5-5l4-4a4 4 0 0 1 5 0m2 2 1-1a4 4 0 0 1 5 5l-4 4a4 4 0 0 1-5 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" transform="translate(1 1)"/></svg>';

function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }
function topOfPage() { window.scrollTo({top: 0, behavior: 'instant'}); }
function focusHeading() { requestAnimationFrame(() => document.querySelector('#view-heading')?.focus({preventScroll:true})); }
function update(next, scroll = true) { state = next; draft = ''; save(); render(); if (scroll) topOfPage(); focusHeading(); }
function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('visible');
  clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('visible'), 2800);
}

function shell(body, { type='exam', footer='이 시험지는 전공 지식을 묻지 않습니다.' }={}) {
  return `<main id="main-content" class="paper ${type}">
    <header class="paper-header"><span>2026 상식능력평가</span><span>${type === 'invitation' ? '별지 · 초대장' : '제1교시 · 전공 무관 영역'}</span></header>
    ${body}
    <footer class="paper-footer"><span>${footer}</span><span class="footer-page">${state.view === 'cover' ? '표지' : state.view === 'quiz' ? `${state.index + 1} / 5` : state.view === 'result' ? '성적표' : '초대장'}</span></footer>
  </main><p class="desk-caption">${state.view === 'invite' ? '함께 풀면, 아는 게 더 많아집니다.' : '분명 들어본 내용인데, 막상 고르려면 헷갈립니다.'}</p>`;
}

function cover() {
  return shell(`<section class="cover-body">
    <div class="cover-kicker"><span class="small-square"></span> 검색 없이 도전하는 상식 5문제</div>
    <div class="cover-grid">
      <div class="cover-main">
        <h1 id="view-heading" tabindex="-1">요즘 <span class="underlined">서울대생</span>도<br>못 푼다는<br><span class="title-last">상식 퀴즈<span class="title-dot">.</span></span></h1>
        <p class="cover-description">아는 것과 맞히는 것은<br class="mobile-break"> 조금 다르니까.</p>
        <div class="red-note"><span class="hand-arrow" aria-hidden="true">↳</span> 전공 핑계는 잠시 접어 두세요.</div>
      </div>
      <aside class="cover-answer-sheet" aria-label="출제 분야 다섯 가지">
        <div class="omr-heading">답안지</div>
        <div class="omr-subtitle">상식탐구 영역</div>
        <div class="omr-rows">${QUESTIONS.map((q,i) => `<div class="omr-row"><span>${String(i+1).padStart(2,'0')}</span><span>${q.subject}</span><span class="omr-circle"></span></div>`).join('')}</div>
        <div class="cover-stamp">전공<br>무관</div>
        <p class="omr-note">정답은 다섯 개.<br>자신감은 몇 점?</p>
      </aside>
    </div>
    <div class="exam-specs"><span><strong>05</strong> 문항</span><span><strong>100</strong> 점 만점</span><span>시간 제한 <strong>없음</strong></span></div>
    <div class="cover-bottom">
      <div class="instructions"><h2>수험생 유의사항</h2><p>1. 전공과 관계없이 누구나 응시할 수 있습니다.<br>2. 검색창의 도움은 잠시 접어 두세요.<br>3. 틀려도 다음 문제를 풀 수 있습니다.</p></div>
      <button class="button primary start-button" data-action="start"><span>시험 시작하기</span>${arrow}</button>
    </div>
  </section>`);
}

function sourceLink(q) {
  return `<a class="source-link" href="${q.source.url}" target="_blank" rel="noopener noreferrer">출처 · ${q.source.label} <span aria-hidden="true">↗</span></a>`;
}

function quiz() {
  const q = QUESTIONS[state.index];
  const answer = state.answers[state.index];
  const answered = answer !== null;
  const correct = answered && gradeQuestion(state.index, answer);
  const progress = `<ol class="progress" aria-label="문제 진행 상황">${QUESTIONS.map((item,i) => {
    const done = state.answers[i] !== null;
    return `<li class="${i===state.index ? 'current' : ''} ${done ? 'done' : ''}" ${i===state.index ? 'aria-current="step"' : ''}><span class="progress-number">${done ? '✓' : i+1}</span><span class="progress-name">${item.subject}</span></li>`;
  }).join('')}</ol>`;
  let answers;
  if(q.type === 'choice') {
    answers = `<div class="choices" role="group" aria-labelledby="question-prompt">${q.choices.map((choice,i) => {
      const chosen = answer === String(i);
      const right = answered && q.correct === String(i);
      return `<button type="button" class="choice ${chosen ? 'selected' : ''} ${right ? 'correct-choice' : ''} ${chosen && !correct ? 'wrong-choice' : ''}" data-choice="${i}" aria-pressed="${chosen}" ${answered?'disabled':''}><span class="choice-number">${NUMBERS[i]}</span><span>${choice}</span>${right?'<span class="choice-label">정답</span>':''}${chosen && !correct?'<span class="choice-label">내 답</span>':''}</button>`;
    }).join('')}</div>`;
  } else {
    answers = `<div class="written-answer"><label for="written-answer">답안 작성란</label><div class="written-input-wrap"><input id="written-answer" name="answer" type="text" value="${answered ? escape(answer) : ''}" placeholder="정답을 적어 주세요" maxlength="80" autocomplete="off" spellcheck="false" enterkeyhint="done" ${answered ? 'readonly' : ''} aria-describedby="input-help"><span class="pencil-line" aria-hidden="true"></span></div><p id="input-help">${answered ? '제출한 답안입니다.' : '사막의 이름 또는 지역을 입력해 주세요.'}</p></div>`;
  }
  const feedback = answered ? `<section class="feedback ${correct ? 'is-correct' : 'is-wrong'}" aria-labelledby="feedback-heading"><div class="mark-symbol" aria-hidden="true">${correct ? '○' : '×'}</div><div><h2 id="feedback-heading" tabindex="-1">${correct ? '정답입니다.' : '아쉽지만, 정답은…'}</h2><p class="answer-line">${q.answer}</p><p class="explanation">${q.explanation}</p><p class="takeaway">${q.takeaway}</p>${sourceLink(q)}</div></section>` : '';
  return shell(`${progress}<section class="question-body"><div class="question-meta"><span><b>${String(state.index+1).padStart(2,'0')}</b> ${q.subject}</span><span>${q.type==='text'?'주관식':'객관식'} · 20점</span></div><h1 id="view-heading" class="question-title" tabindex="-1">${q.title}</h1><p id="question-prompt" class="question-prompt">${q.prompt}</p><p class="question-note">※ ${q.note}</p><form id="answer-form">${answers}${feedback}<div class="question-actions"><button type="button" class="text-button" data-action="previous" ${state.index===0?'disabled':''}>${backArrow}<span>이전 문제</span></button>${answered ? `<button type="button" class="button primary" data-action="next"><span>${state.index===4 ? '성적표 확인하기' : '다음 문제'}</span>${arrow}</button>` : '<button id="submit-answer" type="submit" class="button primary" disabled><span>정답 확인</span></button>'}</div></form></section>`);
}

function answerReview() {
  return `<section class="answer-review"><h2>답안 확인 <span>다시 봐도, 그게 정답.</span></h2>${QUESTIONS.map((q,i) => {
    const correct = gradeQuestion(i,state.answers[i]);
    const given = q.type==='choice' ? q.choices[Number(state.answers[i])] : state.answers[i];
    return `<details class="review-item"><summary><span class="review-mark ${correct?'right':'wrong'}">${correct?'○':'×'}</span><span class="review-subject">${q.subject}</span><span class="review-title">${q.shortTitle}</span><span class="expand-icon" aria-hidden="true">+</span></summary><div class="review-detail"><p>내 답: <span>${escape(given)}</span></p><p><strong>정답: ${q.answer}</strong></p><p>${q.explanation}</p>${sourceLink(q)}</div></details>`;
  }).join('')}</section>`;
}

function result() {
  const score = scoreState(state);
  const rank = resultForScore(score);
  return shell(`<section class="result-body"><div class="section-kicker">상식탐구 영역 · 채점 완료</div><div class="result-heading-row"><h1 id="view-heading" tabindex="-1">성적통지표</h1><span class="result-stamp" aria-hidden="true">${rank.stamp}</span></div><div class="score-box"><div class="score-main"><span class="score-label">총점</span><strong>${score*20}</strong><span class="score-total">/ 100</span></div><div class="score-count"><b>${score}</b> / 5문제 정답</div></div><div class="rank-box"><p>당신의 상식 등급은</p><h2>${rank.title}</h2><p class="rank-comment">${rank.comment}</p><small>※ 실제 서울대생 성적 분포와 무관한 재미용 등급입니다.</small></div>${answerReview()}<div class="result-actions"><button class="button primary" data-action="invite"><span>다음 장 넘기기</span>${arrow}</button><button class="button secondary" data-action="share">${linkIcon}<span>친구에게 도전장 보내기</span></button></div><button class="text-button retry-button" data-action="restart">다시 풀어 보기 <span aria-hidden="true">↻</span></button></section>`, {footer:'결과에 대한 이의 신청은… 마음속으로 받겠습니다.'});
}

function invite() {
  return shell(`<section class="invite-body"><button class="text-button invite-back" data-action="back-result">${backArrow}<span>성적표로 돌아가기</span></button><div class="section-kicker">시험 종료 후, 당신에게 도착한 초대장</div><h1 id="view-heading" tabindex="-1">이런 문제,<br>조금 더 풀어 볼래요?</h1><p class="invite-intro">혼자서는 몰랐던 정답도,<br>옆 사람과 함께라면 찾을 수 있으니까.</p><div class="invitation-heading"><span>제43대 자연과학대학 학생회 파람</span><h2>자연대 골든벨<span aria-hidden="true"> 🔔</span></h2><p>“그건 제 전공이 아닌데요?”<br><strong>그래서 옆 사람 데려왔습니다!</strong></p></div><div class="event-grid"><a class="poster-link" href="/assets/goldenbell-poster.jpg" target="_blank" rel="noopener noreferrer"><img class="event-poster" src="/assets/goldenbell-poster.jpg" width="1277" height="1800" alt="자연대 골든벨 포스터. 그건 제 전공이 아닌데요? 그래서 옆 사람 데려왔습니다. 11월 18일, 자연과학대학 28동."><span>포스터 크게 보기 ↗</span></a><div class="event-information"><div class="event-open"><span class="small-square"></span> 2차 참가 신청</div><dl class="event-facts"><div><dt>일시</dt><dd><strong>11월 18일 (수)</strong><br>18:30 – 20:30</dd></div><div><dt>장소</dt><dd>자연과학대학 <strong>28동</strong></dd></div><div><dt>신청</dt><dd>10월 29일 (목) –<br>11월 5일 (목)</dd></div><div><dt>대상</dt><dd>자연과학대학 학부생 및 복수전공생,<br>자유전공학부 진입생</dd></div><div><dt>상품</dt><dd>우승팀에 <strong>애슐리 1인 식사권 3매</strong></dd></div></dl><a class="button primary purple" href="${FORM_URL}" target="_blank" rel="noopener noreferrer"><span>골든벨 참가 신청하기</span>${arrow}</a><p class="application-note">신청 폼이 새 창에서 열립니다.</p></div></div><section class="team-info"><div class="team-heading"><span>혼자 와도 괜찮아요.</span><h2>아는 사람보다,<br>아는 게 다른 사람이 필요한 시간.</h2></div><div class="team-ways"><div><span class="way-number">01</span><h3>팀으로 신청</h3><p>서로 다른 학부·과 학생 <strong>3명</strong>으로 팀을 구성해 주세요. 대표자 1명만 신청 폼을 작성하면 됩니다.</p></div><div><span class="way-number">02</span><h3>개인으로 신청</h3><p>팀원이 없어도 신청할 수 있어요. 운영진이 모아 팀을 편성하며, 신청 폼에서 선호하는 팀원 학과를 선택할 수 있습니다.</p></div></div></section><div class="event-description"><p>각 과에서 배우는 내용부터 흥미로운 잡학, 넌센스 퀴즈까지! 서로 다른 전공의 지식을 더해 함께 정답을 찾아보세요.</p><p>문제별 점수를 합산해 우승팀을 가리고, 동점일 경우 결승전을 진행합니다.</p></div><details class="news-details"><summary>모집·팀 구성 안내 카드뉴스 <span aria-hidden="true">+</span></summary><div class="news-gallery"><a href="/assets/event-card-1.png" target="_blank" rel="noopener noreferrer"><img src="/assets/event-card-1.png" alt="자연대 골든벨 2차 모집 안내 카드뉴스" width="1536" height="2048" loading="lazy"></a><a href="/assets/event-card-2.png" target="_blank" rel="noopener noreferrer"><img src="/assets/event-card-2.png" alt="모집 기간, 참가 대상, 행사 일시와 장소 안내" width="1536" height="2048" loading="lazy"></a><a href="/assets/event-card-3.png" target="_blank" rel="noopener noreferrer"><img src="/assets/event-card-3.png" alt="서로 다른 학과 3인 팀 신청 및 개인 신청 방법 안내" width="1536" height="2048" loading="lazy"></a></div></details><div class="invite-final"><p>내 전공 지식에,<br><strong>옆 사람의 지식을 더해.</strong></p><a class="button primary purple" href="${FORM_URL}" target="_blank" rel="noopener noreferrer"><span>골든벨 참가 신청하기</span>${arrow}</a><button class="text-button" data-action="share">${linkIcon}<span>같이 풀 친구에게 퀴즈 보내기</span></button></div><p class="event-contact">문의: “서울대 자연대 학생회” 카카오톡 채널<br>게시물 담당자: 교류협력국장 이지효</p></section>`, {type:'invitation',footer:'제43대 서울대학교 자연과학대학 학생회 〈파람〉'});
}

function render() {
  document.documentElement.dataset.view = state.view;
  app.innerHTML = state.view==='cover' ? cover() : state.view==='quiz' ? quiz() : state.view==='result' ? result() : invite();
  bindEvents();
}

async function share() {
  const score = scoreState(state);
  const message = `요즘 서울대생도 못 푼다는 상식 퀴즈\n나는 ${score}/5개 맞혔는데, 너는?\n${SHARE_URL}`;
  try {
    if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(message);
    else {
      const textarea = document.createElement('textarea'); textarea.value = message;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.append(textarea); textarea.select();
      const ok = document.execCommand('copy'); textarea.remove(); if(!ok) throw new Error('Copy unavailable');
    }
    toast('점수와 퀴즈 링크를 복사했어요. 친구에게 보내 보세요!');
  } catch { toast('링크 복사가 지원되지 않아요. 브라우저 주소를 복사해 주세요.'); }
}

function bindEvents() {
  app.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    switch(button.dataset.action) {
      case 'start': update({...state, view:'quiz', index:0}); break;
      case 'previous': if(state.index>0) update({...state,index:state.index-1}); break;
      case 'next': update(advanceQuestion(state)); break;
      case 'invite': update({...state,view:'invite'}); break;
      case 'back-result': update({...state,view:'result'}); break;
      case 'restart': update(createState()); break;
      case 'share': share(); break;
    }
  }));
  app.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    draft = button.dataset.choice;
    app.querySelectorAll('[data-choice]').forEach(choice => {
      const selected = choice === button; choice.classList.toggle('selected',selected); choice.setAttribute('aria-pressed',String(selected));
    });
    const submit = document.querySelector('#submit-answer'); if(submit) submit.disabled = false;
  }));
  const input = document.querySelector('#written-answer');
  input?.addEventListener('input', () => {
    draft = input.value;
    const submit = document.querySelector('#submit-answer'); if(submit) submit.disabled = !draft.trim();
  });
  document.querySelector('#answer-form')?.addEventListener('submit', e => {
    e.preventDefault();
    if(state.answers[state.index] !== null) return;
    const submitted = submitAnswer(state, draft);
    if(submitted === state) return;
    state = submitted; draft = ''; save(); render();
    requestAnimationFrame(() => {
      const heading = document.querySelector('#feedback-heading'); heading?.focus({preventScroll:true});
      document.querySelector('.feedback')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
    });
  });
}

render();

import { QUESTIONS, STORAGE_KEY, gradeQuestion, createState, scoreState, submitAnswer, advanceQuestion, hydrateState } from './quiz.mjs';
import { renderResultBody, renderGoldenbellPage } from './end-pages.mjs';

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

function result() {
  return shell(renderResultBody(state,{arrow,linkIcon}), {footer:'결과에 대한 이의 신청은… 마음속으로 받겠습니다.'});
}

function invite() {
  return renderGoldenbellPage({formUrl:FORM_URL,arrow,backArrow,linkIcon});
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

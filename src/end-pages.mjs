import {QUESTIONS, gradeQuestion, resultForScore, scoreState} from './quiz.mjs';

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const bell = '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none"><path d="M12 21c0-9 5-14 12-14s12 5 12 14v8l5 7H7l5-7v-8Z" fill="currentColor"/><path d="M19 41h10M24 3v4" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M18 20c0-5 2-8 5-9" stroke="#fff9c7" stroke-width="3" stroke-linecap="round"/></svg>';

function answerReview(state) {
  return `<details class="result-review"><summary><span>정답과 해설 다시 보기</span><span class="expand-icon" aria-hidden="true">+</span></summary><section class="answer-review" aria-label="문제별 정답과 해설">${QUESTIONS.map((q,i) => {
    const correct = gradeQuestion(i,state.answers[i]);
    const given = q.type==='choice' ? q.choices[Number(state.answers[i])] : state.answers[i];
    return `<details class="review-item"><summary><span class="review-mark ${correct?'right':'wrong'}">${correct?'○':'×'}</span><span class="review-subject">${q.subject}</span><span class="review-title">${q.shortTitle}</span><span class="expand-icon" aria-hidden="true">+</span></summary><div class="review-detail"><p>내 답: <span>${escape(given)}</span></p><p><strong>정답: ${q.answer}</strong></p><p>${q.explanation}</p><a class="source-link" href="${q.source.url}" target="_blank" rel="noopener noreferrer">출처 · ${q.source.label} ↗</a></div></details>`;
  }).join('')}</section></details>`;
}

export function renderResultBody(state, {arrow='',linkIcon=''}={}) {
  const score = scoreState(state);
  const rank = resultForScore(score);
  return `<section class="result-body">
    <div class="section-kicker">상식탐구 영역 · 채점 완료</div>
    <div class="result-heading-row"><h1 id="view-heading" tabindex="-1">성적통지표</h1><span class="result-stamp" aria-hidden="true">${rank.stamp}</span></div>
    <div class="score-box"><div class="score-main"><span class="score-label">총점</span><strong>${score*20}</strong><span class="score-total">/ 100</span></div><div class="score-count"><b>${score}</b> / 5문제 정답</div></div>
    <div class="rank-box"><p>당신의 상식 등급은</p><h2>${rank.title}</h2><p class="rank-comment">${rank.comment}</p><small>※ 실제 서울대생 성적 분포와 무관한 재미용 등급입니다.</small></div>
    <section class="result-invitation" aria-label="자연대 골든벨 참가 안내">
      <span class="result-invitation-label">혼자 푸는 건 여기까지!</span>
      <h2>이제, 옆 사람과<br class="result-cta-break"> 골든벨에 도전해 볼래요?</h2>
      <p>서로 다른 과 3명이 한 팀으로.<br>팀원이 없어도 개인 신청 가능!</p>
      <button class="gold-button result-event-button" data-action="invite">${bell}<span>골든벨 참가하러 가기</span>${arrow}</button>
      <span class="result-event-caption">11.18 (수) · 자연과학대학 28동</span>
    </section>
    ${answerReview(state)}
    <div class="result-secondary-actions"><button class="button secondary" data-action="share">${linkIcon}<span>친구에게 도전장 보내기</span></button><button class="text-button" data-action="restart">다시 풀어 보기 <span aria-hidden="true">↻</span></button></div>
    <aside class="conversion-dock result-conversion-dock" aria-label="골든벨 참가 안내로 이동"><div class="dock-copy"><strong>이 실력, 골든벨에서도!</strong><span>팀 없이도 개인 신청 가능</span></div><button class="gold-button" data-action="invite"><span>골든벨 참가하러 가기</span>${arrow}</button></aside>
  </section>`;
}

export function renderGoldenbellPage({formUrl, arrow='',backArrow='',linkIcon=''}={}) {
  if(!formUrl) throw new Error('The registration URL is required.');
  const url = escape(formUrl);
  const applyButton = (label='골든벨 참가 신청하기',extra='') => `<a class="gold-button ${extra}" href="${url}" target="_blank" rel="noopener noreferrer"><span>${label}</span>${arrow}</a>`;
  return `<main id="main-content" class="golden-page">
    <header class="golden-nav"><a class="golden-brand" href="#golden-top">${bell}<span>자연대 골든벨</span></a><button class="golden-back" data-action="back-result">${backArrow}<span>내 성적표</span></button></header>
    <section id="golden-top" class="golden-hero">
      <div class="golden-hero-copy">
        <span class="golden-eyebrow">2026 서울대학교 자연과학대학</span>
        <h1 id="view-heading" tabindex="-1">자연대<br><span>골든벨</span><span class="golden-title-bell">${bell}</span></h1>
        <p class="golden-slogan">“그건 제 전공이 아닌데요?”<br><strong>그래서 옆 사람 데려왔습니다!</strong></p>
        <p class="golden-lead">각자의 전공을 더해서, 함께 정답을 찾는 시간.<br>이번엔 옆 사람과 같이 도전해 보세요.</p>
        <div class="golden-hero-meta"><span><b>11.18</b> 수요일</span><span>18:30 – 20:30</span><span>자연대 28동</span></div>
        ${applyButton()}
        <p class="golden-hero-note">개인 신청도 가능해요 · 신청 마감 11/5 (목)</p>
      </div>
      <div class="golden-poster-wrap"><div class="golden-prize"><span>우승팀 상품</span><strong>애슐리 식사권 3매</strong></div><a class="golden-poster-link" href="/assets/goldenbell-poster.jpg" target="_blank" rel="noopener noreferrer"><img src="/assets/goldenbell-poster.jpg" width="1277" height="1800" alt="자연대 골든벨 포스터. 그건 제 전공이 아닌데요? 그래서 옆 사람 데려왔습니다."><span>포스터 크게 보기 ↗</span></a></div>
    </section>
    <div class="golden-ribbon"><span>전공 지식</span><b>+</b><span>흥미로운 잡학</span><b>+</b><span>넌센스 퀴즈</span><b>=</b><strong>함께 울리는 골든벨!</strong></div>
    <section class="golden-info" aria-labelledby="golden-info-heading">
      <div class="golden-section-heading"><span>같이 도전할 사람, 여기 모여요.</span><h2 id="golden-info-heading">전공은 달라도,<br>정답은 함께.</h2><p>혼자서는 몰랐던 문제도 누군가는 알고 있을 거예요.<br>내 지식에 옆 사람의 지식을 더해 보세요.</p></div>
      <dl class="golden-facts"><div><dt>언제</dt><dd><strong>11월 18일 (수)</strong><span>18:30 – 20:30</span></dd></div><div><dt>어디서</dt><dd><strong>자연과학대학 28동</strong><span>서로 다른 학과 학생들과 함께</span></dd></div><div><dt>신청 기간</dt><dd><strong>10/29 (목) – 11/5 (목)</strong><span>2차 참가자 모집</span></dd></div></dl>
      <div class="golden-eligibility"><span>참가 대상</span><p>자연과학대학 학부생 및 복수전공생,<br class="golden-mobile-break"> 자유전공학부 진입생</p></div>
      <div class="golden-team-heading"><h3>팀원이 없어도 괜찮아요.</h3><p>함께 오거나, 여기서 만나거나.</p></div>
      <div class="golden-team-options"><article><span class="golden-team-number">01</span><h3>팀으로 신청할게요</h3><p><strong>서로 다른 학부·과 학생 3명</strong>으로 팀을 구성해 주세요. 대표자 1명만 신청 폼을 작성하면 됩니다.</p><span class="golden-team-tag">각기 다른 과 · 3인 1조</span></article><article><span class="golden-team-number">02</span><h3>혼자 신청할게요</h3><p>개인 신청자는 <strong>운영진이 모아 팀을 편성</strong>해드려요. 신청 폼에서 선호하는 팀원 학과도 선택할 수 있어요.</p><span class="golden-team-tag">개인 신청 가능 · 운영진 팀 매칭</span></article></div>
      <div class="golden-rules"><span class="golden-rules-bell">${bell}</span><div><h3>우승팀에게 애슐리 1인 식사권 3매!</h3><p>문제별 점수를 합산해 우승팀을 가리고,<br class="golden-mobile-break"> 동점일 경우 결승전을 진행합니다.</p></div></div>
      <details class="golden-news"><summary>모집·팀 구성 안내 자세히 보기 <span aria-hidden="true">+</span></summary><div class="golden-news-gallery">${[1,2,3].map((n)=>`<a href="/assets/event-card-${n}.png" target="_blank" rel="noopener noreferrer"><img src="/assets/event-card-${n}.png" width="1536" height="2048" alt="자연대 골든벨 모집 및 팀 구성 안내 카드뉴스 ${n}" loading="lazy"></a>`).join('')}</div></details>
    </section>
    <section class="golden-finale"><span class="golden-finale-bell">${bell}</span><p>그 정답, 혼자만 알고 있기 아깝잖아요.</p><h2>함께 도전하고,<br><span>골든벨을 울려요!</span></h2>${applyButton()}<p class="golden-finale-note">팀 신청 · 개인 신청 모두 같은 폼에서 가능해요.</p><button class="golden-share" data-action="share">${linkIcon}<span>같이 도전할 친구에게 퀴즈 보내기</span></button></section>
    <footer class="golden-footer"><strong>제43대 서울대학교 자연과학대학 학생회 〈파람〉</strong><p>문의: “서울대 자연대 학생회” 카카오톡 채널<br>게시물 담당자: 교류협력국장 이지효</p><button class="golden-back" data-action="back-result">${backArrow}<span>내 성적표 다시 보기</span></button></footer>
    <aside class="conversion-dock golden-conversion-dock" aria-label="골든벨 참가 신청"><div class="dock-copy"><strong>11/5 (목) 신청 마감</strong><span>팀 없이도 개인 신청 가능</span></div>${applyButton()}</aside>
  </main>`;
}

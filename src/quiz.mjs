export const QUESTIONS = Object.freeze([
  {
    id: 'physics', subject: '물리', shortTitle: '냉장고와 방의 온도', type: 'choice',
    title: '냉장고 문을 열어 두면, 방이 시원해질까?',
    prompt: '외부와 열교환이 없는 방에서 냉장고를 켜고 문을 계속 열어 두었다. 충분한 시간이 지나면 방 전체의 평균 온도는 어떻게 될까?',
    note: '냉장고는 계속 작동하며, 전기에너지는 방 밖에서 공급된다고 가정한다.',
    choices: ['내려간다', '올라간다', '변하지 않는다', '냉장고의 크기만으로 결정된다'], correct: '1',
    answer: '올라간다',
    explanation: '냉장고는 안쪽에서 빼앗은 열을 뒤쪽으로 내보낸다. 이때 냉장고를 작동시키는 전기에너지도 결국 열로 바뀌므로, 방 전체로 보면 열이 추가되어 평균 온도가 올라간다.',
    takeaway: '냉장고는 열을 없애는 기계가 아니라, 옮기는 기계다.',
    source: { label: '일리노이대학교 Physics Van', url: 'https://van.physics.illinois.edu/ask/listing/6604' },
  },
  {
    id: 'chemistry', subject: '화학', shortTitle: '수돗물과 비누 거품', type: 'choice',
    title: '같은 비누인데, 수돗물이 바뀌니 거품이 안 난다?',
    prompt: '어느 지역의 수돗물로 손을 씻었더니 비누 거품이 잘 나지 않고 찌꺼기가 생겼다. 이 현상과 가장 관련이 깊은 이온 조합은?',
    note: '일반적인 지방산 염으로 된 비누를 사용했다고 가정한다.',
    choices: ['나트륨 이온·칼륨 이온', '수소 이온·염화 이온', '암모늄 이온·질산 이온', '칼슘 이온·마그네슘 이온'], correct: '3',
    answer: '칼슘 이온·마그네슘 이온',
    explanation: '센물에 들어 있는 칼슘 이온과 마그네슘 이온은 비누 성분과 반응해 물에 잘 녹지 않는 염을 만든다. 비누가 이 반응에 소모되면서 찌꺼기가 생기고, 거품을 내기 위해 더 많은 비누가 필요해진다.',
    takeaway: '거품이 적은 이유가 비누가 아니라, 물에 있을 수도 있다.',
    source: { label: 'IUPAC · Hardness of water', url: 'https://old.iupac.org/didac/Didac%20Eng/Didac03/Content/L13.htm' },
  },
  {
    id: 'earth', subject: '지구과학', shortTitle: '지구상에서 가장 큰 사막', type: 'text',
    title: '지구상에서 가장 큰 사막은?',
    prompt: '지구상에서 면적이 가장 넓은 사막의 이름 또는 그 사막이 있는 지역을 적어 주세요.',
    note: '주관식 문항입니다. 정답을 직접 입력해 주세요.',
    answer: '남극 사막 · 남극 대륙',
    accepted: ['남극', '남극대륙', '남극사막', '남극대륙사막', '남극의사막', '남극대륙의사막', 'antarctica', 'antarctic', 'antarcticdesert', 'theantarcticdesert', '안타르크티카'],
    explanation: '사막은 모래가 많거나 더운 곳만을 뜻하지 않는다. 강수량이 매우 적은 지역을 사막으로 분류하며, 눈과 얼음으로 덮인 남극도 극지 사막에 해당한다. 가장 넓은 사막은 남극이고, 가장 넓은 더운 사막은 사하라다.',
    takeaway: '사막의 핵심은 더위가 아니라, 건조함이다.',
    source: { label: 'British Antarctic Survey', url: 'https://www.bas.ac.uk/about/education-and-schools/antarctic-factsheet/' },
  },
  {
    id: 'biology', subject: '생명과학', shortTitle: '기린의 목뼈', type: 'choice',
    title: '목이 이렇게 긴데, 목뼈는 몇 개일까?',
    prompt: '긴 목으로 유명한 기린. 기린의 목을 이루는 목뼈는 일반적으로 몇 개일까?',
    note: '목뼈는 해부학적으로 경추에 해당하는 뼈를 뜻한다.',
    choices: ['7개', '14개', '21개', '28개'], correct: '0',
    answer: '7개',
    explanation: '기린의 목뼈는 사람과 같은 7개다. 기린의 목이 긴 것은 목뼈의 개수가 많아서가 아니라, 각각의 목뼈가 길게 발달했기 때문이다. 대부분의 포유류도 목뼈가 7개다.',
    takeaway: '기린과 사람, 목의 길이는 달라도 목뼈 수는 같다.',
    source: { label: 'Giraffe Conservation Foundation', url: 'https://giraffeconservation.org/facts-about-giraffe/why-do-giraffe-have-such-a-long-neck/' },
  },
  {
    id: 'math', subject: '수학', shortTitle: '평면 지도의 색깔', type: 'choice',
    title: '세상의 모든 평면 지도, 몇 가지 색이면 될까?',
    prompt: '각 나라가 하나로 이어진 영역인 평면 지도를 칠하려 한다. 경계선을 공유하는 나라끼리 다른 색을 쓸 때, 어떤 지도든 칠할 수 있도록 보장하는 최소 색 수는?',
    note: '한 점에서만 만나는 나라들은 이웃으로 보지 않는다.',
    choices: ['2가지', '3가지', '4가지', '5가지'], correct: '2',
    answer: '4가지',
    explanation: '4색 정리에 따르면 어떤 평면 지도도 이웃한 영역끼리 다른 색을 쓰면서 네 가지 이하의 색으로 칠할 수 있다. 세 가지 색으로는 칠할 수 없는 지도도 있으므로, 모든 지도에 대해 보장되는 최소 색 수는 4다.',
    takeaway: '국가 수가 아무리 많아져도, 네 가지 색이면 충분하다.',
    source: { label: '4색 정리 증명 연구진 · Georgia Tech', url: 'https://thomas.math.gatech.edu/FC/fourcolor.html' },
  },
]);

export const STORAGE_KEY = 'common-sense-exam-2026-v1';

export function normalizeText(value) {
  return String(value ?? '').normalize('NFKC').toLowerCase().trim().replace(/[\s·.,!?。！？，\-_:;()[\]{}'"‘’“”]/gu, '');
}

export function gradeQuestion(index, value) {
  const q = QUESTIONS[index];
  if (!q || value === null || value === undefined) return false;
  return q.type === 'text' ? q.accepted.includes(normalizeText(value)) : String(value) === q.correct;
}

export function resultForScore(score) {
  if (score === 5) return { title: '서울대 상위 10%', comment: '이 정도면 찍은 것도 실력입니다.', stamp: '수' };
  if (score === 4) return { title: '서울대생 평균', comment: '한 문제는 인간미로 남겨 두었습니다.', stamp: '우' };
  if (score >= 2) return { title: '서울대 하위 10%', comment: '잠깐, 이건 제 전공이 아닌데요.', stamp: '미' };
  return { title: '서울대...?', comment: '오늘 컨디션이 조금… 그랬던 걸로 합시다.', stamp: '음?' };
}

export function createState() {
  return { version: 1, view: 'cover', index: 0, answers: Array(QUESTIONS.length).fill(null) };
}

export function scoreState(state) {
  return QUESTIONS.reduce((score, _, index) => score + Number(gradeQuestion(index, state.answers[index])), 0);
}

export function submitAnswer(state, value) {
  if (state.view !== 'quiz' || state.answers[state.index] !== null) return state;
  const q = QUESTIONS[state.index];
  const text = String(value ?? '').trim();
  if (!text || text.length > 80 || (q.type === 'choice' && !/^[0-3]$/.test(text))) return state;
  const next = { ...state, answers: [...state.answers] };
  next.answers[state.index] = text;
  return next;
}

export function advanceQuestion(state) {
  if (state.view !== 'quiz' || state.answers[state.index] === null) return state;
  return state.index === QUESTIONS.length - 1
    ? { ...state, view: 'result' }
    : { ...state, index: state.index + 1 };
}

export function hydrateState(raw) {
  try {
    const candidate = JSON.parse(raw);
    if (!candidate || candidate.version !== 1 || !['cover', 'quiz', 'result', 'invite'].includes(candidate.view)) return createState();
    if (!Number.isInteger(candidate.index) || candidate.index < 0 || candidate.index >= QUESTIONS.length || !Array.isArray(candidate.answers) || candidate.answers.length !== QUESTIONS.length) return createState();
    let sawBlank = false;
    for (let i = 0; i < QUESTIONS.length; i++) {
      const value = candidate.answers[i];
      if (value === null) { sawBlank = true; continue; }
      if (sawBlank || typeof value !== 'string' || !value.trim() || value.length > 80 || (QUESTIONS[i].type === 'choice' && !/^[0-3]$/.test(value))) return createState();
    }
    if (['result', 'invite'].includes(candidate.view) && candidate.answers.some(a => a === null)) return createState();
    if (candidate.view === 'quiz' && candidate.answers.slice(0, candidate.index).some(a => a === null)) return createState();
    return { version: 1, view: candidate.view, index: candidate.index, answers: [...candidate.answers] };
  } catch { return createState(); }
}

# 상식 퀴즈 — Vercel 배포용

다섯 문제, 자동채점, 성적표, 자연대 골든벨 안내와 신청 링크가 포함된 정적 웹사이트입니다. 사이트 자체에는 방문자 로그인 기능이 없습니다.

## 빠른 배포: Vercel CLI

1. 이 압축파일을 해제합니다.
2. Node.js가 설치된 컴퓨터에서 `package.json`이 있는 폴더를 터미널로 엽니다.
3. 다음 명령을 실행합니다.

```sh
npx vercel --prod
```

처음에는 사이트를 관리할 Vercel 계정으로 로그인합니다. 프로젝트를 새로 만들고 현재 폴더를 선택하면 됩니다. 빌드 명령과 결과 폴더는 `vercel.json`에 설정되어 있습니다.

배포가 완료되면 프로젝트의 **Production 도메인**을 공유합니다. 예시는 `your-project.vercel.app`이며 실제 주소는 배포 후 정해집니다.

## 웹 화면으로 배포: GitHub 연결

1. 이 폴더의 파일을 본인 GitHub 저장소에 업로드합니다. `package.json`과 `vercel.json`이 저장소의 최상위에 있도록 합니다.
2. Vercel에서 **Add New → Project**를 열고 해당 저장소를 선택합니다.
3. Framework Preset은 **Other**를 선택합니다. 별도로 지정해야 한다면 Build Command는 `node scripts/build.mjs`, Output Directory는 `public`입니다.
4. **Deploy**를 누릅니다.

## 로그인 없이 열리는지 확인

- 테스트용 Preview URL 대신 프로젝트의 Production 도메인을 사용합니다.
- 방문자에게 Vercel 로그인이 표시되면 프로젝트 **Settings → Deployment Protection**에서 해당 Production 주소가 인증으로 보호되고 있는지 확인합니다. 공개용 Production 주소에는 Vercel Authentication을 적용하지 않습니다.
- 시크릿 창과 카카오톡에서 링크를 열어 퀴즈가 바로 시작되는지 확인합니다.
- 카카오톡 제목은 **요즘 서울대생도 못 푼다는 상식 퀴즈**로 지정되어 있습니다.

## 주소와 링크 미리보기

빌드할 때 Vercel의 `VERCEL_PROJECT_PRODUCTION_URL`을 사용해 공유 미리보기와 결과 공유 링크의 주소를 자동으로 맞춥니다. 테스트용 배포에서는 `VERCEL_URL`을 최후의 대안으로 사용합니다.

커스텀 도메인을 확실히 지정하려면 Vercel 환경변수 `PUBLIC_SITE_URL`에 사이트 주소를 넣고 다시 배포합니다. 예: `https://quiz.example.com`.

기존 주소가 카카오톡 미리보기에 남아 있으면 카카오 개발자 도구의 URL 메타정보 관리에서 미리보기 정보를 갱신한 후 다시 확인합니다.

## 수정과 검증

- 문제·정답·해설: `src/quiz.mjs`
- 화면과 행사 정보: `src/app.mjs`
- 시험지 디자인: `src/style.css`
- 공유 미리보기 설정: `src/index.html`
- 포스터·카드뉴스·공유 이미지: `src/assets/`

```sh
npm test
```

로컬 빌드 검증은 아래처럼 사이트 주소를 지정해 실행합니다.

```sh
PUBLIC_SITE_URL=https://quiz.example.com npm run build
```

Vercel에는 아직 배포되지 않은 배포 준비 파일입니다. 실제 사이트 주소와 로그인 없는 공개 접속은 계정에서 배포한 후 확인해야 합니다.

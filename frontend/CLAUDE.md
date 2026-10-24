# CLAUDE.md — frontend

루트 `CLAUDE.md`의 원칙(미결 사항, 개인정보 처리, 판단 근거 표시)을 먼저 따른다.

## 스택

React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 7(`createBrowserRouter` 배열 라우팅),
TanStack Query 5(서버 상태), Zustand 5(클라이언트 UI 상태만), Axios, zod(LLM 출력 검증, 설치 예정)

버전별 주의 (예제·자료가 이전 버전 기준인 경우가 많다):

- **Tailwind 4:** `tailwind.config.js`를 만들지 않는다. 테마 색상·폰트는 CSS의 `@theme`에 정의하고, Vite 플러그인(`@tailwindcss/vite`)으로 연결한다.
- **React 19:** `forwardRef` 없이 `ref`를 일반 prop으로 받는다. `propTypes`·`defaultProps`는 쓰지 않는다.
- **React Router 7:** 라우터 정의 방식은 v6 데이터 라우터와 같다. 프레임워크 모드(파일 기반 라우팅, `react-router.config.ts`)는 쓰지 않는다.

## 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run lint     # ESLint
npm run build    # 타입 체크 + 빌드
```

작업을 마치면 `npm run lint && npm run build`가 통과해야 한다.

## 폴더 구조 (보일러플레이트 기준)

```
src/
├── api/          Axios 인스턴스·인터셉터, 기능별 API 함수 (materials.api.ts 등)
├── components/   공통 UI, 레이아웃(Header·GNB·Footer), AsyncBoundary, Chatbot
├── constants/    메뉴 구성, 라벨 매핑 등 상수
├── hooks/        공통 커스텀 훅
├── mocks/        백엔드 없이 개발할 때 쓰는 샘플 데이터
├── pages/        페이지. 페이지 전용 컴포넌트는 pages/<페이지>/components/ 에 둔다
├── router/       라우트 정의, 로그인 가드
├── store/        Zustand 스토어 (인증 세션 등)
├── styles/       전역 CSS, Tailwind 설정 연동
├── types/        타입 정의. 백엔드 DTO와 같은 모양으로 맞춘다
└── utils/        conversation/(대화 파싱·필터·마스킹), layout/(배치 JSON 스키마·렌더러) 등
```

- import는 `@/` 절대경로를 쓰고, 공통 컴포넌트는 배럴(`index.ts`)로 내보낸다.
- 서버 데이터는 React Query로만 다루고 Zustand에 복사하지 않는다.
- 로딩·에러 처리는 `useSuspenseQuery` + `AsyncBoundary`로 한다.

## 백엔드 연동

- 환경변수: `VITE_API_BASE_URL`, `VITE_USE_MOCK`
- `VITE_USE_MOCK=true`면 API 함수가 `mocks/` 데이터를 반환한다. 백엔드가 준비된 API부터 하나씩 실제 호출로 바꾼다.
- 백엔드 공통 응답 형식: `{ success: boolean, message: string, data: T }`

## 주요 화면 (GNB 5개 + 드롭다운)

- 학습자료: 내 학습자료(목록), 자료 업로드, 자료 상세(탭: 요약 / 핵심 개념 / 퀴즈 / AI 요약 영상-준비 중)
- 맞춤학습: 맞춤 커리큘럼(단계별 "이 순서인 이유" 표시), 퀴즈(목록·풀기·결과)
- 학습분석: 학습 대시보드(배치 JSON 기반), AI 대화 가져오기
- 커뮤니티: 공지사항
- 이용안내: 서비스 소개, 개인정보처리방침
- 그 외: 메인, 로그인, 회원가입(비밀번호 4조건 실시간 표시, AI 대화 분석은 선택 동의), 마이페이지(동의 철회·데이터 삭제), 검색

## AI 대화 가져오기 (브라우저 처리)

- `utils/conversation/`: ChatGPT·Claude `conversations.json` 파서, 키워드 매칭, 정규식 마스킹(이메일·전화번호·주민번호·카드번호·키·IP)
- 내보내기 형식은 바뀔 수 있으므로 실제 파일로 검증하고, 파싱 실패 시 무엇이 잘못됐는지 알려 준다.
- 서버에는 사용자가 체크한 대화만 마스킹된 상태로 보낸다.

## 대시보드 동적 배치

- 배치 JSON은 `unknown`으로 받아 zod 스키마로 검증한 뒤에만 사용한다.
- 허용 컴포넌트 ID 목록에 없는 값, 중복 배치, 지나치게 긴 이유 문자열은 검증에서 거른다.
- 각 영역에 "왜 여기에 있나요?"로 배치 이유를 보여 준다.

## 디자인 (기관형 LMS 톤, 시안 v1 확정)

시안: Claude 디자인 캔버스 "AI LMS 디자인 시안"(메인, 학습 대시보드). 대회 심사에 디자인 배점이 없으므로 겉틀은 단순하게 두고, AI가 보이는 화면에 공을 들인다.

- 흰 상단바(왼쪽 로고, 오른쪽 로그인|회원가입|마이페이지 + 검색) → 짙은 네이비 GNB(가운데 정렬, 호버 드롭다운)
- 메인: 자동 전환 히어로는 쓰지 않는다. 첫 화면에 진입 카드 2개(학습 자료로 시작 / AI 대화로 시작) → "AI LEARNING HUB" 3단계 연하늘 카드 + 알약형 CTA → 개인정보 안내 띠("원본 대화 파일은 서버로 보내지 않아요") → 공지사항 표 → 회청색 푸터
- 서브페이지: 가운데 큰 제목·부제, 오른쪽 `HOME > 경로`, 게시판 표는 네이비 상단선 2px, 폼은 회색 라벨 칸 표

### 색 규칙

Tailwind 4 `@theme`에 아래 이름으로 등록한다(`src/index.css`). Tailwind 기본 팔레트(`blue-600` 등)를 덮어쓰지 않도록 의미 기반 이름을 쓴다.

| 토큰                                       | 값                                            | 쓰는 곳                                  |
| ------------------------------------------ | --------------------------------------------- | ---------------------------------------- |
| `brand` / `on-brand`                       | `#0d1b57` / `#ffffff`                         | GNB·로고 바탕과 그 위 글자               |
| `heading`                                  | `#0d1b57`                                     | 페이지 제목, 카드 제목                   |
| `heading-soft`                             | `#1f3a8a`                                     | 섹션 제목, 표 상단선, 보조 링크          |
| `primary` / `on-primary` / `primary-hover` | `#2b67d1` / `#ffffff` / `#1f3a8a`             | 모든 버튼, 선택된 메뉴, 숙련도 점수 막대 |
| `primary-soft`                             | `#e8effc`                                     | 카드·섹션 배경                           |
| `primary-pill`                             | `#cddcf7`                                     | 알약형 보조 버튼                         |
| `footer`                                   | `#a7b2c5`                                     | 푸터 배경 (글자는 `heading`)             |
| `ai` / `ai-soft` / `ai-border` / `ai-chip` | `#86198f` / `#fbf4fe` / `#e9b8f5` / `#f5e1fb` | AI가 만든 콘텐츠만                       |
| `strength` / `strength-soft`               | `#166534` / `#dcfce7`                         | 강점 표시                                |
| `weakness` / `weakness-soft`               | `#9a3412` / `#ffedd5`                         | 보완 필요 표시                           |
| `danger`                                   | `#b91c1c`                                     | 오류 메시지만                            |

- **블루 = 코드가 계산한 값과 일반 UI, 퍼플(`ai`) = AI가 만든 것.** 판단 근거 투명성 원칙을 색으로 보여 주는 장치이므로 예외 없이 지킨다.
  - `ai` 색: AI 설명, 판단 근거 요약, AI 추천 학습 순서와 "이 순서인 이유", 챗봇 답변, 대시보드 "왜 여기에 있나요?"
  - 버튼은 AI 기능을 실행하더라도 항상 `primary`. 필요하면 아이콘만 `ai`로 붙인다.
  - 숙련도 점수·그래프는 코드가 계산한 값이므로 `primary`. `ai`로 칠하지 않는다.
- **색만으로 의미를 전달하지 않는다.** AI 요소에는 반짝이 아이콘과 "AI" 글자를, 강점에는 체크 아이콘과 "강점", 보완 필요에는 느낌표 아이콘과 "보완 필요"를 항상 함께 붙인다. AI 요소가 있는 화면에는 "이 표시가 있는 내용은 AI가 작성했어요" 안내를 둔다.
- 약점에는 빨강을 쓰지 않는다(적록색약, "실패" 느낌). 빨강(`danger`)은 파싱 실패·입력 오류 같은 오류에만 쓴다.
- **컴포넌트에 색 코드(`text-[#…]`, `bg-white`, `text-white`)를 직접 쓰지 않는다.** 바탕·글자·구분선도 `surface`, `ink`, `line` 계열 토큰만 쓴다. 버튼 글자는 `on-primary`, GNB 글자는 `on-brand`.
- **다크모드:** 표의 값은 밝은 모드 기준이고, 어두운 값은 `src/index.css`의 `:root.dark`에서 같은 토큰을 다시 정의한다. 컴포넌트에 `dark:` 클래스를 붙이지 않는다. 새 토큰을 추가하면 어두운 값도 함께 넣고, 글자·바탕 쌍의 대비 4.5:1을 확인한다. 모드는 상단바의 화면 모드 버튼(기기 설정 / 밝게 / 어둡게, `useThemeStore`)으로 바꾸고, 기본값은 기기 설정을 따른다.
- 페이지 본문 폭은 `max-w-page`(1200px), 자주 쓰는 글자 크기는 `text-body`(15px)·`text-caption`(13px)·`text-display`(40px) 토큰을 쓴다.

- 폰트: Pretendard (대체: Noto Sans KR, 시스템 폰트)
- 접근성: 키보드 포커스 표시, 이미지·아이콘 대체 텍스트, 글자 대비 4.5:1 이상, 애니메이션은 `prefers-reduced-motion`을 따른다

## 문구 규칙

- 사용자 관점의 쉬운 말. 버튼은 실제 동작을 쓴다("자료 올리기", "선택한 대화 3개 보내기").
- 오류는 무엇이 잘못됐고 어떻게 고치는지 쓴다. 빈 화면에는 다음 행동을 안내한다.

# CLAUDE.md — frontend

루트 `CLAUDE.md`의 원칙(미결 사항, 개인정보 처리, 판단 근거 표시)을 먼저 따른다.

## 스택

React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 7(`createBrowserRouter` 배열 라우팅),
TanStack Query 5(서버 상태), Zustand 5(클라이언트 UI 상태만), Axios, zod(LLM 출력 검증, 설치 예정), Motion(`motion` 패키지, 움직임)

버전별 주의 (예제·자료가 이전 버전 기준인 경우가 많다):

- **Tailwind 4:** `tailwind.config.js`를 만들지 않는다. 테마 색상·폰트는 CSS의 `@theme`에 정의하고, Vite 플러그인(`@tailwindcss/vite`)으로 연결한다.
- **React 19:** `forwardRef` 없이 `ref`를 일반 prop으로 받는다. `propTypes`·`defaultProps`는 쓰지 않는다.
- **React Router 7:** 라우터 정의 방식은 v6 데이터 라우터와 같다. 프레임워크 모드(파일 기반 라우팅, `react-router.config.ts`)는 쓰지 않는다.

## 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run lint     # ESLint
npm test         # Vitest (src/**/*.test.ts)
npm run build    # 타입 체크 + 빌드
```

작업을 마치면 `npm run lint && npm test && npm run build`가 통과해야 한다.
테스트는 화면이 아니라 틀리면 안 되는 로직(대화 파싱·마스킹, 점수 계산, API 응답 처리)에 쓴다.

## 폴더 구조 (보일러플레이트 기준)

```
src/
├── api/          Axios 인스턴스·인터셉터, 기능별 API 함수 (materials.api.ts 등)
├── components/   공통 UI, 레이아웃(Header·GNB·Footer), AsyncBoundary, Chatbot
├── constants/    메뉴 구성, 라벨 매핑 등 상수
├── hooks/        공통 커스텀 훅
├── mocks/        백엔드 없이 개발할 때 쓰는 샘플 데이터
├── pages/        페이지(default export). 페이지 전용 컴포넌트는 pages/<페이지>/components/ 에 둔다
├── router/       라우트 정의, 로그인 가드
├── store/        Zustand 스토어 (인증 세션 등)
├── styles/       전역 CSS, Tailwind 설정 연동
├── types/        타입 정의. 백엔드 DTO와 같은 모양으로 맞춘다
└── utils/        conversation/(대화 파싱·필터·마스킹), layout/(배치 JSON 스키마·렌더러) 등
```

- import는 `@/` 절대경로를 쓰고, 공통 컴포넌트는 배럴(`index.ts`)로 내보낸다.
- 화면을 만들 때 공통 부품을 먼저 쓴다: 버튼 `Button`, 흰 카드 `Card`, 작은 알약 `Chip`, 점수·비중 막대 `ScoreBar`, 입력칸 `TextInput`·`SelectInput`(그 밖의 칸 모양은 `FIELD_CLASS`), 폼 줄과 오류 문구 `FormRow`(`error`), AI 글 `AiNote`·`AiBadge`, 강점·보완 `LevelBadge`. 같은 클래스 묶음을 세 번째로 쓰게 되면 공통 부품으로 뺀다.
- 서버 데이터는 React Query로만 다루고 Zustand에 복사하지 않는다.
- 로딩·에러 처리는 `useSuspenseQuery` + `AsyncBoundary`로 한다. 불러오는 동안은 `LoadingFallback`(회색 틀 `Skeleton`)이 보인다.
- 페이지는 처음 방문할 때만 코드를 불러온다. `router/index.tsx`에 `lazyPage(() => import('@/pages/...'))`로 추가하고, 페이지 파일은 default export로 만든다(메인·404만 처음부터 불러온다). 여러 페이지를 한 번에 export하는 모음 파일(`pages/index.ts`)은 만들지 않는다. 쪼개지지 않는다.

## 움직임 (Motion)

- 기준값은 `constants/motion.ts`(시간·곡선·`FADE_UP`)와 `index.css`의 `--default-transition-*`에 모아 둔다. 두 곳의 값은 같이 맞춘다. 느낌이 어색하면 이 값만 고친다.
- `main.tsx`에서 `LazyMotion`(필요한 기능만, `strict`)과 `MotionConfig reducedMotion="user"`로 감쌌다. 그래서 컴포넌트에서는 `motion.div` 대신 **`import * as m from 'motion/react-m'`의 `m.div`**를 쓴다. `motion.div`를 쓰면 번들이 커지고 `strict`에서 오류가 난다.
- 나타나고 사라지는 요소(펼침 패널, 말풍선, 결과 문구)는 `AnimatePresence` + `m.*`. 단순한 색·그림자 전환은 CSS(`index.css`가 링크·버튼·입력칸에 기본으로 걸어 둔다)로 충분하다.
- 페이지 전환은 `PageTransition`(본문 페이드인), 코드 불러오는 동안은 `NavigationProgress`(화면 위 진행 막대).
- 화면 모드를 바꿀 때는 **View Transitions**로 이전 화면과 새 화면을 겹쳐 서서히 바꾼다(`useThemeStore`의 `applyTheme`, 시간 350ms·곡선 `cubic-bezier(0.4, 0, 0.2, 1)`, `--theme-transition-*`). 색을 하나씩 섞는 방식(CSS 전환)은 쓰지 않는다: 글자색과 배경색이 서로 반대로 뒤집히는 전환을 색별로 섞으면 중간에 두 밝기가 같아져(대비 1.5~2.5까지 떨어짐) 글자가 잠깐 사라졌다 나타나 컷편집처럼 보였다. 전환하는 동안 `theme-vt` 클래스가 색 토큰·요소 전환을 모두 끈다.
- 연달아 눌러도 선택과 화면이 어긋나지 않도록 `applyTheme`은 `<html>`의 `dark` 클래스 대신 아직 적용되지 않은 최신 목표(`pendingDark`)를 먼저 본다. 이 값을 지우지 않는다.
- View Transitions를 지원하지 않는 브라우저의 폴백: 색 토큰(`--color-*`)을 `src/styles/theme-transition.css`에서 `@property`(`<color>` 타입)로 등록하고 `:root`에서 `transition`을 걸어 토큰을 쓰는 모든 요소가 함께 서서히 따라오게 한다. 그동안 `theme-switching` 클래스(400ms)가 요소별 전환을 꺼서 한 박자씩 늦게 따라오지 않게 한다. "동작 줄이기"를 켠 기기는 두 방식 모두 쓰지 않고 바로 바뀐다.
- **색 토큰을 추가하면 `styles/theme-transition.css`에도 같은 이름을 등록하고 `transition` 목록에 넣는다**(폴백용). 빠뜨려도 오류는 없지만 폴백에서 그 색만 서서히 안 바뀌고 즉시 바뀐다. 이 파일의 색 부분은 `index.css`의 `@theme` 값에서 만든 것이다(초기값은 라이트 값).
- 미리보기 창이 숨겨져 있으면 프레임이 안 그려져서 View Transition이 시작되지 않는다(화면 모드가 안 바뀐 것처럼 보임). 개발 중 확인할 때는 창을 보이게 하거나 스크린샷을 찍어 프레임을 만든다.
- Motion으로 움직이는 요소(`ThemeToggle`의 선택 표시)는 CSS 전환이 아니라서 `theme-switching`의 영향을 받지 않는다. 같은 이유로, 화면 모드와 함께 움직여야 하는 요소는 CSS 전환보다 Motion을 쓴다.
- "동작 줄이기"를 켠 기기에서는 CSS 움직임이 사실상 꺼지고(`index.css`), Motion은 이동·회전(transform) 움직임을 건너뛴다. 새 움직임도 이 설정에서 정보를 잃지 않아야 한다(움직임으로만 알려 주지 않는다).

## 백엔드 연동

- 환경변수: `VITE_API_BASE_URL`(기본 `/api`), `VITE_USE_MOCK`. 팀 공유 값은 `.env.development`(커밋), 내 PC에서만 바꿀 값은 `.env.development.local`(커밋 안 됨)
- 요청 경로는 항상 `/api/...`. 개발 중에는 Vite 프록시가 `localhost:8080`으로, 배포 때는 Vercel rewrite가 백엔드로 넘긴다. 그래서 백엔드 컨트롤러 경로도 `/api`로 시작한다
- `VITE_USE_MOCK=true`면 API 함수가 `mocks/` 데이터를 반환한다. 백엔드가 준비된 API부터 하나씩 실제 호출로 바꾼다. 예시: `api/notices.api.ts`
- 백엔드에 바라는 API(제안)는 `docs/frontend-requests.md`에 모은다. 새 화면에서 API가 필요해지면 거기에 추가하고, 목업도 같은 모양으로 만든다
- 백엔드 공통 응답 형식: `{ success: boolean, message: string, data: T }` (`types/api.ts`의 `ApiResponse<T>`)
- API 함수는 `api/request.ts`의 `request<T>()`로 요청한다. 성공하면 `data`만 돌려주고, 실패하면 화면에 보여 줄 문구를 담은 `ApiError`를 던진다(`AsyncBoundary`가 받는다)

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

- 배치 JSON은 `unknown`으로 받아 zod 스키마로 검증한 뒤에만 사용한다 (`utils/layout/dashboardLayout.ts`의 `parseDashboardLayout`).
- 허용 영역 id: `summary`, `mastery`, `conceptDetail`, `recommendation`, `courseShare`. 크기는 `wide`(한 줄 전체) / `normal`(넓은 화면에서 반 칸).
- 없는 id, 같은 영역·같은 순서 번호 중복, 80자를 넘거나 빈 이유, 형식이 다른 숫자는 검증에서 거르고 **기본 배치**(`DEFAULT_LAYOUT`)로 보여 준다. 배치에서 빠진 영역은 기본 순서로 뒤에 붙인다.
- 각 영역 제목 오른쪽 "이 자리인 이유" 말풍선(AI, 보라색)으로 이유를 보여 준다. 마우스를 올리거나 키보드로 가면 뜨고, 클릭·탭하면 고정, Esc·바깥 클릭으로 닫힌다(휴대폰·키보드 사용자도 볼 수 있게 호버만 쓰지 않는다). 그리고 맨 위에 전체 이유와 **배치할 때 본 숫자**(코드, 파란색)를 나란히 보여 준다.
- 새 영역을 추가하려면 `DashboardComponentId` 타입, `DASHBOARD_COMPONENT_IDS`, `DEFAULT_LAYOUT`, `DashboardPage`의 `renderComponent`를 함께 고친다.
- 목업에서는 주소에 `?layout=b`, `?layout=invalid`, `?layout=none`을 붙여 다른 배치·검증 실패·배치 없음을 확인할 수 있다.

## 디자인 (기관형 LMS 톤, 시안 v1 확정)

시안: Claude 디자인 캔버스 "AI LMS 디자인 시안"(메인, 학습 대시보드). 대회 심사에 디자인 배점이 없으므로 겉틀은 단순하게 두고, AI가 보이는 화면에 공을 들인다.

- 상아색 상단바(왼쪽 로고, 오른쪽 로그인|회원가입|마이페이지 + 검색) → 짙은 네이비 GNB(가운데 정렬, 호버 드롭다운)
- 메인: 자동 전환 히어로는 쓰지 않는다. 첫 화면에 진입 카드 2개(학습 자료로 시작 / AI 대화로 시작) → "AI LEARNING HUB" 3단계 상아 카드 → 개인정보 안내("원본 대화 파일은 서버로 보내지 않아요", 3단계 바로 아래 테두리 상자) → 알약형 CTA → 베이지 푸터. 공지사항은 메인에 두지 않고 커뮤니티 메뉴에만 둔다. 메인 아래쪽은 나중에 로그인 사용자용 영역(이어서 공부하기, 보완 필요 개념)으로 채운다
- 서브페이지: 가운데 큰 제목·부제, 오른쪽 `HOME > 경로`, 게시판 표는 네이비 상단선 2px, 폼은 회색 라벨 칸 표

### 색 규칙

Tailwind 4 `@theme`에 아래 이름으로 등록한다(`src/index.css`). Tailwind 기본 팔레트(`blue-600` 등)를 덮어쓰지 않도록 의미 기반 이름을 쓴다.

| 토큰                                           | 값                                            | 쓰는 곳                                                               |
| ---------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| `brand` / `on-brand`                           | `#0f2163` / `#ffffff`                         | GNB·로고 바탕과 그 위 글자                                            |
| `heading`                                      | `#0d1b57`                                     | 페이지 제목, 카드 제목                                                |
| `heading-soft`                                 | `#1f3a8a`                                     | 섹션 제목, 표 상단선                                                  |
| `primary` / `on-primary` / `primary-hover`     | `#3168d2` / `#ffffff` / `#1f3a8a`             | 모든 버튼·글자 링크, 선택된 메뉴, 숙련도 점수 막대                    |
| `primary-soft`                                 | `#e8effc`                                     | 작은 강조: 아이콘 상자, 선택된 단계·버튼                              |
| `primary-pill`                                 | `#cddcf7`                                     | 알약형 보조 버튼                                                      |
| `surface` / `surface-raised` / `surface-muted` | `#f9f6ee` / `#ffffff` / `#f3eee3`             | 사이트 바탕(연한 상아) / 카드·입력칸·드롭다운(흰색) / 표 머리·라벨 칸 |
| `hero` / `section`                             | `#f3eee2` / `#f3eee2`                         | 메인 첫 화면 띠 / 큰 안내 상자(3단계 카드, 서비스 소개 상자)          |
| `footer`                                       | `#e9e2d2`                                     | 푸터 배경 (글자는 `heading`)                                          |
| `line` / `line-strong`                         | `#e4ddcd` / `#d3c9b4`                         | 구분선, 카드 테두리                                                   |
| `input-border`                                 | `#7c8598`                                     | 입력칸·검색칸 테두리 (바탕 대비 3:1 이상)                             |
| `ai` / `ai-soft` / `ai-border` / `ai-chip`     | `#86198f` / `#fbf4fe` / `#e9b8f5` / `#f5e1fb` | AI가 만든 콘텐츠만                                                    |
| `strength` / `strength-soft`                   | `#166534` / `#dcfce7`                         | 강점 표시                                                             |
| `weakness` / `weakness-soft`                   | `#9a3412` / `#ffedd5`                         | 보완 필요 표시                                                        |
| `danger`                                       | `#b91c1c`                                     | 오류 메시지만                                                         |

- **바탕은 따뜻한 상아 계열, 강조는 파랑.** 넓은 면(바탕, 띠, 큰 상자, 푸터)은 상아·베이지로 맞추고, 누를 수 있거나 선택된 것만 파랑(`primary` 계열)으로 칠한다. 카드와 입력칸은 흰색(`surface-raised`)으로 바탕보다 살짝 떠 보이게 한다.

- **블루 = 코드가 계산한 값과 일반 UI, 퍼플(`ai`) = AI가 만든 것.** 판단 근거 투명성 원칙을 색으로 보여 주는 장치이므로 예외 없이 지킨다.
  - `ai` 색: AI 설명, 판단 근거 요약, AI 추천 학습 순서와 "이 순서인 이유", 챗봇 답변, 대시보드 "왜 여기에 있나요?"
  - 버튼은 AI 기능을 실행하더라도 항상 `primary`. 필요하면 아이콘만 `ai`로 붙인다.
  - 숙련도 점수·그래프는 코드가 계산한 값이므로 `primary`. `ai`로 칠하지 않는다.
- **색만으로 의미를 전달하지 않는다.** AI 요소에는 반짝이 아이콘과 "AI" 글자를, 강점에는 체크 아이콘과 "강점", 보완 필요에는 느낌표 아이콘과 "보완 필요"를 항상 함께 붙인다. AI 요소가 있는 화면에는 "이 표시가 있는 내용은 AI가 작성했어요" 안내를 둔다.
- 약점에는 빨강을 쓰지 않는다(적록색약, "실패" 느낌). 빨강(`danger`)은 파싱 실패·입력 오류 같은 오류에만 쓴다.
- **컴포넌트에 색 코드(`text-[#…]`, `bg-white`, `text-white`)를 직접 쓰지 않는다.** 바탕·글자·구분선도 `surface`, `ink`, `line` 계열 토큰만 쓴다. 버튼 글자는 `on-primary`, GNB 글자는 `on-brand`.
- **다크모드:** 표의 값은 밝은 모드 기준이고, 어두운 값은 `src/index.css`의 `:root.dark`에서 같은 토큰을 다시 정의한다. 컴포넌트에 `dark:` 클래스를 붙이지 않는다. 새 토큰을 추가하면 어두운 값도 함께 넣고(그리고 `styles/theme-transition.css`에 등록하고), 글자·바탕 쌍의 대비 4.5:1을 확인한다. 모드는 상단바의 화면 모드 버튼(기기 설정 / 밝게 / 어둡게, `useThemeStore`)으로 바꾸고, 기본값은 기기 설정을 따른다.
- 페이지 본문 폭은 `max-w-page`(1200px), 자주 쓰는 글자 크기는 `text-body`(15px)·`text-caption`(13px)·`text-display`(40px) 토큰을 쓴다.

- 폰트: Pretendard (대체: Noto Sans KR, 시스템 폰트)
- 접근성: 키보드 포커스 표시, 이미지·아이콘 대체 텍스트, 글자 대비 4.5:1 이상, 애니메이션은 `prefers-reduced-motion`을 따른다

## 문구 규칙

- 사용자 관점의 쉬운 말. 버튼은 실제 동작을 쓴다("자료 올리기", "선택한 대화 3개 보내기").
- 오류는 무엇이 잘못됐고 어떻게 고치는지 쓴다. 빈 화면에는 다음 행동을 안내한다.

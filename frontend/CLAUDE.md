# CLAUDE.md — frontend

루트 `CLAUDE.md`의 원칙(미결 사항, 개인정보 처리, 판단 근거 표시)을 먼저 따른다.

## 스택
React 18, TypeScript, Vite, Tailwind CSS, React Router v6(`createBrowserRouter` 배열 라우팅),
React Query(서버 상태), Zustand(클라이언트 UI 상태만), Axios, zod(LLM 출력 검증)

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

## 디자인 (시연 영상의 기관형 LMS 톤)
- 흰 상단바(왼쪽 로고, 오른쪽 로그인|회원가입|마이페이지 + 검색) → 짙은 네이비 GNB(가운데 정렬, 호버 드롭다운)
- 메인: 자동 전환 히어로(가운데 흰 문구, 하단 점, 정지 버튼) → "AI LEARNING HUB"(파란 탭 패널 + 이미지 카드 2개: 자료로 시작 / AI 대화로 시작) → 소개 문구 + 연하늘 카드 3개 + 알약형 CTA → 회청색 푸터
- 서브페이지: 가운데 큰 제목·부제, 오른쪽 `HOME > 경로`, 게시판 표는 네이비 상단선 2px, 폼은 회색 라벨 칸 표
- Tailwind theme 색상:
  - navy-900 `#0d1b57` (GNB, 페이지 제목) / navy-700 `#1f3a8a` (섹션 제목, 표 상단선)
  - indigo-600 `#2c3fa6` (HUB 패널) / blue-600 `#2b67d1` (기본 버튼)
  - blue-100 `#e8effc` (카드 배경) / blue-200 `#cddcf7` (알약 버튼) / footer `#a7b2c5`
- 폰트: Pretendard (대체: Noto Sans KR, 시스템 폰트)
- 접근성: 키보드 포커스 표시, 이미지·아이콘 대체 텍스트, `prefers-reduced-motion`이면 자동 슬라이드 정지

## 문구 규칙
- 사용자 관점의 쉬운 말. 버튼은 실제 동작을 쓴다("자료 올리기", "선택한 대화 3개 보내기").
- 오류는 무엇이 잘못됐고 어떻게 고치는지 쓴다. 빈 화면에는 다음 행동을 안내한다.

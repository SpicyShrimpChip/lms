# 프론트가 백엔드에 바라는 것

프론트(변지환)가 지금까지 만든 화면 기준으로, 백엔드(김주미)가 알아야 할 내용을 모은 문서다.
API는 **제안**이다. 확정은 백엔드 API 문서(Swagger)에서 하고, 바뀌면 이 문서와 프론트 목업을 같이 고친다.

최종 수정: 2026-10-25 (학습 대시보드 목업 추가)

## 1. 개발 환경 연결

- 프론트는 모든 요청을 **`/api/...`** 로 보낸다. 컨트롤러 경로도 `/api`로 시작한다. 예: `@RequestMapping("/api/courses")`
- 스프링은 **8080** 포트로 띄운다. 프론트 개발 서버(5173)가 `/api` 요청을 8080으로 넘겨 준다(Vite 프록시).
  - 브라우저 입장에서는 같은 출처라서 **개발 중에는 CORS 설정 없이도 된다.**
  - 배포 때도 Vercel이 `/api`를 백엔드로 넘기는 방식(rewrite)을 쓸 예정이라 같은 출처가 된다. 프론트를 다른 도메인에서 직접 호출하게 되면 그때 CORS를 연다.
- 프론트는 `.env.development`의 `VITE_USE_MOCK=true`로 가짜 데이터를 쓰고 있다. 백엔드 API가 하나 생길 때마다 해당 API만 실제 호출로 바꾼다.
  - 백엔드를 띄워 놓고 프론트에서 실제로 붙여 보려면 `frontend/.env.development.local`(커밋 안 됨)에 `VITE_USE_MOCK=false`를 넣는다.

## 2. 공통 응답 형식

```json
{ "success": true, "message": "", "data": {} }
```

- 성공·실패 모두 이 모양으로 보낸다. 실패 때는 `success: false`와 적절한 HTTP 상태 코드(400, 401, 403, 404, 409, 500 등)를 함께 쓴다.
- **`message`는 사용자에게 그대로 보여 준다.** 프론트 오류 화면이 이 문구를 띄운다(`frontend/src/api/request.ts`).
  - 좋은 예: "이 학기에 같은 이름의 과목이 이미 있어요." / "파일 형식을 확인해 주세요."
  - 나쁜 예: 영어 예외 메시지, 스택트레이스, SQL 오류
- 응답이 없으면(서버 꺼짐·네트워크) 프론트가 알아서 "서버에 연결하지 못했어요"를 띄운다.

## 3. API 목록 (제안)

프론트 연결 상태: **목업** = 가짜 데이터로 화면 완성, 실제 API 기다리는 중

### 공지사항 — 목업

| 메서드 | 경로           | 응답 `data` |
| ------ | -------------- | ----------- |
| GET    | `/api/notices` | `Notice[]`  |

```ts
Notice = { id: number, title: string, createdAt: string }; // createdAt: "2026-10-24"
```

상세(`GET /api/notices/{id}`)는 화면만 있고 아직 연결 안 함. 본문 필드가 생기면 알려 주기.

### 내 과목 — 목업

화면: `/courses` (학습자료 > 내 과목). 등록한 키워드는 AI 대화 가져오기에서 공부한 대화를 고를 때, 자료 올리기에서 과목을 고를 때 쓴다.

| 메서드 | 경로                | 요청 본문     | 응답 `data`                       |
| ------ | ------------------- | ------------- | --------------------------------- |
| GET    | `/api/courses`      | -             | `Course[]` (로그인한 사용자 것만) |
| POST   | `/api/courses`      | `CourseInput` | `Course`                          |
| PATCH  | `/api/courses/{id}` | `CourseInput` | `Course`                          |
| DELETE | `/api/courses/{id}` | -             | 없음                              |

```ts
Course      = { id: number, name: string, semester: string, keywords: string[] }
CourseInput = { name: string, semester: string, keywords: string[] } // id 없음
semester    = "2026-1" | "2026-summer" | "2026-2" | "2026-winter"
```

서버에서도 검사해 주기 (프론트 검사는 브라우저에서 우회할 수 있다):

- 이름 1~40자, 키워드 최대 20개·각 20자
- 같은 사용자·같은 학기·같은 이름 과목은 거절 (409 + 사용자용 `message`)
- 다른 사용자의 과목은 조회·수정·삭제 불가

## 4. 11/6 중간 심사 전에 필요한 것

- **최우선: 실제 AI를 호출하는 분석 API 1개.** 심사의 "AI 활용"을 보여 줄 핵심이다. 모델은 1개로 시작해도 되고, 여러 모델을 붙일 수 있는 구조만 갖춘다(루트 `CLAUDE.md` 미결 사항).
- 대화 전송·분석 결과 형식은 백엔드에서 정해 API 문서에 남겨 주면 프론트 목업을 그 모양에 맞춘다. 프론트 화면(학습 대시보드)에 필요한 정보:
  - 개념 이름, 과목(위 `Course.id`)
  - 숙련도 점수 — **코드로 계산한 값** (LLM이 매기지 않음)
  - 강점 / 보완 필요 구분
  - 판단 근거 — 어떤 대화·퀴즈 기록을 보고 판단했는지 (대화 id, 인용 구간 등)
  - AI 설명 문장 — 화면에서 보라색 "AI" 표시를 붙이므로 **코드 계산 값과 필드를 분리**해 주기
- 대화 전송: 프론트는 사용자가 고른 대화만, 개인정보를 가린 상태로 보낸다. 원본 파일과 이미지는 보내지 않는다(이미지는 `[이미지]` 표시만 남김).

### 학습 대시보드 — 목업

화면: `/analysis` (학습분석 > 학습 대시보드). 프론트는 아래 모양의 가짜 데이터로 화면을 만들어 두었다(`frontend/src/types/analysis.ts`, `frontend/src/mocks/dashboard.ts`). 과목별 거르기는 프론트가 하므로 한 번에 다 보내 주면 된다.

| 메서드 | 경로                      | 응답 `data`                            |
| ------ | ------------------------- | -------------------------------------- |
| GET    | `/api/analysis/dashboard` | `DashboardData` (로그인한 사용자 것만) |

```ts
DashboardData = {
  summaries: StudySummary[],        // 과목별 학습량
  concepts: ConceptMastery[],       // 개념별 숙련도
  recommendations: Recommendation[] // 과목별 추천 학습 순서
}
StudySummary = { courseId, courseName, conversationCount, quizCount, quizCorrectCount }
ConceptMastery = {
  conceptId: string, name: string, courseId: number,
  score: number,                     // 0~100, 코드로 계산 (산식 미결)
  level: "strength" | "normal" | "weakness",
  evidence: Evidence[],              // 판단 근거 (코드)
  aiExplanation: string | null       // AI 설명 (보라색 표시)
}
Evidence = {
  id: string, source: "conversation" | "quiz", date: "2026-10-20",
  summary: string,                   // 화면에 보여 줄 한 줄 요약
  signal: "not_understood" | "asked_again" | "applied" | "quiz_correct" | "quiz_wrong"
}
Recommendation = { courseId: number, conceptIds: string[], aiReason: string } // 순서와 이유는 AI가 정함
```

- `ai`로 시작하는 필드만 LLM이 쓴 글이다. 점수·`level`·`evidence`는 코드가 정한다.
- `evidence.summary`에 대화 원문을 길게 넣지 않는다. 한 줄 요약이면 충분하다.
- 동적 배치(LLM이 정한 영역 순서와 "왜 여기에 있나요?" 이유)는 다음 프론트 PR에서 추가할 예정이고, 응답에 `layout` 필드가 붙는 모양이 될 것이다.

## 5. 정해 주면 프론트가 맞출 것

- **인증 방식:** backend `CLAUDE.md`의 JWT access + HttpOnly 쿠키 refresh 방향이면, 로그인 응답 모양과 토큰 갱신 경로를 알려 주기. 배포 때 같은 출처(rewrite)라 쿠키 설정이 단순해진다.
- **자료 올리기:** 지원 형식(프론트 안: PDF·PPTX·HWP·HWPX), 최대 크기, 원본 보관 여부(루트 `CLAUDE.md` 미결 사항). 텍스트 추출 후보는 PDF·PPTX는 Apache Tika 또는 PDFBox, HWP·HWPX는 hwplib·hwpxlib.
- **배포:** 백엔드 주소가 정해지면 Vercel rewrite 대상만 바꾸면 된다.

## 6. 이 문서 고치는 법

- 백엔드가 API를 확정하거나 바꾸면 Swagger 또는 API 문서를 기준으로 하고, 이 문서의 해당 부분은 "확정: (문서 위치)"로 바꾸거나 지운다.
- 프론트가 새 화면에서 API가 필요해지면 여기에 제안을 추가하고 PR에 적는다.

# 프론트가 백엔드에 바라는 것

프론트(변지환)가 지금까지 만든 화면 기준으로, 백엔드(김주미)가 알아야 할 내용을 모은 문서다.
API는 **제안**이다. 확정은 백엔드 API 문서(Swagger)에서 하고, 바뀌면 이 문서와 프론트 목업을 같이 고친다.

최종 수정: 2026-10-27 (자료 목록·상세·삭제 제안 추가, 대화 가져오기 안내가 자료 절에 잘못 들어간 것 바로잡음)

## 0. 백엔드 시작 순서 (프론트 완성을 기다리지 않고 바로 시작)

이 절은 **참고용 제안**이다. 순서, 구조, 방식은 백엔드 담당이 정하고, 바뀌면 이 문서를 고쳐 주면 된다. 기술 명세서·요구사항 정의서를 쓸 때는 아래 API 목록과 3번 문서를 가져다 써도 된다.

프론트는 `VITE_USE_MOCK=true`로 가짜 데이터를 쓰고 있어서, 백엔드가 먼저 만들어도 서로 막히지 않는다. API 하나가 생길 때마다 프론트가 그 API만 실제 호출로 바꾼다. 중간 심사(11/6)에서 실제 동작하는 AI 분석을 보여 줘야 하므로 아래 순서로 시작하기를 제안한다.

| 순서 | 할 일                                                                        | 끝났다고 보는 기준                                                                                                 |
| ---- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1    | 프로젝트 세팅: 패키지 구조, `ApiResponse`, 전역 예외 처리, Swagger, H2       | `GET /api/notices`가 실제로 응답하고, 프론트 `.env.development.local`에서 `VITE_USE_MOCK=false`로 공지 목록이 뜬다 |
| 2    | 인증 (회원가입·로그인·토큰 갱신·로그아웃)                                    | 로그인한 사용자만 `/api/**`를 쓸 수 있다                                                                           |
| 3    | 내 과목 API (아래 3번 문서 그대로)                                           | 프론트 `/courses` 화면이 실제 API로 동작한다                                                                       |
| 4    | 자료 올리기 API + 파일 저장 인터페이스(로컬 구현부터)                        | 프론트 `/materials/upload`가 실제 API로 동작한다                                                                   |
| 5    | `global/llm` 인터페이스 + mock 구현체, 숙련도 점수 계산 클래스, 대시보드 API | 키 없이도 `GET /api/analysis/dashboard`가 형식에 맞게 응답한다. 그다음 LLM 1개를 실제로 붙인다                     |
| 6    | 대화 가져오기 API (아래 3번)                                                 | 프론트가 고른 대화를 보내면 저장되고 분석에 쓰인다                                                                 |
| 7    | 퀴즈 API (아래 3번)                                                          | 풀이·채점 결과가 대시보드 근거(`evidence`)에 보인다                                                                |

- 심사 전에 꼭 필요한 건 **5번의 실제 LLM 호출**과 6번이다. 1~4번은 5번의 바탕이 되므로 작게 끝내고 넘어가도 된다.
- 한 PR에는 API 하나씩. DTO 모양이 이 문서와 달라지면 **같은 PR에서 이 문서의 해당 부분을 고치고**, PR 설명에 적어 프론트(변지환)에게 알려 주기. 프론트는 그 모양에 맞춰 목업과 타입을 고친다.
- 막히거나 정해야 하는 게 생기면(예: 숙련도 산식, 자료 형식) 임의로 정하지 말고 코드에 `// TODO(미결): ...`를 남기고 설정값으로 분리한 뒤 PR에 질문을 적는다(루트 `CLAUDE.md`의 미결 사항).
- 로컬 실행은 `backend/CLAUDE.md`의 명령어를 따르고, 비밀값(JWT 시크릿, LLM 키, DB 비밀번호)은 환경변수로만 쓴다. 이 레포는 나중에 공개되므로 커밋 기록에 비밀값이 한 번이라도 들어가면 안 된다.

### 1번(프로젝트 세팅) 시작 가이드 (제안)

바꿔도 되는 제안이다. 처음 시작할 때 막히기 쉬운 곳을 먼저 적어 둔다. 아래 조합(Spring Boot 3.5.6, Gradle 9.8.2, springdoc 2.8.9)으로 공지 API를 만들어 빌드·테스트·실행까지 되는 것을 확인했다.

**프로젝트 만들기**

- 팀이 정한 건 Spring Boot **3.x**인데, Spring Initializr(start.spring.io)는 2026-10-25 기준 4.x만 보여 준다. 4.x로 만들면 의존성 이름이 달라서 `backend/CLAUDE.md`와 맞지 않는다. 그래서 Initializr에서 Gradle 프로젝트를 만든 뒤 `build.gradle`의 `org.springframework.boot` 플러그인 버전을 `3.5.6`으로 직접 바꾸는 방법을 제안한다. 4.x로 가고 싶으면 먼저 알려 주기.
- 의존성: `spring-boot-starter-web`, `-validation`, `-data-jpa`, `-security`, `org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9`, Lombok, H2(`runtimeOnly`), DB 드라이버(`runtimeOnly`, 아래 DB 참고), 테스트 `spring-boot-starter-test`
- 기본 패키지는 `com.ailms.backend`를 제안한다. 폴더 구조는 `backend/CLAUDE.md`를 따른다.
- 내 PC의 JDK가 17이 아니어도 `tasks.withType(JavaCompile) { options.release = 17 }`로 Java 17 문법만 쓰게 맞출 수 있다. CI는 Java 17(temurin)으로 돌린다.
- `gradlew` 줄바꿈이 윈도우에서 바뀌면 리눅스(CI)에서 실행이 안 된다. `backend/.gitattributes`에 `gradlew text eol=lf`를 넣는다.

**설정 (`application.yaml`)**

- **DB는 MySQL로 시작하는 것을 잠정안으로 한다(`mysql-connector-j`).** 10/27 멘토링에서 MySQL로 갈지, 챗봇 검색용으로 벡터 DB(Qdrant)를 쓸지 물어볼 예정이라 최종은 그 뒤에 정한다. 회원·자료·퀴즈는 어느 쪽이든 관계형 DB에 들어가므로, JPA로 쓰고 DB 전용 문법(특정 DB 전용 함수, JSON 타입 등)을 피하면 나중에 바꿔도 부담이 적다.

- 포트 8080, 로컬 DB는 H2 메모리 `jdbc:h2:mem:lms;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1`
- JPA: `ddl-auto: create-drop`, `defer-datasource-initialization: true`, `open-in-view: false`. 샘플 데이터는 `data.sql`로 넣고 `sql.init.mode: always`
- 운영은 `application-prod.yaml`에서 DB 주소·계정·CORS 출처를 모두 환경변수(`${DB_URL}` 등)로 받고, `ddl-auto: none`, `sql.init.mode: never`로 둔다. 운영 스키마 관리 방식(직접 SQL, Flyway 등)은 정해지지 않았다.
- CORS 허용 출처는 설정값(`app.cors.allowed-origins`, 로컬 `http://localhost:5173`)으로 둔다. 같은 출처로 쓰는 동안은 영향이 없다.

**보안 (처음에는 열어 두기)**

- 인증(2번)을 만들기 전에는 `SecurityFilterChain`에서 모든 요청을 열어 두고(`permitAll`) 프론트와 먼저 연결해 보는 것을 제안한다. **이 상태로 배포하면 안 된다.** 2번에서 로그인 필수로 바꾸고, 공지 목록·`/api/auth/**`·Swagger만 연다.
- `PasswordEncoder`는 BCrypt로 등록해 둔다.

**오류 처리 (`@RestControllerAdvice`)**

모든 오류를 `{ success: false, message, data: null }`로 바꿔 돌려준다. `message`는 사용자에게 그대로 보이므로 아래처럼 쉬운 말로 쓰고, 예외 메시지·스택트레이스는 응답에 넣지 않는다(서버 로그에만).

| 상황                  | 상태 | `message` 예시                                                  |
| --------------------- | ---- | --------------------------------------------------------------- |
| 직접 던진 업무 오류   | 코드 | 던질 때 정한 사용자용 문구                                      |
| 입력 검증 실패        | 400  | DTO 검증 문구 중 첫 번째, 없으면 "입력한 내용을 확인해 주세요." |
| 요청 본문을 읽지 못함 | 400  | "요청 형식이 올바르지 않아요."                                  |
| 없는 주소             | 404  | "요청한 주소를 찾을 수 없어요."                                 |
| 예상하지 못한 오류    | 500  | "서버에서 문제가 생겼어요. 잠시 뒤 다시 시도해 주세요."         |

**첫 API: 공지 목록으로 프론트 연결 확인하기**

- `GET /api/notices` → 최신 공지가 위로(작성일 내림차순, 같으면 id 큰 순). `createdAt`은 `"2026-10-24"` 모양의 날짜 문자열이다(Boot 기본 설정이면 `LocalDate`가 이렇게 나간다).
- 샘플 3건(프론트 목업과 같다):

| id  | title                                   | createdAt  |
| --- | --------------------------------------- | ---------- |
| 3   | AI 대화 가져오기 기능을 준비하고 있어요 | 2026-10-24 |
| 2   | 개인정보 처리 방식을 안내해 드려요      | 2026-10-20 |
| 1   | 서비스를 시작했어요                     | 2026-10-15 |

- 확인: 서버를 띄우고 `curl localhost:8080/api/notices`로 위 모양이 나오는지 보고, 프론트 `frontend/.env.development.local`에 `VITE_USE_MOCK=false`를 넣은 뒤 `/notices` 화면에 같은 3건이 뜨면 1번 끝이다.
- 공통 응답 형식과 오류 처리는 이 API로 처음 검증한다. 테스트는 이 응답 모양(`success`, `message`, `data`)과 없는 주소의 404 형식을 확인하면 충분하다.
- `.github/workflows/backend-ci.yml`을 `frontend-ci.yml`과 같은 방식(backend 변경이 있을 때만 실행하는 paths 필터)으로 추가해 Java 17에서 `./gradlew build`가 돌게 한다.

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

### 공지사항 — 목록 구현됨 (확정: Swagger `공지사항`)

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

### 자료 — 올리기·목록·상세·삭제 목업 (제안)

화면: `/materials/upload` (학습자료 > 자료 올리기). 과목은 내 과목에서 고르고, 저작권 고지 확인 체크를 해야 올릴 수 있다.

| 메서드 | 경로             | 요청 본문                                          | 응답 `data`                                       |
| ------ | ---------------- | -------------------------------------------------- | ------------------------------------------------- |
| POST   | `/api/materials` | `multipart/form-data`: `courseId`, `title`, `file` | `{ id: number, courseId: number, title: string }` |

서버에서도 검사해 주기: 지원 형식·최대 크기(프론트는 임시로 PDF·TXT·MD, 20MB), 제목 1~60자, 본인 과목인지. 형식·크기가 정해지면 알려 주기 (프론트 `constants/materials.ts` 한 곳만 고치면 된다).

화면: `/materials`(목록, 과목별로 묶음), `/materials/{id}`(상세: 요약 / 핵심 개념 / 퀴즈 탭). 올린 본인만 볼 수 있다.

| 메서드 | 경로                  | 요청 본문 | 응답 `data`         |
| ------ | --------------------- | --------- | ------------------- |
| GET    | `/api/materials`      | -         | `MaterialSummary[]` |
| GET    | `/api/materials/{id}` | -         | `MaterialDetail`    |
| DELETE | `/api/materials/{id}` | -         | 없음                |

```ts
MaterialSummary = {
  id: number, courseId: number, title: string,
  fileName: string,                       // 올린 파일 이름 (원본 보관 여부와 별개로 이름은 보여 준다)
  createdAt: string,                      // ISO
  status: "processing" | "ready" | "failed", // 올린 뒤 AI가 요약·개념·퀴즈를 만드는 중 / 완료 / 글을 못 뽑음
  quizCount: number
}
MaterialDetail = MaterialSummary & {
  aiSummary: string | null,               // AI가 쓴 요약 (보라색 AI 표시). 만드는 중이면 null
  concepts: { conceptId: string, name: string, aiDescription: string | null }[]
  // conceptId는 학습 대시보드 ConceptMastery.conceptId와 같은 값으로 맞춰 주기 (자료 상세 → 학습 분석 연결)
}
```

- 올리기 응답 뒤 처리가 오래 걸리면 `status: "processing"`으로 두고, 끝나면 `ready`로 바꿔 주기. 프론트는 목록·상세에서 "요약 만드는 중"을 보여 준다.
- 삭제 범위: 자료, 그 자료로 만든 요약·개념·퀴즈, 퀴즈 결과에서 나온 근거(`evidence`). 점수는 남은 근거로 다시 계산한다(동의 철회와 같은 규칙).
- 목업(`mocks/materials.ts`)은 시연 과목 샘플 자료 3개로 시작하고, 올린 자료는 `processing` 상태로 남는다(파일 내용을 읽지 않음).

### 인증·마이페이지 — 가입·로그인·갱신·로그아웃·내 정보 구현됨 (확정: Swagger `인증`, `회원`)

화면: `/login`, `/signup`, 마이페이지(내 정보 표시까지 연결. 동의 철회·데이터 삭제는 예정). 방식은 JWT access token(메모리) + HttpOnly 쿠키 refresh token. 자세한 흐름은 `docs/backend-design.md` 5번.

| 메서드 | 경로                     | 요청 본문                 | 응답 `data`                                          | 상태   |
| ------ | ------------------------ | ------------------------- | ---------------------------------------------------- | ------ |
| POST   | `/api/auth/signup`       | `SignupInput`             | `User` (201)                                         | 구현됨 |
| POST   | `/api/auth/login`        | `{ email, password }`     | `{ accessToken: string, user: User }` + refresh 쿠키 | 구현됨 |
| POST   | `/api/auth/refresh`      | - (refresh 쿠키)          | `{ accessToken: string }` + 새 refresh 쿠키          | 구현됨 |
| POST   | `/api/auth/logout`       | - (refresh 쿠키)          | 없음 (세션 폐기, 쿠키 삭제)                          | 구현됨 |
| GET    | `/api/users/me`          | -                         | `User`                                               | 구현됨 |
| PATCH  | `/api/users/me/consents` | `{ aiAnalysis: boolean }` | `User`                                               | 제안   |
| DELETE | `/api/users/me`          | -                         | 없음 (탈퇴: 내 모든 데이터 삭제)                     | 제안   |

```ts
// 화면에 "이름"과 "비밀번호 확인" 칸이 있어 name, passwordConfirm을 추가했다 (2026-10-25)
SignupInput = {
  email: string, // 서버가 소문자로 바꿔 저장
  name: string, // 1~30자
  password: string,
  passwordConfirm: string, // 서버도 password와 같은지 확인
  agreedTerms: boolean, // true여야 함
  agreedPrivacy: boolean, // true여야 함
  agreedAiAnalysis: boolean,
};
User = { id: number, email: string, name: string, aiAnalysisConsent: boolean };
```

- 가입 동의 3가지 중 이용약관·개인정보 수집은 필수, **AI 대화 분석은 선택**이다. 선택 동의를 안 해도 자료로 공부할 수 있어야 한다.
- **(10/27 화면 변경, API는 그대로)** 「개인정보 처리 통합 안내서」(2025.7.)에 따라 회원가입의 필수 "개인정보 수집·이용 동의"를 **"이용약관과 개인정보 수집·이용 안내를 확인했어요" 체크 하나**로 바꿨다. 서비스에 꼭 필요한 정보는 동의가 아니라 계약 이행(§15①4)이 근거라서다. 프론트는 이 체크 하나로 `agreedTerms`·`agreedPrivacy`를 함께 `true`로 보낸다. 그래서 `privacy_agreed_at`은 이제 "안내를 확인한 시각"이라는 뜻이다. (선택) 시간 날 때 `SignupRequest`의 오류 문구 "개인정보 수집·이용에 동의해 주세요."를 "개인정보 수집·이용 안내를 확인해 주세요."로 바꿔 주기. 필드 이름을 바꿀 필요는 없다.
- 이메일은 중복이면 409 + `message`("이미 가입된 이메일이에요."). 비밀번호 규칙은 5번 참고(서버도 같은 4조건, 추가로 72바이트 이하). 비밀번호는 BCrypt로 해시하고 로그에 남기지 않는다.
- 로그인 실패 `message`는 이메일이 틀렸는지 비밀번호가 틀렸는지 구분하지 않는다("이메일 또는 비밀번호를 확인해 주세요."). 같은 이메일·같은 곳에서 15분에 5번 틀리면 429("로그인 시도가 너무 많아요. N분 뒤 다시 시도해 주세요.").
- **`/api/auth/login`, `/refresh`, `/logout`은 `X-Requested-With: XMLHttpRequest` 헤더가 있어야 한다**(CSRF 방어, 없으면 403). 프론트 Axios 인스턴스가 모든 요청에 붙인다.
- **동의 철회(`aiAnalysis: false`)하면 가져온 대화와 그로부터 계산된 분석 결과를 함께 삭제한다.** 삭제 범위는 아래 대화 가져오기와 같다. 프론트는 철회 전에 확인 창으로 "되돌릴 수 없어요"를 보여 준다.
- 토큰이 만료돼 401이 오면 프론트가 `/api/auth/refresh`를 한 번 부르고 원래 요청을 다시 보낸다(`api/axios.ts`). 갱신에도 실패하면 로그아웃 상태가 되고 로그인 가드가 로그인 화면으로 보낸다.
- 로그인이 필요한 화면은 `router/RequireAuth.tsx` 아래에 둔다. **`VITE_USE_MOCK=true`(팀 기본값)에서는 가드를 건너뛰어** 백엔드 없이 화면을 개발할 수 있다.

### 대화 가져오기 — 목업 (제안)

화면: `/analysis/import` (학습분석 > AI 대화 가져오기). 프론트가 하는 일: 내보내기 파일 읽기 → 내 과목 키워드로 공부한 대화만 고르기 → 개인정보 가리기 → **사용자가 체크한 대화만** 서버로 전송. 원본 파일과 이미지·첨부 내용은 서버로 가지 않는다(대신 `[이미지]`, `[첨부 파일]` 표시만 남는다).

| 메서드 | 경로                      | 요청 본문            | 응답 `data`                                                   |
| ------ | ------------------------- | -------------------- | ------------------------------------------------------------- |
| POST   | `/api/conversations`      | `ConversationImport` | `{ importedCount: number, rejected: RejectedConversation[] }` |
| GET    | `/api/conversations`      | -                    | `ConversationSummary[]` (내 것만)                             |
| DELETE | `/api/conversations/{id}` | -                    | 없음                                                          |

```ts
ConversationImport = { courseId: number, conversations: ImportedConversation[] }
ImportedConversation = {
  clientId: string,                  // 프론트가 붙인 대화 id (파일 안의 id). 같은 대화를 다시 보내면 중복 저장하지 않는다
  source: "chatgpt" | "claude",
  title: string,
  createdAt?: string,                // ISO 문자열
  messages: { role: "user" | "assistant", text: string }[]
}
RejectedConversation = { clientId: string, reason: string }  // reason은 사용자에게 보여 줄 문구
ConversationSummary  = { id: number, courseId: number, source: string, title: string, createdAt: string | null, messageCount: number }
```

- 프론트는 **과목마다 요청을 따로** 보내고, 한 과목에 대화가 50개를 넘으면 50개씩 나눠 차례로 보낸다(`utils/conversation/send.ts`). 한 요청이 실패하면 거기서 멈추고 `message`를 보여 준다. 크기 제한이 정해지면 알려 주기.
- 목업(`mocks/conversations.ts`)은 개인정보 패턴이 남은 대화를 `rejected`로 돌려주는 서버 동작을 흉내 낸다.

서버에서도 검사해 주기:

- **개인정보 패턴을 한 번 더 검사한다.** 프론트는 이메일·전화번호·주민등록번호·카드번호·키·토큰·IP를 `[이메일]`, `[전화번호]`, `[주민등록번호]`, `[카드번호]`, `[키·토큰]`, `[IP]`처럼 가려서 보낸다. 서버는 이 패턴이 **그대로 남아 있는 대화는 저장하지 않고 `rejected`에 담아** 돌려준다(서버가 몰래 고쳐 저장하지 않는다). 대체 표시(`[이메일]` 등)는 개인정보가 아니므로 통과시킨다.
- 로그인한 사용자 소유의 `courseId`인지, `source` 값이 허용 목록인지, 역할 값이 `user`/`assistant`인지.
- 크기 제한: 한 번에 대화 50개, 대화당 메시지 500개, 메시지당 20,000자를 임시 제안값으로 둔다. 서버가 정해도 되고, 정해지면 알려 주기(프론트가 보내기 전에 같은 기준으로 안내한다).
- 서버 로그에 대화 본문을 남기지 않는다.
- AI 대화 분석 동의(`User.aiAnalysisConsent`)가 꺼져 있으면 403 + `message`("AI 대화 분석에 동의해야 대화를 가져올 수 있어요.").
- 대화를 저장한 뒤 분석(개념 분류 → 숙련도 계산 → 대시보드 반영)을 서버가 시작한다. 분석이 오래 걸리면 상태를 알려 줄 방법(예: `GET /api/analysis/status`)은 백엔드가 정해서 알려 주기.
- 대화 한 건 삭제(`DELETE`)와 동의 철회 때 삭제 범위: 저장된 대화, 그 대화에서 나온 개념 분류·근거(`evidence`), 그 근거로 계산한 점수. 점수는 남은 근거로 다시 계산한다.

### 퀴즈 — 화면 뼈대만 있음 (제안)

화면: `/quizzes`(목록), `/quizzes/{id}`(풀기), `/quizzes/{id}/result`(결과). 퀴즈는 올린 자료로 만든다(자료 → 요약·퀴즈 생성 API는 이 표에 아직 없고, 자료 처리 방식이 정해지면 따로 제안). 올린 본인만 볼 수 있다.

| 메서드 | 경로                            | 요청 본문               | 응답 `data`              |
| ------ | ------------------------------- | ----------------------- | ------------------------ |
| GET    | `/api/quizzes`                  | -                       | `QuizSummary[]`          |
| GET    | `/api/quizzes/{id}`             | -                       | `Quiz` (**정답 미포함**) |
| POST   | `/api/quizzes/{id}/submissions` | `{ answers: Answer[] }` | `QuizResult`             |

```ts
QuizSummary = { id: number, title: string, courseId: number, questionCount: number, lastCorrectCount: number | null }
Quiz        = { id: number, title: string, questions: { id: number, text: string, choices: string[] }[] }
Answer      = { questionId: number, choiceIndex: number }
QuizResult  = {
  submissionId: number,
  correctCount: number,
  totalCount: number,
  results: {
    questionId: number,
    correct: boolean,
    correctChoiceIndex: number,       // 제출 뒤에만 알려 준다
    conceptIds: string[],             // 이 문제가 다루는 개념 (대시보드 ConceptMastery.conceptId와 같은 값)
    aiExplanation: string | null      // 해설 (AI 글이므로 필드를 분리, 보라색 표시)
  }[]
}
```

- **채점은 서버 코드가 한다.** LLM은 해설(`aiExplanation`)만 쓰고 정오는 정하지 않는다.
- 풀이 전 `Quiz` 응답에 정답이 들어가면 안 된다.
- 제출 결과는 저장해서 대시보드 `evidence`에 `source: "quiz"`, `signal: "quiz_correct" | "quiz_wrong"`으로 나타나게 한다. 숙련도 점수에 어떻게 반영할지(가중치)는 미결이므로 설정값으로 두기.
- 같은 퀴즈를 여러 번 풀 수 있다. 목록의 `lastCorrectCount`는 가장 최근 제출 기준이다.

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
- 동적 배치는 아래 `layout` 필드로 받는다.

### 학습 대시보드 동적 배치 — 목업

LLM은 화면 코드를 만들지 않고, 정해진 영역의 순서·크기·이유만 JSON으로 준다. 프론트는 이 JSON을 zod로 검사해서 통과할 때만 그 배치로 보여 주고, 실패하면 기본 배치로 보여 준다(`frontend/src/utils/layout/dashboardLayout.ts`). backend `CLAUDE.md`대로 서버에서도 1차 검증해 주기.

`DashboardData`에 `layout` 필드를 붙인다(없으면 기본 배치):

```ts
layout = {
  generatedAt: "2026-10-25T14:00:00",
  aiSummary: string, // 전체 배치 이유 (AI), 120자까지
  basis: {
    // 배치를 만들 때 AI에게 준 숫자 (코드가 센 값)
    weaknessCount: number, // 보완 필요 개념 수
    askedAgainCount: number, // 다시 설명 요청 횟수
    conversationCount: number, // 분석한 대화 수
  },
  items: [
    {
      component:
        "summary" |
        "mastery" |
        "conceptDetail" |
        "recommendation" |
        "courseShare" |
        "conceptTable", // 10/27 추가: 개념별 상세 결과 표
      order: number, // 1부터, 겹치지 않게
      size: "wide" | "normal",
      aiReason: string, // 이 위치·크기인 이유 (AI), 80자까지
    },
  ],
};
```

- **영역 id에 `conceptTable`(개념별 상세 결과 표)이 10/27에 추가됐다.** 서버 검증의 허용 목록에도 넣어 주기. 배치에서 빠진 영역은 프론트가 기본 순서로 뒤에 붙이므로 모든 영역을 다 넣지 않아도 된다.
- **AI에게는 코드가 계산한 숫자만 주고 이유를 쓰게 하기.** 프론트는 이유 옆에 `basis` 숫자를 같이 보여 주므로, AI가 숫자를 지어내면 사용자가 바로 알아챈다.
- **매번 AI를 부르지 않기.** 새 대화·퀴즈 결과가 들어왔을 때만 새로 만들고, 만든 배치를 저장해 두었다가 대시보드 요청 때 같이 보낸다. `basis`도 그때 값을 저장해야 이유와 숫자가 어긋나지 않는다.
- 저장 방법 제안(백엔드가 정할 부분): 사용자별로 만들 때마다 한 줄씩 쌓는 표 하나. `id`, `user_id`, `layout_json`(위 JSON 전체를 TEXT로, H2와 함께 쓰므로 DB 전용 JSON 타입은 피함), `model`(어떤 모델이 만들었는지), `created_at`. 지난 배치가 남아 있으면 2단계 "약점 변화 추이"에도 쓸 수 있다.

## 5. 정해 주면 프론트가 맞출 것

- **인증 방식:** 요청·응답 제안은 위 3번 "인증·마이페이지"에 있다. 다른 방식으로 정하면 알려 주기. 배포 때 같은 출처(rewrite)라 쿠키 설정이 단순해진다.
- **자료 올리기:** 지원 형식(프론트 안: PDF·PPTX·HWP·HWPX), 최대 크기, 원본 보관 여부(루트 `CLAUDE.md` 미결 사항). 텍스트 추출 후보는 PDF·PPTX는 Apache Tika 또는 PDFBox, HWP·HWPX는 hwplib·hwpxlib.
- **비밀번호 규칙:** 서버도 프론트와 같은 4조건(8자 이상, 영문, 숫자, 특수문자 포함)으로 검사한다(`PasswordPolicy`). 추가로 BCrypt 한도 때문에 72바이트를 넘으면 거절한다(프론트에는 표시 조건이 없고 서버 `message`로 안내). 거절 사유는 어긴 첫 번째 규칙을 `message`로 준다.
- **배포:** 백엔드 주소가 정해지면 Vercel rewrite 대상만 바꾸면 된다.
- **개인정보처리방침(`/privacy`, 초안):** 서버가 실제로 하는 처리(저장 항목, 보관·삭제, 토큰, 로그에 남기는 것, LLM·호스팅 서비스)를 기준으로 썼다(`frontend/src/pages/privacy/PrivacyPage.tsx`). 서버 동작이 이 문서와 달라지거나 LLM 제공사·호스팅·자료 원본 보관이 정해지면 알려 주기. 같은 PR에서 처리방침도 고친다.

## 6. 이 문서 고치는 법

- 백엔드가 API를 확정하거나 바꾸면 Swagger 또는 API 문서를 기준으로 하고, 이 문서의 해당 부분은 "확정: (문서 위치)"로 바꾸거나 지운다.
- 프론트가 새 화면에서 API가 필요해지면 여기에 제안을 추가하고 PR에 적는다.

# CLAUDE.md — backend

루트 `CLAUDE.md`의 원칙(미결 사항, 개인정보 처리, 점수는 코드로 계산)을 먼저 따른다.

## 스택

Spring Boot 3.x, Java 17, Gradle, Spring Web, Spring Data JPA, Spring Security, Validation,
Lombok, springdoc-openapi(Swagger)

## 명령어

```bash
./gradlew bootRun    # 로컬 실행 (http://localhost:8080)
./gradlew test       # 테스트
./gradlew build      # 빌드
```

Swagger UI: `/swagger-ui/index.html` — 프론트와 API를 맞출 때 이 문서를 기준으로 한다.

## 패키지 구조 (레퍼런스 프로젝트 방식)

```
<base-package>/
├── BackendApplication.java
├── domain/
│   └── <기능>/            auth, user, material, conversation, analysis,
│       ├── api/           quiz, curriculum, chatbot, notice
│       ├── application/   서비스(비즈니스 로직)
│       ├── dao/           JPA Repository
│       ├── dto/           요청·응답 DTO (Entity를 직접 응답하지 않는다)
│       └── entity/
└── global/
    ├── common/            ApiResponse 등 공통 응답
    ├── config/            CORS, Swagger, 웹 설정
    ├── error/             전역 예외 처리 (@RestControllerAdvice)
    ├── security/          Security 설정, JWT
    ├── llm/               LLM 클라이언트 인터페이스 (제공사 미정, 아래 참고)
    └── storage/           파일 저장 인터페이스 (로컬 / S3 구현 분리)
```

## API 규칙

- **프론트가 기대하는 API·응답 형식·우선순위는 `docs/frontend-requests.md`에 있다. API를 만들기 전에 먼저 읽는다.**
- 경로: `/api/<기능>` (예: `/api/materials`, `/api/analysis/dashboard`)
- 응답은 항상 `ApiResponse<T>`: `{ success, message, data }`
- 요청 DTO는 Bean Validation(`@Valid`, `@NotBlank` 등)으로 검증한다.
- 오류는 전역 예외 처리에서 일관된 형식과 적절한 HTTP 상태 코드로 반환하고, 스택트레이스나 내부 정보를 노출하지 않는다.

## 보안

- 인증 기본 방향: JWT access token + HttpOnly 쿠키 refresh token (레퍼런스 프로젝트 방식)
- 비밀번호는 BCrypt로 해시. 평문 저장·로그 출력 금지.
- 모든 사용자 데이터 조회·수정은 로그인 사용자 소유인지 확인한다 (다른 사용자 id로 접근 차단).
- DB 접속 정보, JWT 시크릿, LLM API 키, AWS 키는 `application.yaml`에 환경변수 참조로만 쓴다.
- CORS 허용 출처는 설정값으로 관리한다 (로컬: `http://localhost:5173`).
- 업로드 파일은 확장자·크기·MIME을 검증한다.

## CI와 main 보호

- `main`은 삭제·강제 푸시가 막혀 있고, 프론트 CI(`build-and-lint`)는 머지 필수 검사다(10/27). 백엔드 CI(`build-and-test`, `mysql-test`)는 **아직 필수가 아니다**: 규칙셋 "backend CI required"는 만들어 두고 꺼 둔 상태이고, `backend-ci.yml`의 PR 실행은 `backend/**` 변경이 있을 때만 돈다.
- 백엔드 CI를 필수로 켤 때(백엔드 작업이 본격화되면 주미와 정하기): `backend-ci.yml`의 `pull_request`에서 `paths` 줄을 지우고, GitHub Settings → Rules → Rulesets에서 "backend CI required"를 Active로 바꾼다. 순서가 반대면 backend 밖만 바꾼 PR이 머지되지 않는다. 자세한 건 `backend-ci.yml` 위쪽 주석.
- 필수 검사 이름은 workflow의 job 이름(`build-and-test`, `mysql-test`)과 같아야 한다. job 이름을 바꾸면 규칙셋의 검사 이름도 같이 고친다.

## 미결 사항 처리 방법

- **LLM:** 제공사·모델 수가 미정이므로 `global/llm`에 인터페이스를 두고 구현체를 설정으로 고른다. 여러 모델이 독립 판단 → 결과 비교·통합하는 구조로 확장할 수 있게 설계한다. 키가 없을 때는 mock 구현체로 동작하게 한다.
- **숙련도 점수:** 대화 분류 결과(이해 못 함 / 재설명 요청 / 스스로 활용)와 퀴즈 정답률을 받아 점수를 계산하는 클래스를 분리하고, 가중치는 설정값으로 둔다. LLM이 점수를 직접 매기지 않는다. 계산 로직에는 단위 테스트를 작성한다.
- **DB:** MySQL로 시작(잠정, 10/27 멘토링 뒤 최종), 로컬은 H2. 두 DB에서 모두 돌도록 특정 DB 전용 문법을 쓰지 않는다. 루트 `CLAUDE.md`의 미결 사항 참고.
- **배치 JSON:** LLM이 출력한 화면 배치 JSON은 서버에서도 허용 컴포넌트 목록 기준으로 1차 검증한 뒤 프론트에 전달한다.

## 대화 가져오기 API

- 프론트에서 마스킹이 끝난 대화만 받는다. 그래도 서버에서 한 번 더 개인정보 패턴을 검사한다.
- 사용자가 AI 대화 분석 동의를 철회하면 가져온 대화와 그로부터 계산된 분석 결과를 함께 삭제한다.

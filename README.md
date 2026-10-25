<div align="center">
  <strong>KOR</strong> | <a href="README.en.md">ENG</a>
</div>

# ai-lms

[![Frontend CI](https://github.com/SpicyShrimpChip/lms/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/SpicyShrimpChip/lms/actions/workflows/frontend-ci.yml)

학습 자료와 ChatGPT·Claude 등 생성형 AI 대화 기록을 분석해 개념별 강점·약점을 진단하고,
요약·퀴즈·커리큘럼·챗봇·대시보드로 학습 순서를 계속 다시 짜 주는 개인 맞춤형 LMS입니다.

## 왜 만드나요

AI로 공부하면 대화가 여러 서비스에 흩어지고, 새 대화를 열 때마다 같은 배경 설명을 반복하게 됩니다.
공부는 많이 했는데 무엇을 알고 어디가 부족한지는 알기 어렵습니다.
이 서비스는 흩어진 학습 기록을 모아 개념별 이해 정도를 보여 주고, 부족한 부분부터 다시 공부할 수 있게 학습 순서를 제안합니다.

## 시작하는 두 가지 방법

같은 서비스에서 가진 데이터에 따라 시작 경로만 다릅니다.

- **AI 대화 기록이 많다면:** ChatGPT·Claude 공식 내보내기 파일을 가져와 바로 분석합니다.
- **AI 대화 기록이 적다면:** 학습 자료를 올려 요약·퀴즈로 시작합니다. 사이트 안의 챗봇·퀴즈 기록이 쌓이면 같은 방식으로 분석합니다.

## 주요 기능

| 기능 | 설명 |
|---|---|
| 학습 자료 업로드 | 올린 자료에서 주제와 핵심 개념을 뽑아 학습에 사용 |
| AI 대화 가져오기 | ChatGPT·Claude 내보내기 파일을 브라우저에서 파싱 (Gemini는 2단계 검토) |
| 자동 요약 | 핵심 개념과 내용별 요약 |
| 맞춤 퀴즈 | 자료와 약점 개념을 바탕으로 문제를 만들고, 결과를 숙련도 분석에 반영 |
| 맞춤 커리큘럼 | 현재 이해도에 따라 학습 순서를 추천하고 "이 순서인 이유"를 함께 표시 |
| 자료 기반 챗봇 | 올린 자료를 근거로 질문에 답하고, 대화 기록도 분석에 사용 |
| 학습 대시보드 | 학습량, 주제별 집중도, 개념별 숙련도, 강점·약점과 그 판단 근거 |
| AI 요약 영상 | 준비 중 |

## 설계 원칙

- **원본 대화 파일은 서버로 보내지 않습니다.** 브라우저에서 파싱 → 학습 키워드 필터 → 개인정보 마스킹을 거친 뒤, 사용자가 고른 대화만 전송합니다.
- **점수는 코드로 계산합니다.** 숙련도는 대화 분류 결과와 퀴즈 정답률을 명시적인 규칙으로 계산하고, LLM은 그 근거를 설명하는 역할만 합니다. 화면에는 판단 근거를 함께 보여 줍니다.
- **LLM은 화면 코드를 만들지 않습니다.** 미리 정의된 컴포넌트의 배치 정보만 JSON으로 받고, 스키마 검증을 통과한 경우에만 사용합니다. 실패하면 기본 배치를 씁니다.

## 기술 스택

- **Frontend:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 7, TanStack Query, Zustand, Axios
- **Backend:** Spring Boot 3.5, Java 17, Gradle, Spring Security(JWT), Spring Data JPA, Flyway, MySQL 8 (테스트용 H2)
- **LLM:** 제공사 미정. 여러 모델이 각각 판단한 결과를 비교·통합할 수 있는 구조로 설계
- **개발 환경:** ESLint, Prettier, Husky + lint-staged, GitHub Actions, Renovate

## 폴더 구조

```text
.
├── frontend/   React 앱
├── backend/    Spring Boot API
├── docs/       기획·인수인계 문서
└── .github/    CI 워크플로, Renovate 설정
```

## 로컬 실행

> Node.js 24가 필요합니다 (CI와 같은 버전).

### Frontend

```bash
git clone https://github.com/SpicyShrimpChip/lms.git
cd lms/frontend
npm ci
npm run dev
```

- 개발 서버: http://localhost:5173
- 기본 환경변수는 `frontend/.env.development`에 있습니다. 내 PC에서만 바꿀 값은 `frontend/.env.local`에 두면 커밋되지 않습니다.
- `npm ci`를 실행하면 Git 훅도 함께 설치됩니다. 커밋할 때 lint-staged, push할 때 타입 체크가 실행됩니다.

### Backend

> JDK 17과 MySQL 8이 필요합니다. 설계는 [`docs/backend-design.md`](docs/backend-design.md)를 참고하세요.

```bash
cd lms/backend
./db/configure-local-env.sh # 처음 한 번: 이미 만든 DB·계정으로 backend/.env 생성 (DB·계정까지 새로 만들 때는 ./db/setup-local-mysql.sh)
./gradlew bootRun           # http://localhost:8080 (로컬 MySQL, 테이블은 Flyway가 자동 생성)
./gradlew test              # H2 메모리 DB로 테스트
./gradlew mysqlTest         # 같은 테스트를 로컬 MySQL(ai_lms_test)로 실행
```

- API 문서(Swagger): http://localhost:8080/swagger-ui/index.html
- 비밀값(DB 비밀번호, JWT 시크릿)은 `backend/.env`(커밋 안 됨)에만 둡니다. 형식은 `backend/.env.example` 참고.
- MySQL 없이 띄우려면 `SPRING_PROFILES_ACTIVE=default ./gradlew bootRun` (H2 메모리 DB, 재시작하면 데이터가 사라짐).
- 프론트에서 실제 API로 확인하려면 `frontend/.env.development.local`에 `VITE_USE_MOCK=false`를 넣습니다.

## 개발 규칙

- 브랜치: `feat/<범위>`, `fix/<범위>`, `chore/<범위>`, `docs/<범위>`
- 커밋: `feat: 학습 대시보드 숙련도 표 추가`처럼 타입 + 한국어 설명
- `main`에는 PR로만 합치고, CI 통과를 확인한 뒤 머지합니다. 리뷰 승인은 필수가 아니며, API처럼 상대 작업에 영향을 주는 변경은 상대방에게 알립니다.
- 프로젝트 규칙과 미결 사항은 [`CLAUDE.md`](CLAUDE.md)에 정리되어 있습니다.

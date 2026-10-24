<div align="center">
  <a href="README.md">ENG</a> | <strong>KOR</strong>
</div>

# ❖ React + Vite Boilerplate

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
[![CI Pipeline](https://img.shields.io/github/actions/workflow/status/pandemoniummm/react-vite-boilerplate/ci.yml?style=for-the-badge&label=CI%20Pipeline)](https://github.com/pandemoniummm/react-vite-boilerplate/actions)

Vite와 React 18 기반의 프론트엔드 보일러플레이트입니다.
상태 관리, 네트워크 통신, 라우팅 및 CI 파이프라인 등 프론트엔드 개발에 필요한 핵심 인프라가 사전 구성되어 있으며,
정적 호스팅 환경에 안정적으로 배포할 수 있도록 최적화되어 있습니다.

## ⚙︎ 기술 스택 (Tech Stack)

- **Core:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State & Data Management:**
  - Zustand
  - React Query / TanStack
  - Axios
- **Code Quality & Automation:**
  - ESLint v10 + Prettier
  - Husky + lint-staged
  - GitHub Actions
  - Renovate Bot

## ⚑ 핵심 아키텍처 설계 (Key Features)

### ◼︎ 선언적 비동기 처리 (`AsyncBoundary`)

Toss(토스)의 프론트엔드 아키텍처 레퍼런스를 참고하여 Suspense와 ErrorBoundary를 결합한 `AsyncBoundary` 컴포넌트를 적용했습니다. 비동기 데이터 패칭 시 발생하는 로딩과 에러 상태 처리를 컴포넌트 외부로 선언적으로 위임하여, 내부의 복잡한 분기 로직(if)을 제거하고 오직 비즈니스 로직과 UI 렌더링에만 집중할 수 있는 높은 개발 자유도를 제공합니다. 추가적으로, 요구사항에 따라 **로딩(Suspense)이나 에러(ErrorBoundary) 중 하나의 상태 처리만 필요한 경우에도 유연하게 독립적으로 사용할 수 있도록 커스텀 설계**하여 컴포넌트의 재사용성을 극대화했습니다.

### ◼︎ 상태 관리의 관심사 분리 (Client vs Server State)

클라이언트 상태와 서버 상태의 관심사를 명확하게 분리하여 단일 스토어의 비대화를 방지합니다. 클라이언트의 UI 전역 상태는 `Zustand`로 가볍게 관리하고, 서버 데이터 패칭 및 캐싱은 `React Query`에 전적으로 위임하여 예측 가능한 상태 흐름을 구축했습니다.

### ◼︎ 배열 기반 라우팅 (Array-based Routing)

React Router v6의 `createBrowserRouter`를 활용하여 컴포넌트 형태(JSX)가 아닌 JavaScript 객체 배열 형태로 라우팅을 관리합니다. 라우트 정의를 View와 분리하여 가독성을 높이고, 추후 Lazy Loading 및 코드 스플리팅 확장성에 유리한 구조를 채택했습니다.

### ◼︎ 절대 경로 및 바렐 패턴 (Barrel Pattern)

절대 경로(`@/`) 설정과 바렐 패턴(`index.ts`)을 적용하여 모듈 임포트 경로를 일관성 있고 간결하게 유지합니다.

```tsx
import { Button, Modal } from '@/components';
```

### ◼︎ 개발자 경험(DX) 극대화: 파일 네스팅 (File Nesting)

루트 디렉토리의 시각적 노이즈를 제거하기 위해 VSCode의 파일 네스팅(File Nesting) 설정을 팀 공통 환경(`.vscode/settings.json`)으로 구성했습니다. `.prettierrc`, `vite.config.ts.timestamp-*` 등의 설정 파일들을 논리적으로 그룹화하여, 핵심 코드에만 집중할 수 있는 미니멀한 작업 환경을 제공합니다.

### ◼︎ 인프라 자동화

- **CI 파이프라인**: GitHub Actions를 통해 PR 생성 시 Lint 및 Build 테스트를 자동화하여 코드 품질을 유지합니다.
- **의존성 관리**: Renovate 봇을 통해 정기적으로 패키지 업데이트를 감지하고 통합 관리합니다.
- **CD 파이프라인 (의도적 배제)**: 특정 호스팅 플랫폼에 종속되지 않습니다. Vercel 등 모던 PaaS의 자체 배포(Auto Deployment) 시스템을 그대로 활용하거나, AWS 등 프로젝트 환경에 맞춰 자유롭게 파이프라인을 구성할 수 있습니다.

## 📁︎ 폴더 구조 (Project Structure)

```text
src/
├── api/            # Axios 인스턴스 & 인터셉터
├── components/     # 공통 UI 컴포넌트 & AsyncBoundary
├── constants/      # 전역 상수 & ENUM 데이터
├── hooks/          # 커스텀 훅 (React Hooks)
├── pages/          # 페이지 컴포넌트
├── router/         # 라우터 설정
├── store/          # Zustand 전역 상태 스토어
├── styles/         # 전역 CSS & Tailwind 설정
├── types/          # TypeScript 타입 정의
└── utils/          # 유틸리티 함수
```

## ▶︎ 시작 가이드 (Quick Start)

> **Node.js 18+** 환경이 필요합니다.

1. **프로젝트 스캐폴딩**

```bash
npx degit https://github.com/pandemoniummm/react-vite-boilerplate.git [YOUR_PROJECT_NAME]
cd [YOUR_PROJECT_NAME]
```

2. **의존성 패키지 설치**

```bash
npm install
```

3. **환경 변수 셋업**

```bash
cp .env.development .env
```

4. **로컬 개발 서버 구동**

```bash
npm run dev
```

---

<div align="center">
  <p>
    <i>Built with a strict YAGNI philosophy.</i><br>
    <i>Focus on Core Logic · Maximize DX · Zero Over-engineering</i>
  </p>
  <p>
    &copy; 2026 <strong>pandemoniummm</strong>. All rights reserved.<br/>
    This project is licensed under the <a href="https://opensource.org/licenses/MIT">MIT License</a>.
  </p>
</div>

---

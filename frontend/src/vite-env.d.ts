// TS에 .env의 존재를 알리고 주입

// TS 특수 명령어: vite 기본 규칙 적용
/// <reference types="vite/client" />

// 커스텀 환경변수 명세서 (API 키 추가 시 작성)
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

// TS 시스템에 명세서 강제 병합
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

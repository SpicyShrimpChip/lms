import type { FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  // TODO: 프로젝트 시작 시 디자인에 맞춰 에러 페이지 UI를 수정
  return (
    <div>
      <h2>Something went wrong.</h2>
      {/* error가 표준 Error 객체임을 TS에 명시 (타입 단언) */}
      <p>{(error as Error).message}</p>

      {/* 기능적 가이드: 에러 초기화 및 재요청을 위해 resetErrorBoundary 함수를 버튼 클릭 이벤트에 반드시 바인딩해야 합니다. */}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

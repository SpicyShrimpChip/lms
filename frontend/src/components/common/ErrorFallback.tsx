import { CircleAlert } from 'lucide-react';
import type { FallbackProps } from 'react-error-boundary';
import Button from './Button';

// AsyncBoundary 안에서 요청이 실패했을 때 보여 주는 화면
// ApiError는 화면에 그대로 보여 줄 수 있는 문구를 담고 있다 (api/request.ts)
export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const message =
    error instanceof Error && error.message
      ? error.message
      : '잠시 후 다시 시도해 주세요.';

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl bg-surface-muted px-6 py-14 text-center"
    >
      <CircleAlert size={28} aria-hidden="true" className="text-danger" />
      <p className="text-lg font-bold text-heading">내용을 불러오지 못했어요</p>
      <p className="max-w-120 text-body leading-relaxed text-ink-soft">
        {message}
      </p>
      <Button onClick={resetErrorBoundary} className="mt-2">
        다시 시도
      </Button>
    </div>
  );
}

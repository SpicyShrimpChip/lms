import { LoaderCircle } from 'lucide-react';

// AsyncBoundary 안에서 데이터를 불러오는 동안 보여 주는 화면
export default function LoadingFallback() {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 py-14 text-body text-ink-muted"
    >
      <LoaderCircle
        size={20}
        aria-hidden="true"
        className="animate-spin text-primary motion-reduce:animate-none"
      />
      불러오는 중이에요
    </div>
  );
}

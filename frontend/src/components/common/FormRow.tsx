import type { ReactNode } from 'react';

interface FormRowProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  // 입력 오류 문구. 입력칸에는 aria-describedby={`${htmlFor}-error`}를 붙인다
  error?: string;
  children: ReactNode;
}

// 폼 한 줄: 왼쪽 회색 라벨 칸, 오른쪽 입력 칸 (휴대폰 폭에서는 위아래로 쌓인다)
function FormRow({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: FormRowProps) {
  return (
    <div className="grid grid-cols-1 border-b border-line md:grid-cols-[180px_minmax(0,1fr)]">
      <label
        htmlFor={htmlFor}
        className="bg-surface-muted px-4 py-3 text-body font-medium text-ink-soft md:py-4"
      >
        {label}
        {required && (
          <span className="ml-1 text-primary">
            *<span className="sr-only">필수</span>
          </span>
        )}
      </label>
      <div className="flex flex-col gap-1.5 px-4 py-3">
        {children}
        {error !== undefined && (
          <p
            id={`${htmlFor}-error`}
            aria-live="polite"
            className="text-caption text-danger"
          >
            {error}
          </p>
        )}
        {hint && <p className="text-caption text-ink-muted">{hint}</p>}
      </div>
    </div>
  );
}

export default FormRow;

import type { ComponentProps } from 'react';

// 공통 입력 칸. 나머지 속성(id, type, required 등)은 그대로 input에 넘긴다
function TextInput({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={`h-10 rounded-md border border-input-border bg-surface px-3 text-body outline-none placeholder:text-ink-muted focus:border-primary ${className}`}
    />
  );
}

export default TextInput;

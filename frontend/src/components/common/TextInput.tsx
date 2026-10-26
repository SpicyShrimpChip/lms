import type { ComponentProps } from 'react';
import { FIELD_CLASS } from './fieldClass';

// 공통 입력 칸. 나머지 속성(id, type, required 등)은 그대로 input에 넘긴다
function TextInput({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={`h-11 px-3 placeholder:text-ink-muted ${FIELD_CLASS} ${className}`}
    />
  );
}

export default TextInput;

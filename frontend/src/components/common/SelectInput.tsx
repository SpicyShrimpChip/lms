import type { ComponentProps } from 'react';
import { cn } from '@/utils';
import { FIELD_CLASS } from './fieldClass';

// 공통 선택 칸. 모양은 TextInput과 같다
function SelectInput({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select {...props} className={cn('h-11 px-3', FIELD_CLASS, className)} />
  );
}

export default SelectInput;

import { describe, expect, it } from 'vitest';
import { twMerge } from 'tailwind-merge';
import { cn } from './cn';

describe('cn', () => {
  it('직접 만든 글자 크기 토큰과 글자 색을 둘 다 남긴다', () => {
    expect(cn('text-caption', 'text-ink-soft')).toBe(
      'text-caption text-ink-soft',
    );
    expect(cn('text-body text-heading')).toBe('text-body text-heading');
  });

  it('설정 없는 twMerge는 글자 크기 토큰을 지운다 (설정이 필요한 이유)', () => {
    expect(twMerge('text-caption', 'text-ink-soft')).toBe('text-ink-soft');
  });

  it('같은 종류의 클래스는 뒤에 온 값만 남긴다', () => {
    expect(cn('gap-1', 'gap-1.5')).toBe('gap-1.5');
    expect(cn('text-caption', 'text-body')).toBe('text-body');
    expect(cn('rounded-2xl p-6', 'rounded-xl')).toBe('p-6 rounded-xl');
  });

  it('페이지 폭 토큰을 다른 최대 폭과 겹치는 값으로 본다', () => {
    expect(cn('max-w-page', 'max-w-xl')).toBe('max-w-xl');
  });

  it('조건이 거짓이거나 값이 없으면 빼고 잇는다', () => {
    expect(cn('px-2', false, undefined, null, '', 'py-1')).toBe('px-2 py-1');
  });
});

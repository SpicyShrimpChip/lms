import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD로 바꾼다', () => {
    expect(formatDate('2026-03-05T12:00:00')).toBe('2026-03-05');
  });

  it('비었거나 날짜가 아니면 null', () => {
    expect(formatDate(undefined)).toBeNull();
    expect(formatDate(null)).toBeNull();
    expect(formatDate('어제')).toBeNull();
  });
});

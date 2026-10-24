import { describe, expect, it } from 'vitest';
import {
  compareSemesterDesc,
  formatSemester,
  getCurrentSemester,
  getSemesterOptions,
} from './semester';

describe('getCurrentSemester', () => {
  it.each([
    ['2026-03-02', '2026-1'],
    ['2026-07-15', '2026-summer'],
    ['2026-10-24', '2026-2'],
    ['2027-01-10', '2026-winter'],
  ])('%s → %s', (date, expected) => {
    expect(getCurrentSemester(new Date(`${date}T12:00:00`))).toBe(expected);
  });
});

describe('formatSemester', () => {
  it('학기 코드를 읽기 쉬운 이름으로 바꾼다', () => {
    expect(formatSemester('2026-2')).toBe('2026년 2학기');
    expect(formatSemester('2026-summer')).toBe('2026년 여름학기');
  });
});

describe('getSemesterOptions', () => {
  it('현재 학기를 포함하고 최근 학기가 위로 온다', () => {
    const options = getSemesterOptions(new Date('2026-10-24T12:00:00'));
    expect(options).toContain('2026-2');
    expect([...options].sort(compareSemesterDesc)).toEqual(options);
  });
});

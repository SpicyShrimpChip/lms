import { describe, expect, it } from 'vitest';
import { KEYWORD_MAX_COUNT, addKeywords, normalizeKeyword } from './keywords';

describe('normalizeKeyword', () => {
  it('앞뒤 공백을 지우고 안쪽 공백을 한 칸으로 줄인다', () => {
    expect(normalizeKeyword('  교착   상태 ')).toBe('교착 상태');
  });
});

describe('addKeywords', () => {
  it('쉼표로 나눈 여러 키워드를 한 번에 넣는다', () => {
    expect(addKeywords([], '프로세스, 스케줄링,페이징').keywords).toEqual([
      '프로세스',
      '스케줄링',
      '페이징',
    ]);
  });

  it('빈 값과 대소문자만 다른 중복은 건너뛴다', () => {
    const result = addKeywords(['CPU'], ' , cpu, 캐시');
    expect(result.keywords).toEqual(['CPU', '캐시']);
    expect(result.error).toBeUndefined();
  });

  it('너무 긴 키워드는 넣지 않고 안내 문구를 돌려준다', () => {
    const result = addKeywords([], 'a'.repeat(21));
    expect(result.keywords).toEqual([]);
    expect(result.error).toMatch(/20자까지/);
  });

  it('최대 개수를 넘기면 거기서 멈춘다', () => {
    const full = Array.from({ length: KEYWORD_MAX_COUNT }, (_, i) => `k${i}`);
    const result = addKeywords(full, '하나 더');
    expect(result.keywords).toHaveLength(KEYWORD_MAX_COUNT);
    expect(result.error).toMatch(/20개까지/);
  });
});

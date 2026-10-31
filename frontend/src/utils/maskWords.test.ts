import { describe, expect, it, vi } from 'vitest';
import {
  clearMaskWords,
  loadMaskWords,
  maskWordsKey,
  saveMaskWords,
  subscribeMaskWords,
} from './maskWords';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
};

describe('가릴 단어 저장', () => {
  it('계정별 키로 나눠 저장하고 읽는다', () => {
    const storage = memoryStorage();
    saveMaskWords(1, ['OO대학교', '20231234'], storage);
    saveMaskWords(2, ['다른 회사'], storage);

    expect(loadMaskWords(1, storage)).toEqual(['OO대학교', '20231234']);
    expect(loadMaskWords(2, storage)).toEqual(['다른 회사']);
    expect(loadMaskWords(3, storage)).toEqual([]);
  });

  it('공백·빈 단어·겹치는 단어를 정리한다', () => {
    const storage = memoryStorage();
    saveMaskWords(1, [' OO대학교 ', '', 'OO대학교', '서울'], storage);
    expect(loadMaskWords(1, storage)).toEqual(['OO대학교', '서울']);
  });

  it('값이 그대로면 같은 배열을 돌려준다', () => {
    const storage = memoryStorage();
    saveMaskWords(1, ['서울'], storage);
    expect(loadMaskWords(1, storage)).toBe(loadMaskWords(1, storage));
  });

  it('깨진 값은 저장한 단어가 없는 것으로 본다', () => {
    const storage = memoryStorage();
    storage.setItem(maskWordsKey(1), '{망가짐');
    expect(loadMaskWords(1, storage)).toEqual([]);
    storage.setItem(maskWordsKey(1), JSON.stringify(['서울', 3, null]));
    expect(loadMaskWords(1, storage)).toEqual(['서울']);
  });

  it('지우면 키를 없애고 구독자에게 알린다', () => {
    const storage = memoryStorage();
    const listener = vi.fn();
    const unsubscribe = subscribeMaskWords(listener);
    saveMaskWords(1, ['서울'], storage);
    clearMaskWords(1, storage);
    unsubscribe();

    expect(storage.data.has(maskWordsKey(1))).toBe(false);
    expect(loadMaskWords(1, storage)).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('저장소를 쓸 수 없어도 멈추지 않는다', () => {
    expect(loadMaskWords(1, null)).toEqual([]);
    expect(() => saveMaskWords(1, ['서울'], null)).not.toThrow();
  });
});

import { describe, expect, it } from 'vitest';
import { checkPassword, isPasswordValid } from './password';

const metIds = (password: string) =>
  checkPassword(password)
    .filter((rule) => rule.met)
    .map((rule) => rule.id);

describe('checkPassword', () => {
  it('빈 값은 어떤 조건도 충족하지 않는다', () => {
    expect(metIds('')).toEqual([]);
  });

  it('조건별로 충족 여부를 알려 준다', () => {
    expect(metIds('abcdefgh')).toEqual(['length', 'letter']);
    expect(metIds('1234567')).toEqual(['digit']);
    expect(metIds('a1!')).toEqual(['letter', 'digit', 'special']);
  });

  it('공백은 특수문자로 치지 않는다', () => {
    expect(metIds('abc def1')).not.toContain('special');
    expect(metIds('a_b~c`d{e|f}g[h]')).toContain('special');
  });

  it('한글만 있으면 영문 조건을 충족하지 않는다', () => {
    expect(metIds('비밀번호입니다요')).toEqual(['length']);
  });
});

describe('isPasswordValid', () => {
  it('4가지 조건을 모두 충족해야 통과한다', () => {
    expect(isPasswordValid('abcd1234!')).toBe(true);
    expect(isPasswordValid('abcd1234')).toBe(false);
    expect(isPasswordValid('Ab1!')).toBe(false);
  });
});

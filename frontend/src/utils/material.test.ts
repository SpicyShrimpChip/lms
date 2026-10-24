import { describe, expect, it } from 'vitest';
import { validateMaterialFile } from './material';

const MB = 1024 * 1024;

describe('validateMaterialFile', () => {
  it('지원하는 형식은 대소문자 구분 없이 통과한다', () => {
    expect(
      validateMaterialFile({ name: '노트.PDF', size: MB }),
    ).toBeUndefined();
    expect(validateMaterialFile({ name: 'a.b.md', size: 10 })).toBeUndefined();
  });

  it('지원하지 않는 형식과 확장자 없는 파일은 거절한다', () => {
    expect(validateMaterialFile({ name: 'a.exe', size: 10 })).toMatch(/파일만/);
    expect(validateMaterialFile({ name: 'pdf', size: 10 })).toMatch(/파일만/);
  });

  it('빈 파일과 너무 큰 파일은 거절한다', () => {
    expect(validateMaterialFile({ name: 'a.txt', size: 0 })).toMatch(/빈 파일/);
    expect(validateMaterialFile({ name: 'a.txt', size: 21 * MB })).toMatch(
      /MB/,
    );
  });
});

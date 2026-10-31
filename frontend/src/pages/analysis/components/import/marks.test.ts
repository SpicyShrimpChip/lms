import { describe, expect, it } from 'vitest';
import { MASK_LABELS } from '@/utils';
import { markPattern, remarkMarks, splitMarks } from './marks';

describe('대화 보기 칠하기', () => {
  it('가린 표시는 mask, 찾은 단어는 keyword로 나눈다', () => {
    const pattern = markPattern(['RSA']);
    const parts = splitMarks(
      `${MASK_LABELS.email}로 rsa 질문을 보냈어요`,
      pattern,
    );
    expect(parts.filter((part) => part.kind)).toEqual([
      { text: MASK_LABELS.email, kind: 'mask' },
      { text: 'rsa', kind: 'keyword' },
    ]);
    expect(parts.map((part) => part.text).join('')).toBe(
      `${MASK_LABELS.email}로 rsa 질문을 보냈어요`,
    );
  });

  it('긴 단어를 먼저 찾고 정규식 특수 문자는 글자로 본다', () => {
    const pattern = markPattern(['C', 'C++']);
    expect(splitMarks('C++와 C', pattern).filter((part) => part.kind)).toEqual([
      { text: 'C++', kind: 'keyword' },
      { text: 'C', kind: 'keyword' },
    ]);
  });

  it('마크다운 글 조각만 바꾸고 코드 블록은 그대로 둔다', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'RSA 설명' }],
        },
        { type: 'code', value: 'RSA()' },
      ],
    };
    remarkMarks({ pattern: markPattern(['RSA']) })(tree);

    const paragraph = tree.children[0] as { children: { type: string }[] };
    expect(paragraph.children.map((child) => child.type)).toEqual([
      'mark',
      'text',
    ]);
    expect(tree.children[1]).toEqual({ type: 'code', value: 'RSA()' });
  });
});

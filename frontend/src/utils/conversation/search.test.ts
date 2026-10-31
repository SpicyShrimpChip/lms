import { describe, expect, it } from 'vitest';
import { searchConversation, sortConversations } from './search';
import type { ParsedConversation } from './types';

function conversation(
  id: string,
  title: string,
  createdAt: string | undefined,
  texts: string[] = [],
): ParsedConversation {
  return {
    id,
    source: 'claude',
    title,
    createdAt,
    messages: texts.map((text, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      text,
    })),
  };
}

describe('searchConversation', () => {
  const sample = conversation(
    'a',
    '운영체제 정리',
    '2026-10-20T00:00:00.000Z',
    [
      '안녕하세요',
      '식사하는 철학자 문제에서\n교착 상태가 생기는 이유는 네 가지 조건이 동시에 성립하기 때문이에요',
    ],
  );

  it('검색어가 비어 있으면 모두 통과', () => {
    expect(searchConversation(sample, '  ')).toEqual({ inTitle: false });
  });

  it('제목에서 찾으면 본문은 보지 않는다 (대소문자 무시)', () => {
    expect(searchConversation(sample, '운영체제')).toEqual({ inTitle: true });
    expect(searchConversation({ ...sample, title: 'RSA 정리' }, 'rsa')).toEqual(
      { inTitle: true },
    );
  });

  it('본문에서 찾으면 처음 찾은 곳 앞뒤를 한 줄로 보여 준다', () => {
    expect(searchConversation(sample, '교착')).toEqual({
      inTitle: false,
      snippet: {
        before: '식사하는 철학자 문제에서 ',
        match: '교착',
        after: ' 상태가 생기는 이유는 네 가지 조건이 동시…',
      },
    });
  });

  it('긴 글의 앞부분이 잘리면 말줄임표를 붙인다', () => {
    const long = conversation('b', '정리', undefined, [
      `${'가'.repeat(40)}페이징${'나'.repeat(5)}`,
    ]);
    const hit = searchConversation(long, '페이징');
    expect(hit?.snippet?.before).toBe(`…${'가'.repeat(24)}`);
    expect(hit?.snippet?.after).toBe('나'.repeat(5));
  });

  it('어디에도 없으면 null', () => {
    expect(searchConversation(sample, '세마포어')).toBeNull();
  });
});

describe('sortConversations', () => {
  const items = [
    conversation('b', '나 대화', '2026-10-01T00:00:00.000Z'),
    conversation('c', '가 대화', undefined),
    conversation('a', '다 대화', '2026-10-20T00:00:00.000Z'),
  ];
  const ids = (list: ParsedConversation[]) => list.map((c) => c.id);

  it('최신순은 날짜가 늦은 것부터, 날짜 없는 대화는 맨 뒤', () => {
    expect(ids(sortConversations(items, (c) => c, 'latest'))).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('가나다순은 제목 순서', () => {
    expect(ids(sortConversations(items, (c) => c, 'title'))).toEqual([
      'c',
      'b',
      'a',
    ]);
  });

  it('원래 배열은 바꾸지 않는다', () => {
    sortConversations(items, (c) => c, 'title');
    expect(ids(items)).toEqual(['b', 'c', 'a']);
  });
});

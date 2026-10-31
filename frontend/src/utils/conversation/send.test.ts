import { describe, expect, it } from 'vitest';
import { buildImportRequests, partCountOf } from './send';
import type { ParsedConversation } from './types';

function conversation(id: string): ParsedConversation {
  return {
    id,
    source: 'chatgpt',
    title: `대화 ${id}`,
    createdAt: '2026-10-20T09:00:00.000Z',
    messages: [
      { role: 'user', text: '공개키로 암호화하면?' },
      { role: 'assistant', text: '[이메일]로 보내 드릴게요' },
    ],
  };
}

describe('buildImportRequests', () => {
  it('과목별로 묶고 고른 순서를 지킨다', () => {
    const requests = buildImportRequests([
      { courseId: 2, conversation: conversation('a') },
      { courseId: 1, conversation: conversation('b') },
      { courseId: 2, conversation: conversation('c') },
    ]);
    expect(requests.map((r) => r.courseId)).toEqual([2, 1]);
    expect(requests[0].conversations.map((c) => c.clientId)).toEqual([
      'a',
      'c',
    ]);
  });

  it('파일 안의 id를 clientId로 쓰고 서버가 받을 필드만 보낸다', () => {
    const [request] = buildImportRequests([
      { courseId: 1, conversation: conversation('a') },
    ]);
    expect(request.conversations[0]).toEqual({
      clientId: 'a',
      source: 'chatgpt',
      title: '대화 a',
      createdAt: '2026-10-20T09:00:00.000Z',
      messages: [
        { role: 'user', text: '공개키로 암호화하면?' },
        { role: 'assistant', text: '[이메일]로 보내 드릴게요' },
      ],
    });
  });

  it('한 요청의 최대 개수를 넘으면 나눠 보낸다', () => {
    const items = ['a', 'b', 'c', 'd', 'e'].map((id) => ({
      courseId: 1,
      conversation: conversation(id),
    }));
    const requests = buildImportRequests(items, 2);
    expect(requests.map((r) => r.conversations.length)).toEqual([2, 2, 1]);
    expect(requests.every((r) => r.courseId === 1)).toBe(true);
  });

  // 한글 메시지 하나가 대략 300바이트가 되게 만든 긴 대화
  function longConversation(id: string, count: number): ParsedConversation {
    return {
      ...conversation(id),
      messages: Array.from({ length: count }, (_, i) => ({
        role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
        text: `${i + 1}번 메시지 ${'가'.repeat(90)}`,
      })),
    };
  }
  const bytesOf = (value: unknown) =>
    new TextEncoder().encode(JSON.stringify(value)).length;

  it('작은 대화는 나누지 않는다', () => {
    expect(partCountOf(conversation('a'))).toBe(1);
    const [request] = buildImportRequests([
      { courseId: 1, conversation: conversation('a') },
    ]);
    expect(request.conversations[0].clientId).toBe('a');
    expect(request.conversations[0]).not.toHaveProperty('part');
  });

  it('요청 크기를 넘는 대화는 메시지를 빠짐없이 순서대로 조각에 나눠 담는다', () => {
    const long = longConversation('long', 40); // 약 12KB
    const maxBytes = 4_000;
    const requests = buildImportRequests(
      [{ courseId: 1, conversation: long }],
      50,
      maxBytes,
    );
    const pieces = requests.flatMap((r) => r.conversations);

    expect(pieces.length).toBeGreaterThan(1);
    expect(partCountOf(long, maxBytes)).toBe(pieces.length);
    expect(pieces.map((p) => p.clientId)).toEqual(
      pieces.map((_, i) => `long#${i + 1}`),
    );
    expect(pieces.map((p) => p.part)).toEqual(
      pieces.map((_, i) => ({
        parentClientId: 'long',
        index: i + 1,
        count: pieces.length,
      })),
    );
    expect(pieces.every((p) => p.title === '대화 long')).toBe(true);
    // 이어 붙이면 원래 메시지와 같다
    expect(pieces.flatMap((p) => p.messages)).toEqual(long.messages);
    // 요청 하나하나가 한도 안에 들어간다
    for (const request of requests) {
      expect(bytesOf(request)).toBeLessThanOrEqual(maxBytes);
    }
  });

  it('여러 대화를 묶을 때도 요청 크기 한도를 지킨다', () => {
    const items = ['a', 'b', 'c', 'd'].map((id) => ({
      courseId: 1,
      conversation: longConversation(id, 6), // 각각 약 2KB
    }));
    const maxBytes = 5_000;
    const requests = buildImportRequests(items, 50, maxBytes);

    expect(requests.length).toBeGreaterThan(1);
    expect(
      requests.flatMap((r) => r.conversations.map((c) => c.clientId)),
    ).toEqual(['a', 'b', 'c', 'd']);
    for (const request of requests) {
      expect(bytesOf(request)).toBeLessThanOrEqual(maxBytes);
    }
  });

  it('고른 대화가 없으면 요청도 없다', () => {
    expect(buildImportRequests([])).toEqual([]);
  });
});

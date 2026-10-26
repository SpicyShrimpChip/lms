import { describe, expect, it } from 'vitest';
import { buildImportRequests } from './send';
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

  it('고른 대화가 없으면 요청도 없다', () => {
    expect(buildImportRequests([])).toEqual([]);
  });
});

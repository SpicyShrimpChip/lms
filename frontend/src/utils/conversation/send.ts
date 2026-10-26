import type { ConversationImport } from '@/types';
import type { ParsedConversation } from './types';

// 한 번에 보내는 대화 수. 서버 제한(임시 제안값 50개)에 맞춰 나눠 보낸다
// TODO(미결): 백엔드가 크기 제한을 정하면 이 값을 맞춘다 (docs/frontend-requests.md "대화 가져오기")
export const MAX_CONVERSATIONS_PER_REQUEST = 50;

export interface ConversationToSend {
  courseId: number;
  // 개인정보를 가린 뒤의 대화
  conversation: ParsedConversation;
}

// 고른 대화를 과목별 요청으로 묶는다. 요청 하나는 과목 하나이고, 개수가 많으면 여러 요청으로 나눈다.
// 과목 순서와 과목 안의 대화 순서는 고른 순서를 따른다
export function buildImportRequests(
  items: ConversationToSend[],
  maxPerRequest = MAX_CONVERSATIONS_PER_REQUEST,
): ConversationImport[] {
  const byCourse = new Map<number, ParsedConversation[]>();
  for (const { courseId, conversation } of items) {
    const list = byCourse.get(courseId) ?? [];
    list.push(conversation);
    byCourse.set(courseId, list);
  }

  const requests: ConversationImport[] = [];
  for (const [courseId, conversations] of byCourse) {
    for (let i = 0; i < conversations.length; i += maxPerRequest) {
      requests.push({
        courseId,
        conversations: conversations
          .slice(i, i + maxPerRequest)
          .map(({ id, source, title, createdAt, messages }) => ({
            clientId: id,
            source,
            title,
            createdAt,
            messages: messages.map(({ role, text }) => ({ role, text })),
          })),
      });
    }
  }
  return requests;
}

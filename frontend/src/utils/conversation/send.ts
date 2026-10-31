import type { ConversationImport, ImportedConversation } from '@/types';
import type { ParsedConversation } from './types';

// 한 번에 보내는 대화 수. 서버 제한(임시 제안값 50개)에 맞춰 나눠 보낸다
// TODO(미결): 백엔드가 크기 제한을 정하면 이 값을 맞춘다 (docs/frontend-requests.md "대화 가져오기")
export const MAX_CONVERSATIONS_PER_REQUEST = 50;
// 요청 한 번의 최대 크기(바이트). nginx 기본값(1MB)에 걸리지 않게 잡은 임시값
// TODO(미결): 실제 한도는 백엔드가 정한다(같은 문서). 정해지면 이 값을 맞춘다
export const MAX_REQUEST_BYTES = 1_000_000;

// 요청 본문 {"courseId":..,"conversations":[...]}에서 대화 목록 밖의 글자와
// 조각 표시(clientId 뒤 "#번호", part 필드)가 늘리는 크기를 넉넉히 잡은 값
const ENVELOPE_BYTES = 200;

export interface ConversationToSend {
  courseId: number;
  // 개인정보를 가린 뒤의 대화
  conversation: ParsedConversation;
}

const encoder = new TextEncoder();
const byteLength = (value: unknown) =>
  encoder.encode(JSON.stringify(value)).length;

// 대화 하나를 서버가 받을 모양으로 바꾼다. 요청 한 번에 들어가지 않을 만큼 크면
// 메시지를 앞에서부터 차례로 담아 조각 여러 개로 만든다. 메시지는 하나도 버리지 않는다.
// 메시지 하나가 혼자서 한도를 넘으면 그 메시지만 담긴 조각이 된다(서버가 거절하면 그 대화는 저장되지 않는다)
export function toImportedConversations(
  { id, source, title, createdAt, messages }: ParsedConversation,
  maxBytes = MAX_REQUEST_BYTES,
): ImportedConversation[] {
  const whole: ImportedConversation = {
    clientId: id,
    source,
    title,
    createdAt,
    messages: messages.map(({ role, text }) => ({ role, text })),
  };
  const budget = maxBytes - ENVELOPE_BYTES;
  if (byteLength(whole) <= budget) return [whole];

  const emptySize = byteLength({ ...whole, messages: [] });
  const groups: ImportedConversation['messages'][] = [];
  let current: ImportedConversation['messages'] = [];
  let size = emptySize;
  for (const message of whole.messages) {
    const bytes = byteLength(message);
    // 메시지 사이 쉼표 1바이트
    if (current.length > 0 && size + bytes + 1 > budget) {
      groups.push(current);
      current = [];
      size = emptySize;
    }
    size += bytes + (current.length > 0 ? 1 : 0);
    current.push(message);
  }
  groups.push(current);

  const count = groups.length;
  return groups.map((group, i) => ({
    ...whole,
    clientId: `${id}#${i + 1}`,
    messages: group,
    part: { parentClientId: id, index: i + 1, count },
  }));
}

// 나눠 보낼 때 몇 조각이 되는지 (보내기 화면에 표시한다)
export function partCountOf(
  conversation: ParsedConversation,
  maxBytes = MAX_REQUEST_BYTES,
): number {
  return toImportedConversations(conversation, maxBytes).length;
}

// 고른 대화를 과목별 요청으로 묶는다. 요청 하나는 과목 하나이고, 대화 수나 크기가 한도를 넘으면
// 여러 요청으로 나눈다. 과목 순서와 과목 안의 대화 순서는 고른 순서를 따른다. 나눈 조각도 한 개로 센다
export function buildImportRequests(
  items: ConversationToSend[],
  maxPerRequest = MAX_CONVERSATIONS_PER_REQUEST,
  maxBytes = MAX_REQUEST_BYTES,
): ConversationImport[] {
  const byCourse = new Map<number, ImportedConversation[]>();
  for (const { courseId, conversation } of items) {
    const list = byCourse.get(courseId) ?? [];
    list.push(...toImportedConversations(conversation, maxBytes));
    byCourse.set(courseId, list);
  }

  const budget = maxBytes - ENVELOPE_BYTES;
  const requests: ConversationImport[] = [];
  for (const [courseId, conversations] of byCourse) {
    let current: ImportedConversation[] = [];
    let size = 0;
    for (const conversation of conversations) {
      const bytes = byteLength(conversation);
      if (
        current.length > 0 &&
        (current.length >= maxPerRequest || size + bytes + 1 > budget)
      ) {
        requests.push({ courseId, conversations: current });
        current = [];
        size = 0;
      }
      size += bytes + (current.length > 0 ? 1 : 0);
      current.push(conversation);
    }
    if (current.length > 0) requests.push({ courseId, conversations: current });
  }
  return requests;
}

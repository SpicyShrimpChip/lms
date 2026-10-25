import { normalizeKeyword } from '../keywords';
import type { ParsedConversation } from './types';

export interface KeywordMatch {
  conversation: ParsedConversation;
  // 이 대화에서 찾은 키워드 (등록한 순서)
  matchedKeywords: string[];
}

// 내 과목 키워드가 제목이나 메시지에 들어 있는 대화만 고른다 (대소문자 무시).
// 키워드가 하나도 없으면 아무것도 고르지 않는다: 공부와 상관없는 대화가 통째로 넘어가면 안 되기 때문이다.
export function filterByKeywords(
  conversations: ParsedConversation[],
  keywords: string[],
): KeywordMatch[] {
  const targets = keywords
    .map(normalizeKeyword)
    .filter((keyword) => keyword.length > 0);
  if (targets.length === 0) return [];

  const matches: KeywordMatch[] = [];
  for (const conversation of conversations) {
    const haystack = [
      conversation.title,
      ...conversation.messages.map((message) => message.text),
    ]
      .join('\n')
      .toLowerCase();
    const matchedKeywords = targets.filter((keyword) =>
      haystack.includes(keyword.toLowerCase()),
    );
    if (matchedKeywords.length > 0)
      matches.push({ conversation, matchedKeywords });
  }
  return matches;
}

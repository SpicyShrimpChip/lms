import type { ConversationImport, ConversationImportResult } from '@/types';
import { maskText } from '@/utils/conversation/mask';
import { mockDelay } from './delay';

// 서버가 할 개인정보 재검사를 흉내 낸다: 가리지 않은 개인정보가 남은 대화는 저장하지 않고 돌려준다
export function mockImportConversations(
  input: ConversationImport,
): Promise<ConversationImportResult> {
  const rejected = input.conversations
    .filter(({ title, messages }) =>
      [title, ...messages.map((message) => message.text)].some(
        (text) => maskText(text).matches.length > 0,
      ),
    )
    .map(({ clientId }) => ({
      clientId,
      reason:
        '개인정보로 보이는 글이 남아 있어 저장하지 않았어요. 가린 내용을 다시 확인해 주세요.',
    }));
  return mockDelay(
    {
      importedCount: input.conversations.length - rejected.length,
      rejected,
    },
    600,
  );
}

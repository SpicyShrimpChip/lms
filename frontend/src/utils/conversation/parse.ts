import { looksLikeChatGpt, parseChatGptConversation } from './chatgpt';
import { looksLikeClaude, parseClaudeConversation } from './claude';
import type { ParseResult, ParsedConversation } from './types';

const NOT_EXPORT_MESSAGE =
  'ChatGPT나 Claude에서 내보낸 conversations.json 파일이 아닌 것 같아요. 압축을 풀고 그 안의 conversations.json을 골라 주세요.';

// 파일에서 읽은 글자(JSON 문자열)를 대화 목록으로 바꾼다. 서버로는 아무것도 보내지 않는다.
export function parseConversationExport(jsonText: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return {
      ok: false,
      message:
        'JSON 파일을 읽지 못했어요. 파일이 중간에 잘리지 않았는지 확인해 주세요.',
    };
  }

  if (!Array.isArray(data) || data.length === 0) {
    return { ok: false, message: NOT_EXPORT_MESSAGE };
  }

  const first = data[0];
  const source = looksLikeChatGpt(first)
    ? 'chatgpt'
    : looksLikeClaude(first)
      ? 'claude'
      : null;
  if (!source) return { ok: false, message: NOT_EXPORT_MESSAGE };

  const parse =
    source === 'chatgpt' ? parseChatGptConversation : parseClaudeConversation;

  const conversations: ParsedConversation[] = [];
  let skippedCount = 0;
  for (const item of data) {
    const parsed = parse(item);
    if (parsed) conversations.push(parsed);
    else skippedCount += 1;
  }

  if (conversations.length === 0) {
    return {
      ok: false,
      message:
        '대화는 찾았지만 글이 있는 대화가 없어요. 이미지만 있는 파일이거나 형식이 바뀌었을 수 있어요.',
    };
  }
  return { ok: true, source, conversations, skippedCount };
}

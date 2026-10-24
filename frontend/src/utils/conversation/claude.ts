import {
  ATTACHMENT_PLACEHOLDER,
  IMAGE_PLACEHOLDER,
  type ConversationMessage,
  type ParsedConversation,
} from './types';

// Claude 내보내기(conversations.json)는 대화마다 chat_messages 배열이 있다.
// 첨부 문서의 추출 내용(extracted_content)은 사용자의 학습 자료·개인 문서일 수 있어
// 가져오지 않고 [첨부 파일] 표시만 남긴다.
// TODO: 실제 내보내기 파일로 검증 (형식은 바뀔 수 있음)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toIso(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const time = Date.parse(value);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

function messageText(raw: Record<string, unknown>): string {
  // content 블록이 있으면 그 안의 text만 모으고, 없으면 text 필드를 쓴다
  if (Array.isArray(raw.content)) {
    const texts = raw.content
      .filter(
        (block): block is { type: string; text: string } =>
          isRecord(block) &&
          block.type === 'text' &&
          typeof block.text === 'string',
      )
      .map((block) => block.text);
    if (texts.length > 0) return texts.join('\n');
  }
  return typeof raw.text === 'string' ? raw.text : '';
}

function toMessage(raw: unknown): ConversationMessage | null {
  if (!isRecord(raw)) return null;
  const role =
    raw.sender === 'human'
      ? 'user'
      : raw.sender === 'assistant'
        ? 'assistant'
        : null;
  if (!role) return null;

  const lines: string[] = [];
  const text = messageText(raw).trim();
  if (text) lines.push(text);
  if (Array.isArray(raw.files) && raw.files.length > 0) {
    lines.push(IMAGE_PLACEHOLDER);
  }
  if (Array.isArray(raw.attachments) && raw.attachments.length > 0) {
    lines.push(ATTACHMENT_PLACEHOLDER);
  }
  if (lines.length === 0) return null;
  return { role, text: lines.join('\n') };
}

export function parseClaudeConversation(
  raw: unknown,
): ParsedConversation | null {
  if (!isRecord(raw) || !Array.isArray(raw.chat_messages)) return null;

  const messages = raw.chat_messages
    .map(toMessage)
    .filter((message): message is ConversationMessage => message !== null);
  if (messages.length === 0) return null;

  return {
    id: typeof raw.uuid === 'string' ? raw.uuid : `claude-${String(raw.name)}`,
    source: 'claude',
    title:
      typeof raw.name === 'string' && raw.name.trim()
        ? raw.name.trim()
        : '제목 없는 대화',
    createdAt: toIso(raw.created_at),
    messages,
  };
}

export function looksLikeClaude(item: unknown): boolean {
  return isRecord(item) && Array.isArray(item.chat_messages);
}

import {
  IMAGE_PLACEHOLDER,
  type ConversationMessage,
  type ParsedConversation,
} from './types';

// ChatGPT 내보내기(conversations.json)의 대화는 메시지가 트리(mapping)로 들어 있다.
// 다시 생성하기·수정으로 가지가 갈라질 수 있어서, 마지막으로 본 가지(current_node)에서
// 위로 거슬러 올라가 한 줄로 만든다.
// TODO: 실제 내보내기 파일로 검증 (형식은 바뀔 수 있음)

interface RawNode {
  parent?: string | null;
  children?: string[];
  message?: {
    author?: { role?: string };
    content?: { content_type?: string; parts?: unknown[]; text?: string };
    metadata?: { is_visually_hidden_from_conversation?: boolean };
  } | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toIso(seconds: unknown): string | undefined {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds))
    return undefined;
  return new Date(seconds * 1000).toISOString();
}

// 현재 가지의 끝 노드: current_node가 있으면 그것, 없으면 마지막 자식만 따라 내려간 끝
function findLeafId(
  mapping: Record<string, RawNode>,
  currentNode: unknown,
): string | undefined {
  if (typeof currentNode === 'string' && mapping[currentNode])
    return currentNode;
  const root = Object.keys(mapping).find((id) => !mapping[id].parent);
  if (!root) return undefined;
  let id = root;
  const seen = new Set<string>();
  while (!seen.has(id)) {
    seen.add(id);
    const children = mapping[id].children ?? [];
    const next = children[children.length - 1];
    if (!next || !mapping[next]) break;
    id = next;
  }
  return id;
}

function nodeToMessage(node: RawNode): ConversationMessage | null {
  const message = node.message;
  if (!message) return null;
  if (message.metadata?.is_visually_hidden_from_conversation) return null;
  const role = message.author?.role;
  if (role !== 'user' && role !== 'assistant') return null;

  const content = message.content;
  if (!content) return null;
  const type = content.content_type;

  let text: string;
  if (type === 'text' || type === 'multimodal_text') {
    const parts = Array.isArray(content.parts) ? content.parts : [];
    text = parts
      .map((part) => {
        if (typeof part === 'string') return part;
        // 이미지 등 글자가 아닌 조각
        return IMAGE_PLACEHOLDER;
      })
      .filter((part) => part.length > 0)
      .join('\n');
  } else if (type === 'code' && typeof content.text === 'string') {
    text = content.text;
  } else {
    // 생각 과정·도구 실행 결과 같은 종류는 화면에 보이는 대화가 아니라서 건너뛴다
    return null;
  }

  text = text.trim();
  if (!text) return null;
  return { role, text };
}

export function parseChatGptConversation(
  raw: unknown,
): ParsedConversation | null {
  if (!isRecord(raw) || !isRecord(raw.mapping)) return null;
  const mapping = raw.mapping as Record<string, RawNode>;

  const leafId = findLeafId(mapping, raw.current_node);
  if (!leafId) return null;

  const chain: RawNode[] = [];
  const seen = new Set<string>();
  let id: string | null | undefined = leafId;
  while (id && mapping[id] && !seen.has(id)) {
    seen.add(id);
    chain.push(mapping[id]);
    id = mapping[id].parent;
  }
  chain.reverse();

  const messages = chain
    .map(nodeToMessage)
    .filter((message): message is ConversationMessage => message !== null);
  if (messages.length === 0) return null;

  const rawId = raw.conversation_id ?? raw.id;
  return {
    id: typeof rawId === 'string' ? rawId : `chatgpt-${leafId}`,
    source: 'chatgpt',
    title:
      typeof raw.title === 'string' && raw.title.trim()
        ? raw.title.trim()
        : '제목 없는 대화',
    createdAt: toIso(raw.create_time),
    messages,
  };
}

export function looksLikeChatGpt(item: unknown): boolean {
  return isRecord(item) && isRecord(item.mapping);
}

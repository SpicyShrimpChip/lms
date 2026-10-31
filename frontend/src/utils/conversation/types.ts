import type { ClaudeManifest } from './manifest';

export type ConversationSource = 'chatgpt' | 'claude';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
}

// 내보내기 파일의 대화 하나를 두 서비스 공통 모양으로 맞춘 것
export interface ParsedConversation {
  id: string;
  source: ConversationSource;
  title: string;
  createdAt?: string; // ISO 문자열
  messages: ConversationMessage[];
}

export type ParseResult =
  | {
      ok: true;
      source: ConversationSource;
      conversations: ParsedConversation[];
      // 메시지가 없거나 형식이 달라 건너뛴 대화 수
      skippedCount: number;
    }
  | {
      ok: false;
      // 화면에 그대로 보여 줄 짧은 제목과 할 일 한 문장
      title: string;
      message: string;
      // Claude 다운로드 목록 파일이면 받을 zip 정보 (오류가 아니라 안내로 보여 준다)
      manifest?: ClaudeManifest;
    };

// 사용자가 고른 내보내기 파일 하나. 브라우저 안에서만 다룬다
export interface ExportFile {
  name: string;
  text: string;
  // JSON으로 읽히면 읽은 값, 아니면 undefined (서비스마다 다시 읽지 않도록 한 번만 읽는다)
  json: unknown;
}

// 서비스 하나의 내보내기를 읽는 방법. 새 서비스는 sources/index.ts 목록에 추가한다
export interface ConversationSourceReader {
  source: ConversationSource;
  // 이 서비스의 내보내기 파일인지 알아본다
  matches: (file: ExportFile) => boolean;
  // 파일 안의 대화를 하나씩 공통 모양으로 바꾼다. 글이 없거나 형식이 다른 대화는 null.
  // 제목이 없으면 빈 문자열로 두고, 공통 단계(parse.ts)에서 첫 질문으로 채운다
  read: (file: ExportFile) => (ParsedConversation | null)[];
}

// 이미지·첨부 파일은 내용을 보내지 않고 이 표시만 남긴다
export const IMAGE_PLACEHOLDER = '[이미지]';
export const ATTACHMENT_PLACEHOLDER = '[첨부 파일]';

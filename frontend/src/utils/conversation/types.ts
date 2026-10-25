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
      // 화면에 그대로 보여 줄 문구
      message: string;
    };

// 이미지·첨부 파일은 내용을 보내지 않고 이 표시만 남긴다
export const IMAGE_PLACEHOLDER = '[이미지]';
export const ATTACHMENT_PLACEHOLDER = '[첨부 파일]';

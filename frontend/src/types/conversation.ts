// AI 대화 가져오기 요청·응답 (POST /api/conversations). docs/frontend-requests.md "대화 가져오기"와 같은 모양
export interface ImportedConversation {
  // 내보내기 파일 안의 대화 id. 같은 대화를 다시 보내면 서버가 중복 저장하지 않는다
  clientId: string;
  source: 'chatgpt' | 'claude';
  title: string;
  createdAt?: string;
  messages: { role: 'user' | 'assistant'; text: string }[];
  // 메시지가 너무 많아 나눠 보낸 조각일 때만 있다. 서버는 parentClientId가 같은 조각을 index 순서로 한 대화에 이어 붙인다
  part?: ConversationPart;
}

export interface ConversationPart {
  parentClientId: string;
  index: number; // 1부터
  count: number;
}

export interface ConversationImport {
  courseId: number;
  conversations: ImportedConversation[];
}

export interface RejectedConversation {
  clientId: string;
  // 사용자에게 그대로 보여 줄 문구
  reason: string;
}

export interface ConversationImportResult {
  importedCount: number;
  rejected: RejectedConversation[];
}

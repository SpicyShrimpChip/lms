import type { ConversationImport, ConversationImportResult } from '@/types';
import { mockImportConversations } from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

// TODO: 백엔드 API가 준비되면 경로·필드명을 주미의 API 문서와 맞춘다 (제안: docs/frontend-requests.md "대화 가져오기")
export function importConversations(
  input: ConversationImport,
): Promise<ConversationImportResult> {
  if (USE_MOCK) return mockImportConversations(input);
  return request<ConversationImportResult>({
    method: 'POST',
    url: '/conversations',
    data: input,
    // 대화 본문이 길어 기본 5초보다 오래 걸릴 수 있다
    timeout: 30_000,
  });
}

import type { Notice, NoticeDetail } from '@/types';
import { mockGetNotice, mockGetNotices } from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

// React Query에서 공지를 담는 키. 상세는 [...NOTICES_QUERY_KEY, id]
export const NOTICES_QUERY_KEY = ['notices'] as const;

export function getNotices(): Promise<Notice[]> {
  if (USE_MOCK) return mockGetNotices();
  return request<Notice[]>({ method: 'GET', url: '/notices' });
}

export function getNotice(id: number): Promise<NoticeDetail> {
  if (USE_MOCK) return mockGetNotice(id);
  return request<NoticeDetail>({ method: 'GET', url: `/notices/${id}` });
}

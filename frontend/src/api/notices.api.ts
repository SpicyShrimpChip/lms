import type { Notice, NoticeDetail, NoticeInput } from '@/types';
import {
  mockCreateNotice,
  mockDeleteNotice,
  mockGetNotice,
  mockGetNotices,
  mockUpdateNotice,
} from '@/mocks';
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

// 아래 셋은 관리자만 쓸 수 있다 (서버가 /api/admin/** 에서 역할을 매번 확인한다)
export function createNotice(input: NoticeInput): Promise<NoticeDetail> {
  if (USE_MOCK) return mockCreateNotice(input);
  return request<NoticeDetail>({
    method: 'POST',
    url: '/admin/notices',
    data: input,
  });
}

export function updateNotice(
  id: number,
  input: NoticeInput,
): Promise<NoticeDetail> {
  if (USE_MOCK) return mockUpdateNotice(id, input);
  return request<NoticeDetail>({
    method: 'PUT',
    url: `/admin/notices/${id}`,
    data: input,
  });
}

export function deleteNotice(id: number): Promise<void> {
  if (USE_MOCK) return mockDeleteNotice(id);
  return request<void>({ method: 'DELETE', url: `/admin/notices/${id}` });
}

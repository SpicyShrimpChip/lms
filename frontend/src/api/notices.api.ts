import type { Notice } from '@/types';
import { MOCK_NOTICES, mockDelay } from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

export function getNotices(): Promise<Notice[]> {
  if (USE_MOCK) return mockDelay(MOCK_NOTICES);
  return request<Notice[]>({ method: 'GET', url: '/notices' });
}

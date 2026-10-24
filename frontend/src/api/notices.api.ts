import type { Notice } from '@/types';
import { mockGetNotices } from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

export function getNotices(): Promise<Notice[]> {
  if (USE_MOCK) return mockGetNotices();
  return request<Notice[]>({ method: 'GET', url: '/notices' });
}

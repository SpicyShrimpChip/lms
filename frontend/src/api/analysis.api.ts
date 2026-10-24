import type { DashboardData } from '@/types';
import { mockGetDashboard } from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

// TODO: 백엔드 분석 API가 준비되면 경로·필드명을 API 문서와 맞춘다 (제안: docs/frontend-requests.md 4번)
export function getDashboard(): Promise<DashboardData> {
  if (USE_MOCK) return mockGetDashboard();
  return request<DashboardData>({ method: 'GET', url: '/analysis/dashboard' });
}

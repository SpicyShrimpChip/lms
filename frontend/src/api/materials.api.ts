import type {
  Material,
  MaterialDetail,
  MaterialSummary,
  MaterialUploadInput,
} from '@/types';
import {
  mockDeleteMaterial,
  mockGetMaterial,
  mockGetMaterials,
  mockUploadMaterial,
} from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

// React Query에서 내 학습자료를 담는 키. 상세는 [...MATERIALS_QUERY_KEY, id]
export const MATERIALS_QUERY_KEY = ['materials'] as const;

// TODO: 백엔드 API가 준비되면 경로·필드명을 주미의 API 문서와 맞춘다 (제안: docs/frontend-requests.md "자료")
export function uploadMaterial(input: MaterialUploadInput): Promise<Material> {
  if (USE_MOCK) return mockUploadMaterial(input);
  const body = new FormData();
  body.append('courseId', String(input.courseId));
  body.append('title', input.title);
  body.append('file', input.file);
  return request<Material>({ method: 'POST', url: '/materials', data: body });
}

export function getMaterials(): Promise<MaterialSummary[]> {
  if (USE_MOCK) return mockGetMaterials();
  return request<MaterialSummary[]>({ method: 'GET', url: '/materials' });
}

export function getMaterial(id: number): Promise<MaterialDetail> {
  if (USE_MOCK) return mockGetMaterial(id);
  return request<MaterialDetail>({ method: 'GET', url: `/materials/${id}` });
}

export function deleteMaterial(id: number): Promise<void> {
  if (USE_MOCK) return mockDeleteMaterial(id);
  return request<void>({ method: 'DELETE', url: `/materials/${id}` });
}

import type { Material, MaterialUploadInput } from '@/types';
import { mockUploadMaterial } from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

// TODO: 백엔드 API가 준비되면 경로·필드명을 주미의 API 문서와 맞춘다 (제안: POST /api/materials)
export function uploadMaterial(input: MaterialUploadInput): Promise<Material> {
  if (USE_MOCK) return mockUploadMaterial(input);
  const body = new FormData();
  body.append('courseId', String(input.courseId));
  body.append('title', input.title);
  body.append('file', input.file);
  return request<Material>({ method: 'POST', url: '/materials', data: body });
}

import type { Course, CourseInput } from '@/types';
import {
  mockCreateCourse,
  mockDeleteCourse,
  mockGetCourses,
  mockUpdateCourse,
} from '@/mocks';
import { USE_MOCK } from './axios';
import { request } from './request';

// TODO: 백엔드 API가 준비되면 경로·필드명을 주미의 API 문서와 맞춘다 (제안: /api/courses)
export function getCourses(): Promise<Course[]> {
  if (USE_MOCK) return mockGetCourses();
  return request<Course[]>({ method: 'GET', url: '/courses' });
}

export function createCourse(input: CourseInput): Promise<Course> {
  if (USE_MOCK) return mockCreateCourse(input);
  return request<Course>({ method: 'POST', url: '/courses', data: input });
}

export function updateCourse(id: number, input: CourseInput): Promise<Course> {
  if (USE_MOCK) return mockUpdateCourse(id, input);
  return request<Course>({
    method: 'PATCH',
    url: `/courses/${id}`,
    data: input,
  });
}

export function deleteCourse(id: number): Promise<void> {
  if (USE_MOCK) return mockDeleteCourse(id);
  return request<void>({ method: 'DELETE', url: `/courses/${id}` });
}

import type { Course, CourseInput } from '@/types';
import { ApiError } from '@/api/request';
import { mockDelay } from './delay';

// 목업 전용 저장소. 새로고침해도 등록한 과목이 남도록 브라우저에 저장한다 (실제 데이터는 서버에 저장)
const STORAGE_KEY = 'ai-lms-mock-courses';

function load(): Course[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Course[]) : [];
  } catch {
    return [];
  }
}

function save(courses: Course[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // 저장소를 쓸 수 없으면(사생활 보호 모드 등) 이번 화면에서만 유지한다
  }
}

let courses = load();

export function mockGetCourses(): Promise<Course[]> {
  return mockDelay([...courses]);
}

export function mockCreateCourse(input: CourseInput): Promise<Course> {
  const course = { ...input, id: Math.max(0, ...courses.map((c) => c.id)) + 1 };
  courses = [...courses, course];
  save(courses);
  return mockDelay(course);
}

export function mockUpdateCourse(
  id: number,
  input: CourseInput,
): Promise<Course> {
  if (!courses.some((course) => course.id === id)) {
    return Promise.reject(new ApiError('과목을 찾을 수 없어요.', 404));
  }
  const updated = { ...input, id };
  courses = courses.map((course) => (course.id === id ? updated : course));
  save(courses);
  return mockDelay(updated);
}

export function mockDeleteCourse(id: number): Promise<void> {
  courses = courses.filter((course) => course.id !== id);
  save(courses);
  return mockDelay(undefined);
}

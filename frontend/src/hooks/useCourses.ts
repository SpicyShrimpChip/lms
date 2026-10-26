import { useSuspenseQuery } from '@tanstack/react-query';
import { COURSES_QUERY_KEY, getCourses } from '@/api';

// 내 과목 목록. 불러오는 동안·실패는 감싼 AsyncBoundary가 처리한다
export function useCourses() {
  return useSuspenseQuery({ queryKey: COURSES_QUERY_KEY, queryFn: getCourses });
}

import { useSuspenseQuery } from '@tanstack/react-query';
import { QUIZZES_QUERY_KEY, getQuizzes } from '@/api';

// 퀴즈 목록. 불러오는 동안·실패는 감싼 AsyncBoundary가 처리한다
export function useQuizzes() {
  return useSuspenseQuery({ queryKey: QUIZZES_QUERY_KEY, queryFn: getQuizzes });
}

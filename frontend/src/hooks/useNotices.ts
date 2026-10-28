import { useSuspenseQuery } from '@tanstack/react-query';
import { NOTICES_QUERY_KEY, getNotice, getNotices } from '@/api';

// 공지 목록. 불러오는 동안·실패는 감싼 AsyncBoundary가 처리한다
export function useNotices() {
  return useSuspenseQuery({ queryKey: NOTICES_QUERY_KEY, queryFn: getNotices });
}

// 공지 한 건. 상세·수정 화면이 같은 캐시를 쓰도록 키를 여기서만 만든다
export function useNotice(noticeId: number) {
  return useSuspenseQuery({
    queryKey: [...NOTICES_QUERY_KEY, noticeId],
    queryFn: () => getNotice(noticeId),
  });
}

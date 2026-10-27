import type { Notice, NoticeDetail } from '@/types';
import { ApiError } from '@/api/request';
import { mockDelay } from './delay';

// 백엔드 없이 화면을 볼 때 쓰는 샘플 데이터 (백엔드 시드 R__sample_notices.sql과 같은 내용)
export const MOCK_NOTICE_DETAILS: NoticeDetail[] = [
  {
    id: 3,
    title: 'AI 대화 가져오기 기능을 준비하고 있어요',
    content:
      'ChatGPT, Claude와 공부한 대화를 가져와 개념별로 분석하는 기능을 준비하고 있어요. 준비가 끝나면 이곳에서 알려 드릴게요.',
    createdAt: '2026-10-24',
    updatedAt: null,
  },
  {
    id: 2,
    title: '개인정보 처리 방식을 안내해 드려요',
    content:
      'AI 대화 파일은 내 브라우저에서만 읽고, 내가 고른 대화만 개인정보를 가린 뒤 서버로 보내요. 자세한 내용은 이용안내의 개인정보 처리방침에서 볼 수 있어요.',
    createdAt: '2026-10-20',
    updatedAt: null,
  },
  {
    id: 1,
    title: '서비스를 시작했어요',
    content:
      'AI 학습 도우미 서비스를 시작했어요. 학습 자료와 AI 대화 기록을 함께 분석해 개념별 강점과 보완할 점을 보여 드려요.',
    createdAt: '2026-10-15',
    updatedAt: null,
  },
];

const toNotice = ({ id, title, createdAt }: NoticeDetail): Notice => ({
  id,
  title,
  createdAt,
});

export function mockGetNotices(): Promise<Notice[]> {
  return mockDelay(MOCK_NOTICE_DETAILS.map(toNotice));
}

export function mockGetNotice(id: number): Promise<NoticeDetail> {
  const notice = MOCK_NOTICE_DETAILS.find((item) => item.id === id);
  if (!notice) {
    return Promise.reject(new ApiError('공지사항을 찾을 수 없어요.', 404));
  }
  return mockDelay(notice);
}

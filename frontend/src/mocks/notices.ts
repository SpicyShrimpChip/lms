import type { Notice } from '@/types';

// 백엔드 없이 화면을 볼 때 쓰는 샘플 데이터
export const MOCK_NOTICES: Notice[] = [
  {
    id: 3,
    title: 'AI 대화 가져오기 기능을 준비하고 있어요',
    createdAt: '2026-10-24',
  },
  {
    id: 2,
    title: '개인정보 처리 방식을 안내해 드려요',
    createdAt: '2026-10-20',
  },
  { id: 1, title: '서비스를 시작했어요', createdAt: '2026-10-15' },
];

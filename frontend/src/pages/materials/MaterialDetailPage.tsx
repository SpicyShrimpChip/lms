import { BookOpen, ListChecks, Sparkles, Video } from 'lucide-react';
import { EmptyState, SubPage, Tabs } from '@/components';

// TODO: 자료 상세 API가 준비되면 materialId로 자료를 불러와 제목과 각 탭 내용을 채운다
function MaterialDetailPage() {
  return (
    <SubPage
      title="자료 상세"
      description="자료의 요약, 핵심 개념, 퀴즈를 한곳에서 볼 수 있어요"
    >
      <Tabs
        label="자료 상세 보기"
        tabs={[
          {
            id: 'summary',
            label: '요약',
            content: (
              <EmptyState
                icon={<Sparkles size={24} aria-hidden="true" />}
                title="요약을 준비하고 있어요"
                description="자료를 분석하면 내용별 요약이 여기에 표시돼요."
              />
            ),
          },
          {
            id: 'concepts',
            label: '핵심 개념',
            content: (
              <EmptyState
                icon={<BookOpen size={24} aria-hidden="true" />}
                title="핵심 개념을 준비하고 있어요"
                description="자료에서 뽑은 핵심 개념이 여기에 표시돼요."
              />
            ),
          },
          {
            id: 'quiz',
            label: '퀴즈',
            content: (
              <EmptyState
                icon={<ListChecks size={24} aria-hidden="true" />}
                title="이 자료로 만든 퀴즈가 아직 없어요"
                description="퀴즈를 풀면 결과가 개념별 숙련도에 반영돼요."
                action={{ label: '퀴즈 목록 보기', to: '/quizzes' }}
              />
            ),
          },
          {
            id: 'video',
            label: 'AI 요약 영상',
            badge: '준비 중',
            content: (
              // TODO(미결): AI 요약 영상 기능의 우선순위 확정 전까지 자리만 둔다
              <EmptyState
                icon={<Video size={24} aria-hidden="true" />}
                title="준비 중인 기능이에요"
                description="자료 내용을 정리한 요약 영상을 제공할 예정이에요."
              />
            ),
          },
        ]}
      />
    </SubPage>
  );
}

export default MaterialDetailPage;

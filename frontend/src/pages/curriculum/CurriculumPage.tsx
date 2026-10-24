import { Route } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 분석 결과가 준비되면 단계별 학습 순서와 "이 순서인 이유"(AI 표시)를 보여 준다
function CurriculumPage() {
  return (
    <SubPage
      title="맞춤 커리큘럼"
      description="지금 이해 정도에 맞춰 공부할 순서를 추천해요"
      breadcrumb={['맞춤학습', '맞춤 커리큘럼']}
    >
      <EmptyState
        icon={<Route size={24} aria-hidden="true" />}
        title="추천할 학습 순서가 아직 없어요"
        description="AI 대화를 가져오거나 자료로 퀴즈를 풀면, 보완이 필요한 개념부터 학습 순서를 만들어 드려요."
        action={{ label: '대화 가져오기', to: '/analysis/import' }}
      />
    </SubPage>
  );
}

export default CurriculumPage;

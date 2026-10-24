import { ChartColumn } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 분석 결과(개념·점수·근거)가 준비되면 시안 v1 대시보드로 채운다 (API 전까지 mock)
function DashboardPage() {
  return (
    <SubPage
      title="학습 대시보드"
      description="개념별 숙련도와 그렇게 판단한 근거를 함께 보여 드려요"
      breadcrumb={['학습분석', '학습 대시보드']}
    >
      <EmptyState
        icon={<ChartColumn size={24} aria-hidden="true" />}
        title="아직 분석할 학습 기록이 없어요"
        description="ChatGPT나 Claude와 공부한 대화를 가져오면 개념별 강점과 보완할 점을 보여 드려요."
        action={{ label: '대화 가져오기', to: '/analysis/import' }}
      />
    </SubPage>
  );
}

export default DashboardPage;

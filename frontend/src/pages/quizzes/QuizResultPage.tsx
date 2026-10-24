import { ListChecks } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 채점 결과가 준비되면 정답률과 틀린 문제, 숙련도 반영 안내를 보여 준다
function QuizResultPage() {
  return (
    <SubPage title="퀴즈 결과" breadcrumb={['맞춤학습', '퀴즈', '퀴즈 결과']}>
      <EmptyState
        icon={<ListChecks size={24} aria-hidden="true" />}
        title="결과를 찾을 수 없어요"
        description="퀴즈를 끝까지 풀면 결과가 여기에 표시되고, 개념별 숙련도에도 반영돼요."
        action={{ label: '퀴즈 목록 보기', to: '/quizzes' }}
      />
    </SubPage>
  );
}

export default QuizResultPage;

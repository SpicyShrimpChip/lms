import { ListChecks } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 퀴즈 API가 준비되면 quizId로 문제를 불러와 한 문제씩 풀게 한다
function QuizSolvePage() {
  return (
    <SubPage title="퀴즈 풀기" breadcrumb={['맞춤학습', '퀴즈', '퀴즈 풀기']}>
      <EmptyState
        icon={<ListChecks size={24} aria-hidden="true" />}
        title="퀴즈를 찾을 수 없어요"
        description="퀴즈 목록에서 풀 퀴즈를 골라 주세요."
        action={{ label: '퀴즈 목록 보기', to: '/quizzes' }}
      />
    </SubPage>
  );
}

export default QuizSolvePage;

import { ListChecks } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 퀴즈 목록 API가 준비되면 BoardTable로 목록을 보여 준다
function QuizListPage() {
  return (
    <SubPage
      title="퀴즈"
      description="자료와 약점 개념을 바탕으로 만든 퀴즈를 풀어 보세요"
    >
      <EmptyState
        icon={<ListChecks size={24} aria-hidden="true" />}
        title="아직 만든 퀴즈가 없어요"
        description="자료를 올리면 그 내용으로 퀴즈를 만들어 드려요."
        action={{ label: '자료 올리기', to: '/materials/upload' }}
      />
    </SubPage>
  );
}

export default QuizListPage;

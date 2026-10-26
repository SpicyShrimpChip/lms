import { FileText } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 자료 목록 API가 준비되면 BoardTable로 목록을 보여 준다.
// 목록이 있을 때만 오른쪽 위에 <Button to="/materials/upload">자료 올리기</Button>을 둔다 (빈 화면에는 안내 버튼 하나만)
function MaterialListPage() {
  return (
    <SubPage
      title="내 학습자료"
      description="올린 자료에서 요약, 핵심 개념, 퀴즈를 만들어요"
    >
      <EmptyState
        icon={<FileText size={24} aria-hidden="true" />}
        title="아직 올린 자료가 없어요"
        description="교재, 필기, 강의 자료를 올리면 요약과 퀴즈로 바로 공부를 시작할 수 있어요."
        action={{ label: '첫 자료 올리기', to: '/materials/upload' }}
      />
    </SubPage>
  );
}

export default MaterialListPage;

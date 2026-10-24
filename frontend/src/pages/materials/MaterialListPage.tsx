import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 자료 목록 API가 준비되면 BoardTable로 목록을 보여 준다
function MaterialListPage() {
  return (
    <SubPage
      title="내 학습자료"
      description="올린 자료에서 요약, 핵심 개념, 퀴즈를 만들어요"
      breadcrumb={['학습자료', '내 학습자료']}
    >
      <div className="flex justify-end">
        <Link
          to="/materials/upload"
          className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:bg-navy-700"
        >
          자료 올리기
        </Link>
      </div>
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

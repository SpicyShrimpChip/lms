import { UserRound } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 인증이 준비되면 내 정보, AI 대화 분석 동의 철회, 데이터 삭제를 보여 준다
function MyPage() {
  return (
    <SubPage
      title="마이페이지"
      description="내 정보와 동의 상태, 저장된 데이터를 관리해요"
      breadcrumb={['마이페이지']}
    >
      <EmptyState
        icon={<UserRound size={24} aria-hidden="true" />}
        title="로그인하면 볼 수 있어요"
        description="AI 대화 분석 동의를 철회하거나, 가져온 대화와 분석 결과를 삭제할 수 있어요."
        action={{ label: '로그인하기', to: '/login' }}
      />
    </SubPage>
  );
}

export default MyPage;

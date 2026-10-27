import { Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { USE_MOCK } from '@/api';
import { EmptyState, LoadingFallback, SubPage } from '@/components';
import { useMe } from '@/hooks';

// 관리자 화면을 감싸는 가드. 반드시 RequireAuth 안에 둔다 (로그인 확인은 거기서 한다).
// 이 가드는 안내용일 뿐이고, 진짜 권한은 서버가 요청마다 확인한다 (/api/admin/**).
// 목업 모드(VITE_USE_MOCK=true)에서는 백엔드 없이 화면을 개발할 수 있도록 검사하지 않는다
function RequireAdmin() {
  const { data: me, isPending } = useMe();

  if (USE_MOCK) return <Outlet />;
  if (isPending) return <LoadingFallback />;
  if (me?.role !== 'ADMIN') {
    return (
      <SubPage title="관리자">
        <EmptyState
          icon={<ShieldAlert size={24} aria-hidden="true" />}
          title="관리자만 볼 수 있어요"
          description="이 화면은 관리자 계정으로 로그인했을 때만 볼 수 있어요."
          action={{ label: '홈으로 가기', to: '/' }}
        />
      </SubPage>
    );
  }
  return <Outlet />;
}

export default RequireAdmin;

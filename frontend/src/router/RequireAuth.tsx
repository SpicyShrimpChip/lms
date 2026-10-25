import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { USE_MOCK } from '@/api';
import { LoadingFallback } from '@/components';
import { useAuthStore } from '@/store';

// 로그인이 필요한 화면을 감싸는 가드. 로그인하지 않았으면 로그인 화면으로 보내고, 로그인 뒤 원래 화면으로 돌아온다.
// 목업 모드(VITE_USE_MOCK=true)에서는 백엔드 없이 화면을 개발할 수 있도록 검사하지 않는다
function RequireAuth() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (USE_MOCK) return <Outlet />;
  // 새로고침 뒤 세션을 되살리는 동안
  if (status === 'unknown') return <LoadingFallback />;
  if (status === 'anonymous') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  return <Outlet />;
}

export default RequireAuth;

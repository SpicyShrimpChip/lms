import { useSuspenseQuery } from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import { ME_QUERY_KEY, getMe } from '@/api';
import { AsyncBoundary, EmptyState, SubPage } from '@/components';
import { useAuthStore } from '@/store';

// 내 정보: 흰 카드 안에 항목 이름과 값을 한 줄씩
function MyAccount() {
  const { data: me } = useSuspenseQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
  });
  const rows = [
    { label: '이메일', value: me.email },
    { label: '이름', value: me.name },
    {
      label: 'AI 대화 분석 동의',
      value: me.aiAnalysisConsent ? '동의함' : '동의하지 않음',
    },
  ];

  return (
    <dl className="flex max-w-2xl flex-col divide-y divide-line rounded-2xl border border-line px-6">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-4"
        >
          <dt className="text-body text-ink-soft">{row.label}</dt>
          <dd className="text-body font-bold text-heading">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// TODO: AI 대화 분석 동의 철회, 데이터 삭제(탈퇴)는 백엔드 API가 준비되면 추가한다
function MyPage() {
  const authenticated = useAuthStore(
    (state) => state.status === 'authenticated',
  );

  return (
    <SubPage
      title="마이페이지"
      description="내 정보와 동의 상태, 저장된 데이터를 관리해요"
    >
      {authenticated ? (
        <AsyncBoundary>
          <MyAccount />
        </AsyncBoundary>
      ) : (
        <EmptyState
          icon={<UserRound size={24} aria-hidden="true" />}
          title="로그인하면 볼 수 있어요"
          description="AI 대화 분석 동의를 철회하거나, 가져온 대화와 분석 결과를 삭제할 수 있어요."
          action={{ label: '로그인하기', to: '/login' }}
        />
      )}
    </SubPage>
  );
}

export default MyPage;

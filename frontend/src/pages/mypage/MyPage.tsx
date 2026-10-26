import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import { ME_QUERY_KEY, deleteAccount, getMe, updateAiConsent } from '@/api';
import {
  AsyncBoundary,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  SubPage,
} from '@/components';
import { useAuthStore } from '@/store';
import type { User } from '@/types';
import {
  AI_CONSENT_NOTICE,
  NoticeList,
} from '@/pages/auth/components/ConsentNotice';

// 내 정보: 흰 카드 안에 항목 이름과 값을 한 줄씩
function AccountInfo({ me }: { me: User }) {
  const rows = [
    { label: '이메일', value: me.email },
    { label: '이름', value: me.name },
  ];
  return (
    <dl className="flex flex-col divide-y divide-line rounded-2xl border border-line px-6">
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

// AI 대화 분석 동의: 철회하면 가져온 대화와 분석 결과가 지워지므로 확인 창을 거친다
function AiConsentSection({ me }: { me: User }) {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const mutation = useMutation({
    mutationFn: updateAiConsent,
    onSuccess: (user) => {
      queryClient.setQueryData(ME_QUERY_KEY, user);
      // 철회하면 지워진 대화·분석 결과가 화면에 남지 않도록 내 정보 말고는 다시 받는다
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== ME_QUERY_KEY[0],
      });
    },
  });

  return (
    <Card
      as="section"
      aria-labelledby="mypage-ai-consent"
      className="flex flex-col gap-4 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="mypage-ai-consent"
          className="text-lg font-extrabold text-heading"
        >
          AI 대화 분석 동의{' '}
          <span className="text-body font-medium text-ink-muted">(선택)</span>
        </h2>
        <span className="text-body font-bold text-heading">
          {me.aiAnalysisConsent ? '동의함' : '동의하지 않음'}
        </span>
      </div>
      <NoticeList items={AI_CONSENT_NOTICE} />
      <p className="text-body leading-relaxed text-ink-soft">
        {me.aiAnalysisConsent
          ? '철회하면 가져온 AI 대화와 그 대화로 계산한 분석 결과가 함께 지워져요. 학습 자료와 퀴즈 기록은 그대로 남아요.'
          : '동의하지 않아도 학습 자료로 공부하는 기능은 그대로 쓸 수 있어요. 동의하면 AI 대화 가져오기를 쓸 수 있어요.'}
      </p>

      {mutation.isError && (
        <p role="alert" className="text-body text-danger">
          {mutation.error.message}
        </p>
      )}

      <div>
        {me.aiAnalysisConsent ? (
          <Button
            variant="secondary"
            disabled={mutation.isPending}
            onClick={() => setConfirming(true)}
          >
            동의 철회하기
          </Button>
        ) : (
          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(true)}
          >
            AI 대화 분석에 동의하기
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirming}
        title="AI 대화 분석 동의를 철회할까요?"
        description="가져온 AI 대화와 그 대화로 계산한 분석 결과가 모두 지워져요. 되돌릴 수 없어요."
        confirmLabel="철회하고 지우기"
        onConfirm={() => {
          setConfirming(false);
          mutation.mutate(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </Card>
  );
}

// 탈퇴: 서버가 내 모든 데이터를 지운 뒤 브라우저의 화면 데이터도 비우고 첫 화면으로 간다
function DeleteAccountSection() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      navigate('/');
    },
  });

  return (
    <Card
      as="section"
      aria-labelledby="mypage-delete"
      className="flex flex-col gap-4 p-6"
    >
      <h2 id="mypage-delete" className="text-lg font-extrabold text-heading">
        탈퇴하고 내 데이터 지우기
      </h2>
      <p className="text-body leading-relaxed text-ink-soft">
        계정과 함께 내 과목, 올린 자료와 그로부터 만든 요약·퀴즈, 퀴즈 결과,
        가져온 AI 대화, 분석 결과가 모두 지워져요.
      </p>
      {mutation.isError && (
        <p role="alert" className="text-body text-danger">
          {mutation.error.message}
        </p>
      )}
      <div>
        <Button
          variant="secondary"
          disabled={mutation.isPending}
          onClick={() => setConfirming(true)}
        >
          탈퇴하기
        </Button>
      </div>
      <ConfirmDialog
        open={confirming}
        title="정말 탈퇴할까요?"
        description="계정과 내 모든 학습 데이터가 지워지고 되돌릴 수 없어요."
        confirmLabel="탈퇴하고 모두 지우기"
        onConfirm={() => {
          setConfirming(false);
          mutation.mutate();
        }}
        onCancel={() => setConfirming(false)}
      />
    </Card>
  );
}

function MyAccount() {
  const { data: me } = useSuspenseQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
  });
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <AccountInfo me={me} />
      <AiConsentSection me={me} />
      <DeleteAccountSection />
    </div>
  );
}

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
          description="AI 대화 분석 동의를 철회하거나, 탈퇴하고 내 데이터를 지울 수 있어요."
          action={{ label: '로그인하기', to: '/login' }}
        />
      )}
    </SubPage>
  );
}

export default MyPage;

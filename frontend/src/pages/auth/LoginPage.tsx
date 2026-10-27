import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ME_QUERY_KEY, login } from '@/api';
import { Button, SubPage, TextInput } from '@/components';

interface LoginLocationState {
  // 로그인 가드가 넘겨 준 원래 주소
  from?: string;
  // 회원가입 직후 넘어온 경우 가입한 이메일
  signedUpEmail?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const state = (useLocation().state ?? {}) as LoginLocationState;
  const [email, setEmail] = useState(state.signedUpEmail ?? '');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      // 이전 사용자의 화면 데이터가 남지 않도록 비우고, 받은 내 정보를 넣어 둔다
      queryClient.clear();
      queryClient.setQueryData(ME_QUERY_KEY, user);
      navigate(state.from ?? '/', { replace: true });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mutation.isPending) return;
    mutation.mutate({ email: email.trim(), password });
  };

  return (
    <SubPage title="로그인">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-5"
      >
        {state.signedUpEmail && (
          <p role="status" className="text-body text-ink-soft">
            가입이 완료됐어요. 로그인해 주세요.
          </p>
        )}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-email"
            className="text-body font-bold text-heading"
          >
            이메일
          </label>
          <TextInput
            id="login-email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password"
            className="text-body font-bold text-heading"
          >
            비밀번호
          </label>
          <TextInput
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mutation.isError && (
          <p role="alert" className="text-body text-danger">
            {mutation.error.message}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          className="mt-2"
          disabled={mutation.isPending}
        >
          로그인
        </Button>
        <p className="text-body text-ink-soft">
          아직 계정이 없나요?{' '}
          <Link
            to="/signup"
            // 가입하고 로그인하면 원래 가려던 화면으로 이어지게 넘겨준다
            state={{ from: state.from }}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </SubPage>
  );
}

export default LoginPage;

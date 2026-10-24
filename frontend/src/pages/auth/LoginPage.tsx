import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { SubPage, TextInput } from '@/components';

function LoginPage() {
  // TODO: 인증 API가 준비되면 로그인 요청을 보내고 실패 사유를 안내한다
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <SubPage title="로그인" breadcrumb={['로그인']}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-100 flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-body font-medium">
            이메일
          </label>
          <TextInput
            id="login-email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-body font-medium">
            비밀번호
          </label>
          <TextInput
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-primary py-3 font-medium text-on-primary hover:bg-primary-hover"
        >
          로그인
        </button>
        <p className="text-center text-body text-ink-soft">
          아직 계정이 없나요?{' '}
          <Link
            to="/signup"
            className="font-medium text-heading-soft underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </SubPage>
  );
}

export default LoginPage;

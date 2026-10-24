import { useState, type FormEvent } from 'react';
import { Button, FormRow, SubPage, TextInput } from '@/components';
import { isPasswordValid } from '@/utils';
import PasswordRules from './components/PasswordRules';

const AGREEMENTS = [
  { id: 'agree-terms', label: '서비스 이용약관 동의', required: true },
  { id: 'agree-privacy', label: '개인정보 수집·이용 동의', required: true },
  {
    id: 'agree-ai',
    label: 'AI 대화 분석 동의',
    required: false,
    description:
      '가져온 AI 대화를 개념별 분석에 써요. 동의하지 않아도 자료로 공부할 수 있고, 마이페이지에서 언제든 철회할 수 있어요.',
  },
];

function SignupPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm !== '' && confirm !== password;

  // TODO: 인증 API가 준비되면 가입 요청을 보낸다
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordValid(password) || password !== confirm) return;
  };

  return (
    <SubPage title="회원가입" breadcrumb={['회원가입']}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="border-t-2 border-heading-soft">
          <FormRow label="이메일" htmlFor="signup-email" required>
            <TextInput
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
            />
          </FormRow>
          <FormRow label="비밀번호" htmlFor="signup-password" required>
            <TextInput
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="signup-password-rules"
            />
            <PasswordRules id="signup-password-rules" password={password} />
          </FormRow>
          <FormRow
            label="비밀번호 확인"
            htmlFor="signup-password-confirm"
            required
            error={
              mismatch ? '비밀번호가 서로 달라요. 다시 확인해 주세요.' : ''
            }
          >
            <TextInput
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={mismatch ? true : undefined}
              aria-describedby="signup-password-confirm-error"
            />
          </FormRow>
          <FormRow label="이름" htmlFor="signup-name" required>
            <TextInput
              id="signup-name"
              type="text"
              autoComplete="name"
              required
            />
          </FormRow>
        </div>

        <fieldset className="flex flex-col gap-3 rounded-2xl border border-line p-6">
          <legend className="px-2 font-bold text-heading-soft">
            약관 동의
          </legend>
          {AGREEMENTS.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <input
                id={item.id}
                type="checkbox"
                required={item.required}
                className="mt-1 size-4 accent-primary"
              />
              <div className="flex flex-col gap-1">
                <label htmlFor={item.id} className="font-medium">
                  {item.label}{' '}
                  <span
                    className={
                      item.required ? 'text-primary' : 'text-ink-muted'
                    }
                  >
                    ({item.required ? '필수' : '선택'})
                  </span>
                </label>
                {item.description && (
                  <p className="text-body leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </fieldset>

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={!isPasswordValid(password) || password !== confirm}
          >
            가입하기
          </Button>
        </div>
      </form>
    </SubPage>
  );
}

export default SignupPage;

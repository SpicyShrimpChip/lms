import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/api';
import { Button, FormRow, SubPage, TextInput } from '@/components';
import { isPasswordValid } from '@/utils';
import PasswordRules from './components/PasswordRules';

type AgreementKey = 'agreedTerms' | 'agreedPrivacy' | 'agreedAiAnalysis';

const AGREEMENTS: {
  id: string;
  key: AgreementKey;
  label: string;
  required: boolean;
  description?: string;
}[] = [
  {
    id: 'agree-terms',
    key: 'agreedTerms',
    label: '서비스 이용약관 동의',
    required: true,
  },
  {
    id: 'agree-privacy',
    key: 'agreedPrivacy',
    label: '개인정보 수집·이용 동의',
    required: true,
  },
  {
    id: 'agree-ai',
    key: 'agreedAiAnalysis',
    label: 'AI 대화 분석 동의',
    required: false,
    description:
      '가져온 AI 대화를 개념별 분석에 써요. 동의하지 않아도 자료로 공부할 수 있고, 마이페이지에서 언제든 철회할 수 있어요.',
  },
];

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    agreedTerms: false,
    agreedPrivacy: false,
    agreedAiAnalysis: false,
  });
  const mismatch = confirm !== '' && confirm !== password;

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (user) => {
      navigate('/login', { state: { signedUpEmail: user.email } });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordValid(password) || password !== confirm) return;
    if (mutation.isPending) return;
    // 서버에서도 같은 규칙으로 다시 검사한다 (이메일 중복, 비밀번호 규칙, 필수 동의)
    mutation.mutate({
      email: email.trim(),
      name: name.trim(),
      password,
      passwordConfirm: confirm,
      ...agreements,
    });
  };

  return (
    <SubPage title="회원가입">
      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-8">
        <div className="flex flex-col gap-6">
          <FormRow label="이메일" htmlFor="signup-email" required>
            <TextInput
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                checked={agreements[item.key]}
                onChange={(e) =>
                  setAgreements((prev) => ({
                    ...prev,
                    [item.key]: e.target.checked,
                  }))
                }
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

        {mutation.isError && (
          <p role="alert" className="text-center text-body text-danger">
            {mutation.error.message}
          </p>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={
              !isPasswordValid(password) ||
              password !== confirm ||
              mutation.isPending
            }
          >
            가입하기
          </Button>
        </div>
      </form>
    </SubPage>
  );
}

export default SignupPage;

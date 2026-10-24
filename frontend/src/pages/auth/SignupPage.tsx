import type { FormEvent } from 'react';
import { FormRow, SubPage, TextInput } from '@/components';

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
  // TODO: 인증 API가 준비되면 가입 요청을 보내고, 비밀번호 4가지 조건을 입력하는 동안 실시간으로 표시한다
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <SubPage title="회원가입" breadcrumb={['회원가입']}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="border-t-2 border-navy-700">
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
            />
          </FormRow>
          <FormRow
            label="비밀번호 확인"
            htmlFor="signup-password-confirm"
            required
          >
            <TextInput
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              required
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
          <legend className="px-2 font-bold text-navy-700">약관 동의</legend>
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
          <button
            type="submit"
            className="rounded-lg bg-primary px-8 py-3 font-medium text-white hover:bg-navy-700"
          >
            가입하기
          </button>
        </div>
      </form>
    </SubPage>
  );
}

export default SignupPage;

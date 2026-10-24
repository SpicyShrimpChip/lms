export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

// TODO(미결): 비밀번호 4가지 조건은 백엔드(주미)와 맞춰 확정한다. 서버에서도 같은 규칙으로 검사해야 한다
export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: '8자 이상', test: (pw) => pw.length >= 8 },
  { id: 'letter', label: '영문 포함', test: (pw) => /[A-Za-z]/.test(pw) },
  { id: 'digit', label: '숫자 포함', test: (pw) => /\d/.test(pw) },
  {
    id: 'special',
    label: '특수문자 포함',
    // 한글 같은 문자는 특수문자로 치지 않고, 키보드의 ASCII 기호만 인정한다
    test: (pw) => /[!-/:-@[-`{-~]/.test(pw),
  },
];

export interface PasswordRuleResult {
  id: string;
  label: string;
  met: boolean;
}

// 조건별 충족 여부 (입력하는 동안 화면에 그대로 보여 준다)
export function checkPassword(password: string): PasswordRuleResult[] {
  return PASSWORD_RULES.map(({ id, label, test }) => ({
    id,
    label,
    met: test(password),
  }));
}

export const isPasswordValid = (password: string) =>
  checkPassword(password).every((rule) => rule.met);

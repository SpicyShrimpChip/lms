import { Link } from 'react-router-dom';

// 회원가입의 이용 안내와 선택 동의.
// 「개인정보 처리 통합 안내서」(2025.7.) Ⅳ 동의를 받는 방법을 따른다:
// - 서비스에 꼭 필요한 정보는 동의가 아니라 계약 이행(법 §15①4)이 근거라서, 필수 동의 대신 "고지 → 확인"으로 받는다
// - 선택 동의(AI 대화 분석)는 따로 두고, 목적·항목·보유 기간·거부할 권리와 불이익을 함께 알리며, 처음에는 체크하지 않은 상태
// 서버 API는 그대로다: 확인 체크 하나가 agreedTerms·agreedPrivacy를 함께 true로 보낸다 (docs/frontend-requests.md)

interface Notice {
  label: string;
  value: string;
}

const REQUIRED_NOTICE: Notice[] = [
  { label: '항목', value: '이메일, 이름, 비밀번호(암호화해서 저장)' },
  { label: '목적', value: '회원 관리와 학습 서비스 제공' },
  {
    label: '근거',
    value: '서비스 이용 계약의 이행(「개인정보 보호법」 제15조제1항제4호)',
  },
  { label: '보유 기간', value: '탈퇴할 때까지' },
];

const AI_CONSENT_NOTICE: Notice[] = [
  {
    label: '항목',
    value: '내가 직접 고른 AI 대화(이메일·전화번호 같은 개인정보를 가린 글)',
  },
  { label: '목적', value: '개념별 숙련도 분석과 판단 근거 보여 주기' },
  { label: '보유 기간', value: '동의를 철회하거나 탈퇴할 때까지' },
];

function NoticeList({ items }: { items: Notice[] }) {
  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-xl bg-surface-muted px-4 py-3 text-body">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="font-bold text-heading">{item.label}</dt>
          <dd className="text-ink-soft">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface SignupAgreementsProps {
  acknowledged: boolean;
  onAcknowledgedChange: (checked: boolean) => void;
  aiConsent: boolean;
  onAiConsentChange: (checked: boolean) => void;
}

function SignupAgreements({
  acknowledged,
  onAcknowledgedChange,
  aiConsent,
  onAiConsentChange,
}: SignupAgreementsProps) {
  return (
    <div className="flex flex-col gap-5">
      <section
        aria-labelledby="signup-notice-title"
        className="flex flex-col gap-3 rounded-2xl border border-line p-6"
      >
        <h2 id="signup-notice-title" className="font-bold text-heading">
          개인정보 수집·이용 안내
        </h2>
        <NoticeList items={REQUIRED_NOTICE} />
        <p className="text-caption text-ink-muted">
          자세한 내용은{' '}
          <Link to="/privacy" className="font-bold text-primary underline">
            개인정보 처리방침
          </Link>
          에서 볼 수 있어요. 서비스 이용약관 본문은 준비 중이에요.
        </p>
        <label className="flex items-start gap-3 font-medium text-heading">
          <input
            type="checkbox"
            required
            checked={acknowledged}
            onChange={(e) => onAcknowledgedChange(e.target.checked)}
            className="mt-1 size-4 accent-primary"
          />
          <span>
            서비스 이용약관과 위 안내를 확인했어요{' '}
            <span className="text-primary">(필수)</span>
          </span>
        </label>
      </section>

      <section
        aria-labelledby="signup-ai-title"
        className="flex flex-col gap-3 rounded-2xl border border-line p-6"
      >
        <h2 id="signup-ai-title" className="font-bold text-heading">
          AI 대화 분석 동의{' '}
          <span className="font-medium text-ink-muted">(선택)</span>
        </h2>
        <NoticeList items={AI_CONSENT_NOTICE} />
        <p className="text-body leading-relaxed text-ink-soft">
          동의하지 않아도 돼요. 동의하지 않으면 AI 대화 가져오기만 쓸 수 없고,
          학습 자료로 공부하는 기능은 그대로 쓸 수 있어요. 동의한 뒤에도
          마이페이지에서 언제든 철회할 수 있어요.
        </p>
        <label className="flex items-start gap-3 font-medium text-heading">
          <input
            type="checkbox"
            checked={aiConsent}
            onChange={(e) => onAiConsentChange(e.target.checked)}
            className="mt-1 size-4 accent-primary"
          />
          <span>AI 대화 분석에 동의해요</span>
        </label>
      </section>
    </div>
  );
}

export default SignupAgreements;

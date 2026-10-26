// 회원가입과 마이페이지가 함께 쓰는 개인정보 안내 문구 (항목·목적·근거·보유 기간)
interface Notice {
  label: string;
  value: string;
}

export const REQUIRED_NOTICE: Notice[] = [
  { label: '항목', value: '이메일, 이름, 비밀번호(암호화해서 저장)' },
  { label: '목적', value: '회원 관리와 학습 서비스 제공' },
  {
    label: '근거',
    value: '서비스 이용 계약의 이행(「개인정보 보호법」 제15조제1항제4호)',
  },
  { label: '보유 기간', value: '탈퇴할 때까지' },
];

export const AI_CONSENT_NOTICE: Notice[] = [
  {
    label: '항목',
    value: '내가 직접 고른 AI 대화(이메일·전화번호 같은 개인정보를 가린 글)',
  },
  { label: '목적', value: '개념별 숙련도 분석과 판단 근거 보여 주기' },
  { label: '보유 기간', value: '동의를 철회하거나 탈퇴할 때까지' },
];

export function NoticeList({ items }: { items: Notice[] }) {
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

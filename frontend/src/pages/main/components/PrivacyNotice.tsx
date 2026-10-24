import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

function PrivacyNotice() {
  return (
    <section className="bg-surface-muted">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-4 px-6 py-8">
        <div className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-heading-soft">
          <Lock size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-[1_1_480px]">
          <p className="mb-1 font-bold text-heading">
            원본 대화 파일은 서버로 보내지 않아요
          </p>
          <p className="text-body leading-relaxed text-ink-soft">
            내 브라우저에서 학습 관련 대화만 고르고, 이메일과 전화번호 같은
            개인정보를 가린 뒤 내가 선택한 대화만 보내요.
          </p>
        </div>
        <Link
          to="/privacy"
          className="text-body font-medium text-heading-soft underline-offset-4 hover:underline"
        >
          개인정보처리방침
        </Link>
      </div>
    </section>
  );
}

export default PrivacyNotice;

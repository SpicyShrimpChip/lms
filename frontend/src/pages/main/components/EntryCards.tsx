import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare } from 'lucide-react';
import { AiBadge } from '@/components';

interface EntryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  to: string;
  badge?: ReactNode;
}

function EntryCard({
  icon,
  title,
  description,
  cta,
  to,
  badge,
}: EntryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary-pill bg-surface p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {icon}
        </div>
        {badge}
      </div>
      <h2 className="text-2xl font-bold text-heading">{title}</h2>
      <p className="leading-relaxed text-ink-soft">{description}</p>
      <Link
        to={to}
        className="self-start rounded-lg bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-hover"
      >
        {cta}
      </Link>
    </div>
  );
}

// 사용자 유형 A·B의 두 진입 경로
function EntryCards() {
  return (
    <section className="bg-primary-soft">
      <div className="mx-auto flex max-w-page flex-col gap-10 px-6 pt-16 pb-18">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <h1 className="text-3xl leading-snug font-bold text-heading md:text-display">
            AI와 공부한 기록에서
            <br />
            아는 것과 모르는 것을 찾아 드려요
          </h1>
          <p className="max-w-160 text-lg leading-relaxed text-ink-soft">
            학습 자료와 생성형 AI 대화를 함께 분석해 개념별 강점과 보완할 점을
            보여 주고, 공부할 순서를 다시 짜 드려요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EntryCard
            icon={<FileText size={24} aria-hidden="true" />}
            title="학습 자료로 시작"
            description="교재, 필기, 강의 자료를 올리면 요약과 퀴즈로 바로 공부를 시작해요. 퀴즈와 챗봇 기록이 쌓이면 개념별로 분석해요."
            cta="자료 올리기"
            to="/materials/upload"
          />
          <EntryCard
            icon={<MessageSquare size={24} aria-hidden="true" />}
            title="AI 대화로 시작"
            description="ChatGPT, Claude 대화 내보내기 파일을 가져와 개념별로 분석해요. 파일은 내 브라우저에서 읽고, 고른 대화만 개인정보를 가린 뒤 보내요."
            cta="대화 가져오기"
            to="/analysis/import"
            badge={<AiBadge label="AI 분석" />}
          />
        </div>
      </div>
    </section>
  );
}

export default EntryCards;

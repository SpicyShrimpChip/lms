import { ListChecks, MessageSquare } from 'lucide-react';
import { AiNote, LevelBadge } from '@/components';
import type { ConceptMastery, EvidenceSignal } from '@/types';
import Panel from './Panel';

const SIGNAL_LABEL: Record<EvidenceSignal, string> = {
  not_understood: '이해하지 못함',
  asked_again: '다시 설명 요청',
  applied: '스스로 활용',
  quiz_correct: '퀴즈 정답',
  quiz_wrong: '퀴즈 오답',
};

// 고른 개념의 판단 근거(코드)와 AI 설명(보라색)
function ConceptDetailPanel({ concept }: { concept: ConceptMastery | null }) {
  if (!concept) {
    return (
      <Panel title="판단 근거">
        <p className="text-body text-ink-muted">개념을 고르면 여기에 보여요.</p>
      </Panel>
    );
  }

  return (
    <Panel title={`판단 근거: ${concept.name}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body text-ink-soft">
          숙련도{' '}
          <strong className="text-lg text-heading">{concept.score}점</strong>
        </span>
        <LevelBadge level={concept.level} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-body font-bold text-ink-soft">이렇게 판단했어요</h3>
        <ul className="flex flex-col gap-2">
          {concept.evidence.map((item) => {
            const Icon = item.source === 'quiz' ? ListChecks : MessageSquare;
            return (
              <li
                key={item.id}
                className="flex gap-3 rounded-xl bg-surface-muted px-3 py-2.5"
              >
                <Icon
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-body text-ink">{item.summary}</p>
                  <p className="text-caption text-ink-muted">
                    {item.source === 'quiz' ? '퀴즈' : '대화'} · {item.date} ·{' '}
                    {SIGNAL_LABEL[item.signal]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {concept.aiExplanation && (
        <AiNote title="AI 설명">{concept.aiExplanation}</AiNote>
      )}
    </Panel>
  );
}

export default ConceptDetailPanel;

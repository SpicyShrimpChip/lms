import type { StudySummary } from '@/types';
import { getAccuracy, sumSummaries } from '@/utils';
import Panel from './Panel';

function StudySummaryPanel({ summaries }: { summaries: StudySummary[] }) {
  const totals = sumSummaries(summaries);
  const accuracy = getAccuracy(totals.quizCorrectCount, totals.quizCount);
  const items = [
    { label: '분석한 대화', value: `${totals.conversationCount}개` },
    { label: '푼 퀴즈', value: `${totals.quizCount}문제` },
    {
      label: '퀴즈 정답률',
      value: accuracy === null ? '-' : `${accuracy}%`,
    },
  ];

  return (
    <Panel title="학습 요약">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 rounded-xl bg-surface-muted px-4 py-3"
          >
            <dt className="text-caption text-ink-muted">{item.label}</dt>
            <dd className="text-2xl font-bold text-heading">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export default StudySummaryPanel;

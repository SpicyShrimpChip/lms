import type { StudySummary } from '@/types';
import Panel from './Panel';

// 과목별 공부 비중 (분석한 대화 수 기준)
interface CourseSharePanelProps {
  summaries: StudySummary[];
  layoutReason?: string | null;
}

function CourseSharePanel({ summaries, layoutReason }: CourseSharePanelProps) {
  const total = summaries.reduce(
    (sum, item) => sum + item.conversationCount,
    0,
  );

  return (
    <Panel
      title="과목별 공부 비중"
      description="분석한 대화 수 기준이에요."
      layoutReason={layoutReason}
    >
      <ul className="flex flex-col gap-3">
        {summaries.map((item) => {
          const share =
            total > 0 ? Math.round((item.conversationCount / total) * 100) : 0;
          return (
            <li key={item.courseId} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-body">
                <span className="font-medium text-heading">
                  {item.courseName}
                </span>
                <span className="text-ink-soft">
                  {share}% · 대화 {item.conversationCount}개
                </span>
              </div>
              <span
                aria-hidden="true"
                className="h-2.5 overflow-hidden rounded-full bg-surface-muted"
              >
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${share}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export default CourseSharePanel;

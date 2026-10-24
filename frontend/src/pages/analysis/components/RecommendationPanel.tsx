import { AiNote } from '@/components';
import type { ConceptMastery, Recommendation, StudySummary } from '@/types';
import Panel from './Panel';

interface RecommendationPanelProps {
  recommendations: Recommendation[];
  concepts: ConceptMastery[];
  summaries: StudySummary[];
  layoutReason?: string | null;
}

// AI가 추천한 학습 순서와 이유. 순서와 이유 모두 AI가 정한 것이라 보라색 상자에 담는다
function RecommendationPanel({
  recommendations,
  concepts,
  summaries,
  layoutReason,
}: RecommendationPanelProps) {
  const conceptName = (id: string) =>
    concepts.find((item) => item.conceptId === id)?.name ?? id;
  const courseName = (id: number) =>
    summaries.find((item) => item.courseId === id)?.courseName ?? '';

  return (
    <Panel title="추천 학습 순서" layoutReason={layoutReason}>
      {recommendations.length === 0 ? (
        <p className="text-body text-ink-muted">아직 추천할 순서가 없어요.</p>
      ) : (
        recommendations.map((item) => (
          <AiNote
            key={item.courseId}
            title={
              recommendations.length > 1
                ? `${courseName(item.courseId)} 추천 순서`
                : '이 순서로 공부해 보세요'
            }
          >
            <ol className="mb-3 flex flex-wrap items-center gap-2">
              {item.conceptIds.map((id, index) => (
                <li key={id} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-ink-muted">
                      →
                    </span>
                  )}
                  <span className="rounded-full border border-ai-border bg-surface-raised px-3 py-1 font-medium text-heading">
                    {index + 1}. {conceptName(id)}
                  </span>
                </li>
              ))}
            </ol>
            <p>
              <span className="font-bold text-ai">이 순서인 이유 </span>
              {item.aiReason}
            </p>
          </AiNote>
        ))
      )}
    </Panel>
  );
}

export default RecommendationPanel;

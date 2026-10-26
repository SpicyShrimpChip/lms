import { LevelBadge, ScoreBar } from '@/components';
import type { ConceptMastery, StudySummary } from '@/types';
import Panel from './Panel';

interface ConceptTablePanelProps {
  concepts: ConceptMastery[];
  summaries: StudySummary[];
  layoutReason?: string | null;
}

// 개념별 결과를 표 한 장으로 (PDF로 받을 때도 한눈에 보이도록). 점수가 낮은 개념부터
function ConceptTablePanel({
  concepts,
  summaries,
  layoutReason,
}: ConceptTablePanelProps) {
  const sorted = [...concepts].sort((a, b) => a.score - b.score);
  const courseName = (courseId: number) =>
    summaries.find((summary) => summary.courseId === courseId)?.courseName ??
    '';

  return (
    <Panel
      title="개념별 상세 결과"
      description="숙련도와 그 판단에 쓴 대화·퀴즈 기록 수예요."
      layoutReason={layoutReason}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-body">
          <thead>
            <tr className="border-t-2 border-heading bg-surface-muted text-caption text-ink-soft">
              <th scope="col" className="px-3.5 py-3 text-left font-bold">
                개념
              </th>
              <th scope="col" className="px-3.5 py-3 text-left font-bold">
                과목
              </th>
              <th scope="col" className="w-1/3 px-3.5 py-3 text-left font-bold">
                숙련도
              </th>
              <th scope="col" className="px-3.5 py-3 text-right font-bold">
                대화 기록
              </th>
              <th scope="col" className="px-3.5 py-3 text-right font-bold">
                퀴즈 기록
              </th>
              <th scope="col" className="px-3.5 py-3 text-center font-bold">
                판단
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((concept) => {
              const conversationCount = concept.evidence.filter(
                (item) => item.source === 'conversation',
              ).length;
              const quizCount = concept.evidence.length - conversationCount;
              return (
                <tr key={concept.conceptId} className="border-b border-line">
                  <th
                    scope="row"
                    className="px-3.5 py-3.5 text-left font-bold text-heading"
                  >
                    {concept.name}
                  </th>
                  <td className="px-3.5 py-3.5 text-ink-soft">
                    {courseName(concept.courseId)}
                  </td>
                  <td className="px-3.5 py-3.5">
                    <span className="flex items-center gap-3">
                      <ScoreBar
                        value={concept.score}
                        tone={
                          concept.level === 'weakness' ? 'weakness' : 'primary'
                        }
                        className="flex-1"
                      />
                      <span className="w-8 text-right font-bold text-heading">
                        {concept.score}
                      </span>
                    </span>
                  </td>
                  <td className="px-3.5 py-3.5 text-right">
                    {conversationCount}건
                  </td>
                  <td className="px-3.5 py-3.5 text-right">{quizCount}건</td>
                  <td className="px-3.5 py-3.5 text-center">
                    {concept.level === 'normal' ? (
                      <span className="text-caption text-ink-muted">보통</span>
                    ) : (
                      <LevelBadge level={concept.level} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export default ConceptTablePanel;

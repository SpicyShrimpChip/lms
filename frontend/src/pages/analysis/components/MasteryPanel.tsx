import { LevelBadge } from '@/components';
import type { ConceptMastery } from '@/types';
import Panel from './Panel';

interface MasteryPanelProps {
  concepts: ConceptMastery[];
  selectedId: string | null;
  onSelect: (conceptId: string) => void;
  layoutReason?: string | null;
}

// 개념별 숙련도 막대. 점수는 코드가 계산한 값이라 파랑(primary)으로 칠한다
function MasteryPanel({
  concepts,
  selectedId,
  onSelect,
  layoutReason,
}: MasteryPanelProps) {
  return (
    <Panel
      title="개념별 숙련도"
      layoutReason={layoutReason}
      // TODO(미결): 숙련도 산식이 확정되면 계산 방식 안내 문구를 구체화
      description="대화 분류 결과와 퀴즈 결과를 정해진 규칙으로 계산한 점수예요. 개념을 누르면 판단 근거를 볼 수 있어요."
    >
      <ul className="flex flex-col gap-1">
        {concepts.map((concept) => {
          const selected = concept.conceptId === selectedId;
          return (
            <li key={concept.conceptId}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(concept.conceptId)}
                className={`flex w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-3 py-2.5 text-left ${
                  selected ? 'bg-primary-soft' : 'hover:bg-surface-muted'
                }`}
              >
                <span className="w-28 shrink-0 font-medium text-heading">
                  {concept.name}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2.5 min-w-24 flex-1 overflow-hidden rounded-full bg-surface-muted"
                >
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${concept.score}%` }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right font-bold text-heading">
                  {concept.score}
                  <span className="sr-only">점</span>
                  <span
                    aria-hidden="true"
                    className="ml-0.5 text-caption font-normal text-ink-muted"
                  >
                    점
                  </span>
                </span>
                <span className="w-24 shrink-0">
                  <LevelBadge level={concept.level} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export default MasteryPanel;

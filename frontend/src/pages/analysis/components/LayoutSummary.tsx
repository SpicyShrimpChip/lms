import { AiNote } from '@/components';
import type { DashboardLayout } from '@/types';

// 동적 배치 전체 이유(AI, 보라색)와 배치할 때 본 숫자(코드, 파란색)를 나란히 보여 준다
function LayoutSummary({ layout }: { layout: DashboardLayout }) {
  if (layout.isDefault || !layout.aiSummary) return null;

  const basis = layout.basis
    ? [
        { label: '보완 필요 개념', value: `${layout.basis.weaknessCount}개` },
        { label: '다시 설명 요청', value: `${layout.basis.askedAgainCount}번` },
        { label: '분석한 대화', value: `${layout.basis.conversationCount}개` },
      ]
    : [];

  return (
    <AiNote title="오늘은 이렇게 배치했어요">
      <p>{layout.aiSummary}</p>
      {basis.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-caption text-ink-muted">배치할 때 본 숫자</span>
          <ul className="flex flex-wrap gap-1.5">
            {basis.map((item) => (
              <li
                key={item.label}
                className="rounded-full border border-primary-pill bg-primary-soft px-2.5 py-0.5 text-caption text-heading"
              >
                {item.label} <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AiNote>
  );
}

export default LayoutSummary;

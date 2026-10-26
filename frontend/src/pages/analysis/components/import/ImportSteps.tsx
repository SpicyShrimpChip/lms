import { Check } from 'lucide-react';

// 가져오기 단계. 파싱·필터·마스킹은 모두 브라우저에서 하고, 마지막 단계에서 고른 대화만 보낸다
export const IMPORT_STEPS = [
  '파일 고르기',
  '공부한 대화 고르기',
  '가린 내용 확인',
  '보내기',
] as const;

interface ImportStepsProps {
  current: number;
}

function ImportSteps({ current }: ImportStepsProps) {
  return (
    <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {IMPORT_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step}
            aria-current={active ? 'step' : undefined}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-body ${
              active
                ? 'border-primary bg-primary-soft font-bold text-heading'
                : done
                  ? 'border-line text-heading-soft'
                  : 'border-line text-ink-muted'
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
                active || done
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-muted text-ink-muted'
              }`}
            >
              {done ? <Check size={14} aria-hidden="true" /> : index + 1}
            </span>
            {step}
            {done && <span className="sr-only">(완료)</span>}
          </li>
        );
      })}
    </ol>
  );
}

export default ImportSteps;

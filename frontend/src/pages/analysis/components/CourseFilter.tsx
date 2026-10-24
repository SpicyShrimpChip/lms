import type { StudySummary } from '@/types';

interface CourseFilterProps {
  summaries: StudySummary[];
  // null이면 전체
  selected: number | null;
  onSelect: (courseId: number | null) => void;
}

// 과목 고르기: 전체 / 과목별
function CourseFilter({ summaries, selected, onSelect }: CourseFilterProps) {
  const options = [
    { id: null, label: '전체' },
    ...summaries.map((item) => ({ id: item.courseId, label: item.courseName })),
  ];

  return (
    <div role="group" aria-label="과목 고르기" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.id === selected;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.id)}
            className={`rounded-full border px-4 py-2 text-body font-medium ${
              active
                ? 'border-primary bg-primary text-on-primary'
                : 'border-line-strong bg-surface-raised text-ink-soft hover:bg-surface-muted'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default CourseFilter;

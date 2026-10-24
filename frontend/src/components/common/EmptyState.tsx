import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  // 빈 화면에서 할 수 있는 다음 행동
  action?: { label: string; to: string };
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center">
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {icon}
        </div>
      )}
      <p className="text-lg font-bold text-navy-900">{title}</p>
      <p className="max-w-120 text-body leading-relaxed text-ink-soft">
        {description}
      </p>
      {action && (
        <Link
          to={action.to}
          className="mt-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:bg-navy-700"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;

import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  // 제목 아래 짧은 설명
  description?: string;
  children: ReactNode;
}

// 대시보드 영역 하나를 감싸는 흰 카드
function Panel({ title, description, children }: PanelProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-line bg-surface-raised p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-heading">{title}</h2>
        {description && (
          <p className="text-caption text-ink-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default Panel;

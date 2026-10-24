import type { ReactNode } from 'react';

interface SubPageProps {
  title: string;
  description?: string;
  // 'HOME' 다음에 이어지는 경로. 예: ['학습분석', '학습 대시보드']
  breadcrumb: string[];
  children: ReactNode;
}

// 서브페이지 공통 틀: 오른쪽 위 현재 위치, 가운데 큰 제목·부제, 아래 본문
function SubPage({ title, description, breadcrumb, children }: SubPageProps) {
  return (
    <div className="mx-auto flex max-w-page flex-col gap-8 px-6 pt-8 pb-20">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <nav aria-label="현재 위치" className="self-end text-caption">
          <ol className="flex flex-wrap gap-1.5 text-ink-muted">
            {['HOME', ...breadcrumb].map((item, index, items) => (
              <li key={item} className="flex gap-1.5">
                {index > 0 && <span aria-hidden="true">&gt;</span>}
                <span
                  aria-current={
                    index === items.length - 1 ? 'location' : undefined
                  }
                >
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-heading md:text-4xl">{title}</h1>
        {description && <p className="text-ink-soft">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default SubPage;

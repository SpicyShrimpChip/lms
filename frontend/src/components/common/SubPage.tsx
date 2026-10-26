import type { ReactNode } from 'react';

interface SubPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

// 서브페이지 공통 틀: 왼쪽 정렬 제목·부제, 아래 본문 (현재 위치는 상단바 주 메뉴의 선택 표시로 알려 준다)
function SubPage({ title, description, children }: SubPageProps) {
  return (
    <div className="mx-auto flex max-w-page flex-col gap-8 px-6 pt-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-heading">
          {title}
        </h1>
        {description && <p className="text-ink-soft">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default SubPage;

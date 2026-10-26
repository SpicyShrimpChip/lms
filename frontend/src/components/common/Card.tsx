import type { ReactNode } from 'react';

interface CardProps {
  // 목록 안에서는 'li', 대시보드 영역·단계 화면은 'section'
  as?: 'div' | 'section' | 'li';
  // section으로 쓸 때 제목과 이어 주는 이름 (화면 읽기 프로그램용)
  'aria-labelledby'?: string;
  'aria-label'?: string;
  className?: string;
  children: ReactNode;
}

// 흰 카드 틀: 흰 바탕 + 얇은 테두리로 구분한다. 안쪽 여백은 쓰는 곳에서 정한다
function Card({
  as: Tag = 'div',
  className = '',
  children,
  ...aria
}: CardProps) {
  return (
    <Tag
      {...aria}
      className={`rounded-2xl border border-line bg-surface-raised ${className}`}
    >
      {children}
    </Tag>
  );
}

export default Card;

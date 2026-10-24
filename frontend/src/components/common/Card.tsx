import type { ReactNode } from 'react';

interface CardProps {
  // 목록 안에서는 'li', 대시보드 영역은 'section'
  as?: 'div' | 'section' | 'li';
  className?: string;
  children: ReactNode;
}

// 흰 카드 틀: 바탕(상아)보다 살짝 떠 보이는 surface-raised + 얇은 테두리. 안쪽 여백은 쓰는 곳에서 정한다
function Card({ as: Tag = 'div', className = '', children }: CardProps) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface-raised ${className}`}
    >
      {children}
    </Tag>
  );
}

export default Card;

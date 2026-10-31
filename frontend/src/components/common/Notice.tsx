import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface NoticeProps {
  icon: LucideIcon;
  // body: 단계의 주된 안내 / caption: 상황에 따라 붙는 작은 안내
  size?: 'body' | 'caption';
  // 아이콘만 강조할 때 (예: 개인정보 안내의 자물쇠는 text-primary)
  iconClassName?: string;
  className?: string;
  children: ReactNode;
}

const SIZE = {
  body: { icon: 20, box: 'gap-3 text-body leading-relaxed' },
  caption: { icon: 16, box: 'gap-2 text-caption' },
} as const;

// 연한 회색 상자 안에 아이콘 + 안내 글. 글 아래에 목록 같은 내용을 더 넣어도 된다
function Notice({
  icon: Icon,
  size = 'body',
  iconClassName,
  className,
  children,
}: NoticeProps) {
  return (
    <div
      className={cn(
        'flex items-start rounded-xl bg-surface-muted p-4 text-ink-soft',
        SIZE[size].box,
        className,
      )}
    >
      <Icon
        size={SIZE[size].icon}
        className={cn('mt-0.5 shrink-0', iconClassName)}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-col gap-2">{children}</div>
    </div>
  );
}

export default Notice;

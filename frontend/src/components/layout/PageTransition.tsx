import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import * as m from 'motion/react-m';
import { FADE_UP } from '@/constants';

// 페이지가 바뀔 때마다 본문이 살짝 올라오며 나타난다 (경로가 바뀔 때만 다시 그린다)
function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <m.div
      key={pathname}
      initial={FADE_UP.initial}
      animate={FADE_UP.animate}
      transition={FADE_UP.transition}
    >
      {children}
    </m.div>
  );
}

export default PageTransition;

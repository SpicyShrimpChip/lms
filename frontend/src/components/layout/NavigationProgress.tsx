import { useNavigation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';

// 다음 페이지 코드를 불러오는 동안 화면 맨 위에 가는 진행 막대를 보인다
// 0.2초 안에 끝나면 거의 보이지 않도록 나타나는 걸 살짝 늦춘다
function NavigationProgress() {
  const { state } = useNavigation();
  return (
    <AnimatePresence>
      {state === 'loading' && (
        <m.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-50 h-0.75 origin-left bg-primary"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 0.85, opacity: 1 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{
            scaleX: { duration: 6, ease: 'easeOut' },
            opacity: { duration: 0.15, delay: 0.2 },
          }}
        />
      )}
    </AnimatePresence>
  );
}

export default NavigationProgress;

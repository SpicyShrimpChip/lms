import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { MOTION_TRANSITION } from '@/constants';
import { useThemeStore } from '@/store';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeSystemDark(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

// 화면 모드 버튼 하나: 처음엔 기기 설정을 따르고(useThemeStore 기본값 'system'),
// 누르면 지금 보이는 모드의 반대로 바꾼다. 아이콘은 누르면 바뀔 모드(밝을 때 달, 어두울 때 해)를 보여 준다.
// 아이콘이 돌며 바뀌는 건 Motion이라 화면 모드 전환 중 CSS 전환을 끄는 theme-switching의 영향을 받지 않는다
function ThemeToggle() {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
  const dark = preference === 'dark' || (preference === 'system' && systemDark);
  const label = dark ? '밝은 화면으로 바꾸기' : '어두운 화면으로 바꾸기';
  const Icon = dark ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setPreference(dark ? 'light' : 'dark')}
      className="grid size-9 place-items-center overflow-hidden rounded-full text-ink-soft hover:bg-primary-soft hover:text-heading"
    >
      <AnimatePresence initial={false}>
        <m.span
          key={dark ? 'sun' : 'moon'}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={MOTION_TRANSITION}
          className="flex [grid-area:1/1]"
        >
          <Icon size={18} aria-hidden="true" />
        </m.span>
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;

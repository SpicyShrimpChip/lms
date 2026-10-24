import { Monitor, Moon, Sun } from 'lucide-react';
import * as m from 'motion/react-m';
import { MOTION_TRANSITION } from '@/constants';
import { useThemeStore, type ThemePreference } from '@/store';

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: '기기 설정 따르기', icon: Monitor },
  { value: 'light', label: '밝은 화면', icon: Sun },
  { value: 'dark', label: '어두운 화면', icon: Moon },
];

// 버튼 한 칸의 폭(px). 버튼의 size-8(2rem)과 같아야 선택 표시가 칸에 맞는다
const BUTTON_WIDTH = 32;

// 화면 모드 선택: 시스템 설정 / 밝게 / 어둡게
// 선택 표시는 버튼 뒤에 깔린 알약 하나가 옮겨 다닌다. CSS 전환이 아니라 Motion으로 움직이는 이유:
// 모드를 바꾸는 순간 theme-switching이 CSS 전환을 잠깐 꺼서(index.css) CSS 전환이면 순간이동해 버린다
function ThemeToggle() {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const selectedIndex = OPTIONS.findIndex(({ value }) => value === preference);

  return (
    <div
      role="group"
      aria-label="화면 모드"
      className="relative flex h-9 items-center rounded-md border border-input-border p-0.5"
    >
      <m.span
        aria-hidden="true"
        initial={false}
        animate={{ x: selectedIndex * BUTTON_WIDTH }}
        transition={MOTION_TRANSITION}
        className="absolute top-px left-0.5 size-8 rounded bg-primary-soft"
      />
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const selected = preference === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            title={label}
            onClick={() => setPreference(value)}
            className={`relative flex size-8 items-center justify-center rounded ${
              selected ? 'text-heading' : 'text-ink-muted hover:text-heading'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;

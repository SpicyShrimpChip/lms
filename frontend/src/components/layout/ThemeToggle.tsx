import { Monitor, Moon, Sun } from 'lucide-react';
import { useThemeStore, type ThemePreference } from '@/store';

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: '기기 설정 따르기', icon: Monitor },
  { value: 'light', label: '밝은 화면', icon: Sun },
  { value: 'dark', label: '어두운 화면', icon: Moon },
];

// 화면 모드 선택: 시스템 설정 / 밝게 / 어둡게
function ThemeToggle() {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  return (
    <div
      role="group"
      aria-label="화면 모드"
      className="flex h-9 items-center rounded-md border border-line-strong p-0.5"
    >
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
            className={`flex size-8 items-center justify-center rounded ${
              selected
                ? 'bg-primary-soft text-heading'
                : 'text-ink-muted hover:text-heading'
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

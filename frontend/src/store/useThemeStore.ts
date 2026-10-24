import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

// 선택값과 기기 설정을 보고 <html>에 dark 클래스를 붙이거나 뗀다
export const applyTheme = (preference: ThemePreference) => {
  const dark =
    preference === 'dark' || (preference === 'system' && darkQuery().matches);
  document.documentElement.classList.toggle('dark', dark);
};

// 화면 모드 선택 (시스템 설정 / 밝게 / 어둡게). 저장 키는 index.html 스크립트와 같아야 한다
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => {
        applyTheme(preference);
        set({ preference });
      },
    }),
    { name: 'ai-lms-theme' },
  ),
);

// "시스템 설정"을 고른 상태에서 기기 모드가 바뀌면 바로 따라간다
darkQuery().addEventListener('change', () => {
  if (useThemeStore.getState().preference === 'system') applyTheme('system');
});

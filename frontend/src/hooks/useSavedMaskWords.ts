import { useCallback, useSyncExternalStore } from 'react';
import {
  clearMaskWords,
  loadMaskWords,
  saveMaskWords,
  subscribeMaskWords,
} from '@/utils/maskWords';

const NO_WORDS: string[] = [];

// 이 브라우저에 저장한 가릴 단어. 로그인 전(userId 없음)에는 빈 목록이고 저장하지 않는다
export function useSavedMaskWords(userId: number | undefined) {
  const words = useSyncExternalStore(subscribeMaskWords, () =>
    userId === undefined ? NO_WORDS : loadMaskWords(userId),
  );

  const save = useCallback(
    (next: string[]) => {
      if (userId !== undefined) saveMaskWords(userId, next);
    },
    [userId],
  );
  const clear = useCallback(() => {
    if (userId !== undefined) clearMaskWords(userId);
  }, [userId]);

  return { words, save, clear };
}

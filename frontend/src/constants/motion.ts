// 움직임 기준값 (초). CSS 쪽 기본 전환 시간은 index.css의 --default-transition-duration과 맞춘다
export const MOTION_DURATION = { fast: 0.15, base: 0.25, slow: 0.45 } as const;

// 빠르게 시작해 부드럽게 멈추는 곡선 (index.css의 --default-transition-timing-function과 같은 값)
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export const MOTION_TRANSITION = {
  duration: MOTION_DURATION.base,
  ease: MOTION_EASE,
} as const;

// 장면을 가림막 걷듯 바꾸는 움직임 (메인 스크롤 소개). 길게 미끄러지다 천천히 멈춘다
export const SWEEP_TRANSITION = {
  duration: 0.64,
  ease: [0.16, 1, 0.3, 1],
} as const;

// 나타날 때 쓰는 공통 움직임: 살짝 아래에서 올라오며 짙어진다
export const FADE_UP = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
  transition: MOTION_TRANSITION,
} as const;

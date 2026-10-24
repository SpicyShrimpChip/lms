import * as m from 'motion/react-m';
import { MOTION_DURATION, MOTION_EASE } from '@/constants';

interface ScoreBarProps {
  // 0~100
  value: number;
  className?: string;
}

// 점수·비중 막대. 코드가 계산한 값이라 파랑(primary). 숫자는 옆에 글자로 따로 보여 준다
// 처음 보일 때 0에서 값까지 차오르고, 값이 바뀌면 부드럽게 따라간다
function ScoreBar({ value, className = '' }: ScoreBarProps) {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <span
      aria-hidden="true"
      className={`block h-2.5 overflow-hidden rounded-full bg-surface-muted ${className}`}
    >
      <m.span
        className="block h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
      />
    </span>
  );
}

export default ScoreBar;

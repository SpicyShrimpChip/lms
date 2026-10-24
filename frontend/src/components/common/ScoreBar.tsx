interface ScoreBarProps {
  // 0~100
  value: number;
  className?: string;
}

// 점수·비중 막대. 코드가 계산한 값이라 파랑(primary). 숫자는 옆에 글자로 따로 보여 준다
function ScoreBar({ value, className = '' }: ScoreBarProps) {
  return (
    <span
      aria-hidden="true"
      className={`block h-2.5 overflow-hidden rounded-full bg-surface-muted ${className}`}
    >
      <span
        className="block h-full rounded-full bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </span>
  );
}

export default ScoreBar;

interface SkeletonProps {
  className?: string;
}

// 불러오는 동안 실제 모양을 닮은 회색 틀. 크기는 className으로 정한다 (화면 읽기 프로그램에는 숨긴다)
function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-surface-muted ${className}`}
    />
  );
}

export default Skeleton;

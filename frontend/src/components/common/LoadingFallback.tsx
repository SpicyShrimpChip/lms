import Skeleton from './Skeleton';

// 데이터를 불러오는 동안 보여 주는 화면: 제목 줄 + 카드 두 칸 모양의 틀
export default function LoadingFallback() {
  return (
    <div role="status" className="flex flex-col gap-6 py-4">
      <span className="sr-only">불러오는 중이에요</span>
      <Skeleton className="h-6 w-1/3" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <Skeleton className="h-24 rounded-2xl" />
    </div>
  );
}

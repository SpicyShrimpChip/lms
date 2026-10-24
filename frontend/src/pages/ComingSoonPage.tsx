import { Link } from 'react-router-dom';

// 아직 만들지 않은 메뉴의 임시 페이지
function ComingSoonPage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-32 text-center">
      <h1 className="text-3xl font-bold text-navy-900">준비 중인 페이지예요</h1>
      <p className="text-ink-soft">
        이 메뉴는 지금 만들고 있어요. 메인에서 다른 기능을 먼저 둘러보세요.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-navy-700"
      >
        메인으로 가기
      </Link>
    </div>
  );
}

export default ComingSoonPage;

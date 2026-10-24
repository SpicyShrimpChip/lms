import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-page flex-col items-center gap-4 px-6 py-32 text-center">
      <h1 className="text-3xl font-bold text-navy-900">
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-ink-soft">
        주소가 잘못됐거나 페이지가 옮겨졌을 수 있어요.
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

export default NotFoundPage;

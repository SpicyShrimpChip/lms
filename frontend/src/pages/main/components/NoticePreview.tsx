import { Link } from 'react-router-dom';

// TODO: 공지사항 API가 준비되면 React Query로 최근 공지를 불러온다
function NoticePreview() {
  return (
    <section>
      <div className="mx-auto flex max-w-page flex-col gap-4 px-6 pt-16 pb-20">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold text-navy-700">공지사항</h2>
          <Link
            to="/notices"
            className="text-body text-navy-700 underline-offset-4 hover:underline"
          >
            더 보기
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-130 border-collapse border-t-2 border-navy-700 text-body">
            <thead>
              <tr className="bg-surface-muted">
                <th
                  scope="col"
                  className="w-18 border-b border-line px-4 py-3 text-left font-medium text-ink-soft"
                >
                  번호
                </th>
                <th
                  scope="col"
                  className="border-b border-line px-4 py-3 text-left font-medium text-ink-soft"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="w-36 border-b border-line px-4 py-3 text-left font-medium text-ink-soft"
                >
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className="border-b border-line px-4 py-10 text-center text-ink-muted"
                >
                  아직 등록된 공지사항이 없어요.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default NoticePreview;

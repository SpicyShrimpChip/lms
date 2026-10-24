import { Link } from 'react-router-dom';
import { BoardTable, SubPage, type BoardColumn } from '@/components';

interface NoticeRow {
  id: number;
  title: string;
  createdAt: string;
}

const COLUMNS: BoardColumn<NoticeRow>[] = [
  {
    key: 'id',
    label: '번호',
    widthClass: 'w-18',
    render: (row) => row.id,
  },
  {
    key: 'title',
    label: '제목',
    render: (row) => (
      <Link to={`/notices/${row.id}`} className="hover:underline">
        {row.title}
      </Link>
    ),
  },
  {
    key: 'createdAt',
    label: '작성일',
    widthClass: 'w-36',
    render: (row) => row.createdAt,
  },
];

// TODO: 공지사항 API가 준비되면 React Query로 목록을 불러온다
const notices: NoticeRow[] = [];

function NoticeListPage() {
  return (
    <SubPage
      title="공지사항"
      description="서비스 소식과 안내를 알려 드려요"
      breadcrumb={['커뮤니티', '공지사항']}
    >
      <BoardTable
        columns={COLUMNS}
        rows={notices}
        getRowKey={(row) => row.id}
        emptyMessage="아직 등록된 공지사항이 없어요."
      />
    </SubPage>
  );
}

export default NoticeListPage;

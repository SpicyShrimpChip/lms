import { Link } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  AsyncBoundary,
  BoardTable,
  SubPage,
  type BoardColumn,
} from '@/components';
import { getNotices } from '@/api';
import type { Notice } from '@/types';

const COLUMNS: BoardColumn<Notice>[] = [
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

function NoticeTable() {
  const { data: notices } = useSuspenseQuery({
    queryKey: ['notices'],
    queryFn: getNotices,
  });

  return (
    <BoardTable
      columns={COLUMNS}
      rows={notices}
      getRowKey={(row) => row.id}
      emptyMessage="아직 등록된 공지사항이 없어요."
    />
  );
}

function NoticeListPage() {
  return (
    <SubPage title="공지사항" description="서비스 소식과 안내를 알려 드려요">
      <AsyncBoundary>
        <NoticeTable />
      </AsyncBoundary>
    </SubPage>
  );
}

export default NoticeListPage;

import { EmptyState, SubPage } from '@/components';

// TODO: 공지사항 API가 준비되면 noticeId로 본문을 불러온다
function NoticeDetailPage() {
  return (
    <SubPage title="공지사항" breadcrumb={['커뮤니티', '공지사항']}>
      <EmptyState
        title="공지사항을 찾을 수 없어요"
        description="삭제됐거나 주소가 잘못됐을 수 있어요. 목록에서 다시 골라 주세요."
        action={{ label: '목록으로 가기', to: '/notices' }}
      />
    </SubPage>
  );
}

export default NoticeDetailPage;

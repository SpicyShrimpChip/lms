import { ShieldCheck } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 수집 항목·보관 기간·동의 철회 방법이 확정되면 처리방침 본문을 작성한다 (레포 공개·서비스 공개 전 필수)
function PrivacyPage() {
  return (
    <SubPage title="개인정보처리방침">
      <EmptyState
        icon={<ShieldCheck size={24} aria-hidden="true" />}
        title="개인정보처리방침을 준비하고 있어요"
        description="어떤 정보를 왜 모으고, 얼마나 보관하고, 어떻게 삭제할 수 있는지 정리해 곧 안내할게요."
      />
    </SubPage>
  );
}

export default PrivacyPage;

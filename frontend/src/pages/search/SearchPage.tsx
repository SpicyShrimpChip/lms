import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { EmptyState, SubPage } from '@/components';

// TODO: 검색 API가 준비되면 자료·개념·공지사항 결과를 나눠 보여 준다
function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q')?.trim() ?? '';

  return (
    <SubPage
      title="검색"
      description={keyword ? `‘${keyword}’ 검색 결과` : undefined}
    >
      <EmptyState
        icon={<Search size={24} aria-hidden="true" />}
        title={
          keyword ? '검색 결과가 없어요' : '찾고 싶은 자료나 개념을 입력하세요'
        }
        description="상단 검색창에서 자료 제목이나 개념 이름으로 찾을 수 있어요."
      />
    </SubPage>
  );
}

export default SearchPage;

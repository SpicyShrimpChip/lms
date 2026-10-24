import EntryCards from './components/EntryCards';
import LearningHub from './components/LearningHub';

// 공지사항은 커뮤니티 메뉴에만 둔다. 메인 아래쪽은 로그인 사용자용 영역(이어서 공부하기 등) 자리
function MainPage() {
  return (
    <>
      <EntryCards />
      <LearningHub />
    </>
  );
}

export default MainPage;

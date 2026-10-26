import Hero from './components/Hero';
import LearningHub from './components/LearningHub';
import QuickLinks from './components/QuickLinks';

// 공지사항은 커뮤니티 메뉴에만 둔다. 로그인 사용자용 홈(이어서 공부하기 등)은 나중에 따로 만든다
function MainPage() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <LearningHub />
    </>
  );
}

export default MainPage;

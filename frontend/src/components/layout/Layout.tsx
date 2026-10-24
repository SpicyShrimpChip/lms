import { Outlet } from 'react-router-dom';
import Header from './Header';
import Gnb from './Gnb';
import Footer from './Footer';
import NavigationProgress from './NavigationProgress';
import PageTransition from './PageTransition';

// 모든 페이지 공통 틀: 상단바 → GNB → 페이지 → 푸터
function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavigationProgress />
      <Header />
      <Gnb />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components';
import {
  AboutPage,
  ConversationImportPage,
  CurriculumPage,
  DashboardPage,
  LoginPage,
  MainPage,
  MaterialDetailPage,
  MaterialListPage,
  MaterialUploadPage,
  MyPage,
  NoticeDetailPage,
  NoticeListPage,
  NotFoundPage,
  PrivacyPage,
  QuizListPage,
  QuizResultPage,
  QuizSolvePage,
  SearchPage,
  SignupPage,
} from '@/pages';

// 페이지 추가 시 배열 안에 객체로 정리
/*
<페이지 추가 시>
1. ./pages 하위에 페이지 폴더와 파일 생성 (페이지 전용 컴포넌트는 pages/<페이지>/components/)
2. ./pages/index.ts에 export
3. 아래 Layout의 children 배열에 객체 추가 (GNB 메뉴는 constants/menu.ts)
*/
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },

      // 학습자료
      { path: 'materials', element: <MaterialListPage /> },
      { path: 'materials/upload', element: <MaterialUploadPage /> },
      { path: 'materials/:materialId', element: <MaterialDetailPage /> },

      // 맞춤학습
      { path: 'curriculum', element: <CurriculumPage /> },
      { path: 'quizzes', element: <QuizListPage /> },
      { path: 'quizzes/:quizId', element: <QuizSolvePage /> },
      { path: 'quizzes/:quizId/result', element: <QuizResultPage /> },

      // 학습분석
      { path: 'analysis', element: <DashboardPage /> },
      { path: 'analysis/import', element: <ConversationImportPage /> },

      // 커뮤니티
      { path: 'notices', element: <NoticeListPage /> },
      { path: 'notices/:noticeId', element: <NoticeDetailPage /> },

      // 이용안내
      { path: 'about', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPage /> },

      // 계정·기타
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'search', element: <SearchPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

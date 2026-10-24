import { createBrowserRouter } from 'react-router-dom';
import { Layout, LoadingFallback } from '@/components';
import MainPage from '@/pages/main/MainPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { lazyPage } from './lazyPage';

// 페이지 추가 시 배열 안에 객체로 정리
/*
<페이지 추가 시>
1. ./pages 하위에 페이지 폴더와 파일 생성 (default export, 페이지 전용 컴포넌트는 pages/<페이지>/components/)
2. 아래 Layout의 children 배열에 lazyPage(() => import(...))로 추가 (GNB 메뉴는 constants/menu.ts)
   - 메인·404만 처음부터 불러오고, 나머지는 처음 방문할 때 코드를 불러온다 (pages/index.ts 같은 한 곳 모음 파일을 거치면 쪼개지지 않는다)
*/
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // 첫 방문에서 페이지 코드를 불러오는 동안 보여 줄 화면
    hydrateFallbackElement: <LoadingFallback />,
    children: [
      { index: true, element: <MainPage /> },

      // 학습자료
      {
        path: 'courses',
        lazy: lazyPage(() => import('@/pages/courses/CoursePage')),
      },
      {
        path: 'materials',
        lazy: lazyPage(() => import('@/pages/materials/MaterialListPage')),
      },
      {
        path: 'materials/upload',
        lazy: lazyPage(() => import('@/pages/materials/MaterialUploadPage')),
      },
      {
        path: 'materials/:materialId',
        lazy: lazyPage(() => import('@/pages/materials/MaterialDetailPage')),
      },

      // 맞춤학습
      {
        path: 'curriculum',
        lazy: lazyPage(() => import('@/pages/curriculum/CurriculumPage')),
      },
      {
        path: 'quizzes',
        lazy: lazyPage(() => import('@/pages/quizzes/QuizListPage')),
      },
      {
        path: 'quizzes/:quizId',
        lazy: lazyPage(() => import('@/pages/quizzes/QuizSolvePage')),
      },
      {
        path: 'quizzes/:quizId/result',
        lazy: lazyPage(() => import('@/pages/quizzes/QuizResultPage')),
      },

      // 학습분석
      {
        path: 'analysis',
        lazy: lazyPage(() => import('@/pages/analysis/DashboardPage')),
      },
      {
        path: 'analysis/import',
        lazy: lazyPage(() => import('@/pages/analysis/ConversationImportPage')),
      },

      // 커뮤니티
      {
        path: 'notices',
        lazy: lazyPage(() => import('@/pages/notices/NoticeListPage')),
      },
      {
        path: 'notices/:noticeId',
        lazy: lazyPage(() => import('@/pages/notices/NoticeDetailPage')),
      },

      // 이용안내
      {
        path: 'about',
        lazy: lazyPage(() => import('@/pages/about/AboutPage')),
      },
      {
        path: 'privacy',
        lazy: lazyPage(() => import('@/pages/privacy/PrivacyPage')),
      },

      // 계정·기타
      {
        path: 'login',
        lazy: lazyPage(() => import('@/pages/auth/LoginPage')),
      },
      {
        path: 'signup',
        lazy: lazyPage(() => import('@/pages/auth/SignupPage')),
      },
      {
        path: 'mypage',
        lazy: lazyPage(() => import('@/pages/mypage/MyPage')),
      },
      {
        path: 'search',
        lazy: lazyPage(() => import('@/pages/search/SearchPage')),
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

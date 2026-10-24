import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components';
import { ComingSoonPage, MainPage } from '@/pages';

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
      // 아직 만들지 않은 메뉴는 모두 "준비 중" 페이지로 보낸다
      { path: '*', element: <ComingSoonPage /> },
    ],
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';

// 페이지 추가 시 배열 안에 객체로 정리
/*
<페이지 추가 시>
1. .src/pages 하위 파일(.tsx, .css) 생성
2. ./pages/index.ts에 export
3. 아래 router 배열에 객체 추가
*/
export const router = createBrowserRouter([
  { path: '/', element: <App /> },
  // {path: '/경로', element: <컴포넌트/>}
]);

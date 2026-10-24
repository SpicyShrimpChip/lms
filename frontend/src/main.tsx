import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
/*
@/ 절대경로 적용은 취향 차이!
엔트리 파일 시각적 응집도를 위해 적용하지 않았음
*/
import './index.css';

// QueryClient 생성 및 실무용 기본 세팅
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 유저가 다른 탭을 보다가 다시 돌아왔을 때 불필요한 api 호출 방지
      refetchOnWindowFocus: false,
      // 통신 실패 시 1번만 재시도 (기본값은 3번, 트래픽 낭비 방지용)
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // 전역 라우팅 인프라 주입 (UI 레이아웃과 라우팅의 관심사 분리)
  <StrictMode>
    {/* 앱 전체를 Provider로 덮어서 어디서든 캐싱 데이터 사용 가능하도록 */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

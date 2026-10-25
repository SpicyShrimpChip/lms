import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { router } from './router';
import { restoreSession } from './api/auth.api';
/*
@/ 절대경로 적용은 취향 차이!
엔트리 파일 시각적 응집도를 위해 적용하지 않았음
*/
// 본문 폰트 Pretendard (npm 패키지로 내장, 외부 CDN 요청 없음)
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './index.css';

// QueryClient 생성 및 실무용 기본 세팅
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 유저가 다른 탭을 보다가 다시 돌아왔을 때 불필요한 api 호출 방지
      refetchOnWindowFocus: false,
      // 통신 실패 시 1번만 재시도 (기본값은 3번, 트래픽 낭비 방지용)
      retry: 1,
      // 1분 안에 같은 화면으로 돌아오면 다시 요청하지 않는다 (추가·수정 후에는 invalidate로 바로 갱신)
      staleTime: 60_000,
    },
  },
});

// 새로고침해도 로그인이 유지되도록 Refresh Token 쿠키로 세션을 되살린다 (끝날 때까지 로그인 가드는 기다린다)
void restoreSession();

createRoot(document.getElementById('root')!).render(
  // 전역 라우팅 인프라 주입 (UI 레이아웃과 라우팅의 관심사 분리)
  <StrictMode>
    {/* 앱 전체를 Provider로 덮어서 어디서든 캐싱 데이터 사용 가능하도록 */}
    <QueryClientProvider client={queryClient}>
      {/* 움직임: 필요한 기능만 불러오고(LazyMotion), 기기의 "동작 줄이기" 설정을 따른다 */}
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <RouterProvider router={router} />
        </MotionConfig>
      </LazyMotion>
    </QueryClientProvider>
  </StrictMode>,
);

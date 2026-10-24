import axios from 'axios';

// .env의 VITE_USE_MOCK이 'true'면 API 함수가 src/mocks/ 데이터를 돌려준다
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 1. Axios 인스턴스 생성 (통신 고속도로)
export const api = axios.create({
  // 기본은 같은 출처의 /api (개발: Vite 프록시, 배포: Vercel rewrite가 백엔드로 넘김)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  // 5초 이상 응답 없으면 에러 처리. AI 분석처럼 오래 걸리는 요청은 함수에서 timeout을 따로 늘린다
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터 (출발 전 검문소: 토큰 자동 주입용 뼈대)
api.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 토큰 꺼내서 헤더에 꽂아주는 로직 추가하면 됨
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. 응답 인터셉터 (도착 후 검문소: 에러 공통 처리용 뼈대)
api.interceptors.response.use(
  (response) => {
    // 정상 응답 시 패스
    return response;
  },
  (error) => {
    // 에러 시 처리 로직 구현하면 됨
    return Promise.reject(error);
  },
);

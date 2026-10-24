import axios from 'axios';

// 1. Axios 인스턴스 생성 (통신 고속도로)
export const api = axios.create({
  // .env 파일에서 백엔드 주소 가져오기
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000, // 5초 이상 응답 없으면 에러 처리
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

// 백엔드 UserResponse와 같은 모양. 비밀번호·토큰은 들어오지 않는다
export interface User {
  id: number;
  email: string;
  name: string;
  aiAnalysisConsent: boolean;
  // 관리자 메뉴를 보일지 정하는 데만 쓴다. 권한은 서버가 매번 확인한다
  role: 'USER' | 'ADMIN';
}

// 회원가입 요청 (POST /api/auth/signup)
export interface SignupInput {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  // 선택 동의
  agreedAiAnalysis: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Refresh Token은 응답 본문이 아니라 HttpOnly 쿠키로 온다
export interface LoginResult {
  accessToken: string;
  user: User;
}

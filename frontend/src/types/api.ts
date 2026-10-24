// 백엔드 공통 응답 형식. 백엔드 응답 DTO와 같은 모양으로 맞춘다
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

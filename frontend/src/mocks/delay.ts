// 실제 통신처럼 잠깐 기다렸다가 데이터를 돌려준다 (로딩 화면 확인용)
export function mockDelay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

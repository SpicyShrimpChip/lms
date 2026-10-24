// 프로젝트 전체가 공유하는 물류창고
// 리액트의 고질적 문제인 Prop Drilling(과도한 상태 내리물림) 현상 해결

// 현재 카운트 숫자를 저장하는 샘플 스토어
import { create } from 'zustand';

// 스토어의 상태(State)와 액션(Action) 타입 정의
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

// 숫자 데이터 하나 생성
export const useCounterStore = create<CounterState>((set) => ({
  count: 0, // 초기값 설정

  // 상태 변경 함수 정의 (1씩 더하거나 뺌)
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

/*
사용 예시: Home.tsx 생성을 가정
import { useCounterStore } from '@/store';

const Home = () => {
  const { count, increment } = useCounterStore();
  // ...
}
*/

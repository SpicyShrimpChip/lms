import { createContext } from 'react';

// 장면 안 요소를 차례로 움직일지. 고정 무대에서는 켜고,
// 세로로 쌓는 화면(좁은 화면·"동작 줄이기")에서는 꺼서 처음부터 마지막 모습을 보여 준다
export const SceneMotionContext = createContext(true);

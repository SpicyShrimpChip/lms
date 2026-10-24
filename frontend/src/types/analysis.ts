// 학습 대시보드 데이터. 점수·근거는 코드가 계산한 값, ai로 시작하는 필드는 LLM이 쓴 설명이다
// (화면에서 AI 글은 보라색 + "AI" 표시로 구분하므로 필드를 섞지 않는다)

export type MasteryLevel = 'strength' | 'normal' | 'weakness';

// 대화 분류 결과와 퀴즈 결과
export type EvidenceSignal =
  'not_understood' | 'asked_again' | 'applied' | 'quiz_correct' | 'quiz_wrong';

// 판단 근거 한 건: 어떤 기록을 보고 판단했는지
export interface Evidence {
  id: string;
  source: 'conversation' | 'quiz';
  // 'YYYY-MM-DD'
  date: string;
  summary: string;
  signal: EvidenceSignal;
}

export interface ConceptMastery {
  conceptId: string;
  name: string;
  courseId: number;
  // 0~100. TODO(미결): 산식(대화 분류 + 퀴즈 정답률 가중치)은 확정 전
  score: number;
  level: MasteryLevel;
  evidence: Evidence[];
  aiExplanation: string | null;
}

export interface StudySummary {
  courseId: number;
  courseName: string;
  conversationCount: number;
  quizCount: number;
  quizCorrectCount: number;
}

export interface Recommendation {
  courseId: number;
  // 추천 순서대로 개념 id
  conceptIds: string[];
  aiReason: string;
}

export interface DashboardData {
  summaries: StudySummary[];
  concepts: ConceptMastery[];
  recommendations: Recommendation[];
}

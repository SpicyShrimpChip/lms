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

// 대시보드 영역 id. 배치 JSON에는 이 값만 올 수 있다 (검증: utils/layout/dashboardLayout.ts)
export const DASHBOARD_COMPONENT_IDS = [
  'summary',
  'mastery',
  'conceptDetail',
  'recommendation',
  'courseShare',
] as const;

export type DashboardComponentId = (typeof DASHBOARD_COMPONENT_IDS)[number];

export interface LayoutItem {
  component: DashboardComponentId;
  order: number;
  // wide: 한 줄 전체, normal: 넓은 화면에서 반 칸
  size: 'wide' | 'normal';
  // 이 위치·크기인 이유 (AI)
  aiReason: string | null;
}

// 배치를 만들 때 AI에게 준 숫자 (코드가 센 값, 이유와 함께 보여 준다)
export interface LayoutBasis {
  weaknessCount: number;
  askedAgainCount: number;
  conversationCount: number;
}

// 검증을 통과한 배치. 통과하지 못하면 기본 배치(explanation: null)를 쓴다
export interface DashboardLayout {
  items: LayoutItem[];
  // 전체 배치 이유(AI)와 그때 본 숫자(코드). 기본 배치면 없음
  explanation: { aiSummary: string; basis: LayoutBasis } | null;
}

export interface DashboardData {
  summaries: StudySummary[];
  concepts: ConceptMastery[];
  recommendations: Recommendation[];
  // LLM이 만든 배치 JSON. 믿지 않고 parseDashboardLayout으로 검증한 뒤에만 쓴다
  layout?: unknown;
}

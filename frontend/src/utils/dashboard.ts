import type { ConceptMastery, DashboardData, StudySummary } from '@/types';

export interface StudyTotals {
  conversationCount: number;
  quizCount: number;
  quizCorrectCount: number;
}

// 여러 과목의 학습량을 더한다 ("전체" 탭)
export function sumSummaries(summaries: StudySummary[]): StudyTotals {
  return summaries.reduce(
    (total, item) => ({
      conversationCount: total.conversationCount + item.conversationCount,
      quizCount: total.quizCount + item.quizCount,
      quizCorrectCount: total.quizCorrectCount + item.quizCorrectCount,
    }),
    { conversationCount: 0, quizCount: 0, quizCorrectCount: 0 },
  );
}

// 정답률(%)을 반올림한 정수로. 푼 문제가 없으면 null
export function getAccuracy(correct: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((correct / total) * 100);
}

// 과목 하나만 고르면 그 과목 데이터만 남긴다. null이면 전체
export function filterDashboard(data: DashboardData, courseId: number | null) {
  if (courseId === null) return data;
  return {
    summaries: data.summaries.filter((item) => item.courseId === courseId),
    concepts: data.concepts.filter((item) => item.courseId === courseId),
    recommendations: data.recommendations.filter(
      (item) => item.courseId === courseId,
    ),
  };
}

// 처음 자세히 보여 줄 개념: 점수가 가장 낮은 개념
export function pickWeakestConcept(
  concepts: ConceptMastery[],
): ConceptMastery | null {
  return concepts.reduce<ConceptMastery | null>(
    (weakest, item) =>
      !weakest || item.score < weakest.score ? item : weakest,
    null,
  );
}

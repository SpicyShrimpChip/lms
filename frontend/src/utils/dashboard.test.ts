import { describe, expect, it } from 'vitest';
import type { ConceptMastery, DashboardData } from '@/types';
import {
  filterDashboard,
  getAccuracy,
  pickWeakestConcept,
  sumSummaries,
} from './dashboard';

const concept = (
  conceptId: string,
  courseId: number,
  score: number,
): ConceptMastery => ({
  conceptId,
  name: conceptId,
  courseId,
  score,
  level: 'normal',
  evidence: [],
  aiExplanation: null,
});

const data: DashboardData = {
  summaries: [
    {
      courseId: 1,
      courseName: 'A',
      conversationCount: 9,
      quizCount: 22,
      quizCorrectCount: 14,
    },
    {
      courseId: 2,
      courseName: 'B',
      conversationCount: 3,
      quizCount: 8,
      quizCorrectCount: 5,
    },
  ],
  concepts: [concept('a1', 1, 80), concept('a2', 1, 40), concept('b1', 2, 30)],
  recommendations: [
    { courseId: 1, conceptIds: ['a2'], aiReason: '' },
    { courseId: 2, conceptIds: ['b1'], aiReason: '' },
  ],
};

describe('sumSummaries', () => {
  it('과목별 학습량을 더한다', () => {
    expect(sumSummaries(data.summaries)).toEqual({
      conversationCount: 12,
      quizCount: 30,
      quizCorrectCount: 19,
    });
  });
});

describe('getAccuracy', () => {
  it('정답률을 반올림한 정수로 돌려준다', () => {
    expect(getAccuracy(19, 30)).toBe(63);
  });

  it('푼 문제가 없으면 null', () => {
    expect(getAccuracy(0, 0)).toBeNull();
  });
});

describe('filterDashboard', () => {
  it('과목을 고르면 그 과목 데이터만 남긴다', () => {
    const result = filterDashboard(data, 1);
    expect(result.concepts.map((c) => c.conceptId)).toEqual(['a1', 'a2']);
    expect(result.summaries).toHaveLength(1);
    expect(result.recommendations).toHaveLength(1);
  });

  it('null이면 전체를 그대로 돌려준다', () => {
    expect(filterDashboard(data, null)).toBe(data);
  });
});

describe('pickWeakestConcept', () => {
  it('점수가 가장 낮은 개념을 고른다', () => {
    expect(pickWeakestConcept(data.concepts)?.conceptId).toBe('b1');
  });

  it('개념이 없으면 null', () => {
    expect(pickWeakestConcept([])).toBeNull();
  });
});

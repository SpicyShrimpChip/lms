import type { DashboardData } from '@/types';
import { mockDelay } from './delay';

// 시연 과목(주: 정보보호개론, 보조: 운영체제)에 맞춘 샘플 분석 결과.
// 점수는 화면 확인용으로 넣은 값이고, 계산 산식과는 무관하다. 강의자료 문장은 넣지 않는다
const DASHBOARD: DashboardData = {
  summaries: [
    {
      courseId: 1,
      courseName: '정보보호개론',
      conversationCount: 9,
      quizCount: 22,
      quizCorrectCount: 14,
    },
    {
      courseId: 2,
      courseName: '운영체제',
      conversationCount: 3,
      quizCount: 8,
      quizCorrectCount: 5,
    },
  ],
  concepts: [
    {
      conceptId: 'symmetric-key',
      name: '대칭키 암호',
      courseId: 1,
      score: 82,
      level: 'strength',
      evidence: [
        {
          id: 'c-101',
          source: 'conversation',
          date: '2026-10-14',
          summary: '파일 암호화 예시를 들어 블록 암호 동작을 직접 설명함',
          signal: 'applied',
        },
        {
          id: 'q-11',
          source: 'quiz',
          date: '2026-10-16',
          summary: '퀴즈 5문제 중 4문제 정답',
          signal: 'quiz_correct',
        },
      ],
      aiExplanation:
        '예시를 직접 만들어 설명할 만큼 블록 암호의 흐름을 이해하고 있어요. 운영 모드 차이만 한 번 더 정리하면 좋아요.',
    },
    {
      conceptId: 'public-key',
      name: '공개키 암호',
      courseId: 1,
      score: 41,
      level: 'weakness',
      evidence: [
        {
          id: 'c-104',
          source: 'conversation',
          date: '2026-10-20',
          summary: '암호화할 때 공개키와 개인키 중 무엇을 쓰는지 다시 물어봄',
          signal: 'asked_again',
        },
        {
          id: 'c-105',
          source: 'conversation',
          date: '2026-10-21',
          summary: '키 생성 과정 설명을 듣고 이해가 안 된다고 답함',
          signal: 'not_understood',
        },
        {
          id: 'q-12',
          source: 'quiz',
          date: '2026-10-22',
          summary: '퀴즈 3문제 중 1문제 정답',
          signal: 'quiz_wrong',
        },
      ],
      aiExplanation:
        '암호화와 서명에서 공개키·개인키의 역할이 서로 바뀌는 부분을 헷갈리고 있어요. 두 경우를 표로 나눠 "누가 어떤 키로 무엇을 하는지" 정리해 보세요.',
    },
    {
      conceptId: 'hash',
      name: '해시 함수',
      courseId: 1,
      score: 63,
      level: 'normal',
      evidence: [
        {
          id: 'c-106',
          source: 'conversation',
          date: '2026-10-18',
          summary: '비밀번호를 저장할 때 솔트가 필요한 이유를 스스로 설명함',
          signal: 'applied',
        },
        {
          id: 'q-13',
          source: 'quiz',
          date: '2026-10-19',
          summary: '퀴즈 4문제 중 2문제 정답',
          signal: 'quiz_wrong',
        },
      ],
      aiExplanation:
        '활용은 잘하지만 충돌 저항성 같은 성질 이름을 구분하는 문제에서 자주 틀렸어요.',
    },
    {
      conceptId: 'digital-signature',
      name: '전자서명',
      courseId: 1,
      score: 38,
      level: 'weakness',
      evidence: [
        {
          id: 'c-107',
          source: 'conversation',
          date: '2026-10-22',
          summary: '서명 검증 순서를 거꾸로 설명했다가 다시 질문함',
          signal: 'not_understood',
        },
        {
          id: 'q-14',
          source: 'quiz',
          date: '2026-10-23',
          summary: '퀴즈 2문제 모두 오답',
          signal: 'quiz_wrong',
        },
      ],
      aiExplanation:
        '전자서명은 공개키 암호를 바탕으로 동작해서, 공개키 개념이 잡히면 함께 나아질 가능성이 커요.',
    },
    {
      conceptId: 'pki',
      name: '인증서(PKI)',
      courseId: 1,
      score: 55,
      level: 'normal',
      evidence: [
        {
          id: 'c-108',
          source: 'conversation',
          date: '2026-10-23',
          summary: '인증 기관이 왜 필요한지 다시 설명해 달라고 함',
          signal: 'asked_again',
        },
      ],
      aiExplanation: null,
    },
    {
      conceptId: 'access-control',
      name: '접근 통제',
      courseId: 1,
      score: 76,
      level: 'strength',
      evidence: [
        {
          id: 'q-15',
          source: 'quiz',
          date: '2026-10-17',
          summary: '퀴즈 3문제 모두 정답',
          signal: 'quiz_correct',
        },
        {
          id: 'c-109',
          source: 'conversation',
          date: '2026-10-17',
          summary: '역할 기반 접근 통제를 동아리 권한 예시로 설명함',
          signal: 'applied',
        },
      ],
      aiExplanation: '모델별 차이를 생활 예시로 설명할 수 있어요.',
    },
    {
      conceptId: 'process',
      name: '프로세스',
      courseId: 2,
      score: 71,
      level: 'normal',
      evidence: [
        {
          id: 'c-201',
          source: 'conversation',
          date: '2026-10-15',
          summary: '프로세스와 스레드 차이를 스스로 정리함',
          signal: 'applied',
        },
      ],
      aiExplanation: null,
    },
    {
      conceptId: 'scheduling',
      name: '스케줄링',
      courseId: 2,
      score: 58,
      level: 'normal',
      evidence: [
        {
          id: 'q-21',
          source: 'quiz',
          date: '2026-10-19',
          summary: '퀴즈 4문제 중 2문제 정답',
          signal: 'quiz_wrong',
        },
      ],
      aiExplanation: null,
    },
    {
      conceptId: 'paging',
      name: '페이징',
      courseId: 2,
      score: 44,
      level: 'weakness',
      evidence: [
        {
          id: 'c-202',
          source: 'conversation',
          date: '2026-10-21',
          summary: '주소 변환 과정을 두 번 다시 설명해 달라고 함',
          signal: 'asked_again',
        },
      ],
      aiExplanation:
        '논리 주소를 페이지 번호와 오프셋으로 나누는 단계에서 막혀 있어요. 작은 숫자로 직접 계산해 보면 좋아요.',
    },
  ],
  recommendations: [
    {
      courseId: 1,
      conceptIds: ['public-key', 'digital-signature', 'pki'],
      aiReason:
        '전자서명과 인증서는 공개키 암호를 바탕으로 동작해요. 보완이 필요한 공개키 암호를 먼저 다지면 뒤의 두 개념도 함께 이해하기 쉬워요.',
    },
    {
      courseId: 2,
      conceptIds: ['paging', 'scheduling'],
      aiReason:
        '페이징 점수가 가장 낮고 최근 대화에서도 다시 설명을 요청했어요. 주소 변환을 먼저 정리한 뒤 스케줄링 문제를 다시 풀어 보세요.',
    },
  ],
};

export function mockGetDashboard(): Promise<DashboardData> {
  return mockDelay(DASHBOARD);
}

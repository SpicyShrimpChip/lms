import type { Semester } from '@/types';

const TERMS = ['1', 'summer', '2', 'winter'] as const;
type Term = (typeof TERMS)[number];

const TERM_LABEL: Record<Term, string> = {
  '1': '1학기',
  summer: '여름학기',
  '2': '2학기',
  winter: '겨울학기',
};

// 날짜가 속한 학기. 겨울학기(1~2월)는 앞 학년도에 속한다
export function getCurrentSemester(date = new Date()): Semester {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month <= 2) return `${year - 1}-winter`;
  if (month <= 6) return `${year}-1`;
  if (month <= 8) return `${year}-summer`;
  return `${year}-2`;
}

// '2026-2' → '2026년 2학기'. 모르는 형식은 그대로 보여 준다
export function formatSemester(semester: Semester): string {
  const [year, term] = semester.split('-');
  const label = TERM_LABEL[term as Term];
  return label ? `${year}년 ${label}` : semester;
}

// 선택 칸에 보여 줄 학기: 지난 학년도부터 다음 학년도까지, 최근 학기가 위로
export function getSemesterOptions(date = new Date()): Semester[] {
  const current = getCurrentSemester(date);
  const baseYear = Number(current.split('-')[0]);
  const options = [baseYear - 1, baseYear, baseYear + 1].flatMap((year) =>
    TERMS.map((term) => `${year}-${term}`),
  );
  return options.reverse();
}

// 최근 학기가 앞에 오도록 비교한다 (정렬용)
export function compareSemesterDesc(a: Semester, b: Semester): number {
  const order = (semester: Semester) => {
    const [year, term] = semester.split('-');
    return Number(year) * 10 + TERMS.indexOf(term as Term);
  };
  return order(b) - order(a);
}

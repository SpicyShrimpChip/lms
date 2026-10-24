// 학기 코드: '2026-1', '2026-summer', '2026-2', '2026-winter' (utils/semester.ts)
export type Semester = string;

export interface Course {
  id: number;
  name: string;
  semester: Semester;
  // 대화 가져오기에서 공부한 대화를 고를 때 쓰는 단어
  keywords: string[];
}

// 과목 추가·수정 요청 본문
export type CourseInput = Omit<Course, 'id'>;

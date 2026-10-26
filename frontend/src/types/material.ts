// 자료 올리기 응답 (POST /api/materials)
export interface Material {
  id: number;
  courseId: number;
  title: string;
}

// 자료 올리기 요청. 파일이 있어 multipart/form-data로 보낸다
export interface MaterialUploadInput {
  courseId: number;
  title: string;
  file: File;
}

// processing: 올린 뒤 AI가 요약·개념·퀴즈를 만드는 중 / ready: 완료 / failed: 글을 뽑지 못함 등
export type MaterialStatus = 'processing' | 'ready' | 'failed';

// 내 학습자료 목록 한 줄 (GET /api/materials)
export interface MaterialSummary {
  id: number;
  courseId: number;
  title: string;
  fileName: string;
  createdAt: string; // ISO 문자열
  status: MaterialStatus;
  quizCount: number;
}

// 자료에서 뽑은 핵심 개념. conceptId는 학습 대시보드 ConceptMastery.conceptId와 같은 값
export interface MaterialConcept {
  conceptId: string;
  name: string;
  // 이 자료에서 그 개념을 어떻게 다루는지 (AI가 쓴 설명)
  aiDescription: string | null;
}

// 자료 상세 (GET /api/materials/{id}). ai로 시작하는 필드는 AI가 쓴 글이라 화면에서 보라색 "AI" 표시를 붙인다
export interface MaterialDetail extends MaterialSummary {
  aiSummary: string | null;
  concepts: MaterialConcept[];
}

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

export interface Notice {
  id: number;
  title: string;
  // 'YYYY-MM-DD'
  createdAt: string;
}

// 관리자가 공지를 쓰거나 고칠 때 보내는 내용 (POST·PUT /api/admin/notices)
export interface NoticeInput {
  title: string;
  content: string;
}

// 공지 상세 (GET /api/notices/{id}). 본문은 글자로만 보여 준다 (HTML로 해석하지 않는다)
export interface NoticeDetail extends Notice {
  content: string;
  // 수정한 적이 없으면 null (ISO 문자열)
  updatedAt: string | null;
}

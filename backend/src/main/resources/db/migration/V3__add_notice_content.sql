-- 공지 본문·수정 시각·작성한 관리자. 옛 공지(본문 없음)가 있어서 DB에서는 비워 둘 수 있게 하고,
-- 작성·수정할 때는 API가 제목과 본문을 모두 요구한다. 본문은 글자만 저장한다 (HTML·마크다운으로 해석하지 않는다)
-- VARCHAR로 둔 것은 H2와 MySQL에서 같은 타입으로 인식되게 하기 위해서다 (TEXT는 DB마다 달라 Hibernate 검증이 어긋난다)
ALTER TABLE notice ADD COLUMN content VARCHAR(5000);
ALTER TABLE notice ADD COLUMN updated_at DATETIME(6);
ALTER TABLE notice ADD COLUMN author_id BIGINT;
-- 작성한 관리자가 탈퇴해도 공지는 남는다
ALTER TABLE notice ADD CONSTRAINT fk_notice_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL;

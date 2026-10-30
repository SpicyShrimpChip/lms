-- 벡터 검색(챗봇 자료 검색)을 위한 pgvector 확장. H2에는 없어서 local·prod·pgTest 프로필에서만 이 폴더를 읽는다
-- 벡터 컬럼·임베딩 테이블은 챗봇 검색을 만들 때 추가한다
CREATE EXTENSION IF NOT EXISTS vector;

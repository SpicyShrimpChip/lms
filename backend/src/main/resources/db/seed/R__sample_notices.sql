-- 로컬 확인용 샘플 공지 (프론트 목업 frontend/src/mocks/notices.ts와 같다). 운영(prod) 프로필에서는 실행하지 않는다.
-- 반복 실행(R__) 마이그레이션이라 내용이 바뀌면 다시 돈다. 같은 제목이 있으면 넣지 않는다
INSERT INTO notice (title, created_at)
SELECT '서비스를 시작했어요', '2026-10-15' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM notice WHERE title = '서비스를 시작했어요');

INSERT INTO notice (title, created_at)
SELECT '개인정보 처리 방식을 안내해 드려요', '2026-10-20' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM notice WHERE title = '개인정보 처리 방식을 안내해 드려요');

INSERT INTO notice (title, created_at)
SELECT 'AI 대화 가져오기 기능을 준비하고 있어요', '2026-10-24' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM notice WHERE title = 'AI 대화 가져오기 기능을 준비하고 있어요');

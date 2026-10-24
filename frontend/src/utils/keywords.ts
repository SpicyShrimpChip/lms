export const KEYWORD_MAX_COUNT = 20;
export const KEYWORD_MAX_LENGTH = 20;

// 앞뒤 공백을 지우고, 안쪽 공백은 한 칸으로 줄인다
export function normalizeKeyword(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

interface AddKeywordsResult {
  keywords: string[];
  // 일부를 넣지 못했을 때 화면에 보여 줄 문구
  error?: string;
}

// 입력값(쉼표로 여러 개 가능)을 기존 키워드 뒤에 붙인다. 대소문자만 다른 중복은 건너뛴다
export function addKeywords(current: string[], raw: string): AddKeywordsResult {
  const keywords = [...current];
  let error: string | undefined;

  for (const part of raw.split(',')) {
    const keyword = normalizeKeyword(part);
    if (!keyword) continue;
    if (keyword.length > KEYWORD_MAX_LENGTH) {
      error = `키워드는 ${KEYWORD_MAX_LENGTH}자까지 넣을 수 있어요.`;
      continue;
    }
    const exists = keywords.some(
      (item) => item.toLowerCase() === keyword.toLowerCase(),
    );
    if (exists) continue;
    if (keywords.length >= KEYWORD_MAX_COUNT) {
      error = `키워드는 ${KEYWORD_MAX_COUNT}개까지 넣을 수 있어요.`;
      break;
    }
    keywords.push(keyword);
  }

  return { keywords, error };
}

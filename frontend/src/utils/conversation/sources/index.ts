import type { ConversationSourceReader } from '../types';
import { chatGptReader } from './chatgpt';
import { claudeReader } from './claude';

// 알아보는 순서대로. 파일 하나는 처음 맞는 서비스 하나로만 읽는다
// TODO(미결): Gemini(Takeout의 내활동.html)는 2단계 후보
export const SOURCE_READERS: ConversationSourceReader[] = [
  chatGptReader,
  claudeReader,
];

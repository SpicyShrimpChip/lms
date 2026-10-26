import type { Course } from '@/types';
import { filterByKeywords } from './filter';
import { conversationKey } from './merge';
import type { ParsedConversation } from './types';

export interface CourseMatch {
  courseId: number;
  // 이 과목 키워드 중 대화에서 찾은 것 (등록한 순서)
  matchedKeywords: string[];
}

export interface AssignedConversation {
  conversation: ParsedConversation;
  // 키워드가 걸린 과목들. 많이 걸린 과목이 앞이고, 첫 번째가 기본으로 들어갈 과목이다
  matches: CourseMatch[];
}

export interface AssignResult {
  assigned: AssignedConversation[];
  // 어느 과목 키워드에도 걸리지 않아 보내지 않는 대화 수
  unmatchedCount: number;
}

// 내 과목 전체의 키워드로 공부한 대화를 고르고, 각 대화를 어느 과목에 넣을지 정한다.
// 여러 과목에 걸리면 키워드가 더 많이 걸린 과목, 같으면 과목 목록에서 앞선 과목을 고른다 (사용자가 바꿀 수 있다)
export function assignToCourses(
  conversations: ParsedConversation[],
  courses: Course[],
): AssignResult {
  const matchesByKey = new Map<string, CourseMatch[]>();
  for (const course of courses) {
    for (const { conversation, matchedKeywords } of filterByKeywords(
      conversations,
      course.keywords,
    )) {
      const key = conversationKey(conversation);
      const list = matchesByKey.get(key) ?? [];
      list.push({ courseId: course.id, matchedKeywords });
      matchesByKey.set(key, list);
    }
  }

  const assigned: AssignedConversation[] = [];
  for (const conversation of conversations) {
    const matches = matchesByKey.get(conversationKey(conversation));
    if (!matches) continue;
    // sort는 안정 정렬이라 개수가 같으면 과목 목록 순서가 유지된다
    matches.sort((a, b) => b.matchedKeywords.length - a.matchedKeywords.length);
    assigned.push({ conversation, matches });
  }
  return { assigned, unmatchedCount: conversations.length - assigned.length };
}

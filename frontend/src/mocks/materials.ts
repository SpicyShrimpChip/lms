import type { Material, MaterialUploadInput } from '@/types';
import { mockDelay } from './delay';

// 목업은 저장하지 않고 성공만 돌려준다 (자료 목록 화면이 생기면 저장소를 붙인다)
export function mockUploadMaterial(
  input: MaterialUploadInput,
): Promise<Material> {
  return mockDelay(
    { id: Date.now(), courseId: input.courseId, title: input.title },
    800,
  );
}

import { MATERIAL_EXTENSIONS, MATERIAL_MAX_SIZE_MB } from '@/constants';

// 지원 형식 안내 문구 (예: "PDF, TXT, Markdown")
export const MATERIAL_FORMAT_LABEL = MATERIAL_EXTENSIONS.map((ext) =>
  ext === 'md' ? 'Markdown' : ext.toUpperCase(),
).join(', ');

// 올릴 파일의 형식·크기를 검사한다. 문제가 없으면 undefined, 있으면 사용자에게 보일 문구
// 서버도 같은 검사를 해야 한다 (브라우저 검사는 우회할 수 있다)
export function validateMaterialFile(
  file: Pick<File, 'name' | 'size'>,
): string | undefined {
  const ext = file.name.includes('.')
    ? (file.name.split('.').pop()?.toLowerCase() ?? '')
    : '';
  if (!(MATERIAL_EXTENSIONS as readonly string[]).includes(ext)) {
    return `${MATERIAL_FORMAT_LABEL} 파일만 올릴 수 있어요.`;
  }
  if (file.size === 0) return '빈 파일은 올릴 수 없어요.';
  if (file.size > MATERIAL_MAX_SIZE_MB * 1024 * 1024) {
    return `파일은 ${MATERIAL_MAX_SIZE_MB}MB까지 올릴 수 있어요.`;
  }
  return undefined;
}

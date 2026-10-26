// ISO 문자열을 'YYYY-MM-DD'로 (화면 표시용, 내 컴퓨터 시간대 기준). 날짜가 아니면 null
export function formatDate(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

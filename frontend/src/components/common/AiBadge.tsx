import { Sparkles } from 'lucide-react';

// AI가 만든 콘텐츠 표시. 색만으로 구분하지 않도록 아이콘과 글자를 항상 함께 쓴다
function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ai-chip px-2.5 py-1 text-caption font-medium text-ai">
      <Sparkles size={14} aria-hidden="true" />
      AI
    </span>
  );
}

export default AiBadge;

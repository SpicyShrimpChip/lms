import { Sparkles } from 'lucide-react';

interface AiBadgeProps {
  label?: string;
}

// AI가 만든 콘텐츠 표시. 색만으로 구분하지 않도록 아이콘과 글자를 항상 함께 쓴다
function AiBadge({ label = 'AI' }: AiBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ai-chip px-2.5 py-1 text-[13px] font-medium text-ai">
      <Sparkles size={14} aria-hidden="true" />
      {label}
    </span>
  );
}

export default AiBadge;

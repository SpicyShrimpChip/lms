import { useMemo, useState, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChartColumn, Sparkles } from 'lucide-react';
import * as m from 'motion/react-m';
import { getDashboard } from '@/api';
import { FADE_UP } from '@/constants';
import { AsyncBoundary, EmptyState, SubPage } from '@/components';
import type { DashboardComponentId } from '@/types';
import {
  filterDashboard,
  parseDashboardLayout,
  pickWeakestConcept,
} from '@/utils';
import ConceptDetailPanel from './components/ConceptDetailPanel';
import CourseFilter from './components/CourseFilter';
import CourseSharePanel from './components/CourseSharePanel';
import LayoutSummary from './components/LayoutSummary';
import MasteryPanel from './components/MasteryPanel';
import RecommendationPanel from './components/RecommendationPanel';
import StudySummaryPanel from './components/StudySummaryPanel';

function Dashboard() {
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });
  const [courseId, setCourseId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // LLM이 만든 배치 JSON은 검증을 통과할 때만 쓰고, 아니면 기본 배치. 받아 올 때만 다시 검사한다
  const layout = useMemo(
    () => parseDashboardLayout(data.layout),
    [data.layout],
  );

  if (data.concepts.length === 0) {
    return (
      <EmptyState
        icon={<ChartColumn size={24} aria-hidden="true" />}
        title="아직 분석할 학습 기록이 없어요"
        description="ChatGPT나 Claude와 공부한 대화를 가져오면 개념별 강점과 보완할 점을 보여 드려요."
        action={{ label: '대화 가져오기', to: '/analysis/import' }}
      />
    );
  }

  const view = filterDashboard(data, courseId);
  // 고른 개념이 지금 과목에 없으면 가장 약한 개념을 보여 준다
  const selected =
    view.concepts.find((item) => item.conceptId === selectedId) ??
    pickWeakestConcept(view.concepts);

  // 영역 id → 화면. 배치 JSON에는 이 id만 올 수 있다
  const renderComponent = (
    id: DashboardComponentId,
    reason: string | null,
  ): ReactNode => {
    switch (id) {
      case 'summary':
        return (
          <StudySummaryPanel summaries={view.summaries} layoutReason={reason} />
        );
      case 'mastery':
        return (
          <MasteryPanel
            concepts={view.concepts}
            selectedId={selected?.conceptId ?? null}
            onSelect={setSelectedId}
            layoutReason={reason}
          />
        );
      case 'conceptDetail':
        return <ConceptDetailPanel concept={selected} layoutReason={reason} />;
      case 'recommendation':
        return (
          <RecommendationPanel
            recommendations={view.recommendations}
            concepts={data.concepts}
            summaries={data.summaries}
            layoutReason={reason}
          />
        );
      case 'courseShare':
        // 과목 하나를 고르면 비중은 의미가 없어 숨긴다
        return courseId === null ? (
          <CourseSharePanel summaries={data.summaries} layoutReason={reason} />
        ) : null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CourseFilter
          summaries={data.summaries}
          selected={courseId}
          onSelect={setCourseId}
        />
        <p className="flex items-center gap-1.5 text-caption text-ai">
          <Sparkles size={14} aria-hidden="true" />
          AI 표시가 있는 내용은 AI가 작성했어요
        </p>
      </div>

      <LayoutSummary layout={layout} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {layout.items.map((item, index) => {
          const content = renderComponent(item.component, item.aiReason);
          if (!content) return null;
          return (
            // 영역이 위에서부터 차례로 나타난다 (과목 탭을 바꿔도 영역은 다시 그려지지 않아 처음에만 보인다)
            <m.div
              key={item.component}
              initial={FADE_UP.initial}
              animate={FADE_UP.animate}
              transition={{ ...FADE_UP.transition, delay: index * 0.06 }}
              className={item.size === 'wide' ? 'lg:col-span-2' : undefined}
            >
              {content}
            </m.div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <SubPage
      title="학습 대시보드"
      description="개념별 숙련도와 그렇게 판단한 근거를 함께 보여 드려요"
    >
      <AsyncBoundary>
        <Dashboard />
      </AsyncBoundary>
    </SubPage>
  );
}

export default DashboardPage;

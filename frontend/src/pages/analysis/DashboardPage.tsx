import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChartColumn, Sparkles } from 'lucide-react';
import { getDashboard } from '@/api';
import { AsyncBoundary, EmptyState, SubPage } from '@/components';
import { filterDashboard, pickWeakestConcept } from '@/utils';
import ConceptDetailPanel from './components/ConceptDetailPanel';
import CourseFilter from './components/CourseFilter';
import CourseSharePanel from './components/CourseSharePanel';
import MasteryPanel from './components/MasteryPanel';
import RecommendationPanel from './components/RecommendationPanel';
import StudySummaryPanel from './components/StudySummaryPanel';

// TODO: 배치 JSON(zod 검증)으로 영역 순서를 바꾸는 동적 배치는 다음 PR
function Dashboard() {
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });
  const [courseId, setCourseId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

      <StudySummaryPanel summaries={view.summaries} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <MasteryPanel
          concepts={view.concepts}
          selectedId={selected?.conceptId ?? null}
          onSelect={setSelectedId}
        />
        <ConceptDetailPanel concept={selected} />
      </div>

      <div
        className={`grid grid-cols-1 gap-6 ${courseId === null ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''}`}
      >
        <RecommendationPanel
          recommendations={view.recommendations}
          concepts={data.concepts}
          summaries={data.summaries}
        />
        {courseId === null && <CourseSharePanel summaries={data.summaries} />}
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <SubPage
      title="학습 대시보드"
      description="개념별 숙련도와 그렇게 판단한 근거를 함께 보여 드려요"
      breadcrumb={['학습분석', '학습 대시보드']}
    >
      <AsyncBoundary>
        <Dashboard />
      </AsyncBoundary>
    </SubPage>
  );
}

export default DashboardPage;

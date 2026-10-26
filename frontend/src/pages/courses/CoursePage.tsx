import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { BookMarked } from 'lucide-react';
import { deleteCourse, getCourses } from '@/api';
import {
  AsyncBoundary,
  ConfirmDialog,
  EmptyState,
  SubPage,
} from '@/components';
import type { Course } from '@/types';
import { compareSemesterDesc } from '@/utils';
import CourseCard from './components/CourseCard';
import CourseForm from './components/CourseForm';

function CourseManager() {
  const queryClient = useQueryClient();
  const { data: courses } = useSuspenseQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);

  const removal = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });

  const confirmDelete = () => {
    if (!deleting) return;
    if (editing?.id === deleting.id) setEditing(null);
    removal.mutate(deleting.id);
    setDeleting(null);
  };

  const sorted = [...courses].sort(
    (a, b) =>
      compareSemesterDesc(a.semester, b.semester) ||
      a.name.localeCompare(b.name, 'ko'),
  );

  return (
    <>
      <CourseForm
        key={editing?.id ?? 'new'}
        courses={courses}
        editing={editing}
        onDone={() => setEditing(null)}
      />

      <section aria-labelledby="course-list" className="flex flex-col gap-4">
        <h2 id="course-list" className="text-xl font-extrabold text-heading">
          등록한 과목 {courses.length}개
        </h2>
        {removal.isError && (
          <p role="alert" className="text-body text-danger">
            {removal.error.message}
          </p>
        )}
        {sorted.length === 0 ? (
          <EmptyState
            icon={<BookMarked size={24} aria-hidden="true" />}
            title="아직 등록한 과목이 없어요"
            description="이번 학기 과목과 키워드를 등록하면, AI 대화를 가져올 때 공부한 대화만 골라낼 수 있어요."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {sorted.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() => {
                  setEditing(course);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDelete={() => setDeleting(course)}
                deleting={removal.isPending && removal.variables === course.id}
              />
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={deleting !== null}
        title={`'${deleting?.name ?? ''}' 과목을 삭제할까요?`}
        description="삭제한 과목은 되돌릴 수 없어요."
        confirmLabel="삭제하기"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}

function CoursePage() {
  return (
    <SubPage
      title="내 과목"
      description="이번 학기 과목을 등록하면 공부한 대화를 과목별로 골라 드려요"
    >
      <AsyncBoundary>
        <CourseManager />
      </AsyncBoundary>
    </SubPage>
  );
}

export default CoursePage;

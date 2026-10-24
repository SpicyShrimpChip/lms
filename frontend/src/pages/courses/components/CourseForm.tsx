import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse, updateCourse } from '@/api';
import { Button, FormRow, TextInput } from '@/components';
import type { Course, CourseInput } from '@/types';
import {
  formatSemester,
  getCurrentSemester,
  getSemesterOptions,
  normalizeKeyword,
} from '@/utils';
import KeywordInput from './KeywordInput';

const NAME_MAX_LENGTH = 40;

interface CourseFormProps {
  courses: Course[];
  // 수정 중인 과목. 없으면 새 과목 추가
  editing: Course | null;
  onDone: () => void;
}

// 과목 추가·수정 폼. 수정할 과목이 바뀌면 부모가 key를 바꿔 새로 그린다
function CourseForm({ courses, editing, onDone }: CourseFormProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(editing?.name ?? '');
  const [semester, setSemester] = useState(
    () => editing?.semester ?? getCurrentSemester(),
  );
  const [keywords, setKeywords] = useState(editing?.keywords ?? []);
  const [nameError, setNameError] = useState<string>();

  const mutation = useMutation({
    mutationFn: (input: CourseInput) =>
      editing ? updateCourse(editing.id, input) : createCourse(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      setName('');
      setKeywords([]);
      onDone();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = normalizeKeyword(name);
    if (!trimmed) {
      setNameError('과목 이름을 입력해 주세요.');
      return;
    }
    if (trimmed.length > NAME_MAX_LENGTH) {
      setNameError(`과목 이름은 ${NAME_MAX_LENGTH}자까지 넣을 수 있어요.`);
      return;
    }
    const duplicated = courses.some(
      (course) =>
        course.id !== editing?.id &&
        course.semester === semester &&
        course.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicated) {
      setNameError('이 학기에 같은 이름의 과목이 이미 있어요.');
      return;
    }
    setNameError(undefined);
    mutation.mutate({ name: trimmed, semester, keywords });
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={editing ? '과목 수정' : '과목 추가'}
      className="flex flex-col gap-5"
    >
      <h2 className="text-xl font-bold text-heading-soft">
        {editing ? `'${editing.name}' 수정하기` : '과목 추가'}
      </h2>
      <div className="border-t-2 border-heading-soft">
        <FormRow label="과목 이름" htmlFor="course-name" required>
          <TextInput
            id="course-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_MAX_LENGTH}
            placeholder="운영체제"
            aria-invalid={nameError ? true : undefined}
            aria-describedby="course-name-error"
          />
          <p
            id="course-name-error"
            aria-live="polite"
            className="text-caption text-danger"
          >
            {nameError}
          </p>
        </FormRow>
        <FormRow label="학기" htmlFor="course-semester">
          <select
            id="course-semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="h-10 w-full max-w-60 rounded-md border border-input-border bg-surface-raised px-3 text-body outline-none focus:border-primary"
          >
            {getSemesterOptions().map((option) => (
              <option key={option} value={option}>
                {formatSemester(option)}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow
          label="키워드"
          htmlFor="course-keywords"
          hint="수업에 자주 나오는 단어를 넣어 주세요. Enter나 쉼표로 추가하고, 20개까지 넣을 수 있어요."
        >
          <KeywordInput
            id="course-keywords"
            keywords={keywords}
            onChange={setKeywords}
          />
        </FormRow>
      </div>

      {mutation.isError && (
        <p role="alert" className="text-center text-body text-danger">
          {mutation.error.message}
        </p>
      )}

      <div className="flex justify-center gap-3">
        {editing && (
          <Button variant="secondary" size="lg" onClick={onDone}>
            취소
          </Button>
        )}
        <Button type="submit" size="lg" disabled={mutation.isPending}>
          {editing ? '수정 내용 저장하기' : '과목 추가하기'}
        </Button>
      </div>
    </form>
  );
}

export default CourseForm;

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCourses, uploadMaterial } from '@/api';
import {
  Button,
  Card,
  FormRow,
  SelectInput,
  SubPage,
  TextInput,
} from '@/components';
import {
  MATERIAL_EXTENSIONS,
  MATERIAL_MAX_SIZE_MB,
  MATERIAL_TITLE_MAX_LENGTH,
} from '@/constants';
import {
  MATERIAL_FORMAT_LABEL,
  formatSemester,
  normalizeKeyword,
  validateMaterialFile,
} from '@/utils';

const ACCEPT = MATERIAL_EXTENSIONS.map((ext) => `.${ext}`).join(',');

function MaterialUploadPage() {
  const {
    data: courses,
    isPending,
    isError,
  } = useQuery({ queryKey: ['courses'], queryFn: getCourses });
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();
  const [agreed, setAgreed] = useState(false);
  // 같은 파일을 다시 고를 수 있도록 올린 뒤 파일 입력칸을 새로 그린다
  const [fileInputKey, setFileInputKey] = useState(0);

  const mutation = useMutation({
    mutationFn: uploadMaterial,
    onSuccess: () => {
      setCourseId('');
      setTitle('');
      setFile(null);
      setAgreed(false);
      setFileInputKey((key) => key + 1);
    },
  });

  const hasCourses = (courses?.length ?? 0) > 0;

  const handleFileChange = (picked: File | undefined) => {
    mutation.reset();
    if (!picked) {
      setFile(null);
      setFileError(undefined);
      return;
    }
    const error = validateMaterialFile(picked);
    setFileError(error);
    setFile(error ? null : picked);
    // 제목이 비어 있으면 파일 이름을 제안한다
    if (!error && !title) {
      setTitle(
        picked.name.replace(/\.[^.]+$/, '').slice(0, MATERIAL_TITLE_MAX_LENGTH),
      );
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = normalizeKeyword(title);
    if (!file || !agreed || !courseId || !trimmed) return;
    mutation.mutate({ courseId: Number(courseId), title: trimmed, file });
  };

  let courseHint: string | undefined;
  if (isPending) courseHint = '과목을 불러오는 중이에요.';
  else if (isError) courseHint = '과목을 불러오지 못했어요. 새로고침해 주세요.';

  return (
    <SubPage
      title="자료 올리기"
      description="공부할 자료를 올리면 요약과 핵심 개념을 정리해 드려요"
      breadcrumb={['학습자료', '자료 올리기']}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="border-t-2 border-heading-soft">
          <FormRow
            label="과목"
            htmlFor="material-course"
            required
            hint={courseHint}
          >
            {!isPending && !isError && !hasCourses ? (
              <p className="text-body text-ink-soft">
                등록한 과목이 없어요.{' '}
                <Link to="/courses" className="text-primary underline">
                  내 과목에서 먼저 등록해 주세요
                </Link>
              </p>
            ) : (
              <SelectInput
                id="material-course"
                required
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={!hasCourses}
                className="w-full max-w-80"
              >
                <option value="">과목을 골라 주세요</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({formatSemester(course.semester)})
                  </option>
                ))}
              </SelectInput>
            )}
          </FormRow>
          <FormRow
            label="자료 파일"
            htmlFor="material-file"
            required
            error={fileError ?? ''}
            hint={`${MATERIAL_FORMAT_LABEL} 파일을 ${MATERIAL_MAX_SIZE_MB}MB까지 올릴 수 있어요.`}
          >
            <input
              key={fileInputKey}
              id="material-file"
              type="file"
              accept={ACCEPT}
              required
              aria-invalid={fileError ? true : undefined}
              aria-describedby="material-file-error"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              className="text-body file:mr-3 file:rounded-md file:border file:border-input-border file:bg-surface-raised file:px-3 file:py-1.5 file:text-body file:text-ink-soft"
            />
          </FormRow>
          <FormRow label="자료 제목" htmlFor="material-title" required>
            <TextInput
              id="material-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MATERIAL_TITLE_MAX_LENGTH}
              placeholder="운영체제 3주차 정리 노트"
            />
          </FormRow>
        </div>

        <Card as="section" className="p-5">
          <h2 className="text-body font-bold text-heading-soft">
            본인이 이용 권한이 있는 자료만 올려 주세요
          </h2>
          <ul className="mt-2 list-disc pl-5 text-body text-ink-soft">
            <li>이런 자료를 권해요: 직접 쓴 필기, 정리 노트, 연습문제 풀이</li>
            <li>
              올린 자료와 그로부터 만든 요약·퀴즈는 올린 본인만 볼 수 있고, 다른
              사람과 공유되지 않아요.
            </li>
          </ul>
          <label className="mt-3 flex items-start gap-2 text-body text-ink">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <span>이 자료를 올릴 권한이 있어요.</span>
          </label>
        </Card>

        {mutation.isError && (
          <p role="alert" className="text-center text-body text-danger">
            {mutation.error.message}
          </p>
        )}
        {mutation.isSuccess && (
          <p role="status" className="text-center text-body text-strength">
            자료를 올렸어요.
          </p>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={mutation.isPending || !agreed || !file || !hasCourses}
          >
            {mutation.isPending ? '올리는 중…' : '자료 올리기'}
          </Button>
        </div>
      </form>
    </SubPage>
  );
}

export default MaterialUploadPage;

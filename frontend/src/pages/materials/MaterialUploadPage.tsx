import type { FormEvent } from 'react';
import { Button, FormRow, SubPage, TextInput } from '@/components';

function MaterialUploadPage() {
  // TODO: 업로드 API가 준비되면 파일 형식·크기를 검사하고 전송한다
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <SubPage
      title="자료 올리기"
      description="공부할 자료를 올리면 요약과 핵심 개념을 정리해 드려요"
      breadcrumb={['학습자료', '자료 올리기']}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="border-t-2 border-heading-soft">
          <FormRow
            label="자료 파일"
            htmlFor="material-file"
            required
            // TODO: 지원 형식은 백엔드 자료 파싱 범위에 맞춰 확정
            hint="PDF, TXT, Markdown 파일을 올릴 수 있어요."
          >
            <input
              id="material-file"
              type="file"
              accept=".pdf,.txt,.md"
              required
              className="text-body file:mr-3 file:rounded-md file:border file:border-input-border file:bg-surface-raised file:px-3 file:py-1.5 file:text-body file:text-ink-soft"
            />
          </FormRow>
          <FormRow label="자료 제목" htmlFor="material-title" required>
            <TextInput
              id="material-title"
              type="text"
              required
              placeholder="자료구조 3주차 강의 노트"
            />
          </FormRow>
        </div>
        <div className="flex justify-center">
          <Button type="submit" size="lg">
            자료 올리기
          </Button>
        </div>
      </form>
    </SubPage>
  );
}

export default MaterialUploadPage;

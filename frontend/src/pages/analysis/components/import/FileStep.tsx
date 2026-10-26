import { useState, type DragEvent } from 'react';
import { FileText, LoaderCircle, Lock, Upload } from 'lucide-react';
import { Button } from '@/components';
import type { MergedImport } from '@/utils';
import { readExportFiles } from './readExportFiles';

interface FileStepProps {
  imported: MergedImport | null;
  onLoaded: (imported: MergedImport) => void;
  onNext: () => void;
}

function FileStep({ imported, onLoaded, onNext }: FileStepProps) {
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (list: FileList | null) => {
    const files = list ? [...list] : [];
    if (files.length === 0) return;
    setReading(true);
    try {
      onLoaded(await readExportFiles(files));
    } finally {
      setReading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  };

  const count = imported?.conversations.length ?? 0;

  return (
    <section
      aria-labelledby="import-file"
      className="flex flex-col gap-5 rounded-2xl border border-line bg-surface-raised p-6 md:p-8"
    >
      <h2 id="import-file" className="text-xl font-bold text-heading-soft">
        대화 내보내기 파일 고르기
      </h2>

      <label
        htmlFor="conversation-file"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center hover:border-primary hover:bg-primary-soft ${
          dragging ? 'border-primary bg-primary-soft' : 'border-line-strong'
        }`}
      >
        {reading ? (
          <LoaderCircle
            size={28}
            className="animate-spin text-primary"
            aria-hidden="true"
          />
        ) : (
          <Upload size={28} className="text-primary" aria-hidden="true" />
        )}
        <span className="font-medium text-heading">
          {reading
            ? '파일을 읽는 중이에요'
            : 'conversations.json을 여기에 놓거나 눌러서 고르세요'}
        </span>
        <span className="text-body text-ink-muted">
          ChatGPT, Claude에서 내보낸 압축 파일을 풀면 들어 있어요. 여러 개로
          나뉘어 있으면 모두 골라 주세요.
        </span>
      </label>
      <input
        id="conversation-file"
        type="file"
        accept=".json,.zip,application/json"
        multiple
        disabled={reading}
        onChange={(e) => {
          void handleFiles(e.target.files);
          // 같은 파일을 다시 골라도 읽도록 비운다
          e.target.value = '';
        }}
        className="sr-only"
      />

      <div aria-live="polite" className="flex flex-col gap-3">
        {imported?.errors.map((error) => (
          <p
            key={error.fileName}
            role="alert"
            className="flex items-start gap-2 text-body text-danger"
          >
            <FileText
              size={18}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span>
              <span className="font-medium">{error.fileName}</span>:{' '}
              {error.message}
            </span>
          </p>
        ))}
        {count > 0 && (
          <div className="flex flex-col gap-1 rounded-xl bg-primary-soft p-4">
            <p className="font-bold text-heading">대화 {count}개를 읽었어요.</p>
            {(imported!.skippedCount > 0 || imported!.duplicateCount > 0) && (
              <p className="text-body text-ink-soft">
                {imported!.skippedCount > 0 &&
                  `글이 없는 대화 ${imported!.skippedCount}개는 건너뛰었어요. `}
                {imported!.duplicateCount > 0 &&
                  `여러 파일에 같은 대화 ${imported!.duplicateCount}개가 있어 하나로 합쳤어요.`}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-4">
        <Lock
          size={20}
          className="mt-0.5 shrink-0 text-heading-soft"
          aria-hidden="true"
        />
        <p className="text-body leading-relaxed text-ink-soft">
          파일은 서버로 보내지 않고 내 브라우저에서만 읽어요. 공부한 대화만 골라
          이메일, 전화번호 같은 개인정보를 가린 뒤, 내가 선택한 대화만 보내요.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={count === 0 || reading}>
          다음: 공부한 대화 고르기
        </Button>
      </div>
    </section>
  );
}

export default FileStep;

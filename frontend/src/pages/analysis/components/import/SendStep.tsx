import { useMutation } from '@tanstack/react-query';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { importConversations } from '@/api';
import { Button, Card, ErrorText } from '@/components';
import { useCourses } from '@/hooks';
import type { ConversationImportResult } from '@/types';
import { buildImportRequests, type ConversationToSend } from '@/utils';

interface SendStepProps {
  // 개인정보를 가린 뒤의 대화
  items: ConversationToSend[];
  onBack: () => void;
  onRestart: () => void;
}

// 과목별 요청을 차례로 보내고 결과를 합친다 (한 요청이 실패하면 거기서 멈추고 오류를 보여 준다)
async function sendAll(
  items: ConversationToSend[],
): Promise<ConversationImportResult> {
  const total: ConversationImportResult = { importedCount: 0, rejected: [] };
  for (const request of buildImportRequests(items)) {
    const result = await importConversations(request);
    total.importedCount += result.importedCount;
    total.rejected.push(...result.rejected);
  }
  return total;
}

function SendStep({ items, onBack, onRestart }: SendStepProps) {
  const { data: courses } = useCourses();
  const mutation = useMutation({ mutationFn: sendAll });

  const countByCourse = courses
    .map((course) => ({
      course,
      count: items.filter((item) => item.courseId === course.id).length,
    }))
    .filter(({ count }) => count > 0);
  const titleOf = (clientId: string) =>
    items.find((item) => item.conversation.id === clientId)?.conversation
      .title ?? clientId;

  if (mutation.isSuccess) {
    const { importedCount, rejected } = mutation.data;
    return (
      <Card
        as="section"
        aria-labelledby="import-done"
        className="flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="flex items-start gap-3">
          <CircleCheck
            size={28}
            className="shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <h2 id="import-done" className="text-xl font-bold text-heading">
              대화 {importedCount}개를 보냈어요
            </h2>
            <p className="text-body text-ink-soft">
              분석이 끝나면 학습 분석에서 개념별 강점과 보완할 점을 볼 수
              있어요.
            </p>
          </div>
        </div>

        {rejected.length > 0 && (
          <div
            role="alert"
            className="flex flex-col gap-2 rounded-xl border border-line-strong bg-surface-muted p-4"
          >
            <p className="flex items-center gap-2 font-bold text-heading">
              <TriangleAlert size={18} aria-hidden="true" />
              대화 {rejected.length}개는 저장하지 않았어요
            </p>
            <ul className="flex flex-col gap-1 text-body text-ink-soft">
              {rejected.map(({ clientId, reason }) => (
                <li key={clientId}>
                  <span className="font-medium text-heading">
                    {titleOf(clientId)}
                  </span>
                  : {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3">
          <Button variant="secondary" onClick={onRestart}>
            다른 파일 가져오기
          </Button>
          <Button to="/analysis">학습 분석 보기</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      as="section"
      aria-labelledby="import-send"
      className="flex flex-col gap-6 p-6 md:p-8"
    >
      <div className="flex flex-col gap-2">
        <h2 id="import-send" className="text-xl font-extrabold text-heading">
          보내기
        </h2>
        <p className="text-body text-ink-soft">
          개인정보를 가린 대화만 과목별로 보내요. 원본 파일과 이미지는 보내지
          않아요.
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {countByCourse.map(({ course, count }) => (
          <li
            key={course.id}
            className="flex items-center justify-between py-3 text-body"
          >
            <span className="font-medium text-heading">{course.name}</span>
            <span className="text-ink-soft">대화 {count}개</span>
          </li>
        ))}
      </ul>

      <ErrorText error={mutation.error} />

      <div className="flex flex-wrap justify-between gap-3">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={mutation.isPending}
        >
          이전
        </Button>
        <Button
          onClick={() => mutation.mutate(items)}
          disabled={mutation.isPending || items.length === 0}
        >
          {mutation.isPending
            ? '보내는 중이에요'
            : `선택한 대화 ${items.length}개 보내기`}
        </Button>
      </div>
    </Card>
  );
}

export default SendStep;

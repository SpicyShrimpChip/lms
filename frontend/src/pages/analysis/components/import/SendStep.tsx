import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { importConversations } from '@/api';
import { Button, Card, ErrorText, Notice } from '@/components';
import { useCourses } from '@/hooks';
import type { RejectedConversation } from '@/types';
import {
  buildImportRequests,
  partCountOf,
  type ConversationToSend,
} from '@/utils';

interface SendStepProps {
  // 개인정보를 가린 뒤의 대화
  items: ConversationToSend[];
  onBack: () => void;
  onRestart: () => void;
}

interface SendSummary {
  // 저장된 대화 수 (나눠 보낸 조각은 원래 대화 하나로 센다)
  importedCount: number;
  // 저장하지 않은 대화. 조각 하나라도 거절되면 그 대화를 한 번만 보여 준다
  rejected: { id: string; title: string; reason: string }[];
}

// 과목별 요청을 차례로 보내고 결과를 합친다 (한 요청이 실패하면 거기서 멈추고 오류를 보여 준다)
async function sendAll(items: ConversationToSend[]): Promise<SendSummary> {
  const rejected: RejectedConversation[] = [];
  for (const request of buildImportRequests(items)) {
    const result = await importConversations(request);
    rejected.push(...result.rejected);
  }

  const byId = new Map(
    items.map(({ conversation }) => [conversation.id, conversation]),
  );
  const summary: SendSummary['rejected'] = [];
  for (const { clientId, reason } of rejected) {
    // 조각의 clientId는 "<원래 id>#<번호>"
    const id = byId.has(clientId) ? clientId : clientId.replace(/#\d+$/, '');
    if (summary.some((item) => item.id === id)) continue;
    summary.push({ id, title: byId.get(id)?.title ?? clientId, reason });
  }
  return { importedCount: items.length - summary.length, rejected: summary };
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
  // 나눠 보낼 대화와 조각 수
  const splitItems = useMemo(
    () =>
      items
        .map(({ conversation }) => ({
          conversation,
          parts: partCountOf(conversation),
        }))
        .filter(({ parts }) => parts > 1),
    [items],
  );

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
              {rejected.map(({ id, title, reason }) => (
                <li key={id}>
                  <span className="font-medium text-heading">{title}</span>:{' '}
                  {reason}
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

      {splitItems.length > 0 && (
        <Notice icon={Info} size="caption">
          <p>
            메시지가 아주 많은 대화 {splitItems.length}개는 나눠서 보내요.
            빠지는 메시지는 없어요.
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-4">
            {splitItems.map(({ conversation, parts }) => (
              <li key={conversation.id}>
                <span className="text-heading">{conversation.title}</span>
                <span className="text-ink-muted">
                  {' '}
                  · 메시지 {conversation.messages.length.toLocaleString()}개 ·{' '}
                  {parts}번
                </span>
              </li>
            ))}
          </ul>
        </Notice>
      )}

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

import { useMemo, useState, type FormEvent } from 'react';
import { ChevronDown, EyeOff } from 'lucide-react';
import { Button, Chip, TextInput } from '@/components';
import {
  MASK_LABELS,
  conversationKey,
  maskConversation,
  maskText,
  type MaskKind,
  type MaskOptions,
  type ParsedConversation,
} from '@/utils';

interface MaskStepProps {
  conversations: ParsedConversation[];
  options: MaskOptions;
  onChangeOptions: (options: MaskOptions) => void;
  onBack: () => void;
  onNext: () => void;
}

// 미리보기에서 대화 하나에 보여 줄 메시지 수 (긴 대화가 화면을 다 차지하지 않게)
const PREVIEW_MESSAGE_LIMIT = 30;

// 가린 결과 글을 그대로 보여 주고, 가린 자리만 표시한다. HTML 문자열로 만들지 않고 조각을 나눠 그린다
function MaskedText({ text, options }: { text: string; options: MaskOptions }) {
  const { text: masked, matches } = maskText(text, options);
  const parts = [];
  let cursor = 0;
  for (const [index, match] of matches.entries()) {
    if (match.start > cursor) parts.push(masked.slice(cursor, match.start));
    parts.push(
      <mark
        key={index}
        className="rounded bg-primary-soft px-0.5 font-medium text-heading"
      >
        {masked.slice(match.start, match.end)}
      </mark>,
    );
    cursor = match.end;
  }
  parts.push(masked.slice(cursor));
  return <>{parts}</>;
}

interface WordListProps {
  id: string;
  label: string;
  hint: string;
  placeholder: string;
  words: string[];
  onChange: (words: string[]) => void;
}

// 내 이름·가릴 단어처럼 여러 개를 넣고 빼는 칸
function WordList({
  id,
  label,
  hint,
  placeholder,
  words,
  onChange,
}: WordListProps) {
  const [draft, setDraft] = useState('');

  const add = (e: FormEvent) => {
    e.preventDefault();
    const word = draft.trim();
    if (word && !words.includes(word)) onChange([...words, word]);
    setDraft('');
  };

  return (
    <form onSubmit={add} className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body font-bold text-heading">
        {label}
      </label>
      <p id={`${id}-hint`} className="text-caption text-ink-muted">
        {hint}
      </p>
      <div className="flex gap-2">
        <TextInput
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          aria-describedby={`${id}-hint`}
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="secondary" disabled={!draft.trim()}>
          더하기
        </Button>
      </div>
      {words.length > 0 && (
        <ul aria-label={label} className="flex flex-wrap gap-1.5">
          {words.map((word) => (
            <li key={word}>
              <Chip
                onRemove={() => onChange(words.filter((w) => w !== word))}
                removeLabel={`${word} 빼기`}
              >
                {word}
              </Chip>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

function MaskStep({
  conversations,
  options,
  onChangeOptions,
  onBack,
  onNext,
}: MaskStepProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const masked = useMemo(
    () =>
      conversations.map((conversation) => ({
        original: conversation,
        ...maskConversation(conversation, options),
      })),
    [conversations, options],
  );

  const totals = useMemo(() => {
    const counts: Partial<Record<MaskKind, number>> = {};
    for (const item of masked) {
      for (const [kind, count] of Object.entries(item.counts)) {
        counts[kind as MaskKind] = (counts[kind as MaskKind] ?? 0) + count;
      }
    }
    return counts;
  }, [masked]);
  const totalCount = masked.reduce((sum, item) => sum + item.totalCount, 0);

  return (
    <section
      aria-labelledby="import-mask"
      className="flex flex-col gap-6 rounded-2xl border border-line bg-surface-raised p-6 md:p-8"
    >
      <div className="flex flex-col gap-2">
        <h2 id="import-mask" className="text-xl font-extrabold text-heading">
          가린 내용 확인
        </h2>
        <p className="text-body text-ink-soft">
          이메일, 전화번호 같은 개인정보는 자동으로 가렸어요. 내 이름이나 더
          가리고 싶은 단어를 넣고, 보내기 전에 대화를 직접 확인해 주세요.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <WordList
          id="mask-names"
          label="내 이름"
          hint="대화 속에 쓴 이름을 [이름]으로 가려요. 영문 이름이나 별명도 함께 넣어 주세요."
          placeholder="예: 홍길동"
          words={options.names ?? []}
          onChange={(names) => onChangeOptions({ ...options, names })}
        />
        <WordList
          id="mask-terms"
          label="더 가릴 단어"
          hint="학교, 회사, 주소처럼 자동으로 찾지 못한 단어를 [가린 단어]로 가려요."
          placeholder="예: OO대학교"
          words={options.terms ?? []}
          onChange={(terms) => onChangeOptions({ ...options, terms })}
        />
      </div>

      <div
        aria-live="polite"
        className="flex flex-col gap-2 rounded-xl bg-primary-soft p-4"
      >
        <p className="font-bold text-heading">
          대화 {conversations.length}개에서 {totalCount}곳을 가렸어요.
        </p>
        {totalCount > 0 && (
          <ul aria-label="가린 종류" className="flex flex-wrap gap-1.5">
            {(Object.keys(MASK_LABELS) as MaskKind[])
              .filter((kind) => totals[kind])
              .map((kind) => (
                <li key={kind}>
                  <Chip tone="primary">
                    {MASK_LABELS[kind]} {totals[kind]}개
                  </Chip>
                </li>
              ))}
          </ul>
        )}
      </div>

      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {masked.map(({ original, conversation, totalCount: count }) => {
          const key = conversationKey(original);
          const open = openId === key;
          const panelId = `mask-preview-${key}`;
          return (
            <li key={key} className="py-3">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : key)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-medium text-heading">
                    {conversation.title}
                  </span>
                  <span className="text-caption text-ink-muted">
                    메시지 {conversation.messages.length}개 ·{' '}
                    {count > 0 ? `${count}곳 가림` : '가린 곳 없음'}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-caption font-medium text-primary">
                  {open ? '접기' : '미리 보기'}
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={open ? 'rotate-180' : undefined}
                  />
                </span>
              </button>
              {open && (
                <div
                  id={panelId}
                  className="mt-3 flex max-h-96 flex-col gap-3 overflow-y-auto rounded-xl bg-surface-muted p-4"
                >
                  {original.messages
                    .slice(0, PREVIEW_MESSAGE_LIMIT)
                    .map((message, index) => (
                      // 메시지에는 id가 없고, 순서가 바뀌거나 중간에 빠지지 않는 읽기 전용 목록이다
                      // eslint-disable-next-line react-x/no-array-index-key
                      <div key={index} className="flex flex-col gap-1">
                        <span className="text-caption font-bold text-ink-muted">
                          {message.role === 'user' ? '나' : 'AI'}
                        </span>
                        <p className="text-body leading-relaxed whitespace-pre-wrap text-ink">
                          <MaskedText text={message.text} options={options} />
                        </p>
                      </div>
                    ))}
                  {original.messages.length > PREVIEW_MESSAGE_LIMIT && (
                    <p className="text-caption text-ink-muted">
                      나머지 메시지{' '}
                      {original.messages.length - PREVIEW_MESSAGE_LIMIT}개도
                      같은 규칙으로 가려요.
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="flex items-start gap-2 text-body text-ink-soft">
        <EyeOff size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        가리기 전의 글은 이 화면에서만 쓰고 서버로 보내지 않아요.
      </p>

      <div className="flex flex-wrap justify-between gap-3">
        <Button variant="secondary" onClick={onBack}>
          이전
        </Button>
        <Button onClick={onNext}>다음: 보내기</Button>
      </div>
    </section>
  );
}

export default MaskStep;

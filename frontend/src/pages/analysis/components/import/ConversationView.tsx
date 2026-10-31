import { useEffect, useRef, useState, type ReactNode } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  cn,
  MASK_LABELS,
  type ConversationMessage,
  type ConversationSource,
} from '@/utils';

// 가져온 대화를 채팅창처럼 보여 준다 (2단계 대화 보기, 3단계 가린 내용 확인에서 같이 쓴다).
// 사용자의 기록이라 AI 말풍선도 보라색(이 서비스의 AI가 쓴 것)으로 칠하지 않고 서비스 이름만 붙인다.
// HTML 문자열로 그리지 않는다: 마크다운은 react-markdown이 React 요소로 만들고, 대화 속 HTML은 그리지 않는다

const SOURCE_NAME: Record<ConversationSource, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
};

// 처음 보여 줄 메시지 수와 "더 보기"로 늘리는 수
const PAGE_SIZE = 30;

const MARK_CLASS = 'rounded bg-primary-soft px-0.5 font-medium text-heading';

const LABEL_PATTERN = new RegExp(
  `(${Object.values(MASK_LABELS)
    .map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})`,
  'g',
);

// 글을 가린 표시([이메일] 등)와 나머지로 나눈다. 홀수 번째가 가린 표시
const splitLabels = (text: string) => text.split(LABEL_PATTERN);

// 마크다운 트리에서 쓰는 만큼만 적은 모양
interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hName?: string; hProperties?: Record<string, string> };
}

// 마크다운 글 조각 안의 가린 표시를 <mark>로 바꾸는 remark 플러그인 (코드 블록 안은 그대로 둔다)
function remarkMaskLabels() {
  const visit = (node: MdNode) => {
    if (!node.children) return;
    node.children = node.children.flatMap((child): MdNode[] => {
      if (child.type !== 'text' || !child.value) {
        visit(child);
        return [child];
      }
      return splitLabels(child.value)
        .map((part, i): MdNode | null => {
          if (!part) return null;
          if (i % 2 === 0) return { type: 'text', value: part };
          return {
            type: 'maskLabel',
            data: { hName: 'mark', hProperties: { className: MARK_CLASS } },
            children: [{ type: 'text', value: part }],
          };
        })
        .filter((part): part is MdNode => part !== null);
    });
  };
  return (tree: MdNode) => visit(tree);
}

const MARKDOWN_COMPONENTS: Components = {
  // 대화 속 링크는 새 탭으로, 이 페이지에 손대지 못하게
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-primary underline"
    >
      {children}
    </a>
  ),
  // 다른 사이트 이미지를 불러오지 않는다 (불러오면 그 사이트에 내 접속이 알려진다)
  img: ({ alt }) => <span>[이미지{alt ? `: ${alt}` : ''}]</span>,
  h1: ({ children }) => <p className="mt-3 font-bold">{children}</p>,
  h2: ({ children }) => <p className="mt-3 font-bold">{children}</p>,
  h3: ({ children }) => <p className="mt-2 font-bold">{children}</p>,
  h4: ({ children }) => <p className="mt-2 font-bold">{children}</p>,
  p: ({ children }) => <p className="my-1.5">{children}</p>,
  ul: ({ children }) => <ul className="my-1.5 list-disc pl-5">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-1.5 list-decimal pl-5">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-1.5 border-l-2 border-line-strong pl-3 text-ink-soft">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-surface-muted p-3 text-caption">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface-muted px-1 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-caption">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-line-strong px-2 py-1 text-left font-bold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-line px-2 py-1">{children}</td>
  ),
  hr: () => <hr className="my-3 border-line" />,
};

// 내가 쓴 글은 마크다운으로 해석하지 않고 줄바꿈을 그대로 둔다 (가린 표시만 칠한다)
function PlainText({ text }: { text: string }) {
  const parts: ReactNode[] = splitLabels(text).map((part, i) =>
    i % 2 === 0 ? (
      part
    ) : (
      // 글 조각 순서는 바뀌지 않는다
      // eslint-disable-next-line react-x/no-array-index-key
      <mark key={i} className={MARK_CLASS}>
        {part}
      </mark>
    ),
  );
  return <>{parts}</>;
}

interface ConversationViewProps {
  source: ConversationSource;
  // 가린 뒤의 메시지
  messages: ConversationMessage[];
  // 이 메시지로 이동해 표시한다. 같은 메시지로 다시 가려면 nonce를 바꾼다
  focus?: { index: number; nonce: number } | null;
}

function ConversationView({ source, messages, focus }: ConversationViewProps) {
  const [pageCount, setPageCount] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<number, HTMLLIElement>());

  // 이동할 메시지가 뒤쪽에 있으면 거기까지 펼친다
  const shown = Math.min(
    messages.length,
    Math.max(pageCount * PAGE_SIZE, focus ? focus.index + 1 : 0),
  );

  useEffect(() => {
    if (!focus) return;
    const container = containerRef.current;
    const item = itemRefs.current.get(focus.index);
    if (!container || !item) return;
    container.scrollTo({
      top: item.offsetTop - container.offsetTop - 12,
      behavior: 'smooth',
    });
    item.focus({ preventScroll: true });
  }, [focus]);

  const sourceName = SOURCE_NAME[source];

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className="relative max-h-[28rem] overflow-y-auto rounded-xl bg-surface-muted p-4"
      >
        <ol aria-label="대화 내용" className="flex flex-col gap-4">
          {messages.slice(0, shown).map((message, index) => {
            const focused = focus?.index === index;
            return (
              <li
                // 메시지에는 id가 없고, 순서가 바뀌거나 중간에 빠지지 않는 읽기 전용 목록이다
                // eslint-disable-next-line react-x/no-array-index-key
                key={index}
                ref={(element) => {
                  if (element) itemRefs.current.set(index, element);
                  else itemRefs.current.delete(index);
                }}
                tabIndex={-1}
                className={cn(
                  'flex flex-col gap-1 rounded-2xl outline-none',
                  message.role === 'user' ? 'items-end' : 'items-start',
                )}
              >
                <span className="sr-only">
                  {message.role === 'user' ? '나' : sourceName}
                </span>
                {message.role === 'assistant' && (
                  <span
                    aria-hidden="true"
                    className="text-caption text-ink-muted"
                  >
                    {sourceName}
                  </span>
                )}
                <div
                  className={cn(
                    'max-w-[88%] min-w-0 rounded-2xl px-4 py-2.5 text-body leading-relaxed break-words',
                    message.role === 'user'
                      ? 'rounded-br-md bg-primary whitespace-pre-wrap text-on-primary'
                      : 'rounded-bl-md border border-line bg-surface-raised text-ink',
                    focused && 'outline-2 outline-offset-2 outline-primary',
                  )}
                >
                  {message.role === 'user' ? (
                    <PlainText text={message.text} />
                  ) : (
                    <Markdown
                      remarkPlugins={[remarkGfm, remarkMaskLabels]}
                      components={MARKDOWN_COMPONENTS}
                      skipHtml
                    >
                      {message.text}
                    </Markdown>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {shown < messages.length && (
        <button
          type="button"
          onClick={() => setPageCount(Math.ceil(shown / PAGE_SIZE) + 1)}
          className="self-center text-caption font-medium text-primary underline"
        >
          메시지 {Math.min(PAGE_SIZE, messages.length - shown)}개 더 보기 (
          {messages.length - shown}개 남음)
        </button>
      )}
    </div>
  );
}

export default ConversationView;

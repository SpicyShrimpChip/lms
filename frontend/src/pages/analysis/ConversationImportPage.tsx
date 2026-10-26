import { useMemo, useState } from 'react';
import { AsyncBoundary, SubPage } from '@/components';
import { useMe } from '@/hooks';
import {
  conversationKey,
  maskConversation,
  type ConversationToSend,
  type MaskOptions,
  type MergedImport,
} from '@/utils';
import FileStep from './components/import/FileStep';
import ImportSteps from './components/import/ImportSteps';
import MaskStep from './components/import/MaskStep';
import SelectStep, {
  type ConversationChoices,
} from './components/import/SelectStep';
import SendStep from './components/import/SendStep';

// 읽은 대화는 이 화면의 메모리에만 둔다. 새로고침하거나 화면을 나가면 사라진다 (서버·브라우저 저장소에 남기지 않음)
function ConversationImportPage() {
  const [step, setStep] = useState(0);
  const [imported, setImported] = useState<MergedImport | null>(null);
  const [choices, setChoices] = useState<ConversationChoices | null>(null);
  // 사용자가 고치기 전에는 내 정보의 이름을 가릴 이름으로 미리 넣어 둔다
  const [editedOptions, setEditedOptions] = useState<MaskOptions | null>(null);

  const { data: me } = useMe();
  const myName = me?.name;
  const maskOptions = useMemo<MaskOptions>(
    () => editedOptions ?? { names: myName ? [myName] : [], terms: [] },
    [editedOptions, myName],
  );

  // 보낼 대화 (고른 것만, 과목 포함)
  const selected = useMemo(() => {
    if (!imported || !choices) return [];
    return imported.conversations.flatMap((conversation) => {
      const choice = choices[conversationKey(conversation)];
      return choice?.selected
        ? [{ courseId: choice.courseId, conversation }]
        : [];
    });
  }, [imported, choices]);

  const toSend = useMemo<ConversationToSend[]>(
    () =>
      step === 3
        ? selected.map(({ courseId, conversation }) => ({
            courseId,
            conversation: maskConversation(conversation, maskOptions)
              .conversation,
          }))
        : [],
    [step, selected, maskOptions],
  );

  // 다음 버튼이 화면 아래에 있어서, 단계를 바꾸면 단계 표시가 보이도록 맨 위로 올린다
  const goToStep = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0 });
  };

  const restart = () => {
    setImported(null);
    setChoices(null);
    goToStep(0);
  };

  return (
    <SubPage
      title="AI 대화 가져오기"
      description="ChatGPT, Claude와 공부한 대화를 가져와 개념별로 분석해요"
    >
      <ImportSteps current={step} />

      {step === 0 && (
        <FileStep
          imported={imported}
          onLoaded={(next) => {
            setImported(next);
            // 파일을 다시 고르면 이전 선택은 버린다
            setChoices(null);
          }}
          onNext={() => goToStep(1)}
        />
      )}

      {step === 1 && imported && (
        <AsyncBoundary>
          <SelectStep
            conversations={imported.conversations}
            initialChoices={choices}
            onBack={() => goToStep(0)}
            onNext={(next) => {
              setChoices(next);
              goToStep(2);
            }}
          />
        </AsyncBoundary>
      )}

      {step === 2 && (
        <MaskStep
          conversations={selected.map(({ conversation }) => conversation)}
          options={maskOptions}
          onChangeOptions={setEditedOptions}
          onBack={() => goToStep(1)}
          onNext={() => goToStep(3)}
        />
      )}

      {step === 3 && (
        <AsyncBoundary>
          <SendStep
            items={toSend}
            onBack={() => goToStep(2)}
            onRestart={restart}
          />
        </AsyncBoundary>
      )}
    </SubPage>
  );
}

export default ConversationImportPage;

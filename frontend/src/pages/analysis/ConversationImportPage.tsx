import { Lock, Upload } from 'lucide-react';
import { AiBadge, SubPage } from '@/components';

// 가져오기 단계. 파싱·필터·마스킹은 모두 브라우저에서 하고, 마지막 단계에서 고른 대화만 보낸다
const STEPS = ['파일 고르기', '대화 고르기', '가린 내용 확인', '보내기'];

// TODO: utils/conversation/의 파서·키워드 필터·마스킹을 연결해 단계별 화면을 채운다
function ConversationImportPage() {
  return (
    <SubPage
      title="AI 대화 가져오기"
      description="ChatGPT, Claude와 공부한 대화를 가져와 개념별로 분석해요"
      breadcrumb={['학습분석', 'AI 대화 가져오기']}
    >
      <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step}
            aria-current={index === 0 ? 'step' : undefined}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-body ${
              index === 0
                ? 'border-primary bg-primary-soft font-bold text-navy-900'
                : 'border-line text-ink-muted'
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
                index === 0
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-ink-muted'
              }`}
            >
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <section
        aria-labelledby="import-file"
        className="flex flex-col gap-5 rounded-2xl border border-line p-6 md:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="import-file" className="text-xl font-bold text-navy-700">
            대화 내보내기 파일 고르기
          </h2>
          <AiBadge label="AI 분석" />
        </div>
        <label
          htmlFor="conversation-file"
          className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-line-strong px-6 py-12 text-center hover:border-primary hover:bg-primary-soft"
        >
          <Upload size={28} className="text-primary" aria-hidden="true" />
          <span className="font-medium text-navy-900">
            내보내기 파일을 여기에 놓거나 눌러서 고르세요
          </span>
          <span className="text-body text-ink-muted">
            ChatGPT, Claude 공식 내보내기 파일(.zip 또는 conversations.json)
          </span>
        </label>
        <input
          id="conversation-file"
          type="file"
          accept=".zip,.json"
          className="sr-only"
        />
        <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-4">
          <Lock
            size={20}
            className="mt-0.5 shrink-0 text-navy-700"
            aria-hidden="true"
          />
          <p className="text-body leading-relaxed text-ink-soft">
            파일은 서버로 보내지 않고 내 브라우저에서만 읽어요. 학습 관련 대화만
            골라 이메일, 전화번호 같은 개인정보를 가린 뒤, 내가 선택한 대화만
            보내요.
          </p>
        </div>
      </section>
    </SubPage>
  );
}

export default ConversationImportPage;

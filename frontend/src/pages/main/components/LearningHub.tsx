import PrivacyNotice from './PrivacyNotice';

const STEPS = [
  {
    title: '기록 모으기',
    description: '흩어진 AI 대화와 학습 자료를 과목별로 한곳에 모아요.',
  },
  {
    title: '근거와 함께 진단',
    description:
      '숙련도는 정해진 규칙으로 계산하고, 왜 그렇게 판단했는지 대화와 퀴즈 기록으로 보여 줘요.',
  },
  {
    title: '맞춤 순서로 복습',
    description:
      '보완이 필요한 개념부터 요약, 퀴즈, 커리큘럼으로 다시 공부해요.',
  },
];

function LearningHub() {
  return (
    <section>
      <div className="mx-auto flex max-w-page flex-col gap-10 px-6 pt-24 pb-22">
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-extrabold tracking-wide text-primary">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-heading">
            이렇게 공부해요
          </h2>
          <p className="text-ink-soft">
            AI 대화 기록이 적어도 괜찮아요. 자료로 시작하면 퀴즈·챗봇 기록이
            쌓이는 대로 같은 방식으로 분석해요.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl bg-section p-7"
            >
              <p
                aria-label={`${index + 1}단계`}
                className="flex size-9 items-center justify-center rounded-full bg-primary font-extrabold text-on-primary"
              >
                {index + 1}
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-heading">
                {step.title}
              </h3>
              <p className="text-body leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <PrivacyNotice />
      </div>
    </section>
  );
}

export default LearningHub;

import { Link } from 'react-router-dom';
import PrivacyNotice from './PrivacyNotice';

const STEPS = [
  {
    title: '기록 모으기',
    description: '흩어진 AI 대화와 학습 자료를 한곳에 모아요.',
  },
  {
    title: '근거와 함께 진단',
    description:
      '개념별 숙련도를 정해진 규칙으로 계산하고, 왜 그렇게 판단했는지 대화와 퀴즈 기록으로 보여 줘요.',
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
      <div className="mx-auto flex max-w-page flex-col gap-8 px-6 py-18">
        <div className="flex flex-col gap-2.5 text-center">
          <p className="text-sm font-bold text-primary">AI LEARNING HUB</p>
          <h2 className="text-3xl font-bold text-heading-soft">
            이렇게 공부해요
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-2.5 rounded-2xl bg-primary-soft p-7"
            >
              <p className="text-sm font-bold text-primary">{index + 1}단계</p>
              <h3 className="text-xl font-bold text-heading">{step.title}</h3>
              <p className="text-body leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <PrivacyNotice />

        <div className="flex justify-center">
          <Link
            to="/about"
            className="rounded-full bg-primary-pill px-8 py-3 font-medium text-heading hover:bg-primary-pill-hover"
          >
            서비스 소개 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LearningHub;

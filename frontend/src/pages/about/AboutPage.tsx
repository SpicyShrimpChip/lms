import { Link } from 'react-router-dom';
import { SubPage } from '@/components';

const PRINCIPLES = [
  {
    title: '원본 대화 파일은 서버로 보내지 않아요',
    description:
      '내 브라우저에서 학습 관련 대화만 고르고 개인정보를 가린 뒤, 내가 선택한 대화만 보내요.',
  },
  {
    title: '점수는 정해진 규칙으로 계산해요',
    description:
      '개념별 숙련도는 대화 분류 결과와 퀴즈 정답률을 정해진 규칙으로 계산해요. AI는 점수를 매기지 않고 근거를 설명해요.',
  },
  {
    title: '판단 근거를 함께 보여 드려요',
    description:
      '강점이나 보완할 점마다 어떤 대화와 퀴즈 기록을 보고 판단했는지 확인할 수 있어요.',
  },
];

function AboutPage() {
  return (
    <SubPage
      title="서비스 소개"
      description="AI와 공부한 기록에서 아는 것과 모르는 것을 찾아 드려요"
      breadcrumb={['이용안내', '서비스 소개']}
    >
      <section className="flex flex-col gap-3 rounded-2xl bg-primary-soft p-6 md:p-8">
        <h2 className="text-xl font-bold text-navy-700">왜 만들었나요</h2>
        <p className="leading-relaxed text-ink-soft">
          AI로 공부하면 대화가 여러 서비스에 흩어지고, 새 대화를 열 때마다 같은
          배경 설명을 반복하게 돼요. 공부는 많이 했는데 무엇을 알고 어디가
          부족한지는 알기 어려워요. 흩어진 학습 기록을 모아 개념별 이해 정도를
          보여 주고, 부족한 부분부터 다시 공부할 수 있게 학습 순서를 제안해요.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-navy-700">이렇게 지켜요</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-2 rounded-2xl border border-line p-6"
            >
              <h3 className="font-bold text-navy-900">{item.title}</h3>
              <p className="text-body leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/analysis/import"
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-navy-700"
        >
          대화 가져오기
        </Link>
        <Link
          to="/materials/upload"
          className="rounded-lg border border-line-strong bg-surface px-6 py-3 font-medium text-navy-700 hover:bg-surface-muted"
        >
          자료 올리기
        </Link>
      </div>
    </SubPage>
  );
}

export default AboutPage;

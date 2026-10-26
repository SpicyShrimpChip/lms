import type { ConceptMastery } from '@/types';

const CENTER = 150;
const RADIUS = 110;
const LABEL_RADIUS = 132;

// 0~100 점수를 i번째 축 위의 좌표로 바꾼다 (첫 축은 위쪽, 시계 방향)
function point(index: number, total: number, ratio: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / total;
  return {
    x: CENTER + RADIUS * ratio * Math.cos(angle),
    y: CENTER + RADIUS * ratio * Math.sin(angle),
  };
}

const toPoints = (list: { x: number; y: number }[]) =>
  list.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// 개념별 숙련도 방사형 그래프 (개념 3개 이상일 때). 점수는 코드가 계산한 값이라 파랑, 보완 필요 점은 붉은색
function RadarChart({ concepts }: { concepts: ConceptMastery[] }) {
  const total = concepts.length;
  const ring = (ratio: number) =>
    toPoints(concepts.map((_, index) => point(index, total, ratio)));
  const scores = concepts.map((concept, index) =>
    point(index, total, concept.score / 100),
  );

  return (
    <svg
      viewBox="-60 0 420 300"
      role="img"
      aria-label={`개념 ${total}개의 숙련도 방사형 그래프: ${concepts
        .map((concept) => `${concept.name} ${concept.score}점`)
        .join(', ')}`}
      className="mx-auto block w-full max-w-105"
    >
      <polygon points={ring(1)} className="fill-none stroke-line" />
      <polygon points={ring(0.5)} className="fill-none stroke-line" />
      {concepts.map((concept, index) => {
        const end = point(index, total, 1);
        return (
          <line
            key={concept.conceptId}
            x1={CENTER}
            y1={CENTER}
            x2={end.x}
            y2={end.y}
            className="stroke-line"
          />
        );
      })}
      <polygon
        points={toPoints(scores)}
        className="fill-primary/15 stroke-primary"
        strokeWidth={2.5}
      />
      {concepts.map((concept, index) => {
        const weak = concept.level === 'weakness';
        const angle = -Math.PI / 2 + (2 * Math.PI * index) / total;
        const cos = Math.cos(angle);
        const lx = CENTER + LABEL_RADIUS * cos;
        const ly = CENTER + LABEL_RADIUS * Math.sin(angle) + 4;
        return (
          <g key={concept.conceptId}>
            <circle
              cx={scores[index].x}
              cy={scores[index].y}
              r={weak ? 5 : 4}
              className={weak ? 'fill-weakness-bar' : 'fill-primary'}
            />
            <text
              x={lx}
              y={ly}
              textAnchor={
                Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end'
              }
              className={`text-[13px] font-semibold ${weak ? 'fill-weakness' : 'fill-heading'}`}
            >
              {concept.name} {concept.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default RadarChart;

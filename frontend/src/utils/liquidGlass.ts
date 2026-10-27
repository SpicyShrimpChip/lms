// 애플 Liquid Glass처럼 가장자리에서 뒤 화면이 렌즈처럼 휘어 보이게 하는 SVG 필터를 만든다.
// 원리: 빨강(가로)·초록(세로) 값으로 "픽셀을 어느 쪽으로 얼마나 밀지" 적은 지도를 만들고,
// feDisplacementMap으로 뒤 화면(backdrop-filter)을 그 지도대로 민다. 중간값(0x80)은 밀지 않는다.
// 지도를 SVG 그라데이션으로 만들고 색 번짐을 채널별로 따로 미는 방식은 @real-human/liquid-glass(MIT)를 참고했다.
//
// SVG 필터는 CPU로 그려져 넓게 걸면 스크롤이 느려진다. 그래서 유리 전체가 아니라 휘는 가장자리 조각에만 걸고
// (GlassSurface), 조각마다 크기와 상관없는 지도를 써서 크기가 바뀌어도 다시 만들지 않는다.

// left·right: 알약 양 끝 둥근 부분 / top·bottom: 그 사이 위아래 얇은 띠
export type LensEdge = 'left' | 'right' | 'top' | 'bottom';

export interface EdgeMapOptions {
  edge: LensEdge;
  // 조각 크기(px)
  width: number;
  height: number;
  // 위아래로 휘는 띠의 두께(px). 끝 조각과 띠 조각이 이어지는 곳에서 휘는 정도가 같도록 둘 다 같은 값을 쓴다
  band: number;
}

export interface LensOptions extends EdgeMapOptions {
  // 휘어지는 세기(feDisplacementMap scale)
  strength: number;
  // 빨강·초록·파랑을 조금씩 다르게 밀어 가장자리에 무지개 번짐을 만드는 정도. 0이면 없음
  chromatic: number;
}

const FULL = '#FF0000';
const NONE_X = '#800000';
const ZERO_X = '#000000';
const FULL_Y = '#00FF00';
const NONE_Y = '#008000';
const ZERO_Y = '#000000';

const percent = (n: number) => `${Math.round(n * 10000) / 100}%`;

const toDataUrl = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const gradient = (id: string, vertical: boolean, stops: [number, string][]) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">` +
  stops
    .map(
      ([at, color]) => `<stop offset="${percent(at)}" stop-color="${color}"/>`,
    )
    .join('') +
  '</linearGradient>';

// 가장자리 조각의 휘어짐 지도. 바깥 테두리에서 가장 세게 안쪽을 끌어오고, 조각 안쪽 경계에서는 밀지 않아
// 옆 조각(가운데 흐림)과 이음매 없이 이어진다
export function buildEdgeMap({ edge, width, height, band }: EdgeMapOptions) {
  const isCap = edge === 'left' || edge === 'right';

  // 가로(빨강): 왼쪽 끝은 왼쪽 테두리에서, 오른쪽 끝은 오른쪽 테두리에서 가장 세다. 띠는 가로로 밀지 않는다
  const horizontal: [number, string][] =
    edge === 'left'
      ? [
          [0, FULL],
          [1, NONE_X],
        ]
      : edge === 'right'
        ? [
            [0, NONE_X],
            [1, ZERO_X],
          ]
        : [
            [0, NONE_X],
            [1, NONE_X],
          ];

  // 세로(초록): 위 테두리에서 아래로, 아래 테두리에서 위로 끌어온다. 끝 조각은 띠와 같은 두께로 위아래를 함께 휜다
  const edgeRatio = Math.min(0.5, band / height);
  const vertical: [number, string][] = isCap
    ? [
        [0, FULL_Y],
        [edgeRatio, NONE_Y],
        [1 - edgeRatio, NONE_Y],
        [1, ZERO_Y],
      ]
    : edge === 'top'
      ? [
          [0, FULL_Y],
          [1, NONE_Y],
        ]
      : [
          [0, NONE_Y],
          [1, ZERO_Y],
        ];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
<defs>${gradient('h', false, horizontal)}${gradient('v', true, vertical)}</defs>
<rect width="${width}" height="${height}" fill="url(#h)"/>
<rect width="${width}" height="${height}" fill="url(#v)" style="mix-blend-mode:screen"/>
</svg>`;
}

// backdrop-filter에 넣을 url(...) 값. 색 번짐이 있으면 빨강·초록·파랑을 각각 다른 세기로 민 뒤 합친다
export function buildEdgeLens(options: LensOptions) {
  const { width, height, strength, chromatic } = options;
  const map = toDataUrl(buildEdgeMap(options));
  const scale = (n: number) => Math.round(n * 100) / 100;
  const displace = (s: number) =>
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${scale(s)}" xChannelSelector="R" yChannelSelector="G"`;

  const body =
    chromatic > 0
      ? `${displace(strength + chromatic * 2)}/><feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>` +
        `${displace(strength + chromatic)}/><feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/>` +
        `${displace(strength)}/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/>` +
        '<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen"/>'
      : `${displace(strength)}/>`;

  const filter = `<svg xmlns="http://www.w3.org/2000/svg">
<filter id="lens" color-interpolation-filters="sRGB">
<feImage x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none" href="${map}" result="map"/>
${body}
</filter>
</svg>`;
  return `url("${toDataUrl(filter)}#lens")`;
}

// backdrop-filter에 SVG 필터(url)를 걸 수 있는 브라우저인지. 지금은 Chromium 계열(크롬·엣지·웨일 등)만 그린다.
// 사파리·파이어폭스는 url을 읽어도 그리지 않아서 브라우저 이름으로 가린다 (iOS 크롬·엣지도 사파리 엔진이라 제외)
export function supportsGlassLens(
  userAgent: string,
  backdropSupported: boolean,
) {
  if (!backdropSupported) return false;
  return (
    /(Chrome|Chromium|Edg)\//.test(userAgent) &&
    !/(CriOS|EdgiOS|FxiOS|Firefox)\//.test(userAgent)
  );
}

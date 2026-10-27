import { describe, expect, it } from 'vitest';
import { buildEdgeLens, buildEdgeMap, supportsGlassLens } from './liquidGlass';

const CAP = { edge: 'left', width: 28, height: 56, band: 10 } as const;

describe('buildEdgeMap', () => {
  it('끝 조각은 바깥 테두리에서 가장 세고 안쪽 경계에서는 밀지 않는다', () => {
    const left = buildEdgeMap(CAP);
    expect(left).toContain('stop-color="#FF0000"');
    // 안쪽(오른쪽) 경계는 가로 중간값
    expect(left).toMatch(/offset="100%" stop-color="#800000"/);
    const right = buildEdgeMap({ ...CAP, edge: 'right' });
    expect(right).toMatch(/offset="0%" stop-color="#800000"/);
  });

  it('끝 조각은 띠 두께만큼만 위아래로 휜다', () => {
    const map = buildEdgeMap(CAP);
    // 10 / 56 = 17.86%
    expect(map).toContain('offset="17.86%" stop-color="#008000"');
    expect(map).toContain('offset="82.14%" stop-color="#008000"');
  });

  it('띠 조각은 가로로 밀지 않는다', () => {
    const top = buildEdgeMap({ ...CAP, edge: 'top', width: 4000, height: 10 });
    expect(top).not.toContain('#FF0000');
    expect(top).toMatch(/offset="0%" stop-color="#00FF00"/);
    const bottom = buildEdgeMap({
      ...CAP,
      edge: 'bottom',
      width: 4000,
      height: 10,
    });
    expect(bottom).toMatch(/offset="100%" stop-color="#000000"/);
  });
});

describe('buildEdgeLens', () => {
  const LENS = { ...CAP, strength: 40, chromatic: 2 };

  it('backdrop-filter에 넣을 url을 만든다', () => {
    const lens = buildEdgeLens(LENS);
    expect(lens.startsWith('url("data:image/svg+xml;utf8,')).toBe(true);
    expect(lens.endsWith('#lens")')).toBe(true);
  });

  it('색 번짐이 있으면 세 번, 없으면 한 번 민다', () => {
    const count = (lens: string) =>
      decodeURIComponent(lens).split('<feDisplacementMap').length - 1;
    expect(count(buildEdgeLens(LENS))).toBe(3);
    expect(count(buildEdgeLens({ ...LENS, chromatic: 0 }))).toBe(1);
  });
});

describe('supportsGlassLens', () => {
  const chrome =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
  const edge = `${chrome} Edg/141.0.0.0`;
  const safari =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';
  const iosChrome =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.0.0 Mobile/15E148 Safari/604.1';
  const firefox =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0';

  it('크롬·엣지에서만 굴절을 켠다', () => {
    expect(supportsGlassLens(chrome, true)).toBe(true);
    expect(supportsGlassLens(edge, true)).toBe(true);
    expect(supportsGlassLens(safari, true)).toBe(false);
    expect(supportsGlassLens(iosChrome, true)).toBe(false);
    expect(supportsGlassLens(firefox, true)).toBe(false);
  });

  it('backdrop-filter가 없으면 끈다', () => {
    expect(supportsGlassLens(chrome, false)).toBe(false);
  });
});

import type { ComponentType } from 'react';

// 페이지를 처음 방문할 때만 코드를 불러온다 (React Router의 route.lazy). 페이지 파일은 default export여야 한다
export const lazyPage =
  (load: () => Promise<{ default: ComponentType }>) => async () => ({
    Component: (await load()).default,
  });

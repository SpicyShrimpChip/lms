// 현재 경로가 이 메뉴 경로이거나 그 아래 경로인지
export const isActivePath = (path: string, pathname: string) =>
  pathname === path || pathname.startsWith(`${path}/`);

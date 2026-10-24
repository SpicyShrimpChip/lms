import { Link, useLocation } from 'react-router-dom';
import { MENU, type MenuGroup } from '@/constants';

// 현재 경로가 이 메뉴 묶음(대메뉴 또는 하위 메뉴)에 속하는지
const isActiveGroup = (group: MenuGroup, pathname: string) =>
  [group.path, ...group.children.map((child) => child.path)].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

function Gnb() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="주 메뉴" className="bg-brand">
      <ul className="mx-auto flex max-w-page flex-wrap justify-center gap-x-14 gap-y-1 px-6">
        {MENU.map((group) => {
          const active = isActiveGroup(group, pathname);
          return (
            // 마우스를 올리거나 키보드로 포커스가 들어오면 하위 메뉴를 연다
            // (마우스 클릭 포커스로는 열지 않아 이동 후 메뉴가 남지 않는다)
            <li key={group.label} className="group relative">
              <Link
                to={group.path}
                aria-current={active ? 'page' : undefined}
                className={`block py-4 text-base font-medium text-on-brand ${
                  active
                    ? 'border-b-3 border-primary pb-3.25'
                    : 'hover:text-on-brand-hover'
                }`}
              >
                {group.label}
              </Link>
              {/* 휴대폰 폭에서는 호버가 없어 하위 메뉴를 숨기고 대메뉴 링크로 이동한다 */}
              <ul className="invisible absolute max-md:hidden top-full left-1/2 z-10 min-w-40 -translate-x-1/2 rounded-b-lg border border-t-0 border-line bg-surface py-2 opacity-0 shadow-sm transition-opacity group-has-[:focus-visible]:visible group-has-[:focus-visible]:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none">
                {group.children.map((child) => (
                  <li key={child.path}>
                    <Link
                      to={child.path}
                      className="block px-4 py-2 text-sm whitespace-nowrap text-ink-soft hover:bg-primary-soft hover:text-heading"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Gnb;

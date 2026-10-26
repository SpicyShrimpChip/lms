import { Link, useLocation } from 'react-router-dom';
import { MENU, type MenuGroup } from '@/constants';
import { isActivePath } from './menuActive';

// 현재 경로가 이 메뉴 묶음(대메뉴 또는 하위 메뉴)에 속하는지
const isActiveGroup = (group: MenuGroup, pathname: string) =>
  [group.path, ...group.children.map((child) => child.path)].some((path) =>
    isActivePath(path, pathname),
  );

// 상단바 안의 주 메뉴. 좁은 화면에서는 햄버거 메뉴(MobileMenu)가 대신한다
function Gnb() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="주 메뉴" className="flex-1 self-stretch max-lg:hidden">
      <ul className="flex h-full gap-1">
        {MENU.map((group) => {
          const active = isActiveGroup(group, pathname);
          return (
            // 마우스를 올리거나 키보드로 포커스가 들어오면 하위 메뉴를 연다
            // (마우스 클릭 포커스로는 열지 않아 이동 후 메뉴가 남지 않는다)
            <li key={group.label} className="group relative flex">
              <Link
                to={group.path}
                aria-current={active ? 'page' : undefined}
                className={`flex h-17 items-center px-3.5 text-base ${
                  active
                    ? 'font-bold text-primary shadow-[inset_0_-3px_0_var(--color-primary)]'
                    : 'font-medium text-heading hover:text-primary'
                }`}
              >
                {group.label}
              </Link>
              <ul className="invisible absolute top-full left-0 z-10 min-w-44 rounded-xl border border-line bg-surface-raised p-1.5 opacity-0 shadow-lg transition-opacity group-has-[:focus-visible]:visible group-has-[:focus-visible]:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none">
                {group.children.map((child) => (
                  <li key={child.path}>
                    <Link
                      to={child.path}
                      className="block rounded-lg px-3 py-2 text-sm whitespace-nowrap text-ink-soft hover:bg-primary-soft hover:text-heading"
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

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU } from '@/constants';
import { isActivePath } from './menuActive';

export const MOBILE_MENU_ID = 'mobile-menu';

interface MobileMenuProps {
  onClose: () => void;
}

// 휴대폰 폭의 메뉴 패널. 상단바 아래로 펼쳐져 아래 내용을 밀어 낸다 (md 이상에서는 쓰지 않는다)
function MobileMenu({ onClose }: MobileMenuProps) {
  const { pathname } = useLocation();
  // '/analysis'와 '/analysis/import'처럼 겹치면 더 긴(구체적인) 경로 하나만 현재 위치로 표시한다
  const currentPath = MENU.flatMap((group) => group.children)
    .map((child) => child.path)
    .filter((path) => isActivePath(path, pathname))
    .sort((a, b) => b.length - a.length)[0];

  // 화면이 넓어져 데스크톱 GNB가 보이면 닫는다
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [onClose]);

  return (
    <nav
      id={MOBILE_MENU_ID}
      aria-label="전체 메뉴"
      className="bg-brand text-on-brand md:hidden"
    >
      <ul className="mx-auto flex max-w-page flex-col gap-4 px-6 py-4">
        {MENU.map((group) => (
          <li key={group.label}>
            <p className="text-base font-bold">{group.label}</p>
            <ul className="mt-1 flex flex-col">
              {group.children.map((child) => {
                const active = child.path === currentPath;
                return (
                  <li key={child.path}>
                    <Link
                      to={child.path}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={`block py-2 text-sm ${
                        active
                          ? 'font-bold underline underline-offset-4'
                          : 'text-on-brand-hover hover:text-on-brand'
                      }`}
                    >
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileMenu;

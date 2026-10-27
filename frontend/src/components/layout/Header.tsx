import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, Search, X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { logout } from '@/api';
import { MOTION_DURATION } from '@/constants';
import { useMe } from '@/hooks';
import { useAuthStore } from '@/store';
import Gnb from './Gnb';
import MobileMenu, { MOBILE_MENU_ID } from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import { FIELD_CLASS } from '../common/fieldClass';

const ACCOUNT_LINK_CLASS = 'font-medium text-ink-soft hover:text-heading';

// 로그인하면 이름·마이페이지·로그아웃, 아니면 로그인·회원가입(버튼)
function useAccountItems(): { key: string; node: ReactNode }[] {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authenticated = useAuthStore(
    (state) => state.status === 'authenticated',
  );
  const { data: me } = useMe();

  if (!authenticated) {
    return [
      {
        key: 'login',
        node: (
          <Link to="/login" className={ACCOUNT_LINK_CLASS}>
            로그인
          </Link>
        ),
      },
      {
        key: 'signup',
        node: (
          <Link
            to="/signup"
            className="rounded-lg bg-primary px-3.5 py-2 font-bold text-on-primary hover:bg-primary-hover"
          >
            회원가입
          </Link>
        ),
      },
    ];
  }

  const handleLogout = async () => {
    await logout();
    // 다음 사용자에게 내 데이터가 보이지 않도록 화면 데이터를 모두 비운다
    queryClient.clear();
    navigate('/');
  };

  return [
    ...(me
      ? [
          {
            key: 'name',
            // 이름은 최대 30자까지 가입할 수 있어서, 길면 줄여 보여 줘 상단바가 두 줄로 깨지지 않게 한다
            node: (
              <span
                title={`${me.name}님`}
                className="inline-block max-w-28 truncate align-bottom font-medium text-heading"
              >
                {me.name}님
              </span>
            ),
          },
        ]
      : []),
    // 관리자에게만 보인다. 눌러서 가는 화면도 서버가 다시 확인한다
    ...(me?.role === 'ADMIN'
      ? [
          {
            key: 'admin',
            node: (
              <Link to="/admin/notices" className={ACCOUNT_LINK_CLASS}>
                관리자
              </Link>
            ),
          },
        ]
      : []),
    {
      key: 'mypage',
      node: (
        <Link to="/mypage" className={ACCOUNT_LINK_CLASS}>
          마이페이지
        </Link>
      ),
    },
    {
      key: 'logout',
      node: (
        <button
          type="button"
          onClick={handleLogout}
          className={ACCOUNT_LINK_CLASS}
        >
          로그아웃
        </button>
      ),
    },
  ];
}

function Header() {
  const navigate = useNavigate();
  const accountItems = useAccountItems();
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Esc로 닫고 포커스를 햄버거 버튼으로 돌려준다
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    // 로고·주 메뉴·검색·계정을 한 줄에 둔다. 좁은 화면에서는 주 메뉴 대신 햄버거 메뉴(MobileMenu)
    <header className="border-b border-line bg-surface-raised print:hidden">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 max-lg:py-3.5">
        <div className="flex items-center justify-between max-lg:w-full">
          <Link to="/" className="flex items-center gap-2.5 text-heading">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-on-primary">
              AI
            </span>
            {/* TODO(미결): 서비스 이름 확정 후 교체 */}
            <span className="text-xl font-bold">ai-lms</span>
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-md border border-input-border text-heading lg:hidden"
          >
            {/* 아이콘이 바뀔 때 살짝 돌며 나타난다 */}
            <m.span
              key={menuOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: MOTION_DURATION.fast }}
              className="flex"
            >
              {menuOpen ? (
                <X size={18} aria-hidden="true" />
              ) : (
                <Menu size={18} aria-hidden="true" />
              )}
            </m.span>
          </button>
        </div>

        <Gnb />

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <form
            role="search"
            onSubmit={handleSearch}
            className={`flex h-9 items-center gap-1.5 px-2.5 ${FIELD_CLASS}`}
          >
            <label htmlFor="global-search" className="sr-only">
              검색
            </label>
            <input
              id="global-search"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="자료, 개념 검색"
              className="w-28 bg-transparent text-sm outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              aria-label="검색하기"
              className="text-ink-muted hover:text-heading"
            >
              <Search size={16} aria-hidden="true" />
            </button>
          </form>

          <nav aria-label="계정" className="flex items-center gap-3">
            {accountItems.map((item) => (
              <span key={item.key}>{item.node}</span>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {menuOpen && <MobileMenu onClose={closeMenu} />}
      </AnimatePresence>
    </header>
  );
}

export default Header;

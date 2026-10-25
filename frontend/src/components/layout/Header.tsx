import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Menu, Search, X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { ME_QUERY_KEY, getMe, logout } from '@/api';
import { MOTION_DURATION } from '@/constants';
import { useAuthStore } from '@/store';
import MobileMenu, { MOBILE_MENU_ID } from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import { FIELD_CLASS } from '../common/fieldClass';

const ACCOUNT_LINKS = [
  { label: '로그인', path: '/login' },
  { label: '회원가입', path: '/signup' },
  { label: '마이페이지', path: '/mypage' },
];

const ACCOUNT_LINK_CLASS = 'text-ink-muted hover:text-heading';

// 로그인하면 이름·마이페이지·로그아웃, 아니면 로그인·회원가입·마이페이지
function useAccountItems(): { key: string; node: ReactNode }[] {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authenticated = useAuthStore(
    (state) => state.status === 'authenticated',
  );
  const { data: me } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    enabled: authenticated,
  });

  if (!authenticated) {
    return ACCOUNT_LINKS.map((link) => ({
      key: link.path,
      node: (
        <Link to={link.path} className={ACCOUNT_LINK_CLASS}>
          {link.label}
        </Link>
      ),
    }));
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
            node: <span className="font-medium text-heading">{me.name}님</span>,
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
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <div className="flex items-center justify-between max-md:w-full">
          <Link to="/" className="flex items-center gap-2.5 text-heading">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-on-brand">
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
            className="flex size-9 items-center justify-center rounded-md border border-input-border text-heading md:hidden"
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

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <nav aria-label="계정" className="flex items-center gap-3">
            {accountItems.map((item, index) => (
              <span key={item.key} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden="true" className="text-line-strong">
                    |
                  </span>
                )}
                {item.node}
              </span>
            ))}
          </nav>

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
              className="w-40 bg-transparent text-sm outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              aria-label="검색하기"
              className="text-ink-muted hover:text-heading"
            >
              <Search size={16} aria-hidden="true" />
            </button>
          </form>

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

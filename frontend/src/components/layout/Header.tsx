import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const ACCOUNT_LINKS = [
  { label: '로그인', path: '/login' },
  { label: '회원가입', path: '/signup' },
  { label: '마이페이지', path: '/mypage' },
];

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 text-heading">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-on-brand">
            AI
          </span>
          {/* TODO(미결): 서비스 이름 확정 후 교체 */}
          <span className="text-xl font-bold">ai-lms</span>
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <nav aria-label="계정" className="flex items-center gap-3">
            {ACCOUNT_LINKS.map((link, index) => (
              <span key={link.path} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden="true" className="text-line-strong">
                    |
                  </span>
                )}
                <Link
                  to={link.path}
                  className="text-ink-muted hover:text-heading"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          <form
            role="search"
            onSubmit={handleSearch}
            className="flex h-9 items-center gap-1.5 rounded-md border border-input-border px-2.5 focus-within:border-primary"
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
    </header>
  );
}

export default Header;

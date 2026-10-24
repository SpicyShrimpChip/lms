import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-footer">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 px-6 py-8 text-sm text-navy-900">
        <div className="flex flex-col gap-1.5">
          <span className="font-bold">ai-lms</span>
          {/* TODO(미결): 팀 이름 확정 후 교체 */}
          <span>© 2026 [팀 이름]</span>
        </div>
        <nav aria-label="하단 메뉴" className="flex gap-5">
          <Link to="/about" className="hover:underline">
            서비스 소개
          </Link>
          <Link to="/privacy" className="font-bold hover:underline">
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'lg';

interface BaseProps {
  // primary: 주 버튼, secondary: 테두리 보조 버튼
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

// to가 있으면 페이지 이동 링크, href가 있으면 다른 사이트를 새 탭으로 여는 링크, 없으면 일반 버튼으로 그린다
type ButtonProps = BaseProps &
  (
    | { to: string; href?: undefined }
    | { href: string; to?: undefined }
    | ({ to?: undefined; href?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'className' | 'children'
      >)
  );

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'rounded-lg bg-primary text-on-primary hover:bg-primary-hover',
  secondary:
    'rounded-lg border border-line-strong bg-surface-raised text-heading-soft hover:bg-surface-muted',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5',
  lg: 'px-8 py-3',
};

// AI 기능을 실행하는 버튼도 색은 항상 primary 계열 (frontend/CLAUDE.md 색 규칙)
function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-medium disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  );

  if (rest.to !== undefined) {
    return (
      <Link to={rest.to} className={classes}>
        {children}
      </Link>
    );
  }

  if (rest.href !== undefined) {
    // 새 탭이 이 페이지에 손대지 못하게, 어디서 왔는지도 넘기지 않는다
    return (
      <a
        href={rest.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = rest;
  return (
    <button type={type} {...buttonProps} className={classes}>
      {children}
    </button>
  );
}

export default Button;

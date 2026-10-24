import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'pill';
type ButtonSize = 'md' | 'lg';

interface BaseProps {
  // primary: 주 버튼, secondary: 테두리 보조 버튼, pill: 알약형 보조 버튼
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

// to가 있으면 페이지 이동 링크, 없으면 일반 버튼으로 그린다
type ButtonProps = BaseProps &
  (
    | { to: string }
    | ({ to?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'className' | 'children'
      >)
  );

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'rounded-lg bg-primary text-on-primary hover:bg-primary-hover',
  secondary:
    'rounded-lg border border-line-strong bg-surface-raised text-heading-soft hover:bg-surface-muted',
  pill: 'rounded-full bg-primary-pill text-heading hover:bg-primary-pill-hover',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5',
  lg: 'px-8 py-3',
};

// AI 기능을 실행하는 버튼도 색은 항상 primary 계열 (frontend/CLAUDE.md 색 규칙)
function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-medium disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`;

  if (rest.to !== undefined) {
    return (
      <Link to={rest.to} className={classes}>
        {children}
      </Link>
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

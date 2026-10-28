import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import LoadingFallback from './LoadingFallback';
import ErrorFallback from './ErrorFallback';

interface AsyncBoundaryProps {
  children: ReactNode;
}

export default function AsyncBoundary({ children }: AsyncBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

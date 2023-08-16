import React from 'react';

import { clsx } from 'clsx';
import { Outlet, useNavigation } from 'react-router-dom';

import { Logo } from '@/components/vectors';

export function Root(): JSX.Element {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  if (isLoading)
    return (
      <div className="h-full w-full bg-grey-lighter">
        <div
          className={clsx(
            'fixed top-1/3 md:top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'flex flex-col items-center gap-4',
          )}
        >
          <div role="img" aria-label="toquiz 로고">
            <Logo className="h-24 w-24 animate-bounce" />
          </div>
          <div className="flex items-center gap-3">
            <div className="animate-pulse rounded-full bg-primary h-3 w-3" />
            <div className="animate-pulse rounded-full bg-primary h-3 w-3" />
            <div className="animate-pulse rounded-full bg-primary h-3 w-3" />
          </div>
        </div>
      </div>
    );

  return (
    <main className="h-full w-full">
      <Outlet />
    </main>
  );
}

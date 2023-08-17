import React from 'react';

import { clsx } from 'clsx';
import { Outlet, useNavigation } from 'react-router-dom';

import { Logo } from '@/components/vectors';

export function Root(): JSX.Element {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <main className="h-full w-full">
      <Outlet />
      {isLoading && (
        <>
          {/* 가장 최상위 레이어로 보여야하므로 z-index 가장 높게 준다 */}
          <div className="z-50 fixed inset-0 bg-grey-lighter opacity-60" />
          <div
            className={clsx(
              'z-50 fixed top-1/3 md:top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2',
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
        </>
      )}
    </main>
  );
}

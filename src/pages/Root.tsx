import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { clsx } from 'clsx';
import {
  Outlet,
  useNavigation,
  isRouteErrorResponse,
  useRouteError,
  Link,
} from 'react-router-dom';

import { Logo } from '@/components/vectors';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { tryRefreshToken } from '@/lib/routeGuard';

export const rootLoader: LoaderFunction = async () => {
  try {
    await tryRefreshToken();
  } catch (_) {}

  return null;
};

export function Root(): JSX.Element {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
      <OverlayProvider>
        <Outlet />
      </OverlayProvider>
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
    </>
  );
}

export const RootErrorBoundary = (): JSX.Element => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <main className="h-full overflow-auto bg-gradient-to-r from-gray-50 to-slate-100">
          <header className="border-b border-grey-light">
            <div className="container flex justify-between items-center max-w-7xl px-5 h-16">
              <Link to="/" className="rounded-md font-bold">
                toquiz
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={clsx(
                    'py-2 px-4 rounded-md font-medium',
                    'hover:bg-grey-lighter focus:border-primary-hover ',
                  )}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className={clsx(
                    'py-2 px-4 rounded-md border border-primary font-medium',
                    'hover:border-primary-hover hover:opacity-70 focus:border-primary-hover',
                  )}
                >
                  회원가입
                </Link>
              </div>
            </div>
          </header>
          <div className="h-36" />
          <div
            className={clsx(
              'container flex flex-col flex-1 items-center gap-4 max-w-xl px-8',
              'xs:flex-row xs:justify-center',
              'md:gap-7',
            )}
          >
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold md:text-3xl">404 Not Found</h1>
              <div className="text-grey-dark">
                <p>요청하신 페이지를 찾을 수 없습니다</p>
                <Link
                  to="/"
                  className="underline font-semibold hover:text-primary"
                >
                  시작 페이지
                </Link>
                로 돌아가세요
              </div>
            </div>
            <Link to="/" className="underline font-semibold">
              <div role="img" aria-label="toquiz 로고">
                <Logo className="h-20 w-20 md:h-40 md:w-40" />
              </div>
            </Link>
          </div>
        </main>
      );
    }
  }

  return (
    <main className="h-full overflow-auto bg-gradient-to-r from-gray-50 to-slate-100">
      <header className="border-b border-grey-light">
        <div className="container flex justify-between items-center max-w-7xl px-5 h-16">
          <Link to="/" className="rounded-md font-bold">
            toquiz
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={clsx(
                'py-2 px-4 rounded-md font-medium',
                'hover:bg-grey-lighter focus:border-primary-hover ',
              )}
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className={clsx(
                'py-2 px-4 rounded-md border border-primary font-medium',
                'hover:border-primary-hover hover:opacity-70 focus:border-primary-hover',
              )}
            >
              회원가입
            </Link>
          </div>
        </div>
      </header>
      <div className="h-36" />
      <div
        className={clsx(
          'container flex flex-col flex-1 items-center gap-4 max-w-xl px-8',
          'xs:flex-row xs:justify-center',
          'md:gap-7',
        )}
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-bold md:text-3xl">
            이런! 알 수 없는 오류가 발생했습니다
          </h1>
          <div className="text-grey-dark">
            새로고침하거나{' '}
            <Link to="/" className="underline font-semibold hover:text-primary">
              시작 페이지
            </Link>
            로 돌아가세요
          </div>
        </div>
        <Link to="/" className="underline font-semibold">
          <div role="img" aria-label="toquiz 로고">
            <Logo className="h-20 w-20 md:h-40 md:w-40" />
          </div>
        </Link>
      </div>
    </main>
  );
};

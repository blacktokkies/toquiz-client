import React from 'react';

import { clsx } from 'clsx';
import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';

import { Logo } from '@/components/vectors';

export const Error = (): JSX.Element => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="h-full w-full bg-gradient-to-r from-gray-50 to-slate-100">
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
          <div className="w-full h-36" />
          <div
            className={clsx(
              'flex flex-col items-center gap-4 mx-auto px-8 max-w-xl',
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
        </div>
      );
    }
  }

  return (
    <div className="h-full w-full bg-gradient-to-r from-gray-50 to-slate-100">
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
      <div className="w-full h-36" />
      <div
        className={clsx(
          'flex flex-col items-center gap-4 mx-auto px-8 max-w-xl',
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
    </div>
  );
};

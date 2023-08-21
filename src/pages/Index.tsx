import React from 'react';

import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/vectors';

export const Index = (): JSX.Element => (
  <main className="flex flex-col h-full overflow-auto bg-off-white">
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
    <div
      className={clsx(
        'flex-1 container flex flex-col items-center gap-6 px-5 pt-36 pb-12 max-w-xl',
        'sm:justify-center sm:py-10',
      )}
    >
      <div role="img" aria-label="toquiz 로고">
        <Logo className="h-28 w-h-28 sm:h-40 sm:w-40" />
      </div>
      <div className="flex flex-col justify-start gap-3">
        <div>
          <p className="text-5xl font-bold sm:text-7xl">익명으로 질문을</p>
          <p className="text-5xl font-bold sm:text-7xl">받아보세요</p>
        </div>
        <p className="text-grey-dark sm:text-lg">
          강의나 세미나를 진행할 때, 혹은 친구 사이에 부담없이 익명으로 질문을
          올리고 답변을 주고받아요
        </p>
      </div>
      <Link
        to="/home"
        className={clsx(
          'w-full py-3 rounded-md bg-primary text-center font-bold border border-grey-lighter',
          'hover:bg-primary-hover focus:bg-primary-hover focus:border focus:border-black',
        )}
      >
        이용하기
      </Link>
      토퀴즈는 현재 개발 중인 서비스입니다
    </div>
  </main>
);

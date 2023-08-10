import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { redirect, Link } from 'react-router-dom';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';
import { InfinitePanelGrid } from '@/components/home/InfinitePanelGrid';
import { OpenActionMenuArea } from '@/components/system/OpenActionMenuArea';
import { Logo, Account } from '@/components/vectors';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { isUserLoggedIn } from '@/lib/routeGuard';

// https://reactrouter.com/en/main/fetch/redirect
export const homeLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};

export const Home = (): JSX.Element => {
  const user = useUserStore(({ email, nickname, createdAt }) => ({
    email,
    nickname,
    createdAt,
  }));

  return (
    <div className="flex w-full h-full flex-col">
      <header className="bg-white shadow-md">
        <div className="container flex justify-between items-center max-w-7xl px-5 h-16">
          <Link
            to="/home"
            className="hover:bg-grey-light rounded-full hover:shadow-lg"
          >
            <div role="img" aria-label="toquiz 로고">
              <Logo className="h-11 w-11" />
            </div>
          </Link>
          <OpenActionMenuArea
            ariaLabel="내 계정 액션 메뉴"
            open={({ close }) => <AccountActionMenu close={close} />}
          >
            <button
              type="button"
              className="hover:bg-grey-light rounded-full p-2"
              aria-label="내 계정 아이콘"
            >
              <div role="img" aria-label="내 계정 아이콘">
                <Account className="fill-grey-darkest" />
              </div>
            </button>
          </OpenActionMenuArea>
        </div>
      </header>
      <div className="flex-1">
        <div className="container flex h-full max-w-7xl flex-col">
          <div className="flex flex-col items-start gap-5 px-5 py-7">
            <h1 className="font text-2xl font-medium tracking-tighter md:text-5xl">
              내 패널 모아보기
            </h1>
            <span className="flex gap-1 items-center py-1">
              <div role="img" aria-label="내 계정 아이콘">
                <Account className="w-5 h-5" />
              </div>
              <span className="text-sm">{user.nickname}</span>
            </span>
          </div>
          <div className="flex flex-1 flex-col">
            <div
              role="tablist"
              className="flex justify-start items-center px-5 py-2 gap-3 border-b border-grey-light"
            >
              <div
                role="tab"
                className="font-medium rounded-md bg-grey-lighter p-1"
              >
                내가 만든 패널
              </div>
            </div>
            <div role="tabpanel" className="flex flex-1 flex-col">
              <div className="flex justify-between px-5 py-2 mt-2">
                <span>최신순</span>
                <span>총 3개</span>
              </div>
              <InfinitePanelGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

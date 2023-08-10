import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { redirect } from 'react-router-dom';

import { InfinitePanelGrid } from '@/components/home/InfinitePanelGrid';
import { Account } from '@/components/vectors';
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

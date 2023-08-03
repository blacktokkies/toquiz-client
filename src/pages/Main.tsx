import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { redirect } from 'react-router-dom';

import HomeHeader from '@/components/home/HomeHeader';
import InfinitePanelGrid from '@/components/home/InfinitePanelGrid';
import { useUserStore } from '@/hooks/store/useUserStore';
import { isUserLoggedIn } from '@/lib/routeGuard';

// https://reactrouter.com/en/main/fetch/redirect
export const mainLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};

const Main = (): JSX.Element => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex h-full w-full flex-col">
      <HomeHeader />
      <main className="flex-1">
        <div className="container flex h-full max-w-7xl flex-col">
          <div className="flex flex-col gap-2 px-3 py-6">
            <div className="text-off-white">
              <span className="bg-primary text-off-white rounded-2xl py-1 px-3 text-base font-medium">
                @{user?.nickname}
              </span>
            </div>
            <h1 className="font text-primary-dark text-4xl font-medium tracking-tight md:text-5xl">
              내 패널 모아보기
            </h1>
          </div>
          <div className="flex flex-1 flex-col pt-9">
            <div className="flex justify-between p-3">
              <span className="text-grey-dark text-sm font-bold">최신순</span>
              <span className="text-grey-dark text-sm">내 패널</span>
            </div>
            <div className="bg-off-white flex-1 px-3 pt-4 pb-16">
              <InfinitePanelGrid />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;

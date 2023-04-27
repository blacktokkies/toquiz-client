import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { redirect } from 'react-router-dom';

import HomeHeader from '@/components/home/HomeHeader';
import PanelList from '@/components/panel/PanelList';
import { useMyPanelsQuery } from '@/hooks/panel';
import { useUserStore } from '@/hooks/store/useUserStore';
import { isUserLoggedIn } from '@/lib/routeGuard';

// https://reactrouter.com/en/main/fetch/redirect
export const mainLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};

const Main = (): JSX.Element => {
  const panelsQuery = useMyPanelsQuery();
  const user = useUserStore((state) => state.user);

  if (panelsQuery.isLoading) return <div>loading...</div>;
  if (panelsQuery.isError) return <div>error occurred</div>;

  const { panels } = panelsQuery.data;

  return (
    <>
      <HomeHeader />
      <main>
        <div className="mx-auto max-w-7xl">
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
          <PanelList panels={panels} />
        </div>
      </main>
    </>
  );
};

export default Main;

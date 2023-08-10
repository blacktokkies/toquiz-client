import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { redirect } from 'react-router-dom';

import { isUserLoggedIn } from '@/lib/routeGuard';

export const accountLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};
export function Account(): JSX.Element {
  return (
    <div className="flex w-full h-full flex-col">
      <div className="container flex h-full max-w-7xl flex-col">
        <div className="px-5 py-7">
          <h1 className="font text-2xl font-medium tracking-tighter md:text-5xl">
            내 계정 관리
          </h1>
        </div>
        <div className="flex flex-1 flex-col" />
      </div>
    </div>
  );
}

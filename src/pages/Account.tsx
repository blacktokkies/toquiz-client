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
    <div className="flex-1 container flex flex-col gap-11 max-w-5xl px-5 pt-7 pb-16">
      <h1 className="font text-2xl font-medium tracking-tighter md:text-5xl">
        내 계정 관리
      </h1>
      <div className="flex flex-1 flex-col">
        <section>
          <h2>프로필 수정</h2>
        </section>
      </div>
    </div>
  );
}

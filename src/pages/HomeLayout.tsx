import React from 'react';

import { Outlet } from 'react-router-dom';

import { HomeHeader } from '@/components/home/HomeHeader';

export function Component(): JSX.Element {
  return (
    <main className="flex flex-col h-full overflow-auto">
      <HomeHeader />
      <Outlet />
    </main>
  );
}

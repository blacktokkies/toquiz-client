import React from 'react';

import { Outlet } from 'react-router-dom';

export function Root(): JSX.Element {
  return (
    <main className="h-full w-full">
      <Outlet />
    </main>
  );
}

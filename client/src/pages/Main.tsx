import type { User } from '@/store/userStore';
import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { redirect } from 'react-router-dom';

import { useUserStore } from '@/hooks/store/useUserStore';
import { isUserLoggedIn } from '@/lib/routeGuard';

// https://reactrouter.com/en/main/fetch/redirect
export const mainLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};

const Main = (): JSX.Element => {
  const user = useUserStore((state) => state.user) as User;
  return <div>{JSON.stringify(user)}</div>;
};

export default Main;

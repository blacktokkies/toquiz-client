import React from 'react';

import { Outlet, createBrowserRouter } from 'react-router-dom';

import { HomeHeader } from '@/components/home/HomeHeader';
import { Account, accountLoader } from '@/pages/Account';
import { Home, homeLoader } from '@/pages/Home';
import { Index } from '@/pages/Index';
import { Login, loginLoader } from '@/pages/Login';
import { Panel, panelLoader, PanelError } from '@/pages/Panel';
import { Root, RootErrorBoundary } from '@/pages/Root';
import { SignUp, signupLoader } from '@/pages/SignUp';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'signup',
        element: <SignUp />,
        loader: signupLoader,
      },
      {
        path: 'login',
        element: <Login />,
        loader: loginLoader,
      },
      {
        element: (
          <main className="flex flex-col h-full overflow-auto">
            <HomeHeader />
            <Outlet />
          </main>
        ),
        children: [
          {
            path: 'home',
            element: <Home />,
            loader: homeLoader,
          },
          { path: 'account', element: <Account />, loader: accountLoader },
        ],
      },
      {
        path: 'panel/:id',
        element: <Panel />,
        loader: panelLoader,
        errorElement: <PanelError />,
      },
    ],
  },
]);

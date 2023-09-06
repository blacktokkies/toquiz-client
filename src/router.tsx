import type { Client as SocketClient } from '@stomp/stompjs';
import type { QueryClient } from '@tanstack/react-query';

import React from 'react';

import { Outlet, createBrowserRouter } from 'react-router-dom';

import { HomeHeader } from '@/components/home/HomeHeader';
import { SocketClientProvider } from '@/contexts/SocketClientContext';
import { Account, accountLoader } from '@/pages/Account';
import { Home, homeLoader } from '@/pages/Home';
import { Index } from '@/pages/Index';
import { Login, loginLoader } from '@/pages/Login';
import { Panel, panelLoader, PanelErrorBoundary } from '@/pages/Panel';
import { Root, RootErrorBoundary, rootLoader } from '@/pages/Root';
import { SignUp, signupLoader } from '@/pages/SignUp';

export const createRouterWithQueryClient = (
  queryClient: QueryClient,
  socketClient: SocketClient,
): ReturnType<typeof createBrowserRouter> =>
  createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <RootErrorBoundary />,
      loader: rootLoader,
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
          id: 'panel',
          element: (
            <SocketClientProvider client={socketClient}>
              <Panel />
            </SocketClientProvider>
          ),
          loader: panelLoader(queryClient),
          errorElement: <PanelErrorBoundary />,
        },
      ],
    },
  ]);

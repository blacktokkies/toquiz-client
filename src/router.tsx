import type { QueryClient } from '@tanstack/react-query';

import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import { Index } from '@/pages/Index';
import { Root, RootErrorBoundary, rootLoader } from '@/pages/Root';

export const createRouterWithQueryClient = (
  queryClient: QueryClient,
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
          lazy: async () => import('@/pages/SignUp'),
        },
        {
          path: 'login',
          lazy: async () => import('@/pages/Login'),
        },
        {
          lazy: async () => import('@/pages/HomeLayout'),
          children: [
            {
              path: 'home',
              lazy: async () => import('@/pages/Home'),
            },
            {
              path: 'account',
              lazy: async () => import('@/pages/Account'),
            },
          ],
        },
        {
          path: 'panel/:id',
          id: 'panel',
          lazy: async () => {
            const { loader, ...rest } = await import('@/pages/Panel');
            return { ...rest, loader: loader(queryClient) };
          },
        },
      ],
    },
  ]);

import React from 'react';

import { Outlet, createBrowserRouter } from 'react-router-dom';

import { Error } from '@/pages/Error';
import { Home, homeLoader } from '@/pages/Home';
import { Index } from '@/pages/Index';
import { Login, loginLoader } from '@/pages/Login';
import { Root } from '@/pages/Root';
import { SignUp, signupLoader } from '@/pages/SignUp';

import { HomeHeader } from './components/home/HomeHeader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
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
          <>
            <HomeHeader />
            <Outlet />
          </>
        ),
        children: [
          {
            path: 'home',
            element: <Home />,
            loader: homeLoader,
          },
          { path: 'account', element: <div>내 계정 관리</div> },
        ],
      },
    ],
  },
]);

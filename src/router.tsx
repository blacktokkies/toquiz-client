import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import Error from '@/pages/Error';
import Home, { homeLoader } from '@/pages/Home';
import Index from '@/pages/Index';
import Login, { loginLoader } from '@/pages/Login';
import Root from '@/pages/Root';
import SignUp, { signupLoader } from '@/pages/SignUp';

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
        path: 'home',
        element: <Home />,
        loader: homeLoader,
      },
    ],
  },
]);

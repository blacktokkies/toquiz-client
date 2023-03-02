import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import Error from '@/pages/Error';
import Index from '@/pages/Index';
import Login, { loginLoader } from '@/pages/Login';
import Main, { mainLoader } from '@/pages/Main';
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
        path: 'main',
        element: <Main />,
        loader: mainLoader,
      },
    ],
  },
]);

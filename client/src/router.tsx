import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import Error from '@/pages/Error';
import Login, { loginLoader } from '@/pages/Login';
import Main, { mainLoader } from '@/pages/Main';
import Root from '@/pages/Root';
import SignUp from '@/pages/SignUp';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: 'signup',
        element: <SignUp />,
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

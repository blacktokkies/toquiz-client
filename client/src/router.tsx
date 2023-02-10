import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import Error from '@/pages/Error';
import Home from '@/pages/Home';
import SignUp from '@/pages/SignUp';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <div>login</div>,
  },
]);
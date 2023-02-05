import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import Error from '@/pages/Error';
import Home from '@/pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
  },
]);

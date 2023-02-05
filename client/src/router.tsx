import React from 'react';
import Home from '@pages/Home';
import Error from '@pages/Error';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
  },
]);

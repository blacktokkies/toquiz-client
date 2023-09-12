import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import Socket from 'sockjs-client';

import { SocketClient } from '@/lib/socketClient';
import { createRouterWithQueryClient } from '@/router';

import { SocketClientProvider } from './contexts/SocketClientContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const socketClient = new SocketClient({
  webSocketFactory: () => new Socket('/ws'),
  debug: (msg) => {
    if (import.meta.env.DEV) console.log(msg);
  },
  onWebSocketClose: () => {
    // activate 실패로 connection이 close된 경우,
    // reconnect 시도하지 않도록 deactivate한다.
    socketClient.deactivate();
  },
});

const router = createRouterWithQueryClient(queryClient);

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketClientProvider client={socketClient}>
        <RouterProvider router={router} />
      </SocketClientProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

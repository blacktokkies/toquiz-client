import React from 'react';

import { Client as SocketClient } from '@stomp/stompjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import Socket from 'sockjs-client';

import { createRouterWithQueryClient } from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const socketClient = new SocketClient({
  webSocketFactory: () => new Socket('/wss'),
  debug: (msg) => {
    console.log(msg);
  },
  onWebSocketClose: () => {
    // activate 실패로 connection이 close된 경우,
    // reconnect 시도하지 않도록 deactivate한다.
    socketClient.deactivate();
  },
});

const router = createRouterWithQueryClient(queryClient, socketClient);

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

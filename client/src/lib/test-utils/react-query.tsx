/* eslint-disable react/display-name */
import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// tanstack.com/query/v4/docs/react/guides/testing#turn-off-retries
// tanstack.com/query/v4/docs/react/guides/testing#turn-off-network-error-logging
const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });

type QueryClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => JSX.Element;

export function createQueryClientWrapper(): QueryClientWrapper {
  const queryClient = createQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

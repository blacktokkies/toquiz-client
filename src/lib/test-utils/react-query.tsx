/* eslint-disable react/display-name */
import type { RenderResult } from '@testing-library/react';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

// tanstack.com/query/v4/docs/react/guides/testing#turn-off-retries
// tanstack.com/query/v4/docs/react/guides/testing#turn-off-network-error-logging
export const createQueryClient = (): QueryClient =>
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

export function renderWithQueryClient(ui: React.ReactElement): RenderResult {
  const queryClient = createQueryClient();
  const { rerender, ...renderResult } = render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
  return {
    ...renderResult,
    rerender: (rerenderUi: React.ReactElement) => {
      rerender(
        <QueryClientProvider client={queryClient}>
          {rerenderUi}
        </QueryClientProvider>,
      );
    },
  };
}

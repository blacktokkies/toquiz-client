import { QueryClient } from '@tanstack/react-query';

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


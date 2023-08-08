import type { ApiError } from '@/lib/apiClient';
import type {
  GetMyPanelsParams,
  GetMyPanelsResult,
} from '@/mocks/handlers/panel';
import type { UseInfiniteQueryResult } from '@tanstack/react-query';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getMyPanels } from '@/lib/api/panel';
import { queryKey } from '@/lib/queryKey';

export const useMyPanelsInfiniteQuery = (): UseInfiniteQueryResult<
  GetMyPanelsResult,
  ApiError | SyntaxError
> => {
  const key = queryKey.panel.lists();
  const query = useInfiniteQuery<GetMyPanelsResult, ApiError | SyntaxError>(
    key,
    async ({ pageParam = '' }) =>
      getMyPanels({ cursor: pageParam as GetMyPanelsParams['cursor'] }),
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    },
  );

  return query;
};

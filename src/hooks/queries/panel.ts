import type { CreatePanelBody, CreatePanelResult } from '@/lib/api/panel';
import type { ApiError } from '@/lib/apiClient';
import type {
  GetMyPanelsParams,
  GetMyPanelsResult,
} from '@/mocks/handlers/panel';
import type {
  UseInfiniteQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { createPanel, getMyPanels } from '@/lib/api/panel';
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

export const useCreatePanelMutation = (): UseMutationResult<
  CreatePanelResult,
  ApiError | SyntaxError,
  CreatePanelBody
> => {
  const key = queryKey.panel.create();
  const mutation = useMutation<
    CreatePanelResult,
    ApiError | SyntaxError,
    CreatePanelBody
  >(key, createPanel);
  return mutation;
};

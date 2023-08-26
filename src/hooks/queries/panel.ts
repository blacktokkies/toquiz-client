import type {
  CreatePanelBody,
  CreatePanelResult,
  DeletePanelResponse,
  UpdatePanelBody,
  UpdatePanelResult,
  GetMyPanelsParams,
  Panel,
  MyPanelPage,
} from '@/lib/api/panel';
import type { ApiError } from '@/lib/apiClient';
import type {
  UseInfiniteQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import {
  createPanel,
  getMyPanels,
  updatePanel,
  deletePanel,
} from '@/lib/api/panel';
import { queryKey } from '@/lib/queryKey';

export const useMyPanelsInfiniteQuery = (): UseInfiniteQueryResult<
  MyPanelPage,
  ApiError | SyntaxError
> => {
  const key = queryKey.panel.lists();
  const query = useInfiniteQuery<MyPanelPage, ApiError | SyntaxError>(
    key,
    async ({ pageParam = 0 }) =>
      getMyPanels({ page: pageParam as GetMyPanelsParams['page'] }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.nextPage !== -1 ? lastPage.nextPage : undefined,
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

export const useUpdatePanelMutation = (
  panelId: Panel['sid'],
): UseMutationResult<
  UpdatePanelResult,
  ApiError | SyntaxError,
  UpdatePanelBody
> => {
  const key = queryKey.panel.update();
  const mutation = useMutation<
    UpdatePanelResult,
    ApiError | SyntaxError,
    UpdatePanelBody
  >(key, async (body) => updatePanel(panelId, body));

  return mutation;
};

export const useDeletePanelMutation = (): UseMutationResult<
  DeletePanelResponse,
  ApiError | SyntaxError,
  Panel['sid']
> => {
  const key = queryKey.panel.delete();
  const mutation = useMutation<
    DeletePanelResponse,
    ApiError | SyntaxError,
    Panel['sid']
  >(key, deletePanel);

  return mutation;
};

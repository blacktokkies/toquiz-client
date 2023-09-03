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
import type { NonNullableKeys } from '@/lib/types';
import type {
  MutationOptions,
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

/* ================================ [ 패널 수정 뮤테이션 ] ====================================== */
export type UpdatePanelMutation = NonNullableKeys<
  Pick<
    MutationOptions<UpdatePanelResult, ApiError | SyntaxError, UpdatePanelBody>,
    'mutationKey' | 'mutationFn'
  >
>;

export const updatePanelMutation = (
  panelId: Panel['sid'],
): UpdatePanelMutation => ({
  mutationKey: queryKey.panel.update(),
  mutationFn: async (body) => updatePanel(panelId, body),
});
export const useUpdatePanelMutation = <TContext = unknown>(
  panelId: Panel['sid'],
  options: MutationOptions<
    UpdatePanelResult,
    ApiError | SyntaxError,
    UpdatePanelBody,
    TContext
  > = {},
): UseMutationResult<
  UpdatePanelResult,
  ApiError | SyntaxError,
  UpdatePanelBody,
  TContext
> => useMutation({ ...updatePanelMutation(panelId), ...options });

/* ================================ [ 패널 삭제 뮤테이션 ] ====================================== */
export type DeletePanelMutation = NonNullableKeys<
  Pick<
    MutationOptions<DeletePanelResponse, ApiError | SyntaxError, Panel['sid']>,
    'mutationKey' | 'mutationFn'
  >
>;
export const deletePanelMutation = (): DeletePanelMutation => ({
  mutationKey: queryKey.panel.delete(),
  mutationFn: deletePanel,
});
export const useDeletePanelMutation = <TContext = unknown>(
  options: MutationOptions<
    DeletePanelResponse,
    ApiError | SyntaxError,
    Panel['sid'],
    TContext
  > = {},
): UseMutationResult<
  DeletePanelResponse,
  ApiError | SyntaxError,
  Panel['sid'],
  TContext
> => useMutation({ ...deletePanelMutation(), ...options });

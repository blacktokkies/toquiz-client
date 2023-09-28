import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Panel } from '@/lib/api/panel';
import type { ApiError } from '@/lib/apiClient';
import type { NonNullableKeys } from '@/lib/types';
import type { UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import type { Syntax } from 'postcss';

import { useQuery } from '@tanstack/react-query';

import { getMyActiveInfo } from '@/lib/api/active-Info';
import { queryKey } from '@/lib/queryKey';

/* =================== [ 활동 정보 디테일 쿼리 ] =================== */
export type ActiveInfoDetailQuery = NonNullableKeys<
  Pick<
    UseQueryOptions<MyActiveInfo, ApiError | Syntax>,
    'queryFn' | 'queryKey' | 'staleTime'
  >
>;
export const activeInfoDetailQuery = (
  panelId: Panel['sid'],
): ActiveInfoDetailQuery => ({
  queryKey: queryKey.activeInfo.detail(panelId),
  queryFn: async () => getMyActiveInfo(panelId).then((res) => res.result),
  staleTime: Infinity,
});
export const useActiveInfoDetailQuery = (
  panelId: Panel['sid'],
): UseQueryResult<MyActiveInfo, ApiError | Syntax> =>
  useQuery(activeInfoDetailQuery(panelId));

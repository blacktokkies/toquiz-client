import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Panel } from '@/lib/api/panel';
import type { ApiError } from '@/lib/apiClient';
import type { NonNullableKeys } from '@/lib/types';
import type { UseQueryResult, UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { getMyActiveInfo } from '@/lib/api/active-Info';
import { queryKey } from '@/lib/queryKey';

/* =================== [ 활동 정보 디테일 쿼리 ] =================== */
export type ActiveInfoDetailQuery = NonNullableKeys<
  Pick<
    UseQueryOptions<MyActiveInfo, ApiError | SyntaxError>,
    'queryFn' | 'queryKey'
  >
>;
export const activeInfoDetailQuery = (
  panelId: Panel['sid'],
): ActiveInfoDetailQuery => ({
  queryKey: queryKey.activeInfo.detail(panelId),
  queryFn: async () => getMyActiveInfo(panelId).then((res) => res.result),
});
export const useActiveInfoDetailQuery = (
  panelId: Panel['sid'],
  options: UseQueryOptions<MyActiveInfo, ApiError | SyntaxError> = {},
): UseQueryResult<MyActiveInfo, ApiError | SyntaxError> =>
  useQuery(activeInfoDetailQuery(panelId));

import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { Panel } from '@/lib/api/panel';
import type { ApiError } from '@/lib/apiClient';
import type { NonNullableKeys } from '@/lib/types';
import type { FetchQueryOptions } from '@tanstack/react-query';
import type { Syntax } from 'postcss';

import { getMyActiveInfo } from '@/lib/api/active-Info';
import { queryKey } from '@/lib/queryKey';

type _ActiveInfoDetailQueryOptions = Pick<
  FetchQueryOptions<
    MyActiveInfo,
    ApiError | Syntax,
    MyActiveInfo,
    ReturnType<typeof queryKey.activeInfo.detail>
  >,
  'queryFn' | 'queryKey' | 'staleTime'
>;

export type ActiveInfoDetailQueryOptions =
  NonNullableKeys<_ActiveInfoDetailQueryOptions>;

export const activeInfoDetailQuery = (
  panelId: Panel['sid'],
): ActiveInfoDetailQueryOptions => ({
  queryKey: queryKey.activeInfo.detail(panelId),
  queryFn: async () => getMyActiveInfo(panelId).then((res) => res.result),
  staleTime: Infinity,
});

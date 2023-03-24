import type { ApiError } from '@/lib/apiClient';
import type { GetMyPanelsResult } from '@/mocks/handlers/panel';
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { getMyPanels } from '@/lib/api/panel';
import { queryKey } from '@/lib/queryKey';

export const useMyPanelsQuery = (): UseQueryResult<
  GetMyPanelsResult,
  ApiError | SyntaxError
> => {
  const key = queryKey.panel.list();
  const query = useQuery<GetMyPanelsResult, ApiError | SyntaxError>(
    key,
    getMyPanels,
  );

  return query;
};

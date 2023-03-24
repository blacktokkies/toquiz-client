import type { GetMyPanelsResult } from '@/mocks/handlers/panel';
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { getMyPanels } from '@/lib/api/panel';

export const useMyPanelsQuery = (): UseQueryResult<GetMyPanelsResult> => {
  const query = useQuery(['panels'], getMyPanels);

  return query;
};

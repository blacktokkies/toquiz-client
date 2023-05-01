import type {
  GetMyPanelsResponse,
  GetMyPanelsResult,
} from '@/mocks/handlers/panel';

import { apiClient } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';

export const getMyPanels = async (): Promise<GetMyPanelsResult> =>
  apiClient
    .get<GetMyPanelsResponse>(apiUrl.panel.getMyPanels())
    .then((data) => data.result);

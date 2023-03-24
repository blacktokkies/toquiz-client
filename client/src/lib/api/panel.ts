import type {
  GetMyPanelsResponse,
  GetMyPanelsResult,
} from '@/mocks/handlers/panel';

import { apiClient } from '../apiClient';

export const getMyPanels = async (): Promise<GetMyPanelsResult> =>
  apiClient.get<GetMyPanelsResponse>('/panels').then((data) => data.result);

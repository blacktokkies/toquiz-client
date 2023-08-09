import type {
  GetMyPanelsParams,
  GetMyPanelsResponse,
  GetMyPanelsResult,
} from '@/mocks/handlers/panel';

import { apiClient } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';

export const getMyPanels = async (
  params: GetMyPanelsParams,
): Promise<GetMyPanelsResult> =>
  apiClient
    .get<GetMyPanelsResponse, GetMyPanelsParams>(
      apiUrl.panel.getMyPanels(),
      params,
    )
    .then((data) => data.result);

export interface Panel {
  id: string;
  userId: string;
  title: string;
  description: string;
  isArchived: boolean;
  scrapNum: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

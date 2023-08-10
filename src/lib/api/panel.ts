import type { Member } from '@/lib/api/auth';
import type { SuccessResponse } from '@/lib/api/response';
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

export const createPanel = async (
  body: CreatePanelBody,
): Promise<CreatePanelResult> =>
  apiClient
    .post<CreatePanelResponse, CreatePanelBody>(apiUrl.panel.create(), body)
    .then((data) => data.result);

/* ================================ [패널 생성 API] ====================================== */
export interface CreatePanelBody {
  title: string;
  description?: string;
}

export interface CreatePanelResult {
  id: Panel['id'];
  author: Panel['author'];
  title: Panel['title'];
  description: Panel['description'];
  createdAt: Panel['createdAt'];
}

export type CreatePanelResponse = SuccessResponse<CreatePanelResult>;

/* ================================ [패널 엔티티] ====================================== */

export interface Panel {
  id: string;
  author: Member['email'];
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

import type { Member } from '@/lib/api/auth';
import type { SuccessResponse } from '@/lib/api/types';

import { apiUrl } from '@/lib/api/consts';
import { apiClient } from '@/lib/apiClient';

export const createPanel = async (
  body: CreatePanelBody,
): Promise<CreatePanelResult> =>
  apiClient
    .post<CreatePanelResponse, CreatePanelBody>(apiUrl.panel.create(), body)
    .then((data) => data.result);

export const updatePanel = async (
  id: Panel['id'],
  body: UpdatePanelBody,
): Promise<UpdatePanelResult> =>
  apiClient
    .patch<UpdatePanelResponse, UpdatePanelBody>(apiUrl.panel.update(id), body)
    .then((data) => data.result);

export const deletePanel = async (
  id: DeletePanelPathParams['panelId'],
): Promise<DeletePanelResponse> =>
  apiClient.delete<DeletePanelResponse>(apiUrl.panel.delete(id));

export const getMyPanels = async (
  params: GetMyPanelsParams,
): Promise<GetMyPanelsResult> =>
  apiClient
    .get<GetMyPanelsResponse, GetMyPanelsParams>(
      apiUrl.panel.getMyPanels(),
      params,
    )
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

/* ================================ [패널 수정 API] ====================================== */
export interface UpdatePanelBody {
  title: string;
  description?: string;
}

export interface UpdatePanelResult {
  id: Panel['id'];
  author: Panel['author'];
  title: Panel['title'];
  description: Panel['description'];
  createdAt: Panel['createdAt'];
  updatedAt: Panel['createdAt'];
}

export type UpdatePanelResponse = SuccessResponse<UpdatePanelResult>;

export interface UpdatePanelPathParams {
  panelId: Panel['id'];
}

/* ================================ [패널 삭제 API] ====================================== */
export interface DeletePanelBody {
  title: string;
  description?: string;
}

export type DeletePanelResponse = SuccessResponse;

export interface DeletePanelPathParams {
  panelId: Panel['id'];
}

/* ================================ [패널 목록 가져오기 API] ====================================== */
export interface GetMyPanelsParams {
  page?: number;
}
export interface GetMyPanelsResult {
  nextPage?: number;
  panels: Panel[];
}

export type GetMyPanelsResponse = SuccessResponse<GetMyPanelsResult>;
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

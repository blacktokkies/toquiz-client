import type { SuccessResponse } from '@/lib/api/types';

import { apiUrl } from '@/lib/api/apiUrl';
import { apiClient } from '@/lib/apiClient';

export const createPanel = async (
  body: CreatePanelBody,
): Promise<CreatePanelResult> =>
  apiClient
    .post<CreatePanelResponse, CreatePanelBody>(apiUrl.panel.create(), body)
    .then((data) => data.result);

export const updatePanel = async (
  panelId: Panel['sid'],
  body: UpdatePanelBody,
): Promise<UpdatePanelResult> =>
  apiClient
    .patch<UpdatePanelResponse, UpdatePanelBody>(
      apiUrl.panel.update(panelId),
      body,
    )
    .then((data) => data.result);

export const deletePanel = async (
  panelId: Panel['sid'],
): Promise<DeletePanelResponse> =>
  apiClient.delete<DeletePanelResponse>(apiUrl.panel.delete(panelId));

export const getPanel = async (
  panelId: Panel['sid'],
): Promise<GetPanelResponse> =>
  apiClient.get<GetPanelResponse>(apiUrl.panel.get(panelId), {
    needAuthorization: false,
  });

export const getMyPanels = async (
  params: GetMyPanelsParams,
): Promise<GetMyPanelsResult> =>
  apiClient
    .get<GetMyPanelsResponse, GetMyPanelsParams>(apiUrl.panel.getMyPanels(), {
      params,
    })
    .then((data) => data.result);

/* ================================ [ 패널 생성 API ] ====================================== */
export interface CreatePanelBody {
  title: Panel['title'];
  description?: Panel['description'];
}
export type CreatePanelResult = Panel;
export type CreatePanelResponse = SuccessResponse<CreatePanelResult>;

/* ================================ [ 패널 수정 API ] ====================================== */
export interface UpdatePanelBody {
  title: string;
  description?: string;
}
export type UpdatePanelResult = Panel;
export type UpdatePanelResponse = SuccessResponse<UpdatePanelResult>;
export type UpdatePanelPathParams = Record<'panelId', string>;

/* ================================ [ 패널 삭제 API ] ====================================== */
export type DeletePanelResponse = SuccessResponse;
export type DeletePanelPathParams = Record<'panelId', string>;

/* ================================ [ 패널 가져오기 API ] ====================================== */
export type GetPanelResult = Panel;
export type GetPanelResponse = SuccessResponse<GetPanelResult>;
export type GetPanelPathParams = Record<'panelId', string>;

/* ================================ [ 패널 목록 가져오기 API ] ====================================== */
export interface GetMyPanelsParams {
  page: number;
}
export interface MyPanelPage {
  nextPage: number;
  panels: Panel[];
}
export type GetMyPanelsResult = MyPanelPage;
export type GetMyPanelsResponse = SuccessResponse<GetMyPanelsResult>;

/* ================================ [ 패널 엔티티 ] ====================================== */
export interface Panel {
  sid: string;
  title: string;
  description?: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

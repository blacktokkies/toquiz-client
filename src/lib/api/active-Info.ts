import type { Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';
import type { SuccessResponse } from '@/lib/api/types';

import { apiUrl } from '@/lib/api/apiUrl';
import { apiClient } from '@/lib/apiClient';

export const getMyActiveInfo = async (
  panelId: Panel['sid'],
): Promise<GetMyActiveInfoResponse> =>
  apiClient.get<GetMyActiveInfoResponse>(
    apiUrl.activeInfo.get(panelId),
    undefined,
    undefined,
    false,
  );

/* ================================ [내 활동 정보 가져오기 API] ====================================== */
export type GetMyActiveInfoPathParams = Record<'panelId', string>;
export type GetMyActiveInfoResult = MyActiveInfo;
export type GetMyActiveInfoResponse = SuccessResponse<GetMyActiveInfoResult>;

/* ================================ [활동 정보 엔티티] ====================================== */
export interface MyActiveInfo {
  createdIds: Array<Question['id']>;
  likedIds: Array<Question['id']>;
}

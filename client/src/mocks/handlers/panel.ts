import type { Panel, SuccessResponse } from 'shared';

import { rest } from 'msw';

import { API_BASE_URL } from '@/lib/apiClient';
import { myPanelData } from '@/mocks/data/panel/myPanelData';

export interface GetMyPanelsResult {
  nextCursor: undefined | Panel['id'];
  panels: Panel[];
}

export type GetMyPanelsResponse = SuccessResponse<GetMyPanelsResult>;

export const getMyPanels = rest.get<never, never, GetMyPanelsResponse>(
  `${API_BASE_URL}/panels`,
  (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          panels: myPanelData,
        },
      }),
    ),
);

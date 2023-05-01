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
  (req, res, ctx) => {
    // nextCursor가 null이면 첫 요청
    const nextCursor = req.url.searchParams.get('nextCursor');

    let newNextCursor: undefined | Panel['id'];
    const start = Number(nextCursor);
    const end = start + 20;
    const newPanelData = myPanelData.splice(start, end);

    if (end >= myPanelData.length) newNextCursor = undefined;
    else newNextCursor = String(end);

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          nextCursor: newNextCursor,
          panels: newPanelData,
        },
      }),
    );
  },
);

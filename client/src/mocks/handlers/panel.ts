import type { Panel, SuccessResponse } from 'shared';

import { rest } from 'msw';

import { API_BASE_URL } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';
import { myPanelsData } from '@/mocks/data/panel/myPanelsData';

export interface GetMyPanelsResult {
  nextCursor: undefined | Panel['id'];
  panels: Panel[];
}

export type GetMyPanelsResponse = SuccessResponse<GetMyPanelsResult>;

export const getMyPanels = rest.get<never, never, GetMyPanelsResponse>(
  `${API_BASE_URL}${apiUrl.panel.getMyPanels()}`,
  (req, res, ctx) => {
    // nextCursor가 null이면 첫 요청
    const nextCursor = req.url.searchParams.get('nextCursor');

    let newNextCursor: undefined | Panel['id'];
    const start = Number(nextCursor);
    const end = start + 20;
    const newPanelData = myPanelsData.splice(start, end);

    if (end >= myPanelsData.length) newNextCursor = undefined;
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

import type {
  CreatePanelResponse,
  CreatePanelBody,
  Panel,
} from '@/lib/api/panel';
import type { SuccessResponse } from '@/lib/api/types';

import { faker } from '@faker-js/faker';
import { rest } from 'msw';

import { API_BASE_URL } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';
import { myPanelList } from '@/mocks/data/panel';

export interface GetMyPanelsParams {
  cursor: undefined | Panel['id'];
}
export interface GetMyPanelsResult {
  cursor?: Panel['id'];
  panels: Panel[];
}

export type GetMyPanelsResponse = SuccessResponse<GetMyPanelsResult>;

export const getMyPanels = rest.get<never, never, GetMyPanelsResponse>(
  `${API_BASE_URL}${apiUrl.panel.getMyPanels()}`,
  async (req, res, ctx) => {
    const cursor = req.url.searchParams.get('cursor');

    const start = Number(cursor);
    const end = start + 20;
    const newPanelData = myPanelList.slice(start, end);

    let newNextCursor: undefined | Panel['id'];
    if (end >= myPanelList.length) newNextCursor = undefined;
    else newNextCursor = String(end);

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          cursor: newNextCursor,
          panels: newPanelData,
        },
      }),
    );
  },
);

export const createPanel = rest.post<
  CreatePanelBody,
  never,
  CreatePanelResponse
>(`${API_BASE_URL}${apiUrl.panel.create()}`, async (req, res, ctx) => {
  const { title, description }: CreatePanelBody = await req.json();

  return res(
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        id: faker.datatype.uuid(),
        author: 'author',
        title,
        description,
        createdAt: new Date().toDateString(),
      },
    }),
  );
});

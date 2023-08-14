import type {
  CreatePanelResponse,
  CreatePanelBody,
  Panel,
  UpdatePanelBody,
  UpdatePanelResponse,
  UpdatePanelPathParams,
  DeletePanelPathParams,
  DeletePanelResponse,
  GetMyPanelsResponse,
} from '@/lib/api/panel';

import { faker } from '@faker-js/faker';
import { rest } from 'msw';

import { apiUrl } from '@/lib/api/consts';
import { API_BASE_URL } from '@/lib/apiClient';
import { myPanelList } from '@/mocks/data/panel';

import { myAccount } from '../data/auth';

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

export const updatePanel = rest.patch<
  UpdatePanelBody,
  UpdatePanelPathParams,
  UpdatePanelResponse
>(
  `${API_BASE_URL}${apiUrl.panel.update(':panelId')}`,
  async (req, res, ctx) => {
    const { title, description }: UpdatePanelBody = await req.json();
    const { panelId } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          id: panelId,
          author: myAccount.email,
          title,
          description,
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString(),
        },
      }),
    );
  },
);

export const deletePanel = rest.delete<
  never,
  DeletePanelPathParams,
  DeletePanelResponse
>(`${API_BASE_URL}${apiUrl.panel.delete(':panelId')}`, async (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      message: '패널 삭제에 성공하였습니다.',
      result: undefined,
    }),
  ),
);

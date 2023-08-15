import type {
  CreatePanelResponse,
  CreatePanelBody,
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
    const page = req.url.searchParams.get('page');

    const start = Number(page);
    const end = (start + 1) * 10;
    const panels = myPanelList.slice(start, end);

    const nextPage = end === myPanelList.length ? -1 : start + 1;

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          nextPage,
          panels,
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

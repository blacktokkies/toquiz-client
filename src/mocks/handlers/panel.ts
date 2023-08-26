import type {
  CreatePanelResponse,
  CreatePanelBody,
  UpdatePanelBody,
  UpdatePanelResponse,
  UpdatePanelPathParams,
  DeletePanelPathParams,
  DeletePanelResponse,
  GetMyPanelsResponse,
  GetPanelPathParams,
  GetPanelResponse,
} from '@/lib/api/panel';

import { rest } from 'msw';

import { apiUrl } from '@/lib/api/apiUrl';
import { API_BASE_URL } from '@/lib/apiClient';
import { createMockPanel, myPanelList } from '@/mocks/data/panel';

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
  const newPanel = {
    ...createMockPanel(),
    title,
    description,
  };

  return res(
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: newPanel,
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
          sid: panelId,
          authorId: 0,
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

export const getPanel = rest.get<never, GetPanelPathParams, GetPanelResponse>(
  `${API_BASE_URL}${apiUrl.panel.get(':panelId')}`,
  async (req, res, ctx) => {
    const { panelId } = req.params;
    const panel = myPanelList.find((panel) => panel.sid === panelId) ?? {
      ...createMockPanel(),
      sid: panelId,
    };

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: panel,
      }),
    );
  },
);

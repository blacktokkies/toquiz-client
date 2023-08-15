import type { ErrorResponse } from '@/lib/api/types';
import type { RouteObject } from 'react-router-dom';

import React from 'react';

import { faker } from '@faker-js/faker';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { apiUrl } from '@/lib/api/consts';
import * as panelApis from '@/lib/api/panel';
import { server } from '@/mocks/server';
import { Panel, panelLoader, PanelError } from '@/pages/Panel';

const panelId = faker.datatype.uuid();

describe('/panel/:id route', () => {
  it('로더에서 패널 정보 가져오기 API를 호출한다', () => {
    const spyOnGetPanel = vi.spyOn(panelApis, 'getPanel');
    setup();

    expect(spyOnGetPanel).toBeCalledWith(panelId);
  });

  it('패널 정보 가져오기 API가 성공 응답을 반환하면 패널 페이지를 보여준다', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/패널 페이지/)).toBeInTheDocument();
    });
  });

  it('패널 정보 가져오기 API가 실패 응답을 반환하면 Fallback UI를 보여준다', async () => {
    overrideGetPanelResponseWithError({
      code: 'NOT_EXIST_PANEL',
      statusCode: 404,
      message: '해당 패널이 존재하지 않습니다.',
    });
    setup();

    await waitFor(() => {
      expect(screen.getByText(/패널 에러 페이지/)).toBeInTheDocument();
    });
  });
});

function overrideGetPanelResponseWithError(data: ErrorResponse): void {
  server.use(
    rest.get(apiUrl.panel.get(panelId), async (req, res, ctx) =>
      res(ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

function setup(): void {
  const routes: RouteObject[] = [
    {
      path: '/panel/:id',
      element: <Panel />,
      loader: panelLoader,
      errorElement: <PanelError />,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: [`/panel/${panelId}`],
  });

  render(<RouterProvider router={router} />);
}

import type { ErrorResponse } from '@/lib/api/types';
import type { RouteObject } from 'react-router-dom';

import React from 'react';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { Outlet, RouterProvider, createMemoryRouter } from 'react-router-dom';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { apiUrl } from '@/lib/api/apiUrl';
import * as panelApis from '@/lib/api/panel';
import { queryKey } from '@/lib/queryKey';
import { createQueryClient } from '@/lib/test-utils';
import { myActiveInfoMock } from '@/mocks/data/panel';
import { server } from '@/mocks/server';
import { Panel, panelLoader, PanelErrorBoundary } from '@/pages/Panel';

const panelId: panelApis.Panel['id'] = 1;

describe('/panel/:id route', () => {
  it('로더에서 패널 정보 가져오기 API와 내 활동 정보 가져오기 API를 호출한다', async () => {
    const spyOnGetPanel = vi.spyOn(panelApis, 'getPanel');
    const spyOnGetMyActiveInfo = vi.spyOn(panelApis, 'getMyActiveInfo');
    setup();

    expect(spyOnGetPanel).toBeCalledWith(panelId);
    await waitFor(() => {
      expect(spyOnGetMyActiveInfo).toBeCalledWith(panelId);
    });
  });

  it('내 활동 정보 가져오기 API가 성공 응답을 반환하면 캐시에 저장된다', async () => {
    const { queryClient } = setup();

    await waitFor(() => {
      expect(
        queryClient.getQueryData(queryKey.activeInfo.detail(panelId)),
      ).toEqual(myActiveInfoMock);
    });
  });

  it('로더가 성공 응답을 반환하면 패널 페이지를 보여준다', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  it('로더가 실패 응답을 반환하면 Fallback UI를 보여준다', async () => {
    overrideGetPanelResponseWithError({
      code: 'NOT_EXIST_PANEL',
      statusCode: 404,
      message: '해당 패널이 존재하지 않습니다.',
    });
    setup();

    await waitFor(() => {
      expect(screen.getByText(/존재하지 않는 패널입니다/)).toBeInTheDocument();
    });
  });
});

function overrideGetPanelResponseWithError(data: ErrorResponse): void {
  server.use(
    rest.get(apiUrl.panel.get(':panelId'), async (req, res, ctx) =>
      res(ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

function setup(): {
  queryClient: QueryClient;
} {
  const queryClient = createQueryClient();
  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <OverlayProvider>
          <Outlet />
        </OverlayProvider>
      ),
      children: [
        {
          path: '/panel/:id',
          element: <Panel />,
          loader: panelLoader(queryClient),
          errorElement: <PanelErrorBoundary />,
        },
      ],
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: [`/panel/${panelId}`],
  });

  render(<RouterProvider router={router} />, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  return { queryClient };
}

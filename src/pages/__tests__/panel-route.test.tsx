import type { Panel as PanelData } from '@/lib/api/panel';
import type { ErrorResponse } from '@/lib/api/types';

import React from 'react';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import * as activeInfoApis from '@/lib/api/active-Info';
import { apiUrl } from '@/lib/api/apiUrl';
import * as panelApis from '@/lib/api/panel';
import { createQueryClient } from '@/lib/test-utils';
import { createMockPanelId } from '@/mocks/data/panel';
import { server } from '@/mocks/server';
import {
  Component as Panel,
  loader as panelLoader,
  ErrorBoundary as PanelErrorBoundary,
} from '@/pages/Panel';

vi.mock('@/hooks/useOverlay', () => ({ useOverlay: vi.fn() }));

function setup({ panelId }: { panelId: PanelData['sid'] }): {
  queryClient: QueryClient;
  panelId: PanelData['sid'];
} {
  const queryClient = createQueryClient();
  const router = createMemoryRouter(
    [
      {
        path: '/panel/:panelId',
        element: <Panel />,
        loader: panelLoader(queryClient),
        errorElement: <PanelErrorBoundary />,
      },
    ],
    {
      initialEntries: [`/panel/${panelId}`],
    },
  );

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { queryClient, panelId };
}

describe('/panel/:panelId 로더', () => {
  it('패널 정보 가져오기 API와 내 활동 정보 가져오기 API를 호출한다', async () => {
    const spyOnGetPanel = vi.spyOn(panelApis, 'getPanel');
    const spyOnGetMyActiveInfo = vi.spyOn(activeInfoApis, 'getMyActiveInfo');
    const { panelId } = setup({ panelId: createMockPanelId() });

    expect(spyOnGetPanel).toBeCalledWith(panelId);
    await waitFor(() => {
      expect(spyOnGetMyActiveInfo).toBeCalledWith(panelId);
    });
  });

  it('패널 정보 가져오기 API와 내 활동 정보 가져오기 API가 모두 성공 응답을 반환하면 패널 페이지를 보여준다', async () => {
    setup({ panelId: createMockPanelId() });

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('패널 정보 가져오기 API가 실패 응답을 반환하는 경우', () => {
    it('[404] 패널 아이디에 일치하는 패널이 존재하지 않으면 Fallback UI를 보여준다', async () => {
      overrideGetPanelResponseWithError({
        code: 'NOT_EXIST_PANEL',
        statusCode: 404,
        message: '해당 패널이 존재하지 않습니다.',
      });
      setup({ panelId: createMockPanelId() });

      await waitFor(() => {
        expect(
          screen.getByText(/존재하지 않는 패널입니다/),
        ).toBeInTheDocument();
      });
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

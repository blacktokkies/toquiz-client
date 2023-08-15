import type { RouteObject } from 'react-router-dom';

import React from 'react';

import { faker } from '@faker-js/faker';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import * as panelApis from '@/lib/api/panel';
import { Panel, panelLoader } from '@/pages/Panel';

describe('/panel/:id route', () => {
  it('로더에서 패널 정보 가져오기 API를 호출한다', () => {
    const spyOnGetPanel = vi.spyOn(panelApis, 'getPanel');
    const panelId = faker.datatype.uuid();
    const routes: RouteObject[] = [
      {
        path: '/panel/:id',
        element: <Panel />,
        loader: panelLoader,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: [`/panel/${panelId}`],
    });
    render(<RouterProvider router={router} />);
    expect(spyOnGetPanel).toBeCalledWith(panelId);
  });

  it('패널 정보 가져오기 API가 성공 응답을 반환하면 패널 페이지를 보여준다', async () => {
    const panelId = faker.datatype.uuid();
    const routes: RouteObject[] = [
      {
        path: '/panel/:id',
        element: <Panel />,
        loader: panelLoader,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: [`/panel/${panelId}`],
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText(/패널 페이지/)).toBeInTheDocument();
    });
  });
});

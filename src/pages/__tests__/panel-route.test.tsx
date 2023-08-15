import type { RouteObject } from 'react-router-dom';

import React from 'react';

import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';
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
});

import type {
  GetMyActiveInfoPathParams,
  GetMyActiveInfoResponse,
} from '@/lib/api/active-Info';

import { rest } from 'msw';

import { apiUrl } from '@/lib/api/apiUrl';
import { API_BASE_URL } from '@/lib/apiClient';
import { myActiveInfoMock } from '@/mocks/data/active-info';

export const getMyActiveInfo = rest.get<
  never,
  GetMyActiveInfoPathParams,
  GetMyActiveInfoResponse
>(
  `${API_BASE_URL}${apiUrl.panel.getMyActiveInfo(':panelId')}`,
  async (req, res, ctx) => {
    let activeInfoToken = req.cookies.active_info_id;

    if (!activeInfoToken?.length) activeInfoToken = 'dev-active-info-token';
    return res(
      ctx.status(200),
      ctx.cookie('active_info_id', activeInfoToken, { httpOnly: true }),
      ctx.json({
        statusCode: 200,
        result: myActiveInfoMock,
      }),
    );
  },
);

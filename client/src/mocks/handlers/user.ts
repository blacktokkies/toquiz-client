import { rest } from 'msw';

interface GetUserRequestBody {
  id: string;
}

interface GetUserRequestParams {
  myParam: string;
}

interface GetUserResponseBody {
  name: string;
}

export const getUser = rest.get<
  GetUserRequestBody,
  GetUserRequestParams,
  GetUserResponseBody
>('/api/user', (req, res, ctx) => res(ctx.json({ name: '사용자' })));

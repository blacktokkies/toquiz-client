/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { SignUpParams } from '@/lib/api/auth';
import type { SignUpResponse } from 'shared';

import { rest } from 'msw';

import { apiUrl } from '@/lib/constants';

export const signUp = rest.post<SignUpParams, never, SignUpResponse>(
  apiUrl.auth.signup(),
  async (req, res, ctx) => {
    const { nickname }: SignUpParams = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: { message: `${nickname}이 회원가입에 성공했다` },
      }),
    );
  },
);

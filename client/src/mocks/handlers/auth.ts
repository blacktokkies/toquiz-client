/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { SignUpResponse, SignUpBody } from 'shared';

import { rest } from 'msw';

import { apiUrl } from '@/lib/constants';

export const signUp = rest.post<SignUpBody, never, SignUpResponse>(
  apiUrl.auth.signup(),
  async (req, res, ctx) => {
    const { nickname }: SignUpBody = await req.json();

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: { message: `${nickname}이 회원가입에 성공했다` },
      }),
    );
  },
);

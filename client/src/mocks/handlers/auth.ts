/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { LoginBody, LoginResponse } from '@/lib/api/auth';
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

export const login = rest.post<LoginBody, never, LoginResponse>(
  apiUrl.auth.login(),
  (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.cookie('accessTooken', '액세스 토큰'),
      ctx.cookie('refreshTooken', '리프레쉬 토큰'),
      ctx.json({
        statusCode: 200,
        result: {
          nickname: '사용자 닉네임',
        },
      }),
    ),
);

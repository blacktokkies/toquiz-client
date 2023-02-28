/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  SignUpResponse,
  SignUpBody,
  LogInBody,
  LogInResponse,
} from 'shared';

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

export const login = rest.post<LogInBody, never, LogInResponse>(
  apiUrl.auth.login(),
  async (req, res, ctx) => {
    const { username }: LogInBody = await req.json();

    return res(
      ctx.status(200),
      ctx.cookie('accessToken', '액세스 토큰'),
      ctx.cookie('refreshToken', '리프레쉬 토큰'),
      ctx.json({
        statusCode: 200,
        result: {
          user: {
            id: username,
            username,
            nickname: '사용자 이름',
            createdAt: new Date(),
          },
          accessToken: '액세스 토큰',
        },
      }),
    );
  },
);

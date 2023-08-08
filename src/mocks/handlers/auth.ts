/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  SignUpResponse,
  SignUpBody,
  LogInBody,
  LogInResponse,
  RefreshResponse,
  GetMyInfoResponse,
} from '@/lib/api/auth';
import type { ErrorResponse } from '@/lib/api/response';

import { rest } from 'msw';

import { API_BASE_URL } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';

export const signUp = rest.post<SignUpBody, never, SignUpResponse>(
  `${API_BASE_URL}${apiUrl.auth.signup()}`,
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
  `${API_BASE_URL}${apiUrl.auth.login()}`,
  async (req, res, ctx) => {
    const { email }: LogInBody = await req.json();

    return res(
      ctx.status(200),
      ctx.cookie('refreshToken', 'dev refreshToken', { httpOnly: true }),
      ctx.json({
        statusCode: 200,
        result: {
          user: {
            id: email,
            email,
            nickname: 'dev nickname',
            createdAt: new Date(),
          },
          accessToken: 'dev accessToken',
        },
      }),
    );
  },
);

export const me = rest.get<never, never, GetMyInfoResponse | ErrorResponse>(
  `${API_BASE_URL}${apiUrl.auth.me()}`,
  async (req, res, ctx) => {
    const { headers } = req;
    const accessToken = /(?<=Bearer ).*/.exec(
      headers.get('Authorization') ?? '',
    )?.[0];

    const isValid = Number(accessToken?.length) > 0;

    if (isValid)
      return res(
        ctx.status(200),
        ctx.json({
          statusCode: 200,
          result: {
            id: 'dev id',
            email: 'dev email',
            nickname: 'dev nickname',
            provider: 'dev provider',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        }),
      );
    else {
      return res(
        ctx.status(401),
        ctx.json({
          code: 'unauthorized error',
          statusCode: 401,
          message: 'unauthorized error',
        }),
      );
    }
  },
);

export const refresh = rest.post<never, never, RefreshResponse | ErrorResponse>(
  `${API_BASE_URL}${apiUrl.auth.refresh()}`,
  async (req, res, ctx) => {
    const { headers } = req;
    const refreshToken = /(?<=refreshToken=).*/.exec(
      headers.get('Cookie') ?? '',
    )?.[0];

    const isValid = Number(refreshToken?.length) > 0;

    if (isValid)
      return res(
        ctx.status(200),
        ctx.cookie('refreshToken', 'dev refresh token', { httpOnly: true }),
        ctx.json({
          statusCode: 200,
          result: {
            user: {
              id: 'dev id',
              email: 'dev email',
              nickname: 'dev nickname',
              createdAt: new Date(),
            },
            accessToken: 'dev accessToken',
          },
        }),
      );
    else {
      return res(
        ctx.status(401),
        ctx.json({
          code: 'unauthorized error',
          statusCode: 401,
          message: 'unauthorized error',
        }),
      );
    }
  },
);

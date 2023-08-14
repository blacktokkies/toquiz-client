/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  SignUpResponse,
  SignUpBody,
  LogInBody,
  LogInResponse,
  LogoutResponse,
  RefreshResponse,
  GetMyInfoResponse,
} from '@/lib/api/auth';
import type { ErrorResponse } from '@/lib/api/types';

import { rest } from 'msw';

import { apiUrl } from '@/lib/api/consts';
import { API_BASE_URL } from '@/lib/apiClient';
import { myAccount } from '@/mocks/data/auth';

export const signUp = rest.post<SignUpBody, never, SignUpResponse>(
  `${API_BASE_URL}${apiUrl.auth.signup()}`,
  async (req, res, ctx) => {
    const { nickname }: SignUpBody = await req.json();
    myAccount.nickname = nickname;

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
    myAccount.email = email;

    return res(
      ctx.status(200),
      ctx.cookie('refreshToken', 'dev-refreshToken', { httpOnly: true }),
      ctx.json({
        statusCode: 200,
        result: {
          ...myAccount,
          email,
          accessToken: 'dev-accessToken',
        },
      }),
    );
  },
);

export const logout = rest.post<never, never, LogoutResponse>(
  `${API_BASE_URL}${apiUrl.auth.logout()}`,
  async (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.cookie('refreshToken', '', { expires: new Date() }),
      ctx.json({
        statusCode: 200,
        result: undefined,
      }),
    ),
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
            ...myAccount,
            provider: 'dev-provider',
            updatedAt: new Date().toString(),
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
        ctx.cookie('refreshToken', 'dev-refresh token', { httpOnly: true }),
        ctx.json({
          statusCode: 200,
          result: {
            ...myAccount,
            accessToken: 'dev-accessToken',
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

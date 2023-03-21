/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  SignUpResponse,
  SignUpBody,
  LogInBody,
  LogInResponse,
  User,
  SuccessResponse,
  RefreshResponse,
  ErrorResponse,
} from 'shared';

import { rest } from 'msw';

import { API_ORIGIN } from '@/lib/apiClient';
import { apiUrl } from '@/lib/constants';

export const signUp = rest.post<SignUpBody, never, SignUpResponse>(
  `${API_ORIGIN}${apiUrl.auth.signup()}`,
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
  `${API_ORIGIN}${apiUrl.auth.login()}`,
  async (req, res, ctx) => {
    const { username }: LogInBody = await req.json();

    return res(
      ctx.status(200),
      ctx.cookie('refreshToken', 'dev refreshToken', { httpOnly: true }),
      ctx.json({
        statusCode: 200,
        result: {
          user: {
            id: username,
            username,
            nickname: 'dev nickname',
            createdAt: new Date(),
          },
          accessToken: 'dev accessToken',
        },
      }),
    );
  },
);

// TODO: shared에서 제공하는 인터페이스로 바꾸기
export type GetMyInfoResult = Pick<
  User,
  'id' | 'nickname' | 'username' | 'createdAt'
>;
export type GetMyInfoResponse = SuccessResponse<GetMyInfoResult>;
export interface GetMyInfoBody {}

export const me = rest.get<
  GetMyInfoBody,
  never,
  GetMyInfoResponse | ErrorResponse
>(`${API_ORIGIN}${apiUrl.auth.me()}`, async (req, res, ctx) => {
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
          username: 'dev username',
          nickname: 'dev nickname',
          createdAt: new Date(),
        },
      }),
    );
  else {
    return res(
      ctx.status(401),
      ctx.json({
        statusCode: 401,
        message: 'unauthorized error',
        error: 'unauthorized error',
      }),
    );
  }
});

export const refresh = rest.post<never, never, RefreshResponse | ErrorResponse>(
  `${API_ORIGIN}${apiUrl.auth.refresh()}`,
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
              username: 'dev username',
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
          statusCode: 401,
          message: 'unauthorized error',
          error: 'unauthorized error',
        }),
      );
    }
  },
);

import type { SuccessResponse } from '@/lib/api/response';

import { apiClient } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';

export interface SignUpBody {
  email: User['email'];
  password: User['password'];
  nickname: User['nickname'];
}

export interface SignUpResult {
  message: string;
}

export type SignUpResponse = SuccessResponse<SignUpResult>;

export const signUp = async (body: SignUpBody): Promise<SignUpResult> =>
  apiClient
    .post<SignUpResponse, SignUpBody>(apiUrl.auth.signup(), body)
    .then((data) => data.result);

export interface LogInBody {
  email: User['email'];
  password: User['password'];
}

export interface LogInResult {
  user: {
    id: User['id'];
    email: User['email'];
    nickname: User['nickname'];
    createdAt: User['createdAt'];
  };
  accessToken: string;
}

export type LogInResponse = SuccessResponse<LogInResult>;

export const login = async (body: LogInBody): Promise<LogInResult> =>
  apiClient
    .post<LogInResponse, LogInBody>(apiUrl.auth.login(), body)
    .then((data) => data.result);

export interface GetMyInfoResult {
  id: User['id'];
  email: User['email'];
  nickname: User['nickname'];
  provider: User['provider'];
  createdAt: User['createdAt'];
  updatedAt: User['updatedAt'];
  deletedAt: User['deletedAt'];
}

export type GetMyInfoResponse = SuccessResponse<GetMyInfoResult>;

export const me = async (): Promise<GetMyInfoResult> =>
  apiClient
    .get<GetMyInfoResponse>(apiUrl.auth.me())
    .then((data) => data.result);

export interface RefreshResult {
  user: {
    id: User['id'];
    email: User['email'];
    nickname: User['nickname'];
    createdAt: User['createdAt'];
  };
  accessToken: string;
}

export type RefreshResponse = SuccessResponse<RefreshResult>;

export const refresh = async (): Promise<RefreshResult> =>
  apiClient
    .post<RefreshResponse>(apiUrl.auth.refresh())
    .then((data) => data.result);

export interface User {
  id: string;
  email: string;
  password: string;
  nickname: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

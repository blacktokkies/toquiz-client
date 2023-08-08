import type { SuccessResponse } from '@/lib/api/response';

import { apiClient } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';

export interface SignUpBody {
  email: Member['email'];
  password: Member['password'];
  nickname: Member['nickname'];
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
  email: Member['email'];
  password: Member['password'];
}

export interface LogInResult {
  user: {
    id: Member['id'];
    email: Member['email'];
    nickname: Member['nickname'];
    createdAt: Member['createdAt'];
  };
  accessToken: string;
}

export type LogInResponse = SuccessResponse<LogInResult>;

export const login = async (body: LogInBody): Promise<LogInResult> =>
  apiClient
    .post<LogInResponse, LogInBody>(apiUrl.auth.login(), body)
    .then((data) => data.result);

export interface GetMyInfoResult {
  id: Member['id'];
  email: Member['email'];
  nickname: Member['nickname'];
  provider: Member['provider'];
  createdAt: Member['createdAt'];
  updatedAt: Member['updatedAt'];
  deletedAt: Member['deletedAt'];
}

export type GetMyInfoResponse = SuccessResponse<GetMyInfoResult>;

export const me = async (): Promise<GetMyInfoResult> =>
  apiClient
    .get<GetMyInfoResponse>(apiUrl.auth.me())
    .then((data) => data.result);

export interface RefreshResult {
  user: {
    id: Member['id'];
    email: Member['email'];
    nickname: Member['nickname'];
    createdAt: Member['createdAt'];
  };
  accessToken: string;
}

export type RefreshResponse = SuccessResponse<RefreshResult>;

export const refresh = async (): Promise<RefreshResult> =>
  apiClient
    .post<RefreshResponse>(apiUrl.auth.refresh())
    .then((data) => data.result);

export interface Member {
  id: string;
  email: string;
  password: string;
  nickname: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

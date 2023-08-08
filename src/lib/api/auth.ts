import type { SuccessResponse, ErrorResponse } from '@/lib/api/response';

import { apiClient } from '@/lib/apiClient';
import { apiUrl } from '@/lib/apiUrl';

export const signUp = async (body: SignUpBody): Promise<SignUpResult> =>
  apiClient
    .post<SignUpResponse, SignUpBody>(apiUrl.auth.signup(), body)
    .then((data) => data.result);

export const login = async (body: LogInBody): Promise<LogInResult> =>
  apiClient
    .post<LogInResponse, LogInBody>(apiUrl.auth.login(), body)
    .then((data) => data.result);

export const me = async (): Promise<GetMyInfoResult> =>
  apiClient
    .get<GetMyInfoResponse>(apiUrl.auth.me())
    .then((data) => data.result);

export const refresh = async (): Promise<RefreshResult> =>
  apiClient
    .post<RefreshResponse>(apiUrl.auth.refresh())
    .then((data) => data.result);

export interface SignUpBody {
  email: Member['email'];
  password: Member['password'];
  nickname: Member['nickname'];
}

export interface SignUpResult {
  message: string;
}

export type SignUpResponse = SuccessResponse<SignUpResult>;

// TODO: code를 따로 정의한 상수나 type으로 다루도록 수정하기
export type SignUpError = ErrorResponse & {
  code: 'DUPLICATE_EMAIL';
};

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

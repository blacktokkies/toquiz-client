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

/* ================================ [회원가입 API] ====================================== */
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
export type SignUpError = DuplicateSignUpError | InvalidParameterSignUpError;

export type DuplicateSignUpError = Omit<ErrorResponse, 'code'> & {
  code: 'DUPLICATE_EMAIL' | 'DUPLICATE_NICKNAME';
};

export type InvalidParameterSignUpError = Omit<
  ErrorResponse,
  'code' | 'errors'
> & {
  code: 'INVALID_PARAMETER';
  errors: Array<{ field: 'email' | 'password' | 'nickname'; message: string }>;
};

/* ================================ [로그인 API] ====================================== */
export interface LogInBody {
  email: Member['email'];
  password: Member['password'];
}

export interface LogInResult {
  email: Member['email'];
  nickname: Member['nickname'];
  createdAt: Member['createdAt'];
  accessToken: string;
}

export type LogInResponse = SuccessResponse<LogInResult>;

export type LoginError =
  | NonExistentAccountLoginError
  | PasswordMismatchLoginError
  | InvalidParameterLoginError;

export type NonExistentAccountLoginError = Omit<ErrorResponse, 'code'> & {
  code: 'NON_EXISTENT_ACCOUNT';
};

export type PasswordMismatchLoginError = Omit<ErrorResponse, 'code'> & {
  code: 'MISMATCH_PASSWORD';
};

export type InvalidParameterLoginError = Omit<
  ErrorResponse,
  'code' | 'errors'
> & {
  code: 'INVALID_PARAMETER';
  errors: Array<{ field: 'email' | 'password'; message: string }>;
};

/* ================================ [회원 정보 API] ====================================== */
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

/* ================================ [토큰 리프레쉬 API] ====================================== */

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

/* ================================ [사용자 엔티티] ====================================== */

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

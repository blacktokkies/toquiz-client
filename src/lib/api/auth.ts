import type { SuccessResponse, ErrorResponse } from '@/lib/api/types';

import { apiUrl } from '@/lib/api/apiUrl';
import { apiClient } from '@/lib/apiClient';

export const signUp = async (body: SignUpBody): Promise<SignUpResponse> =>
  apiClient.post<SignUpResponse, SignUpBody>(apiUrl.auth.signup(), body, {
    needAuthorization: false,
  });

export const login = async (body: LogInBody): Promise<LogInResult> =>
  apiClient
    .post<LogInResponse, LogInBody>(apiUrl.auth.login(), body, {
      needAuthorization: false,
    })
    .then((data) => data.result);

export const logout = async (): Promise<LogoutResponse> =>
  apiClient.post<LogoutResponse>(apiUrl.auth.logout());

export const me = async (): Promise<GetMyInfoResult> =>
  apiClient
    .get<GetMyInfoResponse>(apiUrl.auth.me())
    .then((data) => data.result);

export const refresh = async (): Promise<RefreshResult> =>
  apiClient
    .post<RefreshResponse>(apiUrl.auth.refresh(), undefined, {
      needAuthorization: false,
    })
    .then((data) => data.result);

export const updateMyInfo = async (
  body: UpdateMyInfoBody,
): Promise<UpdateMyInfoResponse> =>
  apiClient.patch<UpdateMyInfoResponse, UpdateMyInfoBody>(
    apiUrl.auth.update(),
    body,
  );

export const resign = async (body: ResignBody): Promise<ResignResponse> =>
  apiClient.post<ResignResponse, ResignBody>(apiUrl.auth.resign(), body);

/* ================================ [ 회원가입 API ] ====================================== */
export interface SignUpBody {
  email: Member['email'];
  password: Member['password'];
  nickname: Member['nickname'];
}
export type SignUpResponse = SuccessResponse;
export type SignUpError = DuplicateSignUpError | InvalidParameterSignUpError;
export type DuplicateSignUpError = ErrorResponse & {
  code: 'DUPLICATE_EMAIL' | 'DUPLICATE_NICKNAME';
  statusCode: 400;
};
export type InvalidParameterSignUpError = Omit<ErrorResponse, 'errors'> & {
  code: 'INVALID_PARAMETER';
  statusCode: 400;
  errors: Array<{ field: 'email' | 'password' | 'nickname'; message: string }>;
};

/* ================================ [ 로그인 API ] ====================================== */
export interface LogInBody {
  email: Member['email'];
  password: Member['password'];
}
export interface LogInResult {
  id: Member['id'];
  email: Member['email'];
  nickname: Member['nickname'];
  provider: Member['provider'];
  createdAt: Member['createdAt'];
  updatedAt: Member['updatedAt'];
  accessToken: string;
}
export type LogInResponse = SuccessResponse<LogInResult>;
export type LoginError = NotExistMemberLoginError | NotMatchPasswordLoginError;
export type InvalidParameterLoginError = Omit<ErrorResponse, 'errors'> & {
  code: 'INVALID_PARAMETER';
  statusCode: 400;
  errors: Array<{ field: 'email' | 'password' | 'nickname'; message: string }>;
};
export type NotExistMemberLoginError = ErrorResponse & {
  code: 'NOT_EXIST_MEMBER';
  statusCode: 404;
};
export type NotMatchPasswordLoginError = ErrorResponse & {
  code: 'NOT_MATCH_PASSWORD';
  statusCode: 400;
};

/* ================================ [ 로그아웃 API ] ====================================== */
export type LogoutResponse = SuccessResponse;
export type LogoutError = InvalidAccessTokenError;

/* ================================ [ 회원 정보 API ] ====================================== */
export interface GetMyInfoResult {
  id: Member['id'];
  email: Member['email'];
  nickname: Member['nickname'];
  provider: Member['provider'];
  createdAt: Member['createdAt'];
  updatedAt: Member['updatedAt'];
}
export type GetMyInfoResponse = SuccessResponse<GetMyInfoResult>;
export type GetMyInfoError = InvalidAccessTokenError;

/* ================================ [ 회원 정보 수정 API ] ====================================== */
export interface UpdateMyInfoBody {
  nickname?: Member['nickname'];
  password?: Member['password'];
}
export interface UpdateMyInfoResult {
  id: Member['id'];
  email: Member['email'];
  nickname: Member['nickname'];
  provider: Member['provider'];
  createdAt: Member['createdAt'];
  updatedAt: Member['updatedAt'];
}
export type UpdateMyInfoResponse = SuccessResponse<UpdateMyInfoResult>;

/* ================================ [ 토큰 리프레쉬 API ] ====================================== */
export interface RefreshResult {
  id: Member['id'];
  email: Member['email'];
  nickname: Member['nickname'];
  provider: Member['provider'];
  createdAt: Member['createdAt'];
  updatedAt: Member['updatedAt'];
  accessToken: string;
}
export type RefreshResponse = SuccessResponse<RefreshResult>;
export type RefreshError =
  | NotExistMemberLoginError
  | InvalidRefreshTokenRefreshError;
export type NotExistMemberRefreshError = ErrorResponse & {
  code: 'NOT_EXIST_MEMBER';
  statusCode: 404;
};
export type InvalidRefreshTokenRefreshError = ErrorResponse & {
  code: 'INVALID_REFRESH_TOKEN';
  statusCode: 401;
};
/* ================================ [ 회원 탈퇴 API ] ====================================== */
export interface ResignBody {
  password: Member['password'];
}
export type ResignResponse = SuccessResponse;
export type ResignError = NotMatchPasswordResignError;
export type NotMatchPasswordResignError = ErrorResponse & {
  code: 'NOT_MATCH_PASSWORD';
  statusCode: 400;
};

/* ================================ [ 유효하지 않은 토큰 에러 ] ====================================== */
export type InvalidAccessTokenError = ErrorResponse & {
  code: 'INVALID_ACCESS_TOKEN';
  statusCode: 401;
};

/* ================================ [ 사용자 엔티티 ] ====================================== */

export interface Member {
  id: number;
  email: string;
  password: string;
  nickname: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

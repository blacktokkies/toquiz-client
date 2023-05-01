import type {
  GetMyInfoResponse,
  GetMyInfoResult,
  SignUpBody,
  SignUpResult,
  SignUpResponse,
  LogInBody,
  LogInResult,
  LogInResponse,
  RefreshResult,
  RefreshResponse,
} from 'shared';

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

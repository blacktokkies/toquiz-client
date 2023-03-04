import type {
  SignUpBody,
  SignUpResult,
  SignUpResponse,
  LogInBody,
  LogInResult,
  LogInResponse,
} from 'shared';

import { apiClient } from '@/lib/apiClient';
import { apiUrl } from '@/lib/constants';

export const signUp = async (body: SignUpBody): Promise<SignUpResult> =>
  apiClient
    .post<SignUpResponse>(apiUrl.auth.signup(), body)
    .then((data) => data.result);

export const login = async (body: LogInBody): Promise<LogInResult> =>
  apiClient
    .post<LogInResponse>(apiUrl.auth.login(), body)
    .then((data) => data.result);

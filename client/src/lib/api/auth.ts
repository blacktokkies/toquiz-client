import type { SignUpBody, SuccessResponse } from 'shared';

import { apiUrl } from '@/lib/constants';

// TODO: 정의한 fetch 모듈로 바꿔야한다
export const signUp = async (body: SignUpBody): Promise<any> =>
  fetch(apiUrl.auth.signup(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (res) => res.json());

export const login = async (body: LoginBody): Promise<any> =>
  fetch(apiUrl.auth.login(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (res) => res.json());

// TODO: shared 패키지 절대 경로 상대 경로로 수정 후 shared 패키지에서 가져오는 것으로 바꾸어야한다
export interface LoginBody {
  username: string;
  password: string;
}
export interface LoginResult {
  nickname: string;
}
export type LoginResponse = SuccessResponse<LoginResult>;

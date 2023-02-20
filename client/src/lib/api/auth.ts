import type { SignUpBody, LogInBody } from 'shared';

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

export const login = async (body: LogInBody): Promise<any> =>
  fetch(apiUrl.auth.login(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (res) => res.json());

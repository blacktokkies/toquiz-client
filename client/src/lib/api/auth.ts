import { apiUrl } from '@/lib/constants';

// TODO: 정의한 fetch 모듈로 바꿔야한다
export const signUp = async (params: SignUpParams): Promise<any> =>
  fetch(apiUrl.auth.signup(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(async (res) => res.json());

export interface User {
  username: string;
  nickname: string;
}

export interface SignUpParams {
  username: User['username'];
  password: string;
  nickname: User['nickname'];
}

import type { UpdateMyInfoBody } from '@/lib/api/auth';

import { apiUrl } from '@/lib/api/apiUrl';

import { resign, updateMyInfo } from '../auth';

describe('auth api', () => {
  it(`updateMyInfo를 호출하면 내 정보 수정 API(${apiUrl.auth.update()})로 요청한다`, async () => {
    const body: UpdateMyInfoBody = {
      nickname: '닉네임',
    };

    const { result } = await updateMyInfo(body);

    expect(result.nickname).toBe(body.nickname);
  });

  it(`resign을 호출하면 회원 탈퇴 API(${apiUrl.auth.resign()})로 요청한다`, async () => {
    const body = {
      password: '비밀번호',
    };

    const { message } = await resign(body);

    expect(message).toBe('회원탈퇴에 성공하였습니다.');
  });
});

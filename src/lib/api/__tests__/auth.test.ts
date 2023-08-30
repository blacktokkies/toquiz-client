import type { UpdateMyInfoBody } from '@/lib/api/auth';

import { apiUrl } from '@/lib/api/apiUrl';

import { updateMyInfo } from '../auth';

describe('auth api', () => {
  it(`updateMyInfo를 호출하면 내 정보 수정 API(${apiUrl.auth.update()})로 요청한다`, async () => {
    const body: UpdateMyInfoBody = {
      nickname: '닉네임',
    };
    const { result } = await updateMyInfo(body);
    expect(result.nickname).toBe(body.nickname);
  });
});

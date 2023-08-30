import type { UpdateMyInfoBody } from '@/lib/api/auth';

import { act, renderHook, waitFor } from '@testing-library/react';

import * as authApis from '@/lib/api/auth';
import { createQueryClientWrapper } from '@/lib/test-utils';

import { useUpdateMyInfoMutation } from '../auth';

describe('auth queries', () => {
  describe('useUpdateMyInfoMutation', () => {
    it('mutate를 호출하면 updateMyInfo를 호출한다', async () => {
      const body: UpdateMyInfoBody = {
        nickname: '닉네임',
      };
      const spyOnUpdateMyInfo = vi.spyOn(authApis, 'updateMyInfo');
      const { result } = renderHook(() => useUpdateMyInfoMutation(), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.mutate(body);
      });

      await waitFor(() => {
        expect(spyOnUpdateMyInfo).toHaveBeenCalledWith(body);
      });
    });
  });
});

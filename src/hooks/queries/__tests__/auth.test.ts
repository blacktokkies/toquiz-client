import { act, renderHook, waitFor } from '@testing-library/react';

import * as authApis from '@/lib/api/auth';
import { createQueryClientWrapper } from '@/lib/test-utils';

import { useResignMutation, useUpdateMyInfoMutation } from '../auth';

describe('auth queries', () => {
  describe('useUpdateMyInfoMutation', () => {
    it('mutate를 호출하면 updateMyInfo를 호출한다', async () => {
      const { result } = renderHook(() => useUpdateMyInfoMutation(), {
        wrapper: createQueryClientWrapper(),
      });

      const spyOnUpdateMyInfo = vi.spyOn(authApis, 'updateMyInfo');
      act(() => {
        result.current.mutate({ nickname: '닉네임' });
      });

      await waitFor(() => {
        expect(spyOnUpdateMyInfo).toHaveBeenCalledWith({ nickname: '닉네임' });
      });
    });
  });

  describe('useResignMutation', () => {
    it('mutate를 호출하면 resign을 호출한다', async () => {
      const spyOnResign = vi.spyOn(authApis, 'resign');
      const { result } = renderHook(() => useResignMutation(), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.mutate({ password: '비밀번호' });
      });

      await waitFor(() => {
        expect(spyOnResign).toHaveBeenCalledWith({ password: '비밀번호' });
      });
    });
  });
});

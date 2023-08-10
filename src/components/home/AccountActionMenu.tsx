import type { CreateOverlayContentProps } from '@/hooks/useOverlay';

import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '@/hooks/queries/auth';
import { useUserStore } from '@/hooks/stores/useUserStore';
import { clearAccessToken } from '@/lib/apiClient';

type Props = CreateOverlayContentProps;

export function AccountActionMenu({ close }: Props): JSX.Element {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const user = useUserStore(({ email, nickname }) => ({
    email,
    nickname,
  }));
  const clearUser = useUserStore((state) => state.clearUser);

  return (
    <div>
      <div>{user.email}</div>
      <div>{user.nickname}</div>
      <button
        type="button"
        onClick={() => {
          navigate('/home');
        }}
      >
        내 패널 모아보기
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/account');
        }}
      >
        내 계정 관리
      </button>
      <button
        type="button"
        onClick={() => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              clearAccessToken();
              clearUser();
              navigate('/login');
            },
          });
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

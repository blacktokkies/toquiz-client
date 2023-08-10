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
            onError: () => {
              // TODO: invalid access token 나는 경우 어떻게 처리할지 생각하기
              // onSuccess랑 똑같이 하거나 아니면 토스트 메시지, 모달 띄워주기
            },
          });
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

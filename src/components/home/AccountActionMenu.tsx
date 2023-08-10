import type { CreateOverlayContentProps } from '@/hooks/useOverlay';

import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useUserStore } from '@/hooks/stores/useUserStore';

type Props = CreateOverlayContentProps;

export function AccountActionMenu({ close }: Props): JSX.Element {
  const navigate = useNavigate();

  const user = useUserStore(({ email, nickname }) => ({
    email,
    nickname,
  }));

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
    </div>
  );
}

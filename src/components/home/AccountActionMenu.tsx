import type { CreateOverlayContentProps } from '@/hooks/useOverlay';

import React from 'react';

import { useUserStore } from '@/hooks/stores/useUserStore';

type Props = CreateOverlayContentProps;

export function AccountActionMenu({ close }: Props): JSX.Element {
  const user = useUserStore(({ email, nickname }) => ({
    email,
    nickname,
  }));

  return (
    <div>
      <div>{user.email}</div>
      <div>{user.nickname}</div>
    </div>
  );
}

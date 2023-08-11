import type { CreateOverlayContentProps } from '@/hooks/useOverlay';

import React from 'react';

type Props = CreateOverlayContentProps;
export function UpdatePanelActionModal({ close }: Props): JSX.Element {
  return (
    <div className="flex flex-col p-7 gap-4">
      <h2 className="font-medium text-lg">패널 수정하기</h2>
    </div>
  );
}

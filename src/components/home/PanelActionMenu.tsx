import type { CreateOverlayContentProps } from '@/hooks/useOverlay';

import React from 'react';

type Props = CreateOverlayContentProps & {
  onUpdatePanelButtonClick: () => void;
  onDeleteButtonClick: () => void;
};

export function PanelActionMenu({
  close,
  onUpdatePanelButtonClick,
  onDeleteButtonClick,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col py-1">
        <button
          className="px-5 py-2 hover:bg-grey-lighter text-left"
          type="button"
          onClick={onUpdatePanelButtonClick}
        >
          패널 수정하기
        </button>
        <button
          className="px-5 py-2 hover:bg-grey-lighter text-left"
          type="button"
          onClick={onDeleteButtonClick}
        >
          패널 삭제하기
        </button>
      </div>
    </div>
  );
}

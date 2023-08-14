import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { useDeletePanelMutation } from '@/hooks/queries/panel';

interface Props {
  close: () => void;
  panelId: Panel['id'];
}
export function DeletePanelModal({ close, panelId }: Props): JSX.Element {
  const deletePanelMutation = useDeletePanelMutation();

  return (
    <div className="flex flex-col p-7 gap-4">
      <h1>패널 삭제하기</h1>
      <button type="button" onClick={close}>
        취소
      </button>
      <button
        type="button"
        onClick={() => {
          deletePanelMutation.mutate(panelId, {
            onSuccess: () => {
              close();
            },
          });
        }}
      >
        패널 삭제
      </button>
    </div>
  );
}

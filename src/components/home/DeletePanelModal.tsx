import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { Button } from '@/components/system/Button';
import { useDeletePanelMutation } from '@/hooks/queries/panel';

interface Props {
  close: () => void;
  panel: Panel;
}
export function DeletePanelModal({ close, panel }: Props): JSX.Element {
  const { sid, title } = panel;
  const deletePanelMutation = useDeletePanelMutation();

  return (
    <div className="flex flex-col p-7 gap-4">
      <h1 className="font-medium text-lg">패널 삭제하기</h1>
      <p>
        <span className="font-medium">{title}</span> 패널을 삭제하시겠어요?
      </p>
      <div className="flex gap-3 justify-end items-center">
        <Button type="button" onClick={close} variant="secondary">
          취소
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={() => {
            deletePanelMutation.mutate(sid, {
              onSuccess: () => {
                close();
              },
            });
          }}
        >
          패널 삭제
        </Button>
      </div>
    </div>
  );
}

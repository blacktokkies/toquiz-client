import type { MyPanelPage, Panel } from '@/lib/api/panel';
import type { InfiniteData } from '@tanstack/react-query';

import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { Button } from '@/components/system/Button';
import { useDeletePanelMutation } from '@/hooks/queries/panel';
import { queryKey } from '@/lib/queryKey';

interface Props {
  close: () => void;
  panel: Panel;
}
export function DeletePanelModal({ close, panel }: Props): JSX.Element {
  const queryClient = useQueryClient();
  const { sid, title } = panel;
  const deletePanelMutation = useDeletePanelMutation({
    onSuccess: (_, panelId) => {
      queryClient.setQueryData<InfiniteData<MyPanelPage>>(
        queryKey.panel.lists(),
        (old) =>
          produce(old, (draft) => {
            if (!draft) return;

            draft.pages.forEach((page) => {
              page.panels = page.panels.filter(
                (panel) => panel.sid !== panelId,
              );
            });
          }),
      );

      close();
    },
  });

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

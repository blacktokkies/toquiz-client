import type { MyPanelPage, Panel } from '@/lib/api/panel';
import type { InfiniteData } from '@tanstack/react-query';

import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { Button } from '@/components/system/Button';
import { useDeletePanelMutation } from '@/hooks/queries/panel';
import { queryKey } from '@/lib/queryKey';

/* eslint-disable import/no-absolute-path */
import Icons from '/icons.svg?url';

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
        removePanel(panelId),
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
        <Button
          type="button"
          onClick={close}
          variant="secondary"
          disabled={deletePanelMutation.isLoading}
        >
          취소
        </Button>
        <Button
          className="min-w-[95px]"
          variant="danger"
          type="button"
          onClick={() => {
            deletePanelMutation.mutate(sid);
          }}
          disabled={deletePanelMutation.isLoading}
        >
          {deletePanelMutation.isLoading ? (
            <>
              <svg className="animate-spin text-white mx-auto w-6 h-6">
                <use href={`${Icons}#spinner`} />
              </svg>
              <span className="sr-only">패널 삭제 중</span>
            </>
          ) : (
            '패널 삭제'
          )}
        </Button>
      </div>
    </div>
  );
}

const removePanel =
  (panelId: Panel['sid']) =>
  (prevPanels: InfiniteData<MyPanelPage> | undefined) =>
    produce(prevPanels, (draft) => {
      if (!draft) return;

      draft.pages.forEach((page) => {
        page.panels = page.panels.filter((panel) => panel.sid !== panelId);
      });
    });

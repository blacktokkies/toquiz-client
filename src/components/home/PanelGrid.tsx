/* eslint-disable react/display-name */
import type { CreateOverlayContentProps } from '@/hooks/useOverlay';
import type { Panel } from '@/lib/api/panel';
import type { GetMyPanelsResult } from '@/mocks/handlers/panel';

import React, { useCallback } from 'react';

import { PanelActionMenu } from '@/components/home/PanelActionMenu';
import { PanelItem } from '@/components/home/PanelItem';
import { UpdatePanelModal } from '@/components/home/UpdatePanelModal';
import { ModalController } from '@/components/system/ModalController';
import { Logo } from '@/components/vectors';
import { useOverlay } from '@/hooks/useOverlay';

interface Props {
  panelPages: GetMyPanelsResult[];
}

export function PanelGrid({ panelPages }: Props): JSX.Element {
  const overlay = useOverlay();

  const handleOpenUpdatePanelModal = useCallback(
    (panel: Panel) => {
      overlay.open(({ close }) => (
        <ModalController close={close}>
          <UpdatePanelModal close={close} panel={panel} />
        </ModalController>
      ));
    },
    [overlay],
  );

  const handleOpenDeletePanelModal = useCallback(
    (panel: Panel) => {
      overlay.open(({ close }) => (
        <ModalController close={close}>패널 삭제 모달</ModalController>
      ));
    },
    [overlay],
  );

  const handleOpenPanelActionMenu = useCallback(
    (panel: Panel) =>
      ({ close }: CreateOverlayContentProps) =>
        (
          <PanelActionMenu
            close={close}
            onUpdatePanelButtonClick={() => {
              handleOpenUpdatePanelModal(panel);
              close();
            }}
            onDeleteButtonClick={() => {
              handleOpenDeletePanelModal(panel);
              close();
            }}
          />
        ),
    [handleOpenUpdatePanelModal, handleOpenDeletePanelModal],
  );

  if (panelPages.length === 0)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex items-center gap-1 font-bold">
          <div className="text-lg">아직 작성한 패널이 없습니다</div>
          <Logo role="img" aria-label="로고" width="36" height="36" />
        </div>
        <div className="text-grey-dark">
          새로운 패널을 만들어 질문을 받아보세요!
        </div>
      </div>
    );

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 pb-16">
      {panelPages.map((page) =>
        page.panels.map((panel) => (
          <PanelItem
            key={panel.id}
            panel={panel}
            openActionMenu={handleOpenPanelActionMenu(panel)}
          />
        )),
      )}
    </ul>
  );
}

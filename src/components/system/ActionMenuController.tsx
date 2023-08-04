import type { CreateOverlayContent } from '@/hooks/useOverlay';

import React, { useRef } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';

export interface ActionMenuControllerOptions {
  backdrop?: boolean;
}

export function ActionMenuController({
  createActionMenuContent: ActionMenuContent,
  close,
  backdrop = true,
}: ActionMenuControllerOptions & {
  createActionMenuContent: CreateOverlayContent;
  close: () => void;
}): JSX.Element {
  const actionMenu = useRef<HTMLDivElement>(null);

  useOutsideClick(actionMenu, close);

  return (
    <>
      {backdrop && <div className="fixed inset-0 bg-backdrop" />}
      <div
        ref={actionMenu}
        role="dialog"
        className={`fixed bottom-0 left-0 w-full`}
      >
        <ActionMenuContent close={close} />
      </div>
    </>
  );
}

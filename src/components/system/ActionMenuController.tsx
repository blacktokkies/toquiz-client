import type { CreateOverlayContent } from '@/hooks/useOverlay';

import React, { useRef, useEffect } from 'react';

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

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (
        event.target instanceof Node &&
        actionMenu.current?.contains(event.target)
      )
        return;

      close();
    }

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [close]);

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

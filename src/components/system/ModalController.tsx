import type { CreateOverlayContent } from '@/hooks/useOverlay';

import React, { useRef, useEffect } from 'react';

type VerticalAlignment = 'top' | 'bottom' | 'middle';
type HorizontalAlignment = 'left' | 'right' | 'center';

export interface ModalControllerOptions {
  backdrop?: boolean;
  vertical?: VerticalAlignment;
  horizontal?: HorizontalAlignment;
}

const verticalAlignments: Record<VerticalAlignment, string> = {
  top: 'top-8',
  middle: 'top-1/2',
  bottom: 'bottom-8',
};

const horizontalAlignments: Record<HorizontalAlignment, string> = {
  left: 'left-8',
  center: 'left-1/2',
  right: 'right-8',
};

export function ModalController({
  createModalContent: ModalContent,
  close,
  backdrop = true,
  vertical = 'middle',
  horizontal = 'center',
}: ModalControllerOptions & {
  createModalContent: CreateOverlayContent;
  close: () => void;
}): JSX.Element {
  const verticalAlignment = verticalAlignments[vertical];
  const horizontalAlginment = horizontalAlignments[horizontal];
  const modal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (event.target instanceof Node && modal.current?.contains(event.target))
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
      {backdrop && <div className="fixed inset-0 bg-Modal" />}
      <div
        ref={modal}
        role="dialog"
        className={`fixed ${verticalAlignment} ${horizontalAlginment}`}
      >
        <ModalContent close={close} />
      </div>
    </>
  );
}

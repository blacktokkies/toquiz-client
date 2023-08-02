import React, { useRef, useEffect, useContext, useMemo } from 'react';

import { OverlayContext } from '@/contexts/OverlayContext';

export function useOverlay(): {
  open: (createOverlayContent: CreateOverlayContent) => void;
} {
  const context = useContext(OverlayContext);

  if (context === null)
    throw new Error(
      'Error: OverlayContext not found. Make sure you are using the OverlayProvider higher up in the component tree.',
    );

  const { mount, unmount } = context;

  useEffect(
    () => () => {
      unmount();
    },
    [unmount],
  );

  return useMemo(
    () => ({
      open: (createOverlayContent) => {
        mount(
          <OverlayController
            createOverlayContent={createOverlayContent}
            close={() => {
              unmount();
            }}
          />,
        );
      },
    }),
    [mount, unmount],
  );
}

export interface OverlayContentProps {
  close: () => void;
}

export type CreateOverlayContent = (props: OverlayContentProps) => JSX.Element;

interface OverlayControllerProps {
  createOverlayContent: CreateOverlayContent;
  close: () => void;
}

export function OverlayController({
  createOverlayContent: OverlayContent,
  close,
}: OverlayControllerProps): JSX.Element {
  const backdrop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleBackdropClick(event: MouseEvent): void {
      if (event.target !== backdrop.current) return;
      close();
    }

    window.addEventListener('mousedown', handleBackdropClick);
    return () => {
      window.removeEventListener('mousedown', handleBackdropClick);
    };
  }, [close]);

  return (
    <div
      role="dialog"
      ref={backdrop}
      className="fixed inset-0 flex justify-center items-center bg-overlay"
    >
      <OverlayContent close={close} />
    </div>
  );
}

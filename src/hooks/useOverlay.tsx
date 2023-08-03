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
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (
        event.target instanceof Node &&
        overlay.current?.contains(event.target)
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
      <div className="fixed inset-0 bg-overlay" />
      <div
        ref={overlay}
        role="dialog"
        className="fixed left-1/2 top-1/2 bg-white "
      >
        <OverlayContent close={close} />
      </div>
    </>
  );
}

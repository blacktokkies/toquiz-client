import React, { useRef, useEffect } from 'react';

export interface CreateOverlayContentProps {
  close: () => void;
}

export type CreateOverlayContent = (
  props: CreateOverlayContentProps,
) => JSX.Element;

type VerticalAlignment = 'top' | 'bottom' | 'middle';
type HorizontalAlignment = 'left' | 'right' | 'center';

export interface OverlayControllerOptions {
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

export function OverlayController({
  createOverlayContent: OverlayContent,
  close,
  backdrop = true,
  vertical = 'middle',
  horizontal = 'center',
}: OverlayControllerOptions & {
  createOverlayContent: CreateOverlayContent;
  close: () => void;
}): JSX.Element {
  const verticalAlignment = verticalAlignments[vertical];
  const horizontalAlginment = horizontalAlignments[horizontal];
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
      {backdrop && <div className="fixed inset-0 bg-overlay" />}
      <div
        ref={overlay}
        role="dialog"
        className={`fixed ${verticalAlignment} ${horizontalAlginment}`}
      >
        <OverlayContent close={close} />
      </div>
    </>
  );
}

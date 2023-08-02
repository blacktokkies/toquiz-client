import React, { useRef, useEffect } from 'react';

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

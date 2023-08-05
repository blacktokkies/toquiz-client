import type { PropsWithChildren } from 'react';

import React, { useRef } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';

export type OverlayControllerProps = {
  className?: string;
  close: () => void;
} & PropsWithChildren;

export function OverlayController({
  close,
  className = '',
  children,
}: OverlayControllerProps): JSX.Element {
  const overlay = useRef<HTMLDivElement>(null);

  useOutsideClick(overlay, close);

  return (
    <div ref={overlay} role="dialog" className={`fixed ${className}`}>
      {children}
    </div>
  );
}

import type { PropsWithChildren } from 'react';

import React, { useRef } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';

export interface OverlayControllerProps {
  className?: string;
  close: () => void;
}

export function OverlayController({
  close,
  className = '',
  children,
}: OverlayControllerProps & PropsWithChildren): JSX.Element {
  const overlay = useRef<HTMLDivElement>(null);

  useOutsideClick(overlay, close);

  return (
    <div ref={overlay} role="dialog" className={`fixed ${className}`}>
      {children}
    </div>
  );
}

import type { PropsWithChildren } from 'react';

import React, { useRef } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';

export type OverlayControllerProps = {
  className?: string;
  style?: React.CSSProperties;
  close: () => void;
} & PropsWithChildren;

export function OverlayController({
  close,
  className = '',
  style = undefined,
  children,
}: OverlayControllerProps): JSX.Element {
  const overlay = useRef<HTMLDivElement>(null);

  useOutsideClick(overlay, close);

  return (
    <div
      ref={overlay}
      role="dialog"
      className={`fixed ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

import type { HTMLAttributes } from 'react';

import React, { useRef } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';

type SheetType = 'bottom' | 'top' | 'left' | 'right';

interface Props extends HTMLAttributes<HTMLDivElement> {
  type?: SheetType;
  close: () => void;
}

const sheetStyles: Record<SheetType, string> = {
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
  left: 'top-0 left-0 h-full',
  right: 'top-0 right-0 h-full',
};

export function SheetController({
  type = 'bottom',
  close,
  children,
  className = '',
  ...rest
}: Props): JSX.Element {
  const sheetStyle = sheetStyles[type];

  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, close);

  return (
    <>
      <div className="fixed z-10 inset-0 bg-backdrop" />
      <div
        ref={ref}
        role="complementary"
        className={`fixed z-10 bg-white shadow-3xl ${sheetStyle} ${className}`}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}

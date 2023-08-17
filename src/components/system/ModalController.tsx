import type { HTMLAttributes } from 'react';

import React, { useRef } from 'react';

import { clsx } from 'clsx';

import { useOutsideClick } from '@/hooks/useOutsideClick';

type VerticalAlignment = 'top' | 'bottom' | 'middle';
type HorizontalAlignment = 'left' | 'right' | 'center';

interface Props extends HTMLAttributes<HTMLDivElement> {
  vertical?: VerticalAlignment;
  horizontal?: HorizontalAlignment;
  close: () => void;
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
  vertical = 'middle',
  horizontal = 'center',
  close,
  className,
  children,
  ...rest
}: Props): JSX.Element {
  const verticalAlignment = verticalAlignments[vertical];
  const horizontalAlginment = horizontalAlignments[horizontal];

  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, close);
  return (
    <>
      <div className="fixed z-10 inset-0 bg-backdrop" />
      <div
        ref={ref}
        role="dialog"
        className={clsx(
          `fixed z-10 ${verticalAlignment} ${horizontalAlginment} w-11/12 max-w-xl`,
          {
            '-translate-x-1/2 -translate-y-1/2': horizontal === 'center',
          },
          'bg-white shadow-3xl rounded-lg',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}

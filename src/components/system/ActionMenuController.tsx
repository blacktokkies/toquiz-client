import type { HTMLAttributes } from 'react';

import React, { useRef } from 'react';

import { clsx } from 'clsx';

import { useOutsideClick } from '@/hooks/useOutsideClick';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  close: () => void;
}

export function ActionMenuController({
  close,
  style,
  children,
  ...rest
}: Props): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, close);

  return (
    <>
      <div className="z-10 fixed inset-0 bg-backdrop md:inset-full" />
      <div
        ref={ref}
        role="dialog"
        className={clsx(
          'z-10 fixed bottom-0 left-0 w-full',
          'md:absolute md:bottom-auto md:left-auto md:w-auto md:right-0 md:min-w-[200px]',
          'border border-grey-light bg-white shadow-md',
        )}
        style={style}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}

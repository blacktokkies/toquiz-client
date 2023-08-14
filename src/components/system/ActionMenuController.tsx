import type { HTMLAttributes } from 'react';

import React, { useRef } from 'react';

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
      <div className="fixed inset-0 bg-backdrop" />
      <div
        ref={ref}
        role="dialog"
        className="absolute right-0 min-w-[200px] border border-grey-light bg-white shadow-md"
        style={style}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}

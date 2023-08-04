import type { OverlayControllerProps } from '@/components/system/OverlayController';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Backdrop } from '@/components/system/Backdrop';
import { OverlayController } from '@/components/system/OverlayController';

type SheetType = 'bottom' | 'top' | 'left' | 'right';

interface Props {
  backdrop?: boolean;
  type?: SheetType;
}

const sheetStyles: Record<SheetType, string> = {
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
  left: 'top-0 left-0 h-full',
  right: 'top-0 right-0 h-full',
};

export function SheetController({
  close,
  backdrop = true,
  type = 'bottom',
  children,
}: Props &
  Omit<OverlayControllerProps, 'className'> &
  PropsWithChildren): JSX.Element {
  const sheetStyle = sheetStyles[type];

  return (
    <>
      {backdrop && <Backdrop />}
      <OverlayController className={`${sheetStyle}`} close={close}>
        {children}
      </OverlayController>
    </>
  );
}

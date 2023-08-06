import type { OverlayControllerProps } from '@/components/system/OverlayController';

import React from 'react';

import { Backdrop } from '@/components/system/Backdrop';
import { OverlayController } from '@/components/system/OverlayController';

export interface Props {
  backdrop?: boolean;
}

export function ActionMenuController({
  backdrop = false,
  style,
  close,
  children,
}: Props & Omit<OverlayControllerProps, 'className'>): JSX.Element {
  return (
    <>
      {backdrop && <Backdrop />}
      <OverlayController
        className="absolute bg-white shadow-md"
        style={style}
        close={close}
      >
        {children}
      </OverlayController>
    </>
  );
}

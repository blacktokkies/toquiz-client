import type { OverlayControllerProps } from '@/components/system/OverlayController';

import React from 'react';

import { Backdrop } from '@/components/system/Backdrop';
import { OverlayController } from '@/components/system/OverlayController';

export interface Props {
  backdrop?: boolean;
}

export function ActionMenuController({
  backdrop = false,
  ariaLabel = undefined,
  style,
  close,
  children,
}: Props & Omit<OverlayControllerProps, 'className'>): JSX.Element {
  return (
    <>
      {backdrop && <Backdrop />}
      <OverlayController
        ariaLabel={ariaLabel}
        className="absolute bg-white shadow-md right-0"
        style={style}
        close={close}
      >
        {children}
      </OverlayController>
    </>
  );
}

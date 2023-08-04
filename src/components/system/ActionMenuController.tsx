import type { OverlayControllerProps } from '@/components/system/OverlayController';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Backdrop } from '@/components/system/Backdrop';
import { OverlayController } from '@/components/system/OverlayController';

export interface Props {
  backdrop?: boolean;
}

export function ActionMenuController({
  backdrop = false,
  children,
  close,
}: Props &
  Omit<OverlayControllerProps, 'className'> &
  PropsWithChildren): JSX.Element {
  return (
    <>
      {backdrop && <Backdrop />}
      <OverlayController className={`bottom-0 left-0 w-full`} close={close}>
        {children}
      </OverlayController>
    </>
  );
}

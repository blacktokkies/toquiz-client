import type { OverlayControllerProps } from '@/components/system/OverlayController';

import React from 'react';

import { OverlayController } from '@/components/system/OverlayController';

export function ActionMenuController({
  ariaLabel = undefined,
  style,
  close,
  children,
}: Omit<OverlayControllerProps, 'className'>): JSX.Element {
  return (
    <>
      <div className="fixed inset-0 bg-backdrop" />
      <OverlayController
        ariaLabel={ariaLabel}
        className="absolute bg-white shadow-md right-0 min-w-[200px] border border-grey-light"
        style={style}
        close={close}
      >
        {children}
      </OverlayController>
    </>
  );
}

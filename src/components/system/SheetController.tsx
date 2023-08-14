import type { OverlayControllerProps } from '@/components/system/OverlayController';

import React from 'react';

import { OverlayController } from '@/components/system/OverlayController';

type SheetType = 'bottom' | 'top' | 'left' | 'right';

interface Props {
  type?: SheetType;
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
}: Props & Omit<OverlayControllerProps, 'className' | 'style'>): JSX.Element {
  const sheetStyle = sheetStyles[type];

  return (
    <>
      <div className="fixed inset-0 bg-backdrop" />
      <OverlayController className={`fixed ${sheetStyle}`} close={close}>
        {children}
      </OverlayController>
    </>
  );
}

import type { OverlayControllerProps } from '@/components/system/OverlayController';

import React from 'react';

import { clsx } from 'clsx';

import { OverlayController } from '@/components/system/OverlayController';

type VerticalAlignment = 'top' | 'bottom' | 'middle';
type HorizontalAlignment = 'left' | 'right' | 'center';

interface Props {
  vertical?: VerticalAlignment;
  horizontal?: HorizontalAlignment;
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
  ariaLabel = '',
  close,
  children,
}: Props & Omit<OverlayControllerProps, 'className' | 'style'>): JSX.Element {
  const verticalAlignment = verticalAlignments[vertical];
  const horizontalAlginment = horizontalAlignments[horizontal];

  return (
    <>
      <div className="fixed inset-0 bg-backdrop" />
      <OverlayController
        className={clsx(
          `fixed ${verticalAlignment} ${horizontalAlginment} w-11/12 max-w-xl`,
          {
            '-translate-x-1/2 -translate-y-1/2': horizontal === 'center',
          },
          'bg-white shadow-3xl rounded-lg',
        )}
        close={close}
        ariaLabel={ariaLabel}
      >
        {children}
      </OverlayController>
    </>
  );
}

import type { OverlayControllerProps } from '@/components/system/OverlayController';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { clsx } from 'clsx';

import { Backdrop } from '@/components/system/Backdrop';
import { OverlayController } from '@/components/system/OverlayController';

type VerticalAlignment = 'top' | 'bottom' | 'middle';
type HorizontalAlignment = 'left' | 'right' | 'center';

interface Props {
  backdrop?: boolean;
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
  close,
  backdrop = true,
  vertical = 'middle',
  horizontal = 'center',
  children,
}: Props &
  Omit<OverlayControllerProps, 'className'> &
  PropsWithChildren): JSX.Element {
  const verticalAlignment = verticalAlignments[vertical];
  const horizontalAlginment = horizontalAlignments[horizontal];

  return (
    <>
      {backdrop && <Backdrop />}
      <OverlayController
        className={clsx(
          `${verticalAlignment} ${horizontalAlginment} w-11/12 bg-white shadow-md rounded-sm`,
          {
            '-translate-x-1/2 -translate-y-1/2': horizontal === 'center',
          },
        )}
        close={close}
      >
        {children}
      </OverlayController>
    </>
  );
}

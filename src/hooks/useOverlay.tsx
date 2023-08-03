import type {
  CreateOverlayContent,
  OverlayControllerOptions,
} from '@/components/system/OverlayController';

import React, { useEffect, useContext, useMemo } from 'react';

import { OverlayController } from '@/components/system/OverlayController';
import { OverlayContext } from '@/contexts/OverlayContext';

export function useOverlay(): {
  open: (
    createOverlayContent: CreateOverlayContent,
    options?: OverlayControllerOptions,
  ) => void;
} {
  const context = useContext(OverlayContext);

  if (context === null)
    throw new Error(
      'Error: OverlayContext not found. Make sure you are using the OverlayProvider higher up in the component tree.',
    );

  const { mount, unmount } = context;

  useEffect(
    () => () => {
      unmount();
    },
    [unmount],
  );

  return useMemo(
    () => ({
      open: (createOverlayContent, options) => {
        mount(
          <OverlayController
            createOverlayContent={createOverlayContent}
            close={() => {
              unmount();
            }}
            {...options}
          />,
        );
      },
    }),
    [mount, unmount],
  );
}

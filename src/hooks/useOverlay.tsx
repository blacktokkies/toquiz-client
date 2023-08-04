import type {
  CreateModalContent,
  ModalControllerOptions,
} from '@/components/system/ModalController';

import React, { useEffect, useContext, useMemo } from 'react';

import { ModalController } from '@/components/system/ModalController';
import { OverlayContext } from '@/contexts/OverlayContext';

export function useOverlay(): {
  open: (
    createModalContent: CreateModalContent,
    options?: ModalControllerOptions,
  ) => void;
} {
  const context = useContext(OverlayContext);

  if (context === null)
    throw new Error(
      'Error: OverlayContext not found. Make sure you are using the ModalProvider higher up in the component tree.',
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
      open: (createModalContent, options) => {
        mount(
          <ModalController
            createModalContent={createModalContent}
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

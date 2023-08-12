import React, { useEffect, useContext, useMemo } from 'react';

import { OverlayContext } from '@/contexts/OverlayContext';

export interface CreateOverlayContentProps {
  close: () => void;
}

export type CreateOverlayContent = (
  props: CreateOverlayContentProps,
) => JSX.Element;

export function useOverlay(): {
  open: (createOverlayContent: CreateOverlayContent) => void;
  close: () => void;
} {
  const context = useContext(OverlayContext);

  if (context === null)
    throw new Error(
      'Error: OverlayContext not found. Use OverlayProvider higher up in the component tree',
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
      open: (OverlayContent) => {
        mount(
          <OverlayContent
            close={() => {
              unmount();
            }}
          />,
        );
      },
      close: () => {
        unmount();
      },
    }),
    [mount, unmount],
  );
}

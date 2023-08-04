import React, { useEffect, useContext, useMemo } from 'react';

import { OverlayContext } from '@/contexts/OverlayContext';

export interface CreateOveralyContentProps {
  close: () => void;
}

export type CreateOveralyContent = (
  props: CreateOveralyContentProps,
) => JSX.Element;

export function useOverlay(): {
  open: (createOveralyContent: CreateOveralyContent) => void;
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
      open: (CreateOveralyContent) => {
        mount(<CreateOveralyContent close={unmount} />);
      },
    }),
    [mount, unmount],
  );
}

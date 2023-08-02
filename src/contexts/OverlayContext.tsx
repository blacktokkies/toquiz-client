import type { ReactNode, PropsWithChildren } from 'react';

import React, { createContext, useState, useCallback, useMemo } from 'react';

export const OverlayContext = createContext<{
  mount: (element: ReactNode) => void;
  unmount: () => void;
} | null>(null);

export function OverlayProvider({ children }: PropsWithChildren): JSX.Element {
  const [overlayContent, setOverlayContent] = useState<ReactNode | null>(null);

  const mount = useCallback((element: ReactNode) => {
    setOverlayContent(element);
  }, []);
  const unmount = useCallback(() => {
    setOverlayContent(null);
  }, []);
  const context = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <OverlayContext.Provider value={context}>
      {children}
      {overlayContent}
    </OverlayContext.Provider>
  );
}

import type { CreateOverlayContent } from '@/hooks/useOverlay';

import React, { useState, useRef, useCallback } from 'react';

import { ActionMenuController } from '@/components/system/ActionMenuController';
import { useInsideClick } from '@/hooks/useInsideClick';

interface Props {
  open: CreateOverlayContent;
}
export function OpenActionMenuArea({
  open: ActionMenu,
  children,
}: Props & React.PropsWithChildren): JSX.Element {
  const area = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleActionMenuOpen = useCallback(
    (event: MouseEvent) => {
      if (
        !(event.target instanceof Node) ||
        (open && area.current?.lastChild?.contains(event.target))
      )
        return;
      setOpen(!open);
    },
    [open],
  );

  useInsideClick(area, handleActionMenuOpen);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div ref={area} className="relative">
      {children}
      {open && (
        <ActionMenuController close={handleClose}>
          <ActionMenu close={handleClose} />
        </ActionMenuController>
      )}
    </div>
  );
}

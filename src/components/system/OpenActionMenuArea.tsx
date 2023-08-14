import type { Props as ActionMenuControllerPrpos } from '@/components/system/ActionMenuController';
import type { CreateOverlayContent } from '@/hooks/useOverlay';

import React, { useState, useRef, useCallback } from 'react';

import { ActionMenuController } from '@/components/system/ActionMenuController';
import { useInsideClick } from '@/hooks/useInsideClick';

interface Props extends Omit<ActionMenuControllerPrpos, 'close'> {
  open: CreateOverlayContent;
}
export function OpenActionMenuArea({
  open: ActionMenu,
  children,
  ...rest
}: Props): JSX.Element {
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
        <ActionMenuController close={handleClose} {...rest}>
          <ActionMenu close={handleClose} />
        </ActionMenuController>
      )}
    </div>
  );
}

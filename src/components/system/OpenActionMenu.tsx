import type { CreateOverlayContent } from '@/hooks/useOverlay';

import React, { useState, useRef, useEffect } from 'react';

import { ActionMenuController } from '@/components/system/ActionMenuController';

interface Props {
  open: CreateOverlayContent;
}
export function OpenActionMenu({
  open: CreateActionMenuContent,
  children,
}: Props & React.PropsWithChildren): JSX.Element {
  const [open, setOpen] = useState(false);
  const area = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent): void {
      if (!(event.target instanceof Node) || area.current === null) return;

      if (
        !area.current.contains(event.target) ||
        (open && area.current.lastChild?.contains(event.target))
      )
        return;

      setOpen(!open);
    }

    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  return (
    <div ref={area} className="relative">
      {children}
      {open && (
        <ActionMenuController
          close={() => {
            setOpen(false);
          }}
        >
          <CreateActionMenuContent
            close={() => {
              setOpen(false);
            }}
          />
        </ActionMenuController>
      )}
    </div>
  );
}

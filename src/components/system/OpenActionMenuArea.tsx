import type { HTMLAttributes } from 'react';

import React, { useState, useRef, useEffect, useCallback } from 'react';

import { clsx } from 'clsx';

export interface CreateActionMenuProps {
  close: () => void;
}
export type CreateActionMenu = (props: CreateActionMenuProps) => JSX.Element;

interface Props extends HTMLAttributes<HTMLDivElement> {
  open: CreateActionMenu;
}
export function OpenActionMenuArea({
  open: ActionMenu,
  children,
  ...rest
}: Props): JSX.Element {
  const area = useRef<HTMLDivElement | null>(null);
  const menu = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleActionMenuClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    function handleAreaClick(event: MouseEvent): void {
      // 클릭 대상이 액션 메뉴라면 아무것도 하지 않는다
      if (
        !(event.target instanceof Node) ||
        menu.current?.contains(event.target)
      )
        return;

      // 클릭 대상이 영역 내부라면 액션 메뉴를 토글한다
      if (area.current?.contains(event.target)) setOpen((open) => !open);
      // 클릭 대상이 영역 내부가 아니라면 액션 메뉴를 닫는다
      else setOpen(false);
    }

    window.addEventListener('mousedown', handleAreaClick);

    return () => {
      window.removeEventListener('mousedown', handleAreaClick);
    };
  }, []);

  return (
    <div ref={area} className="relative">
      {children}
      {open && (
        <>
          <div className="z-10 fixed inset-0 bg-backdrop md:inset-full" />
          <div
            ref={(node) => {
              menu.current = node;
            }}
            role="dialog"
            className={clsx(
              'z-10 fixed bottom-0 left-0 w-full',
              'md:absolute md:bottom-auto md:left-auto md:w-auto md:right-0 md:min-w-[200px]',
              'border border-grey-light bg-white shadow-md',
            )}
            {...rest}
          >
            <ActionMenu close={handleActionMenuClose} />
          </div>
        </>
      )}
    </div>
  );
}

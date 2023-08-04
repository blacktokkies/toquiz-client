import type React from 'react';

import { useEffect } from 'react';

export const useOutsideClick = (
  target: React.RefObject<HTMLElement>,
  onOutsideClick: (event?: MouseEvent) => void,
): void => {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (
        event.target instanceof Node &&
        target.current?.contains(event.target)
      )
        return;

      onOutsideClick(event);
    }

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onOutsideClick, target]);
};

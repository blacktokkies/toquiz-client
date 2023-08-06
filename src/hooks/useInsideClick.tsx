import type React from 'react';

import { useEffect } from 'react';

export const useInsideClick = (
  target: React.RefObject<HTMLElement>,
  onInsideClick: (event: MouseEvent) => void,
): void => {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (
        event.target instanceof Node &&
        !target.current?.contains(event.target)
      )
        return;

      onInsideClick(event);
    }

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onInsideClick, target]);
};

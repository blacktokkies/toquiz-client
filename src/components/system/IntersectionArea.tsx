import type { PropsWithChildren } from 'react';

import React, { useEffect, useRef } from 'react';

interface Props {
  onIntersection: (isIntersecting: boolean) => void;
}

export function IntersectionArea({
  children,
  onIntersection,
}: Props & PropsWithChildren): JSX.Element {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (targetRef.current === null) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.length) onIntersection(entries[0].isIntersecting);
    });

    observer.observe(targetRef.current);
    return () => {
      observer.disconnect();
    };
  }, [onIntersection]);

  return <div ref={targetRef}>{children}</div>;
}

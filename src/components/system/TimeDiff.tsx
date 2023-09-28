import type { HTMLAttributes } from 'react';

import React from 'react';

import { useCurrentDate } from '@/hooks/useCurrentDate';
import { formatDistance } from '@/lib/format-date';

interface Props extends HTMLAttributes<HTMLDivElement> {
  base: Date;
  target: Date;
}

export function TimeDiff({ base, target, ...rest }: Props): JSX.Element {
  const now = useCurrentDate({ start: base });
  return <div {...rest}>{formatDistance(now, target)}</div>;
}

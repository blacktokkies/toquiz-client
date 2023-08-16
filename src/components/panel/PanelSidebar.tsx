import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { formatDateString } from '../home/PanelItem';

interface Props {
  panel: Panel;
}
export function PanelSidebar({ panel }: Props): JSX.Element {
  const { title, author, createdAt } = panel;
  return (
    <div>
      <div>{title}</div>
      <div>{author}</div>
      <div>{formatDateString(createdAt)}</div>
    </div>
  );
}

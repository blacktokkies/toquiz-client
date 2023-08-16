import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { formatDateString } from '../home/PanelItem';

interface Props {
  panel: Panel;
}
export function PanelSidebar({ panel }: Props): JSX.Element {
  const { id, title, author, createdAt } = panel;
  return (
    <div>
      <div>{title}</div>
      <div>{author}</div>
      <div>{formatDateString(createdAt)}</div>
      <button
        type="button"
        onClick={() => {
          window.navigator.clipboard.writeText(
            `${window.location.origin}/panel/${id}`,
          );
        }}
      >
        패널 URL 복사하기
      </button>
    </div>
  );
}

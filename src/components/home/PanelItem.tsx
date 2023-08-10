import type { Panel } from '@/lib/api/panel';

import React from 'react';

interface PanelItemProps {
  panel: Panel;
}

export const PanelItem = ({ panel }: PanelItemProps): JSX.Element => {
  const { id, title, createdAt } = panel;

  return (
    <li
      key={id}
      className="shadow-item hover:shadow-item-hover rounded-md bg-white py-4 px-5"
    >
      <div className="flex flex-col gap-1 tracking-tight">
        <div className="text-primary-dark truncate text-base font-bold">
          {title}
        </div>
        <span className="text-grey-dark text-sm">
          {formatDateString(createdAt)}
        </span>
      </div>
    </li>
  );
};

export const formatDateString = (date: string): string =>
  new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

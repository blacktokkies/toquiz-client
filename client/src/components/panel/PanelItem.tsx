import type { Panel } from '@/lib/api/panel';

import React from 'react';

interface PanelItemProps {
  panel: Panel;
}

const PanelItem = ({ panel }: PanelItemProps): JSX.Element => (
  <li
    key={panel.id}
    className="shadow-item hover:shadow-item-hover rounded-md bg-white py-4 px-5"
  >
    <div className="flex flex-col gap-1 tracking-tight">
      <div className="text-primary-dark truncate text-base font-bold">
        {panel.title}
      </div>
      <span className="text-grey-dark text-sm">
        {new Date(panel.createdAt).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </div>
  </li>
);

export default PanelItem;

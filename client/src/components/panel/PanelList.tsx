import type { Panel } from 'shared';

import React from 'react';

interface PanelListProps {
  panels: Panel[];
}

const List = ({ panels }: PanelListProps): JSX.Element => (
  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    {panels.map((panel) => (
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
    ))}
  </ul>
);

export default List;

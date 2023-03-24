import type { Panel } from 'shared';

import React from 'react';

interface PanelListProps {
  panels: Panel[];
}

const List = ({ panels }: PanelListProps): JSX.Element => (
  <ul>
    {panels.map((panel) => (
      <li key={panel.id}>
        <span>{panel.title}</span>
        <span>{panel.createdAt.toString()}</span>
      </li>
    ))}
  </ul>
);

export default List;

import type { GetMyPanelsResult } from '@/mocks/handlers/panel';

import React from 'react';

import { PanelItem } from '@/components/home/PanelItem';

interface Props {
  panelPages: GetMyPanelsResult[];
}

export function PanelGrid({ panelPages }: Props): JSX.Element {
  if (panelPages.length === 0) return <div>아직 작성한 패널이 없습니다</div>;

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 pb-16">
      {panelPages.map((page) =>
        page.panels.map((panel) => <PanelItem key={panel.id} panel={panel} />),
      )}
    </ul>
  );
}

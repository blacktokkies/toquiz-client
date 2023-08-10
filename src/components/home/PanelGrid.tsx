import type { GetMyPanelsResult } from '@/mocks/handlers/panel';

import React from 'react';

import { PanelItem } from '@/components/home/PanelItem';

import { Logo } from '../vectors';

interface Props {
  panelPages: GetMyPanelsResult[];
}

export function PanelGrid({ panelPages }: Props): JSX.Element {
  if (panelPages.length === 0)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex items-center gap-1 font-bold">
          <div className="text-lg">아직 작성한 패널이 없습니다</div>
          <Logo role="img" aria-label="로고" width="36" height="36" />
        </div>
        <div className="text-grey-dark">
          새로운 패널을 만들어 질문을 받아보세요!
        </div>
      </div>
    );

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 pb-16">
      {panelPages.map((page) =>
        page.panels.map((panel) => <PanelItem key={panel.id} panel={panel} />),
      )}
    </ul>
  );
}

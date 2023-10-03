import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';
import { OpenActionMenuArea } from '@/components/system/OpenActionMenuArea';
import { SheetController } from '@/components/system/SheetController';
import { useOverlay } from '@/hooks/useOverlay';

/* eslint-disable import/no-absolute-path */
import Icons from '/icons.svg?url';

import { PanelSidebar } from './PanelSidebar';

interface Props {
  panel: Panel;
}
export function PanelHeader({ panel }: Props): JSX.Element {
  const overlay = useOverlay();

  function handleMenuButtonClick(): void {
    overlay.open(({ close }) => (
      <SheetController aria-label="메뉴" close={close} type="left">
        <PanelSidebar panel={panel} />
      </SheetController>
    ));
  }

  return (
    <header className="bg-primary-dark shadow-md">
      <div className="container flex justify-between items-center gap-3 max-w-7xl px-5 h-16">
        <button
          type="button"
          className="rounded-full p-2"
          onClick={handleMenuButtonClick}
        >
          <svg className="w-6 h-6 text-wihte">
            <use href={`${Icons}#menu`} />
          </svg>
          <div className="sr-only">메뉴 열기</div>
        </button>
        <h1 className="text-white truncate">{panel.title}</h1>
        <OpenActionMenuArea
          aria-label="내 계정 액션 메뉴"
          open={({ close }) => <AccountActionMenu close={close} />}
        >
          <button type="button" className="rounded-full p-2">
            <svg className="w-6 h-6 text-white">
              <use href={`${Icons}#account`} />
            </svg>
            <div className="sr-only">내 계정 아이콘</div>
          </button>
        </OpenActionMenuArea>
      </div>
    </header>
  );
}

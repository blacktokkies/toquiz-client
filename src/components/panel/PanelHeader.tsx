import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';
import { OpenActionMenuArea } from '@/components/system/OpenActionMenuArea';
import { SheetController } from '@/components/system/SheetController';
import { Account, Menu } from '@/components/vectors';
import { useOverlay } from '@/hooks/useOverlay';

interface Props {
  panel: Panel;
}
export function PanelHeader({ panel }: Props): JSX.Element {
  const overlay = useOverlay();

  function handleMenuButtonClick(): void {
    overlay.open(({ close }) => (
      <SheetController aria-label="메뉴" close={close}>
        메뉴
      </SheetController>
    ));
  }
  return (
    <header>
      <button
        type="button"
        className="hover:bg-grey-light rounded-full p-2"
        aria-label="메뉴 열기"
        onClick={handleMenuButtonClick}
      >
        <div role="img" aria-label="메뉴 아이콘">
          <Menu className="fill-grey-darkest" />
        </div>
      </button>
      <h1>{panel.title}</h1>
      <OpenActionMenuArea
        aria-label="내 계정 액션 메뉴"
        open={({ close }) => <AccountActionMenu close={close} />}
      >
        <button
          type="button"
          className="hover:bg-grey-light rounded-full p-2"
          aria-label="내 계정 아이콘"
        >
          <div role="img" aria-label="내 계정 아이콘">
            <Account className="fill-grey-darkest" />
          </div>
        </button>
      </OpenActionMenuArea>
    </header>
  );
}

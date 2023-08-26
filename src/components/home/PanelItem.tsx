import type { CreateOverlayContent } from '@/hooks/useOverlay';
import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { clsx } from 'clsx';

import { OpenActionMenuArea } from '@/components/system/OpenActionMenuArea';
import { More } from '@/components/vectors/More';
import { formatToKRLocaleString } from '@/lib/format-date';

interface Props {
  panel: Panel;
  openActionMenu: CreateOverlayContent;
  onPanelTitleClick: () => void;
}

export const PanelItem = ({
  panel,
  openActionMenu,
  onPanelTitleClick,
}: Props): JSX.Element => {
  const { id, title, createdAt, description } = panel;

  return (
    <li
      key={id}
      className="flex flex-col gap-6 tracking-tight rounded-md bg-white py-4 px-5 border border-grey-light"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onPanelTitleClick}
            className={clsx(
              'text-primary-dark text-base font-bold text-start',
              'focus:underline focus:text-primary hover:underline hover:text-primary',
            )}
          >
            {title}
          </button>
          <span className="text-grey-dark text-sm">
            {formatToKRLocaleString(createdAt)}
          </span>
        </div>
        <OpenActionMenuArea aria-label="패널 액션 메뉴" open={openActionMenu}>
          <button type="button" aria-label="더보기">
            <div
              role="img"
              aria-label="더보기 아이콘"
              className="fill-grey-dark"
            >
              <More />
            </div>
          </button>
        </OpenActionMenuArea>
      </div>
      <span className="text-grey-dark text-sm truncate hover:whitespace-normal">
        {description}
      </span>
    </li>
  );
};

import type { CreateOverlayContent } from '@/hooks/useOverlay';
import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { OpenActionMenuArea } from '@/components/system/OpenActionMenuArea';
import { More } from '@/components/vectors/More';

interface Props {
  panel: Panel;
  openActionMenu: CreateOverlayContent;
}

export const PanelItem = ({ panel, openActionMenu }: Props): JSX.Element => {
  const { id, title, createdAt, description } = panel;

  return (
    <li
      key={id}
      className="flex flex-col gap-6 tracking-tight shadow-item hover:shadow-item-hover rounded-md bg-white py-4 px-5"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-primary-dark text-base font-bold">{title}</div>
          <span className="text-grey-dark text-sm">
            {formatDateString(createdAt)}
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

export const formatDateString = (date: string): string =>
  new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

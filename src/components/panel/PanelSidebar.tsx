import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { Clipboard } from '@/components/vectors';

import { formatDateString } from '../home/PanelItem';

interface Props {
  panel: Panel;
}
export function PanelSidebar({ panel }: Props): JSX.Element {
  const { id, title, author, createdAt } = panel;
  return (
    <div className="flex flex-col justify-start w-[280px] divide-y divide-grey-light">
      <div className="flex gap-4 p-5">
        <span className="w-1 bg-primary" />
        <div className="flex flex-col justify-start items-start">
          <h2 className="text-grey-dark font-medium">{title}</h2>
          <div className="text-grey-dark text-sm">{author}</div>
          <div className="text-grey-dark text-sm">
            {formatDateString(createdAt)}
          </div>
        </div>
      </div>
      <div className="flex flex-col py-2">
        <button
          className="flex gap-2 justify-start items-center py-[10px] px-5 hover:bg-grey-lighter"
          type="button"
          onClick={() => {
            window.navigator.clipboard.writeText(
              `${window.location.origin}/panel/${id}`,
            );
          }}
        >
          <div role="img" aria-label="메뉴 아이콘">
            <Clipboard className="fill-grey-dark" />
          </div>
          <div>패널 URL 복사하기</div>
        </button>
      </div>
    </div>
  );
}
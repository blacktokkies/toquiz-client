import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { formatToKRLocaleString } from '@/lib/format-date';

/* eslint-disable import/no-absolute-path */
import Icons from '/icons.svg?url';

interface Props {
  panel: Panel;
}
export function PanelSidebar({ panel }: Props): JSX.Element {
  const { sid, title, createdAt, description } = panel;
  return (
    <div className="flex flex-col justify-start w-[280px] divide-y divide-grey-light">
      <div className="flex gap-4 p-5">
        <span className="w-1 bg-primary" />
        <div className="flex flex-col justify-start items-start">
          <h2 className="font-medium">{title}</h2>
          <div className="text-grey-dark text-sm">
            {formatToKRLocaleString(createdAt)}
          </div>
          <div className="text-grey-dark text-sm mt-3">{description}</div>
        </div>
      </div>
      <div className="flex flex-col py-2">
        <button
          className="flex gap-2 justify-start items-center py-[10px] px-5 hover:bg-grey-lighter"
          type="button"
          onClick={() => {
            window.navigator.clipboard.writeText(
              `${window.location.origin}/panel/${sid}`,
            );
          }}
        >
          <svg className="w-6 h-6 text-grey-dark">
            <use href={`${Icons}#clipboard`} />
          </svg>
          <div>패널 URL 복사하기</div>
        </button>
      </div>
    </div>
  );
}

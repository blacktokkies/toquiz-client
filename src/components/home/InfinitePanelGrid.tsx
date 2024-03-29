import React, { useCallback } from 'react';

import { clsx } from 'clsx';

import { CreatePanelModal } from '@/components/home/CreatePanelModal';
import { PanelGrid } from '@/components/home/PanelGrid';
import { IntersectionArea } from '@/components/system/IntersectionArea';
import { ModalController } from '@/components/system/ModalController';
import { useMyPanelsInfiniteQuery } from '@/hooks/queries/panel';
import { useOverlay } from '@/hooks/useOverlay';

/* eslint-disable import/no-absolute-path */
import Icons from '/icons.svg?url';

export const InfinitePanelGrid = (): JSX.Element => {
  const panelsQuery = useMyPanelsInfiniteQuery();
  const overlay = useOverlay();

  const fetchPanels = useCallback(
    (isIntersecting: boolean) => {
      if (
        isIntersecting &&
        !panelsQuery.isFetchingNextPage &&
        panelsQuery.hasNextPage
      )
        panelsQuery.fetchNextPage();
    },
    [panelsQuery],
  );

  function handleClick(): void {
    overlay.open(({ close }) => (
      <ModalController close={close} aria-label="패널 생성 모달">
        <CreatePanelModal close={close} />
      </ModalController>
    ));
  }

  // TODO: fallback UI 작성하기
  if (panelsQuery.isLoading) return <div>loading...</div>;
  if (panelsQuery.isError) return <div>error occurred</div>;

  return (
    <div className="h-full p-5">
      <PanelGrid panelPages={panelsQuery.data.pages} />
      <IntersectionArea onIntersection={fetchPanels} />
      <button
        className={clsx(
          'fixed bottom-0 right-0 m-8',
          'rounded-full bg-primary border-solid border-4 border-white drop-shadow-xl',
          'hover:bg-primary-hover focus:bg-primary-hover',
        )}
        type="button"
        onClick={handleClick}
      >
        <svg className="text-white w-12 h-12">
          <use href={`${Icons}#add`} />
        </svg>
        <span className="sr-only">패널 생성 아이콘</span>
      </button>
    </div>
  );
};

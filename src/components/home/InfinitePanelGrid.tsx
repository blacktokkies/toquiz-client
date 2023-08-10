import React, { useCallback } from 'react';

import { PanelGrid } from '@/components/home/PanelGrid';
import { IntersectionArea } from '@/components/system/IntersectionArea';
import { useMyPanelsInfiniteQuery } from '@/hooks/queries/panel';
import { useOverlay } from '@/hooks/useOverlay';

import { ModalController } from '../system/ModalController';

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
      <ModalController close={close} ariaLabel="패널 생성 모달">
        <div>패널 생성 모달</div>
      </ModalController>
    ));
  }

  if (panelsQuery.isLoading) return <div>loading...</div>;
  if (panelsQuery.isError) return <div>error occurred</div>;

  return (
    <div className="flex-1 p-5 bg-off-white">
      <PanelGrid panelPages={panelsQuery.data.pages} />
      <IntersectionArea onIntersection={fetchPanels} />
      <button type="button" onClick={handleClick}>
        열기
      </button>
    </div>
  );
};

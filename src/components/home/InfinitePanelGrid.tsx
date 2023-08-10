import React, { useCallback } from 'react';

import { IntersectionArea } from '@/components/system/IntersectionArea';
import { useMyPanelsInfiniteQuery } from '@/hooks/queries/panel';

import { PanelGrid } from './PanelGrid';

export const InfinitePanelGrid = (): JSX.Element => {
  const panelsQuery = useMyPanelsInfiniteQuery();

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

  if (panelsQuery.isLoading) return <div>loading...</div>;
  if (panelsQuery.isError) return <div>error occurred</div>;

  return (
    <div className="flex-1 p-5 bg-off-white">
      <PanelGrid panelPages={panelsQuery.data.pages} />
      <IntersectionArea onIntersection={fetchPanels} />
    </div>
  );
};

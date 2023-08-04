import React, { useCallback } from 'react';

import PanelItem from '@/components/home/PanelItem';
import { IntersectionArea } from '@/components/system/IntersectionArea';
import { useMyPanelsInfiniteQuery } from '@/hooks/queries/panel';

const InfinitePanelGrid = (): JSX.Element => {
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
    <>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {panelsQuery.data.pages.map((page) =>
          page.panels.map((panel) => (
            <PanelItem key={panel.id} panel={panel} />
          )),
        )}
      </ul>
      <IntersectionArea onIntersection={fetchPanels} />
    </>
  );
};

export default InfinitePanelGrid;

import React, { useEffect } from 'react';

import PanelItem from '@/components/panel/PanelItem';
import { useMyPanelsInfiniteQuery } from '@/hooks/panel';
import useInView from '@/hooks/useInView';

const InfinitePanelGrid = (): JSX.Element => {
  const panelsQuery = useMyPanelsInfiniteQuery();
  const [fetchMoreRef, inView] = useInView();

  useEffect(() => {
    if (!inView || panelsQuery.isFetchingNextPage || !panelsQuery.hasNextPage)
      return;
    panelsQuery.fetchNextPage();
  }, [inView, panelsQuery]);

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
      <div ref={fetchMoreRef} />
    </>
  );
};

export default InfinitePanelGrid;

import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';

import PanelList from '@/components/panel/PanelList';
import { getMyPanels } from '@/lib/api/panel';
import { isUserLoggedIn } from '@/lib/routeGuard';

// https://reactrouter.com/en/main/fetch/redirect
export const mainLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};

const Main = (): JSX.Element => {
  const panelsQuery = useQuery(['panels'], getMyPanels);

  if (panelsQuery.isLoading) return <div>loading...</div>;
  if (panelsQuery.isError) return <div>error occurred</div>;

  const { panels } = panelsQuery.data;

  return <PanelList panels={panels} />;
};

export default Main;

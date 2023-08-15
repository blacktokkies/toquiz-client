import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { getPanel } from '@/lib/api/panel';

export const panelLoader: LoaderFunction = ({ params }) => {
  if (!params.id?.length) return null;
  getPanel(params.id);
  return null;
};
export function Panel(): JSX.Element {
  return <div>패널 페이지</div>;
}

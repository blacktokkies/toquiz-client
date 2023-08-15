import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { getPanel } from '@/lib/api/panel';

export const panelLoader: LoaderFunction = async ({ params }) => {
  if (!params.id?.length) return null;
  await getPanel(params.id);
  return null;
};
export function PanelError(): JSX.Element {
  return <div>패널 에러 페이지</div>;
}
export function Panel(): JSX.Element {
  return <div>패널 페이지</div>;
}

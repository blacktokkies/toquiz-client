/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Panel } from '@/lib/api/panel';

import { useParams } from 'react-router-dom';

export const useCurrentPanelId = (): Panel['sid'] => {
  const params = useParams<{ panelId: Panel['sid'] }>();
  const panelId = params.panelId!;

  return panelId;
};

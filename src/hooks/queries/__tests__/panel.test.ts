import type { Panel } from '@/lib/api/panel';

import { renderHook, waitFor } from '@testing-library/react';

import { createQueryClientWrapper } from '@/lib/test-utils';
import { createMockPanelId } from '@/mocks/data/panel';

import { usePanelDetailQuery } from '../panel';

describe('panel queries', () => {
  it('usePanelDetailQuery를 호출하면 getPanel이 호출된다', async () => {
    const panelId: Panel['sid'] = createMockPanelId();
    const { result } = renderHook(() => usePanelDetailQuery(panelId), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.sid).toBe(panelId);
  });
});

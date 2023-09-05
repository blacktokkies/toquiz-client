import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';
import { renderHook, waitFor } from '@testing-library/react';

import { createQueryClientWrapper } from '@/lib/test-utils';

import { usePanelQuery } from '../panel';

describe('panel queries', () => {
  it('usePanelQuery를 호출하면 getPanel이 호출된다', async () => {
    const panelId: Panel['sid'] = faker.datatype.uuid();
    const { result } = renderHook(() => usePanelQuery(panelId), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.sid).toBe(panelId);
  });
});

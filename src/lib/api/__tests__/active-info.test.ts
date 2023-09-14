import type { Panel } from '@/lib/api/panel';

import { getMyActiveInfo } from '@/lib/api/active-Info';
import { apiUrl } from '@/lib/api/apiUrl';
import { mockMyActiveInfo } from '@/mocks/data/active-info';
import { createMockPanelId } from '@/mocks/data/panel';

describe('activeInfo api', () => {
  it(`getMyActiveInfo를 호출하면 내 활동 정보 가져오기 API(${apiUrl.activeInfo.get(
    ':panelId',
  )})`, async () => {
    const panelId: Panel['sid'] = createMockPanelId();
    const res = await getMyActiveInfo(panelId);

    expect(res.result).toEqual(mockMyActiveInfo);
  });
});

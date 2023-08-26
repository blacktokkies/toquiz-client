import type { Panel } from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

import { getMyActiveInfo } from '@/lib/api/active-Info';
import { apiUrl } from '@/lib/api/apiUrl';
import { myActiveInfoMock } from '@/mocks/data/active-info';

describe('activeInfo api', () => {
  it(`getMyActiveInfo를 호출하면 내 활동 정보 가져오기 API(${apiUrl.panel.getMyActiveInfo(
    ':panelId',
  )})`, async () => {
    const panelId: Panel['sid'] = faker.datatype.uuid();
    const res = await getMyActiveInfo(panelId);
    expect(res.result).toEqual(myActiveInfoMock);
  });
});

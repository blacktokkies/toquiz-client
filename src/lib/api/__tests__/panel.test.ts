import type {
  UpdatePanelBody,
  CreatePanelBody,
  UpdatePanelPathParams,
} from '@/lib/api/panel';

import { faker } from '@faker-js/faker';

import { apiUrl } from '@/lib/api/consts';
import { createPanel, updatePanel, deletePanel } from '@/lib/api/panel';

describe('panel api', () => {
  it(`createPanel을 호출하면 패널 생성 API(${apiUrl.panel.create()})로 요청한다`, async () => {
    const body: CreatePanelBody = {
      title: '새로운 패널 이름',
      description: '새로운 패널 설명',
    };

    const res = await createPanel(body);
    expect(res.title).toBe(body.title);
    expect(res.description).toBe(body.description);
  });

  it(`updatePanel을 호출하면 패널 생성 API(${apiUrl.panel.update(
    ':panelId',
  )})로 요청한다`, async () => {
    const params: UpdatePanelPathParams = {
      panelId: faker.datatype.uuid(),
    };
    const body: UpdatePanelBody = {
      title: '새로운 패널 이름',
      description: '새로운 패널 설명',
    };

    const res = await updatePanel(params.panelId, body);
    expect(res.title).toBe(body.title);
    expect(res.description).toBe(body.description);
    expect(res.id).toBe(params.panelId);
  });

  it(`deletePanel을 호출하면 패널 삭제 API(${apiUrl.panel.delete(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId = faker.datatype.uuid();

    const res = await deletePanel(panelId);
    expect(res.message).toBe('패널 삭제에 성공하였습니다.');
  });
});

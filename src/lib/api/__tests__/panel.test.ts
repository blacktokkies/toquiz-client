import type { UpdatePanelBody, CreatePanelBody, Panel } from '@/lib/api/panel';

import { apiUrl } from '@/lib/api/apiUrl';
import {
  createPanel,
  updatePanel,
  deletePanel,
  getPanel,
} from '@/lib/api/panel';

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
    const panelId: Panel['id'] = 1;
    const body: UpdatePanelBody = {
      title: '새로운 패널 이름',
      description: '새로운 패널 설명',
    };

    const res = await updatePanel(panelId, body);
    expect(res.title).toBe(body.title);
    expect(res.description).toBe(body.description);
    expect(res.id).toBe(panelId);
  });

  it(`deletePanel을 호출하면 패널 삭제 API(${apiUrl.panel.delete(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId: Panel['id'] = 1;

    const res = await deletePanel(panelId);
    expect(res.message).toBe('패널 삭제에 성공하였습니다.');
  });

  it(`panelPanel을 호출하면 패널 가져오기 API(${apiUrl.panel.get(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId: Panel['id'] = 1;

    const res = await getPanel(panelId);
    expect(res.result.id).toBe(panelId);
  });
});

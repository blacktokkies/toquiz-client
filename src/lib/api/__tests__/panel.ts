import { createPanel, type CreatePanelBody } from '@/lib/api/panel';
import { apiUrl } from '@/lib/apiUrl';

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
});

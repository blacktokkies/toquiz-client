import type { Panel } from '@/lib/api/panel';

import { apiUrl } from '@/lib/api/apiUrl';
import { getQuestions } from '@/lib/api/question';
import { mockQuestionList } from '@/mocks/data/question';

describe('question api', () => {
  it(`getQuestions를 호출하면 질문 목록 가져오기 API(${apiUrl.question.getQuestions(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId: Panel['id'] = 0;

    const res = await getQuestions(panelId, {
      page: 0,
    });
    expect(res.result.questions[0]).toEqual(mockQuestionList[0]);
  });
});

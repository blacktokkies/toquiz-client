import type { Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';

import { apiUrl } from '@/lib/api/apiUrl';
import { createQuestion, getQuestions } from '@/lib/api/question';
import { mockQuestionList } from '@/mocks/data/question';

describe('question api', () => {
  it(`getQuestions를 호출하면 질문 목록 가져오기 API(${apiUrl.question.getQuestions(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId: Panel['id'] = 0;

    const res = await getQuestions(panelId, {
      page: 0,
    });
    expect(mockQuestionList).toContainEqual(res.result.questions[0]);
  });

  it(`createQuestion을 호출하면 질문 생성 API (${apiUrl.question.create(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId: Panel['id'] = 0;
    const content: Question['content'] = '안녕하세요';

    const res = await createQuestion(panelId, { content });
    expect(res.result.content).toBe(content);
  });
});

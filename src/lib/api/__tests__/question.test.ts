import type { Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';

import { apiUrl } from '@/lib/api/apiUrl';
import { createQuestion, getQuestions, likeQuestion } from '@/lib/api/question';
import { createMockPanelId } from '@/mocks/data/panel';
import { createMockQuestionId, mockQuestionList } from '@/mocks/data/question';

describe('question api', () => {
  it(`getQuestions를 호출하면 질문 목록 가져오기 API(${apiUrl.question.getQuestions(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId: Panel['sid'] = createMockPanelId();

    const res = await getQuestions(panelId, {
      page: 0,
    });

    expect(mockQuestionList).toContainEqual(res.result.questions[0]);
  });

  it(`createQuestion을 호출하면 질문 생성 API (${apiUrl.question.create(
    ':panelId',
  )})로 요청한다`, async () => {
    const panelId: Panel['sid'] = createMockPanelId();
    const content: Question['content'] = '안녕하세요';

    const res = await createQuestion(panelId, { content });

    expect(res.result.content).toBe(content);
  });

  it(`likeQuestion을 호출하면 질문 좋아요 API(${apiUrl.question.like(
    ':questionId',
  )})로 요청한다)`, async () => {
    const questionId: Question['id'] = createMockQuestionId();
    const active = true;

    const res = await likeQuestion(questionId, { active });
    expect(res.result.id).toBe(questionId);
    expect(res.result.isActived).toBe(active);
  });
});

import type { Question } from '@/lib/api/question';

import { apiUrl } from '@/lib/api/apiUrl';
import { createMockQuestionId } from '@/mocks/data/question';

import { createAnswer, getAnswers } from '../answer';

describe('answer api', () => {
  it(`getAnswers를 호출하면 ${apiUrl.answer.getAnswers(
    ':questionId',
  )}로 요청한다`, async () => {
    const questionId: Question['id'] = createMockQuestionId();
    const { result } = await getAnswers(questionId);

    expect(result.id).toBe(questionId);
  });

  it(`createAnswer를 호출하면 ${apiUrl.answer.create(
    ':questionId',
  )}로 요청한다`, async () => {
    const questionId: Question['id'] = createMockQuestionId();
    const content = '안녕하세요';
    const { result } = await createAnswer(questionId, content);

    expect(result.content).toBe(content);
  });
});

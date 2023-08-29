import { apiUrl } from '@/lib/api/apiUrl';

import { createAnswer, getAnswers } from '../answer';

const questionId = -1;

describe('answer api', () => {
  it(`getAnswers를 호출하면 ${apiUrl.answer.getAnswers(
    ':questionId',
  )}로 요청한다`, async () => {
    const { result } = await getAnswers(questionId);

    expect(result.id).toBe(questionId);
  });

  it(`createAnswer를 호출하면 ${apiUrl.answer.create(
    ':questionId',
  )}로 요청한다`, async () => {
    const content = '안녕하세요';
    const { result } = await createAnswer(questionId, content);

    expect(result.content).toBe(content);
  });
});

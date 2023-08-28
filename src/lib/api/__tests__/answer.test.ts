import { apiUrl } from '@/lib/api/apiUrl';

import { getAnswers } from '../answer';

const questionId = -1;

describe('answer api', () => {
  it(`getAnswers를 호출하면 ${apiUrl.answer.getAnswers(
    ':questionId',
  )}`, async () => {
    const { result } = await getAnswers(questionId);

    expect(result.id).toBe(questionId);
  });
});

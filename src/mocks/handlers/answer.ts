import type {
  GetAnswersPathParams,
  GetAnswersResponse,
} from '@/lib/api/answer';

import { rest } from 'msw';

import { apiUrl } from '@/lib/api/apiUrl';
import { API_BASE_URL } from '@/lib/apiClient';

import { createMockAnswerList } from '../data/answer';
import { createMockQuestion, mockQuestionList } from '../data/question';

export const getAnswers = rest.get<
  never,
  GetAnswersPathParams,
  GetAnswersResponse
>(
  `${API_BASE_URL}${apiUrl.answer.getAnswers(':questionId')}`,
  async (req, res, ctx) => {
    const { questionId } = req.params;
    const question = mockQuestionList.find(
      (question) => question.id === Number(questionId),
    ) ?? {
      ...createMockQuestion(),
      id: questionId,
    };

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          ...question,
          id: Number(question.id),
          answers: createMockAnswerList(question.answerNum),
        },
      }),
    );
  },
);

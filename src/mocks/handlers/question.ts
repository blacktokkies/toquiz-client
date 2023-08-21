import type {
  GetQuestionsPathParams,
  GetQuestionsResponse,
} from '@/lib/api/question';

import { rest } from 'msw';

import { apiUrl } from '@/lib/api/apiUrl';
import { API_BASE_URL } from '@/lib/apiClient';

import { mockQuestionList } from '../data/question';

export const getQuestions = rest.get<
  never,
  GetQuestionsPathParams,
  GetQuestionsResponse
>(
  `${API_BASE_URL}${apiUrl.question.getQuestions(':panelId')}`,
  async (req, res, ctx) => {
    const page = req.url.searchParams.get('page');

    const start = Number(page);
    const end = (start + 1) * 30;
    const questions = mockQuestionList.slice(start, end);

    const nextPage = end >= mockQuestionList.length ? -1 : start + 1;

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          nextPage,
          questions,
        },
      }),
    );
  },
);

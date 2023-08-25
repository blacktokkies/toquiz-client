import type {
  CreateQuestionBody,
  CreateQuestionPathParams,
  CreateQuestionResponse,
  GetQuestionsPathParams,
  GetQuestionsResponse,
  LikeQuestionPathParams,
  LikeQuestionResponse,
} from '@/lib/api/question';

import { rest } from 'msw';

import { apiUrl } from '@/lib/api/apiUrl';
import { API_BASE_URL } from '@/lib/apiClient';

import { createMockQuestion, mockQuestionList } from '../data/question';

export const getQuestions = rest.get<
  never,
  GetQuestionsPathParams,
  GetQuestionsResponse
>(
  `${API_BASE_URL}${apiUrl.question.getQuestions(':panelId')}`,
  async (req, res, ctx) => {
    const page = req.url.searchParams.get('page');
    const sort = req.url.searchParams.get('sort');
    const start = Number(page);
    const end = (start + 1) * 30;
    const questions =
      sort === null
        ? mockQuestionList
            .slice()
            .sort((a, b) => b.likeNum - a.likeNum)
            .slice(start, end)
        : mockQuestionList.slice(start, end);

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

export const createQuestion = rest.post<
  CreateQuestionBody,
  CreateQuestionPathParams,
  CreateQuestionResponse
>(
  `${API_BASE_URL}${apiUrl.question.create(':panelId')}`,
  async (req, res, ctx) => {
    const { content }: CreateQuestionBody = await req.json();
    const question = { ...createMockQuestion(), content };

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: question,
      }),
    );
  },
);

export const likeQuestion = rest.post<
  never,
  LikeQuestionPathParams,
  LikeQuestionResponse
>(
  `${API_BASE_URL}${apiUrl.question.like(':questionId')}`,
  async (req, res, ctx) => {
    const questionId = Number(req.params.questionId);
    const active = Boolean(req.url.searchParams.get('active'));

    const question = mockQuestionList.find(
      (q) => q.id === Number(questionId),
    ) ?? { ...createMockQuestion(), id: questionId };
    if (active) question.likeNum += 1;
    else question.likeNum -= 1;

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          id: question.id,
          isActived: active,
          likeNum: question.likeNum,
        },
      }),
    );
  },
);

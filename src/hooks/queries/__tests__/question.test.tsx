import type { Panel } from '@/lib/api/panel';
import type {
  GetQuestionsPathParams,
  GetQuestionsResponse,
  GetQuestionsResult,
} from '@/lib/api/question';

import { faker } from '@faker-js/faker';
import { act, renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';

import {
  useCreateQuestionMutation,
  useLikeQuestionMutation,
  useQuestionsInfiniteQuery,
} from '@/hooks/queries/question';
import { apiUrl } from '@/lib/api/apiUrl';
import * as questionApis from '@/lib/api/question';
import { createQueryClientWrapper } from '@/lib/test-utils';
import { server } from '@/mocks/server';

describe('question API queries', () => {
  describe('useQuestionsInfiniteQuery', () => {
    const panelId: Panel['sid'] = faker.datatype.uuid();

    it('getQuestions가 nextPage를 -1로 반환하면 hasNextPage는 false이다', async () => {
      overrideGetQuestionsWith200({ questions: [], nextPage: -1 });

      const { result } = renderHook(() => useQuestionsInfiniteQuery(panelId), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('getQuestions가 nextPage를 -1 이외의 값을 반환하면 hasNextPage는 true이다', async () => {
      overrideGetQuestionsWith200({ questions: [], nextPage: 1 });

      const { result } = renderHook(() => useQuestionsInfiniteQuery(panelId), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('매개변수 sort에 createdDate,DESC을 전달하면 getQuestions가 createdDate,DESC로 호출된다', () => {
      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      renderHook(() => useQuestionsInfiniteQuery(panelId, 'createdDate,DESC'), {
        wrapper: createQueryClientWrapper(),
      });
      expect(spyOnGetQuestions).toBeCalledWith(panelId, {
        page: 0,
        sort: 'createdDate,DESC',
      });
    });
  });

  describe('createQuestionMutation', () => {
    it('mutate를 호출하면 createQuestion 함수를 호출한다', async () => {
      const panelId: Panel['sid'] = faker.datatype.uuid();
      const body: questionApis.CreateQuestionBody = {
        content: '안녕하세요',
      };
      const spyOnCreateQuestion = vi.spyOn(questionApis, 'createQuestion');
      const { result } = renderHook(() => useCreateQuestionMutation(panelId), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.mutate(body);
      });

      await waitFor(() => {
        expect(spyOnCreateQuestion).toHaveBeenCalledWith(panelId, body);
      });
    });
  });

  describe('likeQuestionMutation', () => {
    it('mutate를 호출하면 likeQuestion 함수를 호출한다', async () => {
      const questionId: questionApis.Question['id'] = 0;
      const active: questionApis.LikeQuestionParams['active'] = true;

      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');
      const { result } = renderHook(() => useLikeQuestionMutation(), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.mutate({ id: questionId, active });
      });

      await waitFor(() => {
        expect(spyOnLikeQuestion).toHaveBeenCalledWith(questionId, { active });
      });
    });
  });
});

export function overrideGetQuestionsWith200(result: GetQuestionsResult): void {
  server.use(
    rest.get<never, GetQuestionsPathParams, GetQuestionsResponse>(
      `${apiUrl.question.getQuestions(':panelId')}`,
      async (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            statusCode: 200,
            result,
          }),
        ),
    ),
  );
}

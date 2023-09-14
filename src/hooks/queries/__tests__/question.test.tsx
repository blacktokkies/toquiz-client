import type { Panel } from '@/lib/api/panel';
import type {
  GetQuestionsPathParams,
  GetQuestionsResponse,
  GetQuestionsResult,
  Question,
} from '@/lib/api/question';

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
import { createMockPanelId } from '@/mocks/data/panel';
import { createMockQuestionId } from '@/mocks/data/question';
import { server } from '@/mocks/server';

describe('question API queries', () => {
  describe('useQuestionsInfiniteQuery', () => {
    it('getQuestions가 nextPage를 -1로 반환하면 hasNextPage는 false이다', async () => {
      overrideGetQuestionsWithSuccess({ questions: [], nextPage: -1 });

      const panelId: Panel['sid'] = createMockPanelId();
      const { result } = renderHook(() => useQuestionsInfiniteQuery(panelId), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('getQuestions가 nextPage를 -1 이외의 값을 반환하면 hasNextPage는 true이다', async () => {
      overrideGetQuestionsWithSuccess({ questions: [], nextPage: 1 });

      const panelId: Panel['sid'] = createMockPanelId();
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

      const panelId: Panel['sid'] = createMockPanelId();
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
      const spyOnCreateQuestion = vi.spyOn(questionApis, 'createQuestion');

      const panelId: Panel['sid'] = createMockPanelId();
      const { result } = renderHook(() => useCreateQuestionMutation(panelId), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.mutate({ content: '안녕하세요' });
      });

      await waitFor(() => {
        expect(spyOnCreateQuestion).toHaveBeenCalledWith(panelId, {
          content: '안녕하세요',
        });
      });
    });
  });

  describe('likeQuestionMutation', () => {
    it('mutate를 호출하면 likeQuestion 함수를 호출한다', async () => {
      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');

      const questionId: Question['id'] = createMockQuestionId();
      const { result } = renderHook(() => useLikeQuestionMutation(), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.mutate({ id: questionId, active: true });
      });

      await waitFor(() => {
        expect(spyOnLikeQuestion).toHaveBeenCalledWith(questionId, {
          active: true,
        });
      });
    });
  });
});

function overrideGetQuestionsWithSuccess(result: GetQuestionsResult): void {
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

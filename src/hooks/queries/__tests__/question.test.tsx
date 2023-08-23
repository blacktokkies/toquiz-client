import type { Panel } from '@/lib/api/panel';
import type {
  GetQuestionsPathParams,
  GetQuestionsResponse,
  GetQuestionsResult,
} from '@/lib/api/question';

import { act, renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';

import {
  useCreateQuestionMutation,
  useQuestionsInfiniteQuery,
} from '@/hooks/queries/question';
import { apiUrl } from '@/lib/api/apiUrl';
import * as questionApis from '@/lib/api/question';
import { createQueryClientWrapper } from '@/lib/test-utils';
import { server } from '@/mocks/server';

describe('question API queries', () => {
  describe('useQuestionsInfiniteQuery', () => {
    it('getQuestions가 nextPage를 -1로 반환하면 hasNextPage는 false이다', async () => {
      overrideGetQuestionsWith200({ questions: [], nextPage: -1 });

      const { result } = renderHook(() => useQuestionsInfiniteQuery(0), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('getQuestions가 nextPage를 -1 이외의 값을 반환하면 hasNextPage는 true이다', async () => {
      overrideGetQuestionsWith200({ questions: [], nextPage: 1 });

      const { result } = renderHook(() => useQuestionsInfiniteQuery(0), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe('createQuestionMutation', () => {
    it('mutate를 호출하면 createQuestion 함수를 호출한다', async () => {
      const panelId: Panel['id'] = -1;
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

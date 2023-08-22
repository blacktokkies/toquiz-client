import type { Panel } from '@/lib/api/panel';
import type {
  GetQuestionsParams,
  GetQuestionsResult,
} from '@/lib/api/question';
import type { ApiError } from '@/lib/apiClient';
import type { UseInfiniteQueryResult } from '@tanstack/react-query';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getQuestions } from '@/lib/api/question';
import { queryKey } from '@/lib/queryKey';

export const useQuestionsInfiniteQuery = (
  panelId: Panel['id'],
): UseInfiniteQueryResult<GetQuestionsResult, ApiError | SyntaxError> => {
  const key = queryKey.question.list(panelId);
  const query = useInfiniteQuery<GetQuestionsResult, ApiError | SyntaxError>(
    key,
    async ({ pageParam = 0 }) =>
      (
        await getQuestions(panelId, {
          page: pageParam as GetQuestionsParams['page'],
        })
      ).result,
    {
      getNextPageParam: (lastPage) =>
        lastPage.nextPage !== -1 ? lastPage.nextPage : undefined,
    },
  );

  return query;
};

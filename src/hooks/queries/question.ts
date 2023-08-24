import type { Panel } from '@/lib/api/panel';
import type {
  CreateQuestionBody,
  CreateQuestionResult,
  GetQuestionsParams,
  GetQuestionsResult,
} from '@/lib/api/question';
import type { ApiError } from '@/lib/apiClient';
import type {
  UseInfiniteQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { createQuestion, getQuestions } from '@/lib/api/question';
import { queryKey } from '@/lib/queryKey';

export const useQuestionsInfiniteQuery = (
  panelId: Panel['id'],
  sort: GetQuestionsParams['sort'] = undefined,
): UseInfiniteQueryResult<GetQuestionsResult, ApiError | SyntaxError> => {
  const key = queryKey.question.list(panelId, sort);
  const query = useInfiniteQuery<GetQuestionsResult, ApiError | SyntaxError>(
    key,
    async ({ pageParam = 0 }) =>
      (
        await getQuestions(panelId, {
          page: pageParam as GetQuestionsParams['page'],
          sort,
        })
      ).result,
    {
      getNextPageParam: (lastPage) =>
        lastPage.nextPage !== -1 ? lastPage.nextPage : undefined,
    },
  );

  return query;
};

export const useCreateQuestionMutation = (
  panelId: Panel['id'],
): UseMutationResult<
  CreateQuestionResult,
  ApiError | SyntaxError,
  CreateQuestionBody
> => {
  const key = queryKey.question.create();
  const mutation = useMutation<
    CreateQuestionResult,
    ApiError | SyntaxError,
    CreateQuestionBody
  >(key, async (body) =>
    createQuestion(panelId, body).then((res) => res.result),
  );

  return mutation;
};

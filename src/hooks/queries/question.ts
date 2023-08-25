import type { Panel } from '@/lib/api/panel';
import type {
  CreateQuestionBody,
  CreateQuestionResult,
  GetQuestionsParams,
  GetQuestionsResult,
  LikeQuestionParams,
  LikeQuestionResult,
  Question,
} from '@/lib/api/question';
import type { ApiError } from '@/lib/apiClient';
import type { NonNullableKeys } from '@/lib/types';
import type {
  MutationOptions,
  UseInfiniteQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { createQuestion, getQuestions, likeQuestion } from '@/lib/api/question';
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

/* ================================ [ 질문 좋아요 뮤테이션 ] ====================================== */
export type LikeQuestionMutation = NonNullableKeys<
  Pick<
    MutationOptions<
      LikeQuestionResult,
      ApiError | SyntaxError,
      Pick<Question, 'id'> & Pick<LikeQuestionParams, 'active'>,
      ReturnType<typeof queryKey.question.like>
    >,
    'mutationFn' | 'mutationKey'
  >
>;
export const likeQuestionMutation = (): LikeQuestionMutation => ({
  mutationKey: queryKey.question.like(),
  mutationFn: async ({ id, active }) =>
    likeQuestion(id, { active }).then((res) => res.result),
});

export const useLikeQuestionMutation = (
  options: MutationOptions<
    LikeQuestionResult,
    ApiError | SyntaxError,
    Pick<Question, 'id'> & Pick<LikeQuestionParams, 'active'>,
    unknown
  > = {},
): UseMutationResult<
  LikeQuestionResult,
  ApiError | SyntaxError,
  Pick<Question, 'id'> & Pick<LikeQuestionParams, 'active'>,
  unknown
> => useMutation({ ...likeQuestionMutation(), ...options });

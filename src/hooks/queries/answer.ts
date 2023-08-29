import type {
  Answer,
  CreateAnswerResult,
  GetAnswersResult,
} from '@/lib/api/answer';
import type { Question } from '@/lib/api/question';
import type { ApiError } from '@/lib/apiClient';
import type { NonNullableKeys } from '@/lib/types';
import type {
  MutationOptions,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import { createAnswer, getAnswers } from '@/lib/api/answer';
import { queryKey } from '@/lib/queryKey';

export const useAnswersQuery = (
  questionId: Question['id'],
): UseQueryResult<GetAnswersResult, ApiError | SyntaxError> => {
  const key = queryKey.answer.list(questionId);
  const query = useQuery<GetAnswersResult, ApiError | SyntaxError>(
    key,
    async () => (await getAnswers(questionId)).result,
  );

  return query;
};

/* ================================ [ 질문 좋아요 뮤테이션 ] ====================================== */
export type CreateAnswerMutation = NonNullableKeys<
  Pick<
    MutationOptions<
      CreateAnswerResult,
      ApiError | SyntaxError,
      Answer['content'],
      ReturnType<typeof queryKey.answer.create>
    >,
    'mutationKey' | 'mutationFn'
  >
>;

export const createAnswerMutation = (
  questionId: Question['id'],
): CreateAnswerMutation => ({
  mutationKey: queryKey.answer.create(),
  mutationFn: async (content: Answer['content']) =>
    createAnswer(questionId, content).then((res) => res.result),
});

export const useCreateAnswerMutation = <TContext = unknown>(
  questionId: Question['id'],
  options: MutationOptions<
    CreateAnswerResult,
    ApiError | SyntaxError,
    Answer['content'],
    TContext
  > = {},
): UseMutationResult<
  CreateAnswerResult,
  ApiError | SyntaxError,
  Answer['content'],
  TContext
> => useMutation({ ...createAnswerMutation(questionId), ...options });

import type {
  Answer,
  CreateAnswerResult,
  GetAnswersResult,
} from '@/lib/api/answer';
import type { Question } from '@/lib/api/question';
import type { ApiError } from '@/lib/apiClient';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

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

export const useCreateAnswerMutation = (
  questionId: Question['id'],
): UseMutationResult<
  CreateAnswerResult,
  ApiError | SyntaxError,
  Answer['content']
> => {
  const key = queryKey.answer.create();
  const mutation = useMutation<
    CreateAnswerResult,
    ApiError | SyntaxError,
    Answer['content']
  >(
    key,
    async (content: Answer['content']) =>
      (await createAnswer(questionId, content)).result,
  );

  return mutation;
};

import type { GetAnswersResult } from '@/lib/api/answer';
import type { Question } from '@/lib/api/question';
import type { ApiError } from '@/lib/apiClient';
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { getAnswers } from '@/lib/api/answer';
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

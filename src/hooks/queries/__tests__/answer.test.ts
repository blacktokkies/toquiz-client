import type { Question } from '@/lib/api/question';

import { renderHook, waitFor } from '@testing-library/react';

import { useAnswersQuery } from '@/hooks/queries/answer';
import { createQueryClientWrapper } from '@/lib/test-utils';

const questionId: Question['id'] = -1;
describe('answer API queries', () => {
  it('useAnswersQuery를 호출하면 getAnswers가 호출된다', async () => {
    const { result } = renderHook(() => useAnswersQuery(questionId), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.id).toBe(questionId);
  });
});

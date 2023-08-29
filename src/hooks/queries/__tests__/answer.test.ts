import type { Question } from '@/lib/api/question';

import { act, renderHook, waitFor } from '@testing-library/react';

import {
  useAnswersQuery,
  useCreateAnswerMutation,
} from '@/hooks/queries/answer';
import * as answerApis from '@/lib/api/answer';
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

  describe('useCreateAnswerMutation', () => {
    it('mutate를 호출하면 createAnswer가 호출된다', async () => {
      const spyOnCreateAnswer = vi.spyOn(answerApis, 'createAnswer');
      const content = '안녕하세요';
      const { result } = renderHook(() => useCreateAnswerMutation(questionId), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.mutate('안녕하세요');
      });

      await waitFor(() => {
        expect(spyOnCreateAnswer).toHaveBeenCalledWith(questionId, content);
      });
    });
  });
});

import type { Panel } from '@/lib/api/panel';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { InfiniteQuestionList } from '@/components/panel/InfiniteQuestionList';
import * as questionApis from '@/lib/api/question';
import { queryKey } from '@/lib/queryKey';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockQuestionList } from '@/mocks/data/question';
import { overrideGetQuestionsWithSuccess } from '@/pages/__tests__/Panel.test';

const panelId: Panel['id'] = 0;

describe('InfiniteQuestionList', () => {
  describe('질문 목록 렌더링', () => {
    it('질문 목록 가져오기 API를 호출하고 성공 시 질문 목록을 렌더링한다', async () => {
      const questions = createMockQuestionList(3);
      overrideGetQuestionsWithSuccess({
        statusCode: 200,
        result: { questions, nextPage: -1 },
      });
      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      setup();

      expect(spyOnGetQuestions).toHaveBeenCalled();

      await waitFor(() => {
        expect(
          screen.getAllByText(questions[0].content)[0],
        ).toBeInTheDocument();
      });
    });

    it('사용자가 스크롤하면 getQuestions를 호출한다', async () => {
      const { queryClient } = setup();
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      fireEvent.scroll(window);

      expect(spyOnGetQuestions).toHaveBeenCalledTimes(1);
    });
  });

  describe('질문 목록 정렬', () => {
    it('최신순 버튼을 누르면 최신순으로 질문 목록을 보여준다', async () => {
      const { queryClient } = setup();
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const recentButton = screen.getByRole('button', {
        name: '최신순',
      });
      await userEvent.click(recentButton);

      await waitFor(() => {
        const queryData = queryClient.getQueryData<
          InfiniteData<questionApis.GetQuestionsResult>
        >(queryKey.question.list(panelId, 'createdDate,DESC'));

        expect(
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain */
          screen.getByText(queryData?.pages[0].questions[0].content!),
        ).toBeInTheDocument();
      });
    });
  });

  it('최신순 버튼 눌렀다가 좋아요순 버튼 누르면 좋아요순으로 질문 목록을 보여준다', async () => {
    const { queryClient } = setup();
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    const recentButton = screen.getByRole('button', { name: '최신순' });
    await userEvent.click(recentButton);
    const popularButton = screen.getByRole('button', { name: '좋아요순' });
    await userEvent.click(popularButton);

    await waitFor(() => {
      const queryData = queryClient.getQueryData<
        InfiniteData<questionApis.GetQuestionsResult>
      >(queryKey.question.list(panelId));

      expect(
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain */
        screen.getByText(queryData?.pages[0].questions[0].content!),
      ).toBeInTheDocument();
    });
  });

  describe('좋아요 버튼', () => {
    it('좋아요 버튼을 누를 때마다 좋아요 API 요청한다', async () => {
      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');
      const { queryClient } = setup();
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const likeButton = screen.getAllByRole('button', { name: /좋아요 버튼/ });
      await userEvent.click(likeButton[0]);

      expect(spyOnLikeQuestion).toHaveBeenCalled();
    });

    it('좋아요 버튼을 누를 때마다 좋아요 API 응답을 기다리지 않고 화면에 토글 결과를 보여준다', async () => {
      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');
      const { queryClient } = setup();
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const likeButton = screen.getAllByRole('button', {
        name: /좋아요 버튼/,
      })[0];
      const prevLikeNum = Number(likeButton.textContent);
      await userEvent.click(likeButton);

      expect(spyOnLikeQuestion).toHaveBeenCalled();
      expect(likeButton).toHaveTextContent(String(prevLikeNum + 1));
    });
  });
});

function setup(): {
  queryClient: QueryClient;
} {
  const { queryClient } = renderWithQueryClient(
    <InfiniteQuestionList panelId={panelId} />,
  );

  return { queryClient };
}

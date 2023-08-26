import type { Panel } from '@/lib/api/panel';
import type { ErrorResponse } from '@/lib/api/types';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { InfiniteQuestionList } from '@/components/panel/InfiniteQuestionList';
import { apiUrl } from '@/lib/api/apiUrl';
import * as questionApis from '@/lib/api/question';
import { queryKey } from '@/lib/queryKey';
import { renderWithQueryClient } from '@/lib/test-utils';
import { delay } from '@/lib/test-utils/delay';
import { createMockQuestion } from '@/mocks/data/question';
import { server } from '@/mocks/server';
import { overrideGetQuestionsWithSuccess } from '@/pages/__tests__/Panel.test';

const panelId: Panel['id'] = 0;

describe('InfiniteQuestionList', () => {
  describe('질문 목록 렌더링', () => {
    it('질문 목록 가져오기 API를 호출하고 성공 시 질문 목록을 렌더링한다', async () => {
      const question = { ...createMockQuestion(), content: '안녕하세요' };
      overrideGetQuestionsWithSuccess({
        statusCode: 200,
        result: { questions: [question], nextPage: -1 },
      });
      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      setup();

      expect(spyOnGetQuestions).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText(/안녕하세요/)).toBeInTheDocument();
      });
    });

    it('사용자가 스크롤하면 getQuestions를 호출한다', async () => {
      const { waitForFinish } = setup();
      await waitForFinish();

      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      fireEvent.scroll(window);

      expect(spyOnGetQuestions).toHaveBeenCalledTimes(1);
    });
  });

  describe('질문 목록 정렬', () => {
    it('최신순 버튼을 누르면 최신순으로 질문 목록을 보여준다', async () => {
      const { queryClient, waitForFinish } = setup();
      await waitForFinish();

      const recentButton = screen.getByRole('button', { name: '최신순' });
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
    const { queryClient, waitForFinish } = setup();
    await waitForFinish();

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
      const { waitForFinish } = setup();
      await waitForFinish();

      const likeButton = screen.getAllByRole('button', { name: /좋아요 버튼/ });
      await userEvent.click(likeButton[0]);

      expect(spyOnLikeQuestion).toHaveBeenCalled();
    });

    it('좋아요 버튼을 누를 때마다 좋아요 API 응답을 기다리지 않고 화면에 토글 결과를 보여준다', async () => {
      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');
      const { waitForFinish } = setup();
      await waitForFinish();

      const likeButton = screen.getAllByRole('button', {
        name: /좋아요 버튼/,
      })[0];
      const prevLikeNum = Number(likeButton.textContent);
      await userEvent.click(likeButton);

      expect(spyOnLikeQuestion).toHaveBeenCalled();
      expect(likeButton).toHaveTextContent(String(prevLikeNum + 1));
    });

    it('좋아요 API가 400 응답하면 보여준 토글 결과를 원래대로 되돌린다', async () => {
      const question = createMockQuestion();
      overrideGetQuestionsWithSuccess({
        statusCode: 200,
        result: { questions: [question], nextPage: -1 },
      });
      overrideLikeQuestionWithError({
        code: 'INVALID_ACTIVE_LIKE_QUESTION',
        statusCode: 400,
        message: '유효하지 않은 좋아요 활성화 요청입니다.',
      });
      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');
      const { waitForFinish } = setup();
      await waitForFinish();

      const likeButton = screen.getAllByRole('button', {
        name: /좋아요 버튼/,
      })[0];
      const prevLikeNum = Number(likeButton.textContent);
      await userEvent.click(likeButton);

      expect(spyOnLikeQuestion).toHaveBeenCalled();
      expect(likeButton).toHaveTextContent(String(prevLikeNum + 1));
      await delay(300);
      await waitFor(() => {
        expect(likeButton).toHaveTextContent(String(prevLikeNum));
      });
    });
  });
});

function setup(): {
  queryClient: QueryClient;
  waitForFinish: () => Promise<void>;
} {
  const { queryClient } = renderWithQueryClient(
    <InfiniteQuestionList panelId={panelId} />,
  );

  const waitForFinish = async (): Promise<void> =>
    waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

  return { queryClient, waitForFinish };
}

export function overrideLikeQuestionWithError(data: ErrorResponse): void {
  server.use(
    rest.post(apiUrl.question.like(':questionId'), async (_, res, ctx) =>
      /* 낙관적 업데이트 확인 위해 임의의 딜레이 설정 */
      res(ctx.delay(1000), ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

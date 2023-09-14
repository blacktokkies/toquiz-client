import type { Panel } from '@/lib/api/panel';
import type { ErrorResponse } from '@/lib/api/types';
import type { QueryClient } from '@tanstack/react-query';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { InfiniteQuestionList } from '@/components/panel/InfiniteQuestionList';
import { apiUrl } from '@/lib/api/apiUrl';
import * as questionApis from '@/lib/api/question';
import { renderWithQueryClient } from '@/lib/test-utils';
import { delay } from '@/lib/test-utils/delay';
import { createMockPanelId } from '@/mocks/data/panel';
import { createMockQuestion } from '@/mocks/data/question';
import { server } from '@/mocks/server';

vi.mock('@/hooks/useOverlay', () => ({ useOverlay: vi.fn() }));

function setup({ panelId }: { panelId: Panel['sid'] }): {
  queryClient: QueryClient;
} {
  const { queryClient } = renderWithQueryClient(
    <InfiniteQuestionList panelId={panelId} />,
  );

  return { queryClient };
}

describe('InfiniteQuestionList', () => {
  describe('질문 목록 렌더링', () => {
    it('질문 목록 가져오기 API를 호출하고 성공 시 질문 목록을 렌더링한다', async () => {
      const { questions } = overrideGetQuestionsWithSingleQuestion();
      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      setup({ panelId: createMockPanelId() });

      expect(spyOnGetQuestions).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText(questions[0].content)).toBeInTheDocument();
      });
    });

    it('사용자가 스크롤하면 getQuestions를 호출한다', async () => {
      const { queryClient } = setup({ panelId: createMockPanelId() });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      fireEvent.scroll(window);

      expect(spyOnGetQuestions).toHaveBeenCalledTimes(1);
    });
  });

  describe('질문 목록 정렬', () => {
    it('최신순 버튼을 누르면 최신순으로 질문 목록 API 호출한다', async () => {
      const panelId: Panel['sid'] = createMockPanelId();
      const { queryClient } = setup({ panelId });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      const recentButton = screen.getByRole('button', { name: '최신순' });
      await userEvent.click(recentButton);

      expect(spyOnGetQuestions).toHaveBeenCalledWith(panelId, {
        page: 0,
        sort: 'createdDate,DESC',
      });
    });

    it('좋아요순 버튼 누르면 좋아요순으로 질문 목록 API 호출한다', async () => {
      const panelId: Panel['sid'] = createMockPanelId();
      const { queryClient } = setup({ panelId });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
      const recentButton = screen.getByRole('button', { name: '최신순' });
      await userEvent.click(recentButton);
      const popularButton = screen.getByRole('button', { name: '좋아요순' });
      await userEvent.click(popularButton);

      expect(spyOnGetQuestions).toHaveBeenCalledWith(panelId, {
        page: 0,
      });
    });
  });

  describe('좋아요 버튼', () => {
    it('좋아요 버튼을 누르면 질문 좋아요 API 요청한다', async () => {
      const { queryClient } = setup({ panelId: createMockPanelId() });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');
      const likeButton = screen.getAllByRole('button', { name: /좋아요 / })[0];
      await userEvent.click(likeButton);

      expect(spyOnLikeQuestion).toHaveBeenCalled();
    });

    it('이때 좋아요 API 응답을 기다리지 않고 화면에 토글 결과를 보여준다', async () => {
      const { queryClient } = setup({ panelId: createMockPanelId() });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const spyOnLikeQuestion = vi.spyOn(questionApis, 'likeQuestion');
      const likeButton = screen.getAllByRole('button', { name: /좋아요 / })[0];
      const prevLikeNum = Number(likeButton.textContent);
      await userEvent.click(likeButton);

      expect(spyOnLikeQuestion).toHaveBeenCalled();
      expect(likeButton).toHaveTextContent(String(prevLikeNum + 1));
    });

    describe('좋아요 API가 에러를 응답하면 복구한다', () => {
      it('[400] 유효하지 않은 좋아요 활성화/비활성화 이면 기존 좋아요 개수로 보여준다', async () => {
        overrideGetQuestionsWithSingleQuestion();
        overrideLikeQuestionWithError({
          code: 'INVALID_ACTIVE_LIKE_QUESTION',
          statusCode: 400,
          message: '유효하지 않은 좋아요 활성화 요청입니다.',
        });
        const { queryClient } = setup({ panelId: createMockPanelId() });
        await waitFor(() => {
          expect(queryClient.isFetching()).toBe(0);
        });

        const likeButton = screen.getByRole('button', { name: /좋아요 / });
        const prevLikeNum = Number(likeButton.textContent);
        await userEvent.click(likeButton);

        await delay(300);
        await waitFor(() => {
          expect(likeButton).toHaveTextContent(String(prevLikeNum));
        });
      });
    });

    // TODO: 질문 목록에서 삭제하기 전에 토스트 띄워주면 좋을 거 같다
    it('[404] 질문이 존재하지 않습니다 이면 질문을 질문 목록에서 삭제한다', async () => {
      const { questions } = overrideGetQuestionsWithSingleQuestion();
      server.use(
        rest.post(apiUrl.question.like(':questionId'), async (_, res, ctx) => {
          questions.splice(0, 1);
          return res(
            ctx.status(404),
            ctx.json({
              code: 'NOT_EXIST_QUESTION',
              statusCode: 404,
              message: '해당 질문이 존재하지 않습니다.',
            }),
          );
        }),
      );
      const { queryClient } = setup({ panelId: createMockPanelId() });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const likeButton = screen.getByRole('button', { name: /좋아요 / });
      await userEvent.click(likeButton);

      await delay(300);
      expect(likeButton).not.toBeInTheDocument();
    });
  });
});

export function overrideLikeQuestionWithError(data: ErrorResponse): void {
  server.use(
    rest.post(apiUrl.question.like(':questionId'), async (_, res, ctx) =>
      /* 낙관적 업데이트 확인 위해 임의의 딜레이 설정 */
      res(ctx.delay(1000), ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

function overrideGetQuestionsWithSingleQuestion(): {
  questions: questionApis.Question[];
} {
  const questions = [{ ...createMockQuestion(), content: '안녕하세요' }];
  server.use(
    rest.get(apiUrl.question.getQuestions(':panelId'), async (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          statusCode: 200,
          result: { questions, nextPage: -1 },
        }),
      ),
    ),
  );

  return { questions };
}

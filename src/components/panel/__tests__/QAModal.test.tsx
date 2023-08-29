import type { Question } from '@/lib/api/question';
import type * as Vi from 'vitest';

import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { useRouteLoaderData } from 'react-router-dom';

import { QAModal } from '@/components/panel/QAModal';
import { useUserStore } from '@/hooks/stores/useUserStore';
import * as answerApis from '@/lib/api/answer';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockUser } from '@/mocks/data/auth';
import { createMockPanel } from '@/mocks/data/panel';
import { server } from '@/mocks/server';

vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useRouteLoaderData: vi.fn(() => createMockPanel()) };
});

vi.mock('@/hooks/stores/useUserStore', () => ({
  useUserStore: vi.fn(() => createMockUser()),
}));

const handleClose = vi.fn();
const isActived = true;
const handleLikeButtonClick = vi.fn();

const questionId: Question['id'] = -1;
describe('QAModal', () => {
  it('<- 아이콘을 누르면 close 함수가 호출된다', async () => {
    const { queryClient } = renderWithQueryClient(
      <QAModal
        close={handleClose}
        questionId={questionId}
        isActived={isActived}
        onLikeButtonClick={handleLikeButtonClick}
      />,
    );

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    const goBackButton = screen.getByRole('button', { name: /뒤로 가기/ });
    await userEvent.click(goBackButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it('답변 목록 API를 호출하고 성공 시 질문과 답변 목록을 보여준다', async () => {
    const spyOnGetAnswers = vi.spyOn(answerApis, 'getAnswers');

    server.use(
      rest.get(`/api/questions/:questionId/answers`, async (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            statusCode: 200,
            result: {
              id: 1,
              content: '질문이다',
              answerNum: 1,
              likeNum: 1,
              authorId: '64dcd6c6c00ec65a803f3a69',
              createdAt: '2023-08-16T23:05:18.309742',
              updatedAt: '2023-08-16T23:08:19.852377',
              answers: [
                {
                  id: 1,
                  content: '답변이다',
                  createdAt: '2023-08-16T23:08:19.844645',
                  updatedAt: '2023-08-16T23:08:19.844645',
                },
              ],
            },
          }),
        ),
      ),
    );

    const { queryClient } = renderWithQueryClient(
      <QAModal
        close={handleClose}
        questionId={questionId}
        isActived={isActived}
        onLikeButtonClick={handleLikeButtonClick}
      />,
    );

    expect(spyOnGetAnswers).toHaveBeenCalled();

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    expect(screen.getByText('질문이다')).toBeInTheDocument();
    expect(screen.getByText('답변이다')).toBeInTheDocument();
  });

  describe('답변 생성 인풋', () => {
    it('패널 생성자라면 답변 생성 폼을 보여준다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);

      const { queryClient } = renderWithQueryClient(
        <QAModal
          close={handleClose}
          questionId={questionId}
          isActived={isActived}
          onLikeButtonClick={handleLikeButtonClick}
        />,
      );

      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const form = screen.getByRole('form', { name: /답변 생성 폼/ });
      expect(form).toBeInTheDocument();
    });

    it('패널 생성자가 아니면 답변 생성 폼을 보여주지 않는다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id + 1);

      const { queryClient } = renderWithQueryClient(
        <QAModal
          close={handleClose}
          questionId={questionId}
          isActived={isActived}
          onLikeButtonClick={handleLikeButtonClick}
        />,
      );

      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      expect(
        screen.queryByRole('form', { name: /답변 생성 폼/ }),
      ).not.toBeInTheDocument();
    });
  });
});

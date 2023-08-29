import type {
  Answer,
  CreateAnswerBody,
  CreateAnswerPathParams,
  CreateAnswerResponse,
  GetAnswersPathParams,
  GetAnswersResponse,
} from '@/lib/api/answer';
import type { Question } from '@/lib/api/question';
import type * as Vi from 'vitest';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { useRouteLoaderData } from 'react-router-dom';

import { QAModal } from '@/components/panel/QAModal';
import { useUserStore } from '@/hooks/stores/useUserStore';
import * as answerApis from '@/lib/api/answer';
import { apiUrl } from '@/lib/api/apiUrl';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockAnswer } from '@/mocks/data/answer';
import { createMockUser } from '@/mocks/data/auth';
import { createMockPanel } from '@/mocks/data/panel';
import { createMockQuestion } from '@/mocks/data/question';
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
    const { waitForFetching } = setup();
    await waitForFetching();

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

    const { waitForFetching } = setup();
    expect(spyOnGetAnswers).toHaveBeenCalled();
    await waitForFetching();

    expect(screen.getByText('질문이다')).toBeInTheDocument();
    expect(screen.getByText('답변이다')).toBeInTheDocument();
  });

  describe('답변 생성 폼', () => {
    it('패널 생성자라면 답변 생성 폼을 보여준다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);
      const { waitForFetching } = setup();
      await waitForFetching();

      const expandFormButton = screen.getByRole('button', {
        name: /답변 생성 폼/,
      });

      expect(expandFormButton).toBeInTheDocument();
    });

    it('패널 생성자가 아니면 답변 생성 폼을 보여주지 않는다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id + 1);
      const { waitForFetching } = setup();
      await waitForFetching();

      expect(
        screen.queryByRole('button', {
          name: /답변 생성 폼 열기/,
        }),
      ).not.toBeInTheDocument();
    });

    it('닫힌 폼을 누르면 확장되며, 폼 바깥을 누르면 닫힌다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);
      const { waitForFetching } = setup();
      await waitForFetching();

      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      expect(formContainer).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(formContainer);
      expect(formContainer).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(document.body);
      expect(formContainer).toHaveAttribute('aria-expanded', 'false');
    });

    it('사용자가 한 글자 이상 입력했다면 폼 바깥을 눌러도 닫지 않는다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);
      const { waitForFetching } = setup();
      await waitForFetching();

      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      await userEvent.click(formContainer);
      const answerInput = screen.getByRole('textbox');
      fireEvent.change(answerInput, { target: { value: '안녕' } });
      await userEvent.click(document.body);

      expect(formContainer).toHaveAttribute('aria-expanded', 'true');
    });

    it('취소 버튼 누르면 폼을 닫는다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);
      const { waitForFetching } = setup();
      await waitForFetching();

      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      await userEvent.click(formContainer);
      const closeButton = screen.getByRole('button', { name: /취소/ });
      await userEvent.click(closeButton);

      expect(formContainer).toHaveAttribute('aria-expanded', 'false');
    });

    it('사용자가 0자 혹은 200자 초과로 입력하면 제출 버튼을 비활성화한다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);
      const { waitForFetching } = setup();
      await waitForFetching();

      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      await userEvent.click(formContainer);
      const answerInput = screen.getByRole('textbox');
      const submitButton = screen.getByRole<HTMLButtonElement>('button', {
        name: '답변 생성',
      });
      fireEvent.change(answerInput, { target: { value: '' } });

      expect(submitButton.disabled).toBe(true);
    });

    it('사용자가 입력하는 글자수를 보여준다', async () => {
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);
      const { waitForFetching } = setup();
      await waitForFetching();

      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      await userEvent.click(formContainer);
      const answerInput = screen.getByRole('textbox');
      fireEvent.change(answerInput, { target: { value: '안녕하세요' } });

      expect(screen.getByText(/5자/)).toBeInTheDocument();
    });

    it('답변 제출하면 일단 화면에 보여준다', async () => {
      const answers: Answer[] = [];
      server.use(
        rest.get<never, GetAnswersPathParams, GetAnswersResponse>(
          apiUrl.answer.getAnswers(':questionId'),
          async (req, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                statusCode: 200,
                result: {
                  ...createMockQuestion(),
                  id: questionId,
                  answers,
                },
              }),
            ),
        ),
      );

      server.use(
        rest.post<
          CreateAnswerBody,
          CreateAnswerPathParams,
          CreateAnswerResponse
        >(apiUrl.answer.create(':panelId'), async (req, res, ctx) => {
          const { content }: CreateAnswerBody = await req.json();
          const answer = {
            ...createMockAnswer(),
            content,
          };
          answers.push(answer);

          return res(
            ctx.status(200),
            ctx.json({
              statusCode: 200,
              result: answer,
            }),
          );
        }),
      );
      const spyOnCreateAnswer = vi.spyOn(answerApis, 'createAnswer');
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);

      const { waitForFetching } = setup();
      await waitForFetching();
      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      await userEvent.click(formContainer);
      const answerInput = screen.getByRole('textbox');
      fireEvent.change(answerInput, { target: { value: '안녕하세요' } });
      const submitButton = screen.getByRole('button', {
        name: '답변 생성',
      });
      await userEvent.click(submitButton);

      expect(spyOnCreateAnswer).toHaveBeenCalled();
      expect(screen.getAllByText(/안녕하세요/)[1]).toBeInTheDocument();
    });

    it('답변 제출하면 답변 생성 API를 호출하고 성공 시 폼을 닫는다', async () => {
      const spyOnCreateAnswer = vi.spyOn(answerApis, 'createAnswer');
      const panel = createMockPanel();
      (useRouteLoaderData as Vi.Mock).mockImplementation(() => panel);
      (useUserStore as Vi.Mock).mockImplementation(() => panel.author.id);

      const { waitForFetching } = setup();
      await waitForFetching();
      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      await userEvent.click(formContainer);
      const answerInput = screen.getByRole('textbox');
      fireEvent.change(answerInput, { target: { value: '안녕하세요' } });
      const submitButton = screen.getByRole('button', {
        name: '답변 생성',
      });
      await userEvent.click(submitButton);

      expect(spyOnCreateAnswer).toHaveBeenCalled();
      await waitFor(() => {
        expect(formContainer).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });
});

function setup(): {
  waitForFetching: () => Promise<void>;
} {
  const { queryClient } = renderWithQueryClient(
    <QAModal
      close={handleClose}
      questionId={questionId}
      isActived={isActived}
      onLikeButtonClick={handleLikeButtonClick}
    />,
  );

  const waitForFetching = async (): Promise<void> =>
    waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
  return { waitForFetching };
}

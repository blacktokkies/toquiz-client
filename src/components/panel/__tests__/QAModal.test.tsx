import type {
  Answer,
  CreateAnswerBody,
  CreateAnswerPathParams,
  CreateAnswerResponse,
  GetAnswersPathParams,
  GetAnswersResponse,
} from '@/lib/api/answer';
import type { Panel } from '@/lib/api/panel';
import type { Question } from '@/lib/api/question';
import type { UserState } from '@/store/user-store';
import type { QueryClient } from '@tanstack/react-query';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { QAModal } from '@/components/panel/QAModal';
import * as answerApis from '@/lib/api/answer';
import { apiUrl } from '@/lib/api/apiUrl';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockAnswer } from '@/mocks/data/answer';
import { createMockUserId } from '@/mocks/data/auth';
import { createMockPanel } from '@/mocks/data/panel';
import {
  createMockQuestion,
  createMockQuestionId,
} from '@/mocks/data/question';
import { server } from '@/mocks/server';

const mockParams = vi.fn<[], { panelId: string }>();
vi.mock('react-router-dom', () => ({
  useParams: () => mockParams(),
}));

const mockPanelDetailQuery = vi.fn<[], { data: Panel }>();
vi.mock('@/hooks/queries/panel', () => ({
  usePanelDetailQuery: () => mockPanelDetailQuery(),
}));

const mockUserId = vi.fn<[], UserState['id']>();
vi.mock('@/hooks/stores/useUserStore', () => ({
  useUserStore: () => mockUserId(),
}));

const handleClose = vi.fn();
const handleLikeButtonClick = vi.fn();
function setup({
  panel = createMockPanel(),
  userId = createMockUserId(),
  questionId = createMockQuestionId(),
  isActived = false,
}: {
  panel?: Panel;
  userId?: UserState['id'];
  questionId?: Question['id'];
  isActived?: boolean;
} = {}): {
  queryClient: QueryClient;
} {
  mockParams.mockImplementation(() => ({
    panelId: panel.sid,
  }));
  mockPanelDetailQuery.mockImplementation(() => ({ data: panel }));
  mockUserId.mockImplementation(() => userId);

  const { queryClient } = renderWithQueryClient(
    <QAModal
      close={handleClose}
      questionId={questionId}
      isActived={isActived}
      onLikeButtonClick={handleLikeButtonClick}
    />,
  );

  return { queryClient };
}
describe('QAModal', () => {
  it('<- 아이콘을 누르면 close 함수가 호출된다', async () => {
    const { queryClient } = setup();
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
      rest.get(`/api/questions/:questionId/answers`, async (req, res, ctx) => {
        const questionId = req.params.questionId;

        return res(
          ctx.status(200),
          ctx.json({
            statusCode: 200,
            result: {
              id: questionId,
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
        );
      }),
    );

    const { queryClient } = setup();
    expect(spyOnGetAnswers).toHaveBeenCalled();
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    expect(screen.getByText('질문이다')).toBeInTheDocument();
    expect(screen.getByText('답변이다')).toBeInTheDocument();
  });

  describe('답변 생성 폼', () => {
    it('패널 생성자라면 답변 생성 폼을 보여준다', async () => {
      const panel = createMockPanel();
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const expandFormButton = screen.getByRole('button', {
        name: /답변 생성 폼/,
      });

      expect(expandFormButton).toBeInTheDocument();
    });

    it('패널 생성자가 아니면 답변 생성 폼을 보여주지 않는다', async () => {
      const panel = createMockPanel();
      const { queryClient } = setup({
        panel,
        userId: panel.author.id + 1,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      expect(
        screen.queryByRole('button', {
          name: /답변 생성 폼 열기/,
        }),
      ).not.toBeInTheDocument();
    });

    it('닫힌 폼을 누르면 확장되며, 폼 바깥을 누르면 닫힌다', async () => {
      const panel = createMockPanel();
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

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
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

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
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

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
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

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
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });

      const formContainer = screen.getByRole('button', {
        name: /답변 생성 폼 열기/,
      });
      await userEvent.click(formContainer);
      const answerInput = screen.getByRole('textbox');
      fireEvent.change(answerInput, { target: { value: '안녕하세요' } });

      expect(screen.getByText(/5자/)).toBeInTheDocument();
    });

    it('답변 제출하면 일단 화면에 보여준다', async () => {
      const questionId = createMockQuestionId();
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
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
        questionId: createMockQuestionId(),
        isActived: true,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });
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
      expect(screen.getByRole('listitem')).toHaveTextContent('안녕하세요');
    });

    it('답변 제출하면 답변 생성 API를 호출하고 성공 시 폼을 닫는다', async () => {
      const spyOnCreateAnswer = vi.spyOn(answerApis, 'createAnswer');
      const panel = createMockPanel();
      const { queryClient } = setup({
        panel,
        userId: panel.author.id,
      });
      await waitFor(() => {
        expect(queryClient.isFetching()).toBe(0);
      });
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

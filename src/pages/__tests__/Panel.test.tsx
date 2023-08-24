import type { Panel as PanelData } from '@/lib/api/panel';
import type {
  GetQuestionsPathParams,
  GetQuestionsResponse,
} from '@/lib/api/question';

import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { apiUrl } from '@/lib/api/apiUrl';
import { API_BASE_URL } from '@/lib/apiClient';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanel } from '@/mocks/data/panel';
import { createMockQuestionList } from '@/mocks/data/question';
import { server } from '@/mocks/server';
import { Panel } from '@/pages/Panel';

const panel: PanelData = createMockPanel();

vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useLoaderData: vi.fn(() => panel) };
});

describe('패널 페이지', () => {
  it('헤더를 보여준다', () => {
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('질문 목록을 렌더링한다', async () => {
    const questions = createMockQuestionList(3);
    overrideGetQuestionsWithSuccess({
      statusCode: 200,
      result: {
        questions,
        nextPage: -1,
      },
    });
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(questions[0].content)).toBeInTheDocument();
    });
  });

  it('질문 생성 모달 열기 버튼을 누르면 질문 생성 모달을 보여준다', async () => {
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    const openButton = screen.getByRole('button', {
      name: /질문 생성 모달 열기/,
    });
    await userEvent.click(openButton);

    expect(screen.getByRole('dialog', { name: /질문 생성 모달/ }));
  });
});

export function overrideGetQuestionsWithSuccess(
  data: GetQuestionsResponse,
): void {
  server.use(
    rest.get<never, GetQuestionsPathParams, GetQuestionsResponse>(
      `${API_BASE_URL}${apiUrl.question.getQuestions(':panelId')}`,
      async (req, res, ctx) => res(ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

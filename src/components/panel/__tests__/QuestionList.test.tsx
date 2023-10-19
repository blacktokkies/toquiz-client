import type { Panel } from '@/lib/api/panel';
import type { GetQuestionsParams, QuestionPage } from '@/lib/api/question';
import type { QueryClient } from '@tanstack/react-query';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QuestionList } from '@/components/panel/QuestionList';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanel, createMockPanelId } from '@/mocks/data/panel';
import { createMockQuestionList } from '@/mocks/data/question';

vi.mock('@/hooks/queries/active-info', async (importOriginal) => {
  const queries = (await importOriginal()) ?? {};
  return {
    ...queries,
    useActiveInfoDetailQuery: vi.fn(() => ({
      data: {
        createdIds: [],
        likedIds: [],
      },
    })),
  };
});

const mockParams = vi.fn<[], { panelId: string }>();
vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useParams: () => mockParams() };
});

const mockPanelDetailQuery = vi.fn<[], { data: Panel }>();
vi.mock('@/hooks/queries/panel', async (importOriginal) => {
  const queries = (await importOriginal()) ?? {};
  return { ...queries, usePanelDetailQuery: () => mockPanelDetailQuery() };
});

function setup({
  panelId,
  sort,
  questionPages,
}: {
  panelId: Panel['sid'];
  sort: GetQuestionsParams['sort'];
  questionPages: QuestionPage[];
}): {
  queryClient: QueryClient;
} {
  mockParams.mockImplementation(() => ({ panelId }));
  mockPanelDetailQuery.mockImplementation(() => ({
    data: { panelId, ...createMockPanel() },
  }));

  const { queryClient } = renderWithQueryClient(
    <OverlayProvider>
      <QuestionList
        panelId={panelId}
        sort={sort}
        questionPages={questionPages}
      />
      ,
    </OverlayProvider>,
  );

  return { queryClient };
}

describe('QuestionList', () => {
  it('질문을 누르면 모달을 보여준다', async () => {
    setup({
      panelId: createMockPanelId(),
      sort: undefined,
      questionPages: [
        {
          questions: createMockQuestionList(3),
          nextPage: -1,
        },
      ],
    });

    const questionItem = screen.getAllByRole('button', {
      name: /질문과 답변 모달 열기/,
    })[0];
    await userEvent.click(questionItem);

    expect(
      screen.getByRole('dialog', { name: /질문과 답변 모달/ }),
    ).toBeInTheDocument();
  });

  it('모달에서 <- 아이콘 누르면 모달이 닫힌다', async () => {
    setup({
      panelId: createMockPanelId(),
      sort: undefined,
      questionPages: [
        {
          questions: createMockQuestionList(3),
          nextPage: -1,
        },
      ],
    });

    const questionItem = screen.getAllByRole('button', {
      name: /질문과 답변 모달 열기/,
    })[0];
    await userEvent.click(questionItem);
    const dialog = screen.getByRole('dialog', { name: /질문과 답변 모달/ });
    const goBackButton = screen.getByRole('button', { name: /뒤로 가기/ });
    await userEvent.click(goBackButton);

    expect(dialog).not.toBeInTheDocument();
  });
});

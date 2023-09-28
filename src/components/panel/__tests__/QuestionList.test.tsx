import type { Panel } from '@/lib/api/panel';
import type { GetQuestionsParams, QuestionPage } from '@/lib/api/question';
import type { QueryClient } from '@tanstack/react-query';
import type * as Vi from 'vitest';

import React from 'react';

import { screen } from '@testing-library/react';

import { QuestionList } from '@/components/panel/QuestionList';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { useActiveInfoDetailQuery } from '@/hooks/queries/active-info';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanel, createMockPanelId } from '@/mocks/data/panel';
import {
  createMockQuestion,
  createMockQuestionList,
} from '@/mocks/data/question';

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

vi.mock('react-router-dom', () => ({
  useRouteLoaderData: vi.fn(() => createMockPanel()),
}));

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
  likeButton: HTMLButtonElement;
  questionItem: HTMLElement;
} {
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

  const likeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /좋아요 버튼/,
  });
  const questionItem = screen.getByRole('button', {
    name: /질문과 답변 모달 열기/,
  });

  return { queryClient, likeButton, questionItem };
}

describe('QuestionList', () => {
  it('질문마다 답변 개수를 보여준다', () => {
    setup({
      panelId: createMockPanelId(),
      sort: undefined,
      questionPages: [
        {
          questions: [{ ...createMockQuestion(), answerNum: 3 }],
          nextPage: -1,
        },
      ],
    });

    expect(screen.getByText(`답변 3개`)).toBeInTheDocument();
  });

  it('질문에 답변이 없으면 답변 개수를 보여주지 않는다', () => {
    setup({
      panelId: createMockPanelId(),
      sort: undefined,
      questionPages: [
        {
          questions: [{ ...createMockQuestion(), answerNum: 0 }],
          nextPage: -1,
        },
      ],
    });

    expect(screen.queryByText(`답변 0개`)).not.toBeInTheDocument();
  });

  describe('likedIds', () => {
    it('likedIds에 속한 질문은 좋아요 버튼이 활성화되어있다', () => {
      const question = createMockQuestion();
      (useActiveInfoDetailQuery as Vi.Mock).mockImplementation(() => ({
        data: {
          createdIds: [],
          likedIds: [question.id],
        },
      }));
      const { likeButton } = setup({
        panelId: createMockPanelId(),
        sort: undefined,
        questionPages: [
          {
            questions: [question],
            nextPage: -1,
          },
        ],
      });
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('likedIds에 속하지 않은 질문은 좋아요 버튼이 비활성화되어있다', () => {
      const { likeButton } = setup({
        panelId: createMockPanelId(),
        sort: undefined,
        questionPages: [
          {
            questions: createMockQuestionList(1),
            nextPage: -1,
          },
        ],
      });
      expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    });
  });
});

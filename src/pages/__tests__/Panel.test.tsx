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
import { createMockQuestion } from '@/mocks/data/question';
import { server } from '@/mocks/server';
import { Component as Panel } from '@/pages/Panel';

const mockCurrentPanelId = vi.fn<[], PanelData['sid']>();
vi.mock('@/hooks/useCurrentPanelId', () => ({
  useCurrentPanelId: () => mockCurrentPanelId(),
}));

const mockPanelDetailQuery = vi.fn<[], { data: PanelData }>();
vi.mock('@/hooks/queries/panel', async (importOriginal) => {
  const queries = (await importOriginal()) ?? {};
  return { ...queries, usePanelDetailQuery: () => mockPanelDetailQuery() };
});

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

function setup({ panel }: { panel: PanelData }): void {
  mockCurrentPanelId.mockImplementation(() => panel.sid);
  mockPanelDetailQuery.mockImplementation(() => ({
    data: panel,
  }));

  renderWithQueryClient(
    <OverlayProvider>
      <Panel />
    </OverlayProvider>,
  );
}

describe('패널 페이지', () => {
  it('헤더를 보여준다', () => {
    setup({ panel: createMockPanel() });

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('질문 목록을 렌더링한다', async () => {
    overrideGetQuestionsWithSuccess({
      statusCode: 200,
      result: {
        questions: [{ ...createMockQuestion(), content: '안녕하세요' }],
        nextPage: -1,
      },
    });

    setup({ panel: createMockPanel() });

    await waitFor(() => {
      expect(screen.getAllByText(/안녕하세요/)[0]).toBeInTheDocument();
    });
  });

  it('질문 생성 모달 열기 버튼을 누르면 질문 생성 모달을 보여준다', async () => {
    setup({ panel: createMockPanel() });

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

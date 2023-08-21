import type { Panel as PanelData } from '@/lib/api/panel';

import React from 'react';

import { screen, waitFor } from '@testing-library/react';

import { OverlayProvider } from '@/contexts/OverlayContext';
import * as questionApis from '@/lib/api/question';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockPanel } from '@/mocks/data/panel';
import { mockQuestionList } from '@/mocks/data/question';
import { Panel } from '@/pages/Panel';

const panel: PanelData = createMockPanel();

vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useLoaderData: vi.fn(() => panel) };
});

describe('패널 페이지', () => {
  it('헤더를 보여준다', async () => {
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  it('질문 목록 가져오기 API를 호출하고 성공 시 질문 목록을 렌더링한다', async () => {
    const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    expect(spyOnGetQuestions).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getAllByText(mockQuestionList[0].content)[0],
      ).toBeInTheDocument();
    });
  });
});

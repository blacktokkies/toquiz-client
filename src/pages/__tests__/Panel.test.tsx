import type { Panel as PanelData } from '@/lib/api/panel';

import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverlayProvider } from '@/contexts/OverlayContext';
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
  it('헤더를 보여준다', () => {
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('질문 목록을 렌더링한다', async () => {
    renderWithQueryClient(
      <OverlayProvider>
        <Panel />
      </OverlayProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getAllByText(mockQuestionList[0].content)[0],
      ).toBeInTheDocument();
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

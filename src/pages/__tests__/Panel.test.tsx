import type { Panel as PanelData } from '@/lib/api/panel';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { renderWithAllProviders } from '@/lib/test-utils';
import { createMockPanel } from '@/mocks/data/panel';
import { Panel } from '@/pages/Panel';

const panel: PanelData = createMockPanel();

vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useLoaderData: vi.fn(() => panel) };
});

describe('패널 페이지', () => {
  it('헤더를 보여준다', () => {
    renderWithAllProviders(<Panel />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  describe('패널 페이지 헤더', () => {
    it('패널 이름을 보여준다', () => {
      renderWithAllProviders(<Panel />);

      expect(screen.getByRole('heading')).toHaveTextContent(panel.title);
    });

    it('내 계정 아이콘을 누르면 계정 액션 메뉴를 보여준다', async () => {
      renderWithAllProviders(
        <MemoryRouter>
          <Panel />
        </MemoryRouter>,
      );

      const accountButton = screen.getByRole('button', {
        name: /내 계정/,
      });
      await userEvent.click(accountButton);

      expect(screen.getByRole('dialog', { name: /내 계정 액션 메뉴/ }));
    });

    it('메뉴 아이콘을 누르면 사이드시트를 보여준다', async () => {
      renderWithAllProviders(
        <MemoryRouter>
          <Panel />
        </MemoryRouter>,
      );

      const menuButton = screen.getByRole('button', { name: /메뉴 열기/ });
      await userEvent.click(menuButton);

      expect(
        screen.getByRole('complementary', { name: /메뉴/ }),
      ).toBeInTheDocument();
    });
  });
});

import type { Panel as PanelData } from '@/lib/api/panel';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { PanelHeader } from '@/components/panel/PanelHeader';
import { renderWithAllProviders } from '@/lib/test-utils';
import { createMockPanel } from '@/mocks/data/panel';

const panel: PanelData = createMockPanel();

describe('패널 페이지 헤더', () => {
  it('패널 이름을 보여준다', () => {
    const { title } = setup();

    expect(title).toHaveTextContent(panel.title);
  });

  it('내 계정 아이콘을 누르면 계정 액션 메뉴를 보여준다', async () => {
    const { accountButton } = setup();
    await userEvent.click(accountButton);

    expect(screen.getByRole('dialog', { name: /내 계정 액션 메뉴/ }));
  });

  it('메뉴 아이콘을 누르면 사이드시트를 보여준다', async () => {
    const { menuButton } = setup();
    await userEvent.click(menuButton);

    expect(
      screen.getByRole('complementary', { name: /메뉴/ }),
    ).toBeInTheDocument();
  });
});

function setup(): {
  title: HTMLHeadingElement;
  menuButton: HTMLButtonElement;
  accountButton: HTMLButtonElement;
} {
  renderWithAllProviders(
    <MemoryRouter>
      <PanelHeader panel={panel} />
    </MemoryRouter>,
  );

  const title = screen.getByRole<HTMLHeadingElement>('heading');
  const menuButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /메뉴 열기/,
  });
  const accountButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /내 계정/,
  });

  return { title, menuButton, accountButton };
}

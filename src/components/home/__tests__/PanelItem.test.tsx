import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PanelItem } from '@/components/home/PanelItem';

const panel: Panel = {
  id: 1,
  author: 'test@email.com',
  title: '테스트 패널 제목',
  description: '테스트 패널 설명',
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
};

const handleOpenActionMenu = vi.fn();
const handleTitleClick = vi.fn();

describe('PanelItem', () => {
  it('패널 제목과 설명을 렌더링한다', () => {
    setup();
    expect(screen.getByText(/패널 제목/)).toBeInTheDocument();
    expect(screen.getByText(/패널 설명/)).toBeInTheDocument();
  });

  it('더보기 아이콘을 누르면 openActionMenu 함수를 호출한다', async () => {
    const { moreButton } = setup();
    await userEvent.click(moreButton);

    expect(handleOpenActionMenu).toHaveBeenCalled();
  });

  it('패널 제목을 누르면 onPanelTitleClick 함수를 호출한다', async () => {
    const { titleButton } = setup();
    await userEvent.click(titleButton);

    expect(handleTitleClick).toHaveBeenCalled();
  });
});

function setup(): {
  moreButton: HTMLButtonElement;
  titleButton: HTMLButtonElement;
} {
  render(
    <PanelItem
      panel={panel}
      openActionMenu={handleOpenActionMenu}
      onPanelTitleClick={handleTitleClick}
    />,
  );

  const moreButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /더보기/,
  });
  const titleButton = screen.getByRole<HTMLButtonElement>('button', {
    name: panel.title,
  });

  return { moreButton, titleButton };
}

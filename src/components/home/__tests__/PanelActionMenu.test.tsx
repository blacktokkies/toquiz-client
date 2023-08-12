import React from 'react';

import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PanelActionMenu } from '@/components/home/PanelActionMenu';

const handleClose = vi.fn();
const handleUpdatePanel = vi.fn();

describe('PanelActionMenu', () => {
  it('패널 수정하기 버튼을 누르면 onUpdatePanelButtonClick을 호출한다', async () => {
    const { updateButton } = setup();
    await userEvent.click(updateButton);

    expect(handleUpdatePanel).toHaveBeenCalled();
  });
});

function setup(): {
  updateButton: HTMLElement;
} {
  render(
    <PanelActionMenu
      close={handleClose}
      onUpdatePanelButtonClick={handleUpdatePanel}
    />,
  );

  const updateButton = screen.getByRole('button', {
    name: /패널 수정하기/,
  });

  return { updateButton };
}

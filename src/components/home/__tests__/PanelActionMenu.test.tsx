import React from 'react';

import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PanelActionMenu } from '@/components/home/PanelActionMenu';

const handleClose = vi.fn();
const handleUpdatePanel = vi.fn();
const handleDeletePanelButtonClick = vi.fn();

describe('PanelActionMenu', () => {
  it('패널 수정하기 버튼을 누르면 onUpdatePanelButtonClick을 호출한다', async () => {
    const { updateButton } = setup();
    await userEvent.click(updateButton);

    expect(handleUpdatePanel).toHaveBeenCalled();
  });

  it('패널 삭제 버튼을 누르면 onDeletePanelButtonClick을 호출한다', async () => {
    const { deleteButton } = setup();
    await userEvent.click(deleteButton);

    expect(handleDeletePanelButtonClick).toHaveBeenCalled();
  });
});

function setup(): {
  updateButton: HTMLElement;
  deleteButton: HTMLElement;
} {
  render(
    <PanelActionMenu
      close={handleClose}
      onUpdatePanelButtonClick={handleUpdatePanel}
      onDeleteButtonClick={handleDeletePanelButtonClick}
    />,
  );

  const updateButton = screen.getByRole('button', {
    name: /패널 수정하기/,
  });
  const deleteButton = screen.getByRole('button', {
    name: /패널 삭제하기/,
  });

  return { updateButton, deleteButton };
}

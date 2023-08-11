import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ActionMenuController } from '@/components/system/ActionMenuController';

const handleClose = vi.fn();

describe('ActionMenuController', () => {
  it('액션 메뉴 안쪽을 누르면 close 함수가 호출되지 않는다', async () => {
    render(
      <ActionMenuController close={handleClose}>
        <div>액션 메뉴</div>
      </ActionMenuController>,
    );

    const overlay = screen.getByText(/액션 메뉴/);
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('액션 메뉴 바깥을 누르면 close 함수가 호출된다', async () => {
    render(
      <ActionMenuController close={handleClose}>
        <div>액션 메뉴</div>
      </ActionMenuController>,
    );

    await userEvent.click(document.body);

    expect(handleClose).toHaveBeenCalled();
  });
});

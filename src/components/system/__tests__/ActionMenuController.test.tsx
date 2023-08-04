import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ActionMenuController } from '@/components/system/ActionMenuController';

describe('ActionMenuController', () => {
  const handleClose = vi.fn();

  it('액션 메뉴 안쪽을 누르면 close 함수가 호출되지 않는다', async () => {
    render(
      <ActionMenuController
        createActionMenuContent={() => <div>액션 메뉴</div>}
        close={handleClose}
      />,
    );

    const overlay = screen.getByText(/액션 메뉴/);
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('액션 메뉴 바깥을 누르면 close 함수가 호출된다', async () => {
    render(
      <ActionMenuController
        createActionMenuContent={() => <>오버레이</>}
        close={handleClose}
      />,
    );

    await userEvent.click(document.body);

    expect(handleClose).toHaveBeenCalled();
  });
});

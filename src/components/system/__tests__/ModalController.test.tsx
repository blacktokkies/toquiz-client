import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ModalController } from '@/components/system/ModalController';

describe('ModalController', () => {
  const handleClose = vi.fn();

  it('오버레이 안쪽을 누르면 close 함수가 호출되지 않는다', async () => {
    render(
      <ModalController
        createModalContent={() => <div>오버레이</div>}
        close={handleClose}
      />,
    );

    const overlay = screen.getByText(/오버레이/);
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('오버레이 바깥을 누르면 close 함수가 호출된다', async () => {
    render(
      <ModalController
        createModalContent={() => <>오버레이</>}
        close={handleClose}
      />,
    );

    await userEvent.click(document.body);

    expect(handleClose).toHaveBeenCalled();
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ModalController } from '@/components/system/ModalController';

describe('ModalController', () => {
  const handleClose = vi.fn();

  it('모달 안쪽을 누르면 close 함수가 호출되지 않는다', async () => {
    render(<ModalController close={handleClose}>모달</ModalController>);

    const overlay = screen.getByText(/모달/);
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('모달 바깥을 누르면 close 함수가 호출된다', async () => {
    render(<ModalController close={handleClose}>모달</ModalController>);

    await userEvent.click(document.body);

    expect(handleClose).toHaveBeenCalled();
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverlayController } from '@/components/system/OverlayController';

const handleClose = vi.fn();

describe('OverlayController', () => {
  it('오버레이 안쪽을 누르면 close 함수가 호출되지 않는다', async () => {
    render(<OverlayController close={handleClose}>오버레이</OverlayController>);

    const overlay = screen.getByText(/오버레이/);
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('오버레이 바깥을 누르면 close 함수가 호출된다', async () => {
    render(<OverlayController close={handleClose}>오버레이</OverlayController>);

    await userEvent.click(document.body);

    expect(handleClose).toHaveBeenCalled();
  });
});

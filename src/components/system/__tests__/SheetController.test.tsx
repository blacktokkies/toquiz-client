import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SheetController } from '@/components/system/SheetController';

describe('SheetController', () => {
  const handleClose = vi.fn();

  it('시트 안쪽을 누르면 close 함수가 호출되지 않는다', async () => {
    render(<SheetController close={handleClose}>시트</SheetController>);

    const overlay = screen.getByText(/시트/);
    await userEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('시트 바깥을 누르면 close 함수가 호출된다', async () => {
    render(<SheetController close={handleClose}>시트</SheetController>);

    await userEvent.click(document.body);

    expect(handleClose).toHaveBeenCalled();
  });
});

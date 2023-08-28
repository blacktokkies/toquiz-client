import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QAModal } from '@/components/panel/QAModal';

const handleClose = vi.fn();

describe('QAModal', () => {
  it('<- 아이콘을 누르면 close 함수가 호출된다', async () => {
    render(<QAModal close={handleClose} />);

    const goBackButton = screen.getByRole('button', { name: /뒤로 가기/ });
    await userEvent.click(goBackButton);
    expect(handleClose).toHaveBeenCalled();
  });
});

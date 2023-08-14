import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeletePanelModal } from '../DeletePanelModal';

const handleClose = vi.fn();

describe('DeletePanelModal', () => {
  it('패널 삭제하기 헤딩을 보여준다', () => {
    setup();

    expect(screen.getByRole('heading')).toHaveTextContent(/패널 삭제하기/);
  });
  it('취소 버튼을 누르면 close 함수가 호출된다', async () => {
    const { closeButton } = setup();
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });
});

function setup(): {
  closeButton: HTMLElement;
} {
  render(<DeletePanelModal close={handleClose} />);

  const closeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /취소/,
  });

  return { closeButton };
}

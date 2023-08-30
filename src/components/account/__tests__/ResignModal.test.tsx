import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ResignModal } from '@/components/account/ResignModal';

const handleClose = vi.fn();
describe('ResignModal', () => {
  it('회원 탈퇴하기 헤딩을 보여준다', () => {
    render(<ResignModal close={handleClose} />);

    expect(screen.getByRole('heading')).toHaveTextContent('회원 탈퇴하기');
  });

  it('취소 버튼을 누르면 close 함수를 호출한다', async () => {
    render(<ResignModal close={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /취소/ });
    await userEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});

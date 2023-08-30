import type * as Vi from 'vitest';

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ResignModal } from '@/components/account/ResignModal';
import { isPassword } from '@/lib/validator';

vi.mock('@/lib/validator', () => ({
  isPassword: vi.fn(() => true),
}));

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

  it('사용자가 유효하지 않은 비밀번호를 입력하면 에러 메시지를 보여준다', async () => {
    (isPassword as Vi.Mock).mockImplementation(() => false);
    render(<ResignModal close={handleClose} />);

    const passwordInput = screen.getByLabelText('비밀번호');
    await userEvent.type(passwordInput, '유효하지 않은 비밀번호');

    expect(
      screen.getByText(
        '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      ),
    ).toBeInTheDocument();
  });
});

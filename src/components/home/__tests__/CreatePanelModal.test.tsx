import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreatePanelModal } from '@/components/home/CreatePanelModal';

const handleClose = vi.fn();

describe('CretaePanelModal', () => {
  it('패널 생성하기 헤딩을 보여준다', () => {
    render(<CreatePanelModal close={handleClose} />);

    expect(screen.getByRole('heading')).toHaveTextContent(/패널 생성하기/);
  });

  it('패널 생성하기 폼을 보여준다', () => {
    render(<CreatePanelModal close={handleClose} />);

    expect(screen.getByRole('form', { name: '패널 생성' })).toBeInTheDocument();
  });

  it('취소 버튼을 누르면 close 함수가 호출된다', async () => {
    render(<CreatePanelModal close={handleClose} />);
    const closeButton = screen.getByRole('button', { name: /취소/ });
    await userEvent.click(closeButton);
    expect(handleClose).toBeCalled();
  });

  it('패널 생성 버튼을 누르면 close 함수가 호출된다', async () => {
    render(<CreatePanelModal close={handleClose} />);
    const createButton = screen.getByRole('button', { name: /패널 생성/ });
    await userEvent.click(createButton);
    expect(handleClose).toBeCalled();
  });
});

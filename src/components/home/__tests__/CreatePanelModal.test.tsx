import type * as Vi from 'vitest';

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreatePanelModal } from '@/components/home/CreatePanelModal';
import { isPanelTitle } from '@/lib/validator';

vi.mock('@/lib/validator', () => ({
  isPanelTitle: vi.fn(),
  isPanelDescription: vi.fn(),
}));

describe('CretaePanelModal', () => {
  const handleClose = vi.fn();

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

  it('유효하지 않은 패널 제목 입력하면 에러 메시지를 보여준다', () => {
    (isPanelTitle as Vi.Mock).mockImplementation(() => false);
    render(<CreatePanelModal close={handleClose} />);

    const titleInput = screen.getByLabelText(/패널 제목 인풋/);
    fireEvent.change(titleInput, {
      target: { value: '유효하지 않은 패널 제목' },
    });
    expect(
      screen.getByText(/패널 제목은 3 ~ 40자이어야 합니다/),
    ).toBeInTheDocument();
  });

  it('유효하지 않은 패널 설명을 입력하면 에러 메시지를 보여준다', () => {
    (isPanelTitle as Vi.Mock).mockImplementation(() => false);
    render(<CreatePanelModal close={handleClose} />);

    const titleInput = screen.getByLabelText(/패널 설명 인풋/);
    fireEvent.change(titleInput, {
      target: { value: '유효하지 않은 패널 설명' },
    });
    expect(
      screen.getByText(/패널 설명은 50자 이하여야 합니다/),
    ).toBeInTheDocument();
  });

  it('유효하지 않은 필드를 제출하면 에러 메시지를 보여준다', async () => {
    (isPanelTitle as Vi.Mock).mockImplementation(() => false);
    render(<CreatePanelModal close={handleClose} />);

    const submitButton = screen.getByRole('button', { name: '패널 생성' });
    await userEvent.click(submitButton);

    expect(
      screen.getByText(/패널 제목은 3 ~ 40자이어야 합니다/),
    ).toBeInTheDocument();
  });
});

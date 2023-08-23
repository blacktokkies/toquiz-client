import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { CreateQuestionModal } from '@/components/panel/CreateQuestionModal';

describe('CreatePanelModal', () => {
  it('사용자가 입력하는 글자수를 보여준다', () => {
    render(<CreateQuestionModal />);

    const contentInput = screen.getByRole('textbox');
    fireEvent.change(contentInput, { target: { value: '안녕하세요' } });

    expect(screen.getByText(/5자/)).toBeInTheDocument();
  });

  it('사용자가 0자 혹은 200자 초과로 입력하면 제출 버튼을 비활성화한다', () => {
    render(<CreateQuestionModal />);

    const contentInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /질문 생성/,
    });

    fireEvent.change(contentInput, { target: { value: '' } });
    expect(submitButton.disabled).toBe(true);
    fireEvent.change(contentInput, { target: { value: '글'.repeat(200 + 1) } });
    expect(submitButton.disabled).toBe(true);
  });

  it('사용자가 1자 이상 200자 이하를 입력하면 제출 버튼을 활성화한다', () => {
    render(<CreateQuestionModal />);

    const contentInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /질문 생성/,
    });

    fireEvent.change(contentInput, { target: { value: '안녕하세요' } });
    expect(submitButton.disabled).toBe(false);
  });
});

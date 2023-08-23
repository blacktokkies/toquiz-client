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
});

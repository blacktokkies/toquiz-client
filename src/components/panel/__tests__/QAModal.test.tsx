import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QAModal } from '@/components/panel/QAModal';
import { createMockQuestion } from '@/mocks/data/question';

const handleClose = vi.fn();
const question = { ...createMockQuestion(), content: '안녕하세요' };
const isActived = true;
const handleLikeButtonClick = vi.fn();

describe('QAModal', () => {
  it('<- 아이콘을 누르면 close 함수가 호출된다', async () => {
    render(
      <QAModal
        close={handleClose}
        question={question}
        isActived={isActived}
        onLikeButtonClick={handleLikeButtonClick}
      />,
    );

    const goBackButton = screen.getByRole('button', { name: /뒤로 가기/ });
    await userEvent.click(goBackButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it('질문을 보여준다', () => {
    render(
      <QAModal
        close={handleClose}
        question={question}
        isActived={isActived}
        onLikeButtonClick={handleLikeButtonClick}
      />,
    );

    expect(screen.getByText(question.content)).toBeInTheDocument();
  });
});

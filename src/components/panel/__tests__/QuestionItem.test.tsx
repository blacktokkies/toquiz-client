import type { Question } from '@/lib/api/question';

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createMockQuestion } from '@/mocks/data/question';

import { QuestionItem } from '../QuestionItem';

const handleLikeButtonClick = vi.fn();

function setup({
  question,
  isActived,
  now,
}: {
  question: Question;
  isActived: boolean;
  now: Date;
}): {
  likeButton: HTMLButtonElement;
} {
  render(
    <QuestionItem
      question={question}
      isActived={isActived}
      onLikeButtonClick={handleLikeButtonClick}
      now={now}
    />,
  );

  const likeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /좋아요/,
  });

  return { likeButton };
}
describe('QuestionItem', () => {
  it('질문 내용과 좋아요 개수, 답변 개수를 보여준다', () => {
    setup({
      question: {
        ...createMockQuestion(),
        content: '안녕하세요',
        likeNum: 3,
        answerNum: 4,
      },
      isActived: true,
      now: new Date(),
    });

    expect(screen.getByText(/안녕하세요/)).toBeInTheDocument();
    expect(screen.getByLabelText(/좋아요 3개/)).toBeInTheDocument();
    expect(screen.getByText(/답변 4개/)).toBeInTheDocument();
  });

  it('답변이 없으면 답변 개수를 보여주지 않는다', () => {
    setup({
      question: {
        ...createMockQuestion(),
        answerNum: 0,
      },
      isActived: true,
      now: new Date(),
    });
    expect(screen.queryByText(/답변 0개/)).not.toBeInTheDocument();
  });

  it('좋아요 버튼을 누르면 onLikeButtonClick이 호출된다', async () => {
    const { likeButton } = setup({
      question: createMockQuestion(),
      isActived: true,
      now: new Date(),
    });
    await userEvent.click(likeButton);

    expect(handleLikeButtonClick).toHaveBeenCalled();
  });

  it('isActived가 true이면 좋아요 버튼이 활성화되어있다', () => {
    const { likeButton } = setup({
      question: createMockQuestion(),
      isActived: true,
      now: new Date(),
    });
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('isActived가 false이면 좋아요 버튼이 비활성화되어있다', () => {
    const { likeButton } = setup({
      question: createMockQuestion(),
      isActived: false,
      now: new Date(),
    });
    expect(likeButton).toHaveAttribute('aria-pressed', 'false');
  });
});

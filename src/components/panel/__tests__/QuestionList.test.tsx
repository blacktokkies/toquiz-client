import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { QuestionPage } from '@/lib/api/question';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';
import { createMockQuestion } from '@/mocks/data/question';

import { QuestionList } from '../QuestionList';

const handleLikeButtonClick = vi.fn();
const handleLikeButtonClickFn = vi.fn(() => handleLikeButtonClick);

const createLikeIds = vi.fn(() => [] as MyActiveInfo['likedIds']);
const question = createMockQuestion();
const questionPages: QuestionPage[] = [
  {
    questions: [question],
    nextPage: -1,
  },
];

describe('QuestionList', () => {
  it('질문마다 답변 개수를 보여준다', () => {
    setup();

    expect(
      screen.getByText(`답변 ${question.answerNum}개`),
    ).toBeInTheDocument();
  });

  it('좋아요 버튼을 누를 때마다 onLikeButtonClick이 반환하는 함수를 호출한다', async () => {
    const { likeButton } = setup();

    await userEvent.click(likeButton);
    expect(handleLikeButtonClick).toHaveBeenCalled();
  });

  describe('likeIds', () => {
    it('likeIds에 속한 질문은 좋아요 버튼이 활성화되어있다', () => {
      createLikeIds.mockImplementation(() => [question.id]);
      const { likeButton } = setup();
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('likeIds에 속하지 않은 질문은 좋아요 버튼이 비활성화되어있다', () => {
      const { likeButton } = setup();
      expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('질문을 누르면 모달을 보여준다', async () => {
    const { questionItem } = setup();
    await userEvent.click(questionItem);

    expect(
      screen.getByRole('dialog', { name: /질문과 답변 모달/ }),
    ).toBeInTheDocument();
  });

  it('모달에서 <- 아이콘 누르면 모달이 닫힌다', async () => {
    const { questionItem } = setup();
    await userEvent.click(questionItem);

    const dialog = screen.getByRole('dialog', { name: /질문과 답변 모달/ });
    const goBackButton = screen.getByRole('button', { name: /뒤로 가기/ });
    await userEvent.click(goBackButton);

    expect(dialog).not.toBeInTheDocument();
  });
});

function setup(): {
  likeButton: HTMLButtonElement;
  questionItem: HTMLElement;
} {
  renderWithQueryClient(
    <OverlayProvider>
      <QuestionList
        onLikeButtonClick={handleLikeButtonClickFn}
        questionPages={questionPages}
        likeIds={createLikeIds()}
      />
      ,
    </OverlayProvider>,
  );

  const likeButton = screen.getByRole<HTMLButtonElement>('button', {
    name: /좋아요 버튼/,
  });
  const questionItem = screen.getByRole('button', {
    name: /질문과 답변 모달 열기/,
  });

  return { likeButton, questionItem };
}

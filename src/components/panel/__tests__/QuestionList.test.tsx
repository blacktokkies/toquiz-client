import type { MyActiveInfo } from '@/lib/api/active-Info';
import type { QuestionPage } from '@/lib/api/question';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { renderWithQueryClient } from '@/lib/test-utils';
import {
  createMockQuestion,
  createMockQuestionList,
} from '@/mocks/data/question';

import { QuestionList } from '../QuestionList';

const handleLikeButtonClick = vi.fn();
const handleLikeButtonClickFn = vi.fn(() => handleLikeButtonClick);

describe('QuestionList', () => {
  it('좋아요 버튼을 누를 때마다 onLikeButtonClick이 반환하는 함수를 호출한다', async () => {
    const questionPages: QuestionPage[] = [
      {
        questions: createMockQuestionList(3),
        nextPage: -1,
      },
    ];

    renderWithQueryClient(
      <OverlayProvider>
        <QuestionList
          onLikeButtonClick={handleLikeButtonClickFn}
          questionPages={questionPages}
          likeIds={[]}
        />
        ,
      </OverlayProvider>,
    );

    const likeButton = screen.getAllByRole('button', { name: /좋아요 버튼/ });
    await userEvent.click(likeButton[0]);
    expect(handleLikeButtonClick).toHaveBeenCalled();
  });

  describe('likeIds', () => {
    it('likeIds에 속한 질문은 좋아요 버튼이 활성화되어있다', () => {
      const question = createMockQuestion();
      const likeIds = [question.id];
      const questionPages: QuestionPage[] = [
        {
          questions: [question],
          nextPage: -1,
        },
      ];

      renderWithQueryClient(
        <OverlayProvider>
          <QuestionList
            onLikeButtonClick={handleLikeButtonClickFn}
            questionPages={questionPages}
            likeIds={likeIds}
          />
          ,
        </OverlayProvider>,
      );

      const likeButton = screen.getByRole('button', { name: /좋아요 버튼/ });
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('likeIds에 속하지 않은 질문은 좋아요 버튼이 비활성화되어있다', () => {
      const question = createMockQuestion();
      const likeIds: MyActiveInfo['likedIds'] = [];
      const questionPages: QuestionPage[] = [
        {
          questions: [question],
          nextPage: -1,
        },
      ];

      renderWithQueryClient(
        <OverlayProvider>
          <QuestionList
            onLikeButtonClick={handleLikeButtonClickFn}
            questionPages={questionPages}
            likeIds={likeIds}
          />
          ,
        </OverlayProvider>,
      );

      const likeButton = screen.getByRole('button', {
        name: /좋아요 버튼/,
      });
      expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('질문을 누르면 모달을 보여준다', async () => {
    const question = createMockQuestion();
    const likeIds: MyActiveInfo['likedIds'] = [];
    const questionPages: QuestionPage[] = [
      {
        questions: [question],
        nextPage: -1,
      },
    ];

    renderWithQueryClient(
      <OverlayProvider>
        <QuestionList
          onLikeButtonClick={handleLikeButtonClickFn}
          questionPages={questionPages}
          likeIds={likeIds}
        />
        ,
      </OverlayProvider>,
    );

    const item = screen.getByRole('button', { name: /질문과 답변 모달 열기/ });
    await userEvent.click(item);

    expect(
      screen.getByRole('dialog', { name: /질문과 답변 모달/ }),
    ).toBeInTheDocument();
  });
});

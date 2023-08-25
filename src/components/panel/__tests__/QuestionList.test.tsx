import type * as questionApis from '@/lib/api/question';

import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithQueryClient } from '@/lib/test-utils';
import { myActiveInfoMock } from '@/mocks/data/active-info';
import { createMockQuestionList } from '@/mocks/data/question';

import { QuestionList } from '../QuestionList';

const handleLikeButtonClick = vi.fn();
const handleLikeButtonClickFn = vi.fn(() => handleLikeButtonClick);
describe('QuestionList', () => {
  it('좋아요 버튼을 누를 때마다 onLikeButtonClick이 반환하는 함수를 호출한다', async () => {
    const questionPages: questionApis.QuestionPage[] = [
      {
        questions: createMockQuestionList(3),
        nextPage: -1,
      },
    ];

    renderWithQueryClient(
      <QuestionList
        onLikeButtonClick={handleLikeButtonClickFn}
        questionPages={questionPages}
        likeIds={myActiveInfoMock.likedIds}
      />,
    );

    const likeButton = screen.getAllByRole('button', { name: /좋아요 버튼/ });
    await userEvent.click(likeButton[0]);
    expect(handleLikeButtonClick).toHaveBeenCalled();
  });
});

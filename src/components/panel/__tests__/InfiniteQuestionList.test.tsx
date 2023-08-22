import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';

import { InfiniteQuestionList } from '@/components/panel/InfiniteQuestionList';
import * as questionApis from '@/lib/api/question';
import { renderWithQueryClient } from '@/lib/test-utils';
import { mockQuestionList } from '@/mocks/data/question';

const panelId: Panel['id'] = 0;

describe('InfiniteQuestionList', () => {
  it('질문 목록 가져오기 API를 호출하고 성공 시 질문 목록을 렌더링한다', async () => {
    const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
    renderWithQueryClient(<InfiniteQuestionList panelId={panelId} />);

    expect(spyOnGetQuestions).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getAllByText(mockQuestionList[0].content)[0],
      ).toBeInTheDocument();
    });
  });

  it('사용자가 스크롤하면 getQuestions를 호출한다', async () => {
    const spyOnGetQuestions = vi.spyOn(questionApis, 'getQuestions');
    renderWithQueryClient(<InfiniteQuestionList panelId={panelId} />);

    expect(spyOnGetQuestions).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText(/loading/)).not.toBeInTheDocument();
    });
    fireEvent.scroll(window);

    expect(spyOnGetQuestions).toHaveBeenCalledTimes(2);
  });
});

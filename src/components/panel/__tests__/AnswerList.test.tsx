import type { Answer } from '@/lib/api/answer';

import React from 'react';

import { render, screen } from '@testing-library/react';

import { createMockAnswer } from '@/mocks/data/answer';

import { AnswerList } from '../AnswerList';

describe('AnswerList', () => {
  it('답변 내용과 답변자 닉네임을 보여준다', () => {
    const answers: Answer[] = [
      { ...createMockAnswer(), content: '안녕하세요' },
      { ...createMockAnswer(), content: '반가워요' },
    ];
    render(<AnswerList nickname={'닉네임'} answers={answers} />);

    expect(screen.getByText(/안녕하세요/)).toBeInTheDocument();
    expect(screen.getByText(/반가워요/)).toBeInTheDocument();
    expect(screen.getAllByText(/닉네임/)[0]).toBeInTheDocument();
  });
});

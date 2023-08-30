import React from 'react';

import { render, screen } from '@testing-library/react';

import { ResignModal } from '@/components/account/ResignModal';

describe('ResignModal', () => {
  it('회원 탈퇴하기 헤딩을 보여준다', () => {
    render(<ResignModal />);

    expect(screen.getByRole('heading')).toHaveTextContent('회원 탈퇴하기');
  });
});

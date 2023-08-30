import React from 'react';

import { render, screen } from '@testing-library/react';

import { Account } from '@/pages/Account';

describe('내 계정 관리 페이지', () => {
  it('내 계정 관리 헤딩을 보여준다.', () => {
    render(<Account />);

    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('내 계정 관리');
  });

  describe('프로필 수정', () => {
    it('프로필 수정 헤딩을 보여준다', () => {
      render(<Account />);

      expect(
        screen.getByRole<HTMLHeadingElement>('heading', {
          level: 2,
        }),
      ).toHaveTextContent('프로필 수정');
    });

    it('프로필 수정 폼을 보여준다', () => {
      render(<Account />);

      const form = screen.getByRole('form', {
        name: /프로필 수정 폼/,
      });

      expect(form).toBeInTheDocument();
    });
  });
});

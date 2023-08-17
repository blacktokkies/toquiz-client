import React from 'react';

import { render, screen } from '@testing-library/react';

import { Account } from '@/pages/Account';

describe('내 계정 관리 페이지', () => {
  it('내 계정 관리 헤딩을 보여준다.', () => {
    render(<Account />);

    expect(screen.getByRole('heading')).toHaveTextContent('내 계정 관리');
  });
});

import React from 'react';

import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { renderWithAllProviders } from '@/lib/test-utils';

import { Account } from '../Account';

describe('내 계정 관리 페이지', () => {
  it('내 계정 관리 헤딩을 보여준다.', () => {
    renderWithAllProviders(
      <MemoryRouter>
        <Account />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent('내 계정 관리');
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';

const handleClose = vi.fn();

vi.mock('@/hooks/stores/useUserStore', () => ({
  useUserStore: vi.fn(() => ({
    nickname: '테스트 닉네임',
    email: '테스트 이메일',
    createdAt: new Date().toString(),
  })),
}));

describe('AccountActionMenu', () => {
  it('사용자 이메일과 닉네임을 보여준다', () => {
    render(<AccountActionMenu close={handleClose} />);

    expect(screen.getByText(/이메일/)).toBeInTheDocument();
    expect(screen.getByText(/닉네임/)).toBeInTheDocument();
  });
});

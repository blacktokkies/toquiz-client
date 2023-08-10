import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';

const handleClose = vi.fn();
const navigateMockFn = vi.fn();

describe('AccountActionMenu', () => {
  vi.mock('react-router-dom', async (importOriginal) => {
    const router = (await importOriginal()) ?? {};
    return { ...router, useNavigate: vi.fn(() => navigateMockFn) };
  });

  vi.mock('@/hooks/stores/useUserStore', () => ({
    useUserStore: vi.fn(() => ({
      nickname: '테스트 닉네임',
      email: '테스트 이메일',
      createdAt: new Date().toString(),
    })),
  }));

  it('사용자 이메일과 닉네임을 보여준다', () => {
    render(<AccountActionMenu close={handleClose} />);

    expect(screen.getByText(/이메일/)).toBeInTheDocument();
    expect(screen.getByText(/닉네임/)).toBeInTheDocument();
  });

  it('내 패널 모아보기 버튼을 누르면 홈 페이지로 이동한다', async () => {
    render(
      <MemoryRouter>
        <AccountActionMenu close={handleClose} />
      </MemoryRouter>,
    );

    const panelListButton = screen.getByRole('button', {
      name: /내 패널 모아보기/,
    });
    await userEvent.click(panelListButton);
    expect(navigateMockFn).toHaveBeenCalledWith('/home');
  });
});

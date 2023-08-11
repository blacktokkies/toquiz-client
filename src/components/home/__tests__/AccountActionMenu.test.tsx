import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import { AccountActionMenu } from '@/components/home/AccountActionMenu';
import * as authApis from '@/lib/api/auth';
import { renderWithQueryClient } from '@/lib/test-utils';
import { setUserState } from '@/store/user-store';

const handleClose = vi.fn();
const navigateMockFn = vi.fn();

describe('AccountActionMenu', () => {
  vi.mock('react-router-dom', async (importOriginal) => {
    const router = (await importOriginal()) ?? {};
    return { ...router, useNavigate: vi.fn(() => navigateMockFn) };
  });

  it('사용자 이메일과 닉네임을 보여준다', () => {
    act(() => {
      setUserState({
        email: '이메일',
        nickname: '닉네임',
        createdAt: new Date().toString(),
      });
    });

    renderWithQueryClient(
      <MemoryRouter>
        <AccountActionMenu close={handleClose} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/이메일/)).toBeInTheDocument();
    expect(screen.getByText(/닉네임/)).toBeInTheDocument();
  });

  it('내 패널 모아보기 버튼을 누르면 홈 페이지로 이동한다', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <AccountActionMenu close={handleClose} />
      </MemoryRouter>,
    );

    const panelButton = screen.getByRole('button', {
      name: /내 패널 모아보기/,
    });
    await userEvent.click(panelButton);
    expect(navigateMockFn).toHaveBeenCalledWith('/home');
  });

  it('내 계정 관리 버튼을 누르면 내 계정 관리 페이지로 이동한다', async () => {
    renderWithQueryClient(
      <MemoryRouter>
        <AccountActionMenu close={handleClose} />
      </MemoryRouter>,
    );

    const accountButton = screen.getByRole('button', {
      name: /내 계정 관리/,
    });
    await userEvent.click(accountButton);
    expect(navigateMockFn).toHaveBeenCalledWith('/account');
  });

  describe('로그아웃 버튼을 누르면 로그아웃 API를 호출하고', () => {
    const spyOnLogout = vi.spyOn(authApis, 'logout');

    it('성공하면 로그인 페이지로 이동한다', async () => {
      renderWithQueryClient(
        <MemoryRouter>
          <AccountActionMenu close={handleClose} />
        </MemoryRouter>,
      );

      const logoutButton = screen.getByRole('button', {
        name: /로그아웃/,
      });
      await userEvent.click(logoutButton);

      expect(spyOnLogout).toHaveBeenCalled();
      await waitFor(() => {
        expect(navigateMockFn).toHaveBeenCalledWith('/login');
      });
    });
  });
});
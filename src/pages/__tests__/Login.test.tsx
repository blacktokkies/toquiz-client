import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import * as apis from '@/lib/api/auth';
import { renderWithQueryClient } from '@/lib/test-utils';
import { Login } from '@/pages/Login';
import { getUser } from '@/store/userStore';

const navigateMockFn = vi.fn();

describe('로그인 페이지', () => {
  afterEach(() => vi.restoreAllMocks());

  vi.mock('@/lib/validator', () => ({
    isEmail: vi.fn(() => true),
    isPassword: vi.fn(() => true),
  }));

  vi.mock('react-router-dom', async (importOriginal) => {
    const router = (await importOriginal()) ?? {};
    return { ...router, useNavigate: vi.fn(() => navigateMockFn) };
  });

  it('유효한 형식의 이메일, 비밀번호를 제출하면 로그인 API를 호출하고 스토어에 저장한 후 홈 페이지로 이동한다', async () => {
    const spyOnLogin = vi.spyOn(apis, 'login');

    const { emailInput, passwordInput, submitButton } = setup();
    fireEvent.change(emailInput, { target: { value: '유효한 이메일' } });
    fireEvent.change(passwordInput, { target: { value: '유효한 비밀번호' } });
    await userEvent.click(submitButton);

    expect(spyOnLogin).toHaveBeenCalledWith({
      email: '유효한 이메일',
      password: '유효한 비밀번호',
    });
    await waitFor(() => {
      expect(getUser()?.email).toBe('유효한 이메일');
    });
    await waitFor(() => {
      expect(navigateMockFn).toHaveBeenCalledWith('/home');
    });
  });
});

function setup(): {
  emailInput: HTMLElement;
  passwordInput: HTMLElement;
  submitButton: HTMLElement;
} {
  renderWithQueryClient(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  const emailInput = screen.getByLabelText('이메일 인풋');
  const passwordInput = screen.getByLabelText('비밀번호 인풋');

  const submitButton = screen.getByRole('button', { name: '로그인' });

  return { emailInput, passwordInput, submitButton };
}

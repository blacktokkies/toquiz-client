import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import * as apis from '@/lib/api/auth';
import { renderWithQueryClient } from '@/lib/test-utils';
import { Login } from '@/pages/Login';
import { getUser } from '@/store/userStore';

describe('로그인 페이지', () => {
  vi.mock('@/lib/validator', () => ({
    isEmail: vi.fn().mockImplementation(() => true),
    isPassword: vi.fn().mockImplementation(() => true),
  }));

  it('유효한 형식의 이메일, 비밀번호를 제출하면 로그인 API를 호출하고 스토어에 저장한다', async () => {
    const spyOnLogin = vi.spyOn(apis, 'login');

    renderWithQueryClient(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText('이메일 인풋');
    fireEvent.change(emailInput, { target: { value: '유효한 이메일' } });

    const submitButton = screen.getByRole('button', { name: '로그인' });
    await userEvent.click(submitButton);

    expect(spyOnLogin).toHaveBeenCalled();
    await waitFor(() => {
      expect(getUser()?.email).toBe('유효한 이메일');
    });
  });
});

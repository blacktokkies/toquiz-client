import type { ErrorResponse } from '@/lib/api/response';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';

import * as apis from '@/lib/api/auth';
import { apiUrl } from '@/lib/apiUrl';
import { renderWithQueryClient } from '@/lib/test-utils';
import { server } from '@/mocks/server';
import { Login } from '@/pages/Login';
import { getUserState } from '@/store/userStore';

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
      expect(getUserState().email).toBe('유효한 이메일');
    });
    await waitFor(() => {
      expect(navigateMockFn).toHaveBeenCalledWith('/home');
    });
  });

  it('사용자가 제출한 이메일로 된 계정이 존재하지 않으면 에러 메시지를 보여준다', async () => {
    overrideLoginResultWithError({
      statusCode: 400,
      code: 'NON_EXISTENT_ACCOUNT',
      message: '계정이 존재하지 않습니다',
    });

    const spyOnLogin = vi.spyOn(apis, 'login');

    const { emailInput, passwordInput, submitButton } = setup();
    fireEvent.change(emailInput, {
      target: { value: '존재하지 않는 계정 이메일' },
    });
    fireEvent.change(passwordInput, {
      target: { value: '비밀번호' },
    });
    await userEvent.click(submitButton);

    expect(spyOnLogin).toHaveBeenCalledWith({
      email: '존재하지 않는 계정 이메일',
      password: '비밀번호',
    });

    expect(screen.getByText(/존재하지 않는 계정입니다/));
  });

  it('사용자가 제출한 비밀번호가 일치하지 않으면 에러 메시지를 보여준다', async () => {
    overrideLoginResultWithError({
      statusCode: 400,
      code: 'MISMATCH_PASSWORD',
      message: '비밀번호가 일치하지 않습니다',
    });

    const spyOnLogin = vi.spyOn(apis, 'login');

    const { emailInput, passwordInput, submitButton } = setup();
    fireEvent.change(emailInput, {
      target: { value: '이메일' },
    });
    fireEvent.change(passwordInput, {
      target: { value: '일치하지 않는 비밀번호' },
    });
    await userEvent.click(submitButton);

    expect(spyOnLogin).toHaveBeenCalledWith({
      email: '이메일',
      password: '일치하지 않는 비밀번호',
    });

    await waitFor(() => {
      expect(screen.getByText(/이메일과 비밀번호가 일치하지 않습니다/));
    });
  });

  it('유효하지 않은 이메일이나 비밀번호를 제출하면 에러 메시지를 보여준다', async () => {
    overrideLoginResultWithError({
      statusCode: 400,
      code: 'INVALID_PARAMETER',
      message: '유효하지 않은 파라미터가 포함되어 있습니다',
      errors: [
        {
          field: 'password',
          message:
            '비밀번호는 영문자, 숫자, 특수기호를 반드시 포함해야 합니다.',
        },
        {
          field: 'email',
          message: '아이디는 이메일 형식으로 입력해주세요.',
        },
      ],
    });

    const spyOnLogin = vi.spyOn(apis, 'login');

    const { emailInput, passwordInput, submitButton } = setup();
    fireEvent.change(emailInput, {
      target: { value: '유효하지 않은 이메일' },
    });
    fireEvent.change(passwordInput, {
      target: { value: '유효하지 않은 비밀번호' },
    });
    await userEvent.click(submitButton);

    expect(spyOnLogin).toHaveBeenCalledWith({
      email: '유효하지 않은 이메일',
      password: '유효하지 않은 비밀번호',
    });

    await waitFor(() => {
      expect(
        screen.getByText(/이메일 형식의 아이디를 입력하세요/),
      ).toBeInTheDocument();
    });
  });
});

function overrideLoginResultWithError(data: ErrorResponse): void {
  server.use(
    rest.post(apiUrl.auth.login(), async (req, res, ctx) =>
      res(ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

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

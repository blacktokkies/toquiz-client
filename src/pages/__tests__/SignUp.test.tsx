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
import { SignUp } from '@/pages/SignUp';

const navigateMockFn = vi.fn();

describe('회원가입 페이지', () => {
  afterEach(() => vi.restoreAllMocks());

  vi.mock('@/lib/validator', () => ({
    isEmail: vi.fn(() => true),
    isNickname: vi.fn(() => true),
    isPassword: vi.fn(() => true),
  }));

  vi.mock('react-router-dom', async (importOriginal) => {
    const router = (await importOriginal()) ?? {};
    return { ...router, useNavigate: vi.fn(() => navigateMockFn) };
  });

  it('유효한 형식의 이메일, 비밀번호, 닉네임을 제출하면 회원가입 API를 호출하고 로그인 페이지로 이동한다', async () => {
    const spyOnSignUp = vi.spyOn(apis, 'signUp');

    const {
      submitButton,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      nicknameInput,
    } = setup();

    fireEvent.change(emailInput, { target: { value: '유효한 이메일' } });
    fireEvent.change(passwordInput, {
      target: { value: '유효한 비밀번호' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: '유효한 비밀번호' },
    });
    fireEvent.change(nicknameInput, {
      target: { value: '유효한 닉네임' },
    });
    await userEvent.click(submitButton);

    expect(spyOnSignUp).toHaveBeenCalledWith({
      email: '유효한 이메일',
      password: '유효한 비밀번호',
      nickname: '유효한 닉네임',
    });

    await waitFor(() => {
      expect(navigateMockFn).toHaveBeenCalledWith('/login');
    });
  });

  it('중복된 이메일을 제출하면 에러 메시지를 보여준다', async () => {
    overrideSignUpResultWithError({
      code: 'DUPLICATE_EMAIL',
      statusCode: 400,
      message: '이미 존재하는 email 입니다.',
    });

    const { submitButton } = setup();
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/이미 존재하는 이메일입니다/),
      ).toBeInTheDocument();
    });
  });

  it('중복된 닉네임을 제출하면 에러 메시지를 보여준다', async () => {
    overrideSignUpResultWithError({
      code: 'DUPLICATE_NICKNAME',
      statusCode: 400,
      message: '이미 존재하는 nickname 입니다.',
    });

    const { submitButton } = setup();
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/이미 존재하는 닉네임입니다/),
      ).toBeInTheDocument();
    });
  });

  it('유효하지 않은 이메일, 비밀번호, 닉네임을 제출하면 에러 메시지를 보여준다.', async () => {
    overrideSignUpResultWithError({
      code: 'INVALID_PARAMETER',
      statusCode: 400,
      message: 'Invalid parameter included',
      errors: [
        {
          field: 'nickname',
          message: '닉네임은 8 ~ 20자 이어야 합니다.',
        },
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

    const { submitButton } = setup();
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/이메일 형식의 아이디를 입력하세요/),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요/,
        ),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText(/2~20자 이하의 문자를 입력하세요/),
      ).toBeInTheDocument();
    });
  });
});

function overrideSignUpResultWithError(data: ErrorResponse): void {
  server.use(
    rest.post(apiUrl.auth.signup(), async (req, res, ctx) =>
      res(ctx.status(data.statusCode), ctx.json(data)),
    ),
  );
}

function setup(): {
  emailInput: HTMLElement;
  passwordInput: HTMLElement;
  confirmPasswordInput: HTMLElement;
  nicknameInput: HTMLElement;
  submitButton: HTMLElement;
} {
  renderWithQueryClient(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>,
  );

  const emailInput = screen.getByLabelText('이메일 인풋');
  const passwordInput = screen.getByLabelText('비밀번호 인풋');
  const confirmPasswordInput = screen.getByLabelText('비밀번호 확인 인풋');
  const nicknameInput = screen.getByLabelText('닉네임 인풋');

  const submitButton = screen.getByRole('button', { name: '회원가입' });

  return {
    emailInput,
    passwordInput,
    confirmPasswordInput,
    nicknameInput,
    submitButton,
  };
}

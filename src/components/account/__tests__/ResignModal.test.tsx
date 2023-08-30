import type * as Vi from 'vitest';

import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { ResignModal } from '@/components/account/ResignModal';
import { apiUrl } from '@/lib/api/apiUrl';
import * as authApis from '@/lib/api/auth';
import { renderWithQueryClient } from '@/lib/test-utils';
import { isPassword } from '@/lib/validator';
import { server } from '@/mocks/server';

vi.mock('@/lib/validator', () => ({
  isPassword: vi.fn(() => true),
}));

const navigateMockFn = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const router = (await importOriginal()) ?? {};
  return { ...router, useNavigate: vi.fn(() => navigateMockFn) };
});

const handleClose = vi.fn();
describe('ResignModal', () => {
  it('회원 탈퇴하기 헤딩을 보여준다', () => {
    renderWithQueryClient(<ResignModal close={handleClose} />);

    expect(screen.getByRole('heading')).toHaveTextContent('회원 탈퇴하기');
  });

  it('취소 버튼을 누르면 close 함수를 호출한다', async () => {
    renderWithQueryClient(<ResignModal close={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /취소/ });
    await userEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it('사용자가 유효하지 않은 비밀번호를 입력하면 에러 메시지를 보여준다', async () => {
    (isPassword as Vi.Mock).mockImplementation(() => false);
    renderWithQueryClient(<ResignModal close={handleClose} />);

    const passwordInput = screen.getByLabelText('비밀번호');
    await userEvent.type(passwordInput, '유효하지 않은 비밀번호');

    expect(
      screen.getByText(
        '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      ),
    ).toBeInTheDocument();
  });

  it('사용자가 유효하지 않은 비밀번호 입력하면 제출 버튼을 비활성화한다', async () => {
    (isPassword as Vi.Mock).mockImplementation(() => false);
    renderWithQueryClient(<ResignModal close={handleClose} />);

    const passwordInput = screen.getByLabelText('비밀번호');
    const submitButton = screen.getByRole<HTMLButtonElement>('button', {
      name: '회원 탈퇴',
    });
    await userEvent.type(passwordInput, '유효하지 않은 비밀번호');

    expect(submitButton.disabled).toBe(true);
  });

  it('사용자가 비밀번호를 제출하면 회원 탈퇴 API를 호출한다', async () => {
    const spyOnResign = vi.spyOn(authApis, 'resign');
    renderWithQueryClient(<ResignModal close={handleClose} />);
    const submitButton = screen.getByRole<HTMLButtonElement>('button', {
      name: '회원 탈퇴',
    });
    await userEvent.click(submitButton);
    expect(spyOnResign).toHaveBeenCalled();
  });

  it('[200] 성공 시 인덱스 페이지로 이동한다', async () => {
    renderWithQueryClient(<ResignModal close={handleClose} />);
    const submitButton = screen.getByRole<HTMLButtonElement>('button', {
      name: '회원 탈퇴',
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(navigateMockFn).toHaveBeenCalledWith('/');
    });
  });

  it('[400] 비밀번호가 일치하지 않으면 에러 메시지를 보여준다', async () => {
    server.use(
      rest.post(apiUrl.auth.resign(), async (req, res, ctx) =>
        res(
          ctx.status(400),
          ctx.json({
            code: 'NOT_MATCH_PASSWORD',
            statusCode: 400,
            message: '비밀번호가 일치하지 않습니다.',
          }),
        ),
      ),
    );
    renderWithQueryClient(<ResignModal close={handleClose} />);
    const submitButton = screen.getByRole<HTMLButtonElement>('button', {
      name: '회원 탈퇴',
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/비밀번호가 일치하지 않습니다/));
    });
  });
});

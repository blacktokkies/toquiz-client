import type * as Vi from 'vitest';

import React from 'react';

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as authApis from '@/lib/api/auth';
import { renderWithQueryClient } from '@/lib/test-utils';
import { isNickname, isPassword } from '@/lib/validator';
import { Account } from '@/pages/Account';

vi.mock('@/lib/validator', () => ({
  isNickname: vi.fn(() => true),
  isPassword: vi.fn(() => true),
}));
describe('내 계정 관리 페이지', () => {
  it('내 계정 관리 헤딩을 보여준다.', () => {
    renderWithQueryClient(<Account />);

    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('내 계정 관리');
  });

  describe('프로필 수정', () => {
    it('프로필 수정 헤딩을 보여준다', () => {
      renderWithQueryClient(<Account />);

      expect(
        screen.getByRole<HTMLHeadingElement>('heading', {
          level: 2,
        }),
      ).toHaveTextContent('프로필 수정');
    });

    it('프로필 수정 폼을 보여준다', () => {
      renderWithQueryClient(<Account />);

      const form = screen.getByRole('form', {
        name: /프로필 수정 폼/,
      });

      expect(form).toBeInTheDocument();
    });

    it('사용자가 유효하지 않은 닉네임을 입력하면 에러 메시지를 보여준다', () => {
      (isNickname as Vi.Mock).mockImplementation(() => false);
      renderWithQueryClient(<Account />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      fireEvent.change(nicknameInput, {
        target: { value: '유효하지 않은 닉네임' },
      });

      expect(
        screen.getByText('2~20자 이하의 문자를 입력하세요'),
      ).toBeInTheDocument();
    });

    it('사용자가 유효하지 않은 비밀번호를 입력하면 에러 메시지를 보여준다', () => {
      (isPassword as Vi.Mock).mockImplementation(() => false);
      renderWithQueryClient(<Account />);

      const passwordInput = screen.getByLabelText('비밀번호');
      fireEvent.change(passwordInput, {
        target: { value: '유효하지 않은 비밀번호' },
      });

      expect(
        screen.getByText(
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
        ),
      ).toBeInTheDocument();
    });

    it('사용자가 비밀번호 확인 인풋에 비밀번호 인풋과 동일하지 않은 값 입력하면 에러 메시지를 보여준다', () => {
      renderWithQueryClient(<Account />);

      const passwordInput = screen.getByLabelText('비밀번호');
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);
      fireEvent.change(passwordInput, {
        target: { value: '비밀번호' },
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: '동일하지 않은 비밀번호' },
      });

      expect(
        screen.getByText('동일한 비밀번호를 입력하세요'),
      ).toBeInTheDocument();
    });

    it('사용자가 유효하지 않은 값을 입력하면 제출 버튼을 비활성화한다', () => {
      (isNickname as Vi.Mock).mockImplementation(() => false);
      renderWithQueryClient(<Account />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      fireEvent.change(nicknameInput, {
        target: { value: '유효하지 않은 닉네임' },
      });

      const submitButton = screen.getByRole<HTMLButtonElement>('button', {
        name: /변경 내용 저장/,
      });
      expect(submitButton.disabled).toBe(true);
    });

    it('사용자가 값을 제출하면 내 정보 수정 API를 호출한다', async () => {
      const spyOnUpdateMyInfo = vi.spyOn(authApis, 'updateMyInfo');
      renderWithQueryClient(<Account />);

      const nicknameInput = screen.getByLabelText(/닉네임/);
      fireEvent.change(nicknameInput, {
        target: { value: '닉네임' },
      });

      const submitButton = screen.getByRole<HTMLButtonElement>('button', {
        name: /변경 내용 저장/,
      });
      await userEvent.click(submitButton);
      expect(spyOnUpdateMyInfo).toHaveBeenCalledWith({
        nickname: '닉네임',
      });
    });

    it('사용자가 닉네임과 비밀번호를 모두 빈 값으로 제출하면 내 정보 수정 API를 호출하지 않는다', async () => {
      const spyOnUpdateMyInfo = vi.spyOn(authApis, 'updateMyInfo');
      renderWithQueryClient(<Account />);

      const submitButton = screen.getByRole<HTMLButtonElement>('button', {
        name: /변경 내용 저장/,
      });
      await userEvent.click(submitButton);
      expect(spyOnUpdateMyInfo).not.toHaveBeenCalled();
    });
  });
});

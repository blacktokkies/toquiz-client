import type * as Vi from 'vitest';

import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { OverlayProvider } from '@/contexts/OverlayContext';
import * as authApis from '@/lib/api/auth';
import { renderWithQueryClient } from '@/lib/test-utils';
import { isNickname, isPassword } from '@/lib/validator';
import { Component as Account } from '@/pages/Account';
import { getUserState } from '@/store/user-store';

vi.mock('@/lib/validator', () => ({
  isNickname: vi.fn(() => true),
  isPassword: vi.fn(() => true),
}));

function setup(): {
  updateProfileForm: HTMLFormElement;
  nicknameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  confirmPasswordInput: HTMLInputElement;
  updateProfileSubmitButton: HTMLButtonElement;
} {
  renderWithQueryClient(
    <MemoryRouter>
      <OverlayProvider>
        <Account />
      </OverlayProvider>
    </MemoryRouter>,
  );

  const updateProfileForm = screen.getByRole<HTMLFormElement>('form', {
    name: /프로필 수정 폼/,
  });
  const nicknameInput = screen.getByLabelText<HTMLInputElement>(/닉네임/);
  const passwordInput = screen.getByLabelText<HTMLInputElement>('비밀번호');
  const confirmPasswordInput =
    screen.getByLabelText<HTMLInputElement>(/비밀번호 확인/);
  const updateProfileSubmitButton = screen.getByRole<HTMLButtonElement>(
    'button',
    {
      name: /변경 내용 저장/,
    },
  );

  return {
    updateProfileForm,
    nicknameInput,
    passwordInput,
    confirmPasswordInput,
    updateProfileSubmitButton,
  };
}

describe('내 계정 관리 페이지', () => {
  it('내 계정 관리 헤딩을 보여준다.', () => {
    setup();

    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('내 계정 관리');
  });

  describe('프로필 수정', () => {
    it('프로필 수정 헤딩을 보여준다', () => {
      setup();

      expect(
        screen.getByRole<HTMLHeadingElement>('heading', {
          level: 2,
          name: '프로필 수정',
        }),
      ).toBeInTheDocument();
    });

    it('프로필 수정 폼을 보여준다', () => {
      const { updateProfileForm } = setup();

      expect(updateProfileForm).toBeInTheDocument();
    });

    it('사용자가 유효하지 않은 닉네임을 입력하면 에러 메시지를 보여준다', () => {
      (isNickname as Vi.Mock).mockImplementation(() => false);
      const { nicknameInput } = setup();

      fireEvent.change(nicknameInput, {
        target: { value: '유효하지 않은 닉네임' },
      });

      expect(
        screen.getByText('2~20자 이하의 문자를 입력하세요'),
      ).toBeInTheDocument();
    });

    it('사용자가 유효하지 않은 비밀번호를 입력하면 에러 메시지를 보여준다', () => {
      (isPassword as Vi.Mock).mockImplementation(() => false);
      const { passwordInput } = setup();

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
      const { passwordInput, confirmPasswordInput } = setup();

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
      const { nicknameInput, updateProfileSubmitButton } = setup();

      fireEvent.change(nicknameInput, {
        target: { value: '유효하지 않은 닉네임' },
      });

      expect(updateProfileSubmitButton.disabled).toBe(true);
    });

    it('사용자가 값을 제출하면 사용자가 입력한 값으로 내 정보 수정 API를 호출한다', async () => {
      const spyOnUpdateMyInfo = vi.spyOn(authApis, 'updateMyInfo');
      const { nicknameInput, updateProfileSubmitButton } = setup();

      fireEvent.change(nicknameInput, {
        target: { value: '닉네임' },
      });
      await userEvent.click(updateProfileSubmitButton);

      expect(spyOnUpdateMyInfo).toHaveBeenCalledWith({
        nickname: '닉네임',
      });
    });

    it('내 정보 수정 API가 성공하면 사용자가 입력한 닉네임이 전역 스토어에 저장한다', async () => {
      const { nicknameInput, updateProfileSubmitButton } = setup();

      fireEvent.change(nicknameInput, {
        target: { value: '새로운 닉네임' },
      });
      await userEvent.click(updateProfileSubmitButton);

      await waitFor(() => {
        expect(getUserState().nickname).toBe('새로운 닉네임');
      });
    });

    it('사용자가 닉네임과 비밀번호를 모두 빈 값으로 제출하면 내 정보 수정 API를 호출하지 않고 안내 문구를 보여준다', async () => {
      const spyOnUpdateMyInfo = vi.spyOn(authApis, 'updateMyInfo');
      const { updateProfileSubmitButton } = setup();

      await userEvent.click(updateProfileSubmitButton);

      expect(spyOnUpdateMyInfo).not.toHaveBeenCalled();
      expect(screen.getByText(/변경할 내용을 입력해주세요/));
    });
  });

  describe('회원 탈퇴', () => {
    it('회원 탈퇴 헤딩을 보여준다', () => {
      setup();

      expect(
        screen.getByRole<HTMLHeadingElement>('heading', {
          level: 2,
          name: '회원 탈퇴',
        }),
      );
    });

    it('회원 영구 탈퇴 버튼을 누르면 회원 탈퇴하기 모달을 연다', async () => {
      setup();

      const openResignModalButton = screen.getByRole('button', {
        name: '회원 영구 탈퇴',
      });
      await userEvent.click(openResignModalButton);

      expect(screen.getByRole('dialog', { name: /회원 탈퇴/ }));
    });
  });
});

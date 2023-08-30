import type { UpdateMyInfoBody } from '@/lib/api/auth';
import type { LoaderFunction } from 'react-router-dom';

import React, { useRef } from 'react';

import { redirect } from 'react-router-dom';

import { Button } from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { ModalController } from '@/components/system/ModalController';
import { useUpdateMyInfoMutation } from '@/hooks/queries/auth';
import { useForm } from '@/hooks/useForm';
import { useOverlay } from '@/hooks/useOverlay';
import { isUserLoggedIn } from '@/lib/routeGuard';
import { isNickname, isPassword } from '@/lib/validator';

export const accountLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};
export function Account(): JSX.Element {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const updateMyInfoMutation = useUpdateMyInfoMutation();
  const { inputProps, errors, hasError, formProps } = useForm({
    inputConfigs: {
      nickname: {
        validate: (value) => value.length === 0 || isNickname(value),
        errorMessage: '2~20자 이하의 문자를 입력하세요',
      },
      password: {
        validate: (value) => value.length === 0 || isPassword(value),
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
      'confirm-password': {
        validate: (value, refs) => value === refs.password?.value,
        errorMessage: '동일한 비밀번호를 입력하세요',
      },
    },
    formConfig: {
      onSubmit: ({ nickname, password }, e, refs) => {
        const body: UpdateMyInfoBody = {};
        if (nickname) body.nickname = nickname;
        if (password) body.password = password;

        if (nickname || password)
          updateMyInfoMutation.mutate(body, {
            onSuccess: () => {
              Object.values(refs).forEach((input) => (input.value = ''));
              if (messageRef.current) messageRef.current.textContent = '';
            },
          });
        else {
          if (messageRef.current) {
            refs.nickname?.focus();
            messageRef.current.textContent = '※변경할 내용을 입력해주세요';
          }
        }
      },
    },
  });

  const overlay = useOverlay();

  return (
    <div className="flex-1 container flex flex-col max-w-5xl px-5 pt-7 pb-16">
      <h1 className="font text-2xl font-medium tracking-tighter md:text-5xl">
        내 계정 관리
      </h1>
      <div className="flex flex-1 flex-col divide-y divide-grey-light">
        <section className="flex flex-col gap-6 py-6">
          <h2 className="font-medium text-xl">프로필 수정</h2>
          <form
            className="flex flex-col gap-6"
            aria-label="프로필 수정 폼"
            {...formProps}
          >
            <LabelInput
              id="nickname"
              label="닉네임"
              placeholder="닉네임을 입력하세요"
              {...inputProps.nickname}
              errorMessage={errors.nickname}
            />
            <LabelInput
              type="password"
              id="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              {...inputProps.password}
              errorMessage={errors.password}
            />
            <LabelInput
              type="password"
              id="confirm-password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              {...inputProps['confirm-password']}
              errorMessage={errors['confirm-password']}
            />
            <div className="flex flex-col items-end">
              <Button
                type="submit"
                disabled={hasError || updateMyInfoMutation.isLoading}
              >
                변경 내용 저장
              </Button>
              <div ref={messageRef} className="text-primary" />
            </div>
          </form>
        </section>
        <section className="flex flex-col gap-6 py-6">
          <h2 className="font-medium text-xl">회원 탈퇴</h2>
          <button
            type="button"
            onClick={() => {
              overlay.open(({ close }) => (
                <ModalController aria-label="회원 탈퇴 모달" close={close}>
                  회원 탈퇴
                </ModalController>
              ));
            }}
          >
            회원 영구 탈퇴
          </button>
        </section>
      </div>
    </div>
  );
}

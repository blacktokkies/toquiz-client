import type { UpdateMyInfoBody } from '@/lib/api/auth';
import type { LoaderFunction } from 'react-router-dom';

import React from 'react';

import { redirect } from 'react-router-dom';

import { LabelInput } from '@/components/system/LabelInput';
import { useUpdateMyInfoMutation } from '@/hooks/queries/auth';
import { useForm } from '@/hooks/useForm';
import { isUserLoggedIn } from '@/lib/routeGuard';
import { isNickname, isPassword } from '@/lib/validator';

export const accountLoader: LoaderFunction = async () => {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) return redirect('/login');
  return null;
};
export function Account(): JSX.Element {
  const updateMyInfoMutation = useUpdateMyInfoMutation();
  const { inputProps, errors, hasError, formProps } = useForm({
    inputConfigs: {
      nickname: {
        validate: (value) => isNickname(value),
        errorMessage: '2~20자 이하의 문자를 입력하세요',
      },
      password: {
        validate: (value) => isPassword(value),
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
      'confirm-password': {
        validate: (value, refs) => value === refs.password?.value,
        errorMessage: '동일한 비밀번호를 입력하세요',
      },
    },
    formConfig: {
      onSubmit: ({ nickname, password }) => {
        const body: UpdateMyInfoBody = {};
        if (nickname) body.nickname = nickname;
        if (password) body.password = password;

        updateMyInfoMutation.mutate(body);
      },
    },
  });
  return (
    <div className="flex-1 container flex flex-col gap-11 max-w-5xl px-5 pt-7 pb-16">
      <h1 className="font text-2xl font-medium tracking-tighter md:text-5xl">
        내 계정 관리
      </h1>
      <div className="flex flex-1 flex-col">
        <section>
          <h2>프로필 수정</h2>
          <form aria-label="프로필 수정 폼" {...formProps}>
            <LabelInput
              id="nickname"
              label="닉네임"
              {...inputProps.nickname}
              errorMessage={errors.nickname}
            />
            <LabelInput
              id="password"
              label="비밀번호"
              {...inputProps.password}
              errorMessage={errors.password}
            />
            <LabelInput
              id="confirm-password"
              label="비밀번호 확인"
              {...inputProps['confirm-password']}
              errorMessage={errors['confirm-password']}
            />
            <button type="submit" disabled={hasError}>
              변경 내용 저장
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

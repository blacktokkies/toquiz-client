import type { LogInBody } from '@/lib/api/auth';

import React from 'react';

import Button from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { useForm } from '@/hooks/useForm';
import { isEmail, isPassword } from '@/lib/validator';

interface Props {
  action: (props: LogInBody) => void;
}
// https://reactrouter.com/en/main/hooks/use-action-data
// TODO: action, useActionData 사용해서 리다이렉트 처리해보기
const SignUpForm = ({ action }: Props): JSX.Element => {
  const { inputProps, errors, formProps } = useForm({
    inputConfigs: {
      username: {
        validate: (value) => isEmail(value),
        errorMessage: '이메일 형식의 아이디를 입력하세요',
      },
      password: {
        validate: (value) => isPassword(value),
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
    },
    formConfig: {
      onSubmit: (data) => {
        const { username, password } = data;
        action({ username, password });
      },
    },
  });

  return (
    <form className="flex w-full flex-col gap-8" {...formProps}>
      <div className="flex flex-col gap-5">
        <LabelInput
          label="아이디"
          name="username"
          required
          placeholder="아이디를 입력하세요"
          errorMessage={errors.username}
          {...inputProps.username}
        />
        <LabelInput
          label="비밀번호"
          name="password"
          type="password"
          required
          placeholder="비밀번호를 입력하세요"
          errorMessage={errors.password}
          {...inputProps.password}
        />
      </div>
      <Button type="submit" className="w-full">
        로그인
      </Button>
    </form>
  );
};

export default SignUpForm;

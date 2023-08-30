import React from 'react';

import { useForm } from '@/hooks/useForm';
import { isPassword } from '@/lib/validator';

import { LabelInput } from '../system/LabelInput';

interface Props {
  close: () => void;
}
export function ResignModal({ close }: Props): JSX.Element {
  const { inputProps, errors } = useForm({
    inputConfigs: {
      password: {
        validate: (value) => isPassword(value),
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
    },
  });

  return (
    <div>
      <h2>회원 탈퇴하기</h2>
      <form>
        <LabelInput
          id="password"
          label="비밀번호"
          {...inputProps.password}
          errorMessage={errors.password}
        />
      </form>
      <button type="button" onClick={close}>
        취소
      </button>
    </div>
  );
}

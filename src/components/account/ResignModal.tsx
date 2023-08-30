import React from 'react';

import { useNavigate } from 'react-router-dom';

import { LabelInput } from '@/components/system/LabelInput';
import { useResignMutation } from '@/hooks/queries/auth';
import { useForm } from '@/hooks/useForm';
import { clearAccessToken } from '@/lib/apiClient';
import { isPassword } from '@/lib/validator';
import { clearUserState } from '@/store/user-store';

interface Props {
  close: () => void;
}
export function ResignModal({ close }: Props): JSX.Element {
  const navigate = useNavigate();
  const resignMutation = useResignMutation();
  const { inputProps, errors, hasError, formProps } = useForm({
    inputConfigs: {
      password: {
        validate: (value) => isPassword(value),
        errorMessage:
          '8~20자 이하의 영문 대소문자, 숫자, 특수기호를 입력하세요',
      },
    },
    formConfig: {
      onSubmit: ({ password }) => {
        resignMutation.mutate(
          { password },
          {
            onSuccess: () => {
              clearAccessToken();
              clearUserState();
              navigate('/');
            },
          },
        );
      },
    },
  });

  return (
    <div>
      <h2>회원 탈퇴하기</h2>
      <form {...formProps}>
        <LabelInput
          id="password"
          label="비밀번호"
          {...inputProps.password}
          errorMessage={errors.password}
        />
        <button type="submit" disabled={hasError}>
          회원 탈퇴
        </button>
      </form>
      <button type="button" onClick={close}>
        취소
      </button>
    </div>
  );
}

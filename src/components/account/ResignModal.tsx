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
  const { inputProps, errors, hasError, formProps, setError } = useForm({
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
            onError: (error) => {
              if (error instanceof SyntaxError) return;

              const { data } = error;
              const { statusCode, code } = data;

              if (statusCode === 400) {
                if (code === 'NOT_MATCH_PASSWORD') {
                  setError('password', '비밀번호가 일치하지 않습니다');
                }
              }
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

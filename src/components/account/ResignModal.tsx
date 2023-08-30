import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/system/Button';
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
    <div className="flex flex-col p-7 gap-4">
      <h2 className="font-medium text-lg">회원 탈퇴하기</h2>
      <form
        className="flex flex-col gap-3"
        aria-label="회원 탈퇴 폼"
        {...formProps}
      >
        <p>회원을 영구 탈퇴하려면 비밀번호를 입력하세요</p>
        <LabelInput
          id="password"
          label="비밀번호"
          required={true}
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...inputProps.password}
          errorMessage={errors.password}
        />
        <div className="flex gap-3 justify-end items-center">
          <Button variant="secondary" type="button" onClick={close}>
            취소
          </Button>
          <Button
            variant="danger"
            type="submit"
            disabled={hasError || resignMutation.isLoading}
          >
            회원 탈퇴
          </Button>
        </div>
      </form>
    </div>
  );
}

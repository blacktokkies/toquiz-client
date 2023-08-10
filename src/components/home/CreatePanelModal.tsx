import React from 'react';

import { Button } from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { useCreatePanelMutation } from '@/hooks/queries/panel';
import { useForm } from '@/hooks/useForm';
import { isPanelDescription, isPanelTitle } from '@/lib/validator';

interface Props {
  close: () => void;
}
export function CreatePanelModal({ close }: Props): JSX.Element {
  const createPanelMutation = useCreatePanelMutation();
  const { inputProps, errors, formProps, hasError } = useForm({
    inputConfigs: {
      title: {
        validate: (value) => isPanelTitle(value),
        errorMessage: '패널 제목은 3 ~ 40자이어야 합니다',
      },
      description: {
        validate: (value) => isPanelDescription(value),
        errorMessage: '패널 설명은 50자 이하여야 합니다',
      },
    },
    formConfig: {
      onSubmit: (data) => {
        const { title, description } = data;
        createPanelMutation.mutate(
          { title, description },
          {
            onSuccess: () => {
              close();
              // TODO: 해당 패널 페이지로 이동한다
            },
          },
        );
      },
    },
  });

  return (
    <div className="flex flex-col p-5 gap-4">
      <h2 className="font-medium text-xl">패널 생성하기</h2>
      <form
        className="flex flex-col gap-5"
        aria-label="패널 생성"
        {...formProps}
      >
        <LabelInput
          label="패널 제목"
          required
          placeholder="패널 제목을 입력하세요"
          aria-label="패널 제목 인풋"
          errorMessage={errors.title}
          {...inputProps.title}
        />
        <LabelInput
          label="패널 설명"
          placeholder="패널 설명을 입력하세요"
          aria-label="패널 설명 인풋"
          errorMessage={errors.description}
          {...inputProps.description}
        />
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            className="text-grey-dark bg-white hover:bg-grey-lighter font-normal"
            onClick={() => {
              close();
            }}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={hasError || createPanelMutation.isLoading}
            className="px-4 py-2"
          >
            패널 생성
          </Button>
        </div>
      </form>
    </div>
  );
}

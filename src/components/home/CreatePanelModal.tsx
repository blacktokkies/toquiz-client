import React from 'react';

import { LabelInput } from '@/components/system/LabelInput';
import { useForm } from '@/hooks/useForm';
import { isPanelTitle } from '@/lib/validator';

interface Props {
  close: () => void;
}
export function CreatePanelModal({ close }: Props): JSX.Element {
  const { inputProps, errors } = useForm({
    inputConfigs: {
      title: {
        validate: (value) => isPanelTitle(value),
        errorMessage: '패널 제목은 3 ~ 40자이어야 합니다',
      },
    },
  });

  return (
    <div>
      <h2>패널 생성하기</h2>
      <form aria-label="패널 생성" onSubmit={close}>
        <LabelInput
          label="패널 제목"
          required
          placeholder="패널 제목을 입력하세요"
          aria-label="패널 제목 인풋"
          errorMessage={errors.title}
          {...inputProps.title}
        />
        <LabelInput label="패널 설명" />
        <button
          type="button"
          onClick={() => {
            close();
          }}
        >
          취소
        </button>
        <button type="submit">패널 생성</button>
      </form>
    </div>
  );
}

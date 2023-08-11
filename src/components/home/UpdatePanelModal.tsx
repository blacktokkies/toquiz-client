import type { CreateOverlayContentProps } from '@/hooks/useOverlay';
import type { Panel } from '@/lib/api/panel';

import React from 'react';

import { Button } from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { useUpdatePanelMutation } from '@/hooks/queries/panel';
import { useForm } from '@/hooks/useForm';
import { isPanelDescription, isPanelTitle } from '@/lib/validator';

type Props = CreateOverlayContentProps & {
  panel: Panel;
};

export function UpdatePanelModal({ close, panel }: Props): JSX.Element {
  const updateMutation = useUpdatePanelMutation(panel.id);

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
      onSubmit: ({ title, description }) => {
        updateMutation.mutate(
          { title, description },
          {
            onSuccess: () => {
              close();
            },
          },
        );
      },
    },
  });

  return (
    <div className="flex flex-col p-7 gap-4">
      <h2 className="font-medium text-lg">패널 수정하기</h2>
      <form
        className="flex flex-col gap-3"
        aria-label="패널 수정"
        {...formProps}
      >
        <LabelInput
          id="panel-title"
          label="패널 제목"
          required
          placeholder="패널 제목을 입력하세요"
          aria-label="패널 제목 인풋"
          errorMessage={errors.title}
          {...inputProps.title}
          defaultValue={panel.title}
        />
        <LabelInput
          id="panel-description"
          label="패널 설명"
          placeholder="패널 설명을 입력하세요"
          aria-label="패널 설명 인풋"
          errorMessage={errors.description}
          {...inputProps.description}
          defaultValue={panel.description}
        />
      </form>
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            close();
          }}
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={hasError || updateMutation.isLoading}
          onClick={formProps.onSubmit}
        >
          패널 수정
        </Button>
      </div>
    </div>
  );
}

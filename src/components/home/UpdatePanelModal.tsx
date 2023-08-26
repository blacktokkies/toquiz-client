import type { CreateOverlayContentProps } from '@/hooks/useOverlay';
import type { Panel } from '@/lib/api/panel';

import React, { useRef } from 'react';

import { Button } from '@/components/system/Button';
import { LabelInput } from '@/components/system/LabelInput';
import { useUpdatePanelMutation } from '@/hooks/queries/panel';
import { useForm } from '@/hooks/useForm';
import { isPanelDescription, isPanelTitle } from '@/lib/validator';

type Props = CreateOverlayContentProps & {
  panel: Panel;
};

export function UpdatePanelModal({ close, panel }: Props): JSX.Element {
  const updateMutation = useUpdatePanelMutation(panel.sid);
  const messageRef = useRef<HTMLDivElement | null>(null);

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
      onSubmit: ({ title, description }, _, refs) => {
        if (title === panel.title && description === panel.description) {
          if (messageRef.current)
            messageRef.current.textContent = '※수정된 값을 입력해주세요';
          if (refs.title) refs.title.focus();
          return;
        }

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
        <div className="flex gap-3 justify-end items-center">
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
      </form>
      <div ref={messageRef} className="text-primary" />
    </div>
  );
}

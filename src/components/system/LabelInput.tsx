import type { Props as InputProps } from '@/components/system/Input';

import React, { forwardRef } from 'react';

import { Input } from '@/components/system/Input';
import { Emergency } from '@/components/vectors';

interface Props extends InputProps {
  label: string;
}

const CreateLabelInput = forwardRef<HTMLInputElement, Props>(
  function LabelInput({ id, label, required = false, ...rest }: Props, ref) {
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className="flex items-center gap-[1px] text-grey-darkest font-medium"
        >
          {label}
          {required && (
            <div role="img" aria-label="필수 입력 표시">
              <Emergency className="fill-danger h-2 w-2" />
            </div>
          )}
        </label>
        <Input ref={ref} id={id} {...rest} />
      </div>
    );
  },
);

export const LabelInput = React.memo(CreateLabelInput);

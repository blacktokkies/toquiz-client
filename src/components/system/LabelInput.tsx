import React, { forwardRef } from 'react';

import Input, { type Props as InputProps } from '@/components/system/Input';
import { Emergency } from '@/components/vectors';

interface Props extends InputProps {
  label: string;
  id?: string;
}

const LabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, required, id, ...rest }: Props, ref) => (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-grey-darkest flex items-center gap-[1px] font-medium"
      >
        {label}
        {required && <Emergency className="fill-danger h-2 w-2" />}
      </label>
      <Input id={id} {...rest} ref={ref} />
    </div>
  ),
);

LabelInput.displayName = 'LabelInput';

export default LabelInput;

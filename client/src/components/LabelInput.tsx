import React, { forwardRef } from 'react';

import Input, { type Props as InputProps } from '@/components/Input';
import { Emergency } from '@/components/vectors';

interface Props extends InputProps {
  label: string;
  id: string;
}

const LabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, required, id, ...rest }: Props, ref) => (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-off-black flex items-center gap-[1px] font-medium"
      >
        {label}
        {required && <Emergency className="fill-error-dark h-2 w-2" />}
      </label>
      <Input id={id} {...rest} />
    </div>
  ),
);

LabelInput.displayName = 'LabelInput';

export default LabelInput;

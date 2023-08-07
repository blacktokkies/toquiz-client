import React, { forwardRef } from 'react';

import Input, { type Props as InputProps } from '@/components/system/Input';
import { Emergency } from '@/components/vectors';

interface Props extends InputProps {
  label: string;
}

const LabelInput = forwardRef<HTMLInputElement, Props>(function LabelInput(
  { id, label, required = false, ...rest }: Props,
  ref,
) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-[1px] text-grey-darkest font-medium"
      >
        {label}
        {required && <Emergency className="fill-danger h-2 w-2" />}
      </label>
      <Input ref={ref} id={id} {...rest} />
    </div>
  );
});

export default React.memo(LabelInput);

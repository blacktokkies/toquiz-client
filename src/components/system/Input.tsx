import type { InputHTMLAttributes } from 'react';

import React, { forwardRef } from 'react';

import { clsx } from 'clsx';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string | null;
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { errorMessage, ...rest }: Props,
  ref,
) {
  return (
    <>
      <input
        className={clsx(
          'py-3 px-4 border border-grey-light outline-none bg-off-white',
          'text-md text-grey-darkest placeholder:text-grey',
          'hover:border-primary focus:border-primary focus:bg-white',
          'disabled:bg-grey-light disabled:hover:border-grey-light disabled:pointer-events-none',
        )}
        ref={ref}
        {...rest}
      />
      {errorMessage && <div className="text-danger px-1">{errorMessage}</div>}
    </>
  );
});

export default React.memo(Input);

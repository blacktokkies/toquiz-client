import type { InputHTMLAttributes } from 'react';

import React, { forwardRef } from 'react';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ errorMessage, ...rest }: Props, ref) => (
    <>
      <input
        className="text-md text-off-black border-grey-light focus:border-primary hover:border-primary placeholder:text-grey bg-off-white disabled:bg-grey-light disabled:hover:border-grey-light rounded-md border py-3 px-4 outline-none focus:bg-white disabled:pointer-events-none"
        ref={ref}
        {...rest}
      />
      {errorMessage && (
        <div className="text-error-dark px-1">{errorMessage}</div>
      )}
    </>
  ),
);

Input.displayName = 'Input';
export default Input;

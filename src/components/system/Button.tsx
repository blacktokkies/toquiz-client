import type { ButtonHTMLAttributes } from 'react';

import React, { forwardRef } from 'react';

const variantStyle = {
  filled: 'bg-primary',
  outlined: 'bg-white border border-primary',
} as const;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyle;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'filled', className = '', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 text-grey-darkest hover:bg-primary-hover rounded-md font-medium disabled:opacity-30 ${variantStyle[variant]} ${className}`}
      type="button"
      {...rest}
    />
  );
});

import type { ButtonHTMLAttributes } from 'react';

import React, { forwardRef } from 'react';

type Variant = 'primary' | 'secondary';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-grey-darkest font-medium',
  secondary: 'bg-white hover:bg-grey-lighter text-grey-dark font-normal',
} as const;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', className = '', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-md disabled:opacity-30 ${variantStyles[variant]} ${className}`}
      type="button"
      {...rest}
    />
  );
});

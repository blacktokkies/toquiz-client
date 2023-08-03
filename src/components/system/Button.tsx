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

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'filled', className = '', ...rest }, ref) => (
    <button
      ref={ref}
      className={`text-grey-darkest hover:bg-primary-hover min-h-[48px] min-w-[128px] rounded-md py-3 font-bold disabled:opacity-30 ${variantStyle[variant]} ${className}`}
      type="button"
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
export default Button;

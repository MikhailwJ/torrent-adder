import { clsx } from 'clsx';
import type { InputHTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ComponentColor, ComponentSize } from '../types';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  color?: ComponentColor;
  size?: ComponentSize;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ color, size, name, className, ...props }, ref): JSX.Element => {
    const classes = twMerge(
      'radio',
      className,
      clsx({
        'radio-xl': size === 'xl',
        'radio-lg': size === 'lg',
        'radio-md': size === 'md',
        'radio-sm': size === 'sm',
        'radio-xs': size === 'xs',
        'radio-primary': color === 'primary',
        'radio-secondary': color === 'secondary',
        'radio-accent': color === 'accent',
        'radio-info': color === 'info',
        'radio-success': color === 'success',
        'radio-warning': color === 'warning',
        'radio-error': color === 'error',
      }),
    );

    return <input {...props} ref={ref} type="radio" name={name} className={classes} />;
  },
);

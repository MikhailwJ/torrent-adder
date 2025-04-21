import { clsx } from 'clsx';
import type { JSX, ReactElement, SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ComponentColor, ComponentSize, ListOrItem } from '../types';

import type { SelectOptionProps } from './select-option';

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'color'> & {
  children?: ListOrItem<ReactElement<SelectOptionProps>>;
  size?: ComponentSize;
  color?: ComponentColor;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, size, color, className, ...rest }, ref): JSX.Element => {
    const classes = twMerge(
      'select',
      className,
      clsx({
        'select-xl': size === 'xl',
        'select-lg': size === 'lg',
        'select-md': size === 'md',
        'select-sm': size === 'sm',
        'select-xs': size === 'xs',
        'select-primary': color === 'primary',
        'select-secondary': color === 'secondary',
        'select-accent': color === 'accent',
        'select-ghost': color === 'ghost',
        'select-info': color === 'info',
        'select-success': color === 'success',
        'select-warning': color === 'warning',
        'select-error': color === 'error',
      }),
    );

    return (
      <select {...rest} ref={ref} className={classes}>
        {children}
      </select>
    );
  },
);
